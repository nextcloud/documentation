==================
Restoring ownCloud
==================

To restore an ownCloud installation there are three main things you need to 
restore:

#. The configuration directory
#. The data directory
#. The database

.. note:: You must have both the database and data directory. You cannot 
   complete restoration unless you have both of these.

When you have completed your restoration, see the ``Setting Strong Directory 
Permissions`` section of :doc:`../installation/installation_wizard`.

Restore Folders
---------------

.. note:: This guide assumes that your previous backup is called 
   "owncloud-dirbkp"

Simply copy your configuration and data folder (or even your whole ownCloud 
install and 
data folder) to your ownCloud environment. You could use this command::

    rsync -Aax owncloud-dirbkp/ owncloud/

Restore Database
----------------

.. note:: This guide assumes that your previous backup is called 
   "owncloud-sqlbkp.bak"

MySQL
^^^^^

MySQL is the recommended database engine. To restore MySQL::

    mysql -h [server] -u [username] -p[password] [db_name] < owncloud-sqlbkp.bak

SQLite
^^^^^^
::

    rm data/owncloud.db
    sqlite3 data/owncloud.db < owncloud-sqlbkp.bak

PostgreSQL
^^^^^^^^^^
::

    PGPASSWORD="password" pg_restore -c -d owncloud -h [server] -U [username] 
    owncloud-sqlbkp.bak
