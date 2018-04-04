=====================
Installation on Linux
=====================

If there are no packages for your Linux distribution, you have the option to
install `Snap Packages <http://snapcraft.io/docs/core/install/>`_. See
:ref:`snaps_label`

In case you prefer installing from the source tarball, you can setup Nextcloud
from scratch using a classic LAMP stack (Linux, Apache, MySQL/MariaDB, PHP).
This document provides a complete walk-through for installing Nextcloud on
Ubuntu 16.04 LTS Server with Apache and MariaDB, using `the Nextcloud .tar
archive <https://nextcloud.com/install/>`_.

* :ref:`vm_label`
* :ref:`snaps_label`
* :ref:`prerequisites_label`
* :ref:`ubuntu_installation_label`
* :ref:`apache_configuration_label`
* :ref:`pretty_urls_label`
* :ref:`enabling_ssl_label`
* :ref:`installation_wizard_label`
* :ref:`selinux_tips_label`
* :ref:`php_ini_tips_label`
* :ref:`php_fpm_tips_label`
* :ref:`other_HTTP_servers_label`

.. note:: Admins of SELinux-enabled distributions such as CentOS, Fedora, and
   Red Hat Enterprise Linux may need to set new rules to enable installing
   Nextcloud. See :ref:`selinux_tips_label` for a suggested configuration.

.. _vm_label:

Installing on Windows (virtual machine)
---------------------------------------

If you are using Windows, the easiest way to get Nextcloud up and running is
using a `Nextcloud virtual machine (VM) <https://github.com/nextcloud/vm>`_.
The VMs are maintained by `Tech and Me <https://www.techandme.se/>`_ and
several different versions are offered. The main version is for VMware version
10 and it comes in different sizes. The standard size is 20 GB but you can also
download a 500 GB or a 1 TB version. Tech and Me also provides a Hyper-V
version for Hyper-V users.

For complete instructions and downloads see:

- https://github.com/nextcloud/vm 
- https://www.techandme.se/nextcloud-vm/

.. note:: You can install the VM on OSes other than Windows as long as
   your hypervisor can mount OVA, VMDK, or VHD VM formats.

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

* PHP (>= 5.6, 7.0 or 7.1)
* PHP module ctype
* PHP module dom
* PHP module GD
* PHP module iconv
* PHP module JSON
* PHP module libxml (Linux package libxml2 must be >=2.7.0)
* PHP module mbstring
* PHP module posix
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

* PHP module curl (highly recommended, some functionality, e.g. HTTP user
  authentication, depends on this)
* PHP module fileinfo (highly recommended, enhances file analysis performance)
* PHP module bz2 (recommended, required for extraction of apps)
* PHP module intl (increases language translation performance and fixes sorting
  of non-ASCII characters)
* PHP module mcrypt (increases file encryption performance)
* PHP module openssl (required for accessing HTTPS resources)

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

Example installation on Ubuntu 16.04 LTS server
-----------------------------------------------

On a machine running a pristine Ubuntu 16.04 LTS server, you have two options:

You can either install the Nextcloud `Snap Package <http://snapcraft.io/>`_, just run the
following command in a terminal::

    sudo snap install nextcloud

Or you can use .deb packages to install the required and recommended modules for a typical Nextcloud
installation, using Apache and MariaDB, by issuing the following commands in a
terminal::

    apt-get install apache2 mariadb-server libapache2-mod-php7.0
    apt-get install php7.0-gd php7.0-json php7.0-mysql php7.0-curl php7.0-mbstring
    apt-get install php7.0-intl php7.0-mcrypt php-imagick php7.0-xml php7.0-zip

* This installs the packages for the Nextcloud core system.
  ``libapache2-mod-php7.0`` provides the following PHP extensions: ``bcmath bz2
  calendar Core ctype date dba dom ereg exif fileinfo filter ftp gettext hash
  iconv libxml mhash openssl pcre Phar posix Reflection session shmop
  SimpleXML soap sockets SPL standard sysvmsg sysvsem sysvshm tokenizer wddx
  xmlreader xmlwriter zlib``. If you are planning
  on running additional apps, keep in mind that they might require additional
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

.. _apache_configuration_label:
   
Apache Web server configuration
-------------------------------

On Debian, Ubuntu, and their derivatives, Apache installs with a useful
configuration so all you have to do is create a
:file:`/etc/apache2/sites-available/nextcloud.conf` file with these lines in
it, replacing the **Directory** and other filepaths with your own filepaths::
   
  Alias /nextcloud "/var/www/nextcloud/"
   
  <Directory /var/www/nextcloud/>
    Options +FollowSymlinks
    AllowOverride All

   <IfModule mod_dav.c>
    Dav off
   </IfModule>

   SetEnv HOME /var/www/nextcloud
   SetEnv HTTP_HOME /var/www/nextcloud

  </Directory>
 
Then create a symlink to :file:`/etc/apache2/sites-enabled`::

  ln -s /etc/apache2/sites-available/nextcloud.conf /etc/apache2/sites-enabled/nextcloud.conf
 
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

 'overwrite.cli.url' => 'https://example.org',
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
your HTTP user:

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

   /etc/php5/apache2/php.ini
 or
   /etc/php5/fpm/php.ini
 or ...

**php.ini - used by the php-cli and so by Nextcloud CRON jobs:**
::

  /etc/php5/cli/php.ini


.. _php_fpm_tips_label:

php-fpm configuration notes
---------------------------

**Security: Use at least PHP >= 5.6.6**

Due to `a bug with security implications <https://bugs.php.net/bug.php?id=64938>`_
in older PHP releases with the handling of XML data you are highly encouraged to run
at least PHP 5.6.6 when in a threaded environment.

**System environment variables**

When you are using ``php-fpm``, system environment variables like
PATH, TMP or others are not automatically populated in the same way as
when using ``php-cli``. A PHP call like ``getenv('PATH');`` can therefore
return an empty result. So you may need to manually configure environment
variables in the appropropriate ``php-fpm`` ini/config file.

Here are some example root paths for these ini/config files:

+-----------------------+-----------------------+
| Ubuntu/Mint           | CentOS/Red Hat/Fedora |
+-----------------------+-----------------------+
| ``/etc/php5/fpm/`` or | ``/etc/php-fpm.d/``   |
| ``/etc/php/7.0/fpm/`` |                       |
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

Alternatively it is possible to use the environemt variables of your system by modifying 

    /etc/php/7.0/fpm/pool.d/www.conf
   
and uncommenting the line

    clear_env = no

When you are using shared hosting or a control panel to manage your `Nextcloud VM
<https://github.com/nextcloud/vm>`_ or server, the configuration files are almost
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

:doc:`nginx`


`Other HTTP servers (Nextcloud)
<https://github.com/nextcloud/documentation/wiki/Alternate-Web-server-notes>`_
