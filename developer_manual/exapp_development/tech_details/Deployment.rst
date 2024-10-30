.. _app_deployment:

Deployment
==========

Overview
--------

The ExApp deployment process consists of 2 steps:

1. `DaemonConfig registration`_
2. `ExApp registration`_

.. _occ_daemon_config_registration:

DaemonConfig registration
-------------------------

The first step is to register DaemonConfig, where your ExApps will be deployed.
Before that, you will need to configure your Docker socket to be accessible by Nextcloud instance and webserver user.
If you use the remote Docker Engine API, you will need to expose it so it is accessible by Nextcloud instance and import certificates.

.. note::
	For now, only the Docker daemon ``accepts-deploy-id: docker-install`` is supported.
	For development and manually deployed apps in Docker, there is ``accepts-deploy-id: manual-install``.

This can be done by the ``occ`` **app_api:daemon:register** command:

.. code-block:: bash

	app_api:daemon:register <name> <display-name> <accepts-deploy-id> <protocol> <host> <nextcloud_url> [--net NET] [--haproxy_password PASSWORD] [--]

Arguments
*********

	* ``name`` - unique name of the daemon (e.g. ``docker_local_sock``)
	* ``display-name`` - name of the daemon (e.g. ``My Local Docker``, will be displayed in the UI)
	* ``accepts-deploy-id`` - type of deployment (``docker-install`` or ``manual-install``)
	* ``protocol`` - protocol used to connect to the daemon (``http`` or ``https``)
	* ``host`` - host of the daemon (e.g. ``/var/run/docker.sock`` or ``host:port``)
	* ``nextcloud_url`` - Nextcloud URL, Daemon config required option (e.g. ``https://nextcloud.local``)

Options
*******

	* ``--net [network-name]``  - ``[required]`` network name to bind docker container to (default: ``host``)
	* ``--haproxy_password PASSWORD`` - ``[optional]`` password if ``AppAPI Docker Socket Proxy`` is used
	* ``--gpu`` - ``[optional]`` GPU device to expose to the daemon (e.g. ``/dev/dri``)

.. note::
	Common configurations are tested by the CI in our repository, see `workflows on GitHub <https://github.com/cloud-py-api/app_api/blob/main/.github/workflows/tests-deploy.yml>`_.

Example
*******

Example of ``occ`` **app_api:daemon:register** command:

.. code-block:: bash

	sudo -u www-data php occ app_api:daemon:register docker_local_sock "My Local Docker" docker-install http /var/run/docker.sock "https://nextcloud.local" --net nextcloud


ExApp registration
------------------

The second and final step is to deploy and register ExApp in Nextcloud on a previously registered daemon.
This can be done by the ``occ`` **app_api:app:register** command:

.. code-block:: bash

	app_api:app:register <appid> <daemon-config-name> [--force-scopes] [--]

Arguments
*********

	* ``appid`` - unique name of the ExApp (e.g. ``app_python_skeleton``, must be the same as in deployed container)
	* ``daemon-config-name`` - unique name of the daemon (e.g. ``docker_local_sock``)

Options
*******

	* ``--force-scopes`` **[optional]** - force scopes approval
	* ``--info-xml INFO-XML`` **[optional]** - path to info.xml file with ExApp description (url or local absolute path)
	* ``--json-info JSON-INFO`` **[optional]** - JSON with ExApp description

.. warning::
	After successful deployment (pull, create, and start container), there is a heartbeat check with a 90 second timeout (will be configurable).

Manual install for development
******************************

For development purposes, you can install the ExApp manually.
There is a ``manual-install`` DeployConfig type, which can be used in case of development.
To register an ExApp with it, you need to provide the app info as a JSON string or a path to the app's XML file.

For all examples and applications we release, we usually add the ``manual_install`` command in it's Makefile for easier development.

.. code-block::

	php occ app_api:app:register nc_py_api manual_install --json-info \
            "{\"id\":\"nc_py_api\",\"name\":\"nc_py_api\",\"daemon_config_name\":\"manual_install\",\"version\":\"1.0.0\",\"secret\":\"12345\",\"port\":$APP_PORT,\"scopes\":[\"SYSTEM\", \"FILES\", \"FILES_SHARING\", \"USER_INFO\", \"USER_STATUS\", \"NOTIFICATIONS\", \"WEATHER_STATUS\", \"TALK\"],\"system\":1}" \
            --force-scopes

.. note::
	App deployment/startup should be done by the developer when ``manual-install`` DeployConfig type is used.

.. _ex_app_env_vars:

Deploy env variables
********************

Deploy env variables are used to configure the ExApp container.
The following env variables are required and built automatically:

	* ``AA_VERSION`` - AppAPI version
	* ``APP_SECRET`` - generated shared secret used for AppAPI authentication
	* ``APP_ID`` - ExApp appid
	* ``APP_DISPLAY_NAME`` - ExApp display name
	* ``APP_VERSION`` - ExApp version
	* ``APP_HOST`` - host ExApp is listening on
	* ``APP_PORT`` - port ExApp is listening on (randomly selected by AppAPI)
	* ``APP_PERSISTENT_STORAGE`` - path to mounted volume for persistent data storage between ExApp updates
	* ``NEXTCLOUD_URL`` - Nextcloud URL to connect to

Application installation scheme
-------------------------------

1. AppAPI deploys the application and launches it.
2. AppAPI for `N` seconds (default ``90``) checks the ``/heartbeat`` endpoint with a ``GET`` request.
3. AppAPI sends a ``POST`` request to the ``/init`` endpoint. If the ExApp does not implement the ``/init`` endpoint and AppAPI receives a 501 or 404 status code, AppAPI enables the application and goes straight to step 5.
4. The ExApp sends an integer from ``0`` to ``100`` to the OCS endpoint ``apps/app_api/apps/status`` indicating the initialization progress. After sending ``100``, the application is considered initialized.
5. AppAPI sends a ``PUT`` request to the ``/enabled`` endpoint.

ExApp info.xml schema
---------------------

The ExApp info.xml (`example <https://github.com/cloud-py-api/nc_py_api/blob/main/examples/as_app/talk_bot/appinfo/info.xml>`_) file is used to describe ExApp parameters.
It is used to generate the ExApp docker container and register the ExApp in Nextcloud.
It has the same structure as other Nextcloud appinfo/info.xml files, but with some additional fields:

.. code-block:: xml

	...
	<external-app>
		<docker-install>
			<registry>ghcr.io</registry>
			<image>cloud-py-api/talk_bot</image>
			<image-tag>latest</image-tag>
		</docker-install>
		<scopes> // deprecated since AppAPI 3.2.0
			<value>TALK</value>
			<value>TALK_BOT</value>
		</scopes>
		<system>0</system> // deprecated since AppAPI 3.0.0
	</external-app>
	...
