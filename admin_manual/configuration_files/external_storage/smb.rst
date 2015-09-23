========
SMB/CIFS
========

ownCloud can connect to Windows file servers or other SMB compatible servers
with this backend.

.. note:: The SMB/CIFS backend requires ``smbclient`` to be installed on the
          ownCloud server. This should be included any any Linux distribution.

You need the following information:

*    Folder name for your local mountpoint.
*    Host: The URL of the Samba server.
*    Username: The username or domain/username used to login to the Samba 
     server.
*    Password: the password to login to the Samba server.
*    Share: The share on the Samba server to mount.
*    Remote Subfolder: The remote subfolder inside the Samba share to mount 
     (optional, defaults to /). To assign the ownCloud logon username 
     automatically to the subfolder, use ``$user`` instead of a particular 
     subfolder name. 
*    And finally, the ownCloud users and groups who get access to the share.

Optionally, a ``Domain`` can be specified. This is useful in cases where the
SMB server requires a domain and a username, and an advanced authentication
mechanism like 'Session credentials' is used such that the username cannot be
modified. This is concatenated with the username, so the backend gets
``domain\username``

Optionally, a ``Remote subfolder`` can be specified to change the destination
directory within the share. The default is the root of the share.

.. note:: For improved reliability and performance, we recommended installing   
         ``libsmbclient-php``, a native PHP module for connecting to
          SMB servers. It is available as ``php5-libsmbclient`` in the ownCloud
          `OBS repositories <https://software.opensuse.org/download/package?
          project=isv:ownCloud:community&package=php5-libsmbclient>`_

.. figure:: images/smb.png

See :doc:`../external_storage_configuration_gui` for additional mount 
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
