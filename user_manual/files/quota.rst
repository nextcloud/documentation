Storage Quota
=============

ownCloud makes it possible to specify a storage quota for users which is the **maximum space** a user is allowed to use for files located in their individual home storage.

.. note:: When setting a quota, administrators need to be aware that it **only applies to actual files**, not application metadata. This means that when allocating a quota, they need to make sure there at least 10% more space available for a given user.

Checking the available space
----------------------------

You can check your available space by going to the "Personal" page from the top-right menu.

The available space of a given user is calculated using the following formula::

    available_space = min(quota, disk_free_space) - used_space

``disk_free_space`` is the space available on the partition on which the user's home storage is located on the server. It could happen that the available space on that partition is less than the user's quota.

Sharing
-------

When sharing files or directories, their used space is counted in the owner's quota.

Shared files
~~~~~~~~~~~~

If user A shares a file F with user B, the size of F will be counted in user A's storage, even if the file is modified or its size is increased by user B.

Shared directories
~~~~~~~~~~~~~~~~~~

If user A shares a directory D with user B, any file that is modified or uploaded by user B inside of directory D will count in user A's used space.

Resharing
~~~~~~~~~

When resharing a file or a directory, the used space is still counted in the quota of the owner who shared it initially.

Public sharing with upload permission
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If user A publicly shares (share with link) a directory D and enables the "public upload" permission, people with the link will be able to upload files into D and their sizes will be counted in user A's used space.

Excluded from quota
-------------------

Metadata and cache
~~~~~~~~~~~~~~~~~~

Application metadata and cached information are excluded from the total used space.

Such data could be thumbnails (icon previews, pictures app), temporary files, encryption keys, etc.

Some apps are also storing information directly in the database (not as files) like the :doc:`calendar <../pim/calendar>` and :doc:`contacts <../pim/contacts>` apps. This data is also excluded from the total used space.


Deleted files
~~~~~~~~~~~~~

When deleting files, these are moved/copied to the :doc:`trashbin <deletedfiles>` at first. These files do not count in the user's used space.

For example with a quota of 10 GB, if the user has 4 GB used space and 5 GB in the trashbin, they will still see 6 GB free space. If the user uploads 6 GB of files at this point, the :doc:`trashbin app <deletedfiles>` will discard deleted files when necessary to make room for the new files.

Version Control
~~~~~~~~~~~~~~~

The size of older file versions does not count in the used space.

For example with a quota of 10 GB, if the user has 4 GB used space and 5 GB of older file versions, they will still see 6 GB free space. If the user uploads 6 GB of files at this point, the :doc:`versions app <versioncontrol>` will discard older versions when necessary to make room for the new files.

See :doc:`versioncontrol` for details about the version expiration behavior. 

Encryption
~~~~~~~~~~

When files are :doc:`encrypted <encryption>`, they take slightly more physical space than the original files. Only the original size will be counted in the used space.

External storage
~~~~~~~~~~~~~~~~

When mounting external storage, either as administrator or as user, the space available on that storage is not taken into account for the user's quota.
It is currently not possible to set a quota for external storage.

