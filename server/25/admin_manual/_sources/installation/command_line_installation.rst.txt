============================
Installing from command line
============================

It is now possible to install Nextcloud entirely from the command line. This is 
convenient for scripted operations, headless servers, and sysadmins who prefer 
the command line. There are three stages to installing Nextcloud via the command 
line:

1. Download the Nextcloud code and unpack the tarball in the appropriate directories. (See :doc:`source_installation`.)

2. Change the ownership of your ``nextcloud`` directory to your HTTP user, like 
this example for Debian/Ubuntu. You must run ``occ`` as your HTTP user; see 
:ref:`http_user_label`::

 $ sudo chown -R www-data:www-data /var/www/nextcloud/

3. Use the ``occ`` command to complete your installation. This takes the place 
of running the graphical Installation Wizard::

 $ cd /var/www/nextcloud/
 $ sudo -u www-data php occ  maintenance:install \
 --database='mysql' --database-name='nextcloud' \
 --database-user='root' --database-pass='password' \
 --admin-user='admin' --admin-pass='password'
 Nextcloud is not installed - only a limited number of commands are available
 Nextcloud was successfully installed
 
Note that you must change to the root Nextcloud directory, as in the example 
above, to run ``occ maintenance:install``, or the installation will fail with 
a PHP fatal error message.

Supported databases are::

 - sqlite (SQLite3 - Nextcloud Community edition only)
 - mysql (MySQL/MariaDB)
 - pgsql (PostgreSQL)
 - oci (Oracle 11g currently only possible if you contact us at https://nextcloud.com/enterprise as part of a subscription)
 
See :ref:`command_line_installation_label` for more information.

