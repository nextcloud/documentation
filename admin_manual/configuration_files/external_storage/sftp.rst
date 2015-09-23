====
SFTP
====

ownCloud's SFTP backend connects to an SFTP server over an SSH tunnel. It 
supports both password and public key authentication. Select **SFTP** from the 
**Add Storage** dropdown menu for password authentication, and **SFTP with 
secret key login** for public key authentication.

The ``Host`` field is required; a port can be specified as part of the ``Host`` 
field in the following format: ``hostname.domain:port``. The default port is 22 
(SSH).

For public key authentication, you can generate a public/private key pair from 
your **SFTP with secret key login** configuration.

.. figure:: images/auth_mechanism.png

After generating your keys, you need to copy your new public key to the
destination server in ``.ssh/authorized_keys``. ownCloud will then use its
private key to connect to the SFTP server.

The default **Remote Subfolder** is the root directory (``/``) of the remote 
SFTP server, and you may enter any directory you wish.

See :doc:`../external_storage_configuration_gui` for additional mount 
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
