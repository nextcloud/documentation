Updating ownCloud with the Updater App
======================================

Updating and upgrading your ownCloud installation are two different tasks. 
Updating means updating to the next point release, which is indicated 
by third digit of the version number. For example, 4.5.1, 5.0.17, 6.0.4 and 
7.0.1 are point releases. (Look at the bottom of your Admin page to see your 
version number.)

Major releases are indicated by the first and second digits. So 4.5.0, 5.0.0, 
6.0.0, and 7.0.0 are major releases. The Updater app is not for upgrades; 
please see foo for instructions on upgrading to a major release.

.. note:: If you installed ownCloud from your Linux distribution repositories 
   using your package manager, then it is best to update/upgrade ownCloud using 
   your package manager and staying in sync with your distro updates, rather 
   than using the Updater app or upgrading manually. You should still 
   maintain regular backups (see :doc:`backup`), and make a backup before every 
   update/upgrade. 

The Updater app automates many of the steps of updating an ownCloud installation 
to the next point release. The Updater app should be enabled in your ownCloud 
instance by default, which you can easily confirm by looking on your Apps page.

The Updater app performs these operations:

* Creates a ``backup`` directory under your ownCloud data directory
* Extracts updated package content into the ``backup/packageVersion`` directory
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
3. Verify that the PHP user on your system can write to your whole ownCloud 
   directory; usually this is the ``www-data`` or ``apache`` user 
4. Navigate to your 'Admin' page and click the 'Update Center' button under 
   Updater:

.. figure:: ../images/updater-2.png

5. This takes you to the Updater control panel.

.. figure:: ../images/updater-3.png

6. Click Update, and carefully read the messages. If there are any problems it 
   will tell you, otherwise you'll see a message about checking your 
   installation, making a backup, and moving files:

.. figure:: ../images/updater-4.png

8. Click Proceed, and then it downloads the updates, which may take a few 
   minutes:

.. figure:: ../images/updater-5.png

7. The Update app wants you to very sure you want to update, and so you must 
   click one more button, the Start Update button:

.. figure:: ../images/updater-6.png

8. It works for a few minutes, and when it's finished displays a success 
   message, which disappears after a short time. Refresh your Admin page to 
   verify your new version number.

.. figure:: ../images/updater-7.png

If the Update app fails, then you must update manually. See foo doc to learn 
how to upgrade manually. 




