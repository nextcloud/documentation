===================================
Preferred Linux Installation Method
===================================

Installation Quick Start
------------------------

See the :doc:`system_requirements` for the recommended ownCloud setup and 
supported platforms.

Installing ownCloud Server (the free community edition) on Linux from our `Open 
Build Service`_ packages is the preferred method. These are maintained by 
ownCloud engineers, and you can use your package manager to keep your ownCloud 
server up-to-date.  Follow the instructions for your distro to add the ownCloud 
Open Build Service repository, download and install the repository signing key, 
and install ownCloud. Then run the Installation Wizard to complete your 
installation. (see :doc:`installation_wizard`).

.. note:: Do not move the folders provided by these packages after the 
   installation, as this will break updates.

.. _Open Build Service: 
   https://download.owncloud.org/download/repositories/8.2/owncloud/

Installing ownCloud Enterprise Subscription
-------------------------------------------

See :doc:`../enterprise_installation/linux_installation` for instructions on 
installing ownCloud Enterprise Subscription.

Downgrading Not Supported
-------------------------

Downgrading is not supported and risks corrupting your data! If you want to 
revert to an older ownCloud version, install it from scratch and then restore 
your data from backup. Before doing this, file a support ticket (if you have 
paid support) or ask for help in the ownCloud forums to see if your issue can be 
resolved without downgrading.

Additional Installation Guides and Notes
----------------------------------------

See :doc:`installation_wizard` for important steps such as choosing the best 
database and setting correct directory permissions.

See :doc:`selinux_configuration` for a suggested configuration for 
SELinux-enabled distributions such as Fedora and CentOS.

If your distribution is not listed, your Linux distribution may maintain its 
own 
ownCloud packages, or you may prefer to install from source code (see 
:doc:`source_installation`).

**Archlinux:** The current `stable version`_ is in the 
official community repository, and more packages are in 
the `Arch User Repository`_.

.. _stable version: https://www.archlinux.org/packages/community/any/owncloud
.. _Arch User Repository: https://aur.archlinux.org/packages/?O=0&K=owncloud

**Mageia:** The `Mageia Wiki`_ has a good page on installing ownCloud from the 
Mageia software repository.

.. _Mageia Wiki: https://wiki.mageia.org/en/OwnCloud

**Debian/Ubuntu:** The package installs an additional Apache config file to 
``/etc/apache2/conf-available/owncloud.conf`` which contains an ``Alias`` to the 
owncloud installation directory as well as some more needed configuration 
options.

**Running ownCloud in a subdir**: If you're running ownCloud in a subdir and
want to use CalDAV or CardDAV clients make sure you have configured the correct 
:ref:`service-discovery-label` URLs.

**Note for MySQL/MariaDB environments**: Please refer to :ref:`db-binlog-label`
on how to correctly configure your environment if you have binary logging enabled.
