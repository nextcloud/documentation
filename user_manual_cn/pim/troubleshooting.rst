========
故障排查
========

黑莓BlackBerry OS 10.2
------------------

BlackBerry OS up to 10.2.2102 does not accept a URL with protocol ``https://`` 
in front of the server address. It will always tell you that it cannot login on 
your server. So instead of writing::
最高到BlackBerry OS 10.2.2102的版本不会在服务器地址前面接受协议 ``https://的URL`` 。它总是会告诉你，它无法在您的服务器上登录。因此服务器区域不是写为::

    https://example.com/remote.php/dav/principals/users/USERNAME/
    
而是写为::

    example.com/remote.php/dav/principals/users/USERNAME/
    
