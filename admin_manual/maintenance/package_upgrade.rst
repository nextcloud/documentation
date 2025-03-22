====================
Upgrade via packages
====================
  
Upgrade quickstart
------------------

Nextcloud snap is an unofficial Nextcloud designed to be easy to install and simple to maintain. 
The ideal Nextcloud snap is an "install and forget" Nextcloud instance that works on most 
architectures and updates itself without needing administrative skills. 
Combining Nextcloud with snapd makes it a perfect fit for IoT or scalable environments. 
Snapd is a secure and robust technology which the Nextcloud snap team has embraced.

However, the snap is opinionated. 
- Nextcloud snap uses Apache.
- Nextcloud snap uses MySQL. 
- Nextcloud snap uses PHP. 
In other words, it's not very tinker-friendly.

Installation
------------

**Ubuntu**

 sudo snap install nextcloud

**All other distros**

(`be warned <https://github.com/nextcloud-snap/nextcloud-snap/wiki/Why-Ubuntu-is-the-only-supported-distro/>`_)

By default the latest stable Nextcloud snap release will be installed and it will automatically update to 
subsequent stable releases, but there are [other releases available as well](https://github.com/nextcloud/nextcloud-snap/wiki/Release-strategy) 
and you have full control of [automatic updates](https://github.com/nextcloud-snap/nextcloud-snap/wiki/Managing-automatic-updates).

After installation, Nextcloud will start automatically.  
Assuming you and the device on which it was installed are on the same network, you will reach the Nextcloud 
installation by visiting `<hostname>.local` or the IP address of the instance in your browser. 
If your hostname is `localhost`  or `localhost.localdomain`, like on an Ubuntu Core device, 
`nextcloud.local` will be used instead. 

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

Then use ``nextcloud.occ`` to complete the upgrade. You must run ``nextcloud.occ`` as root. This example is for Debian/Ubuntu::

 sudo nextcloud.occ upgrade

This example is for CentOS/RHEL/Fedora::

 sudo /snap/bin/nextcloud.occ 
   
.. _skipped_release_upgrade_label:  
   
Upgrading across skipped releases
---------------------------------

.. seealso::

   If you upgrade from a previous major version please see :ref:`critical changes<critical-changes>` first.

It is best to update your Nextcloud installation with every new point release, 
and to never skip any major releases. While this requirement is being worked on, 
for the moment If you have skipped any major releases you can bring your 
Nextcloud current with these steps:

If you are using a Snap package:
 sudo snap refresh nextcloud --stable

If you did **not** install via a Snap package:

#. Upgrade your current version to the latest point release
#. Upgrade your current version to the next major release
#. Run upgrade routine
#. Repeat from step 2 until you reach the last available major release

You'll find previous Nextcloud releases in the `Nextcloud Server Changelog 
<https://nextcloud.com/changelog/>`_.

If upgrading via your Snap package manager fails, then you must perform a 
:doc:`manual_upgrade`.
