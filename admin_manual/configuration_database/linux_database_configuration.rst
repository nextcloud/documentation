======================
Database Configuration
======================

Nextcloud requires a database in which administrative data is stored. The following databases are currently supported:

* `MySQL <http://www.mysql.com/>`_ / `MariaDB <https://mariadb.org/>`_
* `PostgreSQL <http://www.postgresql.org/>`_
* `Oracle <http://www.oracle.com/>`_

The MySQL or MariaDB databases are the recommended database engines.

Requirements
------------

Choosing to use MySQL / MariaDB, PostgreSQL, or Oracle as your database
requires that you install and set up the server software first.

.. note:: The steps for configuring a third party database are beyond the
  scope of this document.  Please refer to the documentation for your specific
  database choice for instructions.

.. _db-binlog-label:

MySQL / MariaDB with Binary Logging Enabled
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Nextcloud is currently using a ``TRANSACTION_READ_COMMITTED`` transaction isolation
to avoid data loss under high load scenarios (e.g. by using the sync client with
many clients/users and many parallel operations). This requires a disabled or
correctly configured binary logging when using MySQL or MariaDB. Your system is
affected if you see the following in your log file during the installation or
update of Nextcloud:

 An unhandled exception has been thrown:
 exception 'PDOException' with message 'SQLSTATE[HY000]: General error: 1665 
 Cannot execute statement: impossible to write to binary log since 
 BINLOG_FORMAT = STATEMENT and at least one table uses a storage engine limited 
 to row-based logging. InnoDB is limited to row-logging when transaction 
 isolation level is READ COMMITTED or READ UNCOMMITTED.'

There are two solutions. One is to disable binary logging. Binary logging 
records all changes to your database, and how long each change took. The 
purpose of binary logging is to enable replication and to support backup 
operations.

The other is to change the BINLOG_FORMAT = STATEMENT in your database 
configuration file, or possibly in your database startup script, to 
BINLOG_FORMAT = MIXED. See `Overview of the Binary 
Log <https://mariadb.com/kb/en/mariadb/overview-of-the-binary-log/>`_ and `The 
Binary Log <https://dev.mysql.com/doc/refman/5.6/en/binary-log.html>`_ for 
detailed information.

.. _db-transaction-label:

Database "READ COMMITED" transaction isolation level
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As discussed above Nextcloud is using the ``TRANSACTION_READ_COMMITTED`` transaction isolation
level. Some database configurations are enforcing other transaction isolation levels. To avoid
data loss under high load scenarios (e.g. by using the sync client with many clients/users and
many parallel operations) you need to configure the transaction isolation level accordingly.
Please refer to the `MySQL manual <https://dev.mysql.com/doc/refman/5.7/en/set-transaction.html>`_
for detailed information.

Parameters
----------
For setting up Nextcloud to use any database, use the instructions in :doc:`../installation/installation_wizard`. You should not have to edit the respective values in the :file:`config/config.php`.  However, in special cases (for example, if you want to connect your Nextcloud instance to a database created by a previous installation of Nextcloud), some modification might be required.

Configuring a MySQL or MariaDB Database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you decide to use a MySQL or MariaDB database, ensure the following:

* That you have installed and enabled the pdo_mysql extension in PHP

* That the **mysql.default_socket** points to the correct socket (if the database runs on the same server as Nextcloud).

.. note:: MariaDB is backwards compatible with MySQL.  All instructions work for both. You will not need to replace mysql with anything.

The PHP configuration in :file:`/etc/php5/conf.d/mysql.ini` could look like this:

::

  # configuration for PHP MySQL module
  extension=pdo_mysql.so

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
MySQL command line interface. The database tables will be created by Nextcloud
when you login for the first time.

To start the MySQL command line mode use::

  mysql -uroot -p

Then a **mysql>** or **MariaDB [root]>** prompt will appear. Now enter the following lines and confirm them with the enter key:

::

  CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
  CREATE DATABASE IF NOT EXISTS nextcloud;
  GRANT ALL PRIVILEGES ON nextcloud.* TO 'username'@'localhost' IDENTIFIED BY 'password';

You can quit the prompt by entering::

  quit

An Nextcloud instance configured with MySQL would contain the hostname on which
the database is running, a valid username and password to access it, and the
name of the database. The :file:`config/config.php` as created by the
:doc:`../installation/installation_wizard` would therefore contain entries like
this:

::

  <?php

    "dbtype"        => "mysql",
    "dbname"        => "nextcloud",
    "dbuser"        => "username",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",
    "dbtableprefix" => "oc_",


PostgreSQL Database
~~~~~~~~~~~~~~~~~~~

If you decide to use a PostgreSQL database make sure that you have installed
and enabled the PostgreSQL extension in PHP. The PHP configuration in :file:`/etc/php5/conf.d/pgsql.ini` could look
like this:

::

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

::

  CREATE USER username CREATEDB;
  CREATE DATABASE nextcloud OWNER username;

You can quit the prompt by entering::

  \q

An Nextcloud instance configured with PostgreSQL would contain the path to the socket on
which the database is running as the hostname, the system username the PHP process is using,
and an empty password to access it, and the name of the database. The :file:`config/config.php` as 
created by the :doc:`../installation/installation_wizard` would therefore contain entries like
this:

::

  <?php

    "dbtype"        => "pgsql",
    "dbname"        => "nextcloud",
    "dbuser"        => "username",
    "dbpassword"    => "",
    "dbhost"        => "/var/run/postgresql",
    "dbtableprefix" => "oc_",

.. note:: The host actually points to the socket that is used to connect to the database. Using localhost here will not work if postgreSQL is configured to use peer authentication. Also note, that no password is specified, because this authentication method doesn't use a password.

If you use another authentication method (not peer), you'll need to use the following steps to get the database setup:
Now you need to create a database user and the database itself by using the
PostgreSQL command line interface. The database tables will be created by
Nextcloud when you login for the first time.

To start the postgres command line mode use::

  psql -hlocalhost -Upostgres

Then a **postgres=#** prompt will appear. Now enter the following lines and confirm them with the enter key:

::

  CREATE USER username WITH PASSWORD 'password';
  CREATE DATABASE nextcloud TEMPLATE template0 ENCODING 'UNICODE';
  ALTER DATABASE nextcloud OWNER TO username;
  GRANT ALL PRIVILEGES ON DATABASE nextcloud TO username;

You can quit the prompt by entering::

  \q

An Nextcloud instance configured with PostgreSQL would contain the hostname on
which the database is running, a valid username and password to access it, and
the name of the database. The :file:`config/config.php` as created by the
:doc:`../installation/installation_wizard` would therefore contain entries like
this:

::

  <?php

    "dbtype"        => "pgsql",
    "dbname"        => "nextcloud",
    "dbuser"        => "username",
    "dbpassword"    => "password",
    "dbhost"        => "localhost",
    "dbtableprefix" => "oc_",

.. _db-troubleshooting-label:

Troubleshooting
---------------

How to workaround General error: 2006 MySQL server has gone away
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The database request takes too long and therefore the MySQL server times out. Its 
also possible that the server is dropping a packet that is too large. Please 
refer to the manual of your database for how to raise the configuration options 
``wait_timeout`` and/or ``max_allowed_packet``.

Some shared hosters are not allowing the access to these config options. For such
systems Nextcloud is providing a ``dbdriveroptions`` configuration option within your
:file:`config/config.php` where you can pass such options to the database driver.
Please refer to :doc:`../configuration_server/config_sample_php_parameters` for an example.

How can I find out if my MySQL/PostgreSQL server is reachable?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

Assuming the database server is installed on the same system you're running
the command from, use::

  mysql -uUSERNAME -p

To access a MySQL installation on a different machine, add the -h option with
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

Assuming the database server is installed on the same system you're running
the command from, use::

  psql -Uusername -dnextcloud

To access a MySQL installation on a different machine, add the -h option with
the respective host name::

  psql -Uusername -dnextcloud -h HOSTNAME

::

  postgres=# SELECT version();
  PostgreSQL 8.4.12 on i686-pc-linux-gnu, compiled by GCC gcc (GCC) 4.1.3 20080704 (prerelease), 32-bit
  (1 row)
  postgres=# \q


Useful SQL commands
~~~~~~~~~~~~~~~~~~~

**Show Database Users**::

  MySQL     : SELECT User,Host FROM mysql.user;
  PostgreSQL: SELECT * FROM pg_user;

**Show available Databases**::

  MySQL     : SHOW DATABASES;
  PostgreSQL: \l

**Show Nextcloud Tables in Database**::

  MySQL     : USE nextcloud; SHOW TABLES;
  PostgreSQL: \c nextcloud; \d

**Quit Database**::

  MySQL     : quit
  PostgreSQL: \q
