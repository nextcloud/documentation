========================
OCS user preferences API
========================

The OCS user preferences API allows you to set and delete preferences from outside over pre-defined OCS calls.

The base URL for all calls to the share API is: ``<nextcloud_base_url>/ocs/v2.php/apps/provisioning_api/api/v1/config/users/``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.

Setting a preference
--------------------

* Method: ``POST``
* Endpoint: ``/{appId}/{configKey}``
* Data:

+-------------+--------+------------------------------------+
| field       | type   | Description                        |
+-------------+--------+------------------------------------+
| configValue | string | The value to set the preference to |
+-------------+--------+------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` If the preference is not allowed to be modified or the given value is invalid
        + ``401 Unauthorized`` If the request is not done with a user

Setting multiple preference
---------------------------

* Method: ``POST``
* Endpoint: ``/{appId}``
* Data:

+--------+-------+--------------------------------------------------------------------------------+
| field  | type  | Description                                                                    |
+--------+-------+--------------------------------------------------------------------------------+
| config | array | Key value pairs of config sets with configKey (string) => configValue (string) |
+--------+-------+--------------------------------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` If any preference is not allowed to be modified or the value is invalid. No preference will be modified.
        + ``401 Unauthorized`` If the request is not done with a user

Deleting a preference
---------------------

* Method: ``DELETE``
* Endpoint: ``/{appId}/{configKey}``
* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` If the preference is not allowed to be deleted
        + ``401 Unauthorized`` If the request is not done with a user

Deleting multiple preference
----------------------------

* Method: ``DELETE``
* Endpoint: ``/{appId}``
* Data:

+------------+-------+---------------------------------------+
| field      | type  | Description                           |
+------------+-------+---------------------------------------+
| configKeys | array | List of configKeys (string) to delete |
+------------+-------+---------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` If any preference is not allowed to be deleted. No preference will be deleted.
        + ``401 Unauthorized`` If the request is not done with a user
