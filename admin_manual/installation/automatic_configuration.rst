==============================================
Automated installation with ``autoconfig.php``
==============================================

Use :file:`config/autoconfig.php` to prefill, or fully automate, the web-based
initial setup of Nextcloud. This is useful when installing multiple identical
or similar instances.

Create :file:`config/autoconfig.php` and include the installation parameters
that you want to prefill. Any values not provided in the file can be completed
in the setup form when you first launch Nextcloud.

To complete the installation without interaction, provide a valid database
configuration, data directory, and both ``adminlogin`` and ``adminpass``.
Otherwise, Nextcloud displays the setup form so that missing or invalid values
can be corrected.

Nextcloud removes :file:`config/autoconfig.php` after a successful
installation. The file remains in place if installation fails.

.. note:: The supplied database account must be able to connect to the database
   server and have sufficient privileges for the selected configuration.
   Depending on the database backend and the account's privileges, Nextcloud may
   create the database and a dedicated database user. Alternatively, create the
   database and database user in advance, and grant the user the required
   privileges, as described in
   :doc:`../configuration_database/linux_database_configuration`.

.. warning:: ``autoconfig.php`` commonly contains plaintext database and
   administrator passwords. Restrict access to the file before writing secrets
   to it. If installation fails, remove the file or rotate any exposed secrets.

Parameters
----------

The following parameters are commonly used:

* ``directory`` (written to :file:`config.php` as ``datadirectory``)
* ``dbtype``, ``dbname``, ``dbuser``, ``dbpass``, ``dbhost``, and
  ``dbtableprefix``
* ``adminlogin`` and ``adminpass``
* optionally, ``trusted_domains`` and ``adminemail``

Two parameters have different names from their corresponding
:file:`config.php` settings:

+--------------------+-------------------+
| ``autoconfig.php`` | ``config.php``    |
+====================+===================+
| ``directory``      | ``datadirectory`` |
+--------------------+-------------------+
| ``dbpass``         | ``dbpassword``    |
+--------------------+-------------------+

Examples
--------

The following examples show partial and complete automatic configurations.

Data Directory
^^^^^^^^^^^^^^

This configuration prefills the data directory. Complete the database and
administrator-account settings in the setup form.

.. code-block:: php

    <?php
    $AUTOCONFIG = [
      "directory"     => "/www/htdocs/nextcloud/data",
    ];


SQLite database
^^^^^^^^^^^^^^^

This configuration prefills the SQLite database settings. Complete the data
directory and administrator-account settings in the setup form.

.. code-block:: php

    <?php
    $AUTOCONFIG = [
      "dbtype"        => "sqlite",
      "dbname"        => "nextcloud",
      "dbtableprefix" => "",
    ];

MySQL / MariaDB database
^^^^^^^^^^^^^^^^^^^^^^^^

This configuration prefills the MySQL or MariaDB settings. Complete the data
directory and administrator-account settings in the setup form.

.. code-block:: php

    <?php
    $AUTOCONFIG = [
      "dbtype"        => "mysql",
      "dbname"        => "nextcloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
    ];

PostgreSQL database
^^^^^^^^^^^^^^^^^^^

This configuration prefills the PostgreSQL settings. Complete the data
directory and administrator-account settings in the setup form.

.. code-block:: php

    <?php
    $AUTOCONFIG = [
      "dbtype"        => "pgsql",
      "dbname"        => "nextcloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
    ];

Complete non-interactive setup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When all required values are present and valid, the installation proceeds
without requiring user interaction.

The following configuration bypasses the setup form:

.. code-block:: php

    <?php
    $AUTOCONFIG = [
      "dbtype"        => "mysql",
      "dbname"        => "nextcloud",
      "dbuser"        => "username",
      "dbpass"        => "password",
      "dbhost"        => "localhost",
      "dbtableprefix" => "",
      "adminlogin"    => "root",
      "adminpass"     => "root-password",
      "directory"     => "/www/htdocs/nextcloud/data",
    ];

