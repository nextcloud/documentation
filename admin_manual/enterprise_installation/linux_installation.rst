==================================================
Installing & Upgrading ownCloud Enterprise Edition
==================================================

The recommended method for installing and maintaining your ownCloud Enterprise 
edition is with your Linux package manager. Configure your package manager 
to use the ownCloud Enterprise repository, import the signing key, 
and then install and update ownCloud packages like any other software package. 
Please refer to the ``README - ownCloud Package Installation.txt`` document in 
your account at `Customer.owncloud.com 
<https://customer.owncloud.com/owncloud/>`_ account for instructions on setting 
up your Linux package manager.

After you have completed your initial installation of ownCloud as detailed in 
the README, follow the instructions in 
:doc:`../installation/installation_wizard` to finish setting up ownCloud.

To upgrade your Enterprise server, refer to 
:doc:`../maintenance/upgrade`.

Manual Installation
-------------------

Download the ownCloud archive from your account at https://customer.owncloud.com/owncloud, then follow the instructions at :doc:`../installation/source_installation`.

SELinux
-------

Linux distributions that use SELinux need to take some extra steps so that 
ownCloud will operate correctly under SELinux. Please see 
:doc:`../installation/selinux_configuration` for some recommended configurations.
