===============
Troubleshooting
===============

BlackBerry OS 10.2
------------------

BlackBerry OS up to 10.2.2102 does not accept a URL with protocol ``https://`` 
in front of the server address. It will always tell you that it cannot login on 
your server. So instead of writing::

    https://example.com/remote.php/dav/principals/users/USERNAME/
    
in the server address field, you have to write::

    example.com/remote.php/dav/principals/users/USERNAME/
    