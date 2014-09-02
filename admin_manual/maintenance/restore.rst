Restoring ownCloud
==================

To restore an ownCloud installation there are three main things you need to restore:

#. The config folder
#. The data folder
#. The database

Restore Folders
---------------

.. note:: This guide assumes that your previous backup is called "owncloud-dirbkp"

Simply copy your config and data folder (or even your whole ownCloud install and data folder) to 
your ownCloud environment. You could use this command::

    rsync -Aax owncloud-dirbkp/ owncloud/

Restore Database
----------------

.. note:: This guide assumes that your previous backup is called "owncloud-sqlbkp.bak"

MySQL
^^^^^

MySQL is the recommended database engine. To backup MySQL::

    mysql -h [server] -u [username] -p[password] [db_name] < owncloud-sqlbkp.bak

SQLite
^^^^^^
::

    sqlite3 data/owncloud.db .dump < owncloud-sqlbkp.bak

PostgreSQL
^^^^^^^^^^
::

    PGPASSWORD="password" pg_restore -c -d owncloud -h [server] -U [username] owncloud-sqlbkp.bak

