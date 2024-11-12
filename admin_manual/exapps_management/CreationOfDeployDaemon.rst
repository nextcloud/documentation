 .. _create-deploy-daemon:

Creation of Deploy Daemon
=========================

The Deploy Daemon (DaemonConfig) is used to orchestrate the deployment of ExApps.

.. note::

	Currently only ``docker-install`` and ``manual-install`` deployment methods are supported.

The recommended daemon configuration is using `AppAPI Docker Socket Proxy <https://github.com/nextcloud/docker-socket-proxy>`_.

.. image:: ./img/app_api_3.png


You can choose one of the basic configuration templates and adjust to your needs.

.. note:: We highly recommend to use UI to create Deploy Daemons.

Register Deploy daemon form
^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. ``Name``: unique name of the Deploy daemon
2. ``Display name``: the name that will be displayed in the UI
3. ``Deployment method``: by default you will need to choose ``docker_install``, ``manual_install`` is for development or custom use case of manual ExApp installation
4. ``Daemon Host``: hostname/IP address + port of the Deploy daemon
5. ``Nextcloud URL``: autofilled with current domain, you might need to change the protocol to http/https depending on your setup
6. ``Set as default daemon``: check if you want set new Deploy daemon as default
7. ``Enable https``: check if your Deploy daemon (Docker Socket Proxy) is configured with TLS
8. Deploy Config:
	9. ``Network``: Docker network name, depends on your networking setup, enforces to "host" if "Enable https" is checked
	10. ``HaProxy password``: password for Docker Socket Proxy, if it is configured with TLS
	11. ``Compute Device``: CPU, CUDA or ROCm, depending on your hardware config on Deploy daemon host machine
	12. ``Add additional option`` (see :ref:`additional_options_list`): setup additional KEY + VALUE deploy config options

.. note::

	For remote DSP setup, it should expose the ports on the host.


.. _create-deploy-daemon-cli:

OCC CLI
^^^^^^^

There are a few commands to manage Deploy Daemons:

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

In case of AppAPI installed in AIO, default Deploy Daemon is registered automatically.
It is possible to register additional Deploy Daemons with the same ways as described above.


.. _additional_options_list:

Additional options
^^^^^^^^^^^^^^^^^^

There is a possibility to add additional options to the Deploy Daemon configuration,
which are key-value pairs.

Currently, the following options are available:

	- ``OVERRIDE_APP_HOST`` - can be used to override the host that will be used for ExApp binding (not passed to ExApp container envs)
