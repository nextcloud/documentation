Autoscaling with KEDA
=====================

This section explains how to set up `KEDA <https://keda.sh/>`__ to auto-scale ExApp pods
(using the `llm2 <https://docs.nextcloud.com/server/latest/admin_manual/ai/app_llm2.html>`_ app as an example)
based on the Nextcloud TaskProcessing queue depth.

Prerequisites
-------------

-  A working Nextcloud + HaRP + k8s setup (see
   :ref:`scaling-kubernetes-setup`)
-  An ExApp deployed and running (e.g. ``llm2`` with deployment name
   ``nc-app-llm2``)
-  ``kubectl`` configured and pointing to the cluster
-  ``helm`` installed (`install
   guide <https://helm.sh/docs/intro/install/>`__)
-  For GPU ExApps: the daemon must be registered with
   ``--compute_device=cuda``

Architecture overview
---------------------

.. mermaid::

   graph TB
      Users[Users submit tasks] --> Nextcloud["Nextcloud TaskProcessing Queue
         (scheduled + running tasks)"]
      Nextcloud -->|"GET /ocs/v2.php/taskprocessing/queue_stats
         Auth: Basic (admin app_password)"| KEDA["KEDA (metrics-api-server in k8s)"]
      KEDA -->|"polls every pollingInterval (e.g. 15s)
         scaling deployment based on queue depth"| deployment["nc-app-llm2 deployment (1..N pods)
         Each pod independently calls next_task()"]

KEDA uses a ``metrics`` trigger (HTTP polling) to query Nextcloud
``queue_stats`` endpoint.
When the queue grows, KEDA scales up the ExApp deployment.
When the queue reduces in size, KEDA scales back down.

--------------

0. GPU Setup (kind cluster)
---------------------------

If your ExApp requires a GPU (e.g. llm2), you must set up GPU passthrough in
the kind cluster.

0.1 Configure Docker on the host
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: bash

   sudo nvidia-ctk runtime configure --runtime=docker --set-as-default --cdi.enabled
   sudo nvidia-ctk config --set accept-nvidia-visible-devices-as-volume-mounts=true --in-place
   sudo systemctl restart docker

0.2 Create kind cluster with GPU support
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: yaml

   # kind-gpu-config.yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
     - role: control-plane
       extraMounts:
         - hostPath: /dev/null
           containerPath: /var/run/nvidia-container-devices/all

.. code:: bash

   kind create cluster --name nc-exapps --config kind-gpu-config.yaml

0.3 Install nvidia-container-toolkit inside the kind node
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: bash

   docker exec nc-exapps-control-plane bash -c '
   apt-get update -y && apt-get install -y gnupg2 curl &&
   curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
     gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg &&
   curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
     sed "s#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g" \
     > /etc/apt/sources.list.d/nvidia-container-toolkit.list &&
   apt-get update && apt-get install -y nvidia-container-toolkit
   '

0.4 Configure containerd and restart
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: bash

   docker exec nc-exapps-control-plane bash -c '
   nvidia-ctk runtime configure --runtime=containerd --set-as-default &&
   systemctl restart containerd
   '

0.5 Install NVIDIA device plugin
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default, if a Deploy daemon is configured with multiple GPUs,
AppAPI will attach one ExApp container/pod per GPU.
In order to create multiple pods that share a single GPU,
**time-slicing** must be configured for the GPU device plugin.

.. note::

	All ExApps registered on the same Deploy daemon will share the same GPU resources.
	For ExApps that require heavy use of GPUs,
	it is recommended to have a separate Deploy daemon (host) for each of them.

First create a ConfigMap with the number of replicas (virtual GPUs):

.. code:: bash

   cat <<'EOF' | kubectl apply -f -
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: nvidia-device-plugin-config
     namespace: kube-system
   data:
     config.yaml: |
       version: v1
       sharing:
         timeSlicing:
           renameByDefault: false
           resources:
             - name: nvidia.com/gpu
               replicas: 4
   EOF

Then deploy the device plugin with the config:

.. code:: bash

   cat <<'EOF' | kubectl apply -f -
   apiVersion: apps/v1
   kind: DaemonSet
   metadata:
     name: nvidia-device-plugin-daemonset
     namespace: kube-system
   spec:
     selector:
       matchLabels:
         name: nvidia-device-plugin-ds
     template:
       metadata:
         labels:
           name: nvidia-device-plugin-ds
       spec:
         tolerations:
           - key: nvidia.com/gpu
             operator: Exists
             effect: NoSchedule
         priorityClassName: system-node-critical
         containers:
           - image: nvcr.io/nvidia/k8s-device-plugin:v0.17.0
             name: nvidia-device-plugin-ctr
             args: ["--config-file=/config/config.yaml"]
             env:
               - name: FAIL_ON_INIT_ERROR
                 value: "false"
             securityContext:
               allowPrivilegeEscalation: false
               capabilities:
                 drop: ["ALL"]
             volumeMounts:
               - name: device-plugin
                 mountPath: /var/lib/kubelet/device-plugins
               - name: plugin-config
                 mountPath: /config
         volumes:
           - name: device-plugin
             hostPath:
               path: /var/lib/kubelet/device-plugins
           - name: plugin-config
             configMap:
               name: nvidia-device-plugin-config
               items:
                 - key: config.yaml
                   path: config.yaml
   EOF

0.6 Verify GPU is visible
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: bash

   kubectl get nodes -o json | python3 -c "
   import json,sys
   for n in json.load(sys.stdin)['items']:
       gpu = n['status']['capacity'].get('nvidia.com/gpu','N/A')
       print(f'{n[\"metadata\"][\"name\"]}: nvidia.com/gpu = {gpu}')
   "

Expected: ``nvidia.com/gpu = 4`` (or your configured replicas count
multiplied by the number of available physical GPUs).

0.7 Test GPU from a pod
~~~~~~~~~~~~~~~~~~~~~~~

.. code:: bash

   kubectl run gpu-test --image=nvidia/cuda:12.6.3-base-ubuntu24.04 --restart=Never \
     --overrides='{"spec":{"containers":[{"name":"gpu-test","image":"nvidia/cuda:12.6.3-base-ubuntu24.04","command":["nvidia-smi"],"resources":{"limits":{"nvidia.com/gpu":"1"}}}]}}' \
     -n nextcloud-exapps
   sleep 30 && kubectl logs gpu-test -n nextcloud-exapps
   kubectl delete pod gpu-test -n nextcloud-exapps

--------------

1. Install KEDA
---------------

.. code:: bash

   helm repo add kedacore https://kedacore.github.io/charts
   helm repo update
   helm install keda kedacore/keda --namespace keda --create-namespace

Verify:

.. code:: bash

   kubectl get pods -n keda
   # All pods should be Running

2. DNS setup (kind only)
------------------------

KEDA pods need to resolve ``nextcloud.local``. **HaRP does this
automatically now** — when ``HP_K8S_HOST_ALIASES`` is set, HaRP patches
the CoreDNS ``ConfigMap`` on startup and restarts CoreDNS so that every
pod in the cluster (including KEDA) can resolve the configured
hostnames.

If you need to do it manually (or verify), the commands are:

.. code:: bash

   # Get the nginx proxy IP
   PROXY_IP=$(docker inspect master-proxy-1 \
     --format '{{(index .NetworkSettings.Networks "master_default").IPAddress}}')
   echo "Proxy IP: $PROXY_IP"

   # Write the Corefile with the correct IP
   cat > /tmp/Corefile << EOF
   .:53 {
       errors
       health {
          lameduck 5s
       }
       ready
       kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          fallthrough in-addr.arpa ip6.arpa
          ttl 30
       }
       prometheus :9153
       hosts {
              ${PROXY_IP} nextcloud.local
              fallthrough
           }
           forward . /etc/resolv.conf {
          max_concurrent 1000
       }
       cache 30
       loop
       reload
       loadbalance
   }
   EOF

   kubectl create configmap coredns -n kube-system \
     --from-file=Corefile=/tmp/Corefile \
     --dry-run=client -o yaml | kubectl apply -f -

   kubectl rollout restart deployment coredns -n kube-system

Verify:

.. code:: bash

   kubectl run dns-test --rm -i --restart=Never --image=busybox -- nslookup nextcloud.local

3. Create a Nextcloud App Password
----------------------------------

KEDA needs credentials to poll the ``queue_stats`` endpoint. The
endpoint is admin-only.

1. Log in to Nextcloud as admin
2. Go to **Settings > Security > Devices & sessions**
3. Enter a name (e.g. ``keda-scaler``) and click **Create new app
   password**
4. Copy the password into a **.env** file

.. code:: bash

   # .env
   NC_USER="admin"
   NC_APP_PASSWORD="<the-app-password-you-created>"
   NC_URL="https://nextcloud.local"

Verify:

.. code:: bash

   source .env
   curl -s -k -u "${NC_USER}:${NC_APP_PASSWORD}" \
     "${NC_URL}/ocs/v2.php/taskprocessing/queue_stats?format=json"

Expected:

.. code:: json

   {"ocs":{"meta":{"status":"ok","statuscode":200,"message":"OK"},"data":{"scheduled_count":0,"running_count":0}}}

4. Create k8s secret
--------------------

.. code:: bash

   kubectl create secret generic nextcloud-keda-auth \
     --namespace=nextcloud-exapps \
     --from-literal=username="${NC_USER}" \
     --from-literal=password="${NC_APP_PASSWORD}"

5. Create KEDA TriggerAuthentication
------------------------------------

.. code:: bash

   cat <<'EOF' | kubectl apply -f -
   apiVersion: keda.sh/v1alpha1
   kind: TriggerAuthentication
   metadata:
     name: nextcloud-auth
     namespace: nextcloud-exapps
   spec:
     secretTargetRef:
       - parameter: username
         name: nextcloud-keda-auth
         key: username
       - parameter: password
         name: nextcloud-keda-auth
         key: password
   EOF

6. Create KEDA ScaledObject
---------------------------

.. note::

   Nextcloud OCS returns XML by default. Always include ``format=json`` in the URL.

Task type filter
~~~~~~~~~~~~~~~~

llm2 registers many task types. Use a comma-separated list to scale on
all of them:

::

   ?taskTypeId=core:text2text,core:text2text:chat,core:text2text:summary,core:text2text:headline,core:text2text:topics,core:text2text:simplification,core:text2text:reformulation,core:contextwrite,core:text2text:changetone,core:text2text:chatwithtools,core:text2text:proofread

Apply
~~~~~

.. code:: yaml

   # keda-llm2-scaler.yaml
   apiVersion: keda.sh/v1alpha1
   kind: ScaledObject
   metadata:
     name: llm2-scaler
     namespace: nextcloud-exapps
   spec:
     scaleTargetRef:
       name: nc-app-llm2
     pollingInterval: 15
     cooldownPeriod: 120
     initialCooldownPeriod: 60
     minReplicaCount: 1
     maxReplicaCount: 4
     triggers:
       - type: metrics-api
         metadata:
           url: "https://nextcloud.local/ocs/v2.php/taskprocessing/queue_stats?format=json&taskTypeId=core:text2text,core:text2text:chat,core:text2text:summary"
           valueLocation: "ocs.data.scheduled_count"
           targetValue: "5"
           authMode: "basic"
           unsafeSsl: "true"
         authenticationRef:
           name: nextcloud-auth

.. code:: bash

   kubectl apply -f keda-llm2-scaler.yaml

Scaling formula
~~~~~~~~~~~~~~~

::

   desiredReplicas = ceil( metricValue / targetValue )

=============== ============= ===================
Scheduled tasks targetValue=5 Result
=============== ============= ===================
0               \-            1 (minReplicaCount)
3               ceil(3/5)=1   1 pod
12              ceil(12/5)=3  3 pods
50              ceil(50/5)=10 4 (capped at max)
=============== ============= ===================

7. Verify and Monitor
---------------------

Quick status
~~~~~~~~~~~~

.. code:: bash

   kubectl get scaledobject -n nextcloud-exapps && echo && \
   kubectl get deploy nc-app-llm2 -n nextcloud-exapps && echo && \
   kubectl get pods -n nextcloud-exapps -l app=nc-app-llm2 -o wide

-  ``READY=True`` - KEDA can reach the metrics endpoint
-  ``ACTIVE=False`` - no tasks queued
-  ``AVAILABLE=1`` - one pod running (minReplicaCount)

Watch scaling live
~~~~~~~~~~~~~~~~~~

.. code:: bash

   # Terminal 1: pods
   kubectl get pods -n nextcloud-exapps -l app=nc-app-llm2 -w

   # Terminal 2: deployment
   kubectl get deploy nc-app-llm2 -n nextcloud-exapps -w

   # Terminal 3: KEDA logs
   kubectl logs -n keda -l app=keda-operator -f --tail=5

Check HPA (KEDA creates this)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: bash

   kubectl get hpa -n nextcloud-exapps
   kubectl describe hpa -n nextcloud-exapps

Full dashboard
~~~~~~~~~~~~~~

.. code:: bash

   echo "=== ScaledObject ===" && \
   kubectl get scaledobject -n nextcloud-exapps && echo && \
   echo "=== HPA ===" && \
   kubectl get hpa -n nextcloud-exapps && echo && \
   echo "=== Deployment ===" && \
   kubectl get deploy nc-app-llm2 -n nextcloud-exapps && echo && \
   echo "=== Pods ===" && \
   kubectl get pods -n nextcloud-exapps -l app=nc-app-llm2 -o wide && echo && \
   echo "=== Queue ===" && \
   curl -s -k -u "${NC_USER}:${NC_APP_PASSWORD}" \
     "${NC_URL}/ocs/v2.php/taskprocessing/queue_stats?format=json"

--------------

Tuning Guide
------------

+---------------------------+---------+---------+-------------------------------------+
| Parameter                 | Example | Default | What it does                        |
+===========================+=========+=========+=====================================+
| ``pollingInterval``       | 15      | 30      | Seconds between polls.              |
|                           |         |         | Lower = faster reaction             |
+---------------------------+---------+---------+-------------------------------------+
| ``cooldownPeriod``        | 120     | 300     | Seconds to wait before scaling down |
+---------------------------+---------+---------+-------------------------------------+
| ``initialCooldownPeriod`` | 60      | 0       | Wait after new pod starts. Set to   |
|                           |         |         | 60 for LLM model loading time       |
+---------------------------+---------+---------+-------------------------------------+
| ``minReplicaCount``       | 1       | 0       | Min pods. Must be 1+ (AppAPI needs  |
|                           |         |         | at least one pod for heartbeat)     |
+---------------------------+---------+---------+-------------------------------------+
| ``maxReplicaCount``       | 4       | 100     | Max pods. Match your GPU count or   |
|                           |         |         | time-slicing replicas               |
+---------------------------+---------+---------+-------------------------------------+
| ``targetValue``           | 5       | \-      | Tasks per pod.                      |
|                           |         |         | Lower = more pods sooner            |
+---------------------------+---------+---------+-------------------------------------+

GPU time-slicing notes
~~~~~~~~~~~~~~~~~~~~~~

-  One physical GPU can be shared by multiple pods using NVIDIA
   time-slicing
-  Each llm2 pod uses about 8GB VRAM (model dependent)
-  RTX 5090 (32GB): can run 3-4 pods with time-slicing replicas=4
-  RTX 4090 (24GB): can run 2-3 pods with time-slicing replicas=3
-  Set ``maxReplicaCount`` to match your time-slicing replicas
-  CUDA gives each pod equal GPU time

LLM notes
~~~~~~~~~

-  Model loading takes 30-60s. New pods are not ready right away
-  Use ``initialCooldownPeriod`` to avoid over-scaling during warmup
-  PVC access mode is ``ReadWriteOnce``. Works on single-node only
-  Multi-node clusters are not supported yet

--------------

Cleanup
-------

.. code:: bash

   # Remove KEDA ScaledObject
   kubectl delete scaledobject llm2-scaler -n nextcloud-exapps

   # Remove auth resources
   kubectl delete triggerauthentication nextcloud-auth -n nextcloud-exapps
   kubectl delete secret nextcloud-keda-auth -n nextcloud-exapps
