Storage Quota
=============

ownCloud enables you to specify a storage quota for users which is the
**maximum space** a user is allowed to use for files located in their
individual home storage.

.. note:: Quota settings **only apply to actual files**, not application
   metadata. Application metadata consumes an added 10% of space for any given
   user. When allocating quotas, you must ensure that there is at least 10% more
   space available for each user.

Checking Available Space
------------------------

You can check available space by accessing the "Personal Settings" page.  To
access your personal settings:

1. Click the Personal Settings dropdown menu to the right of the Search field
   in the ownCloud Main User Interface.

  .. figure:: ../images/oc_personal_settings_dropdown.png

      Personal Settings menu

2. Select "Personal" from the menu. The Personal Settings window opens.
    .. figure:: ../images/oc_personal_settings_window.png

The available space of a given user is calculated using the following formula::

    available_space = min(quota, disk_free_space) - used_space

``disk_free_space`` is the space available on the partition on which the home
storage for a user is located on the server.

.. note:: It is possible that the available space on a partition is less than
   the user quota.

.. todo:: ??So what do we do in that case??

Available Space and Sharing
---------------------------

When sharing files or folders, the space that each file or folder (along with
the folder contents) uses is counted in the quota for the user who is sharing
the files or folders.  For example:

**Example: Available Space and Shared Files**

If user 'A' shares a file with user 'B,' the size of the file is counted
against the storage quota for user 'A', even if the file is modified or its
size is increased by user 'B.''

**Example: Available Space and Shared Folders**

If user 'A' shares a folder with user 'B,' the size of the folder (along with
its contents) is counted against the storage quota for user 'A.'  This means
that any file that is modified or uploaded by user 'B' inside of the shared
folder counts against the storage quota for user 'A.'

Resharing
~~~~~~~~~

When resharing a file or a directory, the used space is still counted in the
quota of the owner who shared it initially.

Public sharing with upload permission
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If user A publicly shares (share with link) a directory D and enables the
"public upload" permission, people with the link will be able to upload files
into D and their sizes will be counted in user A's used space.

Excluded from quota
-------------------

Metadata and cache
~~~~~~~~~~~~~~~~~~

Application metadata and cached information are excluded from the total used
space.

Such data could be thumbnails (icon previews, pictures app), temporary files,
encryption keys, etc.

Some apps are also storing information directly in the database (not as files)
like the :doc:`calendar <../pim/calendar>` and :doc:`contacts
<../pim/contacts>` apps. This data is also excluded from the total used space.


Deleted Files
~~~~~~~~~~~~~

When deleting files, these are moved/copied to the :doc:`trashbin
<deletedfiles>` at first. These files do not count in the user's used space.

For example with a quota of 10 GB, if the user has 4 GB used space and 5 GB in
the trashbin, they will still see 6 GB free space. If the user uploads 6 GB of
files at this point, the :doc:`trashbin app <deletedfiles>` will discard
deleted files when necessary to make room for the new files.

Version Control
~~~~~~~~~~~~~~~

The size of older file versions does not count in the used space.

For example with a quota of 10 GB, if the user has 4 GB used space and 5 GB of
older file versions, they will still see 6 GB free space. If the user uploads 6
GB of files at this point, the :doc:`versions app <versioncontrol>` will
discard older versions when necessary to make room for the new files.

See :doc:`versioncontrol` for details about the version expiration behavior.

Encryption
~~~~~~~~~~

When files are :doc:`encrypted <encryption>`, they take slightly more physical
space than the original files. Only the original size will be counted in the
used space.

External storage
~~~~~~~~~~~~~~~~

When mounting external storage, either as administrator or as user, the space
available on that storage is not taken into account for the user's quota.
It is currently not possible to set a quota for external storage.

