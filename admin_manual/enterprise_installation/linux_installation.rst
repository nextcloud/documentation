==================================================
Installing & Upgrading Nextcloud Enterprise Edition
==================================================

The recommended method for installing and maintaining your Nextcloud Enterprise 
edition is with your Linux package manager. Configure your package manager 
to use the Nextcloud Enterprise repository, import the signing key, 
and then install and update Nextcloud packages like any other software package. 
Please refer to the ``README - Nextcloud Package Installation.txt`` document in 
your account at `Customer.nextcloud.com 
<https://customer.nextcloud.com/nextcloud/>`_ account for instructions on setting 
up your Linux package manager.

After you have completed your initial installation of Nextcloud as detailed in 
the README, follow the instructions in 
:doc:`../installation/installation_wizard` to finish setting up Nextcloud.

To upgrade your Enterprise server, refer to 
:doc:`../maintenance/upgrade`.

Manual Installation
-------------------

Download the Nextcloud archive from your account at https://customer.nextcloud.com/nextcloud, then follow the instructions at :doc:`../installation/source_installation`.

SELinux
-------

Linux distributions that use SELinux need to take some extra steps so that 
Nextcloud will operate correctly under SELinux. Please see 
:doc:`../installation/selinux_configuration` for some recommended configurations.
