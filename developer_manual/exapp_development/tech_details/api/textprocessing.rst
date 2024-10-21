===============
Text-Processing
===============

AppAPI provides a Text-Processing providers registration mechanism for ExApps.

.. note::

	Available since Nextcloud 29.

Registering text-processing provider (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/ai_provider/text_processing``

Request data
************

.. code-block:: json

	{
		"name": "unique_provider_name",
		"display_name": "Provider Display Name",
		"action_handler": "/handler_route_on_ex_app",
		"task_type": "supported_task_type",
	}

.. note::

	``action_type`` is a class name of the Text-Processing task type that can be found in the list of supported task types.

Response
********

On successful registration response with status code 200 is returned.

Unregistering text-processing provider (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ai_provider/text_processing``

Request data
************

.. code-block:: json

	{
		"name": "unique_provider_name",
	}

Response
********

On successful unregister response with status code 200 is returned.


Get list of supported Text-Processing task types (capabilities)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

There are limited number of Task Types that can be used for Text-Processing.
You can get list of supported Text-Processing task types from OCS capabilities.

Response
********

.. code-block:: json

	{
		"text_processing": {
			"task_types": ["free_prompt", "headline", "summary", "topics"]
		}
	}
