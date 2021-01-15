=============================
Enabling MySQL 4-byte support
=============================

.. note::

    Be sure to backup your database before performing this database upgrade.

In order to use Emojis (textbased smilies) on your Nextcloud server with a MySQL database, the
installation needs to be tweaked a bit.

.. note::

    This manual only covers MySQL 8 or newer and MariaDB 10.3 or newer. If you use an older version, please check an older version of the documentation

1. Make sure the following InnoDB settings are set on your MySQL server::

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

2. Open a shell, change dir (adjust ``/var/www/nextcloud`` to your nextcloud location if needed), and put your nextcloud instance in maintenance mode, if it isn't already::

   $ cd /var/www/nextcloud
   $ sudo -u www-data php occ maintenance:mode --on

3. Restart the MySQL server in case you changed the configuration in step 1.
4. Change your databases character set and collation::

    ALTER DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

5. Set the ``mysql.utf8mb4`` config to true in your config.php::

    $ sudo -u www-data php occ config:system:set mysql.utf8mb4 --type boolean --value="true"

6. Convert all existing tables to the new collation by running the repair step::

    $ sudo -u www-data php occ maintenance:repair

.. note::

    This will also change the `ROW_FORMAT` to `COMPRESSED` for your tables, to make sure the used database storage size is not getting out of hand.

7. Disable maintenance mode::

   $ sudo -u www-data php occ maintenance:mode --off

Now you should be able to use Emojis in your file names, calendar events, comments and many more.

.. note::

    Also make sure your backup strategy still work. If you use ``mysqldump`` make sure to add the ``--default-character-set=utf8mb4`` option. Otherwise your backups are broken and restoring them will result in ``?`` instead of the emojis, making files inaccessible.
