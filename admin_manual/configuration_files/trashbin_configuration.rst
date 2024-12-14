=============
Deleted Files
=============

Introduction
-------------

When deletion of a file or folder is requested, Nextcloud does not immediately delete 
it by default. Instead it is moved into the trash bin to faciliate easy restoration.

Items in the trash bin are only permanently deleted if the owner manually uses the *Delete 
permanently* button or administrative policy specifies the items should be automatically 
(permanently) deleted.

Logged in accounts access their trash bin by selecting the the *Deleted files* section 
from within the **Files** area of the Nextcloud Web interface. There any item still in
their trash bin can be restored, downloaded, or deleted permanently. 

The experience, from the perspective of individual accounts, is covered in greater detail within 
the `User Manual <https://docs.nextcloud.com/>`.

.. note:: If the *Versions* app is enabled, restoring a file also restores related file 
   versions.

.. warning:: When an item that has been shared is deleted then restored, it will no longer be 
   shared. 

Policy Configuration
--------------------

The default retention policy for deleted items is:

- For all accounts, items will retained in the trash bin indefinitely unless a quota or maximum 
  trash bin size, that is applicable to the account, gets configured.
- If a account has a maximum trash bin size and exceeds it, the oldest items in their 
  trash bin are automatically (permanently) removed until the maximum trash bin size is no 
  longer exceeded.
- If an account has a quota configured and exceeds it it, the oldest items in their trash 
  bin are automatically (permanently) removed until the quota is no longer exceeded.

.. note:: There is no default maximum trash bin size and quotas are at the discretion of the 
   administration.

Hopefully it's becoming clearer that the default policy can be influenced by:

- Specifying a quota for an account.
- Configuring a maximum trash bin size (either globally or on an individual account; applicable to 
  accounts with or without quotas).
- Overriding the default retention policy by modifying the value of ``trashbin_retention_obligation``
  in ``config/config.php`` (more on that now).

Available retention policy values are:

* ``auto, auto`` (i.e. the default)
    - Keeps files and folders in the trash bin indefinitely.
    - Automatically permanently deletes files and folders in accounts with a maximum trash bin size if 
      space is needed.
    - Automatically permanently deletes files and folders in accounts with quotas if space is needed.
    - Note: Files may not be deleted if space is not needed, such as if there is no applicable maximum 
      trash bin size or quota for an account.
* ``X, auto``
    - Keeps files and folders in the trash bin for a minimum of ``X`` days
    - Automatically permanently elete anytime if space needed (note: files may not be deleted if space is not needed)
* ``auto, D``
    delete all files in the trash bin that are older than D days
    automatically, delete other files anytime if space needed
* ``D1, D2``
    keep files and folders in the trash bin for at least D1 days and
    delete when exceeds D2 days (note: files will not be deleted automatically if space is needed)
* ``disabled``
    trash bin auto clean disabled, files and folders will be kept forever

.. note:: The default policy is equivalent to ``'trashbin_retention_obligation' => 'auto',`` (which is 
   how it was formerly documented and is still also acceptable). It's presentation has been adjusted 
   to be consistent with other possible values (more on those in a moment).



- Retain items in the trash bin for a minimum of ``X`` days and, optionally, anytime if needed.
- Automatically (permanently) remove items after they have been in the trash bin for ``Y`` 
  days and, optionally, anytime if needed or even never.
- Never remove files

- If a maximum trash bin size is configured (either globally or an individual account) and 
  an account still exceeds it after the time-based expiration has taken place, the oldest 
  items in their trash bin are automatically removed until the maximum trash bin size is no 
  longer exceeded.
- If a maximum trash bin size has **not** been configured, but an account has a quota 
  configured and has exceeded it (after the age based expiration), then the oldest items in 
  their trash bin are automatically removed until the quota is no longer exceeded.

- The global retention policy is set via the ``trashbin_retention_obligation`` parameter within ``config/config.php``.
- The maximum trash bin size is an optional parameter that can be set either globally or on a per account basis using the ``occ trashbin:size`` command.
   - It is applicable to both accounts that have a quota and those that do not.
   - It takes precedence over any specified quota.
   - It permits the maximum trash bin size to be managed separately from account quotas.
   - It permits an enable to specify a maximum trash bin size for accounts that do not have quotas.

Background Jobs
----------------

- expiration background jobs 


- can manually trigger some activities directly via ``occ trashbin*`` commands


This functionality is provided by the *Deleted files* app (a.k.a. ``files_trashbin``).
This app is responsibility for providing the web interface for interacting with deleted
items as well 


which is enabled by default.


By default, these files remain in the trash bin for 30 days.
To prevent an account from running out of disk space, the Deleted files app will not utilize more than 50% of the currently available free quota for deleted files. If the deleted files exceed this limit, the app deletes the oldest files until it gets below this limit. More information is available in the Deleted Files documentation.


is enabled (default), this setting defines the policy
for when files and folders in the trash bin will be permanently deleted.

.. note::

    If the user quota limit is exceeded due to deleted files in the trash bin,
    retention settings will be ignored and files will be cleaned up until
    the quota requirements are met.

The app allows for two settings, a minimum time for trash bin retention,
and a maximum time for trash bin retention.
Minimum time is the number of days a file will be kept, after which it
may be deleted. Maximum time is the number of days at which it is guaranteed
to be deleted.
Both minimum and maximum times can be set together to explicitly define
file and folder deletion. For migration purposes, this setting is installed
initially set to "auto", which is equivalent to the default setting in
Nextcloud.

You may alter the default pattern in ``config.php``. The default setting is
``auto``, which sets the default pattern::

 'trashbin_retention_obligation' => 'auto',


Background job
--------------

To permanently delete files a background jobs runs every 30 minutes.
It's possible to deactivate the background job and setup a (system) cron to expire the versions via occ.

Deactivate background job: ``occ config:app:set --value=no files_trashbin background_job_expire_trash``

Activate background job: ``occ config:app:delete files_trashbin background_job_expire_trash``

Expire versions: ``occ trashbin:expire`` or ``occ trashbin:expire --quiet`` (without the progress bar)
