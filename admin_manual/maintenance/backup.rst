===================
Backing up ownCloud
===================

To backup an ownCloud installation there are three main things you need to retain:

#. The config folder
#. The data folder
#. The database

Backup Folders
--------------

Simply copy your config and data folder (or even your whole ownCloud install and data folder) to a place outside of
your ownCloud environment. You could use this command::

    rsync -Aax owncloud/ owncloud-dirbkp_`date +"%Y%m%d"`/

Backup Database
---------------

MySQL/MariaDB
^^^^^^^^^^^^^

MySQL or MariaDB, which is a drop-in MySQL replacement, is the recommended 
database engine. To backup MySQL/MariaDB::

    mysqldump --lock-tables -h [server] -u [username] -p[password] [db_name] > owncloud-sqlbkp_`date +"%Y%m%d"`.bak

SQLite
^^^^^^
::

    sqlite3 data/owncloud.db .dump > owncloud-sqlbkp_`date +"%Y%m%d"`.bak

PostgreSQL
^^^^^^^^^^
::

    PGPASSWORD="password" pg_dump [db_name] -h [server] -U [username] -f owncloud-sqlbkp_`date +"%Y%m%d"`.bak

