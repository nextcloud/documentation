========
SMB/CIFS
========

ownCloud can connect to Windows file servers or other SMB compatible servers
with this backend.

.. note:: The SMB/CIFS backend requires ``smbclient`` to be installed on the
          ownCloud server. This is a utility provided as part of the Samba
          project.

The following information is required:

- ``Host`` -- the hostname of the server, optionally with port: ``hostname.domain:port``
- ``Share`` -- the share to connect to

SMB/CIFS uses the password authentication scheme. See
:doc:`auth_mechanisms` for more information.

Optionally, a ``Domain`` can be specified. This is useful in cases where the
SMB server requires a domain and a username, and an advanced authentication
mechanism like 'Session credentials' is used such that the username cannot be
modified. This is concatenated with the username, so the backend gets
``domain\username``

Optionally, a ``Remote subfolder`` can be specified to change the destination
directory within the share. The default is the root of the share.

.. note:: For improved reliability and performance, it is recommended to
          install ``libsmbclient-php``, a native PHP module for connecting to
          SMB servers. It is available as ``php5-libsmbclient`` in the ownCloud
          `OBS repositories <https://software.opensuse.org/download/package?
          project=isv:ownCloud:community&package=php5-libsmbclient>`_

.. figure:: images/smb.png
