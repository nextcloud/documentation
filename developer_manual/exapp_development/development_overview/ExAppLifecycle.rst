.. _ex_app_lifecycle:

ExApp lifecycle
===============

The ExApp lifecycle is a set of communication rules (or protocols) between Nextcloud and the ExApp.
They are required as for the microservice architecture of ExApp.
This section is an overview, more details on that here: :ref:`app_installation_flow`, :ref:`app_deployment`.


.. _ex_app_lifecycle_methods:


ExApp lifecycle methods
-----------------------

When the ExApp is being installed in Nextcloud, there are several lifecycle steps happening.
The ExApp lifecycle requires the following API endpoint handlers (in order):

	0. ``healthcheck``: Docker container healthcheck
	1. ``/heartbeat``: **[required]** ExApp heartbeat handler
	2. ``/init``: **[optional]** ExApp initialization handler
	3. ``/enabled``: **[required]** ExApp enable/disable handler


Healthcheck
***********

Docker allows you to define a custom healthcheck script for your container (specified in the Dockerfile).
You can define any custom container startup logic here if needed.

.. note::

	The AppAPI healthcheck timeout is 15 minutes.


Heartbeat
*********

The ``GET /heartbeat`` method is called periodically by Nextcloud to check the ExApp health status,
i.e. if its webserver is running and receiving requests.

URL: ``GET http://localhost:2345/heartbeat``

AppAPI expects a response with HTTP status 200.
This step fails if the ExApp does not respond within 10 minutes.

.. note::

	This endpoint should be available **without AppAPIAuth authentication**.
	There is a 10 minute timeout for the ExApp to startup and respond to the ``/heartbeat`` request.


.. _ex_app_lifecycle_init:


Init
****

The ``POST /init`` endpoint is called after the ExApp is enabled in Nextcloud.
This is a trigger for the ExApp to start its initialization process, e.g. downloading models, starter data, etc.

.. note::

	The default init timeout (``init_timeout``) is 40 minutes. It can be changed in the AppAPI admin settings
	or via the command ``occ config:app:set app_api init_timeout --value 40 --type mixed``.

URL: ``POST http://localhost:2345/init``

AppAPI expects a response with HTTP status 200.

.. note::

	Even if the ExApp does not not implement ``/init`` endpoint and AppAPI receives a ``HTTP 501 NOT IMPLEMENTED`` or ``HTTP 404 NOT FOUND`` response,
	AppAPI can still enable the ExApp.

The ExApp should update the init progress via the ``PUT /ocs/v2.php/apps/app_api/ex-app/status`` API request
containing a ``{ "progress": <number> }`` payload.


Enabled
*******

The ``PUT /enabled?enabled=1|0`` method is called when the ExApp is enabled or disabled in Nextcloud.
The ``enabled`` query parameter is used to determine the ExApp state: 1 - enabled, 0 - disabled.


- ``PUT http://localhost:2345/enabled?enabled=1`` - enable ExApp, during this call ExApp should register all needed APIs
- ``PUT http://localhost:2345/enabled?enabled=0`` - disable ExApp, during this call ExApp should unregister all APIs

AppAPI expects a response with HTTP status 200. Any other status code will be considered as an error.

.. note::

	The AppAPI timeout for the ``enabled`` handler is 30 seconds.


ExApp lifecycle scheme
----------------------

Let's review a simple ExApp lifecycle scheme:


.. mermaid::

	sequenceDiagram
		participant Nextcloud
		participant ExApp
		loop Heartbeat
			Nextcloud->>ExApp: HTTP GET /heartbeat
			ExApp-->>Nextcloud: /heartbeat HTTP 200
		end
		Nextcloud->>ExApp: HTTP POST /init
		ExApp->>Nextcloud: /init HTTP OK 200
		loop Init
			ExApp->>ExApp: Download models, starter data, etc.
			ExApp-->>Nextcloud: PUT /ocs/v2.php/apps/app_api/ex-app/status { "progress": 50 }
		end
		Nextcloud->>ExApp: HTTP PUT /enabled?enabled=1
		ExApp-->>Nextcloud: Register all needed APIs via OCS API
		ExApp->>Nextcloud: /enabled HTTP 200
		Nextcloud->>ExApp: HTTP PUT /enabled?enabled=0
		ExApp-->>Nextcloud: Unregister all APIs via OCS API
		ExApp->>Nextcloud: /enabled HTTP 200


Nextcloud-side ExApp lifecycle methods
--------------------------------------

The Nextcloud-side ExApp lifecycle methods are the OCS APIs.
You can find available AppAPI Nextcloud OCS APIs :ref:`here <app_api_nextcloud_apis>`.

.. note::

	The ExApp should register all needed APIs during the ``enabled`` method call,
	such as the UI (:ref:`top-menu <top_menu_section>`, :ref:`filesactionmenu <file_actions_menu_section>`), :ref:`occ commands <occ_command>`, etc.


AppAPI Authentication
---------------------

Nextcloud requests to the ExApp are secured with :doc:`AppAPIAuth <../tech_details/Authentication>`.
The ExApp should validate the authentication using the same algorithm as AppAPI does.

.. note::

	Is it up to the developer to apply rate limits, bruteforce protection, and other security measures
	to the ExApp API endpoints.


Cookies
*******

Along with the AppAPIAuth, ExApp can utilize the Nextcloud cookies of the authenticated user,
who made the request to the ExApp.
