=======================
Upgrade to Nextcloud 28
=======================

System requirements
-------------------

* PHP 8.3 is now supported, but 8.2 is recommended.

To be documented

Monitoring
----------

Beginning with Nextcloud 28, the monitoring endpoint no longer provides information about available app updates, as gathering the data always involves at least one external request to apps.nextcloud.com.

You can still ask the monitoring endpoint to show new app updates by using the URL parameter skipApps=false. However, please do not check this endpoint too often.

https://github.com/nextcloud/serverinfo#api