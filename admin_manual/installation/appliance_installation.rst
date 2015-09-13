ownCloud Appliances
===================

Software Appliances
~~~~~~~~~~~~~~~~~~~

There are a number of pre-made virtual machine-based appliances:

-  `SUSE Studio, ownCloud on openSuSE`_, runnable directly from an USB stick.
-  `Amahi home server`_
-  `ownCloud VM on Ubuntu 14.04 with MySQL and Apache`_, fully configured from start

ownCloud community VM
~~~~~~~~~~~~~~~~~~~

ownCloud has publically developed a community appliance on GitHub. Download the latest release here:

-  `ownCloud community VM`_

Instructions
~~~~~~~~~~~~~~~~~~~

To be able to use it, you have to follow these steps:

**If you use VirtualBox**

1. Double click on the .ovf file
2. Import
3. Then open VirtualBox
4. Network
5. Bridged Network

**If you use VMware**

1. Double click on the .vmx file
2. Network Adapter
3. Bridged Network

After the VM is booted a plain Ubuntu console appears, showing you the IP-address and initial login credentials. Here you have some options:

-  Follow the instructions on screen.
-  Direct your web browser to the IP-address shown in the console which will bring you to a basic web-page there with further instructions.

.. ownCloud on Hardware Appliances
.. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. These are tutorials provided by the user communities of the respective appliances:

.. - `ownCloud 7 on Raspberry Pi (Arch Linux) using Lighttpd`_ for the popular credit-card sized computer
.. -  `QNAP Guide`_ for QNAP NAS appliances
.. -  `OpenWrt Guide`_ for the popular embedded distribution for routers and NAS devices.
.. -  `Synology Package`_ for Synology NAS products



.. _ownCloud community VM: https://owncloud.org/install/#instructions-server 
.. _Amahi home server: https://wiki.amahi.org/index.php/OwnCloud
.. _ownCloud VM on Ubuntu 14.04 with MySQL and Apache: https://www.en0ch.se/pre-configured-owncloud-installaton/
.. _ownCloud 7 on Raspberry Pi (Arch Linux) using Lighttpd: http://eiosifidis.blogspot.de/2014/07/install-owncloud-7-on-raspberry-pi-arch.html
.. _OpenWrt Guide: http://wiki.openwrt.org/doc/howto/owncloud
.. _SUSE Studio, ownCloud on openSuSE: http://susestudio.com/a/TadMax/owncloud-in-a-box
.. _QNAP Guide: http://wiki.qnap.com/wiki/Category:OwnCloud
.. _Synology Package: http://www.cphub.net/index.php?id=40&pid=213
