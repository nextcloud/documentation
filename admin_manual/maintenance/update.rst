Updating ownCloud with the Updater App
======================================

The Updater app automates many of the steps of updating an ownCloud installation 
to the next point release. The Updater app should be enabled in your ownCloud 
instance by default, which you can easily confirm by looking on your Apps page.

Updating and upgrading your ownCloud installation are two different tasks. 
Updating means updating to the next point release, which is indicated 
by third digit of the version number. For example, 4.5.1, 5.0.17, 6.0.4 and 
7.0.1 are point releases. (Look at the bottom of your Admin page to see your 
version number.)

Major releases are indicated by the first and second digits. So 4.5.0, 5.0.0, 
6.0.0, and 7.0.0 are major releases. The Updater app is not for upgrades; 
please see :doc:`upgrade` for instructions on upgrading to a major release.

If you installed ownCloud from your Linux distribution repositories using your 
package manager, then it is best to update/upgrade ownCloud using your package 
manager and staying in sync with your distro updates, rather than using the 
Updater app or upgrading manually. You should still maintain regular backups 
(see :doc:`backup`), and make a backup before every update/upgrade. 

.. note:: If you have a large ownCloud installation you
   should not use the Updater app, in order to avoid PHP timeouts. The Updater 
   app is better for smaller installations that have less data and fewer 
   users, and for admins who do not have shell access, for example on shared 
   hosting. Larger installations should update ownCloud with their 
   Linux package managers or manually upgrade, and then complete the update 
   with the ``occ upgrade`` command, which is in the ``owncloud`` directory. 
   Run ``occ help`` to see complete command options. (ownCloud Enterprise 
   Edition does not include the Updater app.)   

The Updater app performs these operations:

* Creates a ``backup`` directory under your ownCloud data directory
* Download and extracts updated package content into the 
  ``backup/packageVersion`` directory
* Makes a copy of your current ownCloud instance, except for your data 
  directory, to  ``backup/currentVersion-randomstring``
* Moves all directories except ``data``, ``config`` and ``themes`` from the 
  current instance to ``backup/tmp``
* Moves all directories from ``backup/packageVersion`` to the current version
* Copies your old ``config.php`` to the new ``config/`` directory

Using the Updater app to upgrade your ownCloud installation is just a few 
steps:

1. You should see a notification at the top of any ownCloud page when there is 
   a new update available:
   
.. figure:: ../images/updater-1.png
   
2. Even though the Update app backs up important directories, you should 
   always have your own current backups (See :doc:`backup` for details.)
   
3. Verify that the HTTP user on your system can write to your whole ownCloud 
   directory; on a stock Linux installation this is the ``www-data`` or 
   ``apache`` user on systems that are running the Apache HTTP server. You can 
   find your HTTP user in your HTTP server configuration files. Or you can 
   create a PHP page to find it for you. To do this, create a plain text file 
   with this single line in it:

      ``<?php echo exec('whoami'); ?>``
   
   Name it ``whoami.php`` and place it in your Web root directory, for example ``/var/www/html``, and then open it in a Web browser, for example 
   ``http://servername/whoami.php``. You should see a single line in your 
   browser page with the HTTP user name.
   
4. Navigate to your 'Admin' page and click the 'Update Center' button under 
   Updater:

.. figure:: ../images/updater-2.png

5. This takes you to the Updater control panel.

.. figure:: ../images/updater-3.png

6. Click Update, and carefully read the messages. If there are any problems it 
   will tell you. The most common issue is directory permissions; see :ref:`setting_strong_permissions`.
   
   
   otherwise you will see a message about checking your 
   installation, making a backup, and moving files:

.. figure:: ../images/updater-4.png

8. Click Proceed, and then it downloads the updates, which may take a few 
   minutes:

.. figure:: ../images/updater-5.png

7. The Update app wants you to be very sure you want to update, and so you must 
   click one more button, the Start Update button:

.. figure:: ../images/updater-6.png

8. It works for a few minutes, and when it is finished displays a success 
   message, which disappears after a short time. 
   
.. figure:: ../images/updater-7.png

Refresh your Admin page to verify your new version number.

If the Updater app fails, then you must update manually. See :doc:`upgrade` to 
learn how to upgrade manually. 

.. _setting_strong_permissions:

Setting Strong Permissions
--------------------------

The generic command to change ownership of all files and subdirectories in a 
directory is::

    chown -R <http-user>:<http-user> /path/to/owncloud/
    
For hardened security we  highly recommend setting the permissions on your ownCloud directory as strictly 
as possible. These commands should be executed immediately after the initial installation::
  
    chown -R root:root /path/to/owncloud/
    chmod -R 755 /path/to/owncloud/
    chown <http-user>:<http-user> /path/to/owncloud/config/config.php
    chmod 750 /path/to/owncloud/config/config.php
    chown -R <http-user>:<http-user> /path/to/owncloud/data/
    chmod -R 750 /path/to/owncloud/data
    chown root:root /path/to/owncloud/data/.htaccess
    chmod 755 /path/to/owncloud/data/.htaccess
    chown <http-user>:<http-user> /path/to/owncloud/apps/
    chmod 750 /path/to/owncloud/apps/
    
These strict permissions will prevent the Updater app from working, as it needs your whole
ownCloud directory to be owned by the http-user, like these examples:

* This example is for Ubuntu 14.04 LTS server::
   
    chown -R www-data:www-data /var/www/owncloud

* Arch Linux::

    chown -R http:http /path/to/owncloud/

* Fedora::

    chown -R apache:apache /path/to/owncloud/
	
* openSUSE::

    chown -R wwwrun:www /path/to/owncloud/
    
After the Updater app has run, you should re-apply the strict permissions.    



