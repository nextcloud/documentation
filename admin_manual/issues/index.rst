==========================
Issues and Troubleshooting
==========================

If you have trouble installing, configuring or maintaining ownCloud, please refer to our community support channels:

* `The ownCloud Forums`_

.. note:: The ownCloud forums have a `FAQ page`_ where each topic corresponds to 
   typical mistakes or frequently occurring issues

* `The ownCloud User mailing list`_
*  The ownCloud IRC chat channel ``irc://#owncloud@freenode.net`` on freenode.net, also 
   accessible via `webchat`_

Please understand that all these channels essentially consist of users like you helping each other out. Consider helping others out where you can, to contribute back for the help you get. This is the only way to keep a community like ownCloud healthy and sustainable!

If you are using ownCloud in a business or otherwise large scale deployment, note that ownCloud Inc. offers the `Enterprise Edition`_ with commercial support options.

Bugs
----

If you think you have found a bug in ownCloud, please:

* Search for a solution (see the options above)
* Double check your configuration

If you can't find a solution, please use our `bugtracker`_.


.. _the ownCloud Forums: http://forum.owncloud.org
.. _FAQ page: https://forum.owncloud.org/viewforum.php?f=17
.. _the ownCloud User mailing list: https://mailman.owncloud.org/mailman/listinfo/user
.. _webchat: http://webchat.freenode.net/?channels=owncloud
.. _Enterprise Edition: https://owncloud.com/lp/community-or-enterprise/
.. _bugtracker: http://doc.owncloud.org/server/8.0/developer_manual/bugtracker/index.html
.. TODO ON RELEASE: Update version number above on release

General Troubleshooting
-----------------------

ownCloud Logfiles
~~~~~~~~~~~~~~~~~

In a standard ownCloud installation the log level is set to ``Normal``. To find 
any issues you need to raise the log level to ``All`` from the Admin page. 
Please see :doc:`../configuration_server/logging_configuration` for more 
informations on this log levels.

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

.. note:: The logfile of ownCloud is located in the datadirectory 
   ``/var/www/owncloud/data/owncloud.log``.

phpinfo
~~~~~~~

You will need to know your PHP version and configurations. To do this, create a 
plain-text file named **phpinfo.php** and place it in your Web root, for 
example ``/var/www/html/phpinfo.php``. (Your Web root may be in a different 
location; your Linux distribution documentation will tell you where.) This file 
contains just this line::

 <?php phpinfo(); ?>

Open this file in a Web browser. Your PHP version is at the top, and the rest of 
the page contains abundant system information such as active modules, active 
`.ini` files, and much more. When you are finished reviewing your information 
you must delete ``phpinfo.php``, or move it outside of your Web directory, 
because it is a security risk to expose such sensitive data.

Debugging Sync-Issues
~~~~~~~~~~~~~~~~~~~~~

.. note:: The data directory on the server is exclusive to ownCloud and must not be modified manually.

Disregarding this can lead to unwanted behaviours like:

* Problems with sync clients
* Undetected changes due to caching in the database

If you need to directly upload files from the same server please use a WebDAV command
line client like ``cadaver`` to upload files to the WebDAV interface at:

  https://example.org/owncloud/remote.php/webdav

Common problems / error messages
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Some common problems / error messages found in your logfiles as described above:

* ``SQLSTATE[HY000] [1040] Too many connections`` -> You need to increase the
  connection limit of your database, please refer to the manual of your database
  for more informations.
* ``SQLSTATE[HY000]: General error: 5 database is locked`` -> You're using ``SQLite``
  which can't handle a lot of parallel requests. Please consider converting to
  another database like described in :doc:`../configuration_database/db_conversion`.
* ``SQLSTATE[HY000]: General error: 2006 MySQL server has gone away`` -> The database
  request takes too long and therefore the MySQL server times out. Its also possible
  that the server is dropping a too large packet. Please refer to the manual of your
  database how to raise the config options ``wait_timeout`` and/or ``max_allowed_packet``.
* ``SQLSTATE[HY000] [2002] No such file or directory`` -> There is a problem
  accessing your SQLite database file in your datadirectory (``data/owncloud.db``).
  Please check the permissions of this folder/file or if it exists at all. If you're
  using MySQL please start your database.

Troubleshooting Webserver and PHP problems
------------------------------------------

Logfiles
~~~~~~~~

When having issues the first step is to check the logfiles provided by PHP, the Webserver
and ownCloud itself.

.. note:: In the following the paths to the logfiles of a default Debian installation
   running Apache2 with mod_php is assumed. On other webservers, linux distros or
   operating systems they can differ.

* The logfile of Apache2 is located in ``/var/log/apache2/error.log``.
* The logfile of PHP can be configured in your ``/etc/php5/apache2/php.ini``. 
  You need to set the directive ``log_errors`` to ``On`` and choose the path
  to store the logfile in the ``error_log`` directive. After those changes you
  need to restart your Webserver.
* The logfile of ownCloud is located in the datadirectory ``/var/www/owncloud/data/owncloud.log``.

Webserver and PHP modules
~~~~~~~~~~~~~~~~~~~~~~~~~

There are some Webserver or PHP modules which are known to cause various problems
like broken up-/downloads. The following shows a draft overview over this modules:

1. Apache

* mod_pagespeed
* mod_evasive
* mod_security
* mod_reqtimeout
* mod_deflate
* libapache2-mod-php5filter (use libapache2-mod-php5 instead)
* mod_spdy together with libapache2-mod-php5 / mod_php (use fcgi or php-fpm instead)
* mod_dav
* mod_xsendfile / X-Sendfile (causing broken downloads if not configured correctly)

2. NginX

* ngx_pagespeed
* HttpDavModule
* X-Sendfile (causing broken downloads if not configured correctly)

3. Mac OS X server

* mod_auth_apple
* com.apple.webapp.webdavsharing

4. LigHTTPd

* ModWebDAV
* X-Sendfile2 (causing broken downloads if not configured correctly)

5. PHP

* eAccelerator

Troubleshooting WebDAV
----------------------

ownCloud uses SabreDAV, and the SabreDAV documentation is comprehensive and 
helpful. See:

* `SabreDAV FAQ <http://sabre.io/dav/faq/>`_
* `Webservers <http://sabre.io/dav/webservers>`_ (Lists lighttpd as not 
  recommended)
* `Working with large files <http://sabre.io/dav/large-files/>`_ (Shows a PHP 
  bug in older SabreDAV versions and information for mod_security problems)
* `0 byte files <http://sabre.io/dav/0bytes>`_ (Reasons for empty files on the 
  server)
* `Clients <http://sabre.io/dav/clients/>`_ (A comprehensive list of WebDAV 
  clients, and possible problems with each one)
* `Finder, OS X's built-in WebDAV client 
  <http://sabre.io/dav/clients/finder/>`_ 
  (Describes problems with Finder on various webservers)

There is also a well maintained FAQ thread available at the `ownCloud Forums <https://forum.owncloud.org/viewtopic.php?f=17&t=7536>`_
which contains various additional informations about WebDAV problems.

Troubleshooting Contacts & Calendar
-----------------------------------

Service discovery
~~~~~~~~~~~~~~~~~

Some clients - especially iOS - have problems finding the proper sync URL, even when explicitly
configured to use it.

There are several techniques to remedy this, which are described extensively at the
`Sabre DAV website <http://sabre.io/dav/service-discovery/>`_.

Apple iOS
~~~~~~~~~

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

Unable to update Contacts or Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you get an error like ``PATCH https://ADDRESS/some_url HTTP/1.0 501 Not Implemented`` it is
likely caused by one of the following reasons:

Outdated lighttpd web server
  lighttpd in debian wheezy (1.4.31) doesn't support the PATCH HTTP verb.
  Upgrade to lighttpd >= 1.4.33.

Using Pound reverse-proxy/load balancer
  As of writing this Pound doesn't support the HTTP/1.1 verb.
  Pound is easily `patched <http://www.apsis.ch/pound/pound_list/archive/2013/2013-08/1377264673000>`_ to support HTTP/1.1.
