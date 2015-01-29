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

General Troubleshooting
-----------------------

.. note:: The data directory on the server is exclusive to ownCloud and must not be modified manually.

Disregarding this can lead to unwanted behaviours like:

* Problems with sync clients
* Undetected changes due to caching in the database

If you need to directly upload files from the same server please use a WebDAV command
line client like `cadaver` to upload files to the WebDAV interface at:

  https://example.org/owncloud/remote.php/webdav
