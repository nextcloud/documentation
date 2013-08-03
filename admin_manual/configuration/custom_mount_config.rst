Custom Mount Configuration
==========================

Since ownCloud 4.0 it is possible to configure the filesystem to mount external
storage providers into ownCloud's virtual file system. You can configure these
file systems by creating and editing :file:`data/mount.json`. This file contains
all settings in JSON (JavaScript Object Notation) format. At the moment two
different types of entries exist:

-  **Group mounts:** each entry configures a mount for each user in group.
-  **User mounts:** each entry configures a mount for a single user or for all
   users.

For each type, there is a JSON array with the user/group name as key, and an
array of configuration entries as value. Each entry consist of the class name
of the storage backend and an array of backend specific options and will be
replaced by the user login. The template **$user** can be used in the mount
point or backend options. As of writing the following storage backends are
available for use:

-  Local file system
-  FTP (or FTPS)
-  SFTP
-  SMB
-  WebDAV
-  `Amazon S3`_
-  `Dropbox`_
-  `Google Drive`_
-  `OpenStack Swift`_

Please keep in mind that some formatting has been applied and carriage returns
have been added for better readability. In the :file:`data/mount.json` all
values need to be concatenated and written in a row without these modifications!

It is recommended to use the :doc:`Web-GUI <custom_mount_config_gui>` in the
administrator panel to add, remove or modify mount options to prevent any problems!

Example
-------

.. code-block:: json

    {"group":{
        "admin":{
            "\/$user\/files\/Admin_Stuff":{
                "class":"\\OC\\Files\\Storage\\Local",
                "options":{ ... }
                }
            }
        }
     "user":{
        "all":{
            "\/$user\/files\/Pictures":{
                "class":"\\OC\\Files\\Storage\\DAV",
                "options":{ ... }
                }
            }
        "someuser":{
            "\/someuser\/files\/Music":{
                "class":"\\OC\\Files\\Storage\\FTP",
                "options":{ ... }
                }
            }
        }
    }

Backends
--------

Local Filesystem
~~~~~~~~~~~~~~~~

The local filesystem backend mounts a folder on the server into the virtual
filesystem, the class to be used is **\\OC\\Files\\Storage\\Local**\  and
takes the following options:

-  **datadir** : the path to the local directory to be mounted


Example
^^^^^^^

.. code-block:: json

    { "class":"\\OC\\Files\\Storage\\Local",
      "options":{ "datadir":"\/mnt\/additional_storage" }
    }

.. note:: You must ensure that the web server has sufficient permissions on the folder.

FTP (or FTPS)
~~~~~~~~~~~~~

The FTP backend mounts a folder on a remote FTP server into the virtual
filesystem and is part of the ‘External storage support’ app, the class
to be used is **\\OC\\Files\\Storage\\FTP**\  and takes the following
options:

-  **host**: the hostname of the ftp server
-  **user**: the username used to login on the ftp server
-  **password**: the password to login on the ftp server
-  **secure**: whether to use ftps:// (FTP over TLS) to connect to the ftp
   server instead of ftp:// (optional, defaults to false)
-  **root**: the folder inside the ftp server to mount (optional, defaults
   to ‘/’)


Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\FTP",
        "options":{
            "host":"ftp.myhost.com",
            "user":"johndoe",
            "password":"secret",
            "root":"\/Videos",
            "secure":"false"
        }
    }

.. note:: PHP needs to be build with FTP support for this backend to work.

SFTP
~~~~

The SFTP backend mounts a folder on a remote SSH server into the virtual
filesystem and is part of the ‘External storage support’ app. The class
to be used is **\\OC\\Files\\Storage\\SFTP**\  and takes the following
options:

-  **host**: the hostname of the SSH server
-  **user**: the username used to login to the SSH server
-  **password**: the password to login on the SSH server
-  **root**: the folder inside the SSH server to mount (optional, defaults
   to ‘/’)


Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\SFTP",
        "options":{
            "host":"ssh.myhost.com",
            "user":"johndoe",
            "password":"secret",
            "root":"\/Books"
        }
    }

.. note:: PHP needs to be build with SFTP support for this backend to work.

SMB
~~~
The SMB backend mounts a folder on a remote Samba server, a NAS appliance or
a Windows machine into the virtual file system. It is part of the ‘External
storage support’ app, the class to be used is **\\OC\\Files\\Storage\\SMB**\  and
takes the following options:

-  **host**: the host name of the samba server
-  **user**: the user name used to login on the samba server
-  **password**: the password to login on the samba server
-  **share**: the share on the samba server to mount
-  **root**: the folder inside the samba share to mount (optional, defaults
   to ‘/’)

.. note:: The SMB backend requires **smbclient** to be installed on the server.

Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\SMB",
        "options":{
            "host":"myhost.com",
            "user":"johndoe",
            "password":"secret",
            "share":"\/test",
            "root":"\/Pictures"
        }
    }

WebDAV
~~~~~~

The WebDAV backend mounts a folder on a remote WebDAV server into the
virtual filesystem and is part of the ‘External storage support’ app,
the class to be used is **\\OC\\Files\\Storage\\DAV**\  and takes the
following options:

-  **host**: the hostname of the webdav server.
-  **user**: the username used to login on the webdav server
-  **password**: the password to login on the webdav server
-  **secure**: whether to use https:// to connect to the webdav server
   instead of http:// (optional, defaults to false)
-  **root**: the folder inside the webdav server to mount (optional,
   defaults to ‘/’)


Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\DAV",
        "options":{
            "host":"myhost.com\/webdav.php",
            "user":"johndoe",
            "password":"secret",
            "secure":"true"
        }
    }

Amazon S3
~~~~~~~~~

The Amazon S3 backend mounts a bucket in the Amazon cloud into the virtual
filesystem and is part of the ‘External storage support’ app, the class to
be used is **\\OC\\Files\\Storage\\AmazonS3**\  and takes the following
options:

-  **key**: the key to login to the Amazon cloud
-  **secret**: the secret to login to the Amazon cloud
-  **bucket**: the bucket in the Amazon cloud to mount


Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\AmazonS3",
        "options":{
            "key":"key",
            "secret":"secret",
            "bucket":"bucket"
        }
    }

Dropbox
~~~~~~~

The Dropbox backend mounts a dropbox in the Dropbox cloud into the virtual
filesystem and is part of the ‘External storage support’ app, the class to
be used is **\\OC\\Files\\Storage\\Dropbox**\  and takes the following options:

-  **configured**: whether the drive has been configured or not (true or false)
-  **app_key**: the app key to login to your Dropbox
-  **app_secret**: the app secret to login to your Dropbox
-  **token**: the OAuth token to login to your Dropbox
-  **token_secret**: the OAuth secret to login to your Dropbox


Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\Dropbox",
        "options":{
            "configured":"#configured",
            "app_key":"key",
            "app_secret":"secret",
            "token":"#token",
            "token_secret":"#token_secret"
        }
    }

Google Drive
~~~~~~~~~~~~

The Google Drive backend mounts a share in the Google cloud into the virtual
filesystem and is part of the ‘External storage support’ app, the class to
be used is **\\OC\\Files\\Storage\\Google**\  and is done via an OAuth2.0 request.
That means that the App must be registered through the Google APIs Console.
The result of the registration process is a set of values (incl. client_id, client_secret).
It takes the following options:

-  **configured**: whether the drive has been configured or not (true or false)
-  **client_id**: the client id to login to the Google drive
-  **client_secret**: the client secret to login to the Google drive
-  **token**: a compound value including access and refresh tokens

Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\Google",
        "options":{
            "configured":"#configured",
            "client_id":"#client_id",
            "client_secret":"#client_secret",
            "token":"#token"
        }
    }

OpenStack Swift
~~~~~~~~~~~~~~~

The Swift backend mounts a container on an OpenStack Object Storage server
into the virtual filesystem and is part of the ‘External storage support’
app, the class to be used is **\\OC\\Files\\Storage\\SWIFT**\  and takes
the following options:

-  **host**: the hostname of the authentication server for the swift
   storage.
-  **user**: the username used to login on the swift server
-  **token**: the authentication token to login on the swift server
-  **secure**: whether to use ftps:// to connect to the swift server instead
   of ftp:// (optional, defaults to false)
-  **root**: the container inside the swift server to mount (optional,
   defaults to ‘/’)

Example
^^^^^^^

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\SWIFT",
        "options":{
            "host":"swift.myhost.com\/auth",
            "user":"johndoe",
            "token":"secret",
            "root":"\/Videos",
            "secure":"true"
        }
    }


.. _Amazon S3: http://aws.amazon.com/de/s3/
.. _Dropbox: https://www.dropbox.com/
.. _Google Drive: https://drive.google.com/start
.. _OpenStack Swift: http://openstack.org/projects/storage/
