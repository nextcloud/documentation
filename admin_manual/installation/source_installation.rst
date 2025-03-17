=====================
Installation on Linux
=====================

Introduction
------------

This installation guide provides a general overview of required dependencies and their 
configuration for a typical manual (i.e. from scratch) installation on Linux. This is referred to 
as an "Archive-based installation" (i.e. from a ``.tar.bz2`` or ``.zip`` archive). In addition, 
alternative installation methods are highlighted for the reader's consideration.

Overview
--------

If you prefer the flexibility and control of installing from a source Archive (tarball / zip file), 
you can setup a Nextcloud stack from scratch. Nextcloud utilizes a classic LAMP-style stack (i.e. 
Linux, Apache, MySQL/MariaDB, PHP) along with some variations (i.e. different database backends) and 
optional stack components (i.e. distributed in-memory databases and in-memory caching for added 
performance or scalability).

.. tip:: Optional Nextcloud stack components, such as the in-memory databases and in-memory caching 
   provided by Redis are useful even in smaller deployments. For this reason they are recommended for
   all use cases. However, they are not required for initial installation, and  are easy to integrate 
   afterward when/if desired.

The Nextcloud ``.tar.bz2`` archive contains the source code for Nextcloud Server itself as well as 
the default apps and third-party libraries needed to run Nextcloud. 

This document provides a walk-through for installing Nextcloud on an Ubuntu instance (Server-edition /
LTS), with Apache and MariaDB, using the downloadable Nextcloud Server `Archive file 
<https://nextcloud.com/install/>`_. This is the recommended method for installing Nextcloud from 
scratch.

Additional example installation guides, based on this material, for specific \*NIX OS distributions are 
also available:

- :doc:`./example_ubuntu`
- :doc:`./example_centos`.
- :doc:`./example_openbsd`.

Alternative Installation Methods
--------------------------------

If you prefer or require an installation method that is more "packaged" or automated than a standard
Archive-based installation, there are alternative installation methods. 

.. note:: Note that is some variance between installation methods in terms of functionality and 
   requirements. Consult each installation method's official documentation for specifics.

* Nextcloud All-in-One (aka AIO)
   - An official installation method that is maintained by `Nextcloud GmbH <https://nextcloud.com/>`_ (the 
     legal entity that employs many of the most active Nextcloud developers and contributors).
   - A pre-designed and container-based full Nextcloud stack.
   - Designed for ease of deployment and maintenance with most features included.
   - Includes Office, a turnkey Backup solution, Imaginary (for previews of heic, heif, illustrator, 
     pdf, svg, tiff and webp) and much more (many components are optional). Full feature list available
     `here <https://github.com/nextcloud/all-in-one?tab=readme-ov-file#nextcloud-all-in-one>`_.
   - Up to 100 users are free (though without any direct service or support or guarantees). Free community 
     support is provided via the `Nextcloud Community Help Forum <https://help.nextcloud.com/>`_ and a 
     `dedicated GitHub Discussions area <https://github.com/nextcloud/all-in-one/discussions>`_ (on a best 
     efforts basis).
   - For slightly larger installations (>100 users) an AIO specific `Nextcloud Enterprise arrangement 
     <https://nextcloud.com/all-in-one/>`_ is required (it includes a support SLA, security information and 
     all the other benefits that come with `Nextcloud Enterprise <https://nextcloud.com/all-in-one/>`_).
   - `Official Documentation <https://github.com/nextcloud/all-in-one>`_ (**Note**: see Official Documentation 
     for AIO specific installation and usage details).
* Nextcloud Community Snap
   - A community-driven installation method that is actively maintained by amazing Nextcloud community members 
     (make sure to thank them - or find a way help them out - if you get the opportunity!).
   - A full production-ready stack that will maintain your HTTPS certificates for you and will automatically 
     update as needed to stay secure. Full feature list available 
     `here <https://github.com/nextcloud-snap/nextcloud-snap?tab=readme-ov-file#snappy-nextcloud>`_.
   - Designed specifically for Ubuntu (`non-Ubuntu distributions are not officially supported 
     <https://github.com/nextcloud-snap/nextcloud-snap/wiki/Why-Ubuntu-is-the-only-supported-distro>`_).
   - `Official Wiki <https://github.com/nextcloud-snap/nextcloud-snap/wiki>`_
   - `Official Documentation <https://github.com/nextcloud-snap/nextcloud-snap>`_ (**Note**: see Official 
     Documentation - and Wiki - for Snap specific installation and usage details).
* Nextcloud Community VM Appliance (aka Nextcloud Virtual Machine or NcVM)
   - A community-driven installation method that is actively maintained by amazing Nextcloud community members 
     (make sure to thank them - or find a way to help them out - if you get the opportunity!) and partner Hansson
     IT.
   - Helps you create a personal or corporate Nextcloud Server faster and easier. 
   - Can be used install directly on a clean Ubuntu Server (as an install script) or downloaded as a fully 
     functioning VM. Full feature list available `here 
     <https://github.com/nextcloud/vm/?tab=readme-ov-file#server-installation-simplified-cloud>`_.
   - `Official Documentation <https://github.com/nextcloud/vm/>`_ (**Note**: see Official Documentation 
     for VM specific installation and usage details).
* NextcloudPi (aka: NCP)
   - A community-driven installation method that is actively maintained by amazing Nextcloud community members 
     (make sure to thank them - or find a way help them out - if you get the opportunity!).
   - A ready to use image for Virtual Machines, Raspberry Pi, Odroid HC1, Rock64 and other boards. Also supports
     LXD and LXC containers and there is an install script for the latest supported Debian based system as well.
   - It will setup everything for you and include scripts for automated installation of apps like: Collabora, 
     OnlyOffice, Talk and so on. Full feature list available 
     `here <https://github.com/nextcloud/nextcloudpi?tab=readme-ov-file#features>`_.
   - `Official Documentation <https://github.com/nextcloud/nextcloudpi>`_ (**Note**: see Official Documentation 
     for NCP specific installation and usage details).
* Nextcloud Community Docker Image
   - A community-driven installation method that is actively maintained by amazing Nextcloud community members 
     (make sure to thank them - or find a way help them out - if you get the opportunity!).
   - Two editions of the image are provided for building different types of Nextcloud stacks: the Apache image 
     contains a full Nextcloud installation including an Apache web server. The second option is an FPM 
     installation and runs a FastCGI process that serves your Nextcloud installation. The standard images are
     Debian-based, but Alpine variants are offered as well.
   - This image is designed for expert use and intended to be used in a micro-service environment where you can
     incorporate as a building block in your own Nextcloud stack (i.e. you will not need to install/update 
     Nextcloud, but you will need to supply your preferred web, reverse proxy, HTTPS termination, database and 
     other desired supplementary services).
   - Full Nextcloud stacks, incorporating the image, are provided in the form of example Docker Compose files 
     and Dockerfile variations. Full feature list available `here <https://github.com/nextcloud/docker/>`_.
   - `Official Documentation <https://github.com/nextcloud/docker/>`_ (**Note**: see Official Documentation 
     for Image specific installation and usage details).
* Nextcloud Web Installer
   - The Web Installer is an easy way to install Nextcloud Server in a shared / managed web space (e.g. shared 
     hosting) if you don't have access to the command line and if your environment meets the requirements.
   - Checks for essential PHP dependencies, downloads the Nextcloud Archive file from the official server, and 
     unpacks it with the right permissions then directs you to the Nextcloud Server Setup Wizard.
   - `Official Documentation <https://github.com/nextcloud/web-installer/>`_
* One Click Signup
   - An alternative to providing your own installation environment and installing and keeping a Nextcloud Server 
     up-to-date yourself.
   - Hosting offered by independent Nextcloud providers from all over the world.
   - Each has committed to providing you 2+ GB of storage on a 100% free single user account, with all the basic 
     Nextcloud apps. 
   - Through Simple Signup, getting started is made as easy as possible. You can with the suggested default provider 
     (based on your location) or choose another.
   - To sign-up click *Sign up with a provider* `here <https://nextcloud.com/install/#one-click-signup>`_.
* Nextcloud Enterprise
   - An official Nextcloud GmbH maintained installation method.
   - Optimized and tested for mission-critical deployment, Nextcloud helps your organizsation achieve digital 
     sovereignty with full security compliance.
   - For organizations from 50 to tens of millions of users in industries including education, government, legal
     and financial services and manufacturing. Customers include SIEMENS, all French universities covered under
     RENATER, the German Federal Government and more.
   - For details, see `Nextcloud Enterprise` <https://nextcloud.com/enterprise/>`_

.. tip:: The nuances of alternative packaging / installation methods mean that certain details may differ from an 
   Archive-based installation. This is true even though all alternatives installation methods ultimately utilize
   an Archive-based installation method underneath (one way or another). Example differences can include log 
   locations, configuration paths, and procedures for ``occ`` command access, installing, and updating. Refer to 
   each installation methods own dedicated documentation for specific differences.

.. tip:: For an enterprise-ready and scalable installation based on Helm Charts (also available for Podman), please `contact Nextcloud GmbH <https://nextcloud.com/enterprise/>`_.

.. note:: Please note that the community options are not officially supported by Nextcloud GmbH and support is primarily peer-based via community channels.

.. _prerequisites_label:

Prerequisites for manual installation
-------------------------------------

WebDAV
^^^^^^

You don’t need a WebDAV module for your Web server (i.e. Apache’s
``mod_webdav``), as Nextcloud has a built-in WebDAV server of its own,
SabreDAV. If ``mod_webdav`` is enabled you must disable it. (See
:ref:`apache_configuration_label` for an example configuration.) 

PHP Extensions
^^^^^^^^^^^^^^

There are some PHP extensions that must be installed and enabled before 
attempting to install Nextcloud Server. Your Linux distribution, in most 
cases, will have packages for these required PHP extensions (or they 
will be enabled already by default). See :doc:`php_configuration` for a 
list of required and suggested PHP extensions.

SELinux
^^^^^^^

SELinux-enabled distributions such as CentOS, Fedora, and Red Hat Enterprise 
Linux may need to set new rules to enable installing Nextcloud. See 
:ref:`selinux_tips_label` for a suggested configuration.

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

  and apply the following modifications the configuration::

    ProxyFCGIBackendType FPM
    
    <FilesMatch remote.php>
      SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
    </FilesMatch>

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

.. _background_jobs_label:

Setting up background jobs
--------------------------

Nextcloud requires that some tasks are run regularly. These may include
maintenance tasks to ensure optimal performance or time sensitive tasks like
sending notifications.

See :doc:`../configuration_server/background_jobs_configuration` for a detailed
description and the benefits.

.. _selinux_tips_label:

SELinux configuration tips
--------------------------

See :doc:`selinux_configuration` for a suggested configuration for
SELinux-enabled distributions such as Fedora and CentOS.

.. _php_fpm_tips_label:

PHP-FPM configuration 
---------------------

Overview
^^^^^^^^

`PHP-FPM <https://www.php.net/manual/en/install.fpm.php>`_ is a FastCGI based 
implementation of PHP containing features useful for busy web sites and large web 
applications. Using it with Nextcloud is an advanced topic and requires getting
familiar with how PHP-FPM functions. In most cases the defaults are not ideal for
use with Nextcloud. Here we'll highlight a few of the most important areas that
should be adjusted.

Process manager
^^^^^^^^^^^^^^^

The default value for ``pm.max_children`` in many PHP-FPM installations is
lower than appropriate. Having a low value may cause client connectivity 
problems, unexplained errors, and performance problems. It is a common cause
of *Gateway Timeouts*. Having too high of a value in relation to available
resources (such as memory), however, will also lead to problems. The default
value is often ``5``. This greatly limits simultaneously connections to your
Nextcloud instance and, unless you are severely resource constraints, will 
underutilize your hardware. Check the :doc:`../installation/server_tuning` 
chapter for some guidance and resources for coming up with appropriate values,
as well as other related parameters.

System environment variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When you are using ``php-fpm``, system environment variables like
PATH, TMP or others are not automatically populated in the same way as
when using ``php-cli``. A PHP call like ``getenv('PATH');`` can therefore
return an empty result. So you may need to manually configure environment
variables in the appropriate ``php-fpm`` ini/config file.

Here are some example root paths for these ini/config files:

+-----------------------+-----------------------+
| Debian/Ubuntu/Mint    | CentOS/Red Hat/Fedora |
+-----------------------+-----------------------+
| ``/etc/php/8.3/fpm/`` | ``/etc/php-fpm.d/``   |
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

    /etc/php/8.3/fpm/pool.d/www.conf

and uncommenting the line::

    clear_env = no

When you are using shared hosting or a control panel to manage your `Nextcloud VM`_
or server, the configuration files are almost
certain to be located somewhere else, for security and flexibility reasons, so
check your documentation for the correct locations.

Please keep in mind that it is possible to create different settings for
``php-cli`` and ``php-fpm``, and for different domains and Web sites.
The best way to check your settings is with :ref:`label-phpinfo`.

Maximum upload size
^^^^^^^^^^^^^^^^^^^

If you want to increase the maximum upload size, you will also have to modify
your ``php-fpm`` configuration and increase the ``upload_max_filesize`` and
``post_max_size`` values. You will need to restart ``php-fpm`` and your HTTP
server in order for these changes to be applied.

.htaccess
^^^^^^^^^

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
offered. Collabora, OnlyOffice, Full Text Search and other apps can easily be installed with the included scripts which you can choose to run during the first setup, or download them later and run it afterwards. You can find all the currently available automated app installations `on GitHub <https://github.com/nextcloud/vm/blob/main/apps/>`_.

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

1. Download the latest `VM installation script <https://github.com/nextcloud/vm/blob/main/nextcloud_install_production.sh/>`_.
2. Run the script with::

    sudo bash nextcloud_install_production.sh

or

1. Download the latest `PI installation script <https://raw.githubusercontent.com/nextcloud/nextcloudpi/master/install.sh>`_.
2. Run the script with::

    sudo bash install.sh

A guided setup will follow and the only thing you have to do it to follow the on screen instructions, when given to you.


.. _Nextcloud VM:
    https://github.com/nextcloud/vm
