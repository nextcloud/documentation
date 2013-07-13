Custom Mount Configuration Web-GUI
==================================

Since ownCloud 5.0 it is possible to mount external storage providers into
ownCloud's virtual file system. To add an external storage backend to your
ownCloud head to Settings -> Admin or Personal. As an administrator you can
mount external storage for any group or user. Users are also allowed to mount
external storage for their selves if this setting has been enabled by the
administrator.

custom_mount_config_gui-1.png

At first you have to enter the mount point, this is the directory that the
storage will be mounted to. Then you select the storage backend from the list
of supported backends. As of writing ownCloud currently supports the following
storage backends:

custom_mount_config_gui-2.png

-  Local file system (mount storage that is outside your ownCloud’s data directory)
-  FTP (or FTPS)
-  SFTP
-  SMB
-  WebDAV
-  `Amazon S3`_
-  `Dropbox`_
-  `Google Drive`_
-  `OpenStack Swift`_

Please keep in mind, that users are not allowed to mount local file storage for
security purposes.

custom_mount_config_gui-3.png
custom_mount_config_gui-4.png

Once a backend has been selected, more configuration fields will appear. The
displayed configuration fields may vary depending on the selected storage backend.
For example, the FTP storage backend needs the following configuration details:

-  **host**: the hostname of the ftp server
-  **user**: the username used to login on the ftp server
-  **password**: the password to login on the ftp server
-  **secure**: whether to use ftps:// (FTP over TLS) to connect to the ftp
   server instead of ftp:// (optional, defaults to false)
-  **root**: the folder inside the ftp server to mount (optional, defaults
   to ‘/’)

If Dropbox or Google Drive as storage backend an OAuth dialog will be shown to
automatically generate and fetch the required token information.

.. _Amazon S3: http://aws.amazon.com/de/s3/
.. _Dropbox: https://www.dropbox.com/
.. _Google Drive: https://drive.google.com/start
.. _OpenStack Swift: http://openstack.org/projects/storage/
