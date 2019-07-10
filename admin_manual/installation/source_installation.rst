=====================
Installation on Linux
=====================

If there are no packages for your Linux distribution, you have the option to
install `Snap Packages <http://snapcraft.io/docs/core/install/>`_. See
:ref:`snaps_label`

In case you prefer installing from the source tarball, you can setup Nextcloud
from scratch using a classic LAMP stack (Linux, Apache, MySQL/MariaDB, PHP).
This document provides a complete walk-through for installing Nextcloud on
Ubuntu 18.04 LTS Server with Apache and MariaDB, using `the Nextcloud .tar
archive <https://nextcloud.com/install/>`_.

.. note:: Admins of SELinux-enabled distributions such as CentOS, Fedora, and
   Red Hat Enterprise Linux may need to set new rules to enable installing
   Nextcloud. See :ref:`selinux_tips_label` for a suggested configuration.

You can also use the `Nextcloud VM scripts <https://github.com/nextcloud/vm/>`_ to install directly on a clean Ubuntu Server. It will setup everything for you and include scripts for automated installation of apps like; Collabora, OnlyOffice, Talk and so on.

.. _vm_label:

Installing on Windows (virtual machine)
---------------------------------------

If you are using Windows, the easiest way to get Nextcloud up and running is
using a virtual machine (VM). There are two options:

* **Enterprise/SME appliance**

Nextcloud GmbH maintains a free appliance built on the
`Univention Corporate Server (UCS) <https://www.univention.com/products/univention-app-center/app-catalog/nextcloud/>`_
with easy graphical setup and web-based administration. It includes user
management via LDAP, can replace an existing Active Directory setup and
has optional ONLYOFFICE and Collabora Online integration, with many more applications
available for easy and quick install.

It can be installed on hardware or run in a virtual machine using VirtualBox,
VMWare (ESX) and KVM images.

Download the the Appliance here:

- `Univention Corporate Server (UCS) <https://www.univention.com/products/univention-app-center/app-catalog/nextcloud/>`_


* **Home User/SME appliance**

The `Nextcloud VM`_ is maintained by
`T&M Hansson IT <https://www.hanssonit.se/nextcloud-vm/>`_ and several different versions are
offered. Collabora, OnlyOffice, Full Text Search and other apps can easily be installed with the included scripts which you can choose to run during the first setup, or download them later and run it afterwards. You can find all the currently available automated app installations `on GitHub <https://github.com/nextcloud/vm/tree/master/apps/>`_.

The VM is made with VMware version 10 and it comes in different sizes and versions:

- 40 GB (VMware, VirtualBox, Hyper-V)
- 500 GB (VMware, VirtualBox, Hyper-V)
- 1 TB (VMware, VirtualBox, Hyper-V)
- 2 TB (VMware & VirtualBox, Hyper-V)
- Custom size? Please `ask us <https://www.hanssonit.se/#contact>`_.

You can find all the different version `here <https://shop.hanssonit.se/product-category/virtual-machine/nextcloud-vm/>`_.

For complete instructions and downloads see:

- `Nextcloud VM (Github) <https://github.com/nextcloud/vm/>`_
- `Nextcloud VM (T&M Hansson IT) <https://www.hanssonit.se/nextcloud-vm/>`_

.. note:: You can install the VM on several different operating systems as long as you can mount OVA, VMDK, or VHD/VHDX VM in your hypervisor. If you are using KVM then you need to install the VM from the scripts on Github. You can follow the `instructions in the README <https://github.com/nextcloud/vm#build-your-own-vm-or-install-on-a-vps>`_.

.. _snaps_label:

Installing via Snap packages
----------------------------

A snap is a zip file containing an application together with its dependencies,
and a description of how it should safely be run on your system, especially
the different ways it should talk to other software. Most importantly snaps are
designed to be secure, sandboxed, containerized applications isolated from the
underlying system and from other applications.

To install the Nextcloud Snap Package, run the following command in a terminal::

    sudo snap install nextcloud

.. note:: The `snapd technology <http://snapcraft.io/docs/core/>`_ is the core
   that powers snaps, and it offers a new way to package, distribute, update and
   run OS components and applications on a Linux system. See more about snaps on
   `snapcraft.io <http://snapcraft.io/>`_.

.. _prerequisites_label:

Prerequisites for manual installation
-------------------------------------

The Nextcloud .tar archive contains all of the required PHP modules. This
section lists all required and optional PHP modules.  Consult the `PHP manual
<http://php.net/manual/en/extensions.php>`_ for more information on modules.
Your Linux distribution should have packages for all required modules. You can
check the presence of a module by typing ``php -m | grep -i <module_name>``.
If you get a result, the module is present.

Required:

* PHP (7.1, 7.2 or 7.3)
* PHP module ctype
* PHP module curl
* PHP module dom
* PHP module GD
* PHP module iconv
* PHP module JSON
* PHP module libxml (Linux package libxml2 must be >=2.7.0)
* PHP module mbstring
* PHP module openssl
* PHP module posix
* PHP module session
* PHP module SimpleXML
* PHP module XMLReader
* PHP module XMLWriter
* PHP module zip
* PHP module zlib

Database connectors (pick the one for your database:)

* PHP module pdo_sqlite (>= 3, usually not recommended for performance reasons)
* PHP module pdo_mysql (MySQL/MariaDB)
* PHP module pdo_pgsql (requires PostgreSQL >= 9.0)

*Recommended* packages:

* PHP module fileinfo (highly recommended, enhances file analysis performance)
* PHP module bz2 (recommended, required for extraction of apps)
* PHP module intl (increases language translation performance and fixes sorting
  of non-ASCII characters)

Required for specific apps:

* PHP module ldap (for LDAP integration)
* PHP module smbclient  (SMB/CIFS integration, see
  :doc:`../configuration_files/external_storage/smb`)
* PHP module ftp (for FTP storage / external user authentication)
* PHP module imap (for external user authentication)

Recommended for specific apps (*optional*):

* PHP module exif (for image rotation in pictures app)
* PHP module gmp (for SFTP storage)

For enhanced server performance (*optional*) select one of the following
memcaches:

* PHP module apcu (>= 4.0.6)
* PHP module memcached
* PHP module redis (>= 2.2.6, required for Transactional File Locking)

See :doc:`../configuration_server/caching_configuration` to learn how to select
and configure a memcache.

For preview generation (*optional*):

* PHP module imagick
* avconv or ffmpeg
* OpenOffice or LibreOffice

For command line processing (*optional*):

* PHP module pcntl (enables command interruption by pressing ``ctrl-c``)

You don’t need the WebDAV module for your Web server (i.e. Apache’s
``mod_webdav``), as Nextcloud has a built-in WebDAV server of its own,
SabreDAV.
If ``mod_webdav`` is enabled you must disable it for Nextcloud. (See
:ref:`apache_configuration_label` for an example configuration.)

.. _ubuntu_installation_label:

Example installation on Ubuntu 18.04 LTS server
-----------------------------------------------

On a machine running a pristine Ubuntu 18.04 LTS server, you have three options:

**Bash scripts**

One of the easiest ways of insalling is to use the Nextcloud VM scripts. It's basically just two steps:

1. Download the latest `installation script <https://github.com/nextcloud/vm/blob/master/nextcloud_install_production.sh/>`_.
2. Run the script with::

    sudo bash nextcloud_install_production.sh

A guided setup will follow and the only thing you have to do it to follow the on screen instructions, when given to you.

**Snap package**

Another very easy way is to install the Nextcloud `Snap Package <http://snapcraft.io/>`_, just run the
following command in a terminal::

    sudo snap install nextcloud

**Debian packages**

Or you can use .deb packages to install the required and recommended modules for a typical Nextcloud
installation, using Apache and MariaDB, by issuing the following commands in a
terminal::

    apt-get install apache2 mariadb-server libapache2-mod-php7.2
    apt-get install php7.2-gd php7.2-json php7.2-mysql php7.2-curl php7.2-mbstring
    apt-get install php7.2-intl php-imagick php7.2-xml php7.2-zip

* This installs the packages for the Nextcloud core system.
  ``libapache2-mod-php7.2`` provides the following PHP extensions::

    bcmath bz2 calendar Core ctype date dba dom ereg exif fileinfo filter ftp gettext
    hash iconv libxml mhash openssl pcre Phar posix Reflection session shmop SimpleXML
    soap sockets SPL standard sysvmsg sysvsem sysvshm tokenizer wddx xmlreader xmlwriter zlib

  If you are planning on running additional apps, keep in mind that they might require additional
  packages.  See :ref:`prerequisites_label` for details.

* At the installation of the MySQL/MariaDB server, you will be prompted to
  create a root password. Be sure to remember your password as you will need it
  during Nextcloud database setup.

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

* Now you can extract the archive contents. Run the appropriate unpacking
  command for your archive type::

    tar -xjf nextcloud-x.y.z.tar.bz2
    unzip nextcloud-x.y.z.zip

* This unpacks to a single ``nextcloud`` directory. Copy the Nextcloud directory
  to its final destination. When you are running the Apache HTTP server you may
  safely install Nextcloud in your Apache document root::

    cp -r nextcloud /path/to/webserver/document-root

  where ``/path/to/webserver/document-root`` is replaced by the
  document root of your Web server::

    cp -r nextcloud /var/www

On other HTTP servers it is recommended to install Nextcloud outside of the
document root.

.. _centos7_installation_label:

Example installation on CentOS 7 server
-----------------------------------------------
In this install tutorial we will be deploying CentOS 7.5, PHP 7.2, MariaDB, Redis as memcache and Nextcloud running on Apache.

Start off by installing a CentOS 7 minimal install. This should provide a sufficient platform to run a successful Nextcloud instance.

First install some dependencies you will be needing during installation, but which will also be useful in every day use situations::

    yum install -y epel-release yum-utils unzip curl wget \
    bash-completion policycoreutils-python mlocate bzip2

Now make sure your system is up to date::

    yum update -y

**Apache**
::

    yum install -y httpd

See :ref:`apache-web-server-configuration` for details.

Make sure the apache web service is enabled and started::

    systemctl enable httpd.service
    systemctl start httpd.service

**PHP**

Next install the PHP modules needed for this install. Remember, because this is a limited basic install, we only install the neccessary modules, not all of them. If you are making a more complete install, please refer to PHP module list at the top of this page.::

    yum install -y centos-release-scl
    yum install -y rh-php72 rh-php72-php rh-php72-php-gd rh-php72-php-mbstring \
    rh-php72-php-intl rh-php72-php-pecl-apcu rh-php72-php-mysqlnd rh-php72-php-pecl-redis \
    rh-php72-php-opcache rh-php72-php-imagick

Next you will need to create a few symlinks::

    ln -s /opt/rh/httpd24/root/etc/httpd/conf.d/rh-php72-php.conf /etc/httpd/conf.d/
    ln -s /opt/rh/httpd24/root/etc/httpd/conf.modules.d/15-rh-php72-php.conf /etc/httpd/conf.modules.d/
    ln -s /opt/rh/httpd24/root/etc/httpd/modules/librh-php72-php7.so /etc/httpd/modules/

This next symlink will give you the opportunity to be able to invoke ``php`` from anywhere in terminal, including for ``occ`` commands::

    ln -s /opt/rh/rh-php72/root/bin/php /usr/bin/php


**Database**

As mentioned, we will be using MySQL/MariaDB as our database.::

    yum install -y mariadb mariadb-server

Make sure the database service is enabled to start at boot time.::

    systemctl enable mariadb.service
    systemctl start mariadb.service

After you have done this, make sure you create a database with a username and password so that Nextcloud will have access to it. In the docs, refer to the Database configuration part, specifically about MariaDB. There is a complete write-up on how to setup the database.


**Redis**
::

    yum install -y redis
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

.. note:: If you use this tutorial, and you see warnings in the web browser after installation about ``OPcache`` not being enabled or configured correctly, you need to make the suggested changes in ``/etc/opt/rh/rh-php72/php.d/10-opcache.ini`` for the errors to disappear. These warnings will be on the Admin page, under Basic settings.

Because we used ``Redis`` as a memcache, you will need a config similar to the following example in ``/var/www/html/nextcloud/config/config.php`` which is auto-generated when you run the online installation wizard mentioned earlier.

Example config::

    'memcache.distributed' => '\OC\Memcache\Redis',
    'memcache.locking' => '\OC\Memcache\Redis',
    'memcache.local' => '\OC\Memcache\APCu',
    'redis' => array(
      'host' => 'localhost',
      'port' => 6379,
    ),

Remember, this tutorial is only for a basic setup of Nextcloud on CentOS 7, with PHP 7.2. If you are going to use more features like LDAP or Single Sign On, you will need additional PHP modules as well as extra configurations. So please visit the rest of the Admin manual, :doc:`../index`, for detailed descriptions on how to get this done.

.. _apache_configuration_label:

Apache Web server configuration
-------------------------------

On Debian, Ubuntu, and their derivatives, Apache installs with a useful
configuration so all you have to do is create a
:file:`/etc/apache2/sites-available/nextcloud.conf` file with these lines in
it, replacing the **Directory** and other filepaths with your own filepaths::

    Alias /nextcloud "/var/www/nextcloud/"

    <Directory /var/www/nextcloud/>
      Require all granted
      Options FollowSymlinks MultiViews
      AllowOverride All

     <IfModule mod_dav.c>
      Dav off
     </IfModule>

     SetEnv HOME /var/www/nextcloud
     SetEnv HTTP_HOME /var/www/nextcloud

    </Directory>

Then enable the newly created site::

    a2ensite nextcloud.conf


On CentOS/RHEL, create a virtualhost :file:`/etc/httpd/conf.d/nextcloud.conf` and add the following content to it::

    <VirtualHost *:80>
      DocumentRoot /var/www/nextcloud/
      ServerName  your.server.com

      <Directory "/var/www/nextcloud/">
        Require all granted
        AllowOverride All
        Options FollowSymLinks MultiViews

        <IfModule mod_dav.c>
          Dav off
        </IfModule>

      </Directory>
    </VirtualHost>

Additional Apache configurations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* For Nextcloud to work correctly, we need the module ``mod_rewrite``. Enable
  it by running::

    a2enmod rewrite

  Additional recommended modules are ``mod_headers``, ``mod_env``, ``mod_dir`` and ``mod_mime``::

    a2enmod headers
    a2enmod env
    a2enmod dir
    a2enmod mime

  If you're running ``mod_fcgi`` instead of the standard ``mod_php`` also enable::

    a2enmod setenvif

* You must disable any server-configured authentication for Nextcloud, as it
  uses Basic authentication internally for DAV services. If you have turned on
  authentication on a parent folder (via e.g. an ``AuthType Basic``
  directive), you can turn off the authentication specifically for the
  Nextcloud entry. Following the above example configuration file, add the
  following line in the ``<Directory>`` section::

    Satisfy Any

* When using SSL, take special note of the ServerName. You should specify one
  in the server configuration, as well as in the CommonName field of the
  certificate. If you want your Nextcloud to be reachable via the internet,
  then set both of these to the domain you want to reach your Nextcloud server.

* Now restart Apache::

    service apache2 restart

* If you're running Nextcloud in a subdirectory and want to use CalDAV or
  CardDAV clients make sure you have configured the correct
  :ref:`service-discovery-label` URLs.

.. _pretty_urls_label:

Pretty URLs
-----------

Pretty URLs remove the ``index.php``-part in all Nextcloud URLs, for example
in sharing links like ``https://example.org/nextcloud/index.php/s/Sv1b7krAUqmF8QQ``,
making URLs shorter and thus prettier.

``mod_env`` and ``mod_rewrite`` must be installed on your webserver and the :file:`.htaccess`
must be writable by the HTTP user. Then you can set in the :file:`config.php` two variables::

    'overwrite.cli.url' => 'https://example.org/nextcloud',
    'htaccess.RewriteBase' => '/nextcloud',

if your setup is available on ``https://example.org/nextcloud`` or::

    'overwrite.cli.url' => 'https://example.org/',
    'htaccess.RewriteBase' => '/',

if it isn't installed in a subfolder. Finally run this occ-command to update
your .htaccess file::

    sudo -u www-data php /var/www/nextcloud/occ maintenance:update:htaccess

After each update, these changes are automatically applied to the ``.htaccess``-file.

.. _enabling_ssl_label:

Enabling SSL
------------

.. note:: You can use Nextcloud over plain HTTP, but we strongly encourage you
          to use SSL/TLS to encrypt all of your server traffic, and to protect
          user's logins and data in transit.

Apache installed under Ubuntu comes already set-up with a simple
self-signed certificate. All you have to do is to enable the ssl module and
the default site. Open a terminal and run::

    a2enmod ssl
    a2ensite default-ssl
    service apache2 reload

.. note:: Self-signed certificates have their drawbacks - especially when you
          plan to make your Nextcloud server publicly accessible. You might
          want to consider getting a certificate signed by a commercial signing
          authority. Check with your domain name registrar or hosting service
          for good deals on commercial certificates.

.. _installation_wizard_label:

Installation wizard
-------------------

After restarting Apache you must complete your installation by running either
the graphical Installation Wizard, or on the command line with the ``occ``
command. To enable this, change the ownership on your Nextcloud directories to
your HTTP user::

    chown -R www-data:www-data /var/www/nextcloud/

.. note:: Admins of SELinux-enabled distributions may need to write new SELinux
   rules to complete their Nextcloud installation; see
   :ref:`selinux_tips_label`.

To use ``occ`` see :doc:`command_line_installation`.

To use the graphical Installation Wizard see :doc:`installation_wizard`.

.. _selinux_tips_label:

SELinux configuration tips
--------------------------

See :doc:`selinux_configuration` for a suggested configuration for
SELinux-enabled distributions such as Fedora and CentOS.

.. _php_ini_tips_label:

php.ini configuration notes
---------------------------

Keep in mind that changes to ``php.ini`` may have to be configured on more than one
ini file. This can be the case, for example, for the ``date.timezone`` setting.

**php.ini - used by the Web server:**
::

    /etc/php/7.2/apache2/php.ini
  or
    /etc/php/7.2/fpm/php.ini
  or ...

**php.ini - used by the php-cli and so by Nextcloud CRON jobs:**
::

    /etc/php/7.2/cli/php.ini

.. note:: Path names have to be set in respect of the installed PHP
          (>= 7.0, 7.1, 7.2 or 7.3) as applicable.

.. _php_fpm_tips_label:

php-fpm configuration notes
---------------------------

**System environment variables**

When you are using ``php-fpm``, system environment variables like
PATH, TMP or others are not automatically populated in the same way as
when using ``php-cli``. A PHP call like ``getenv('PATH');`` can therefore
return an empty result. So you may need to manually configure environment
variables in the appropropriate ``php-fpm`` ini/config file.

Here are some example root paths for these ini/config files:

+-----------------------+-----------------------+
| Debian/Ubuntu/Mint    | CentOS/Red Hat/Fedora |
+-----------------------+-----------------------+
| ``/etc/php/7.2/fpm/`` | ``/etc/php-fpm.d/``   |
+-----------------------+-----------------------+

In both examples, the ini/config file is called ``www.conf``, and depending on
the distro version or customizations you have made, it may be in a subdirectory such as ``pool.d``.

Usually, you will find some or all of the environment variables
already in the file, but commented out like this::

    ;env[HOSTNAME] = $HOSTNAME
    ;env[PATH] = /usr/local/bin:/usr/bin:/bin
    ;env[TMP] = /tmp
    ;env[TMPDIR] = /tmp
    ;env[TEMP] = /tmp

Uncomment the appropriate existing entries. Then run ``printenv PATH`` to
confirm your paths, for example::

    $ printenv PATH
    /home/user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:
    /sbin:/bin:/

If any of your system environment variables are not present in the file then
you must add them.

Alternatively it is possible to use the environemt variables of your system by modifying::

    /etc/php/7.2/fpm/pool.d/www.conf

and uncommenting the line::

    clear_env = no

When you are using shared hosting or a control panel to manage your `Nextcloud VM`_
or server, the configuration files are almost
certain to be located somewhere else, for security and flexibility reasons, so
check your documentation for the correct locations.

Please keep in mind that it is possible to create different settings for
``php-cli`` and ``php-fpm``, and for different domains and Web sites.
The best way to check your settings is with :ref:`label-phpinfo`.

**Maximum upload size**

If you want to increase the maximum upload size, you will also have to modify
your ``php-fpm`` configuration and increase the ``upload_max_filesize`` and
``post_max_size`` values. You will need to restart ``php5-fpm`` and your HTTP
server in order for these changes to be applied.

**.htaccess notes for Apache**

Nextcloud comes with its own ``nextcloud/.htaccess`` file. Because ``php-fpm``
can't read PHP settings in ``.htaccess`` these settings and permissions must
be set in the ``nextcloud/.user.ini`` file.

.. _other_HTTP_servers_label:

Other Web servers
-----------------

* :doc:`nginx`


.. _Nextcloud VM:
    https://github.com/nextcloud/vm
