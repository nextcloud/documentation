Apps Configuration
==================
After you have installed ownCloud you might realize that it would be nice to
provide an additional function on top of the core functionality in your ownCloud installation.

The first step should be to check out the `ownCloud apps store <http://apps.owncloud.com/>`_. There you will find a lot of ready-to-use apps provided by the ownCloud community.

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

.. note:: If you want to make sure that the default **/apps/** folder only contains apps shipped with ownCloud, you should follow the example and set-up a **/apps2/** folder which will be used to store all apps downloaded by users

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
of the configured apps directories is writeable. 

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