===================================
Preferred Linux Installation Method
===================================

Recommend Setup and Supported Platforms
---------------------------------------

See the :doc:`../release_notes` for the recommended ownCloud setup and supported platforms.

Installing ownCloud Enterprise Subscription
-------------------------------------------

See :doc:`../enterprise_installation/linux_installation` for instructions on installing 
ownCloud Enterprise Subscription.

Supported Distribution Packages
-------------------------------

Installing ownCloud Server (the free community edition) on Linux from the 
`openSUSE Build Service`_ packages is the 
preferred method. These are maintained by ownCloud engineers, and you can use 
your package manager to keep your ownCloud server up-to-date. Ready-to-use 
packages are available at the ownCloud repository for a variety of Linux 
distributions. Follow the instructions for your distro to add the oBS 
repository, download and install the repository signing key, and install 
ownCloud. Then run the Installation Wizard to complete your installation. (see 
:doc:`installation_wizard`).

If your distribution is not listed, your Linux distribution may maintain its own 
ownCloud packages, or you may prefer to install from source code (see 
:doc:`source_installation`).

.. _openSUSE Build Service: http://software.opensuse.org/download.html?project=isv:ownCloud:community&package=owncloud

Additional Installation Guides and Notes
----------------------------------------

See :doc:`selinux_configuration` for a suggested configuration for 
SELinux-enabled distributions such as Fedora and CentOS.

**Archlinux:** The current `stable version`_ is in the 
official community repository, and more packages are in 
in `the Arch User Repository`_.

.. _stable version: https://www.archlinux.org/packages/community/any/owncloud
.. _the Arch User Repository: https://aur.archlinux.org/packages/?O=0&K=owncloud

**Mageia:** The `Mageia Wiki`_ has a good page on installing ownCloud from the Mageia software repository.

.. _Mageia Wiki: https://wiki.mageia.org/en/OwnCloud