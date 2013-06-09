Backing Up ownCloud
================================

To backup an ownCloud installation there are three main things you need to retain:

#. The config folder
#. The data folder
#. The database (found in the data folder for sqlite installs)

To restore an ownCloud instance:

#. Extract ownCloud to your webserver
#. Copy over your config folder with your backed up config folder
#. Copy over your data folder with your backed up data folder
#. Import your database
#. Update config.php of any changes to your database connection

Backup Folders
------

Simply copy your config and data folder(or even your whole ownCloud install and data folder) to a place outside of your ownCloud environment.

Backup Database
------

MySQL
^^^^^

MySQL is the recommended database engine. To backup MySQL:

    mysqldump --lock-tables -u [username] -p[password] > owncloud.sql

SQLite
^^^^^

    sqlite3 owncloud.db .dump > owncloud.bak

PostgreSQL
^^^^^

    pg_dump owncloud > owncloud.bak
