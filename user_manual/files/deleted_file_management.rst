=======================
Deleted File Management
=======================

ownCloud maintains a copy of deleted files in case you need them again. To
ensure that individual users do not run out of storage space, the Files app manages
the amount of space allocated for deleted files for each user. When it comes to managing
quotas and calculating how much storage you need, keep the following in mind:

* The total storage allocation for deleted files can never exceed more that 50%
  of the currently available free space for each user.

* Once the 50% maximum is reached for deleted files, ownCloud begins to delete files,
  starting with the oldest versions, until it reaches the storage limit again.

You can view all of the deleted files by clicking on the :guilabel:`Deleted
files` button in Files app on the web interface.

Restoring Files
---------------

To restore a deleted file:

1. In the Files app, click the :guilabel:`Deleted files` button.

   The Files app shows all deleted files.

   .. figure:: ../images/deleted_files.png

       **Deleted files**

2. Hover the cursor over the file that you want to restore.

   Task options appear for the file.

3. Click the :guilabel:`Restore` button.

   The Files app restores the file to its original location on the server.

Deleting Files
--------------

To permanently delete a file:

1. In the Files app, click the :guilabel:`Deleted files` button.

   See the **Deleted files** image above.

2. Hover the cursor over the file that you want to delete.

   Task options appear for the file.

3. Click the :guilabel:`Trash can` button.

   The Files app permanently removes the file from the server.

Modifying the Deleted File Age-Out Value
----------------------------------------

Each time a file is added to the deleted files directory, ownCloud checks the
age of the deleted files. By default, deleted files remain in the deleted files
directory for 180 days.

The administrator can adjust the age-out value in the ``config.php`` file by setting the
``trashbin_retention_obligation`` value. Files with ages that exceed this value
are deleted permanently.
