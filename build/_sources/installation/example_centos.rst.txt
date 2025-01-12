.. _centos7_installation_label:

Example installation on CentOS 8
================================
In this install tutorial we will be deploying CentOS 8, PHP 7.4, MariaDB, Redis as memcache and Nextcloud running on Apache.

Start off by installing a CentOS 8 minimal install. This should provide a sufficient platform to run a successful Nextcloud instance.

First install some dependencies you will be needing during installation, but which will also be useful in every day use situations::

    dnf install -y epel-release yum-utils unzip curl wget \
    bash-completion policycoreutils-python-utils mlocate bzip2

Now make sure your system is up to date::

    dnf update -y

Apache
------

::

    dnf install -y httpd
    
Create a virtualhost in ``/etc/httpd/conf.d/nextcloud.conf`` and add the following content to it:

::

  <VirtualHost *:80>
    DocumentRoot /var/www/html/nextcloud/
    ServerName  your.server.com

    <Directory /var/www/html/nextcloud/>
      Require all granted
      AllowOverride All
      Options FollowSymLinks MultiViews

      <IfModule mod_dav.c>
        Dav off
      </IfModule>

    </Directory>
  </VirtualHost>
  
  
See :ref:`apache_configuration_label` for further details.

Make sure the apache web service is enabled and started::

    systemctl enable httpd.service
    systemctl start httpd.service

PHP
---

.. note:: CentOS 8 doesn't come with packages for the redis and imagick php extensions. 
    Those can either be installed using pecl. Apart from the official PHP packages there are 3rdparty 
    repositories available at ``https://rpms.remirepo.net``. Using remirepo you can also install the 
    latest PHP version instead of the standard shipped one.



Setting up remirepo with PHP 8.2
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

More details can be found on ``https://blog.remirepo.net/pages/Config-en``

Command to install the Remi repository configuration package:

::

    dnf install https://rpms.remirepo.net/enterprise/remi-release-8.rpm

Command to install the yum-utils package (for the yum-config-manager command):

::

    dnf install yum-utils

You want a single version which means replacing base packages from the distribution. Packages have the same name than the base repository, ie php-\*. Some common dependencies are available in remi-safe repository, which is enabled by default.

You have to enable the module stream for 8.2:

::

    dnf module reset php
    dnf module install php:remi-8.2
    dnf update


Installing PHP and the required modules
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Next, install the PHP modules needed for this install. Remember, because this is a limited basic install, we only install the necessary modules, not all of them. If you are making a more complete install, please refer to PHP module list in the source installation documentation, :doc:`../installation/source_installation`::

    dnf install -y php php-cli php-gd php-mbstring php-intl php-pecl-apcu\
         php-mysqlnd php-opcache php-json php-zip


Installing optional modules redis/imagick
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

    dnf install -y php-redis php-imagick
    

Database
--------

As mentioned, we will be using MySQL/MariaDB as our database.::

    dnf install -y mariadb mariadb-server

Make sure the database service is enabled to start at boot time.::

    systemctl enable mariadb.service
    systemctl start mariadb.service

Improve MariaDB security.::

    mysql_secure_installation

After you have done this, make sure you create a database with a username and password so that 
Nextcloud will have access to it. For further details on database setup and configuration,
see the :doc:`../configuration_database/linux_database_configuration` documentation.


Redis
-----

::

    dnf install -y redis
    systemctl enable redis.service
    systemctl start redis.service


**Installing Nextcloud**

Nearly there, so keep at it, you are doing great!

Now download the archive of the latest Nextcloud version:

* Go to the `Nextcloud Download Page <https://nextcloud.com/install>`_.
* Go to **Download Nextcloud Server > Download > Archive file for
  server owners** and download either the tar.bz2 or .zip archive.
* This downloads a file named nextcloud-x.y.z.tar.bz2 or nextcloud-x.y.z.zip
  (where x.y.z is the version number).
* Download its corresponding checksum file, e.g. nextcloud-x.y.z.tar.bz2.md5,
  or nextcloud-x.y.z.tar.bz2.sha256.
* Verify the MD5 or SHA256 sum::

    md5sum -c nextcloud-x.y.z.tar.bz2.md5 < nextcloud-x.y.z.tar.bz2
    sha256sum -c nextcloud-x.y.z.tar.bz2.sha256 < nextcloud-x.y.z.tar.bz2
    md5sum  -c nextcloud-x.y.z.zip.md5 < nextcloud-x.y.z.zip
    sha256sum  -c nextcloud-x.y.z.zip.sha256 < nextcloud-x.y.z.zip

* You may also verify the PGP signature::

    wget https://download.nextcloud.com/server/releases/nextcloud-x.y.z.tar.bz2.asc
    wget https://nextcloud.com/nextcloud.asc
    gpg --import nextcloud.asc
    gpg --verify nextcloud-x.y.z.tar.bz2.asc nextcloud-x.y.z.tar.bz2


For the sake of the walk-through, we grabbed the latest version of Nextcloud in the form a zip file, confirmed the download with the above-mentioned command, and now we will extract it::

    unzip nextcloud-*.zip

Copy the content over to the root directory of your webserver. In our case, we are using apache so it will be ``/var/www/html/``::

    cp -R nextcloud/ /var/www/html/

During the install process, no data folder is created, so we will create one manually to help with the installation wizard::

    mkdir /var/www/html/nextcloud/data

Make sure that apache has read and write access to the whole nextcloud folder::

    chown -R apache:apache /var/www/html/nextcloud

Restart apache::

    systemctl restart httpd.service

Create a firewall rule for access to apache::

    firewall-cmd --zone=public --add-service=http --permanent
    firewall-cmd --reload

**SELinux**

Again, there is an extensive write-up done on SELinux which can be found at :doc:`../installation/selinux_configuration`, so if you are using SELinux in Enforcing mode, please run the commands suggested on that page.
The following commands only refers to this tutorial::

    semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/data(/.*)?'
    semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/config(/.*)?'
    semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/apps(/.*)?'
    semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/.htaccess'
    semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/.user.ini'
    semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/3rdparty/aws/aws-sdk-php/src/data/logs(/.*)?'

    restorecon -R '/var/www/html/nextcloud/'

    setsebool -P httpd_can_network_connect on

If you need more SELinux configs, refer to the above-mentioned URL, return to this tutorial.

Once done with with SELinux, please head over to ``http://your.server.com/nextcloud`` and follow the steps as found :doc:`../installation/installation_wizard`, where it will explain to you exactly how to proceed with the final part of the install, which is done as admin user through your web browser.

.. note:: If you use this tutorial, and you see warnings in the web browser after installation about ``OPcache`` not being enabled or configured correctly, you need to make the suggested changes in ``/etc/opt/rh/rh-php74/php.d/10-opcache.ini`` for the errors to disappear. These warnings will be on the Admin page, under Basic settings.

Because we used ``Redis`` as a memcache, you will need a config similar to the following example in ``/var/www/html/nextcloud/config/config.php`` which is auto-generated when you run the online installation wizard mentioned earlier.

Example config::

    'memcache.distributed' => '\OC\Memcache\Redis',
    'memcache.locking' => '\OC\Memcache\Redis',
    'memcache.local' => '\OC\Memcache\APCu',
    'redis' => array(
      'host' => 'localhost',
      'port' => 6379,
    ),

Remember, this tutorial is only for a basic setup of Nextcloud on CentOS 8, with PHP 7.4. If you are going to use more features like LDAP or Single Sign On, you will need additional PHP modules as well as extra configurations. So please visit the rest of the Admin manual, :doc:`../index`, for detailed descriptions on how to get this done.
