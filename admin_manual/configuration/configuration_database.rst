Database Configuration
======================

Owncloud requires a database where administrative data will be held. Four different database types are currently
supported, `MySQL <http://www.mysql.com/>`_, `MariaDB <https://mariadb.org/>`_, `SQLite <http://www.sqlite.org/>`_, and `PostgreSQL <http://www.postgresql.org/>`_. MySQL or MariaDB are the recommended database engines. By default SQLite is choosen because it is a file based database with the least administrative overhead.

.. note:: Because SQLite handles multiple users very badly SQLite is only recommended for single user ownCloud installations

Requirements
------------

If you decide to use MySQL, MariaDB, or PostgreSQL you need to install and set-up the
database first. These steps will not be covered by this description as they are easy to find elsewhere.

Parameters
----------

MySQL/MariaDB Database
~~~~~~~~~~~~~~~~~~~~~~

If you decide to use a MySQL or MariaDB database make sure that you have installed and
enabled the MySQL extension in PHP and that the **mysql.default_socket**
points to the correct socket (if the database runs on same server as ownCloud).

Please note that MariaDB is backwards compatible with MySQL, so all instructions will work for both. You will not need to replace mysql with anything.

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
  mysql.default_socket=/var/lib/mysql/mysql.sock  # debian squeeze: /var/run/mysqld/mysqld.sock
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

In the ownCloud configuration you need to set the hostname on which the
database is running and a valid username and password to access it.

.. code-block:: php

  <?php

    "dbtype"        => "mysql",
    "dbname"        => "owncloud",
    "dbuser"        => "username",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",
    "dbtableprefix" => "",

SQLite Database
~~~~~~~~~~~~~~~

If you decide to use a SQLite database make sure that you have installed and
enabled the SQLite extension in PHP. The PHP configuration in :file:`/etc/php5/conf.d/sqlite3.ini` could look like this:

.. code-block:: ini

  # configuration for PHP SQLite3 module
  extension=pdo_sqlite.so
  extension=sqlite3.so

It is not necessary to create a database and a database user in advance
because this will automatically be done by ownCloud when you login for the
first time.

In the ownCloud counfiguration in :file:`config/config.php` you need to set at least the **datadirectory** parameter to the directory where your data and database should be stored. No authentication is required to access the database therefore most of the default parameters could be taken as it:

.. code-block:: php

  <?php

    "dbtype"        => "sqlite",
    "dbname"        => "owncloud",
    "dbuser"        => "",
    "dbpassword"    => "",
    "dbhost"        => "",
    "dbtableprefix" => "",
    "datadirectory" => "/www/htdocs/owncloud/data",

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

In the ownCloud configuration you need to set the hostname on which the
database is running and a valid username (and sometimes a password) to
access it. If the database has been installed on the same server as
ownCloud a password is very often not required to access the database.

.. code-block:: php

  <?php

    "dbtype"        => "pgsql",
    "dbname"        => "owncloud",
    "dbuser"        => "username",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",
    "dbtableprefix" => "",

Oracle Database
~~~~~~~~~~~~~~~

If you are deploying to an Oracle database make sure that you have installed
and enabled the `Oracle extension <http://php.net/manual/en/book.oci8.php>`_ in PHP. The PHP configuration in :file:`/etc/php5/conf.d/oci8.ini` could look like this:

.. code-block:: ini

  # configuration for PHP Oracle extension
  extension=oci8.so

Make sure that the Oracle environment has been set up for the process trying to use the Oracle extension. For a local Oracle XE installation this can be done by exporting the following environment variables (eg. in :file:`/etc/apache2/envvars` for Apache)

.. code-block:: bash

  export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe
  export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ORACLE_HOME/lib

Installing and configuring Oracle support for PHP is way out of scope for this document. The official Oracle documentation called `The Underground PHP and Oracle Manual <http://www.oracle.com/technetwork/topics/php/underground-php-oracle-manual-098250.html>`_ should help you through the process.

Creating a database user for ownCloud can be done by using the sqlplus command line
interface or the Oracle Application Express web interface. The database tables will be created by ownCloud when you login for the first time.

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

In the ownCloud configuration you need to set the hostname on which the
database is running and a valid username and password to
access it. If the database has been installed on the same server as
ownCloud to config file could look like this:

.. code-block:: php

  <?php

    "dbtype"        => "oci",
    "dbname"        => "XE",
    "dbuser"        => "owncloud",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",

.. note:: This example assumes you are running an Oracle Express Edition on ``localhost``. The ``dbname`` is the name of the Oracle instance. For Oracle Express Edition it is always ``XE``. 

Trouble Shooting
----------------

How can I find out if my MySQL/PostgreSQL  server is reachable?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use the ping command to check the server availability::

  ping db.server.dom

::

  PING db.server.dom (ip-address) 56(84) bytes of data.
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=1 ttl=64 time=3.64 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=2 ttl=64 time=0.055 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=3 ttl=64 time=0.062 ms

How can I find out if a created user can access a database?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The easiet way to test if a database can be accessed is by starting the
command line interface:

**SQLite**::

  sqlite3 /www/htdocs/owncloud/data/owncloud.db

::

  sqlite> .version
  SQLite 3.7.15.1 2012-12-19 20:39:10 6b85b767d0ff7975146156a99ad673f2c1a23318
  sqlite> .quit

**MySQL**::

  mysql -uUSERNAME -p

::

  mysql> SHOW VARIABLES LIKE "version";
  +---------------+--------+
  | Variable_name | Value  |
  +---------------+--------+
  | version       | 5.1.67 |
  +---------------+--------+
  1 row in set (0.00 sec)
  mysql> quit

**PostgreSQL**::

  psql -Uusername -downcloud

::

  postgres=# SELECT version();
  PostgreSQL 8.4.12 on i686-pc-linux-gnu, compiled by GCC gcc (GCC) 4.1.3 20080704 (prerelease), 32-bit
  (1 row)
  postgres=# \q

**Oracle**::

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

  SQLite    : No database user is required.
  MySQL     : SELECT User,Host FROM mysql.user;
  PostgreSQL: SELECT * FROM pg_user;
  Oracle    : SELECT * FROM all_users;

**Show available Databases**::

  SQLite    : .databases (normally one database per file!)
  MySQL     : SHOW DATABASES;
  PostgreSQL: \l
  Oracle    : SELECT name FROM v$database; (requires DBA privileges)

**Show ownCloud Tables in Database**::

  SQLite    : .tables
  MySQL     : USE owncloud; SHOW TABLES;
  PostgreSQL: \c owncloud; \d
  Oracle    : SELECT table_name FROM user_tables;

**Quit Database**::

  SQLite    : .quit
  MySQL     : quit
  PostgreSQL: \q
  Oracle    : quit
