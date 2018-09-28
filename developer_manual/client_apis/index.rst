.. _apiindex:

===============================
Client APIs
===============================
Nextcloud provides an number of APIs for client applications to talk to.


------
WebDAV
------
WebDAV is the main api for file related operations, it supports listing directories, downloading and uploading files, manipulating tags and favorites and more.

An overview of how to use the various WebDAV APIs can be found at :doc:`WebDAV/index`, additionally Nextcloud implements rfc5323_ to allow searching the filesystem more information about how to use WebDAV search can be found at :doc:`WebDAV/search`.


---
OCS
---

The OCS API provides all information that is not available via the DAV endpoints. This contains endpoints for user data or sharing capabilities for example. See :doc:`OCS/index` for more details.

Other OCS API documentations:

* `Notifications API <https://github.com/nextcloud/notifications/blob/master/docs/ocs-endpoint-v2.md>`_
* `Notifications API - Register a device for push notifications <https://github.com/nextcloud/notifications/blob/5a2d3607952bad675e4057620a9c7de8a7f84f0b/docs/push-v3.md>`_

.. _rfc5323: _https://tools.ietf.org/html/rfc5323

Login Flow
----------

Clients can obtain an apptoken via the login flow.  See :doc:`LoginFlow/index`


.. toctree::
    :maxdepth: 2
    :hidden:

    WebDAV/index
    WebDAV/search
    OCS/index
    LoginFlow/index

