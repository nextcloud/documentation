======================
Managing Deleted Files
======================

When you delete a file in ownCloud, it is not immediately deleted permanently. 
Instead, it is moved into the trash bin. It is not permanently deleted until 
you manually delete it, or when the Deleted Files app deletes it to make room 
for new files.

Find your deleted files by clicking on the **Deleted files** 
button on the Files page of the ownCloud Web interface. You'll have options to 
either restore or permanently delete files.

Quotas
------

Deleted files are not counted against your storage quota. Only files that 
originate with users count against their quotas, not files 
shared with them that originate from other users. (See :doc:`quota` to learn 
more about quotas.)

What Happens When Shared Files Are Deleted
------------------------------------------

Deleting files gets a little complicated when they are shared files, as this 
scenario illustrates:

1. User1 shares a folder "test" with User2 and User3
2. User2 (the recipient) deletes a file/folder "sub" inside of "test"
3. The folder "sub" will be moved to the trashbin of both User1 (owner) and 
   User2 (recipient)
4. But User3 will not have a copy of "sub" in her trash bin

When User1 deletes "sub" then it is moved to User1's trash bin. It is 
deleted from User2 and User3, but not placed in their trash bins.

When you share files, other users may copy, rename, move, and share them with 
other people, just as they can for any computer files; ownCloud does not have 
magic powers to prevent this.

How the Deleted Files app Manages Storage Space
-----------------------------------------------

To ensure that users do not run over their storage quotas, the Deleted Files 
app allocates a maximum of 50% of their currently available free space to 
deleted files. If your deleted files exceed this limit, ownCloud deletes the 
oldest files (files with the oldest timestamps from when they were deleted) 
until it meets the memory usage limit again.

ownCloud checks the age of deleted files every time new files are added to the 
deleted files. By default, deleted files stay in the trash bin for 180 days. The 
ownCloud server administrator can adjust this value in the ``config.php`` file 
by setting the ``trashbin_retention_obligation`` value. Files older than the 
``trashbin_retention_obligation`` value will be deleted permanently. 
Additionally, ownCloud calculates the maximum available space every time a new 
file is added. If the deleted files exceed the new maximum allowed space 
ownCloud will expire old deleted files until the limit is met once again.
