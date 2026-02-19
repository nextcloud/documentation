=============================
Enabling MySQL 4-byte support
=============================

.. note::

    Be sure to backup your database before performing this database upgrade.

To be able to handle 4-byte characters with MySQL/MariaDB (like emojis in filenames or comments) 
it is recommended to enable 4-byte support in MySQL. If you're not sure if you need this, you 
should probably enable it. This is also the appropriate thing to do if you encounter errors such 
as ``Syntax error or access violation: 1071 Specified key was too long; max key length is 767 bytes``.

.. warning::

    This manual only covers versions of MySQL and MariaDB that are officially supported by Nextcloud. 
    See :doc:`../installation/system_requirements` for supported versions.

1. The following InnoDB setting should already be set on current versions of MySQL/MariaDB server::

.. code-block:: sql

   SHOW VARIABLES LIKE 'innodb_file_per_table';

The result should look like this::

    mysql> SHOW VARIABLES LIKE 'innodb_file_per_table';
    +-----------------------+-------+
    | Variable_name         | Value |
    +-----------------------+-------+
    | innodb_file_per_table | ON    |
    +-----------------------+-------+
    1 row in set (0.00 sec)

If it does not, you can change the parameter permanently by setting the following::

    [mysqld]
    innodb_file_per_table=1

Then restart the MySQL/MariaDB server to activate the changed configuration.

You can then verify that the change worked by repeating the ``SHOW`` command above.

2. Open a shell, change to your Nextcloud installation directory (adjust ``/var/www/nextcloud`` to your nextcloud location if needed), and put your nextcloud instance in maintenance mode, if it isn't already::

   $ cd /var/www/nextcloud
   $ sudo -E -u www-data php occ maintenance:mode --on

3. Change your databases character set and collation:

.. code-block:: sql

    ALTER DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

4. Set the ``mysql.utf8mb4`` config to true in your config.php::

    $ sudo -E -u www-data php occ config:system:set mysql.utf8mb4 --type boolean --value="true"

5. Convert all existing tables to the new collation by running the repair step::

    $ sudo -E -u www-data php occ maintenance:repair

.. note::

    This will also take care of changing the `ROW_FORMAT` to `DYNAMIC` for your tables.

6. Disable maintenance mode::

   $ sudo -E -u www-data php occ maintenance:mode --off

Now you should be able to use Emojis in your file names, calendar events, comments and many more.

.. note::

    Also make sure to review your :doc:`../maintenance/backup` strategy. If you use ``mysqldump`` make sure to add the ``--default-character-set=utf8mb4`` option. Otherwise your backups are broken and restoring them will result in ``?`` instead of the emojis and files may become inaccessible.
