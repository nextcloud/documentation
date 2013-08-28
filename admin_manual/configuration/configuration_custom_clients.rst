Custom Client Configuration
===========================

If you want to access your ownCloud, you can choose between the standard Web-GUI
and different client sync applications. Download links which point to these
applications are shown at the top of the personal menu. The following sync
applications are currently available out of the box:

* Desktop sync clients for Windows, Max and Linux OS
* Mobile sync client for Android devices
* Mobile sync client for iOS devices


Parameters
----------
If you want to customize the download links for the sync clients the following
parameters need to be modified to fulfil your requirements:

.. code-block:: php

  <?php

    "customclient_desktop" => "http://owncloud.org/sync-clients/",
    "customclient_android" => "https://play.google.com/store/apps/details?id=com.owncloud.android",
    "customclient_ios"     => "https://itunes.apple.com/us/app/owncloud/id543672169?mt=8",

This parameters can be set in the :file:`config/config.php`
