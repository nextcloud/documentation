Config.php Parameters
=====================
ownCloud uses the ``config/config.php`` file to control server operations.
``config/config.sample.php`` lists all the configurable parameters within
ownCloud. This document provides a more detailed reference. Many options are
configurable on your Admin page, so it is usually not necessary to edit
``config/config.php``.

.. Generated content below. Don't change this.
.. DEFAULT_SECTION_START

.. DEFAULT_SECTION_END
.. Generated content above. Don't change this.

Default config.php Examples
---------------------------
When you use SQLite as your ownCloud database, your ``config.php`` looks like
this after installation. The SQLite database is stored in your ownCloud
``data/`` directory. SQLite is a simple, lightweight embedded database that
is good for testing and for simple installations, but for production ownCloud
systems you should use MySQL, MariaDB, or PosgreSQL.

::

  <?php
  $CONFIG = array (
    'instanceid' => 'occ6f7365735',
    'passwordsalt' => '2c5778476346786306303',
    'trusted_domains' =>
    array (
      0 => 'localhost',
      1 => 'studio',
    ),
    'datadirectory' => '/var/www/owncloud/data',
    'dbtype' => 'sqlite3',
    'version' => '7.0.2.1',
    'installed' => true,
  );

This example is from a new ownCloud installation using MariaDB::


  <?php
  $CONFIG = array (
    'instanceid' => 'oc8c0fd71e03',
    'passwordsalt' => '515a13302a6b3950a9d0fdb970191a',
    'trusted_domains' =>
    array (
      0 => 'localhost',
      1 => 'studio',
      2 => '192.168.10.155'
    ),
    'datadirectory' => '/var/www/owncloud/data',
    'dbtype' => 'mysql',
     'version' => '7.0.2.1',
    'dbname' => 'owncloud',
    'dbhost' => 'localhost',
    'dbtableprefix' => 'oc_',
    'dbuser' => 'oc_carla',
    'dbpassword' => '67336bcdf7630dd80b2b81a413d07',
    'installed' => true,
  );

.. Generated content below. Don't change this.
.. ALL_OTHER_SECTIONS_START
