===================================
Custom Client Download Repositories
===================================

You may configure the URLs to your own download repositories for your Nextcloud 
desktop clients and mobile apps in :file:`config/config.php`. This example shows 
the default download locations:

::

  <?php

    "customclient_desktop" => "https://nextcloud.com/install/",
    "customclient_android" => "https://play.google.com/store/apps/details?id=com.nextcloud.client",
    "customclient_ios"     => "https://itunes.apple.com/us/app/nextcloud/id1125420102?mt=8",

Simply replace the URLs with the links to your own preferred download repos.

You may test alternate URLs without editing :file:`config/config.php` by setting a test URL as an environment variable::

 export OCC_UPDATE_URL=https://test.example.com
  
When you're finished testing you can disable the environment variable::

 unset OCC_UPDATE_URL
 
 