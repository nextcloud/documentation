Database Configuration
======================

To get ownCloud up-an-running it is necessary to choose a database in which all
administrative data should be held. Three different database type are currently
supported, `SQLite <http://www.sqlite.org/>`_, `MySQL <http://www.mysql.com/>`_ and `PostgreSQL <http://www.postgresql.org/>`_. By default SQLite is choosen because it is a file based database with the least administrative overhead.

.. note:: Because SQLite handles multiple users not very well sqlite is only recommended for single user ownCloud installations

Requirements
------------

If you decide to use MySQL or PostgreSQL you need to install and set-up the
database first. These steps will not be covered by this description.

Parameters
----------

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

MySQL Database
~~~~~~~~~~~~~~
If you decide to use a MySQL database make sure that you have installed and
enabled the MySQL extension in PHP and that the **mysql.default_socket**
points to the correct socket (if the database runs on same server as ownCloud).
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
  mysql.default_socket=/var/lib/mysql/mysql.sock
  mysql.default_host=
  mysql.default_user=
  mysql.default_password=
  mysql.connect_timeout=60
  mysql.trace_mode=Off

Now you need to create a database user and the database itself by using the
MySQL command line interface. The database tables will be created by ownCloud
when you login for the first time.

To start the get into the mysql command line mode use::

  mysql -uroot -p

Then a **mysql>** prompt will appear. Now enter the following lines and confirm them with the enter key:

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

To start the get into the postgres command line mode use::

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

Useful SQL commands
~~~~~~~~~~~~~~~~~~~

**Show Database Users**::

  SQLite    : No database user is required.
  MySQL     : SELECT User,Host FROM mysql.user;
  PostgreSQL: SELECT * from pg_user;

**Show available Databases**::

  SQLite    : .databases (normally one database per file!)
  MySQL     : SHOW DATABASES;
  PostgreSQL: \l

**Show ownCloud Tables in Database**::

  SQLite    : .tables
  MySQL     : USE owncloud; SHOW TABLES;
  PostgreSQL: \c owncloud; \d

**Quit Database**::

  SQLite    : .quit
  MySQL     : quit
  PostgreSQL: \q
