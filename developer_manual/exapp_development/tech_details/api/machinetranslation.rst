===================
Machine Translation
===================

AppAPI provides a Machine-Translation providers registration mechanism for ExApps.

.. note::

	Available since Nextcloud 29.

Registering translation provider (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/ai_provider/translation``

Request data
************

.. code-block:: json

	{
		"name": "unique_provider_name",
		"display_name": "Provider Display Name",
		"from_languages": {
			"en": "English",
			"fr": "French",
		},
		"to_languages": {
			"en": "English",
			"fr": "French",
		},
		"action_handler": "/handler_route_on_ex_app",
		"action_detect_lang": "/detect_lang_from_text_handler",
	}

.. note::

	``from_languages`` and ``to_languages`` are JSON object with language code as key and language name as value.
	``action_detect_lang`` is optional. If provided, server's translation manager will call this handler to detect language from text if no source lang provided,
	for reference see `Providing Language detection <https://docs.nextcloud.com/server/latest/developer_manual/digging_deeper/translation.html#providing-language-detection>`_.


Response
********

On successful registration response with status code 200 is returned.

Unregistering translation provider (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ai_provider/translation``

Request data
************

.. code-block:: json

	{
		"name": "unique_provider_name",
	}

Response
********

On successful unregister response with status code 200 is returned.


Report translation result (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``PUT /apps/app_api/api/v1/ai_provider/translation``

Request data
************

.. code-block:: json

	{
		"task_id": "queued_task_id",
		"result": "translated_text",
		"error": "error_message_if_any",
	}
