===================================
Custom Client Download Repositories
===================================

You may set up your own local download repositories for your ownCloud desktop 
clients and mobile apps in :file:`config/config.php`. This example shows 
the default download locations:

.. code-block:: php

  <?php

    "customclient_desktop" => "http://owncloud.org/sync-clients/",
    "customclient_android" => "https://play.google.com/store/apps/details?id=com.owncloud.android",
    "customclient_ios"     => "https://itunes.apple.com/us/app/owncloud/id543672169?mt=8",

Simply replace the URLs with the links to your own preferred download repos.