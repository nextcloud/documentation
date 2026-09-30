===========================================
Enabling MySQL/MariaDB full Unicode support
===========================================

.. note::

    Be sure to back up your database before performing this database upgrade.

To store the full range of Unicode characters in Nextcloud, including emoji,
less-common writing systems, historic scripts, and specialized symbols, a
MySQL or MariaDB database must use the ``utf8mb4`` character set. The older
three-byte ``utf8`` character set cannot store characters outside `Unicode's
Basic Multilingual Plane <https://en.wikipedia.org/wiki/Plane_(Unicode)>`_.

.. warning::

    This guide applies only to MySQL 8 or newer and MariaDB 10.6 or newer.
    For a list of supported MySQL and MariaDB versions, see our
    :doc:`system requirements documentation <../installation/system_requirements>`.

1. Make sure the following InnoDB setting is enabled on your database server::

    [mysqld]
    innodb_file_per_table=1

2. Restart the database server if you changed the configuration in step 1.

You can then verify that the change worked:

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

3. Open a shell, change to the Nextcloud installation directory (adjust
   ``/var/www/nextcloud`` as needed), and enable maintenance mode if it is not
   already enabled::

   $ cd /var/www/nextcloud
   $ sudo -E -u www-data php occ maintenance:mode --on

4. Change the database character set to ``utf8mb4`` and set its default
   collation:

.. code-block:: sql

    ALTER DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

.. note::

    The character set determines which characters can be stored. The collation
    determines how text is compared and sorted.

5. Enable ``utf8mb4`` support in the Nextcloud system configuration::

    $ sudo -E -u www-data php occ config:system:set mysql.utf8mb4 --type boolean --value="true"

6. Run the repair command to convert the existing tables to the ``utf8mb4``
   character set and collation::

    $ sudo -E -u www-data php occ maintenance:repair

.. note::

    This also changes the ``ROW_FORMAT`` of all tables to ``DYNAMIC``.

7. Disable maintenance mode::

   $ sudo -E -u www-data php occ maintenance:mode --off

Now you should be able to use Emojis in your file names, calendar events, comments and many more.
Nextcloud can now use the full range of Unicode characters - such as emojis - in file names,
calendar events, and comments.

.. note::

    Make sure your backup strategy supports ``utf8mb4``. If you use
    ``mysqldump``, add the ``--default-character-set=utf8mb4`` option.
    Otherwise, four-byte Unicode characters may not be preserved correctly
    when the backup is restored. (A common symptom of this problem is the
    appearance of ``?`` instead of emojis in text and file names).
