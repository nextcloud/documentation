Automatic Configuration Setup
=============================

If you need to install ownCloud on multiple servers, you normally do not want
to set up each instance separately as described in 
:doc:`../configuration_database/linux_database_configuration`.
For this reason, ownCloud provides an automatic configuration feature.

To take advantage of this feature, you must create a configuration file, called
:file:`../owncloud/config/autoconfig.php`, and set the file parameters as required.
You can specify any number of parameters in this file.  Any unspecified parameters appear on the "Finish setup" screen when you first launch ownCloud.

The :file:`../owncloud/config/autoconfig.php` is automatically removed after the initial configuration has been applied.

Parameters
----------
When configuring parameters, you must understand that two parameters are named differently in this configuration file when compared to the standard :file:`config.php` file.

+----------------+---------------+
| autoconfig.php | config.php    |
+================+===============+
| directory      | datadirectory |
+----------------+---------------+
| dbpass         | dbpassword    |
+----------------+---------------+

Automatic Configurations Examples
---------------------------------

The following sections provide sample automatic configuration examples and what information is requested at the end of the configuration.

Data Directory
~~~~~~~~~~~~~~
Using the following parameter settings, the "Finish setup" screen requests database and admin credentials settings.

::

    <?php
    $AUTOCONFIG = array(
      "directory"     => "/www/htdocs/owncloud/data",
    );


SQLite Database
~~~~~~~~~~~~~~~
Using the following parameter settings, the "Finish setup" screen requests data directory and admin credentials settings.

::

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "sqlite",
      "dbname"        => "owncloud",
      "dbtableprefix" => "",
    );

MySQL Database
~~~~~~~~~~~~~~
Using the following parameter settings, the "Finish setup" screen requests data directory and admin credentials settings.

::

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "mysql",
      "dbname"        => "owncloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
    );

.. note:: Keep in mind that the automatic configuration does not eliminate the need for 
   creating the  database user and database in advance, as described in 
   :doc:`../configuration_database/linux_database_configuration`.

PostgreSQL Database
~~~~~~~~~~~~~~~~~~~
Using the following parameter settings, the "Finish setup" screen requests data directory and admin credentials settings.

::

    <?php
    $AUTOCONFIG = array(
      "dbtype"        => "pgsql",
      "dbname"        => "owncloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
    );

.. note:: Keep in mind that the automatic configuration does not eliminate the need for 
   creating the database user and database in advance, as described in 
   :doc:`../configuration_database/linux_database_configuration`.

All Parameters
~~~~~~~~~~~~~~

Using the following parameter settings, because all parameters are already configured in the file, the ownCloud installation skips the "Finish setup" screen.

::

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

.. note:: Keep in mind that the automatic configuration does not eliminate the need for 
   creating the database user and database in advance, as described in 
   :doc:`../configuration_database/linux_database_configuration`.
   