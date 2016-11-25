=============================
Enabling MySQL 4-byte support
=============================

.. note:: This feature is currently **experimental**.

In order to use Emojis on your Nextcloud server with a MySQL database, the
installation needs to be tweaked a bit.

1. Update your Nextcloud server to Nextcloud 11 or later.
2. Make sure the following InnoDB settings are set on your MySQL server::

    [mysqld]
    innodb_large_prefix=true
    innodb_file_format=barracuda
    innodb_file_per_table=true

3. Restart the MySQL server in case you changed the configuration in step 2.
4. Change your databases character set and collation::

    ALTER DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

5. Set the ``mysql.utf8mb4`` config to true in your config.php::

    $ sudo -u www-data occ config:system:set mysql.utf8mb4 --type boolean --value="true"

6. Convert all existing tables to the new collation by running the repair step::

    $ sudo -u www-data occ maintenance:repair

Now you should be able to use emojis like ``🎉`` in your file names, calendar events, comments and many more.
