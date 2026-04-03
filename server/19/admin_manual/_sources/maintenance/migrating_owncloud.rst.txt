=======================
Migrating from ownCloud
=======================


.. note:: Especially when migrating from ownCloud to Nextcloud you should
          create a backup of the config, database and the data directory,
          in case something goes wrong.

Currently migrating from ownCloud is like performing a manual update.
So it is quite easy, to migrate from one ownCloud version to at least one Nextcloud version.
However this does only work with versions that are close enough database and code-wise.
See the table below for a version map, where migrating is easily possible:

+-------------------+------------------------------+
| ownCloud          | Nextcloud                    |
+===================+==============================+
| 10.0.5 or later   | 20.0.x (but at least 20.0.5) |
+-------------------+------------------------------+
| 10.0.1 - 10.0.5   | 12.0.x (but at least 12.0.1) |
+-------------------+------------------------------+
| 10.0.0            | 12.0.0                       |
+-------------------+------------------------------+
| 9.1.x             | 10.0.x                       |
+-------------------+------------------------------+
| 9.0.x             | 10.0.x                       |
+-------------------+------------------------------+
| 9.0.x             | 9.0.x                        |
+-------------------+------------------------------+


.. note:: While we understand, that you want to migrate as soon as possible,
          we also don't want to put your data at risk. Since we never know
          what ownCloud changes in a future release, we only allow migrations
          from versions that where released before our last maintenance release,
          so we can at least perform some basic migration tests, before you
          migrate your production instance.

1. First download the correct version of Nextcloud from our `older releases page <https://nextcloud.com/changelog/>`_,

2. Make sure to have do a :doc:`backup<backup>` before migrating.

3. Follow the upgrade instructions described in the :doc:`manual_upgrade` manual.

4. When migrating to Nextcloud 20.0 or later, you will also need to run the following commands after ``occ upgrade``:

  * ``occ db:convert-filecache-bigint``
  * ``occ db:add-missing-columns``
  * ``occ db:add-missing-indices``
  * ``occ db:add-missing-primary-keys``

5. If system cron was used, please verify if crontab entry was using the command ``occ system:cron``. If yes, please adjust it to use the ``php`` command instead according to :ref:`the background jobs configuration documentation<system-cron-configuration-label>`

6. Use the :doc:`Nextcloud built-in updater<update>` to update your instance to the newest version.

7. Make sure to also verify the "Security & setup warnings" in the "Overview" section on the settings page.
