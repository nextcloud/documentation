===================================
How to Upgrade Your Nextcloud Server
===================================

There are three ways to upgrade your Nextcloud server:

* Using your :doc:`Linux package manager <package_upgrade>` with our official 
  Nextcloud repositories. This is the recommended method. 
* With the :doc:`Updater App <update>` (Server Edition only). Recommended for 
  shared hosters, and for users who want an easy way to track different 
  release channels. (It is not available and not supported on the Enterprise 
  edition.)
* :doc:`Manually upgrading <manual_upgrade>` with the Nextcloud ``.tar`` archive 
  from `nextcloud.org/install/`_. 
* Manually upgrading is also an option for users on shared hosting; download 
  and unpack the Nextcloud tarball to your PC. Delete your existing Nextcloud 
  files, except ``data/`` and ``config/`` files, on your hosting account. Then 
  transfer the new Nextcloud files to your hosting account, again 
  preserving your existing ``data/`` and ``config/`` files.
* Enterprise customers will use their Enterprise software 
  repositories to maintain their Nextcloud servers, rather than the Open Build 
  Service. Please see :doc:`../enterprise_installation/linux_installation` for 
  more information.
  
When an update is available for your Nextcloud server, you will see a 
notification at the top of your Nextcloud Web interface. When you click the 
notification it brings you here, to this page.

**It is best to keep your Nextcloud server upgraded regularly**, and to install 
all point releases and major releases without skipping any of them, as skipping 
releases increases the risk of errors. Major releases are 8.0, 8.1, 8.2, and 
9.0. Point releases are intermediate releases for each major release. For 
example, 8.0.9 and 8.1.3 are point releases. **Skipping major releases is not 
supported.**

**Upgrading is disruptive**. Your Nextcloud server will be put into maintenance 
mode, so your users will be locked out until the upgrade is completed. Large 
installations may take several hours to complete the upgrade.

.. warning:: **Downgrading is not supported** and risks corrupting your data! If 
   you want to revert to an older Nextcloud version, make a new, fresh 
   installation and then restore your data from backup. Before doing this, 
   file a support ticket (if you have paid support) or ask for help in the 
   Nextcloud forums to see if your issue can be resolved without downgrading.

.. not sure about notifications
.. Update Notifier and Updater App Are Not the Same
.. ------------------------------------------------

.. Nextcloud has two update tools: the Nextcloud core update notifier, and the 
.. Updater app. Figure 1 shows what you see when the Updater app is enabled: 
.. both 
.. the core notifier and the Updater app control panel are visible on your 
.. admin 
.. page.

.. .. figure:: images/2-updates.png
..   :alt: Both update mechanisms displayed on Admin page.
   
..   *Figure 1: The top yellow banner is the update notifier, and the Updates 
..   section is the Updater app.*
   
.. The core update notifier has only one function, and that is to display a 
.. notification when a new Nextcloud release is available. Then you decide which 
.. upgrade method to use. When you maintain your Nextcloud server via your Linux 
.. package manager you should ensure that the Updater app is disabled.
  
Prerequisites
-------------

You should always maintain :doc:`regular backups <backup>` and make a fresh 
backup before every upgrade.

Then review third-party apps, if you have any, for compatibility with the new 
Nextcloud release. Any apps that are not developed by Nextcloud show a 3rd party 
designation. **Install unsupported apps at your own risk**. Then, before the 
upgrade, all 3rd party apps must be disabled. After the upgrade is complete you 
may re-enable them.

.. _Open Build Service: 
   https://download.nextcloud.org/download/repositories/8.2/nextcloud/
   
.. _nextcloud.org/install/:
   https://nextcloud.org/install/  

Encryption migration from oC 7.0 to 8.0 and 8.0 to 8.1
------------------------------------------------------

The encryption backend was changed twice between Nextcloud 7.0 and 8.0 as well as
between 8.0 and 8.1. If you're upgrading from these older versions please refer to 
:ref:`upgrading_encryption_label` for the needed migration steps.

Debian Migration to Official Nextcloud Packages
----------------------------------------------

As of March 2016 Debian will not include Nextcloud packages. Debian users can 
migrate to the official Nextcloud packages by following this guide, 
`Upgrading Nextcloud on Debian Stable to official packages 
<https://nextcloud.org/blog/upgrading-nextcloud-on-debian-stable-to-official- 
packages/>`_.
