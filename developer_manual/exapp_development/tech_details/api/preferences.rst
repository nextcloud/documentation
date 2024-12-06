===========
Preferences
===========

The ExApp preferences API is similar to the standard preferences API.
It is a user specific setting.


Set user config value
^^^^^^^^^^^^^^^^^^^^^

Set or update config value for the **current authenticated user**.

OCS endpoint: ``POST /apps/app_api/api/v1/ex-app/preference``

Request data
************

.. code-block:: json

	{
		"configKey": "key",
		"configValue": "value"
	}

Response data
*************

On success, ExAppPreference object is returned.
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
				"id":983,
				"appid":"app_id",
				"configkey":"test key",
				"configvalue":"123",
				"sensitive":0
			}
		}
	}

Get user config values
^^^^^^^^^^^^^^^^^^^^^^

Get config values for the **current authenticated user**.

OCS endpoint: ``POST /apps/app_api/api/v1/ex-app/preference/get-values``

Request data
************

.. code-block:: json

	{
		"configKeys": ["key1", "key2", "key3"]
	}

Response data
*************

List of ExApp preferences values are returned.

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
				"configkey":"test key",
				"configvalue":"123"
				},
				{
				"configkey":"test key2",
				"configvalue":"321"
				}
			]
		}
	}


Delete user config values
^^^^^^^^^^^^^^^^^^^^^^^^^

Delete config values for the **current authenticated user**.

OCS endpoint: ``DELETE /apps/app_api/api/v1/ex-app/preference``

Request data
************

.. code-block:: json

	{
		"configKeys": ["key1", "key2", "key3"]
	}

Response
********

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
			"data":2
		}
	}
