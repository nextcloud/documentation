=====
Local
=====

Local storages provide access to any directory on the Nextcloud server. Since
this is a significant security risk, Local storage can only be configured in
the Nextcloud admin settings. Non-admin users cannot create Local storage 
mounts. 

Use this to mount any directory on your Nextcloud server that is outside 
of your Nextcloud ``data/`` directory. This directory must be readable and 
writable by your HTTP server user. These ownership and permission examples 
are on Ubuntu Linux::

 sudo chown -R www-data:www-data /path/to/localdir
 sudo chmod -R 0750 /path/to/localdir

Important: If you use consecutive commands, make sure, you are user ``www-data``::

 sudo -u www-data bash
 cd /path/to/localdir
 mkdir data

In the **Folder name** field enter the folder name that you want to appear on 
your Nextcloud Files page.

In the **Configuration** field enter the full filepath of the directory you 
want to mount.

In the **Available for** field enter the users or groups who have permission to 
access the mount. By default all users have access.

.. figure:: images/local.png

See :doc:`../external_storage_configuration_gui` for additional mount 
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
