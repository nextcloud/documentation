=======
General
=======

Nextcloud's APIs are mainly available through :ref:`rest-apis`, :ref:`OCS <ocsapiindex>` and :ref:`webdavapiindex`.

Generic Errors
--------------

Additional to specific errors of an API, there are a few generic errors Nextcloud might throw on web APIs.

Maintenance Mode
****************

If Nextcloud is down for maintenance, it sends a HTTP response with status code 503 and the header ``x-nextcloud-maintenance-mode: 1``.
