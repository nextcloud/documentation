======
Backup
======

To backup a Nextcloud installation there are four main things you need to retain:

#. The config folder
#. The data folder
#. The theme folder
#. The database

Maintenance mode
----------------

``maintenance:mode`` locks the sessions of logged-in users and prevents new logins in order to prevent inconsistencies of your data. You must run ``occ`` as the HTTP user, like this example on Ubuntu Linux::

 $ sudo -u www-data php occ maintenance:mode --on

You may also put your server into this mode by editing :file:`config/config.php`.
Change ``"maintenance" => false`` to ``"maintenance" => true``:

::

   <?php

    "maintenance" => true,

Don't forget to change it back to ``false`` when you are finished.

Backup folders
--------------

Simply copy your config, data and theme folders (or even your whole Nextcloud install and data folder) to a place outside of
your Nextcloud environment. You could use this command::

    rsync -Aavx nextcloud/ nextcloud-dirbkp_`date +"%Y%m%d"`/

Backup database
---------------

.. warning:: Before restoring a backup see :doc:`restore`

MySQL/MariaDB
^^^^^^^^^^^^^

MySQL or MariaDB, which is a drop-in MySQL replacement, is the recommended
database engine. To backup MySQL/MariaDB::

    mysqldump --single-transaction -h [server] -u [username] -p[password] [db_name] > nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

If you use enabled MySQL/MariaDB 4-byte support (:doc:`../configuration_database/mysql_4byte_support`, needed for emoji), you will need to add ``--default-character-set=utf8mb4`` like this::

    mysqldump --single-transaction --default-character-set=utf8mb4 -h [server] -u [username] -p[password] [db_name] > nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

SQLite
^^^^^^
::

    sqlite3 data/owncloud.db .dump > nextcloud-sqlbkp_`date +"%Y%m%d"`.bak

PostgreSQL
^^^^^^^^^^
::

    PGPASSWORD="password" pg_dump [db_name] -h [server] -U [username] -f nextcloud-sqlbkp_`date +"%Y%m%d"`.bak
