===================================
Controlling file versions and aging
===================================

The Versions app (files_versions) expires old file versions automatically to 
ensure that users don't exceed their storage quotas. This is the default 
pattern used to delete old versions:

* For the first second we keep one version
* For the first 10 seconds Nextcloud keeps one version every 2 seconds
* For the first minute Nextcloud keeps one version every 10 seconds
* For the first hour Nextcloud keeps one version every minute
* For the first 24 hours Nextcloud keeps one version every hour
* For the first 30 days Nextcloud keeps one version every day
* After the first 30 days Nextcloud keeps one version every week

The versions are adjusted along this pattern every time a new version is 
created.

The Versions app never uses more than 50% of the user's currently available 
free space. If the stored versions exceed this limit, Nextcloud deletes the 
oldest file versions until it meets the disk space limit again.

.. note:: Versions named by a user will never be deleted.

You may alter the default pattern in ``config.php``. The default setting is 
``auto``, which sets the default pattern::

 'versions_retention_obligation' => 'auto',

Additional options are:

* ``D, auto``   
    Keep versions at least for D days, apply expiration rules to all versions 
    that are older than D days

* ``auto, D``   
    Delete all versions that are older than D days automatically, delete other 
    versions according to expiration rules
 
* ``D1, D2``    
    Keep versions for at least D1 days and delete when they exceed D2 days.

* ``disabled``  
    Disable the Versions app; no old file versions will be deleted.

Background job
--------------

To delete expired versions a background jobs runs every 30 minutes. 
It's possible to deactivate the background job and setup a (system) cron to expire the versions via occ.

Deactivate background job: ``occ config:app:set --value=no files_versions background_job_expire_versions``

Activate background job: ``occ config:app:delete files_versions background_job_expire_versions``

Expire versions: ``occ versions:expire`` or ``occ versions:expire --quiet`` (without the progress bar)