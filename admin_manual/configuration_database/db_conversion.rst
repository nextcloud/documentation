========================
Converting database type
========================

You can convert a SQLite database to a better performing MySQL, MariaDB or
PostgreSQL database with the Nextcloud command line tool. SQLite is good for
testing and simple single-user Nextcloud servers, but it does not scale for
multiple-user production users.


Run the conversion
------------------

First set up the new database, here called "new_db_name".
In Nextcloud root folder call

::

  php occ db:convert-type [options] type username hostname database

The Options

* ``--port="3306"``                       the database port (optional)
* ``--password="mysql_user_password"``    password for the new database. If omitted the tool will ask you (optional)
* ``--clear-schema``                      clear schema (optional)
* ``--all-apps``                          by default, tables for enabled apps are converted, use to convert also tables of deactivated apps (optional)

*Note:* The converter searches for apps in your configured app folders and uses
the schema definitions in the apps to create the new table. So tables of removed
apps will not be converted even with option ``--all-apps``

For example

::

  php occ db:convert-type --all-apps mysql oc_mysql_user 127.0.0.1 new_db_name

To successfully proceed with the conversion, you must type ``yes`` when prompted
with the question ``Continue with the conversion?``

On success the converter will automatically configure the new database in your
Nextcloud config ``config.php``.

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
