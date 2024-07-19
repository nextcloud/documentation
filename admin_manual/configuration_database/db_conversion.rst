========================
Converting database type
========================

You can convert a SQLite database to a better performing MySQL, MariaDB or
PostgreSQL database with the Nextcloud command line tool. SQLite is good for
testing and simple single-user Nextcloud servers, but it does not scale for
multiple-user production servers.


Run the conversion
------------------

Conversion consists of two steps:

1. Establishing the target database (including its credentials)
2. Triggering the conversion tool which migrates the contents of the existing database to the target database

Establishing the target database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

First create up the target (new) database (along with its associated username and password) by following the manual database configuration instructions for your chosen target database type: 

* :ref:`db-config-mysql-label`
* :ref:`db-config-postgresql-label`

Since the above db instructions uses the database name ``nextcloud`` for the newly created database we will do so here for consistency, but you are free to use whatever database name you prefer. Use
the database name, database username, and database password you specified when creating the new database.

Triggering the conversion
~~~~~~~~~~~~~~~~~~~~~~~~~

The ``occ db:convert-type`` command handles all the tasks of the conversion. The following are the parameters available:

::

  php occ db:convert-type [options] type username hostname database

``type`` should be the target database type. The same values are available here as for the ``config.php`` ``dbtype`` parameter. It should be one of: ``mysql`` for MariaDB/MySQL, 
``pgsql`` for PostgreSQL, or ``oci`` for Oracle.

The options:

* ``--port="3306"``                       the database port (optional) [defaults to "3306"]
* ``--password="mysql_user_password"``    password for the new database. If omitted the tool will ask you (optional)
* ``--clear-schema``                      clear schema (optional)
* ``--all-apps``                          by default, tables for enabled apps are converted, use to convert also tables of deactivated apps (optional)
* ``-n, --no-interaction``                do not ask any interactive question

.. note:: The conversion tool searches for apps in your configured app folders and uses
   the schema (table) definitions in the apps to create the new tables. Any tables that still exist for removed
   apps will not be converted (even with option ``--all-apps``).

Let's convert our existing (functioning) sqlite3 installation to be MariaDB/MySQL based:

::

  php occ db:convert-type --password="<password>" --port="3306" --all-apps mysql <username> <hostname> nextcloud

.. note:: It was unnecessary to specify the port in this example because ``3306`` is already the default. We did so 
   merely for demonstration purposes and completeness in case the reader is using a non-standard port on their target 
   database server.

On success the converter will automatically configure the new database in your
Nextcloud config ``config.php``.

If you are converting to a MySQL/MariaDB database, you will also want to set ``mysql.utf8mb4`` parameter to true in your ``config.php``:

::

   php occ config:system:set mysql.utf8mb4 --type boolean --value="true"

If you like, you can view the changes that were made by looking for the ``db*`` parameters in your ``config.php`` (you could also use this command before 
doing the conversion to compare your configuration before/after):

::

   grep db config/config.php

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
