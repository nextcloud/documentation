==================
Retention of files
==================

Nextcloud's Files Retention app allows to automatically delete files that
are tagged with a collaborative tag and have a certain age.

Example
-------

After installing the Retention app as described in :doc:`../apps_management`
navigate to Administration settings and then to Flow.

    .. figure:: images/retention_sample.png
       :alt: Sample rule to delete files after 14 days after creation.

The rule from the example will delete all files tagged with ``Temporary file`` 14 days after the creation.

You can also use the "Notify owner a day before a file is automatically deleted" option to
make sure the file owner will get a notification before a file will be deleted.

File age
--------

There are 2 options available that can be used to decide when to delete a file:

- **Creation:** Time the file was created on the Nextcloud Server or uploaded to it.
- **Last modification:** Time when the file was last modified. Uploading also counts as a modification,
  so files that have not been modified since a long time before uploading are not deleted shortly after the upload.

Common misconfigurations
------------------------

Public collaborative tag
^^^^^^^^^^^^^^^^^^^^^^^^

Similar to :doc:`access_control` retention should use ``restricted`` or ``invisible``
tags. Otherwise any user can remove the tag and the file is not removed after the given
period. Use :doc:`automated_tagging` to assign such tags to newly uploaded files.
