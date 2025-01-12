====
SFTP
====

Nextcloud's SFTP (SSH File Transfer Protocol) backend supports both password and 
public key authentication. 

The **Host** field is required. The default port is 22 (SSH).

For public key authentication, you can generate a public/private key pair from 
your **SFTP with secret key login** configuration.

.. figure:: images/auth_mechanism.png
   :alt: Generating an RSA key pair in the SFTP configuration.

After generating your keys, you need to copy your new public key to the
destination server to ``.ssh/authorized_keys``. Nextcloud will then use its
private key to authenticate to the SFTP server.

The default **Remote Subfolder** is the root directory (``/``) of the remote 
SFTP server, and you may enter any directory you wish.

See :doc:`../external_storage_configuration_gui` for additional mount 
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
