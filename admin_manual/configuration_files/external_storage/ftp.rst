===
FTP
===

To connect to an FTP server, you will need:

- The hostname of the FTP server
- Port (default: 21)

FTP uses the password authentication scheme, see :doc:`auth_mechanisms`

Optionally, ownCloud can use FTPS by selecting ``Secure ftps://``. This
requires additional configuration with root certificates if the FTP server uses
a self-signed certificate.

A specific directory can be configured with ``Remote Subfolder``.

.. note:: The external storage ``FTP/FTPS`` needs the ``allow_url_fopen`` PHP
   setting to be set to ``1``. When having connection problems make sure that it is
   not set to ``0`` in your ``php.ini``.

.. figure:: images/ftp.png

