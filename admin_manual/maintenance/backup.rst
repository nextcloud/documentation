===================
Backing up Nextcloud
===================

To backup an Nextcloud installation there are three main things you need to retain:

#. The config folder
#. The data folder
#. The database

Backup Folders
--------------

Simply copy your config and data folder (or even your whole Nextcloud install and data folder) to a place outside of
your Nextcloud environment. You could use this command::

    rsync -Aax nextcloud/ nextcloud-dirbkp_`date +"%Y%m%d"`/

Backup Database
---------------

MySQL/MariaDB
^^^^^^^^^^^^^

MySQL or MariaDB, which is a drop-in MySQL replacement, is the recommended 
database engine. To backup MySQL/MariaDB::

    mysqldump --lock-tables -h [server] -u [username] -p[password] [db_name] > nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

SQLite
^^^^^^
::

    sqlite3 data/nextcloud.db .dump > nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

PostgreSQL
^^^^^^^^^^
::

    PGPASSWORD="password" pg_dump [db_name] -h [server] -U [username] -f nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

