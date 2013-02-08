Automatic Configuration
=======================

If you need to install ownCloud on multiple servers you normally do not want
to set-up each instance separately as described in the :doc:`configuration_database`. For this reason the automatic configuration feature has been introduced.

To take advantage of this feature you need to create a configuration file, called :file:`../owncloud/config/autoconfig.php` and set the parameters as required. The file will automatically be removed after the initial configuration has been applied.

Parameters
----------
You need to keep in mind that two parameters are named differently in this
configuration file compared to the normal :file:`config.php`.

+----------------+---------------+
| autoconfig.php | config.php    |
+================+===============+
| directory      | datadirectory |
+----------------+---------------+
| dbpass         | dbpassword    |
+----------------+---------------+

SQLite Database
~~~~~~~~~~~~~~~
.. code-block:: php

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "sqlite",
      "dbname"        => "owncloud",
      "dbtableprefix" => "",
      "directory"     => "/www/htdocs/owncloud/data",
    );

MySQL Database
~~~~~~~~~~~~~~
Keep in mind that the automatic configuration does not unburden you from creating the database user and database in advance, as described in :doc:`configuration_database`.

.. code-block:: php

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "mysql",
      "dbname"        => "owncloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
      "adminlogin"    => "root",
      "adminpass"     => "root-password",
      "directory"     => "/www/htdocs/owncloud/data",
    );

PostgreSQL Database
~~~~~~~~~~~~~~~~~~~
Keep in mind that the automatic configuration does not unburden you from creating the database user and database in advance, as described in :doc:`configuration_database`.

.. code-block:: php

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "pgsql",
      "dbname"        => "owncloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
      "adminlogin"    => "root",
      "adminpass"     => "root-password",
      "directory"     => "/www/htdocs/owncloud/data",
    );
