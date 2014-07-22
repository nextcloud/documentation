Custom Client Configuration
===========================

If you want to access your ownCloud, you can choose between the standard Web-GUI
and various client synchronization applications.

.. note:: Download links that point to these applications are shown at the top of the Personal Settings Menu.

The following sync applications are currently available by default:

* Desktop sync clients for Windows, MAC and Linux OS
* Mobile sync client for Android devices
* Mobile sync client for iOS devices


Parameters
----------
You can customize the download links to meet your specific requirements for any of the synchronization clients in the :file:`config/config.php` file:

.. code-block:: php

  <?php

    "customclient_desktop" => "http://owncloud.org/sync-clients/",
    "customclient_android" => "https://play.google.com/store/apps/details?id=com.owncloud.android",
    "customclient_ios"     => "https://itunes.apple.com/us/app/owncloud/id543672169?mt=8",

