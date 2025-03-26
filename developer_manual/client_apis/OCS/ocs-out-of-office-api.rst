.. _ocs-out-of-office-api:

=====================
OCS Out-of-office API
=====================

.. versionadded:: 28.0

The OCS Out-of-office API allows you to access and modify out-of-office data of users.

The base URL for all calls to the share API is: ``<nextcloud_base_url>/ocs/v2.php/apps/dav/api/v1/outOfOffice``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.


Fetch ongoing data
------------------

Fetch data of the ongoing out-of-office period of a user.

* Method: ``GET``
* Endpoint: ``/{userId}/now``
* Response:
    - Status code:
        + ``200 OK`` Out-of-office data
        + ``404 Not Found`` If the user does not have an ongoing out-of-office period
    - Data (is only sent if the status code is ``200 OK``):

+---------------------------------+-------------+---------------------------------------------------------------------+
| field                           | type        | Description                                                         |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``id``                          | string      | Database ID of the absence data entity                              |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``userId``                      | string      | ID of the user which the data belongs to                            |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``startDate``                   | int         | Timestamp of the start date (respecting the userId's timezone)      |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``endDate``                     | int         | Timestamp of the end date (respecting the userId's timezone)        |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``shortMessage``                | string      | Short text that is set as user status during the absence            |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``message``                     | string      | Longer multiline message that is shown to others during the absence |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserId``           | string/null | ID of the replacement user                                          |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserDisplayName``  | string/null | Displayname of the replacement user                                 |
+---------------------------------+-------------+---------------------------------------------------------------------+

Fetch upcoming or ongoing data
------------------------------

The returned out-of-office period might not have started yet. This endpoint will return data of the
ongoing or next upcoming out-of-office period of a user.

* Method: ``GET``
* Endpoint: ``/{userId}``
* Response:
    - Status code:
        + ``200 OK`` Out-of-office data
        + ``404 Not Found`` If the user did not schedule an out-of-office period
    - Data (is only sent if the status code is ``200 OK``):

+---------------------------------+-------------+---------------------------------------------------------------------+
| field                           | type        | Description                                                         |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``id``                          | int         | Database ID of the absence data entity                              |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``userId``                      | string      | ID of the user which the data belongs to                            |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``firstDay``                    | string      | First day of the absence in format ``YYYY-MM-DD``                   |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``lastDay``                     | string      | Last day of the absence in format ``YYYY-MM-DD``                    |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``status``                      | string      | Short text that is set as user status during the absence            |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``message``                     | string      | Longer multiline message that is shown to others during the absence |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserId``           | string/null | ID of the replacement user                                          |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserDisplayName``  | string/null | Displayname of the replacement user                                 |
+---------------------------------+-------------+---------------------------------------------------------------------+

Modify out-of-office data
-------------------------

It is only possible to modify out-of-office data of the currently logged in user.

* Method: ``POST``
* Endpoint: ``/{userId}``
* Data:

+---------------------------------+-------------+---------------------------------------------------------------------+
| field                           | type        | Description                                                         |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``firstDay``                    | string      | First day of the absence in format ``YYYY-MM-DD``                   |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``lastDay``                     | string      | Last day of the absence in format ``YYYY-MM-DD``                    |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``status``                      | string      | Short text that is set as user status during the absence            |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``message``                     | string      | Longer multiline message that is shown to others during the absence |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserId``           | string/null | ID of the replacement user                                          |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserDisplayName``  | string/null | Displayname of the replacement user                                 |
+---------------------------------+-------------+---------------------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK`` Updated out-of-office data
        + ``400 Bad Request`` If the first day is not before the last day
        + ``404 Not Found`` If a replacement user ID is provided but no corresponding user is found
        + ``401 Unauthorized`` If the user is not logged in
    - Data (is only sent if the status code is ``200 OK``):

+---------------------------------+-------------+---------------------------------------------------------------------+
| field                           | type        | Description                                                         |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``id``                          | int         | Database ID of the absence data entity                              |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``userId``                      | string      | ID of the user which the data belongs to                            |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``firstDay``                    | string      | First day of the absence in format ``YYYY-MM-DD``                   |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``lastDay``                     | string      | Last day of the absence in format ``YYYY-MM-DD``                    |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``status``                      | string      | Short text that is set as user status during the absence            |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``message``                     | string      | Longer multiline message that is shown to others during the absence |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserId``           | string/null | ID of the replacement user                                          |
+---------------------------------+-------------+---------------------------------------------------------------------+
| ``replacementUserDisplayName``  | string/null | Displayname of the replacement user                                 |
+---------------------------------+-------------+---------------------------------------------------------------------+

Clear data and disable out-of-office
------------------------------------

It is only possible to clear out-of-office data of the currently logged in user.

* Method: ``DELETE``
* Endpoint: ``/{userId}``
* Response:
    - Status code:
        + ``200 OK`` Out-of-office data was cleared
        + ``401 Unauthorized`` If the user is not logged in
