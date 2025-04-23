 .. _managing-deploy-daemons:

Managing Deploy Daemons
=======================

OCC CLI
^^^^^^^

There are a few OCC CLI commands to manage Deploy Daemons:

1. Register ``occ app_api:daemon:register``
2. Unregister ``occ app_api:daemon:unregister``
3. List registered daemons ``occ app_api:daemon:list``

Register
--------

Register Deploy Daemon (DaemonConfig).

Command: ``app_api:daemon:register [--net NET] [--haproxy_password HAPROXY_PASSWORD] [--compute_device COMPUTE_DEVICE] [--set-default] [--harp] [--harp_frp_address HARP_FRP_ADDRESS] [--harp_shared_key HARP_SHARED_KEY] [--harp_docker_socket_port HARP_DOCKER_SOCKET_PORT] [--harp_exapp_direct] [--] <name> <display-name> <accepts-deploy-id> <protocol> <host> <nextcloud_url>``

Arguments
*********

* ``name`` - unique name of the daemon (e.g. ``docker_local_sock``)
* ``display-name`` - name of the daemon (e.g. ``My Local Docker``, will be displayed in the UI)
* ``accepts-deploy-id`` - type of deployment (``docker-install`` or ``manual-install``)
* ``host`` - **path to docker-socket**  or the Docker Socket Proxy: ``address:port``
* ``protocol`` - protocol used to communicate with the Daemon/ExApps (``http`` or ``https``)
* ``nextcloud_url`` - Nextcloud URL, Daemon config required option (e.g. ``https://nextcloud.local``)

Options
*******

* ``--net [network-name]``  - ``[required]`` network name to bind docker container to (default: ``host``)
* ``--haproxy_password HAPROXY_PASSWORD`` - ``[optional]`` password for AppAPI Docker Socket Proxy
* ``--compute_device GPU`` - ``[optional]`` GPU device to expose to the daemon (e.g. ``cpu|cuda|rocm``, default: ``cpu``)
* ``--set-default`` - ``[optional]`` set created daemon as default for ExApps installation
* ``--harp`` - ``[optional]`` Flag to set daemon to use HaRP for all docker and exapp communication
* ``--harp_frp_address`` - ``[optional]`` [host]:[port] of the HaRP FRP server, default host is same as HaRP host and port is 8782
* ``--harp_shared_key`` - ``[optional]`` HaRP shared key for secure communication between HaRP and AppAPI
* ``--harp_docker_socket_port`` - ``[optional]`` 'remotePort' of the FRP client of the remote docker socket proxy. There is one included in the harp container so this can be skipped for default setups. (default: "24000")
* ``--harp_exapp_direct`` - ``[optional]`` Flag for the advanced setups only. Disables the FRP tunnel between ExApps and HaRP.

Usage Examples
**************

* Register a HaRP deploy daemon within the ``nextcloud`` docker network, with the ``appapi-harp`` container as the host and the ``appapi-harp:8782`` as the FRP server address. This can be paired with a HaRP container running in the same network.

	.. code-block:: bash

		occ app_api:daemon:register harp_proxy_docker "Harp Proxy (Docker)" "docker-install" "http" "appapi-harp:8780" "http://nextcloud.local" --net nextcloud --harp --harp_frp_address "appapi-harp:8782" --harp_shared_key "some_very_secure_password" --set-default --compute_device=cuda

* Register a HaRP deploy daemon with the ``localhost`` as the host and the ``localhost:8782`` as the FRP server address. This can be paired with a HaRP container running in the host network mode or has exposed the ports ``8780`` and ``8782`` to the host.

	.. code-block:: bash

		app_api:daemon:register harp_proxy_host "Harp Proxy (Host)" "docker-install" "http" "localhost:8780" "http://nextcloud.local" --harp --harp_frp_address "localhost:8782" --harp_shared_key "some_very_secure_password" --set-default --compute_device=cuda

* Register a manual install deploy daemon with HaRP support. This can be paired with a HaRP container running in the same network. The HaRP container need not have access to a docker socket or any other ports exposed to the host. It will not create docker containers of the ExApps but will only proxy the requests to the ExApp process manually launched by the user.

	.. note::
		| The ExApp process should have a FRP Client (frpc) running in the same network as the HaRP container or should be able to connect to the ports exposed by the HaRP container.
		| If the communication has to go without the FRP client, the ``--harp_exapp_direct`` flag should be provided. The localhost IP address is always used as the host in this case for manual deployments and ``OVERRIDE_APP_HOST`` or the ``<app_id>`` is used for ExApp deployments. Take care not to use the host network mode or the default bridge network for this.

	.. code-block:: bash

		app_api:daemon:register manual_install_harp "Harp Manual Install" "manual-install" "http" "appapi-harp:8780" "http://nextcloud.local" --net nextcloud --harp --harp_frp_address "appapi-harp:8782" --harp_shared_key "some_very_secure_password"

* Register a Docker Socket Proxy deploy daemon with the ``nextcloud-appapi-dsp:2375`` as the host and the ``nextcloud`` docker network. This can be paired with a Docker Socket Proxy container running in the same network with the default port ``2375``.

	.. code-block:: bash

		app_api:daemon:register docker_install "Docker Socket Proxy" "docker-install" "http" "nextcloud-appapi-dsp:2375" "http://nextcloud.local" --net=nextcloud --set-default --compute_device=cuda

* Register a manual deploy daemon with ``host.docker.internal`` as the host used to connect to the ExApps.

	.. code-block:: bash

		app_api:daemon:register manual_install "Manual Install" "manual-install" "http" null "http://nextcloud.local"

* Register a local docker deploy daemon with the ``/var/run/docker.sock`` as the socket and the host, and the ``nextcloud`` docker network. This does not need a Docker Socket Proxy container. The compute device used by this daemon is ``CPU``.

	.. code-block:: bash

		app_api:daemon:register local_docker "Docker Local" "docker-install" "http" "/var/run/docker.sock" "http://nextcloud.local" --net=nextcloud

* Register a local docker deploy daemon with the ``/var/run/docker.sock`` as the socket and the host, and the ``nextcloud`` docker network. This does not need a Docker Socket Proxy container. The compute device used by this daemon is ``CUDA`` (NVIDIA).

	.. code-block:: bash

		app_api:daemon:register local_docker "Docker Local" "docker-install" "http" "/var/run/docker.sock" "http://nextcloud.local" --net=nextcloud --set-default --compute_device=cuda


DeployConfig
************

DeployConfig is a set of additional options in Daemon config, which are used in deployment algorithms to configure
ExApp container.

.. code-block:: json

	{
		"net": "host",
		"nextcloud_url": "https://nextcloud.local",
		"haproxy_password": "some_secure_password",
		"computeDevice": {
			"id": "cuda",
			"name": "CUDA (NVIDIA)",
		},
		"harp": {
			"frp_address": "localhost:8782",
			"docker_socket_port": "24000",
			"exapp_direct": false
		}
	}

DeployConfig options
********************

	* ``net`` **[required]** - network name to bind docker container to (default: ``host``)
	* ``nextcloud_url`` **[required]** - Nextcloud URL (e.g. ``https://nextcloud.local``)
	* ``haproxy_password`` *[optional]* - password for AppAPI Docker Socket Proxy
	* ``computeDevice`` *[optional]* - Compute device to attach to the daemon (e.g. ``{ "id": "cuda", "label": "CUDA (NVIDIA)" }``)
	* ``harp`` *[optional]* - HaRP options, can be ``null`` in case of non-HaRP setups
		* ``frp_address`` *[optional]* - [host]:[port] of the HaRP FRP server, default host is same as HaRP host and port is 8782
		* ``docker_socket_port`` *[optional]* - 'remotePort' of the FRP client of the remote docker socket proxy. There is one included in the harp container so this can be skipped for default setups. [default: "24000"]
		* ``exapp_direct`` *[optional]* - Flag for the advanced setups only. Disables the FRP tunnel between ExApps and HaRP.

Unregister
----------

Unregister Deploy Daemon (DaemonConfig).

Command: ``app_api:daemon:unregister <daemon-config-name>``

List registered daemons
-----------------------

List registered Deploy Daemons (DaemonConfigs).

Command: ``app_api:daemon:list``

Nextcloud AIO
^^^^^^^^^^^^^

In the case of AppAPI installed in AIO, a default Deploy Daemon is registered automatically.
It is possible to register additional Deploy Daemons using the same methods as described above.


.. _additional_options_list:

Additional options
^^^^^^^^^^^^^^^^^^

| There is a possibility to add additional options to the Deploy Daemon configuration, which are key-value pairs.
| This should not be used for HaRP.

Currently, the following options are available:

	- ``OVERRIDE_APP_HOST`` - can be used to override the host that will be used for ExApp binding (not passed to ExApp container envs)
