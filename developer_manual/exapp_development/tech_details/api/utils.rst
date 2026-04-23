======================
Miscellaneous OCS APIs
======================

There are some system utils APIs required for ExApps internal logic.


Get list of NC users
^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``GET /apps/app_api/api/v1/users``

Response data
*************

Returns a list of user IDs only.

.. code-block:: json

	{"ocs": {
		"meta": {
			"status": "ok",
			"statuscode": 100,
			"message": "OK",
			"totalitems": "",
			"itemsperpage": ""
			},
		"data": ["admin", "alice", "bob", "jane", "john"]
		}
	}
