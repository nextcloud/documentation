====================
Upgrade via packages
====================
  
Upgrade quickstart
------------------

One effective, if unofficial method for keeping Nextcloud current on Linux servers is by configuring 
your system to use Nextcloud via a self-contained "Snap" package: a technology allowing users to 
always have the latest version of an "app".

That version from Canonical is quite restrictive. It is not aimed at developers or advanced users 
who would want to tune their configuration by installing extra features. It is aimed at end-users 
who want a no-brainer solution. Install it, use it. No need to worry about updating Nextcloud any 
more.

It will work for as long as Canonical pushes releases, just like with any other Linux package 
maintained independently of Nextcloud.

Installation
------------

**Ubuntu**

$ sudo snap install nextcloud

**All other distros**

(`be warned <https://github.com/nextcloud-snap/nextcloud-snap/wiki/Why-Ubuntu-is-the-only-supported-distro/>`_)

* Go to https://docs.snapcraft.io/installing-snapd/6735
* Type the command to install snapd
* Install Nextcloud ($ sudo snap install nextcloud)

1st login
---------

After a successful install, assuming you and the device on which it was installed are on the 
same network, you should be able to reach the Nextcloud installation by visiting .local in 
your browser. If your hostname is localhost or localhost.localdomain, like on an Ubuntu Base 
device (IoT), nextcloud.local will be used instead.

You will be asked to create a password for "admin" and your favourite cloud will be ready

**Note**

Do not use on IoT devices yet. You probably don't need these instructions anyway if you're 
using Snappy Base 16.04 as it's currently unreleased.


* Make a :doc:`fresh backup <backup>`.
* Upgrade your Nextcloud snap: sudo snap refresh nextcloud
* Run :ref:`occ upgrade <command_line_upgrade_label>`.
* Take your Nextcloud server out of :ref:`maintenance mode 
  <maintenance_commands_label>`.  
* Re-enable third-party apps.

Upgrade tips
------------

Upgrading Nextcloud from a Snap is just like upgrading any snap package.
For example:

 sudo snap refresh nextcloud
 
Your Snap package manager only upgrades the current Nextcloud Snap. Then 
your Nextcloud server is immediately put into maintenance mode. You may not see 
this until you refresh your Nextcloud page.

.. figure:: images/upgrade-1.png
   :scale: 75%
   :alt: Nextcloud status screen informing users that it is in maintenance mode.

Then use ``occ`` to complete the upgrade. You must run ``occ`` as your HTTP 
user. This example is for Debian/Ubuntu::

 sudo -u www-data php occ upgrade

This example is for CentOS/RHEL/Fedora::

 sudo -u apache php occ upgrade 

   
.. _skipped_release_upgrade_label:  
   
Upgrading across skipped releases
---------------------------------

It is best to update your Nextcloud installation with every new point release, 
and to never skip any major releases. While this requirement is being worked on, 
for the moment If you have skipped any major releases you can bring your 
Nextcloud current with these steps:

If you are using a Snap package:
sudo snap refresh nextcloud

If you did **not** install via a Snap package:

#. Upgrade your current version to the latest point release
#. Upgrade your current version to the next major release
#. Run upgrade routine
#. Repeat from step 2 until you reach the last available major release

You'll find previous Nextcloud releases in the `Nextcloud Server Changelog 
<https://nextcloud.com/changelog/>`_.

If upgrading via your Snap package manager fails, then you must perform a 
:doc:`manual_upgrade`.
