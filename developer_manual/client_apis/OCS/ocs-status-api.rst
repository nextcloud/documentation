==============
OCS Status API
==============

The OCS Status API allows you to access and modify status API from outside over pre-defined OCS calls.

The base URL for all calls to the share API is: ``<nextcloud_base_url>/ocs/v2.php/apps/user_status/api/v1/user_status``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.


User Status - Status Manipulation
---------------------------------

Fetch your own status
^^^^^^^^^^^^^^^^^^^^^

* Required capability: ``user_status``
* Method: ``GET``
* Endpoint: ``/``
* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` If the user does not have a status set

Set your own status
^^^^^^^^^^^^^^^^^^^

* Required capability: ``user_status``
* Method: ``PUT``
* Endpoint: ``/status``
* Data:

+---------------+--------+---------------------------------------+-----------------------------------------------------------+
| field         | type   | Description                           | Allowed values                                            |
+---------------+--------+---------------------------------------+-----------------------------------------------------------+
|``statusType`` | string | New status for the authenticated user | ``online``, ``away``, ``dnd``, ``invisible``, ``offline`` |
+---------------+--------+---------------------------------------+-----------------------------------------------------------+


* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` If the sent status-type is not valid

Set a custom message (predefined)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Required capability: ``user_status``
* Method: ``PUT``
* Endpoint: ``/message/predefined``
* Data:

+---------------+--------+----------------------------------------------------------+
| field         | type   | Description                                              |
+---------------+--------+----------------------------------------------------------+
| ``messageId`` | string | Message-Id of the predefined message                     |
+---------------+--------+----------------------------------------------------------+
| ``clearAt``   | int    | Unix Timestamp representing the time to clear the status |
+---------------+--------+----------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` If the sent messageId does not exist
        + ``400 Bad Request`` If the Unix timestamp is in the past

Set a custom message (user-defined)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Required capability: ``user_status``, ``supports_emoji`` for ``statusIcon`` support
* Method: ``PUT``
* Endpoint: ``/message/custom``
* Data:

+----------------+-------------+-------------------------------------------------------------+
| field          | type        | Description                                                 |
+----------------+-------------+-------------------------------------------------------------+
| ``statusIcon`` | string/null | The icon picked by the user (must be an emoji, at most one) |
+----------------+-------------+-------------------------------------------------------------+
| ``message``    | string      | The custom message picked by the user                       |
+----------------+-------------+-------------------------------------------------------------+
| ``clearAt``    | int         | Unix Timestamp representing the time to clear the status    |
+----------------+-------------+-------------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` If the `statusIcon` is not a an emoji or more than one emoji
        + ``400 Bad Request`` If the `message` is too long
        + ``400 Bad Request`` If the Unix timestamp is in the past

Clear message
^^^^^^^^^^^^^

* Required capability: ``user_status``
* Method: ``DELETE``
* Endpoint: ``/message``
* Response:
    - Status code:
        + ``200 OK``

User Status - Predefined statuses
---------------------------------

Base endpoint ics: ``/ocs/v2.php/apps/user_status/api/v1/predefined_statuses``

Fetch the list of predefined statuses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Required capability: ``user_status``
* Method: ``GET``
* Endpoint: ``/``
* Response:
    - Status code:
        + ``200 OK``

User Status - Retrieve statuses
-------------------------------

Base endpoint ics: ``/ocs/v2.php/apps/user_status/api/v1/statuses``

Fetch a list of all set user-statuses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Required capability: ``user_status``
* Method: ``GET``
* Endpoint: ``/``
* Data:

+------------+------+-----------------------+
| field      | type | Description           |
+------------+------+-----------------------+
| ``limit``  | int  | Limit for pagination  |
+------------+------+-----------------------+
| ``offset`` | int  | Offset for pagination |
+------------+------+-----------------------+

* Response:
    - Status code:
        + ``200 OK``

Fetch a specific user's status
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Required capability: ``user_status``
* Method: ``GET``
* Endpoint: ``/{userId}``
* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` If the user does not have a status set

Fetch a user's backup status
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In some scenarios the user's status can be overwritten automatically, e.g. by joining a call in Nextcloud Talk,
or when the availability automation is enabled. In this case the userId can be prefixed with an `_` underscore,
to get the original user status. When a user status is returned and the ``user_status`` > ``restore`` capability
is available, the backup status should be added as an item in the predefined status list. Clicking that should then
do an API call to `User status - Restore backup`_ should be done.

* Required capability: ``user_status``
* Method: ``GET``
* Endpoint: ``/_{userId}``
* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` If the user does not have a backup status set

Files Sharing
^^^^^^^^^^^^^

The user-status is also exposed via the following Files Sharing APIs:
 * ``GET /ocs/v2.php/apps/files_sharing/api/v1/sharees``
 * ``GET /ocs/v2.php/apps/files_sharing/api/v1/sharees_recommended``
 * ``GET /ocs/v2.php/apps/files_sharing/api/v1/shares``
 * ``GET /ocs/v2.php/apps/files_sharing/api/v1/shares/inherited``
 * ``GET /ocs/v2.php/apps/files_sharing/api/v1/shares/pending``
 * ``GET /ocs/v2.php/apps/files_sharing/api/v1/shares/{id}``
 * ``POST /ocs/v2.php/apps/files_sharing//api/v1/shares``
 * ``PUT /ocs/v2.php/apps/files_sharing/api/v1/shares/{id}``

User status - Restore backup
----------------------------

* Required capability: ``user_status`` > ``restore``
* Method: ``DELETE``
* Endpoint: ``/revert/{messageId}``
* Response:
    - Status code:
        + ``200 OK``
