=============================
Enabling MySQL 4-byte support
=============================

.. note:: This feature is currently **experimental**.

In order to use Emojis (textbased smilies) on your Nextcloud server with a MySQL database, the
installation needs to be tweaked a bit.

1. Update your Nextcloud server to Nextcloud 11 or later.
2. Make sure the following InnoDB settings are set on your MySQL server::

    [mysqld]
    innodb_large_prefix=on
    innodb_file_format=barracuda
    innodb_file_per_table=1

3. Restart the MySQL server in case you changed the configuration in step 2.
4. Change your databases character set and collation::

    ALTER DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

5. Set the ``mysql.utf8mb4`` config to true in your config.php::

    $ sudo -u www-data occ config:system:set mysql.utf8mb4 --type boolean --value="true"

6. Convert all existing tables to the new collation by running the repair step::

    $ sudo -u www-data occ maintenance:repair

Now you should be able to use Emojis in your file names, calendar events, comments and many more.

MariaDB support
===============

.. note:: This is even more **experimental**.

1. Follow MySQL steps 1, 2 and 3

2. Figure out whether the file formate was changed to Barracuda::

    MariaDB> SELECT NAME, SPACE, FILE_FORMAT FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME like "nextcloud%";

If the file format is "Barracuda" for every single table, nothing is left to do. Continue with the MySQL instructions. While testing, all tables' file format was "Antelope".

3. The tables needs to be migrated to "Barracuda" manually, one by one. SQL commands can be created easily, however::

    MariaDB> USE INFORMATION_SCHEMA;
    MariaDB> SELECT CONCAT("ALTER TABLE `", TABLE_SCHEMA,"`.`", TABLE_NAME, "` ROW_FORMAT=DYNAMIC;") AS MySQLCMD FROM TABLES WHERE TABLE_SCHEMA = "nextcloud";

This will return an SQL command for each table in the nextcloud database. The rows can be quickly copied into a text editor, the "|"s replaced and the SQL commands copied back to the MariaDB shell. If no error appeared (in doubt check step 2) all is done and nothing is left to do here. It can be proceded with the MySQL steps.

4. It is possible, however, that some tables cannot be altered. The operations fails with: "ERROR 1478 (HY000): Table storage engine 'InnoDB' does not support the create option 'ROW_FORMAT'". In that case the failing tables have a SPACE value of 0 in step 2. It basically means that the table does not have an index file of its own, which is required for the Barracuda format. This can be solved with a slightly different SQL command::

    MariaDB> ALTER TABLE `nextcloud`.`oc_tablename` ROW_FORMAT=DYNAMIC, ALGORITHM=COPY;

Replace oc_tablename with the failing table. If there are too many (did not happen here), SQL commands can be generated in a batch (task for the reader).

Now everything should be fine and the MySQL instructions should be proceeded.

