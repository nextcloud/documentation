Configuring External Storage (Configuration File)
=================================================

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

.. note:: You need to enable the `External storage support` app first before you
   can use the examples below. See the section :doc:`external_storage_configuration_gui`
   how to do this.

Please keep in mind that some formatting has been applied and carriage returns
have been added for better readability. In the :file:`data/mount.json` all
values need to be concatenated and written in a row without these modifications!

It is recommended to use the :doc:`Web-GUI <external_storage_configuration_gui>` in the
administrator panel to add, remove or modify mount options to prevent any problems!

Using self-signed certificates
------------------------------

When using self-signed certificates for external storage mounts the certificate
needs to be imported in the personal settings of the user. Please refer to `this <http://ownclouden.blogspot.de/2014/11/owncloud-https-external-mount.html>`_
blogpost for more informations.

Example
-------

.. code-block:: json

    {"group":{
        "admin":{
            "\/$user\/files\/Admin_Stuff":{
                "class":"\\OC\\Files\\Storage\\Local",
                "options":{ ... },
                "priority":150
                }
            }
        }
     "user":{
        "all":{
            "\/$user\/files\/Pictures":{
                "class":"\\OC\\Files\\Storage\\DAV",
                "options":{ ... },
                "priority":100
                }
            }
        "someuser":{
            "\/someuser\/files\/Music":{
                "class":"\\OC\\Files\\Storage\\FTP",
                "options":{ ... },
                "priority":100
                }
            }
        }
    }

Priorities
----------

An advanced feature is available, only configurable directly in
:file:`data/mount.json`, which allows mount configurations to have an associated
priority. When two or more valid mount configurations exist for the same mount point,
the one with the highest priority (defined by the largest number) will take precedence
and become the active mount for the user.

Each backend has a default priority, assigned when a mount configuration with that
backend is created. The default priority will be shown in the example section for
each backend below. Should a backend not provide a default priority, a value of 100
will be used.

There is also a concept of priority types, to preserve compatibility with
previous mount configuration parsing. Mount configurations are evaluated in the
following order, with later mount types always overriding a previous mount type:

-  user -> all : global mount configurations
-  group : group mount configurations
-  user (not all) : per-user mount configurations
-  :file:`data/$user/mount.json` : personal mount configurations

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
      "options":{ "datadir":"\/mnt\/additional_storage" },
      "priority":150
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
-  **root**: the remote subfolder inside the ftp server to mount (optional, defaults
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
        },
        "priority":100
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
-  **root**: the remote subfolder inside the SSH server to mount (optional, defaults
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
        },
        "priority":100
    }

.. note:: PHP needs to be build with SFTP support for this backend to work.

SMB
~~~
The SMB backend mounts a folder on a remote Samba server, a NAS appliance or
a Windows machine into the virtual file system. It is part of the ‘External
storage support’ app, the class to be used is **\\OC\\Files\\Storage\\SMB**\  and
takes the following options:

-  **host**: the host name of the samba server
-  **user**: the username or domain/username to login on the samba server
-  **password**: the password to login on the samba server
-  **share**: the share on the samba server to mount
-  **root**: the remote subfolder inside the samba share to mount (optional, defaults
   to ‘/’). To assign the ownCloud logon username automatically to the subfolder, use ``$user`` instead of a particular subfolder name.

.. note:: The SMB backend requires **smbclient** to be installed on the server.

Example
^^^^^^^
With username only:

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\SMB",
        "options":{
            "host":"myhost.com",
            "user":"johndoe",
            "password":"secret",
            "share":"\/test",
            "root":"\/Pictures"
        },
        "priority":100
    }
    
With domainname and username:

.. code-block:: json

    {   "class":"\\OC\\Files\\Storage\\SMB",
        "options":{
            "host":"myhost.com",
            "user":"domain\/johndoe",
            "password":"secret",
            "share":"\/test",
            "root":"\/Pictures"
        },
        "priority":100
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
-  **root**: the remote subfolder inside the webdav server to mount (optional,
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
        },
        "priority":100
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
        },
        "priority":100
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
        },
        "priority":100
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
        },
        "priority":100
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
        },
        "priority":100
    }

External Storage Password Management
------------------------------------
    
ownCloud handles passwords for external mounts differently than regular 
ownCloud user passwords.

The regular user and file share passwords (when you use the default ownCloud 
user backend) are stored using a strong cryptographically secure hashing 
mechanism in the database. On a new user account with a new password, the 
password is hashed and stored in the ownCloud database. The plain-text password 
is never stored. When the user logs in, the hash of the password they enter is 
compared with the hash in the database. When the hashes match the user is 
allowed access. These are not recoverable, so when a user loses a password the 
only option is to create a new password.

Passwords which are used to connect against external storage (e.g. 
SMB or FTP), there we have to differentiate again between different 
implementations:

1. **Login with ownCloud credentials** 

When a mountpoint has this option, for example ``SMB / CIFS using OC login``, 
the password will be intercepted when a user logs in and written to the PHP 
session (which is a file on the filesystem), and written encrypted into the 
session with a key from the configuration file. Every time that password is 
required ownCloud reads it from the PHP session file.

When you use this option, features such as sharing will not work properly from 
that mountpoint when the user is not logged-in.

Depending on the implementation of the application, this means that the password 
could get leaked in the ``ps`` output, as we use ``smbclient`` for SMB storage 
access in the community version. There is a `bug report on this 
<https://github.com/owncloud/core/issues/6092>`_. Consequently, we're currently 
evaluating an alternative approach accessing the library directly, and thus not 
leaking the password anymore. This is already implemented in the Enterprise 
Edition in our Windows Network Drive application, and it will get into the 
community version once we have streamlined the code of the ``files_external`` 
application a little bit more.

2. **Stored credentials**

When you enter credentials into the ``files_external`` dialog those are stored 
on the filesystem and encrypted with a key stored in ``config.php``. This is 
required since ownCloud needs access to those files and shares even when the 
user is not logged-in to have sharing and other key features properly working.

To sum up:

The "login with ownCloud credentials" SMB function in the community edition 
exposes the password in the server system's process list. If you want to get 
around this limitation without waiting for it to be addressed in CE you can get 
the Enterprise Edition. However, even then the password is stored in the PHP 
session and a malicious admin could access it. You can protect your PHP session 
files using protections available in your filesystem. Stored credentials are 
always accessible to the ownCloud instance.
   
.. _Amazon S3: http://aws.amazon.com/de/s3/
.. _Dropbox: https://www.dropbox.com/
.. _Google Drive: https://drive.google.com/start
.. _OpenStack Swift: http://openstack.org/projects/storage/
