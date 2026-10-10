=========================
Upgrade via snap packages
=========================

Upgrade quickstart
------------------

Nextcloud snap is an unofficial Nextcloud designed to be easy to install and simple to maintain.
The ideal Nextcloud snap is an "install and forget" Nextcloud instance that works on most
architectures and updates itself without needing administrative skills.
Combining Nextcloud with snapd makes it a perfect fit for IoT or scalable environments.
Snapd is a secure and robust technology which the Nextcloud snap team has embraced.

However, the snap is opinionated.

- Nextcloud snap uses recommended Apache.
- Nextcloud snap uses recommended MySQL.
- Nextcloud snap uses recommended PHP.

Installation
------------

**On Ubuntu**

* https://snapcraft.io/nextcloud
* Install Nextcloud ``sudo snap install nextcloud``

**All other distros**
`be warned <https://github.com/nextcloud-snap/nextcloud-snap/wiki/Why-Ubuntu-is-the-only-supported-distro/>`_

By default the latest stable Nextcloud snap release will be installed and it will automatically update to
subsequent stable releases, but there are `other releases available as well <https://github.com/nextcloud/nextcloud-snap/wiki/Release-strategy>`_
and you have full control of `automatic updates <https://github.com/nextcloud-snap/nextcloud-snap/wiki/Managing-automatic-updates>`_.

After installation, Nextcloud will start automatically.
Assuming you and the device on which it was installed are on the same network, you will reach the Nextcloud
installation by visiting ``<hostname>.local`` or the IP address of the instance in your browser.
If your hostname is ``localhost``  or ``localhost.localdomain``, like on an Ubuntu Core device,
``nextcloud.local`` will be used instead.

1st login
---------

Upon visiting the Nextcloud installation for the first time, you will be prompted to enter an admin username
and password before Nextcloud is initialised. This may take a while depending on resources and the device.
After you provide that information you will be logged in and able to install apps, create users, and upload files.

Upgrade tips
------------

By default the Nextcloud snap will automatically update to subsequent stable releases. You may however upgrade
manually too by issuing the command:

``sudo snap refresh nextcloud``

.. note::

   Snap installs are usually tracked on a **channel tied to a major version**
   (for example ``27`` or ``stable``). ``snap refresh`` alone only updates
   within the channel you are already on. To move to a newer major release,
   switch the channel first, then refresh::

      sudo snap switch --channel=28 nextcloud
      sudo snap refresh nextcloud

   Replace ``28`` with the target major channel from the
   `release strategy <https://github.com/nextcloud-snap/nextcloud-snap/wiki/Release-strategy>`_.

If the upgrade fails you can easily revert to the last working version by issuing the command:

``sudo snap revert nextcloud``

After a successful snap refresh that includes a Nextcloud major upgrade, finish
the database/app upgrade with the snap-wrapped ``occ`` (not a system
``php occ`` as ``www-data``)::

   sudo nextcloud.occ upgrade

Further documentation, an `extensive Wiki <https://github.com/nextcloud-snap/nextcloud-snap/wiki>`_ and `FAQ's <https://github.com/nextcloud-snap/nextcloud-snap/wiki/FAQ's>`_  can be found on the `developers GitHub <https://github.com/nextcloud-snap/nextcloud-snap>`_.
