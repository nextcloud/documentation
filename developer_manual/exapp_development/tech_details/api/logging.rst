=======
Logging
=======

There is a logging API that can be used to log messages from ExApps in Nextcloud.

.. note::

	You can retrieve the Nextcloud `loglevel` for internal ExApp usage
	from private `app_api` (after authentication) capabilities.

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


The possible values of ``log_lvl`` are described here: `Nextcloud Log level <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/logging_configuration.html#log-level>`_

Response data
*************

If no error occurs, an empty response with status code 200 is returned.
If the ExApp is not found or disabled, or the `loglevel` is invalid, an OCS Bad Request is returned.

