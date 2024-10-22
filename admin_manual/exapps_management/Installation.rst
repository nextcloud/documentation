Installation
============

As of Nextcloud 30, AppAPI is automatically installed by default.
If AppAPI is not installed, you can still install it from the `App Store <https://apps.nextcloud.com/apps/app_api>`_.
Simply navigate to the Apps management page in your Nextcloud and search for AppAPI from the Tools category.

Setup deploy daemon
*******************

After successful installation, a one-time configuration of the deploy daemon is required:

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
