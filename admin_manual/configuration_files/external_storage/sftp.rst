====
SFTP
====

This backend can be used to connect to an SFTP server.

A ``Host`` is required; a port can be specified as part of the ``Host`` field
in the following format: ``hostname.domain:port``. The default port is 22 (SSH).

SFTP supports the password authentication mechanism. See
:doc:`auth_mechanisms` for detailed information.

SFTP also supports public key authentication. A public/private keypair can be
generated on the ownCloud server, then you need to put the public key on the
destination server in ``.ssh/authorized_keys``. ownCloud will then use the
private key to connect to the SFTP server.

A ``Root`` can be specified to change the directory used. The default is the
root directory (``/``).
