=====
ExApp
=====

OCS APIs for ExApp actions.

Get ExApps list
^^^^^^^^^^^^^^^

Get list of installed ExApps.

OCS endpoint: ``GET /apps/app_api/api/v1/ex-app/{list}``

There are two ``list`` options:

- ``enabled``: list only enabled ExApps
- ``all``: list all ExApps


Response data
*************

The response data is a JSON array of ExApp objects with the following attributes:

.. code-block:: json

	{
		"id": "appid of the ExApp",
		"name": "name of the ExApp",
		"version": "version of the ExApp",
		"enabled": "true/false flag",
		"last_check_time": "timestamp of last successful Nextcloud->ExApp connection check",
	}

Set ExApp init progress
^^^^^^^^^^^^^^^^^^^^^^^

Used during ExApp :ref:`initialization step <ex_app_lifecycle_init>`.

.. note::

	AppAPIAuth required.

OCS endpoint: ``PUT /apps/app_api/ex-app/status``

Request data
************

.. code-block:: json

	{
		"progress": "progress value",
		"error": "optional, error string message"
	}

Response data
*************

Returns HTTP 200 on success, HTTP 404 on error.

Get Nextcloud URL
^^^^^^^^^^^^^^^^^

It might be necessary for the ExApp to know (or update) the Nextcloud URL.

OCS endpoint: ``GET /apps/app_api/api/v1/info/nextcloud_url``

Response data
*************

Returns the base URL of the Nextcloud instance:

.. code-block:: json

	{
		"base_url": "http(s)://nextcloud.example.com"
	}


Make Requests to ExApps
^^^^^^^^^^^^^^^^^^^^^^^

There are two endpoints for making requests to ExApps:

1. Synchronous request: ``POST /apps/app_api/api/v1/ex-app/request/{appid}``
2. Synchronous request with ExApp user setup: ``POST /apps/app_api/api/v1/ex-app/request/{appid}/{userId}``

Request data
************

The request data params are the same as in ``lib/PublicFunction.php``:

.. code-block:: json

    {
        "route": "relative route to ExApp API endpoint",
        "method": "GET/POST/PUT/DELETE",
        "params": {},
        "options": {},
    }

.. note::

    ``userId`` and ``appId`` is taken from url params


Response data
*************

Successful request to ExApp OCS data response structure is the following:

.. code-block:: json

    {
        "status_code": "HTTP status code",
        "body": "response data from ExApp",
        "headers": "response headers from ExApp",
    }

If there is an error, the response object will have only an ``error`` attribute with the error message.


Get ExApp enabled status
^^^^^^^^^^^^^^^^^^^^^^^^

Return the enabled status of the authenticated ExApp.

OCS endpoint: ``GET /apps/app_api/api/v1/ex-app/state``

.. note::

	This endpoint can be called by ExApp even if it is disabled on the Nextcloud side,
	and requires :doc:`AppAPIAuth <../Authentication>`.

Response data
*************

Returns 1 if the ExApp is enabled, 0 if it is disabled.
