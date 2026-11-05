====================================
Convert to a different database type
====================================

You can convert a server to another database configuration with the Nextcloud command line tool.

This can be used to convert to a more scalable database. SQLite is good for testing and simple single-user Nextcloud servers, but it does not scale for multiple-user production servers.


Run the conversion
------------------

Conversion consists of two steps:

1. Establishing the target database (including its credentials)
2. Triggering the conversion tool which migrates the contents of the existing database to the target database

Establishing the target database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

First create up the target (new) database (along with its associated username and password) by following the manual database configuration instructions for your chosen target database type:

* :ref:`db-config-mysql-label`
* :ref:`db-config-postgresql-label`

Since the above db instructions uses the database name ``nextcloud`` for the newly created database we will do so here for consistency, but you are free to use whatever database name you prefer. Use
the database name, database username, and database password you specified when creating the new database.

Triggering the conversion
~~~~~~~~~~~~~~~~~~~~~~~~~

The ``occ db:convert-type`` command handles all the tasks of the conversion. The following are the parameters available:

::

  sudo -E -u www-data php occ db:convert-type [options] newConfigFile

``newConfigFile`` should be the name of a second ``config.php`` file stored in the same location as the servers ``config.php`` file with the new database parameters.
Ensure that the new config file has the same permissions so that it is protected appropriately.

The options:

* ``--clear-schema``                      clear schema (optional)
* ``--all-apps``                          by default, tables for enabled apps are converted, use to convert also tables of deactivated apps (optional)
* ``--chunk-size``                        the maximum number of database rows to handle in a single query to limit memory use during conversion (optional, default 1000)
* ``-n, --no-interaction``                do not ask any interactive question

.. note:: The conversion tool searches for apps in your configured app folders and uses
   the schema (table) definitions in the apps to create the new tables. Any tables that still exist for removed
   apps will not be converted (even with option ``--all-apps``).

Let's convert our existing (functioning) sqlite3 installation to be MariaDB/MySQL based:

::

  sudo -E -u www-data php occ db:convert-type --all-apps newConfig.php

After conversion, replace your ``config.php`` with the new config file.

Inconvertible tables
--------------------

If you updated your Nextcloud instance, there might be remnants of old tables
which are not used any more. The updater will tell you which ones these are.

::


  The following tables will not be converted:
  oc_permissions
  ...

You can ignore these tables.
Here is a list of known old tables:

* oc_calendar_calendars
* oc_calendar_objects
* oc_calendar_share_calendar
* oc_calendar_share_event
* oc_fscache
* oc_log
* oc_media_albums
* oc_media_artists
* oc_media_sessions
* oc_media_songs
* oc_media_users
* oc_permissions
* oc_privatedata - this table was later added again by the app `privatedata` (https://apps.nextcloud.com/apps/privatedata) and is safe to be removed if that app is not enabled
* oc_queuedtasks
* oc_sharing
