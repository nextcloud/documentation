===
FTP
===

Connecting to an FTP server requires:

* Whatever name you want for your local mountpoint.
* The URL of your FTP server, and optionally the port number.
* FTP server username and password.
* Remote Subfolder, the FTP directory to mount in ownCloud. ownCloud defaults to the root 
  directory. When you specify a different directory you must leave off the 
  leading slash. For example, if you want to connect your 
  ``public_html/images`` directory, then type it exactly like that. 
* Choose whether to connect in the clear with ``ftp://``, or to encrypt your 
  FTP session with SSL/TLS over ``ftps://`` (Your FTP server must be 
  configured to support ``ftps://``)
* Enter the ownCloud users or groups who are allowed to access the share.  

.. note:: The external storage ``FTP/FTPS`` needs the ``allow_url_fopen`` PHP
   setting to be set to ``1``. When having connection problems make sure that it is
   not set to ``0`` in your ``php.ini``.

.. figure:: images/ftp.png

