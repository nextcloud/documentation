=========
AppConfig
=========

The ExApp AppConfig API is similar to the standard Nextcloud **appconfig** API.

Set app config value
^^^^^^^^^^^^^^^^^^^^

Set or update ExApp config value.

.. note:: when ``sensitive`` is not specified during updating value, it will be not changed to default.

OCS endpoint: ``POST /apps/app_api/api/v1/ex-app/config``

Request data
************

.. code-block:: json

	{
		"configKey": "key",
		"configValue": "value"
		"sensitive": "sensitive flag affecting the visibility of the value (0/1, default: 0)"
	}

Response data
*************

On success, ExAppConfig object is returned.
On error, OCS Bad Request is returned.

.. code-block:: json

	{
		"ocs":
		{
			"meta":
			{
				"status":"ok",
				"statuscode":100,
				"message":"OK",
				"totalitems":"",
				"itemsperpage":""
			},
			"data":
			{
				"id":1084,
				"appid":"app_id",
				"configkey":"key",
				"configvalue":"value",
				"sensitive":1
			}
		}
	}

Get app config values
^^^^^^^^^^^^^^^^^^^^^

Get ExApp config values

OCS endpoint: ``POST /apps/app_api/api/v1/ex-app/config/get-values``

Request data
************

.. code-block:: json

	{
		"configKeys": ["key1", "key2", "key3"]
	}

Response data
*************

List of ExApp config values are returned.

.. code-block:: json

	{
		"ocs":
		{
			"meta":
			{
				"status":"ok",
				"statuscode":100,
				"message":"OK",
				"totalitems":"",
				"itemsperpage":""
			},
			"data":[
				{
				"configkey":"test_key",
				"configvalue":"123"
				}
			]
		}
	}

Delete app config values
^^^^^^^^^^^^^^^^^^^^^^^^

Delete ExApp config values.

OCS endpoint: ``DELETE /apps/app_api/api/v1/ex-app/config``

Request data
************

.. code-block:: json

	{
		"configKeys": ["key1", "key2", "key3"]
	}

Response
********

Returns the number of configuration values removed.

.. code-block:: json

	{
		"ocs":
		{
			"meta":
			{
				"status":"ok",
				"statuscode":100,
				"message":"OK",
				"totalitems":"",
				"itemsperpage":""
			},
		"data":1
		}
	}
