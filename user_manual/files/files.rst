Accessing your Files
====================

Desktop (PC)
------------
Your ownCloud instance can be accessed on every platform via the web interface. There are also options to integrate it with your desktop.



Linux
~~~~~
The URL that you have to use to connect to the owncloud installation in nautilus is::

  dav://youraddress.com/files/webdav.php

.. image:: ../images/gnome3_nautilus_webdav.png

MacOS
~~~~~
The URL that you have to use to connect to the owncloud installation in finder is::

  http://youraddress.com/files/webdav.php

Windows
~~~~~~~
For Windows a seperate webdav client is recommended to access the files from your server. Choose one from the `WebDav Project page <http://www.webdav.org/projects/>`_


However, some applications only allow you to save to a local folder. To
get around this issue, you can:

+ `Sync your ownCloud folders and local folders`_

+ `Mount ownCloud to a local folder without sync`_

The Desktop Syncing Client called Mirall is now released for Linux and
Windows. You can follow the current changes at the `ownCloud Mirall
repository`_. We work on porting this to Mac OS and packaging for all
major linux distributions.

Mobile
-------

There are apps in development for both `Android`_ and `webOS`_. Feel
free to `contribute, if you can`_! Right now you can use other apps to
connect to ownCloud from your phone via WebDAV. `WebDAV Navigator`_ is a
good (proprietary) app for `Android App`_ , `iPhone`_ & `BlackBerry`_.



.. _in your file manager: http://en.wikipedia.org/wiki/Webdav#WebDAV_client_applications
.. _Sync your ownCloud folders and local folders: http://owncloud.org/documentation/sync-clients/
.. _Mount ownCloud to a local folder without sync: http://owncloud.org/use/webdav/
.. _ownCloud Mirall repository: https://gitorious.org/owncloud/mirall
.. _Android: http://gitorious.org/owncloud/android
.. _webOS: http://gitorious.org/owncloud/webos
.. _contribute, if you can: /contribute/
.. _WebDAV Navigator: http://seanashton.net/webdav/
.. _Android App: http://market.android.com/details?id=com.schimera.webdavnavlite
.. _iPhone: http://itunes.apple.com/app/webdav-navigator/id382551345
.. _BlackBerry: http://appworld.blackberry.com/webstore/content/46279
