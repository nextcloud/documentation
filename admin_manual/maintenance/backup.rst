====================
Backing up Nextcloud
====================

To backup an Nextcloud installation there are four main things you need to retain:

#. The config folder
#. The data folder
#. The database
#. The theme folder

Backup Folders
--------------

Simply copy your config, data and theme folders (or even your whole Nextcloud install and data folder) to a place outside of
your Nextcloud environment. You could use this command::

    rsync -Aax nextcloud/ nextcloud-dirbkp_`date +"%Y%m%d"`/

Backup Database
---------------

.. warning:: Before restoring a backup see :doc:`restore`

MySQL/MariaDB
^^^^^^^^^^^^^

MySQL or MariaDB, which is a drop-in MySQL replacement, is the recommended 
database engine. To backup MySQL/MariaDB::

    mysqldump --lock-tables -h [server] -u [username] -p[password] [db_name] > nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

SQLite
^^^^^^
::

    sqlite3 data/owncloud.db .dump > nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

PostgreSQL
^^^^^^^^^^
::

    PGPASSWORD="password" pg_dump [db_name] -h [server] -U [username] -f nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

