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

Command: ``app_api:daemon:register [--net NET] [--haproxy_password HAPROXY_PASSWORD] [--compute_device COMPUTE_DEVICE] [--set-default] [--] <name> <display-name> <accepts-deploy-id> <protocol> <host> <nextcloud_url>``

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
	}

DeployConfig options
********************

	* ``net`` **[required]** - network name to bind docker container to (default: ``host``)
	* ``nextcloud_url`` **[required]** - Nextcloud URL (e.g. ``https://nextcloud.local``)
	* ``haproxy_password`` *[optional]* - password for AppAPI Docker Socket Proxy
	* ``computeDevice`` *[optional]* - Compute device to attach to the daemon (e.g. ``{ "id": "cuda", "label": "CUDA (NVIDIA)" }``)

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

There is a possibility to add additional options to the Deploy Daemon configuration,
which are key-value pairs.

Currently, the following options are available:

	- ``OVERRIDE_APP_HOST`` - can be used to override the host that will be used for ExApp binding (not passed to ExApp container envs)
