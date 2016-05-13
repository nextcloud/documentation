============================
Installing and Managing Apps
============================

After installing ownCloud, you may provide added functionality by installing 
applications.

Supported Apps
--------------

See :doc:`apps_supported` for a list of supported Enterprise edition apps.

Viewing Enabled Apps
--------------------

During the ownCloud installation, some apps are enabled by default. To see which 
apps are enabled go to your Apps page.

.. figure:: ../images/oc_admin_app_page.png
   :alt: Apps page for enabling and disabling apps.

You will see which apps are enabled, not enabled, and recommended. You'll also 
see additional filters, such as Multimedia, Productivity, and Tool for finding 
more apps quickly.

Managing Apps
-------------

In the Apps page you can enable or disable applications. Some apps have  
configurable options on the Apps page, such as **Enable only for specific 
groups**, but mainly they are enabled or disabled here, and are configured on 
your ownCloud Admin page, Personal page, or in ``config.php``.

Adding Third Party Apps
-----------------------

Some apps are developed and supported by ownCloud directly. These have an 
**Official** tag. Apps with the **Approved** tag are community-developed and 
supported; they are maintained by trusted developers, and are under active 
development. Only **Official** and **Approved** apps are linked on the Apps 
page by default.

Click the app name to view a description of the app and any of the app settings in the Application View field.  Clicking the **Enable** button will enable the app.  If the app is not part of the ownCloud installation, it will be downloaded from the app store, installed and enabled. 

Click the gear icon on the lower left to browse experimental apps in the `ownCloud Apps 
Store <https://apps.owncloud.com/>`_. Install experimental apps at your own risk.

Sometimes the installation of a third-party app fails silently, possibly because
``'appcodechecker' => true,`` is enabled in ``config.php``. When ``appcodechecker`` is 
enabled it checks if third-party apps are using the private API, rather than the public 
API. If they are then they will not be installed.

.. note:: If you would like to create or add your own ownCloud app, please 
   refer to the `developer manual
   <https://doc.owncloud.org/server/9.0/developer_manual/app/index.html>`_.

Using Custom App Directories
----------------------------

Use the **apps_paths** array in ``config.php`` to set any custom apps directory 
locations. The key **path** defines the absolute file system path to the app 
folder. The key **url** defines the HTTP web path to that folder, starting at 
the ownCloud web root. The key **writable** indicates if a user can install apps 
in that folder.

.. note:: To ensure that the default **/apps/** folder only contains apps 
   shipped with ownCloud, follow this example to setup an **/apps2/** folder 
   which will be used to store all other apps.

::

  <?php

    "apps_paths" => array (
        0 => array (
                "path"     => OC::$SERVERROOT."/apps",
                "url"      => "/apps",
                "writable" => false,
        ),
        1 => array (
                "path"     => OC::$SERVERROOT."/apps2",
                "url"      => "/apps2",
                "writable" => true,
        ),
    ),

Using Your Own Appstore
-----------------------

You can enable the installation of apps from your own apps store. This requires that you 
can write to at least one of the configured apps directories.

To enable installation from your own apps store:

1. Set the **appstoreenabled** parameter to "true".

   This parameter is used to enable your apps store in ownCloud.

2. Set the **appstoreurl** to the URL of your ownCloud apps store.

   This parameter is used to set the http path to the ownCloud apps store. The appstore 
   server must use :abbr:`OCS (Open Collaboration Services)`.

::

  <?php

    "appstoreenabled" => true,
    "appstoreurl" => "https://api.owncloud.com/v1",
