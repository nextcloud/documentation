Troubleshooting
===============

Service discovery
-----------------

Some clients - especially iOS - have problems finding the proper sync URL, even when explicitly
configured to use it.

There are several techniques to remedy this, which are described extensively at the
`Sabre DAV website <http://sabre.io/dav/service-discovery/>`_.

Below is what have proven to work with iOS including iOS 7.

If your ownCloud instance is installed in a sub-folder under the web servers document root, and
the client has difficulties finding the Cal- or CardDAV end-points, configure your web server to
redirect from a "well-know" URL to the one used by ownCloud.
When using the Apache web server this is easily achieved using a :file:`.htaccess` file in the document
root of your site.

Say your instance is located in the ``owncloud`` folder, so the URL to it is ``ADDRESS/owncloud``,
create or edit the :file:`.htaccess` file and add the following lines::

    Redirect 301 /.well-known/carddav /owncloud/remote.php/carddav
    Redirect 301 /.well-known/caldav /owncloud/remote.php/caldav

If you use Nginx as web server, the setting looks something like::

    url.redirect = (
        "^/.well-known/carddav" => "/owncloud/remote.php/carddav",
        "^/.well-known/caldav" => "/owncloud/remote.php/caldav",
    )

Now change the URL in the client settings to just use ``ADDRESS`` instead of e.g. ``ADDRESS/remote.php/carddav/principals/username``.

This problem is being discussed in the `forum <http://forum.owncloud.org/viewtopic.php?f=3&t=71&p=2211#p2197>`_.
