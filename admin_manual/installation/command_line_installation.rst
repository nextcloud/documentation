=========================================
Installing ownCloud From the Command Line
=========================================

It is now possible to install ownCloud entirely from the command line. This is 
convenient for scripted operations, headless servers, and sysadmins who prefer 
the command line. There are three stages to installing ownCloud via the command 
line:

1. Download and install the ownCloud code via your package manager, or download 
and unpack the tarball in the appropriate directories. (See 
:doc:`linux_installation` and :doc:`source_installation`.)

2. Change the ownership of your ``owncloud`` directory to your HTTP user, like 
this example for Debian/Ubuntu. You must run ``occ`` as your HTTP user; see 
:ref:`http_user_label`::

 $ sudo chown -R www-data:www-data /var/www/owncloud/

3. Use the ``occ`` command to complete your installation. This takes the place 
of running the graphical Installation Wizard::

 $ cd /var/www/owncloud/
 $ sudo -u www-data php occ  maintenance:install --database 
 "mysql" --database-name "owncloud"  --database-user "root" --database-pass 
 "password" --admin-user "admin" --admin-pass "password" 
 ownCloud is not installed - only a limited number of commands are available
 ownCloud was successfully installed
 
Note that you must change to the root ownCloud directory, as in the example 
above, to run ``occ  maintenance:install``, or the installation will fail with 
a PHP fatal error message.

Supported databases are::

 - sqlite (SQLite3 - ownCloud Community edition only)
 - mysql (MySQL/MariaDB)
 - pgsql (PostgreSQL)
 - oci (Oracle - ownCloud Enterprise edition only)
 
See :ref:`command_line_installation_label` for more information.

Finally, apply the correct strong permissions to your ownCloud files and 
directories (see :ref:`strong_perms_label`). This is an extremely important 
step. It helps protect your ownCloud installation, and ensures that it will run 
correctly.

BINLOG_FORMAT = STATEMENT
-------------------------

If your ownCloud installation fails and you see this in your ownCloud log::

 An unhandled exception has been thrown: exception ‘PDOException’ with message 
 'SQLSTATE[HY000]: General error: 1665 Cannot execute statement: impossible to 
 write to binary log since BINLOG_FORMAT = STATEMENT and at least one table 
 uses a storage engine limited to row-based logging. InnoDB is limited to 
 row-logging when transaction isolation level is READ COMMITTED or READ 
 UNCOMMITTED.'

See :ref:`db-binlog-label`.
