================
Upgrade manually
================

Overview
--------

In some environments using the Built-in Updater in Web mode is not reliable (such as due to web server
timeouts) and running it in command-line mode is not an option (such as in some shared hosting environments).
In these cases a manual upgrade may be the best approach.

A manual upgrade consists of downloading and unpacking the Nextcloud Archive file either to your PC or host. Then
deleting your existing Nextcloud Server installation files and folders, **except ``data/`` and ``config/``**, on 
your host. Then moving the new Nextcloud Server installation files into the appropriate place on your host, 
again preserving your existing ``data/`` and ``config/`` files. And doing a few other housekeeping items, such as
making sure your installed apps are transferred into the new installation and adjusting permissions. That may sound
like a lot, but detailed instructions are below.

.. important::
   Before upgrading, especially between major versions (e.g. v27.y.z -> v28.y.z) please review
   :ref:`critical changes<critical-changes>` first. These are highlights of changes that may be required
   in your environment to accommodate changes in Nextcloud Server. These notes are periodically revised as
   needed so it is a good idea to revisit them even when proceeding with minor and maintenance upgrades just
   in case.

.. warning::

   When upgrading manually, you must confirm your system meets the 
   :doc:`../installation/system_requirements` of the new version as well as that you are 
   following the standard :doc:`upgrade requirements <./upgrade>` (such as upgrading to 
   the latest maintenance release *before* upgrading to a new major release).


Step-by-Step Manual Upgrade
---------------------------

.. important:: Always start by making a fresh backup and disabling all 3rd party apps.

1. Back up your existing Nextcloud Server database, data directory, and 
   ``config.php`` file. (See :doc:`backup`, for restore information see :doc:`restore`)

2. Choose a target Nextcloud Server release from `<https://nextcloud.com/changelog/>`_ and 
   download the Archive file (tarball or zip archive) into an empty directory outside of 
   your current installation. 
   
   .. warning:: You cannot jump more than one major version forward at a time 
        (i.e. 27->28 is okay, but 27->29 is not).
  
3. Unpack the the downloaded tarball or zip archive - e.g.::

        unzip nextcloud-[version].zip
        (or)
        tar -xjf nextcloud-[version].tar.bz2
    
4. Stop your Web server.

5. In case you are running a cron-job for nextcloud's house-keeping disable it
   by commenting the entry in the crontab file::

     crontab -u www-data -e

   (Put a `#` at the beginning of the corresponding line.)

6. Rename your current Nextcloud directory, for example ``nextcloud-old``.

7. Unpacking the new archive creates a new ``nextcloud`` directory populated 
   with your new server files. Move this directory and its contents to the 
   original location of your old server. For example ``/var/www/``, so that 
   once again you have ``/var/www/nextcloud``.

8. Copy the ``config/config.php`` file from your old Nextcloud directory to your new 
   Nextcloud directory.

9. If you keep your ``data/`` directory in your ``nextcloud/`` directory, move 
   it from your old version of Nextcloud to your new ``nextcloud/``. If you keep 
   it outside of ``nextcloud/`` then you don't have to do anything with it, 
   because its location is configured in your original ``config.php``, and 
   none of the upgrade steps touch it.

10. If you are using 3rd party application, it may not always be available in your
    upgraded/new Nextcloud instance. To check this, compare a list of the apps in the 
    new ``nextcloud/apps/`` folder to a list of the of the apps in your backed-up/old 
    ``nextcloud/apps/`` folder. If you find 3rd party apps in the old folder that needs
    to be in the new/upgraded instance, simply copy them over and ensure the permissions
    are set up as shown below.

11. If you have additional apps folders like for example ``nextcloud/apps-extras`` or ``nextcloud/apps-external``,
    make sure to also transfer/keep these in the upgraded folder.
  
12. If you are using 3rd party theme make sure to copy it from your ``themes/``
    directory to your new one. It is possible you will have to make some
    modifications to it after the upgrade.
   
13. Adjust file ownership and permissions::

     chown -R www-data:www-data nextcloud
     find nextcloud/ -type d -exec chmod 750 {} \;
     find nextcloud/ -type f -exec chmod 640 {} \;

14. Restart your Web server.

15. Now launch the upgrade from the command line using ``occ``, like this 
    example on Ubuntu Linux::
    
     sudo -u www-data php occ upgrade
     
    (!) this MUST be executed from within your nextcloud installation directory
     
16. The upgrade operation takes a few minutes to a few hours, depending on the 
    size of your installation. When it is finished you will see a success 
    message, or an error message that will tell where it went wrong.

17. Re-enable the nextcloud cron-job. (See step 4 above.)

     crontab -u www-data -e

    (Delete the `#` at the beginning of the corresponding line in the crontab file.)

Login and take a look at the bottom of your Admin page to 
verify the version number. Check your other settings to make sure they're 
correct. Go to the Apps page and review the core apps to make sure the right 
ones are enabled. Re-enable your third-party apps.

Previous Nextcloud releases
---------------------------

You'll find previous Nextcloud releases in the `Nextcloud Server Changelog 
<https://nextcloud.com/changelog/>`_.

Troubleshooting
---------------

Occasionally, *files do not show up after a upgrade*. A rescan of the files can 
help::

 sudo -u www-data php console.php files:scan --all

See `the nextcloud.com support page <https://nextcloud.com/support/>`_ for further
resources.

Sometimes, Nextcloud can get *stuck in a upgrade* if the web based upgrade
process is used. This is usually due to the process taking too long and
encountering a PHP time-out. Stop the upgrade process this way::

 sudo -u www-data php occ maintenance:mode --off
  
Then start the manual process::
  
 sudo -u www-data php occ upgrade

If this does not work properly, try the repair function::

 sudo -u www-data php occ maintenance:repair


.. _nextcloud.com/install/:
   https://nextcloud.com/install/  
  
