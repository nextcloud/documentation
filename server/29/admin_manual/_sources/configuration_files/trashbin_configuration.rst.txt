=========================
Deleted Items (trash bin)
=========================

If the trash bin app is enabled (default), this setting defines the policy
for when files and folders in the trash bin will be permanently deleted.

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

Available values:

* ``auto``
    default setting. keeps files and folders in the trash bin for 30 days
    and automatically deletes anytime after that if space is needed (note:
    files may not be deleted if space is not needed).
* ``D, auto``
    keeps files and folders in the trash bin for D+ days, delete anytime if
    space needed (note: files may not be deleted if space is not needed)
* ``auto, D``
    delete all files in the trash bin that are older than D days
    automatically, delete other files anytime if space needed
* ``D1, D2``
    keep files and folders in the trash bin for at least D1 days and
    delete when exceeds D2 days (note: files will not be deleted automatically if space is needed)
* ``disabled``
    trash bin auto clean disabled, files and folders will be kept forever

Background job
--------------

To permanently delete files a background jobs runs every 30 minutes. 
It's possible to deactivate the background job and setup a (system) cron to expire the versions via occ.

Deactivate background job: ``occ config:app:set --value=no files_trashbin background_job_expire_trash``

Activate background job: ``occ config:app:delete files_trashbin background_job_expire_trash``

Expire versions: ``occ trashbin:expire`` or ``occ trashbin:expire --quiet`` (without the progress bar)