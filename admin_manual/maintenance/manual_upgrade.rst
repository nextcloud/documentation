========================
Manual Nextcloud Upgrade
========================

Always start by making a fresh backup and disabling all 3rd party apps.

Put your server in maintenance mode. This prevents new logins, locks the 
sessions of logged-in users, and displays a status screen so users know what is 
happening. There are two ways to do this, and the preferred method is to use the 
:doc:`occ command <../configuration_server/occ_command>`, which you must run as 
your HTTP user. This example is for Ubuntu Linux::

 sudo -u www-data php occ maintenance:mode --on
 
The other way is by entering your ``config.php`` file and changing 
``'maintenance' => false,`` to ``'maintenance' => true,``. 

1. Back up your existing Nextcloud Server database, data directory, and 
   ``config.php`` file. (See :doc:`backup`, for restore information see :doc:`restore`)
2. Download and unpack the latest Nextcloud Server release (Archive file) from 
   `nextcloud.com/install/`_ into an empty directory outside
   of your current installation.
   
   .. note:: To unpack your new tarball, run:
      tar xjf nextcloud-[version].tar.bz2
    

3. Stop your Web server.

4. Rename your current Nextcloud directory, for example ``nextcloud-old``.

5. Unpacking the new archive creates a new ``nextcloud`` directory populated 
   with your new server files. Copy this directory and its contents to the 
   original location of your old server, for example ``/var/www/``, so that 
   once again you have ``/var/www/nextcloud``.

6. Copy the ``config.php`` file from your old Nextcloud directory to your new 
   Nextcloud directory.

7. If you keep your ``data/`` directory in your ``nextcloud/`` directory, copy 
   it from your old version of Nextcloud to your new ``nextcloud/``. If you keep 
   it outside of ``nextcloud/`` then you don't have to do anything with it, 
   because its location is configured in your original ``config.php``, and 
   none of the upgrade steps touch it.

8. If you are using 3rd party applications, look in your new ``nextcloud/apps/`` 
   directory to see if they are there. If not, copy them from your old ``apps/``
   directory to your new one. Make sure the directory permissions of your third
   party application directories are the same as for the other ones.
   
9. Adjust file ownership and permissions::

     chown -R www-data:www-data nextcloud
     find nextcloud/ -type d -exec chmod 750 {} \;
     find nextcloud/ -type f -exec chmod 640 {} \;

10. Restart your Web server.

11. Now launch the upgrade from the command  line using ``occ``, like this 
    example on Ubuntu Linux::
    
     sudo -u www-data php occ upgrade
     
12. The upgrade operation takes a few minutes to a few hours, depending on the 
    size of your installation. When it is finished you will see a success 
    message, or an error message that will tell where it went wrong.   

Assuming your upgrade succeeded, disable the maintenance mode::

     sudo -u www-data php occ maintenance:mode --off

Login and take a look at the bottom of your Admin page to 
verify the version number. Check your other settings to make sure they're 
correct. Go to the Apps page and review the core apps to make sure the right 
ones are enabled. Re-enable your third-party apps. Then apply strong 
permissions to your Nextcloud directories (:ref:`strong_perms_label`).

Previous Nextcloud Releases
---------------------------

You'll find previous Nextcloud releases in the `Nextcloud Server Changelog 
<https://nextcloud.com/changelog/>`_.

Troubleshooting
---------------

When upgrading Nextcloud and you are running MySQL or MariaDB with binary 
logging 
enabled, your upgrade may fail with these errors in your MySQL/MariaDB log::

 An unhandled exception has been thrown:
 exception 'PDOException' with message 'SQLSTATE[HY000]: General error: 1665 
 Cannot execute statement: impossible to write to binary log since 
 BINLOG_FORMAT = STATEMENT and at least one table uses a storage engine limited 
 to row-based logging. InnoDB is limited to row-logging when transaction 
 isolation level is READ COMMITTED or READ UNCOMMITTED.' 

Please refer to :ref:`db-binlog-label` on how to correctly configure your 
environment.

Occasionally, *files do not show up after a upgrade*. A rescan of the files can 
help::

 sudo -u www-data php console.php files:scan --all

See `the nextcloud.com support page <https://nextcloud.com/support/>`_ for further
resources.

Sometimes, Nextcloud can get *stuck in a upgrade*. This is usually due to the 
process taking too long and encountering a PHP time-out. Stop the upgrade 
process this way::

 sudo -u www-data php occ maintenance:mode --off
  
Then start the manual process::
  
 sudo -u www-data php occ upgrade

If this does not work properly, try the repair function::

 sudo -u www-data php occ maintenance:repair


.. _nextcloud.com/install/:
   https://nextcloud.com/install/  
  
