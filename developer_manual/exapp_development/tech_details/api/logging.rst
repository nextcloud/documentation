=======
Logging
=======

There is a logging API that can be used to log messages from ExApps in Nextcloud.

.. note::

	You can retrieve Nextcloud `loglevel` for internal ExApp usage
	from private `app_api` (after authentication) capabilities

Send log message (OCS)
^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/log``

Request data
************

.. code-block:: json

	{
		"level": "log_lvl(integer)",
		"message": "message",
	}


The possible value of ``log_lvl`` is described here: `Nextcloud Log level <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/logging_configuration.html#log-level>`_

Response data
*************

If no error occurs, empty response with result code 200 is returned.
If ExApp is not found or disable, or the loglevel is invalid - OCS Bad Request is returned.

