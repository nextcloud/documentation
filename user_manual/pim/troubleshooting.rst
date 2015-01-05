Troubleshooting
===============

Debugging the issue
-------------------

In a standard ownCloud installation the log level is set to "Normal". to find any issues
you need to raise the log level to "All" from the Admin page.
Some logging - for example JavaScript console logging - needs manually editing the
configuration file.
Edit :file:`config/config.php` and add ``define('DEBUG', true);``::

    <?php
    define('DEBUG',true);
    $CONFIG = array (
        ... configuration goes here ...
    );

For JavaScript issues you will also need to view the javascript console. All major browsers
have decent developer tools for viewing the console, and you usually access them by
pressing F-12. For Firefox it is recommended to install the `Firebug extension <https://getfirebug.com/>`_.

Service discovery
-----------------

Some clients - especially iOS - have problems finding the proper sync URL, even when explicitly
configured to use it.

There are several techniques to remedy this, which are described extensively at the
`Sabre DAV website <http://sabre.io/dav/service-discovery/>`_.

Apple iOS
`````````

Below is what have proven to work with iOS including iOS 7.

If your ownCloud instance is installed in a subfolder under the web server's document root and
the client has difficulties finding the Cal- or CardDAV end-points, configure your web server to
redirect from a "well-know" URL to the one used by ownCloud.
When using the Apache web server this is easily achieved using a :file:`.htaccess` file in the document
root of your site.

Say your instance is located in the ``owncloud`` folder, so the URL to it is ``ADDRESS/owncloud``,
create or edit the :file:`.htaccess` file and add the following lines::

    Redirect 301 /.well-known/carddav /owncloud/remote.php/carddav
    Redirect 301 /.well-known/caldav /owncloud/remote.php/caldav

If you use lighttpd as web server, the setting looks something like::

    url.redirect = (
        "^/.well-known/carddav" => "/owncloud/remote.php/carddav",
        "^/.well-known/caldav" => "/owncloud/remote.php/caldav",
    )

Now change the URL in the client settings to just use ``ADDRESS`` instead of e.g. ``ADDRESS/remote.php/carddav/principals/username``.

This problem is being discussed in the `forum <http://forum.owncloud.org/viewtopic.php?f=3&t=71&p=2211#p2197>`_.


BlackBerry OS 10.2
``````````````````

BlackBerry OS up to 10.2.2102 does not accept a URL with protocol ``https://`` in front of the server address.
It will always tell you, that it cannot login on your server. So instead of writing

    https://address/remote.php/carddav/principals/username
    
in the server address field, you have to write

    address/remote.php/carddav/principals/username


Unable to update Contacts or Events
-----------------------------------

If you get an error like ``PATCH https://ADDRESS/some_url HTTP/1.0 501 Not Implemented`` it is
likely caused by one of the following reasons:

Outdated lighttpd web server
  lighttpd in debian wheezy (1.4.31) doesn't support the PATCH HTTP verb.
  Upgrade to lighttpd >= 1.4.33.

Using Pound reverse-proxy/load balancer
  As of writing this Pound doesn't support the HTTP/1.1 verb.
  Pound is easily `patched <http://www.apsis.ch/pound/pound_list/archive/2013/2013-08/1377264673000>`_ to support HTTP/1.1.
