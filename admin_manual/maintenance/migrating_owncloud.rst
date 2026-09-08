=======================
Migrating from ownCloud
=======================


.. note:: Especially when migrating from ownCloud to Nextcloud you should
          create a backup of the config, database and the data directory,
          in case something goes wrong.

Currently migrating from ownCloud is like performing a manual update.
So it is quite easy, to migrate from one ownCloud version to at least one Nextcloud version.
However this does only work with versions that are sufficiently compatible in database schema and codebase.
See the table below for a version map, where migrating is easily possible:

+-------------------+-------------------------------+
| ownCloud          | Nextcloud                     |
+===================+===============================+
| 10.13.x           | 34.0.0                        |
| 10.14.x           | 34.0.0                        |
| 10.15.x           | 34.0.0                        |
| 10.16.x           | 34.0.0                        |
+-------------------+-------------------------------+

.. note:: Since ownCloud does not and will not support PHP 8.0 or higher, you
          need to upgrade your PHP instance first, after which, ownCloud won't
          be accessible anymore. See :doc:`../installation/system_requirements`
          about PHP versions supported by Nextcloud. We urge you to migrate to
          Nextcloud since PHP versions prior PHP 8 are end of life, see
          `<https://www.php.net/supported-versions.php>`_.

1. First download the correct version of Nextcloud from our `releases page <https://nextcloud.com/changelog/>`_,

2. Make sure to have do a :doc:`backup<backup>` before migrating.

3. Upgrade PHP to a version supported by the downloaded Nextcloud version.

4. Follow the upgrade instructions described in the :doc:`manual_upgrade` manual.

5. Run the following commands after ``occ upgrade``:

  * ``occ db:convert-filecache-bigint``
  * ``occ db:add-missing-columns``
  * ``occ db:add-missing-indices``
  * ``occ db:add-missing-primary-keys``

6. If system cron was used, please verify if crontab entry was using the command ``occ system:cron``.
   If yes, please adjust it to use the ``php`` command instead according to :ref:`the background jobs configuration documentation<system-cron-configuration-label>`

7. In case, use the :doc:`Nextcloud built-in updater<update>` to update your instance to the newest version.
   This must be done for every major version, since updates between multiple major versions are not supported.

8. If multiple major version upgrades are done, it might be needed to upgrade PHP again in between.

9. Make sure to also verify the "Security & setup warnings" in the "Overview" section on the settings page.

10. In some cases, apps installed from the ownCloud Market might have been disabled as incompatible
    (ex: calendar and contacts), so you should reinstall the Nextcloud ones using
    ``occ app:enable calendar``, ``occ app:enable contacts``, etc
