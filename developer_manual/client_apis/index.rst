.. _apiindex:

===============================
Client API's
===============================
Nextcloud provides an number of api's for client applications to talk to.


----
WebDAV
----
WebDAV is the main api for file related operations, it supports listing directories, downloading an uploading files, manipulating tags and favorites and more.

An overview of how to use the various WebDAV api's can be found at :doc:`WebDAV/index`


---
OCS
---

The OCS API provides all information that are not available via the DAV endpoints. This contains endpoints for user data or sharing capabilities for example. See :doc:`OCS/index` for more details.

Other OCS API documentations:

* `Notifications API <https://github.com/nextcloud/notifications/blob/5a2d3607952bad675e4057620a9c7de8a7f84f0b/docs/push-v3.md>`_


.. toctree::
    :maxdepth: 2
    :hidden:

    webdav/index
    ocs/index

