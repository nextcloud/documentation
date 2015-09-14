ownCloud Community Appliance
===================
ownCloud has a publically developed community appliance `on GitHub`_. Download the latest release from the Appliances tab at the `ownCloud server installation page`_. The easiest way to get the VM up and running is by using `VirtualBox`_ and downloading the OVA image from the installation page.

Instructions for VirtualBox and OVA
~~~~~~~~~~~~~~~~~~~

Follow these steps to get the appliance working:

1. Download the Virtual Machine image zip file and unpack it
2. Start VirtualBox and click on *File ...* *Import Appliance ...*
3. Click the green Start arrow. After a minute you should see the console greeting message.
.. figure:: ../images/community-vm-console.png
   :scale: 50%
   
   *Click to enlarge*
4. Note the username and password here. It is a random password that we generate for you on first boot.
5. If you log in at the console, you'll  be prompted to change the password. This is optional.
6. With your web-browser try ``http://localhost:8888`` or ``http://localhost:80`` or the addess printed on the console.
     One of them should work. If not, please review and adjust the network setup of virtualbox to bridged mode.
7. You should see a webpage with login credentials (if you haven't changed them already) and a list of URLs to try to reach the ownCloud web service.  Which one works, again depends on the network setup of your hypervisor.
     .. figure:: ../images/community-vm-splash.png
   :scale: 50%
   
   *Click to enlarge*

.. note:: Before diving into ownCloud, please consider memorizing the admin password, and cmake sure the login credentials are no longer displayed. Click the *[Hide Credentials]* button. When using the proxy-app, this web-page may be publically visible.

.. note:: Inside the VM, ownCloud runs with a default disk size of 40 GB and its own mysql database. The ownCloud admin user is also a valid account on the ubuntu system that runs inside the VM. You can ssh into the machine and do sudo from there, and administrate the system.

**For VMware**

1. Double click on the .vmx file
2. Network Adapter
3. Bridged Network

After the VM is booted a plain Ubuntu console appears, showing you the IP-address and initial login credentials. Here you have some options:

-  Follow the instructions on screen.
-  Direct your web browser to the IP-address shown in the console which will bring you to a basic web-page there with further instructions.


Software Appliances
~~~~~~~~~~~~~~~~~~~

There are a number of unofficial pre-made virtual machine-based appliances:

-  `SUSE Studio, ownCloud on openSuSE`_, runnable directly from an USB stick.
-  `Amahi home server`_
-  `ownCloud VM on Ubuntu 14.04 with MySQL and Apache`_, fully configured from start

.. ownCloud on Hardware Appliances
.. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. These are tutorials provided by the user communities of the respective appliances:

.. - `ownCloud 7 on Raspberry Pi (Arch Linux) using Lighttpd`_ for the popular credit-card sized computer
.. -  `QNAP Guide`_ for QNAP NAS appliances
.. -  `OpenWrt Guide`_ for the popular embedded distribution for routers and NAS devices.
.. -  `Synology Package`_ for Synology NAS products

.. _on Github: https://github.com/ownCloud/vm
.. _VirtualBox: https://www.virtualbox.org
.. _ownCloud server installation page: https://owncloud.org/install/#instructions-server 
.. _Amahi home server: https://wiki.amahi.org/index.php/OwnCloud
.. _ownCloud VM on Ubuntu 14.04 with MySQL and Apache: https://www.en0ch.se/pre-configured-owncloud-installaton/
.. _ownCloud 7 on Raspberry Pi (Arch Linux) using Lighttpd: http://eiosifidis.blogspot.de/2014/07/install-owncloud-7-on-raspberry-pi-arch.html
.. _OpenWrt Guide: http://wiki.openwrt.org/doc/howto/owncloud
.. _SUSE Studio, ownCloud on openSuSE: http://susestudio.com/a/TadMax/owncloud-in-a-box
.. _QNAP Guide: http://wiki.qnap.com/wiki/Category:OwnCloud
.. _Synology Package: http://www.cphub.net/index.php?id=40&pid=213
