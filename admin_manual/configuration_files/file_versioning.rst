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

The Versions app never uses more that 50% of the user's currently available 
free space. If the stored versions exceed this limit, Nextcloud deletes the 
oldest file versions until it meets the disk space limit again.

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
    Disable Versions; no files will be deleted.
