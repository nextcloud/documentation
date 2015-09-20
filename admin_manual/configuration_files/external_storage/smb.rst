========
SMB/CIFS
========

You can mount SMB/CIFS file shares on ownCloud servers that run on Linux. This 
requires ``php5-libsmbclient`` (`installation instructions 
<https://software.opensuse.org/download.html?project=isv%3AownCloud%3Acommunity% 
3A8.1&package=php5-libsmbclient>`_). SMB/CIFS file servers include any Windows 
file share, Samba servers on Linux and other Unix-type operating systems, and 
NAS appliances. 

You need the following information:

*   Folder name -- Whatever name you want for your local mountpoint.
*   Host -- The URL of the Samba server.
*   Username -- The username or domain/username used to login to the Samba server.
*   Password -- The password to login to the Samba server.
*   Share -- The share on the Samba server to mount.
*   Remote Subfolder -- The remote subfolder inside the Samba share to mount 
    (optional, defaults to ``/``). To assign the ownCloud logon username 
    automatically to the subfolder, use ``$user`` instead of a particular 
    subfolder name. And finally, the ownCloud users and groups who get access 
    to the share.    

.. figure:: ../../images/external-storage-smb.png

SMB/CIFS using OC login
-------------------------

This works the same way as setting up a SMB/CIFS mount, except you can use your 
ownCloud logins intead of the SMB/CIFS server logins. To make this work, your 
ownCloud users need the same login and password as on the SMB/CIFS server. 

.. note:: Shares set up with ``SMB/CIFS using OC login`` cannot be shared in 
   ownCloud. If you need to share your SMB/CIFS mount, then use the SMB/CIFS 
   mount without oC login.
