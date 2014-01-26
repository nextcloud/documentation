Updating ownCloud
=================

.. note:: If you have installed ownCloud from a repository, your package management should take care of it. Probably
   you will need to look for compatible third party applications yourself. **Always do backups anyway.**

Update
------
Updating means updating ownCloud to the latest *point release*, e.g. ownCloud 4.0.6 → 4.0.7. This procedure uses the
ownCloud updater plugin called "Updater": it's an internal application already present in your ownCloud installation.

To update ownCloud, follow those steps:

#. Make a backup of the ownCloud folder and the database.
#. Make sure that updater plugin is enabled.
#. Navigate to the 'Admin' page.
#. Click 'Update'.
#. Refresh the page with Ctrl+F5.

If this procedure doesn't work (for example, ownCloud 5.0.10 doesn't show new any new version) you could try to perform
a full upgrade to update to the latest point release (see below).

Upgrade
-------
Upgrade is to bring an ownCloud instance to a new *major release*, e.g.
ownCloud 4.0.7 → 4.5.0. Always do backups anyway.

To upgrade ownCloud, follow those steps:

#. Make sure that you ran the latest point release of the major ownCloud
   version, e.g. 4.0.7 in the 4.0 series. If not, update to that version first
   (see above).
#. Make a backup of the ownCloud folder and the database.
#. Download the latest version to the working directory::
    
    wget http://download.owncloud.org/community/owncloud-latest.tar.bz2

#. Deactivate all third party applications.
#. Delete everything from your ownCloud installation directory, except data and
   config. Assuming that it's your working directory, you could execute this command::
    
    find . -mindepth 1 -maxdepth 1 ! -path data ! -path config -exec rm -rf {} \;

#. Unpack the release tarball in the ownCloud directory (or copy the
   files thereto). Assuming that your installation directory is called 'owncloud' and that it's inside your working
   directory, you could execute this command::
   
    tar xfj owncloud-latest.tar.bz2
   
#. With the next page request the update procedures will run.
#. If you had 3rd party applications, check if they provide versions compatible
   with the new release. If so, install and enable them, update procedures will run if needed. 
