=============================
Enabling MySQL 4-byte support
=============================

.. note::

    Be sure to backup your database before performing this database upgrade.

In order to use Emojis (textbased smilies) on your Nextcloud server with a MySQL database, the
installation needs to be tweaked a bit.

1. Make sure your database is set to use the Barracuda InnoDB file format:
   
   Login to your mysql database and run::
   
         mysql> show variables like 'innodb_file_format';
         +--------------------+-----------+
         | Variable_name      | Value     |
         +--------------------+-----------+
         | innodb_file_format | Barracuda |
         +--------------------+-----------+
         1 row in set (0.00 sec)
      
   If your `innodb_file_format` is set as 'Antelope' you must upgrade your file format using::
     
         mysql> SET GLOBAL innodb_file_format=Barracuda;
     
   .. note::
   
         On some shared hosts, you may not have the permissions to upgrade the InnoDB file format, meaning you are unable to use utf8mb4

2. Make sure the following InnoDB settings are set on your MySQL server:

   a. MySQL 8.0 or later::

        [mysqld]
        innodb_file_per_table=1
        
      Note::
      
            mysql> show variables like 'innodb_file_per_table';
            +-----------------------+-------+
            | Variable_name         | Value |
            +-----------------------+-------+
            | innodb_file_per_table | ON    |
            +-----------------------+-------+
            1 row in set (0.00 sec)

   b. MySQL older than 8.0::

        [mysqld]
        innodb_large_prefix=true
        innodb_file_format=barracuda
        innodb_file_per_table=1

3. Restart the MySQL server in case you changed the configuration in step 1.
4. Change your databases character set and collation::

    ALTER DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

5. Set the ``mysql.utf8mb4`` config to true in your config.php::

    $ sudo -u www-data php occ config:system:set mysql.utf8mb4 --type boolean --value="true"

6. Convert all existing tables to the new collation by running the repair step::

    $ sudo -u www-data php occ maintenance:repair

Now you should be able to use Emojis in your file names, calendar events, comments and many more.

.. note::

    Also make sure your backup strategy still work. If you use ``mysqldump`` make sure to add the ``--default-character-set=utf8mb4`` option. Otherwise your backups are broken and restoring them will result in ``?`` instead of the emojis, making files inaccessible.

MariaDB support
---------------

MariaDB 10.3 or later
=====================
1. Make sure the following InnoDB settings are set on your MariaDB server::

    [mysqld]
    innodb_file_per_table=1

2. Continue at step 2 of the MySQL instructions.


MariaDB 10.2 or earlier
=======================

.. note::

    All mysql statements have to be executed as privileged database user. (Using "normal" nextcloud database user will result in empty query sets due to missing privileges for INFORMATION_SCHEMA database.)

1. Make sure the following InnoDB settings are set on your MySQL server::

    [mysqld]
    innodb_large_prefix=true
    innodb_file_format=barracuda
    innodb_file_per_table=1

2. Restart the MariaDB server in case you changed the configuration in step 1.

3. Figure out whether the file format was changed to Barracuda::

    MariaDB> SELECT NAME, SPACE, FILE_FORMAT FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME like "nextcloud%";

If the file format is "Barracuda" for every single table, nothing special is left to do. Continue with the MySQL instructions at step 3. While testing, all tables' file format was "Antelope".

4. The tables needs to be migrated to "Barracuda" manually, one by one. SQL commands can be created easily, however::

    MariaDB> USE INFORMATION_SCHEMA;
    MariaDB> SELECT CONCAT("ALTER TABLE `", TABLE_SCHEMA,"`.`", TABLE_NAME, "` ROW_FORMAT=DYNAMIC;") AS MySQLCMD FROM TABLES WHERE TABLE_SCHEMA = "nextcloud";

This will return an SQL command for each table in the nextcloud database. The rows can be quickly copied into a text editor, the "|"s replaced and the SQL commands copied back to the MariaDB shell. If no error appeared (in doubt check step 2) all is done and nothing is left to do here. It can be proceded with the MySQL instructions from step 3 onwards.

5. It is possible, however, that some tables cannot be altered. The operations fails with: "ERROR 1478 (HY000): Table storage engine 'InnoDB' does not support the create option 'ROW_FORMAT'". In that case the failing tables have a SPACE value of 0 in step 2. It basically means that the table does not have an index file of its own, which is required for the Barracuda format. This can be solved with a slightly different SQL command::

    MariaDB> ALTER TABLE `nextcloud`.`oc_tablename` ROW_FORMAT=DYNAMIC, ALGORITHM=COPY;

Replace oc_tablename with the failing table. If there are too many (did not happen here), SQL commands can be generated in a batch (task for the reader).

6. Now everything should be fine and the MySQL instructions can be followed from step 3 onwards
