==============================
Upgrading Your ownCloud Server
==============================

Starting with ownCloud 8.2 the Linux package repositories have changed, and 
**you must configure your system to use these new repos**. The new repos are at 
our `Open Build Service`_. Just follow the instructions for your Linux 
distribution, and then install new ownCloud packages in the usual way with your 
package manager.

It is best to keep your ownCloud server upgraded regularly, and to install all 
point releases and major releases without skipping any of them, as skipping 
releases increases the risk of errors. Major releases are 8.0, 8.1, 8.2, and 
9.0. Point releases are intermediate releases for each major release. For 
example, 8.0.9 and 8.1.3 are point releases.

There are multiple ways to keep your ownCloud server upgraded: with the 
:doc:`Updater App <update>` (Server Edition only), with your Linux package 
manager, and by manually upgrading. In this chapter you will learn how to keep 
your ownCloud installation current with your Linux package manager, and by 
manually upgrading.

.. note:: Enterprise Subscription customers will use their Enterprise software
   repositories to install ownCloud packages, rather 
   than the Open Build Service. Then follow the instructions on this page 
   for completing upgrades. Please see    
   :doc:`../enterprise_installation/linux_installation` for more information.

When you are upgrading to a major release, evaluate any third-party apps for 
compatibility with the upgrade, and then disable them before upgrading. You may 
re-enable them after the upgrade is completed.

.. note:: **Downgrading is not supported** and risks corrupting your data! If 
   you want to revert to an older ownCloud version, make a new, fresh 
   installation and then restore your data from backup. Before doing this, 
   file a support ticket (if you have paid support) or ask for help in the 
   ownCloud forums to see if your issue can be resolved without downgrading.

Upgrade Quickstart
------------------

The best method for keeping ownCloud on Linux servers current is by configuring 
your system to use ownCloud's `Open Build Service`_ repository. Then stay 
current by using your Linux package manager to install fresh ownCloud packages. 
After installing upgraded packages you must run a few more steps to complete 
the upgrade. These are the basic steps to upgrading ownCloud:

* :doc:`Disable <../installation/apps_management_installation>` all third-party 
  apps.
* Make a :doc:`fresh backup <backup>`.
* Install new packages from the ownCloud `Open Build Service`_.
* Take your ownCloud server out of :doc:`maintenance mode 
  <enable_maintenance>`.
* Run the :ref:`upgrade wizard <upgrade_wizard_label>` (optionally disabling 
  the :ref:`migration test <migration_test_label>`).
* Log in and :ref:`apply strong permissions <strong_perms_label>` to your 
  ownCloud directories.
* Re-enable third-party apps.
   
Prerequisites
-------------

You should always maintain regular backups and make a fresh backup before every 
upgrade.

Then review any third-party apps you have installed for compatibility with the 
new ownCloud release. Any apps that are not developed by ownCloud show a 3rd 
party designation. **Install unsupported apps at your own risk**. Then, before 
the upgrade, they must all be disabled. After the upgrade is complete and you 
are sure they are compatible with the new ownCloud release you may re-enable 
them.

**Upgrading is disruptive**. Your ownCloud server will be automatically put 
into maintenance mode, so your users will be locked out until the upgrade is 
completed. Large installations may take several hours to complete the upgrade.

Upgrading With Your Linux Package Manager
-----------------------------------------

When an ownCloud upgrade is available from ownCloud's `Open Build Service`_ 
repository, apply it just like any normal Linux upgrade. For example, on Debian 
or Ubuntu Linux this is the standard system upgrade command::

 $ sudo apt-get update && sudo apt-get upgrade
 
Or you can upgrade just ownCloud with this command::

 $ sudo apt-get update && sudo apt-get install owncloud
 
On Fedora, CentOS, and Red Hat Linux use ``yum`` to see all available updates::

 $ yum check-update
 
You can apply all available updates with this command::
 
 $ sudo yum update
 
Or update only ownCloud::
 
 $ sudo yum update owncloud
 
Your Linux package manager only downloads the current ownCloud packages. Then 
your ownCloud server is automatically put into maintenance mode.

.. figure:: images/upgrade-1.png
   :scale: 70%
   :alt: ownCloud status screen informing users that it is in maintenance mode.
   
   *Click to enlarge*

Next, take your server out of maintenance mode. You can do this by changing 
``'maintenance' => true,`` to ``'maintenance' => false,`` in ``config.php``, or 
use the :doc:`occ command <../configuration_server/occ_command>`, like this 
example on Ubuntu::

 $ sudo -u www-data php occ maintenance:mode --off
 
.. _upgrade_wizard_label:
 
Upgrade Wizard
--------------
 
The final step is to run the upgrade wizard to perform the final steps of 
updating your apps and database. You will see a screen with a summary of apps 
that are updated, and a **Start Update** button. If you have shell access it 
is better to **not** click the Start Update button, but rather to use ``occ 
upgrade``, like this example on CentOS::

 $ sudo -u apache php occ upgrade

.. figure:: images/upgrade-2.png
   :scale: 70%
   :alt: ownCloud upgrade status screen
   
   *Click to enlarge*

``occ upgrade`` is more reliable, especially on installations with large 
datasets and large numbers of users because it avoids the risk of PHP timeouts.

When the upgrade is completed you will be returned to the login screen.

.. _migration_test_label:

Migration Test
^^^^^^^^^^^^^^

Before completing the upgrade, ownCloud first runs a simulation by copying all 
database tables to a temporary directory and then performing the upgrade on 
them, to ensure that the upgrade will complete correctly. This can delay large 
installations by several hours, so you can omit this step with the 
``--skip-migration-test`` option, like this example on CentOS::

 $ sudo -u apache php occ upgrade --skip-migration-test

Setting Strong Permissions
^^^^^^^^^^^^^^^^^^^^^^^^^^

After upgrading, verify that your ownCloud directory permissions are set 
according to :ref:`strong_perms_label`.

If the upgrade fails, then you must try a manual upgrade.

Manual Upgrade Procedure
------------------------

Always start by making a fresh backup.

If you are upgrading to a major release, for example from 8.1.3 to 
8.2, you must review all third party applications (not core apps) for  
compatibility with your new ownCloud version. Then disable all of them 
before starting the upgrade.

Next put your server in maintenance mode. This prevents new logins, locks the 
sessions of logged-in users, and displays a status screen so users know what is 
happening. There are two ways to do this, and the preferred method is to use the 
:doc:`occ command <../configuration_server/occ_command>`, which you must run as 
your HTTP user. This example is for Ubuntu Linux::

 $ sudo -u www-data php occ maintenance:mode --on
 
The other way is by entering your ``config.php`` file and changing 
``'maintenance' => false,`` to ``'maintenance' => true,``. 

1. Back up your existing ownCloud Server database, data directory, and 
   ``config.php`` file. (See :doc:`backup`.)
2. Download and unpack the latest ownCloud Server release (Archive file) from 
   `owncloud.org/install/ 
   <https://owncloud.org/install/>`_ into an empty directory outside 
   of your current installation. For example, if your current ownCloud is 
   installed in ``/var/www/owncloud/`` you could create a new directory called
   ``/var/www/owncloud2/``
3. Stop your Web server.

4. Rename or move your current ownCloud directory (named ``owncloud/`` if 
   installed using defaults) to another location.

5. Unpack your new tarball::

    tar xjf owncloud-latest.tar.bz2
    
6. This creates a new ``owncloud/`` directory populated with your new server 
   files. Copy this directory and its contents to the original location of your 
   old server, for example ``/var/www/``, so that once again you have 
   ``/var/www/owncloud`` .

7. Copy and paste the ``config.php`` file from your old version of 
   ownCloud to your new ownCloud version.

8. If you keep your ``data/`` directory in your ``owncloud/`` directory, copy 
   it from your old version of ownCloud to the ``owncloud/`` directory of 
   your new ownCloud version. If you keep it outside of ``owncloud/`` then 
   you don't have to do anything with it, because its location is configured in 
   your original ``config.php``, and none of the upgrade steps touch it.

.. note:: We recommend storing your ``data/`` directory in a location other 
   than your ``owncloud/`` directory.

9. If you are using third party applications, look into the ``owncloud/apps/`` 
   directory to see if they are there. If not, copy them from your old ``apps/``
   directory to your new one. Make sure the directory permissions of your third
   party application directories are the same as for the other ones.

10. Restart your Web server.

11. Now launch the upgrade from the command  line using ``occ`` to
    avoid PHP timeouts, like this example on Ubuntu Linux::
    
     $ sudo -u www-data php occ upgrade
     
   .. note:: The ``occ`` command does not download ownCloud updates. You must first download
      and install the updated code (steps 1-3), and then ``occ`` performs the final upgrade steps.  
     
12. The upgrade operation takes a few minutes to a few hours, depending on the 
    size of your installation. When it is finished you will see a success 
    message, or an error message that will tell where it went wrong.   

Assuming your upgrade succeeded, disable the maintenance mode::

	$ sudo -u www-data php occ maintenance:mode --off

Login and take a look at the bottom of your Admin page to 
verify the version number. Check your other settings to make sure they're 
correct. Go to the Apps page and review the core apps to make sure the right 
ones are enabled. Re-enable your third-party apps. Then apply strong 
permissions to your ownCloud directories (:ref:`strong_perms_label`).

Reverse Upgrade
---------------

If you need to reverse your upgrade, see :doc:`restore`.

Troubleshooting
---------------

When upgrading ownCloud and you are running MySQL or MariaDB with binary logging 
enabled, your upgrade may fail with these errors in your MySQL/MariaDB log::

 An unhandled exception has been thrown:
 exception 'PDOException' with message 'SQLSTATE[HY000]: General error: 1665 
 Cannot execute statement: impossible to write to binary log since 
 BINLOG_FORMAT = STATEMENT and at least one table uses a storage engine limited 
 to row-based logging. InnoDB is limited to row-logging when transaction 
 isolation level is READ COMMITTED or READ UNCOMMITTED.' 

Please refer to :ref:`db-binlog-label` on how to correctly configure your environment.

Occasionally, *files do not show up after a upgrade*. A rescan of the files can help::

 $ sudo -u www-data php console.php files:scan --all

See `the owncloud.org support page <http://owncloud.org/support>`_ for further
resources for both home and enterprise users.

Sometimes, ownCloud can get *stuck in a upgrade*. This is usually due to the 
process taking too long and encountering a PHP time-out. Stop the upgrade 
process this way::

     $ sudo -u www-data php occ maintenance:mode --off
  
Then start the manual process::
  
    $ sudo -u www-data php occ upgrade

If this does not work properly, try the repair function::

    $ sudo -u www-data php occ maintenance:repair

.. _Open Build Service: 
   https://download.owncloud.org/download/repositories/8.2/owncloud/
   
