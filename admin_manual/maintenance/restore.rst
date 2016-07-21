===================
Restoring Nextcloud
===================

To restore a Nextcloud installation there are four main things you need to
restore:

#. The configuration directory
#. The data directory
#. The database
#. The theme directory

.. note:: You must have both the database and data directory. You cannot
   complete restoration unless you have both of these.

When you have completed your restoration, see the ``Setting Strong Directory
Permissions`` section of :doc:`../installation/installation_wizard`.

Restore Folders
---------------

.. note:: This guide assumes that your previous backup is called
   "nextcloud-dirbkp"

Simply copy your configuration and data folder (or even your whole Nextcloud
install and data folder) to your Nextcloud environment. You could use this command::

    rsync -Aax nextcloud-dirbkp/ nextcloud/

Restore Database
----------------

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

    PGPASSWORD="password" pg_restore -c -d nextcloud -h [server] -U [username]
    nextcloud-sqlbkp.bak
