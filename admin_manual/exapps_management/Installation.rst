Installation
============

There are two ways to install the AppAPI: from the `AppStore <https://apps.nextcloud.com/apps/app_api>`_ or from the source code.

.. note::

   AppAPI 3.0.0 is the last version supported Nextcloud 27.


Installation from the AppStore
------------------------------

Simply navigate to the Apps management page in your Nextcloud and setup the AppAPI from the Tools category.

Installation from the source code
---------------------------------

To install the AppAPI from the source code, follow these steps:

1. Clone the AppAPI repository into your apps directory
*******************************************************

Clone the latest main branch:

	.. code-block:: bash

		git clone https://github.com/cloud-py-api/app_api.git

or clone a specific version by specifying the version tag:

	.. code-block:: bash

		git clone https://github.com/cloud-py-api/app_api.git --branch <version-tag>

where ``<version-tag>`` is the version you want to install.


2. Build frontend assets in production mode
********************************************

	.. code-block:: bash

		npm ci && npm run build

3. Enable the AppAPI
********************

	.. code-block:: bash

		./occ app:enable --force app_api


To install it in development mode, follow the instructions on this page: :ref:`dev-setup`.

4. Setup Deploy daemon
**********************

Upon the successful installation of the AppAPI, a one-time configuration is essential.
Details on this configuration can be found in the subsequent section: :ref:`create-deploy-daemon`.

4.1 Deploy daemon configuration
*******************************

Deploy daemon configuration steps:

1. Go to the AppAPI admin settings.
2. Click on the "Register Daemon" button.
3. Fill in the required fields:
	- ``Name``: unique name of the Deploy daemon
	- ``Display name``: the name that will be displayed in the UI
	- ``Deployment method``: by default you will need to choose ``docker_install``, ``manual_install`` is for development or custom use case of manual ExApp installation
	- ``Daemon Host``: hostname/IP address + port of the Deploy daemon
	- ``Nextcloud URL``: autofilled with current domain, you might need to change the protocol to http/https depending on your setup
	- ``Set as default daemon``: check if you want set new Deploy daemon as default
	- ``Enable https``: check if your Deploy daemon (Docker Socket Proxy) is configured with TLS
	- Deploy Config:
		- ``Network``: Docker network name, depends on your networking setup, enforces to "host" if "Enable https" is checked
		- ``HaProxy password``: password for Docker Socket Proxy, if it is configured with TLS
		- ``Compute Device``: CPU, CUDA or ROCm, depending on your hardware config on Deploy daemon host machine
		- ``Add additional option`` (see :ref:`additional_options_list`): setup additional KEY + VALUE deploy config options
4. Check connection: to verify configuration is correct
5. Register: to save the Deploy daemon configuration

Deployment configuration examples can be found :ref:`here <deploy-configs>`.
