=======================================
Upgrading ownCloud with the Updater App
=======================================

The Updater app automates many of the steps of updating an ownCloud 
installation. You should keep your ownCloud server updated and not skip any 
releases. The Updater app is enabled in your ownCloud Server instance by 
default, which you can confirm by looking on your Apps page.

The Updater App is not required, and it is recommended to use other methods for 
keeping your ownCloud server up-to-date, if possible. (See :doc:`upgrade`.) The 
Updater App is useful for installations that do not have root access, 
such as shared hosting, and for installations with a smaller number of users 
and data.

.. note:: The Updater app is not enabled and not supported in ownCloud 
   Enterprise Subscription.

You should maintain regular backups (see :doc:`backup`), and make a backup 
before every update. The Updater app does not backup your database or data 
directory.

The Updater app performs these operations:

* Creates an ``updater_backup`` directory under your ownCloud data directory
* Download and extracts updated package content into the 
  ``updater_backup/packageVersion`` directory
* Makes a copy of your current ownCloud instance, except for your data 
  directory, to  ``updater_backup/currentVersion-randomstring``
* Moves all directories except ``data``, ``config`` and ``themes`` from the 
  current instance to ``updater_backup/tmp``
* Moves all directories from ``updater_backup/packageVersion`` to the current 
  version
* Copies your old ``config.php`` to the new ``config/`` directory

Using the Updater app to update your ownCloud installation is just a few 
steps:

1.  You should see a notification at the top of any ownCloud page when there is 
    a new update available:
   
.. figure:: ../images/updater-1.png
   
2.  Even though the Updater app backs up important directories, you should 
    always have your own current backups (See :doc:`backup` for details.)
   
3.  Verify that the HTTP user on your system can write to your whole ownCloud 
    directory; see the :ref:`setting_strong_permissions` section below.
   
4.  Navigate to your Admin page and click the `Update Center` button under 
    Updater:

.. figure:: ../images/updater-2.png

5.  This takes you to the Updater control panel.

.. figure:: ../images/updater-3.png

6.  Click Update, and carefully read the messages. If there are any problems it 
    will tell you. The most common issue is directory permissions; your HTTP 
    user needs write permissions to your whole ownCloud directory. (See 
    :ref:`setting_strong_permissions`.) Otherwise you will see messages about 
    checking your installation and making backups.
    
.. figure:: ../images/updater-9.png
    :scale: 75 %

7.  Click Proceed, and then it performs the remaining steps, which takes a few 
    minutes.
    
.. figure:: ../images/updater-10.png  
    :scale: 75 %

8.  If your directory permissions are correct, a backup was made, and 
    downloading the new ownCloud archive succeeded you will see the following 
    screen. Click the Start Update button to complete your update:

.. figure:: ../images/updater-8.png

..  note:: If you have a large ownCloud installation, at this point you
    should use the ``occ upgrade`` command, running it as your HTTP user, 
    instead of clicking the Start Update button, in order to avoid PHP 
    timeouts. The ``occ`` command does not download ownCloud updates. 
    You must first download and install the updated code, and then ``occ`` 
    performs the final upgrade steps.  This example is for Ubuntu Linux::

     $ sudo -u www-data php occ upgrade
 
Before completing the upgrade, ownCloud first runs a simulation by copying all 
database tables to a temporary directory and then performing the upgrade on 
them, to ensure that the upgrade will complete correctly. This takes twice as 
much time, which on large installations can be many hours, so you can omit this 
step with the ``--skip-migration-test`` option::

 $ sudo -u www-data php occ upgrade --skip-migration-test 

See :doc:`../configuration_server/occ_command` to learn more.

9.  It runs for a few minutes, and when it is finished displays a success 
    message, which disappears after a short time. 
   
.. figure:: ../images/updater-7.png

Refresh your Admin page to verify your new version number. In the Updater 
section of your Admin page you can see the current status and backups. These 
are backups of your old and new ownCloud installations, and do not contain your 
data files. If your update works and there are no problems you can delete the 
backups from this screen.

.. figure:: ../images/updater-11.png
    :scale: 75 %

If the update fails, then you must update manually. (See :doc:`upgrade`.)

Can't Login Without Updating
----------------------------

If you can't login to your ownCloud installation without performing an update 
first, this means that updated ownCloud files have already been downloaded to 
your server, most likely via your Linux package manager during a routine system 
update. So you only need to click the Start Update button, or run the ``occ`` 
command to complete the update.

.. _setting_strong_permissions:

Setting Strong Permissions
--------------------------
   
For hardened security we  highly recommend setting the permissions on your 
ownCloud directory as strictly as possible. These commands should be executed 
immediately after the initial installation. Please follow the steps in the 
**Setting Strong Directory Permissions** section of 
:doc:`../installation/installation_wizard`.
    
These strict permissions will prevent the Updater app from working, as it needs 
your whole ownCloud directory to be owned by the HTTP user. The generic command 
to change ownership of all files and subdirectories in a directory to the HTTP 
user is::

    chown -R <http-user>:<http-user> /path/to/owncloud/

* This example is for Ubuntu 14.04 LTS server::
   
    chown -R www-data:www-data /var/www/owncloud

* Arch Linux::

    chown -R http:http /path/to/owncloud/

* Fedora::

    chown -R apache:apache /path/to/owncloud/
	
* openSUSE::

    chown -R wwwrun:www /path/to/owncloud/
    
After the Updater app has run, you should re-apply the strict permissions.