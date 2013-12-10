Automatic Configuration
=======================

If you need to install ownCloud on multiple servers you normally do not want
to set-up each instance separately as described in the :doc:`configuration_database`.
For this reason the automatic configuration feature has been introduced.

To take advantage of this feature you need to create a configuration file, called
:file:`../owncloud/config/autoconfig.php` and set the parameters as required.
You can provide all parameters or just part of them - parameters which haven't been provided (if any) will be asked
at "Finish setup" screen at first run of ownCloud.

The :file:`../owncloud/config/autoconfig.php` will be automatically removed after the initial configuration has been applied.

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

Sample Automatic Configurations
-------------------------------

Data Directory
~~~~~~~~~~~~~~
With the configuration below the "Finish setup" screen still will ask for database and admin credentials settings.

.. code-block:: php

    <?php
    $AUTOCONFIG = array(
      "directory"     => "/www/htdocs/owncloud/data",
    );


SQLite Database
~~~~~~~~~~~~~~~
With the configuration below the "Finish setup" screen still will ask for data directory and admin credentials settings.

.. code-block:: php

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "sqlite",
      "dbname"        => "owncloud",
      "dbtableprefix" => "",
    );

MySQL Database
~~~~~~~~~~~~~~
Keep in mind that the automatic configuration does not unburden you from creating the database user and database
in advance, as described in :doc:`configuration_database`.

With the configuration below the "Finish setup" screen still will ask for data directory and admin credentials settings.

.. code-block:: php

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "mysql",
      "dbname"        => "owncloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
    );

PostgreSQL Database
~~~~~~~~~~~~~~~~~~~
Keep in mind that the automatic configuration does not unburden you from creating the database user and database
in advance, as described in :doc:`configuration_database`.

With the configuration below the "Finish setup" screen still will ask for data directory and admin credentials settings.

.. code-block:: php

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "pgsql",
      "dbname"        => "owncloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
    );
    
All Parameters
~~~~~~~~~~~~~~
Keep in mind that the automatic configuration does not unburden you from creating the database user and database
in advance, as described in :doc:`configuration_database`.

With the configuration below "Finish setup" will be skipped at first ownCloud run since all parameters are already preconfigured.

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

