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

2. Apply the correction permissions to your ownCloud files and directories (see 
:ref:`strong_perms`.)

3. Use the ``occ`` command to complete your installation. This takes the place 
of running the graphical Installation Wizard.

You must run ``occ`` as your HTTP user; see :ref:`http_user`. This example 
shows how to complete your ownCloud installation with ``occ`` on Ubuntu Linux::

 $ sudo -u www-data php /var/www/owncloud/occ  maintenance:install --database 
 "mysql" --database-name "owncloud"  --database-user "root" --database-pass 
 "password" --admin-user "admin" --admin-pass "password" 
 ownCloud is not installed - only a limited number of commands are available
 ownCloud was successfully installed

Supported databases are::

 - sqlite (SQLite3 - Server Edition Only)
 - mysql (MySQL/MariaDB)
 - pgsql (PostgreSQL)
 - oci (Oracle)
 
See :ref:`cli_installation` for more information. 
