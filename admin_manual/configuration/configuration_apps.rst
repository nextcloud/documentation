Apps Configuration
==================
After you have installed ownCloud, you might realize that it would be nice to
provide an additional function on top of the core functionality in your ownCloud installation.

With ownCloud installation, you will find some apps enabled by default. To see which applications
are enabled, click on Apps button on the web interface navigation to go into applications page:

.. figure:: ../images/oc_admin_app_page.png
Administrator application page

In this page, you can enable or disable applications simply by clicking on their names.
Enabled applications will be shown in **bold** while disabled ones will be shown in normal font.
If the app is not developed by ownCloud, it will have the *3rd party* notice next to it. To see what an
application does, clicking on its name will show a description on the right side of the same page.

To install new apps, you can use *More apps* button or check out the `ownCloud apps store <http://apps.owncloud.com/>`_.
There you will find a lot of ready-to-use apps provided by the ownCloud community.

If you would like to add your own app, please use *Add your App...* button on the same page. This will redirect you to
our `Developer Center <http://owncloud.org/dev>`_.

Parameters
----------
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


Use your own appstore
~~~~~~~~~~~~~~~~~~~~~
If you want to allow the installation of apps from the apps store you have to
set **appstoreenabled** parameter, but this can only be done if at least one
of the configured apps directories is writable.

The **appstoreurl** is used to set the http path to the ownCloud apps store. The appstore server has to use :abbr:`OCS (Open Collaboration Services)`.

.. code-block:: php

  <?php

    "appstoreenabled" => true,
    "appstoreurl" => "http://api.apps.owncloud.com/v1",

Guard against malicious 3rdparty code
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Finally you can enable checks for malicious code fragments of 3rd-party apps
by setting the **appcodechecker** parameter.

.. code-block:: php

  <?php

    "appcodechecker" => false,
