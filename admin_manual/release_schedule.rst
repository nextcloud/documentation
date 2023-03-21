================================
Maintenance and release schedule
================================

You can find the detailed schedule for major and maintenance releases at: `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Major releases
--------------

Major releases are typically scheduled once every 4 months with the first 10 weeks being the development phase followed by freeze phase with four beta release, two RCs and one final each one with an interval of 1 week. Specific dates for each release can be found on `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Major releases are planned to be actively maintained for 12 months after their initial release. For long term support options check out the `Nextcloud Subscription <https://nextcloud.com/enterprise/>`_ offered by `Nextcloud GmbH <https://nextcloud.com>`_.

Maintenance releases
--------------------

Maintenance releases are scheduled in a 4 week cycle with one week before the release date having the freeze and RC 1.

Critical changes
----------------

* PHP 7.4 is not supported anymore. Please upgrade to PHP 8.0 or higher.
* PHP 8.2 is now supported.
* The recommended webserver configuration has changed to no longer include a default redirect to the login page
    * For Apache this change will automatically come with the ``.htaccess`` file provided by the release
    * for nginx administrators should ensure that their config is up to date with the `documentation <https://docs.nextcloud.com/server/latest/admin_manual/installation/nginx.html>`_
        * The relevant lines to remove are ``error_page 403 /core/templates/403.php;`` and ``error_page 404 /core/templates/404.php;``

You can find important documentation for app developers here: https://docs.nextcloud.com/server/latest/developer_manual/app_publishing_maintenance/app_upgrade_guide/index.html
Each document lists a link to the breaking changes of the corresponding release.

.. TODO ON RELEASE: Update version number above on release
