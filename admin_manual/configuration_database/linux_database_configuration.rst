======================
Database configuration
======================

Nextcloud requires a database in which administrative data is stored. The following databases are currently supported:

* `MySQL <https://www.mysql.com/>`_ / `MariaDB <https://mariadb.org/>`_
* `PostgreSQL <https://www.postgresql.org/>`_
* `Oracle <http://www.oracle.com/>`_

The MySQL or MariaDB databases are the recommended database engines.

Requirements
------------

Choosing to use MySQL / MariaDB, PostgreSQL, or Oracle as your database
requires that you install and set up the server software first.

.. note:: The steps for configuring a third party database are beyond the
  scope of this document.  Please refer to the documentation for your specific
  database choice for instructions.

.. _db-transaction-label:

Database "READ COMMITTED" transaction isolation level
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

As discussed above Nextcloud is using the ``TRANSACTION_READ_COMMITTED`` transaction isolation
level. Some database configurations are enforcing other transaction isolation levels. To avoid
data loss under high load scenarios (e.g. by using the sync client with many clients/users and
many parallel operations) you need to configure the transaction isolation level accordingly.
Please refer to the `MySQL manual <https://dev.mysql.com/doc/refman/5.7/en/set-transaction.html>`_
for detailed information.

Parameters
----------
For setting up Nextcloud to use any database, use the instructions in :doc:`../installation/installation_wizard`. You should not have to edit the respective values in the :file:`config/config.php`.  However, in special cases (for example, if you want to connect your Nextcloud instance to a database created by a previous installation of Nextcloud), some modification might be required.

Configuring a MySQL or MariaDB database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you decide to use a MySQL or MariaDB database, ensure the following:

* The transaction isolation level is set to "READ-COMMITTED" in your MariaDB server configuration :file:`/etc/mysql/my.cnf` to persist even after a restart of your database server.

  Verify the **transaction_isolation** and **binlog_format**:

::

  [mysqld]
  ...
  character_set_server = utf8mb4
  collation_server = utf8mb4_general_ci
  transaction_isolation = READ-COMMITTED
  binlog_format = ROW
  ...

Please refer to the `page in the MySQL manual <https://mariadb.com/kb/en/library/set-transaction/#read-committed>`_.

* That you have installed and enabled the pdo_mysql extension in PHP

* That the **mysql.default_socket** points to the correct socket (if the database runs on the same server as Nextcloud).

.. note:: MariaDB is backwards compatible with MySQL.  All instructions work for both. You will not need to replace mysql with anything.

Now you need to create a database user and the database itself by using the
MySQL command line interface. The database tables will be created by Nextcloud
when you login for the first time.

To start the MySQL command line mode use::

  mysql -uroot -p

Then a **mysql>** or **MariaDB [root]>** prompt will appear. Now enter the following lines and confirm them with the enter key:

::

  CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
  CREATE DATABASE IF NOT EXISTS nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
  GRANT ALL PRIVILEGES on nextcloud.* to 'username'@'localhost';
  FLUSH privileges;

You can quit the prompt by entering::

  quit;

A Nextcloud instance configured with MySQL would contain the hostname on which
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

In case of UTF8MB4 you will also find::

    "mysql.utf8mb4" => true,

SSL for MySQL Database
^^^^^^^^^^^^^^^^^^^^^^

Enabling SSL is only necessary if your database does not reside on the same server as your Nextcloud instance.
If you do not connect over localhost and need to allow remote connections then you should enable SSL.
This just covers the SSL database configuration on the Nextcloud server. First you need to configure your database server accordingly.

::

  'dbdriveroptions' => [
    \PDO::MYSQL_ATTR_SSL_KEY => '/../ssl-key.pem',
    \PDO::MYSQL_ATTR_SSL_CERT => '/../ssl-cert.pem',
    \PDO::MYSQL_ATTR_SSL_CA => '/../ca-cert.pem',
    \PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
  ],

Adjust the paths to the pem files for your environment.

PostgreSQL database
^^^^^^^^^^^^^^^^^^^

In order to run Nextcloud securely on PostgreSQL, it is assumed that only 
Nextcloud uses this database and thus only one user accesses the database.
For further services and users, we recommend to create a separate
database or PostgreSQL instance.

If you decide to use a PostgreSQL database make sure that you have installed
and enabled the PostgreSQL extension **pdo_pgsql** in PHP.

The default configuration for PostgreSQL (at least in Ubuntu 14.04) is to use the peer authentication method. Check :file:`/etc/postgresql/9.3/main/pg_hba.conf` to find out which authentication method is used in your setup.
To start the postgres command line mode use::

  sudo -u postgres psql -d template1

Then a **template1=#** prompt will appear. Now enter the following lines and confirm them with the enter key:

::

  CREATE USER username CREATEDB;
  CREATE DATABASE nextcloud OWNER username TEMPLATE template0 ENCODING 'UTF8';
  GRANT CREATE ON SCHEMA public TO username;

You can quit the prompt by entering::

  \q

A Nextcloud instance configured with PostgreSQL would contain the path to the socket on
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

.. note:: The host actually points to the socket that is used to connect to the database. Using localhost here will not work if postgreSQL is configured to use peer authentication. Also note that no password is specified, because this authentication method doesn't use a password.

If you use another authentication method (not peer), you'll need to use the following steps to get the database setup:
Now you need to create a database user and the database itself by using the
PostgreSQL command line interface. The database tables will be created by
Nextcloud when you login for the first time.

To start the postgres command line mode use::

  psql -hlocalhost -Upostgres

Then a **postgres=#** prompt will appear. Now enter the following lines and confirm them with the enter key:

::

  CREATE USER username WITH PASSWORD 'password' CREATEDB;
  CREATE DATABASE nextcloud TEMPLATE template0 ENCODING 'UTF8';
  ALTER DATABASE nextcloud OWNER TO username;
  GRANT ALL PRIVILEGES ON DATABASE nextcloud TO username;
  GRANT ALL PRIVILEGES ON SCHEMA public TO username;

You can quit the prompt by entering::

  \q

A Nextcloud instance configured with PostgreSQL would contain the hostname on
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

How to work around "general error: 2006 MySQL server has gone away"
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The database request takes too long and therefore the MySQL server times out. It's
also possible that the server is dropping a packet that is too large. Please
refer to the manual of your database for how to raise the configuration options
``wait_timeout`` and/or ``max_allowed_packet``.

Some shared hosters are not allowing the access to these config options. For such
systems Nextcloud is providing a ``dbdriveroptions`` configuration option within your
:file:`config/config.php` where you can pass such options to the database driver.
Please refer to :doc:`../configuration_server/config_sample_php_parameters` for an example.

How can I find out if my MySQL/PostgreSQL server is reachable?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To check the server's network availability, use the ping command on
the server's host name (db.server.com in this example)::

  ping db.server.com

::

  PING db.server.com (ip-address) 56(84) bytes of data.
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=1 ttl=64 time=3.64 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=2 ttl=64 time=0.055 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=3 ttl=64 time=0.062 ms

For a more detailed check whether the access to the database server software
itself works correctly, see the next question.

How can I find out if a created user can access a database?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The easiest way to test if a database is accessible is by starting the
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
  | version       | 8.0.22 |
  +---------------+--------+
  1 row in set (0.00 sec)
  mysql> quit

**PostgreSQL**:

Assuming the database server is installed on the same system you're running
the command from, use::

  psql -Uusername -dnextcloud

To access a PostgreSQL installation on a different machine, add the -h option with
the respective host name::

  psql -Uusername -dnextcloud -h HOSTNAME

::

  postgres=# SELECT version();
  PostgreSQL 8.4.12 on i686-pc-linux-gnu, compiled by GCC gcc (GCC) 4.1.3 20080704 (prerelease), 32-bit
  (1 row)
  postgres=# \q


Useful SQL commands
^^^^^^^^^^^^^^^^^^^

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
