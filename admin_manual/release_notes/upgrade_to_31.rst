=======================
Upgrade to Nextcloud 31
=======================

System requirements
-------------------

* PHP 8.1 is now deprecated but still supported.
* PHP 8.4 is now supported, but 8.3 is recommended.

Database configuration
----------------------

Other row formats than ``DYNAMIC`` for MySQL and MariaDB databases will `issue a warning since Nextcloud 24 <https://github.com/nextcloud/server/issues/34497>`_,
as they often cause performance issues.
With Nextcloud 31 a `more prominent new setup warning <https://github.com/nextcloud/server/pull/48547>`_ for this was added.

The row format can be changed via ``ALTER TABLE`` DDL commands during a maintenance window.
Changing the row format from ``COMPRESSED`` to ``DYNAMIC`` requires about 2x the disk space and may take a long time depending on the size of the database.
See the `MySQL documentation <https://dev.mysql.com/doc/refman/en/innodb-row-format.html>`_ for more information.
If you're not sure how to do this, you can `find some tips and tricks from the community <https://help.nextcloud.com/t/upgrade-to-nextcloud-hub-10-31-0-0-incorrect-row-format-found-in-your-database/218366/>`_.

PHP configuration
-----------------

We have a new setup warning to check if the memory reserved for APCu is high enough.
If you see this warning, you should increase the memory reserved for APCu.
You can do this by increasing the value of the ``apc.shm_size`` directive in your ``php.ini`` file.
It is generally advised to review this value and increase it if necessary depending on your instance size.

Nextcloud configuration
-----------------------

Maximum chunk size
^^^^^^^^^^^^^^^^^^

We have adjusted the default maximum chunk size for big file uploading.
Previously it was set to 10MiB, it is now increased to 100MiB.

Also the configuration was moved from an app configuration to the system configuration (``config.php``).
If you set up a custom value previously the value will be automatically migrated to the system configuration during the update.
But if you need to set a new custom value you need now to use the system configuration, see also :ref:`files_configure_max_chunk_size`.

Monitoring: Counting of active users
------------------------------------

Starting with Nextcloud 31.0.6 the monitoring app was adjusted to count the active users in the same way as occ user:report and the support app.

Previews
--------

Starting with Nextcloud 31.0.10, the preview provider for MP3 files, which reads cover images embedded in the files, is disabled by default for performance and stability reasons.
See :doc:`../configuration_files/previews_configuration` for details on how to enable or disable the preview provider.

AppAPI (app_api) is now a default app
-------------------------------------

Starting with Nextcloud 30.0.1, the AppAPI app is included and enabled by default. See :doc:`../exapps_management/index` for details.

You can disable this app in the standard manner via the *Apps* menu if you do not expect to use AppAPI integrations in the near future.

If AppAPI is disabled, other apps that depend on it will not be visible in the app store. AppAPI-related setup checks will also be deactivated.
