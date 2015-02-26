Database Configuration
======================

ownCloud requires a database in which administrative data is stored. The following databases are currently supported:

* `MySQL <http://www.mysql.com/>`_ / `MariaDB <https://mariadb.org/>`_
* `PostgreSQL <http://www.postgresql.org/>`_
* `Oracle <http://www.oracle.com/>`_

The MySQL or MariaDB databases are the recommended database engines.

Requirements
------------

Choosing to use MySQL / MariaDB, PostgreSQL, or Oracle as your database requires that you install and set up the server software first.

.. note:: The steps for configuring a third party database are beyond the scope of this document.  Please refer to the documentation for your specific database choice for instructions.

Parameters
----------
For setting up ownCloud to use any database, use the instructions in :doc:`../installation/installation_wizard`. You should not have to edit the respective values in the :file:`config/config.php`.  However, in special cases (for example, if you want to connect your ownCloud instance to a database created by a previous installation of ownCloud), some modification might be required.

Configuring a MySQL or MariaDB Database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you decide to use a MySQL or MariaDB database, ensure the following:

* That you have installed and enabled the MySQL extension in PHP

* That the **mysql.default_socket** points to the correct socket (if the database runs on same server as ownCloud).

.. note:: MariaDB is backwards compatible with MySQL.  All instructions work for both. You will not need to replace mysql with anything.

The PHP configuration in :file:`/etc/php5/conf.d/mysql.ini` could look like this:

.. code-block:: ini

  # configuration for PHP MySQL module
  extension=pdo_mysql.so
  extension=mysql.so

  [mysql]
  mysql.allow_local_infile=On
  mysql.allow_persistent=On
  mysql.cache_size=2000
  mysql.max_persistent=-1
  mysql.max_links=-1
  mysql.default_port=
  mysql.default_socket=/var/lib/mysql/mysql.sock  # Debian squeeze: /var/run/mysqld/mysqld.sock
  mysql.default_host=
  mysql.default_user=
  mysql.default_password=
  mysql.connect_timeout=60
  mysql.trace_mode=Off

Now you need to create a database user and the database itself by using the
MySQL command line interface. The database tables will be created by ownCloud
when you login for the first time.

To start the MySQL command line mode use::

  mysql -uroot -p

Then a **mysql>** or **MariaDB [root]>** prompt will appear. Now enter the following lines and confirm them with the enter key:

.. code-block:: sql

  CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
  CREATE DATABASE IF NOT EXISTS owncloud;
  GRANT ALL PRIVILEGES ON owncloud.* TO 'username'@'localhost' IDENTIFIED BY 'password';

You can quit the prompt by entering::

  quit

An ownCloud instance configured with MySQL would contain the hostname on which
the database is running, a valid username and password to access it, and the
name of the database. The :file:`config/config.php` as created by the
:doc:`../installation/installation_wizard` would therefore contain entries like
this:

.. code-block:: php

  <?php

    "dbtype"        => "mysql",
    "dbname"        => "owncloud",
    "dbuser"        => "username",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",
    "dbtableprefix" => "oc_",


PostgreSQL Database
~~~~~~~~~~~~~~~~~~~

If you decide to use a PostgreSQL database make sure that you have installed
and enabled the PostgreSQL extension in PHP. The PHP configuration in :file:`/etc/php5/conf.d/pgsql.ini` could look
like this:

.. code-block:: ini

  # configuration for PHP PostgreSQL module
  extension=pdo_pgsql.so
  extension=pgsql.so

  [PostgresSQL]
  pgsql.allow_persistent = On
  pgsql.auto_reset_persistent = Off
  pgsql.max_persistent = -1
  pgsql.max_links = -1
  pgsql.ignore_notice = 0
  pgsql.log_notice = 0

The default configuration for PostgreSQL (at least in Ubuntu 14.04) is to use the peer authentication method. Check :file:`/etc/postgresql/9.3/main/pg_hba.conf` to find out which authentication method is used in your setup.
To start the postgres command line mode use::

  sudo -u postgres psql -d template1

Then a **template1=#** prompt will appear. Now enter the following lines and confirm them with the enter key:

.. code-block:: sql

  CREATE USER username CREATEDB;
  CREATE DATABASE owncloud OWNER username;

You can quit the prompt by entering::

  \q

An ownCloud instance configured with PostgreSQL would contain the path to the socket on
which the database is running as the hostname, the system username the php process is using,
and an empty password to access it, and the name of the database. The :file:`config/config.php` as 
created by the :doc:`../installation/installation_wizard` would therefore contain entries like
this:

.. code-block:: php

  <?php

    "dbtype"        => "pgsql",
    "dbname"        => "owncloud",
    "dbuser"        => "username",
    "dbpassword"    => "",
    "dbhost"        => "/var/run/postgresql",
    "dbtableprefix" => "oc_",

.. note:: The host actually points to the socket that is used to connect to the database. Using localhost here will not work if postgreSQL is configured to use peer authentication. Also note, that no password is specified, because this authentication method doesn't use a password.

If you use another authentication method (not peer), you'll need to use the following steps to get the database setup:
Now you need to create a database user and the database itself by using the
PostgreSQL command line interface. The database tables will be created by
ownCloud when you login for the first time.

To start the postgres command line mode use::

  psql -hlocalhost -Upostgres

Then a **postgres=#** prompt will appear. Now enter the following lines and confirm them with the enter key:

.. code-block:: sql

  CREATE USER username WITH PASSWORD 'password';
  CREATE DATABASE owncloud TEMPLATE template0 ENCODING 'UNICODE';
  ALTER DATABASE owncloud OWNER TO username;
  GRANT ALL PRIVILEGES ON DATABASE owncloud TO username;

You can quit the prompt by entering::

  \q

An ownCloud instance configured with PostgreSQL would contain the hostname on
which the database is running, a valid username and password to access it, and
the name of the database. The :file:`config/config.php` as created by the
:doc:`../installation/installation_wizard` would therefore contain entries like
this:

.. code-block:: php

  <?php

    "dbtype"        => "pgsql",
    "dbname"        => "owncloud",
    "dbuser"        => "username",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",
    "dbtableprefix" => "oc_",

Oracle Database
~~~~~~~~~~~~~~~

If you are deploying to an Oracle database make sure that you have installed
and enabled the `Oracle extension <http://php.net/manual/en/book.oci8.php>`_ in PHP. The PHP configuration in
:file:`/etc/php5/conf.d/oci8.ini` could look like this:

.. code-block:: ini

  # configuration for PHP Oracle extension
  extension=oci8.so

Make sure that the Oracle environment has been set up for the process trying to use the Oracle extension.
For a local Oracle XE installation this can be done by exporting the following environment variables
(eg. in :file:`/etc/apache2/envvars` for Apache)

.. code-block:: bash

  export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe
  export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ORACLE_HOME/lib

Installing and configuring Oracle support for PHP is way out of scope for this document.
The official Oracle documentation called `The Underground PHP and Oracle Manual <http://www.oracle.com/technetwork/topics/php/underground-php-oracle-manual-098250.html>`_
should help you through the process.

Creating a database user for ownCloud can be done by using the sqlplus command line interface
or the Oracle Application Express web interface.
The database tables will be created by ownCloud when you login for the first time.

To start the Oracle command line mode with a DBA account use::

  sqlplus system AS SYSDBA

After entering the password a **SQL>** prompt will appear. Now enter the following lines and confirm them with the enter key:

.. code-block:: sql

  CREATE USER owncloud IDENTIFIED BY password;
  ALTER USER owncloud DEFAULT TABLESPACE users
                      TEMPORARY TABLESPACE temp
                      QUOTA unlimited ON users;
  GRANT create session
      , create table
      , create procedure
      , create sequence
      , create trigger
      , create view
      , create synonym
      , alter session
     TO owncloud;

.. note:: In Oracle creating a user is the same as creating a database in other RDBMs, so no ``CREATE DATABASE`` statement is necessary.

You can quit the prompt by entering::

  exit

An ownCloud instance configured with Oracle would contain the hostname on which
the database is running, a valid username and password to access it, and the
name of the database. The :file:`config/config.php` as created by the
:doc:`../installation/installation_wizard` would therefore contain entries like
this:

.. code-block:: php

  <?php

    "dbtype"        => "oci",
    "dbname"        => "XE",
    "dbuser"        => "owncloud",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",

.. note:: This example assumes you are running an Oracle Express Edition on
          ``localhost``. The ``dbname`` is the name of the Oracle instance.
          For Oracle Express Edition it is always ``XE``.

Troubleshooting
---------------

How can I find out if my MySQL/PostgreSQL server is reachable?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To check the server's network availability, use the ping command on
the server's host name (db.server.com in this example)::

  ping db.server.dom

::

  PING db.server.dom (ip-address) 56(84) bytes of data.
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=1 ttl=64 time=3.64 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=2 ttl=64 time=0.055 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=3 ttl=64 time=0.062 ms

For a more detailed check whether the access to the database server software
itself works correctly, see the next question.

How can I find out if a created user can access a database?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The easiest way to test if a database can be accessed is by starting the
command line interface:

**MySQL**:

Assuming the database server is installed on the same sytem you're running,
the command from, use::

  mysql -uUSERNAME -p

To acess a MySQL installation on a different machine, add the -h option with
the respective host name::

  mysql -uUSERNAME -p -h HOSTNAME

::

  mysql> SHOW VARIABLES LIKE "version";
  +---------------+--------+
  | Variable_name | Value  |
  +---------------+--------+
  | version       | 5.1.67 |
  +---------------+--------+
  1 row in set (0.00 sec)
  mysql> quit

**PostgreSQL**:

Assuming the database server is installed on the same sytem you're running
the command from, use::

  psql -Uusername -downcloud

To acess a MySQL installation on a different machine, add the -h option with
the respective host name::

  psql -Uusername -downcloud -h HOSTNAME

::

  postgres=# SELECT version();
  PostgreSQL 8.4.12 on i686-pc-linux-gnu, compiled by GCC gcc (GCC) 4.1.3 20080704 (prerelease), 32-bit
  (1 row)
  postgres=# \q

**Oracle**:

On the machine where your Oracle database is installed, type::

  sqlplus username

::

  SQL> select * from v$version;

  BANNER
  --------------------------------------------------------------------------------
  Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production
  PL/SQL Release 11.2.0.2.0 - Production
  CORE	11.2.0.2.0	Production
  TNS for Linux: Version 11.2.0.2.0 - Production
  NLSRTL Version 11.2.0.2.0 - Production

  SQL> exit

Useful SQL commands
~~~~~~~~~~~~~~~~~~~

**Show Database Users**::

  MySQL     : SELECT User,Host FROM mysql.user;
  PostgreSQL: SELECT * FROM pg_user;
  Oracle    : SELECT * FROM all_users;

**Show available Databases**::

  MySQL     : SHOW DATABASES;
  PostgreSQL: \l
  Oracle    : SELECT name FROM v$database; (requires DBA privileges)

**Show ownCloud Tables in Database**::

  MySQL     : USE owncloud; SHOW TABLES;
  PostgreSQL: \c owncloud; \d
  Oracle    : SELECT table_name FROM user_tables;

**Quit Database**::

  MySQL     : quit
  PostgreSQL: \q
  Oracle    : quit

