================
Restoring backup
================

To restore a Nextcloud installation there are four main things you need to
restore:

#. The configuration directory
#. The data directory
#. The database
#. The theme directory

.. note:: You must have both the database and data directory. You cannot
   complete restoration unless you have both of these.

Restore folders
---------------

.. note:: This guide assumes that your previous backup is called
   "nextcloud-dirbkp"

Simply copy your configuration and data folder (or even your whole Nextcloud
install and data folder) to your Nextcloud environment. You could use this command::

    rsync -Aax nextcloud-dirbkp/ nextcloud/

Restore database
----------------

.. warning:: Before restoring a backup you need to make sure to delete all existing database tables.

The easiest way to do this is to drop and recreate the database.
SQLite does this automatically.

MySQL
^^^^^

MySQL is the recommended database engine. To restore MySQL::

   mysql -h [server] -u [username] -p[password] -e "DROP DATABASE nextcloud"
   mysql -h [server] -u [username] -p[password] -e "CREATE DATABASE nextcloud"

If you use UTF8 with multibyte support (e.g. for emojis in filenames), use::

   mysql -h [server] -u [username] -p[password] -e "DROP DATABASE nextcloud"
   mysql -h [server] -u [username] -p[password] -e "CREATE DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci"


PostgreSQL
^^^^^^^^^^
::

     PGPASSWORD="password" psql -h [server] -U [username] -d template1 -c "DROP DATABASE \"nextcloud\";"
     PGPASSWORD="password" psql -h [server] -U [username] -d template1 -c "CREATE DATABASE \"nextcloud\";"

Restoring
---------

.. note:: This guide assumes that your previous backup is called
   "nextcloud-sqlbkp.bak"

MySQL
^^^^^

MySQL is the recommended database engine. To restore MySQL::

    mysql -h [server] -u [username] -p[password] [db_name] < nextcloud-sqlbkp.bak

SQLite
^^^^^^
::

    rm data/owncloud.db
    sqlite3 data/owncloud.db < nextcloud-sqlbkp.bak

PostgreSQL
^^^^^^^^^^
::

    PGPASSWORD="password" psql -h [server] -U [username] -d nextcloud -f nextcloud-sqlbkp.bak

Synchronising with clients after data recovery
----------------------------------------------

By default the Nextcloud server is considered the authorative source for the data.
If the data on the server and the client differs
clients will default to fetching the data from the server.

If the recovered backup is outdated
the state of the clients may be more up to date than the state of the server.
In this case also make sure to run the
:ref:`maintenance:data-fingerprint <maintenance_commands_label>` command
afterwards. 
It changes the logic of the synchronisation algorithm
to try an recover as much data as possible.
Files missing on the server are therefore recovered from the clients
and in case of different content the users will be asked.

.. note:: The usage of `maintenance:data-fingerprint` can cause conflict dialogues
   and difficulties deleting files on the client.
   Therefore it's only recommended to prevent dataloss if the backup was outdated.

If you are running multiple application servers you will need to make sure
the config files are synced between them so that the updated `data-fingerprint`
is applied on all instances.
