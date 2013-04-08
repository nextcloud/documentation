Updating ownCloud
=================

Update
------
Updating means updating ownCloud to the latest *point release*, e.g. ownCloud 4.0.6 → 4.0.7. To update an ownCloud installation manually, follow those steps:

.. note:: If you have installed ownCloud from a repository, your package management should take care of it.

#. Make a backup.
#. Unpack the release tarball in the owncloud directory, i.e. copy all new files into the ownCloud installation.
#. Make sure that the file permissions are correct.
#. After the next page request the update procedures will run.

Assuming your ownCloud installation is at **./owncloud/** and you want to update to the latest version, you could do the following:

Use rsync in archive mode (this leaves file owner, permissions, and time stamps untouched) to recursively copy all content from **./owncloud/** to a backup directory which contains the current date::

  rsync -a owncloud/ owncloud_bkp`date +"%Y%m%d"`/

Download the latest version to the working directory::

  wget http://download.owncloud.org/community/owncloud-latest.tar.bz2

Extract content of archive to **./owncloud_latest/**::

  mkdir owncloud_latest; tar -C owncloud_latest -xjf owncloud-latest.tar.bz2

Use rsync to recursivly copy extracted files (new) to ownCloud installation (old) using modification times of the new files, but preserving owner and permissions of the old files:

.. warning:: You should not use this [--inplace] option to update files that are being accessed by others *(from rysnc man page)*

::

  rsync --inplace -rtv owncloud_latest/owncloud/ owncloud/

Clean up::

  rm -rf owncloud-latest.tar.bz2 owncloud_latest/

Upgrade
-------

.. note:: The update to 5.0 is currently discouraged for users of the encryption app. A rewrite of the encryption will be released in a few weeks. If you have already upgraded to 5.0 you will not be able to decrypt your files. The solution to this is to downgrade to the old version again. **Also make a backup before you downgrade!**

Upgrade is to bring an ownCloud instance to a new *major release*, e.g.
ownCloud 4.0.7 → 4.5.0. Always do backups anyway.

.. note:: ownCloud 5.0.0 does not yet include the encryption app and an update would result in unreadable data. If you use the encryption app in 4.5 please wait until the app is available in 5.0

To upgrade ownCloud, follow those steps:

#. Make sure that you ran the latest point release of the major ownCloud
   version, e.g. 4.0.7 in the 4.0 series. If not, update to that version first
   (see above).
#. **Make a backup**
#. Deactivate all third party applications.
#. Delete everything from your ownCloud installation directory, except data and
   config.
#. Unpack the release tarball in the owncloud directory (or copy the
   files thereto).
#. Make sure that the file permissions are correct.
#. With the next page request the update procedures will run.
#. If you had 3rd party applications, check if they provide versions compatible
   with the new release.

If so, install and enable them, update procedures will run if needed.  9. If
you installed ownCloud from a repository, your package management should take
care of it. Probably you will need to look for compatible third party
applications yourself. Always do backups anyway.
