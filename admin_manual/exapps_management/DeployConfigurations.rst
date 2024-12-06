.. _deploy-configs:

Deployment configurations
=========================

Currently, only one kind of application deployment is supported:
	* **Docker Deploy Daemon**

Docker Deploy Daemon
--------------------

Orchestrates the deployment of applications as Docker containers.

.. warning::

	The administrator is responsible for the security actions taken to configure the Docker daemon connected to the Nextcloud instance.

	These schemes are only examples of possible configurations.

	We recommend that you use the `AppAPI Docker Socket Proxy <https://github.com/nextcloud/docker-socket-proxy>`_ or `AIO Docker Socket Proxy <#nextcloud-in-docker-aio-all-in-one>`_ container.

There are several Docker Daemon Deploy configurations (example schemes):

	* Nextcloud and Docker on the **same host** (via socket or DockerSocketProxy)
	* Nextcloud on the host and Docker on a **remote** host (via DockerSocketProxy with HTTPS)
	* Nextcloud and **ExApps** in the **same Docker** (via DockerSocketProxy)
	* Nextcloud in AIO Docker and **ExApps** in the **same Docker** (via AIO DockerSocketProxy)


NC & Docker on the Same-Host
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The simplest configuration is when Nextcloud is installed on the host and Docker is on the same host and applications are deployed to it.

.. mermaid::

	stateDiagram-v2
		classDef docker fill: #1f97ee, color: transparent, font-size: 34px, stroke: #364c53, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/docker.png) no-repeat center center / contain
		classDef nextcloud fill: #006aa3, color: transparent, font-size: 34px, stroke: #045987, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/nextcloud.svg) no-repeat center center / contain
		classDef python fill: #1e415f, color: white, stroke: #364c53, stroke-width: 1px

		Host

		state Host {
			Nextcloud --> Daemon : /var/run/docker.sock
			Daemon --> Containers

			state Containers {
				ExApp1
				--
				ExApp2
				--
				ExApp3
			}
		}

		class Nextcloud nextcloud
		class Daemon docker
		class ExApp1 python
		class ExApp2 python
		class ExApp3 python

Suggested config values(template *Custom default*):
	1. Daemon host: ``/var/run/docker.sock``
	2. HTTPS checkbox: *not supported using docker socket*
	3. Network: ``host``
	4. HaProxy password: **not supported using raw docker socket, should be empty**

---

Suggested way to communicate with Docker via `Docker Socket Proxy container <https://github.com/nextcloud/docker-socket-proxy>`_.

.. mermaid::

	stateDiagram-v2
		classDef docker fill: #1f97ee, color: transparent, font-size: 34px, stroke: #364c53, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/docker.png) no-repeat center center / contain
		classDef nextcloud fill: #006aa3, color: transparent, font-size: 34px, stroke: #045987, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/nextcloud.svg) no-repeat center center / contain
		classDef python fill: #1e415f, color: white, stroke: #364c53, stroke-width: 1px

		Host

		state Host {
			Nextcloud --> DockerSocketProxy: by port
			Docker --> Containers
			Docker --> DockerSocketProxy : /var/run/docker.sock

			state Containers {
				DockerSocketProxy --> ExApp1
				DockerSocketProxy --> ExApp2
				DockerSocketProxy --> ExApp3
			}
		}

		class Nextcloud nextcloud
		class Docker docker
		class ExApp1 python
		class ExApp2 python
		class ExApp3 python

Suggested config values(template *Docker Socket Proxy*):
	1. Daemon host: ``localhost:2375``
		Choose **A** or **B** option:
			A. Docker Socket Proxy should be deployed with ``network=host`` and ``BIND_ADDRESS=127.0.0.1``
			B. Docker Socket Proxy should be deployed with ``network=bridge`` and it's port should be published to host's 127.0.0.1(e.g. **-p 127.0.0.1:2375:2375**)
	2. HTTPS checkbox: **disabled**
	3. Network: ``host``
	4. HaProxy password: **should not be empty**

.. warning::

	Be careful with option ``A``, by default **Docker Socket Proxy** binds to ``*`` if ``BIND_ADDRESS`` is not specified during container creation.
	Check opened ports after finishing configuration.


Docker on a remote host
^^^^^^^^^^^^^^^^^^^^^^^

Distributed configuration occurs when Nextcloud is installed on one host and Docker is located on a remote host, resulting in the deployment of applications on the remote host.

Benefit: no performance impact on Nextcloud host.

In this case, the AppAPI uses a Docker Socket Proxy deployed on remote host to access docker socket and ExApps.

.. mermaid::

	stateDiagram-v2
		classDef docker fill: #1f97ee, color: transparent, font-size: 34px, stroke: #364c53, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/docker.png) no-repeat center center / contain
		classDef nextcloud fill: #006aa3, color: transparent, font-size: 34px, stroke: #045987, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/nextcloud.svg) no-repeat center center / contain
		classDef python fill: #1e415f, color: white, stroke: #364c53, stroke-width: 1px

		Direction LR

			Host1 --> Host2 : by port

		state Host1 {
			Nextcloud
		}

		state Host2 {
			[*] --> DockerSocketProxy : by port
			Daemon --> Containers

			state Containers {
				[*] --> DockerSocketProxy : /var/run/docker.sock
				DockerSocketProxy --> ExApp1
				DockerSocketProxy --> ExApp2
				DockerSocketProxy --> ExApp3
			}
		}

		class Nextcloud nextcloud
		class Daemon docker
		class ExApp1 python
		class ExApp2 python
		class ExApp3 python

Suggested config values(template *Docker Socket Proxy*):
	1. Daemon host: ADDRESS_OF_REMOTE_MACHINE (e.g. **server_name.com:2375**)
	2. HTTPS checkbox: ``enabled``
	3. Network: ``host``
	4. HaProxy password: **should not be empty**

NC & ExApps in the same Docker
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Applications are deployed in the same Docker where Nextcloud resides.

Suggested way to communicate with Docker: via ``docker-socket-proxy``.

.. mermaid::

	stateDiagram-v2
		classDef docker fill: #1f97ee, color: transparent, font-size: 34px, stroke: #364c53, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/docker.png) no-repeat center center / contain
		classDef nextcloud fill: #006aa3, color: transparent, font-size: 34px, stroke: #045987, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/nextcloud.svg) no-repeat center center / contain
		classDef python fill: #1e415f, color: white, stroke: #364c53, stroke-width: 1px

		Host

		state Host {
			Daemon --> Containers

			state Containers {
				[*] --> DockerSocketProxy : /var/run/docker.sock
				Nextcloud --> DockerSocketProxy: by port
				--
				DockerSocketProxy --> ExApp1
				DockerSocketProxy --> ExApp2
			}
		}

		class Nextcloud nextcloud
		class Daemon docker
		class ExApp1 python
		class ExApp2 python
		class ExApp3 python

Suggested config values(template *Docker Socket Proxy*):
	1. Daemon host: nextcloud-appapi-dsp:2375
	2. HTTPS checkbox: ``disabled``
	3. Network: `user defined network <https://docs.docker.com/network/#user-defined-networks>`_
	4. HaProxy password: **should not be empty**

.. note::
	Network **should not be the default docker's bridge** as it does not support DNS resolving by container names.

	This means that **Docker Socket Proxy**, **Nextcloud** and **ExApps** containers should all be in the same docker network, different from the default **bridge**.


.. _nextcloud-in-docker-aio-all-in-one:

Nextcloud in Docker AIO (all-in-one)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In the case of AppAPI in Docker AIO setup (installed in Nextcloud container).

.. note::

	AIO Docker Socket Proxy container must be enabled.

.. mermaid::

	stateDiagram-v2
		classDef docker fill: #1f97ee, color: transparent, font-size: 34px, stroke: #364c53, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/docker.png) no-repeat center center / contain
		classDef docker2 fill: #1f97ee, color: transparent, font-size: 20px, stroke: #364c53, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/docker.png) no-repeat center center / contain
		classDef nextcloud fill: #006aa3, color: transparent, font-size: 34px, stroke: #045987, stroke-width: 1px, background: url(https://raw.githubusercontent.com/nextcloud/app_api/main/docs/img/nextcloud.svg) no-repeat center center / contain
		classDef python fill: #1e415f, color: white, stroke: #364c53, stroke-width: 1px

		Host

		state Host {
			Daemon --> Containers

			state Containers {
				[*] --> NextcloudAIOMasterContainer : /var/run/docker.sock
				[*] --> DockerSocketProxy : /var/run/docker.sock
				NextcloudAIOMasterContainer --> Nextcloud
				AppAPI --> Nextcloud : installed in
				Nextcloud --> DockerSocketProxy
				DockerSocketProxy --> ExApp1
				DockerSocketProxy --> ExApp2
				DockerSocketProxy --> ExApp3
			}
		}

		class Nextcloud nextcloud
		class Daemon docker
		class Daemon2 docker2
		class ExApp1 python
		class ExApp2 python
		class ExApp3 python

AppAPI will automatically create the default DaemonConfig for AIO Docker Socket Proxy in order to use it as an orchestrator to create ExApp containers.

.. note::

	Default DaemonConfig will be created only if the default DaemonConfig is not already registered.


Default AIO Deploy Daemon
*************************

Nextcloud AIO has a specifically created Docker Socket Proxy container to be used as the Deploy Daemon in AppAPI.
It has `fixed parameters <https://github.com/nextcloud/app_api/blob/main/lib/DeployActions/AIODockerActions.php#L52-L74)>`_:

* Name: ``docker_aio``
* Display name: ``AIO Docker Socket Proxy``
* Accepts Deploy ID: ``docker-install``
* Protocol: ``http``
* Host: ``nextcloud-aio-docker-socket-proxy:2375``
* Compute device: ``CPU``
* Network: ``nextcloud-aio``
* Nextcloud URL (passed to ExApps): ``https://$NC_DOMAIN``

Docker Socket Proxy security
****************************

AIO Docker Socket Proxy has strictly limited access to the Docker APIs described in `HAProxy configuration <https://github.com/nextcloud/all-in-one/blob/main/Containers/docker-socket-proxy/haproxy.cfg>`_.


NC to ExApp Communication
-------------------------

Each type of DeployDaemon necessarily implements the ``resolveExAppUrl`` function.

It has the prototype:

.. code-block:: php

	public function resolveExAppUrl(
		string $appId, string $protocol, string $host, array $deployConfig, int $port, array &$auth
	) {}

where:

* **protocol** is daemon protocol value
* **host** is daemon host value, *can be DNS:port or IP:PORT or even path to docker socket*.
* **port** is an integer with ExApp port
* **deployConfig** can be custom for each Daemon type
* **auth** is an optional array, with *Basic Authentication* data if needed to access ExApp

.. note::

	The optional additional parameter *OVERRIDE_APP_HOST* can be used to
	override the host that will be used for ExApp binding.

	It can be ``0.0.0.0`` in some specific configurations, when VPN is used
	or both Nextcloud instance and ExApps are one the same physical machine but different virtual environments.

	Also you can specify something like ``10.10.2.5`` and in this case ``ExApp`` will try to bind to that address and
	AppAPI will try to send request s directly to this address assuming that ExApp itself bound on it.

The simplest implementation is in the **Manual-Install** deploy type:

.. code-block:: php

	public function resolveExAppUrl(
		string $appId, string $protocol, string $host, array $deployConfig, int $port, array &$auth
	): string {
		$auth = [];
		if (isset($deployConfig['additional_options']['OVERRIDE_APP_HOST']) &&
			$deployConfig['additional_options']['OVERRIDE_APP_HOST'] !== ''
		) {
			$wideNetworkAddresses = ['0.0.0.0', '127.0.0.1', '::', '::1'];
			if (!in_array($deployConfig['additional_options']['OVERRIDE_APP_HOST'], $wideNetworkAddresses)) {
				$host = $deployConfig['additional_options']['OVERRIDE_APP_HOST'];
			}
		}
		return sprintf('%s://%s:%s', $protocol, $host, $port);
	}

Here we see that AppAPI sends requests to the **host**:**port** specified during daemon creation.

Now, let's take a look at the Docker Daemon implementation of ``resolveExAppUrl``:

.. code-block:: php

	public function resolveExAppUrl(
		string $appId, string $protocol, string $host, array $deployConfig, int $port, array &$auth
	): string {
		$auth = [];
		if (isset($deployConfig['additional_options']['OVERRIDE_APP_HOST']) &&
			$deployConfig['additional_options']['OVERRIDE_APP_HOST'] !== ''
		) {
			$wideNetworkAddresses = ['0.0.0.0', '127.0.0.1', '::', '::1'];
			if (!in_array($deployConfig['additional_options']['OVERRIDE_APP_HOST'], $wideNetworkAddresses)) {
				return sprintf(
					'%s://%s:%s', $protocol, $deployConfig['additional_options']['OVERRIDE_APP_HOST'], $port
				);
			}
		}
		$host = explode(':', $host)[0];
		if ($protocol == 'https') {
			$exAppHost = $host;
		} elseif (isset($deployConfig['net']) && $deployConfig['net'] === 'host') {
			$exAppHost = 'localhost';
		} else {
			$exAppHost = $appId;
		}
		if (isset($deployConfig['haproxy_password']) && $deployConfig['haproxy_password'] !== '') {
			$auth = [self::APP_API_HAPROXY_USER, $deployConfig['haproxy_password']];
		}
		return sprintf('%s://%s:%s', $protocol, $exAppHost, $port);
	}

Here we have much more complex algorithm of detecting to where requests should be send.

First of all, if the protocol is set to ``https``, AppAPI always sends requests to the daemon host,
and in this case, it is a HaProxy that will forward requests to ExApps that will be listening on ``localhost``.

Briefly, it will look like this (*haproxy_host==daemon host value*):

NC --> *https* --> ``haproxy_host:ex_app_port`` --> *http* --> ``localhost:ex_app_port``

When the protocol is not ``https`` but ``http``, then what will be the endpoint where to send requests is determined by ``$deployConfig['net']`` value.

If ``net`` is defined and equal to ``host``, then AppAPI assumes that ExApp is installed somewhere in the current host network and will be available on ``localhost`` loop-back adapter.

NC --> *http* --> ``localhost:ex_app_port``

In all other cases, the ExApp should be available by it's name: e.g. when using docker **custom bridge** network all containers available by DNS.

NC --> *http* --> ``app_container_name:ex_app_port``

These three different types of communication cover most popular configurations.
