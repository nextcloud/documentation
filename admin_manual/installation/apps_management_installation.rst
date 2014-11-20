Apps Configuration
==================
After installing ownCloud, you might want to provide added functionality on top of the core functionality that is installed by default.  ownCloud enables you to enhance your experience and your user's experiences by installing various *apps*.

Viewing Enabled Apps
--------------------

During the ownCloud installation, some apps are enabled by default. To see which apps are enabled:

1. Click ``Apps`` in the Apps Selection Menu.

   The apps available for use with ownCloud appear in the Apps Information Field.

   .. figure:: ../images/oc_admin_app_page.png

     **Administrator application page**

2. Scroll down the Apps Information Field to view the enabled apps.

   Apps that are enabled appear at he top of the list of apps.

Managing Apps
-------------

In the Apps page, you can enable or disable applications, as well as modify any app settings, by clicking the app name.  If an app is already enabled, it appears highlighted in the list.  In addition, enabled apps appear at the top of the app list in the Apps Information Field.  In contrast, disabled apps appear below any enabled apps in the list and are not highlighted.

To modify an app:

1. Click the app that you want to modify.

   The app is highlighted and any available settings for the app appear in the Application View window.

2. Make any desired changes to the app.

   All app changes are applied dynamically as soon as you select the change.  As there are many apps available for use with ownCloud, we do not list all apps or apps settings that are available to you.  However, we have documented several standard apps (for example, the Contacts and Calendar apps) that are directly supported.

Adding Third Party Apps
-----------------------

As mentioned earlier, ownCloud supports a number of different apps.  Some apps are developed and supported by ownCloud directly, while other apps are created by third parties and either included in or available for your ownCloud server installation.  Any apps that are not developed by ownCloud show a *3rd party* designation.

To understand what an application does, you can click the app name to view a description of the app and any of the app settings in the Application View field.  Clicking the *Enable* button will enable the app.  If the app is a third party app, it will be downloaded from the app store, installed and enabled.  The App page does not show third party applications which have not been reviewed by the ownCloud security team. Find more information on security `in this article <https://owncloud.org/blog/how-owncloud-uses-encryption-to-protect-your-data/>`_.

Though ownCloud provides many apps in the server installation, you can view many more apps at the `ownCloud apps store <http://apps.owncloud.com/>`_.

To view or install apps from the ownCloud apps store:

1. Scroll to the bottom of the Apps Information Field.

2. Click *More apps*.

   The ownCloud apps store launches.

3. Read about any of the apps in the ownCloud app store and download any that you like.

4. Extract a downloaded compressed file and place the contents (which should themselves be contained in a folder with the app name) in the apps folder in your ownCloud installation.

5. Ensure the permissions and ownership are similar to the other ownCloud apps. Typically, access rights are **rwxr-x---** or **750** in octal notation and owner is for example **wwwrun**.

.. note:: If you would like to create or add your own ownCloud app, please use the *Add your App...* button on the same page. This button redirects you to our `Developer Center <http://owncloud.org/dev>`_ where you can find information about creating and adding your own apps.

Setting App Parameters
----------------------
Parameters are set in the :file:`config/config.php` inside the **$CONFIG** array.

Use custom app directories
~~~~~~~~~~~~~~~~~~~~~~~~~~
Use the **apps_paths** array to set the apps folders which should be scanned
for available apps and/or where user specific apps should be installed.The key
**path** defines the absolute file system path to the app folder. The key
**url** defines the http web path to that folder, starting at the ownCloud
web root. The key **writable** indicates if a user can install apps in that
folder.

.. note:: If you want to make sure that the default **/apps/** folder only contains apps shipped with ownCloud, you
 should follow the example and set-up a **/apps2/** folder which will be used to store all apps downloaded by users

.. code-block:: php

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
~~~~~~~~~~~~~~~~~~~~~~~
You can enable the installation of apps from your own apps store.  However, this requires that you can write to at least one of the configured apps directories.

To enable installation from your own apps store:

1. Set the **appstoreenabled** parameter to "true".

   This parameter is used to enable your apps store in ownCloud.

2. Set the **appstoreurl** to the URL of your ownCloud apps store.

   This parameter is used to set the http path to the ownCloud apps store. The appstore server must use :abbr:`OCS (Open Collaboration Services)`.

.. code-block:: php

  <?php

    "appstoreenabled" => true,
    "appstoreurl" => "http://api.apps.owncloud.com/v1",
    
