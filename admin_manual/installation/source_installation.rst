Manual Installation on Linux
============================

Installing ownCloud on Linux from the openSUSE Build Service packages is the preferred method (see :doc:`linux_installation`). 
These are maintained by ownCloud engineers, and you can use your package manager to keep your ownCloud server up-to-date.

If there are no packages for your Linux distribution, or you prefer installing from sources, you can setup ownCloud from scratch 
using a classic LAMP stack (Linux, Apache, MySQL/MariaDB, PHP). This document provides a complete walk-through for installing 
ownCloud on Ubuntu 14.04 LTS Server with Apache and MySQL.

Prerequisites
-------------

.. note:: This tutorial assumes you have terminal access to the machine you want
          to install ownCloud on. Although this is not an absolute requirement,
          installation without it is likely to require contacting your
          hoster (e.g. for installing required modules). Consult the 
          `PHP manual <http://php.net/manual/en/extensions.php>`_ for information on modules. 
          Your Linux distribution should have packages for all required modules.

To run ownCloud, your web server must have the following installed:

* php5 (>= 5.4)
* PHP module ctype
* PHP module dom
* PHP module GD
* PHP module iconv
* PHP module JSON
* PHP module libxml
* PHP module mb multibyte
* PHP module posix
* PHP module SimpleXML
* PHP module XMLWriter
* PHP module zip
* PHP module zlib

Database connectors (pick at least one):

* PHP module sqlite (>= 3, usually not recommended for performance reasons)
* PHP module mysql
* PHP module pgsql (requires PostgreSQL >= 9.0)

*Recommended* packages:

* PHP module curl (highly recommended, some functionality, e.g. http user
  authentication, depends on this)
* PHP module fileinfo (highly recommended, enhances file analysis performance)
* PHP module bz2 (recommended, required for extraction of apps)
* PHP module intl (increases language translation performance and fixes sorting 
  of non-ASCII characters)
* PHP module mcrypt (increases file encryption performance)
* PHP module openssl (required for accessing HTTPS resources)

Required for specific apps:

* PHP module ldap (for LDAP integration)
* smbclient (for SMB storage)
* PHP module ftp (for FTP storage)

Recommended for specific apps (*optional*):

* PHP module exif (for image rotation in pictures app)
* PHP module gmp (for SFTP storage)

For enhanced server performance (*optional* / select only one of the following):

* PHP module apc
* PHP module apcu
* PHP module xcache

For preview generation (*optional*):

* PHP module imagick
* avconv or ffmpeg
* OpenOffice or LibreOffice

**Remarks:**

* Please check your distribution, operating system or hosting partner 
  documentation on how to install and enable these modules.

* Make sure your distribution's PHP version fulfills the version requirements
  specified above. If it doesn't, there might be custom repositories you can
  use. If you are e.g. running Ubuntu 10.04 LTS, you can update your PHP using
  a custom `PHP PPA <https://launchpad.net/~ondrej/+archive/php5>`_::

	sudo add-apt-repository ppa:ondrej/php5
	sudo apt-get update
	sudo apt-get install php5

* You don’t need the WebDAV module for your web server (i.e. Apache’s
  ``mod_webdav``) to access your ownCloud data via WebDAV. ownCloud has a built-in
  WebDAV server of its own, SabreDAV.

Example installation on Ubuntu 14.04 LTS Server
-----------------------------------------------
On a machine running a pristine Ubuntu 14.04 LTS server, install the
required and recommended modules for a typical ownCloud installation, using
Apache and MariaDB, by issuing the following commands in a terminal::

    apt-get install apache2 mariadb-server libapache2-mod-php5
    apt-get install php5-gd php5-json php5-mysql php5-curl
    apt-get install php5-intl php5-mcrypt php5-imagick

* This installs the packages for the ownCloud core system. If you are planning 
  on running additional apps, keep in mind that they might require additional 
  packages.  See the Prerequisites section (above) for details.

* At the execution of each of the above commands you might be prompted whether 
  you want to continue; press "Y" for Yes (that is if your system language is 
  English. You might have to press a different key if you have a different 
  system language).

* At the installation of the MySQL server, you will be prompted to create a root 
  password. Be sure to remember the password you enter there for later use 
  as you will need it during ownCloud database setup.

Now download the archive of the latest ownCloud version:

* Go to the `ownCloud Download Page <http://owncloud.org/install>`_.
* Click the **Archive file for server owners** button.
* Click **Download Unix**.
* This downloads a file named owncloud-x.y.z.tar.bz2 (where
  x.y.z is the version number of the current latest version).
* Save this file on the machine you want to install ownCloud on.
* Verify the MD5 or SHA256 sum::
   
    md5sum  owncloud-x.y.z.tar.bz2
    sha256sum owncloud-x.y.z.tar.bz2
   
* You may also verify the PGP signature::
    
    wget https://download.owncloud.org/community/owncloud-x.y.z.tar.bz2.asc
    wget https://www.owncloud.org/owncloud.asc
    gpg --import owncloud.asc
    gpg --verify owncloud-x.y.z.tar.bz2.asc owncloud-x.y.z.tar.bz2
  
* Now you can extract the archive contents. Open a terminal, navigate to your 
  download directory, and run::

    tar -xjf owncloud-x.y.z.tar.bz2

* Copy the ownCloud files to their final destination in the document root of 
  your web server::

    cp -r owncloud /path/to/webserver/document-root

  where ``/path/to/webserver/document-root`` is replaced by the 
  document root of your Web server. On Ubuntu systems this 
  ``/var/www/owncloud``, so your copying command is::
    
    cp -r owncloud /var/www/
    
Apache Web Server Configuration
-------------------------------

On Debian, Ubuntu, and their derivatives, Apache installs with a useful configuration so all you have to do is create a 
:file:`/etc/apache2/conf-available` file with these lines in it:

.. code-block:: xml
   
   Alias /owncloud /var/www/owncloud
   <Directory /var/www/owncloud/>
    AllowOverride All
   </Directory>

Then create a symlink to  :file:`/etc/apache2/conf-enabled`::

  ln -s /etc/apache2/conf-available/owncloud.conf /etc/apache2/conf-enabled/owncloud.conf
  
Additional Apache Configurations
--------------------------------

* For ownCloud to work correctly, we need the module ``mod_rewrite``. Enable it 
  by running::

    a2enmod rewrite

* You should make sure that any built-in WebDAV module of your Web server is 
  disabled (at least for the ownCloud directory), as it will interfere with 
  ownCloud's built-in WebDAV support.

  If you need the WebDAV support in the rest of your configuration, you can turn 
  it off specifically for the ownCloud entry by adding the following line in 
  the ``<Directory`` section for your ownCloud server::

    Dav Off  

* You must disable any server-configured authentication for ownCloud, as it 
  uses Basic authentication internally for DAV services. If you have turned on 
  authentication on a parent folder (via e.g. an ``AuthType Basic``
  directive), you can turn off the authentication specifically for the ownCloud 
  entry. Following the above example configuration file, add the following line 
  in the ``<Directory`` section::

    Satisfy Any

* When using SSL, take special note on the ServerName. You should specify one in 
  the  server configuration, as well as in the CommonName field of the 
  certificate. If you want your ownCloud to be reachable via the internet, then 
  set both of these to the domain you want to reach your ownCloud server.
  
* Now restart Apache::
  
     service apache2 restart
     
.. note:: You can use ownCloud over plain http, but we strongly encourage you to
          use SSL/TLS to encrypt all of your server traffic, and to protect 
          user's logins and data in transit.

Enabling SSL
------------

An Apache installed under Ubuntu comes already set-up with a simple
self-signed certificate. All you have to do is to enable the ssl module and
the according site. Open a terminal and run::

     a2enmod ssl
     a2ensite default-ssl
     service apache2 reload

.. note:: Self-signed certificates have their drawbacks - especially when you
          plan to make your ownCloud server publicly accessible. You might want
          to consider getting a certificate signed by commercial signing
          authority. Check with your domain name registrar or hosting service,
          if you're using one, for good deals on commercial certificates. 
    
    
Installation Wizard
-------------------

Finish setting up your ownCloud server by following 
the :doc:`installation_wizard`.

After running the Installation Wizard your ownCloud installation is complete. 
However, you should perform the following steps to improve your server's 
security.

Setting Strong Directory Permissions
------------------------------------

We recommend setting the directory permissions in your ownCloud installation as 
strictly as possible for stronger security. Please refer to the ``Setting 
Strong Directory Permissions`` section of :doc:`installation_wizard`.

SELinux
-------

See :doc:`selinux_configuration` for a suggested configuration for SELinux-enabled distributions such as Fedora and CentOS.

Apache is the recommended Web server.

Configuration notes to php.ini files
------------------------------------

Keep in mind that changes to php.ini may have to be done on more than one ini file. This can be the case, as example, for the 
``date.timezone`` setting.

**php.ini - used by the webserver:**
::

   /etc/php5/apache2/php.ini
 or
   /etc/php5/fpm/php.ini
 or ...

**php.ini - used by the php-cli and so by ownCloud CRON jobs:**
::

  /etc/php5/cli/php.ini


Other Web Servers
-----------------
     
**Microsoft Internet Information Server (IIS)**

See :doc:`windows_installation` for further instructions.

**Nginx Configuration**

See :doc:`nginx_configuration`

**Yaws Configuration**

See :doc:`yaws_configuration`

**Hiawatha Configuration**

See :doc:`hiawatha_configuration`
