=======================
OCS Recommendations API
=======================

The OCS Recommendations API allows you to get a list of recommended files and folders with recent activity.

.. note:: This API requires the Recommendations app to be enabled.

The base URL for all calls to the share API is: ``<nextcloud_base_url>/ocs/v2.php/apps/recommendations/api/v1/``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.

.. warning:: This API is **experimental** and can change in the future without further notice!


Recommendations - Retrieval
---------------------------

Fetch user-controlled recommendations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Method: ``GET``
* Endpoint: ``/recommendations``
* Response:
    - Status code:
        + ``200 OK``
* Result:
    - `enabled` (boolean) True if recommendations are enabled for user. False otherwise.
    - `recommendations` (list, optional) List of recommended files and folders, if the user enabled recommendations.

Fetch user setting and recommendations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Method: ``GET``
* Endpoint: ``/recommendations/always``
* Response:
    - Status code:
        + ``200 OK``
* Result:
    - `enabled` (boolean) True if recommendations are enabled for user. False otherwise.
    - `recommendations` (list) List of recommended files and folders, independent of the users decision.