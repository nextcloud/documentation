=====================
Installation on Linux
=====================

There are multiple ways of installing Nextcloud depending on your preferences, requirements and goals.

If you prefer an automated installation, you have the option to:

* use the `official Nextcloud AIO Docker-based image <https://github.com/nextcloud/all-in-one#nextcloud-all-in-one>`_. Nextcloud AIO stands for Nextcloud All-in-One and provides easy deployment and maintenance with most features included in this one Nextcloud instance. It includes Office, a turnkey Backup solution, Imaginary (for previews of heic, heif, illustrator, pdf, svg, tiff and webp) and more.
* use the `community Snap Package <https://snapcraft.io/nextcloud>`_. This includes a full production-ready stack, will maintain your HTTPS certificates for you, and will automatically update as needed to stay secure.
* use the `community Nextcloud VM Appliance <https://github.com/nextcloud/vm/>`_ (aka Nextcloud Virtual Machine or NcVM). This helps you create a personal or corporate Nextcloud Server faster and easier. It can be used install directly on a clean Ubuntu Server or downloaded as a fully functioning VM.
* use the `community NextcloudPi scripts <https://nextcloudpi.com/>`_ (based on Debian). It will setup everything for you and include scripts for automated installation of apps like: Collabora, OnlyOffice, Talk and so on.
* use the `community Nextcloud Docker image <https://hub.docker.com/_/nextcloud/>`_. This image is designed to be used in a micro-service environment. There are two versions of the image you can choose from: the Apache one contains a full Nextcloud installation including an Apache web server. The second option is an FPM installation and runs a FastCGI process that serves your Nextcloud installation (you will need to supply your preferred web, database and other desired supplementary services).

.. note:: Please note that the community options are not officially supported by Nextcloud GmbH.

In case you prefer installing from the source tarball, you can setup Nextcloud
from scratch using a classic LAMP stack (Linux, Apache, MySQL/MariaDB, PHP).
This document provides a complete walk-through for installing Nextcloud on
Ubuntu 18.04 LTS Server with Apache and MariaDB, using `the Nextcloud .tar
archive <https://nextcloud.com/install/>`_. This method is recommended to install Nextcloud.

This installation guide is giving a general overview of required dependencies and their configuration. For a distribution specific setup guide have a look at the :doc:`./example_ubuntu` and :doc:`./example_centos`.

.. _prerequisites_label:


.. note:: Admins of SELinux-enabled distributions such as CentOS, Fedora, and
   Red Hat Enterprise Linux may need to set new rules to enable installing
   Nextcloud. See :ref:`selinux_tips_label` for a suggested configuration.

Prerequisites for manual installation
-------------------------------------

The Nextcloud .tar archive contains all of the required PHP modules. This
section lists all required and optional PHP modules.  Consult the `PHP manual
<https://php.net/manual/en/extensions.php>`_ for more information on modules.
Your Linux distribution should have packages for all required modules. You can
check the presence of a module by typing ``php -m | grep -i <module_name>``.
If you get a result, the module is present.

Required:

* PHP (see :doc:`./system_requirements` for a list of supported versions)
* PHP module ctype
* PHP module curl
* PHP module dom
* PHP module fileinfo (included with PHP)
* PHP module filter (only on Mageia and FreeBSD)
* PHP module GD
* PHP module hash (only on FreeBSD)
* PHP module JSON (included with PHP >= 8.0)
* PHP module libxml (Linux package libxml2 must be >=2.7.0)
* PHP module mbstring
* PHP module openssl (included with PHP >= 8.0)
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
* PHP module pdo_pgsql (PostgreSQL)

*Recommended* packages:

* PHP module bz2 (recommended, required for extraction of apps)
* PHP module intl (increases language translation performance and fixes sorting
  of non-ASCII characters)

Required for specific apps:

* PHP module ldap (for LDAP integration)
* PHP module smbclient  (SMB/CIFS integration, see
  :doc:`../configuration_files/external_storage/smb`)
* PHP module ftp (for FTP storage / external user authentication)
* PHP module imap (for external user authentication)
* PHP module bcmath (for passwordless login)
* PHP module gmp (for passwordless login)

Recommended for specific apps (*optional*):

* PHP module gmp (for SFTP storage)
* PHP module exif (for image rotation in pictures app)

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

.. note::
   If the preview generation of PDF files fails with a "not authorized" error message, you must adjust the imagick policy file.
   See https://cromwell-intl.com/open-source/pdf-not-authorized.html

For command line processing (*optional*):

* PHP module pcntl (enables command interruption by pressing ``ctrl-c``)

.. note::
   You also need to ensure that pcntl_signal and pcntl_signal_dispatch are not disabled
   in your php.ini file.

For command line updater (*optional*):

* PHP module phar (upgrades Nextcloud by running ``sudo -u www-data php /var/www/nextcloud/updater/updater.phar``)

You don’t need the WebDAV module for your Web server (i.e. Apache’s
``mod_webdav``), as Nextcloud has a built-in WebDAV server of its own,
SabreDAV.
If ``mod_webdav`` is enabled you must disable it for Nextcloud. (See
:ref:`apache_configuration_label` for an example configuration.)

.. _apache_configuration_label:

Apache Web server configuration
-------------------------------

Configuring Apache requires the creation of a single configuration
file. On Debian, Ubuntu, and their derivatives, this file will be
:file:`/etc/apache2/sites-available/nextcloud.conf`. On Fedora,
CentOS, RHEL, and similar systems, the configuration file will be
:file:`/etc/httpd/conf.d/nextcloud.conf`.

You can choose to install Nextcloud in a directory on an existing
webserver, for example `https://www.example.com/nextcloud/`, or in a
virtual host if you want Nextcloud to be accessible from its own
subdomain such as `https://cloud.example.com/`.

To use the directory-based installation, put the following in your
:file:`nextcloud.conf` replacing the **Directory** and **Alias** filepaths
with the filepaths appropriate for your system::

    Alias /nextcloud "/var/www/nextcloud/"

    <Directory /var/www/nextcloud/>
      Require all granted
      AllowOverride All
      Options FollowSymLinks MultiViews

      <IfModule mod_dav.c>
        Dav off
      </IfModule>
    </Directory>

To use the virtual host installation, put the following in your
:file:`nextcloud.conf` replacing **ServerName**, as well as the
**DocumentRoot** and **Directory** filepaths with values appropriate
for your system::

    <VirtualHost *:80>
      DocumentRoot /var/www/nextcloud/
      ServerName  your.server.com

      <Directory /var/www/nextcloud/>
        Require all granted
        AllowOverride All
        Options FollowSymLinks MultiViews

        <IfModule mod_dav.c>
          Dav off
        </IfModule>
      </Directory>
    </VirtualHost>


On Debian, Ubuntu, and their derivatives, you should run the following
command to enable the configuration::

    a2ensite nextcloud.conf


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
must be writable by the HTTP user. To enable ``mod_env`` and ``mod_rewrite``, run ``sudo a2enmod env`` and ``sudo a2enmod rewrite``. Then you can set in the :file:`config.php` two variables::

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
          plan to make your Nextcloud server publicly accessible. Consider getting
          a certificate signed by a signing authority. Check with your domain name
          registrar or hosting service for good deals on commercial certificates.
          Or use a free `Let's Encrypt <https://letsencrypt.org/>`_ ones.
 
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

    /etc/php/8.0/apache2/php.ini
  or
    /etc/php/8.0/fpm/php.ini
  or ...

**php.ini - used by the php-cli and so by Nextcloud CRON jobs:**
::

    /etc/php/8.0/cli/php.ini

.. note:: Path names have to be set in respect of the installed PHP
          (8.0, 8.1 or 8.2) as applicable.

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
| ``/etc/php/8.0/fpm/`` | ``/etc/php-fpm.d/``   |
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

Alternatively it is possible to use the environment variables of your system by modifying::

    /etc/php/8.0/fpm/pool.d/www.conf

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
``post_max_size`` values. You will need to restart ``php-fpm`` and your HTTP
server in order for these changes to be applied.

**.htaccess notes for Apache**

Nextcloud comes with its own ``nextcloud/.htaccess`` file. Because ``php-fpm``
can't read PHP settings in ``.htaccess`` these settings and permissions must
be set in the ``nextcloud/.user.ini`` file.

.. _other_HTTP_servers_label:

Other Web servers
-----------------

* :doc:`nginx`

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

The VM comes in different sizes and versions.

You can find all the available versions `here <https://shop.hanssonit.se/product-category/virtual-machine/nextcloud-vm/>`_.

For complete instructions and downloads see:

- `Nextcloud VM (GitHub) <https://github.com/nextcloud/vm/>`_
- `Nextcloud VM (T&M Hansson IT) <https://www.hanssonit.se/nextcloud-vm/>`_

.. note:: You can install the VM on several different operating systems as long as you can mount OVA, VMDK, or VHD/VHDX VM in your hypervisor. If you are using KVM then you need to install the VM from the scripts on GitHub. You can follow the `instructions in the README <https://github.com/nextcloud/vm#build-your-own-vm-or-install-on-a-vps>`_.

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

Installation via web installer on a VPS or web space
----------------------------------------------------

When you don't have access to the command line, for example at a web hosting or VMPS,
an easy option is to use our web installer. This script can be found on our
`server installation page here. <https://nextcloud.com/install/#instructions-server>`_

The script checks the dependencies, downloads Nextcloud from the official server,
unpacks it with the right permissions and the right user account. Finally, you will be
redirected to the Nextcloud installer. Here a quick how-to:

1. Get the file from the installation page
2. Upload setup-nextcloud.php to your web space
3. Point your web browser to setup-nextcloud.php on your webspace
4. Follow the instructions and configure Nextcloud
5. Login to your newly created Nextcloud instance!

.. note:: that the installer uses the same Nextcloud version as available for the built
   in updater in Nextcloud. After a major release it can take up to a month before
   it becomes available through the web installer and the updater. This is done to
   spread the deployment of new major releases out over time.

Installation on TrueNAS
-----------------------

See the `TrueNAS installation documentation <https://www.truenas.com/docs/core/solutions/integrations/nextcloud/>`_.

Installation via install script
-------------------------------

One of the easiest ways of installing is to use the Nextcloud VM or NextcloudPI scripts. It's basically just two steps:

1. Download the latest `installation script <https://github.com/nextcloud/vm/blob/master/nextcloud_install_production.sh/>`_.
2. Run the script with::

    sudo bash nextcloud_install_production.sh
    
or

1. Download the latest `installation script <https://raw.githubusercontent.com/nextcloud/nextcloudpi/master/install.sh/>`_.
2. Run the script with::

    sudo bash install.sh

A guided setup will follow and the only thing you have to do it to follow the on screen instructions, when given to you.


.. _Nextcloud VM:
    https://github.com/nextcloud/vm
