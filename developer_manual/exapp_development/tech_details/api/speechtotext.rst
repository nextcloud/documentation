==============
Speech-To-Text
==============

AppAPI provides a Speech-To-Text (STT) provider registration API for the ExApps.

.. note::

	Available since Nextcloud 29.

Registering ExApp STT provider (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/provider/speech_to_text``

Request data
************

.. code-block:: json

	{
		"name": "unique_provider_name",
		"display_name": "Provider Display Name",
		"action_handler": "/handler_route_on_ex_app",
	}


Response
********

On successful registration response with status code 200 is returned.

Unregistering ExApp STT provider (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/provider/speech_to_text``

Request data
************

.. code-block:: json

	{
		"name": "unique_provider_name",
	}


Response
********

On successful unregister response with status code 200 is returned.
