==================================
Configuring External Storage (GUI)
==================================

The External Storage Support application enables you to mount external storage 
services and devices as secondary ownCloud storage devices. You may also allow 
users to mount their own external storage services.

All of these connect to a LAN ownCloud server that is not publicly accessible, 
with one exception: Google Drive requires an ownCloud server with a registered 
domain name that is accessible over the Internet.
  
New Settings Options
--------------------

Hover your cursor to the right of any external mount configuration to expose 
the settings button and trashcan. Click the trashcan to delete the 
mountpoint. The settings button allows you to configure each mountpoint 
individually with the following options:

* Encryption
* Previews
* Check for changes Never, Once every direct access, or Every time the 
  filesystem is Used. 
  
.. figure:: ../images/encryption13.png

Supported mounts
----------------

ownCloud admins may mount these external storage services and devices:

.. toctree::
    :maxdepth: 1

    external_storage/amazons3
    external_storage/dropbox
    external_storage/ftp
    external_storage/google
    external_storage/local
    external_storage/openstack
    external_storage/owncloud
    external_storage/sftp
    external_storage/smb
    external_storage/webdav

ownCloud users can be given permission to mount any of these, except local 
storage.

.. note:: A non-blocking or correctly configured SELinux setup is needed
   for these backends to work. Please refer to the :ref:`selinux-config-label`.

Enabling External Storage Support
---------------------------------

The ``External storage support`` application is enabled on the ``Apps`` page.

.. figure:: ../images/external-storage-app-enable.png

After enabling it, go to your ``Admin`` page to set up your external 
storage mounts.

.. figure:: ../images/external-storage-app-add.png

When your configuration is correct you'll see a green light at the left, and if 
it isn't you'll see a red light.

Check ``Enable User External Storage`` to allow your users to mount their own 
external storage services, and check the services you want to allow.

.. figure:: ../images/external-storage-app-usermounts.png

After creating your external storage mounts, you can share them and control 
permissions just like any other ownCloud share.

Using self-signed certificates
------------------------------

When using self-signed certificates for external storage mounts the certificate
needs to be imported in the personal settings of the user. Please refer to `this <http://ownclouden.blogspot.de/2014/11/owncloud-https-external-mount.html>`_
blogpost for more information.

Adding files to external storages
---------------------------------

In general it is recommended to configure the background job ``Webcron`` or
``Cron`` as described in :doc:`../configuration_server/background_jobs_configuration`
so ownCloud is able to detect files added to your external storages without the need
for a user to be browsing your ownCloud installation.

Please also be aware that ownCloud might not always be able to find out what has been
changed remotely (files changed without going through ownCloud), especially
when it's very deep in the folder hierarchy of the external storage.

You might need to setup a cron job that runs ``sudo -u www-data php occ files:scan --all``
(or replace "--all" with the user name, see also :doc:`../configuration_server/occ_command`)
to trigger a rescan of the user's files periodically (for example every 15 minutes), which includes
the mounted external storage.

Configuration File
------------------

The configuration of mounts created within the External Storage App are stored 
in the ``data/mount.json`` file. This file contains all settings in JSON 
(JavaScript Object Notation) format. Two different types of entries exist:

*   Group mounts: Each entry configures a mount for each user in group.
*   User mount: Each entry configures a mount for a single user or all users.

For each type, there is a JSON array with the user/group name as key and an 
array of configuration values as the value. Each entry consist of the class name 
of the storage backend and an array of backend specific options (described 
above) and will be replaced by the user login.

Although configuration may be done by making modifications to the 
``mount.json`` file, it is recommended to use the Web-GUI in the administrator 
panel (as described in the above section) to add, remove, or modify mount 
options to prevent any problems. See :doc:`external_storage_configuration` for 
configuration examples.
