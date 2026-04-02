===============
Apps management
===============

Nextcloud apps can enhance, customize or even restrict the features and experience
you and your users has with the Nextcloud server. Next to default enabled functions
like Files, Activity and Photos there are other apps like Calendar, Contacts,
Talk and more which are enhancing the features of your Nextcloud server.

After installing the Nextcloud server, you might want to consider about enabling,
disabling or even restricting some apps to groups depending on your and your users'
needs.

Apps
----

.. figure:: images/apps_overview.png
   :alt: Apps page for enabling and disabling apps.

During the Nextcloud server installation, some apps are enabled by default.
To see which apps are enabled go to your Apps page.

Those apps are supported and developed by Nextcloud GmbH directly and
have an **Featured**-tag. See :doc:`installation/apps_supported` for a list of supported apps.

.. note:: Your Nextcloud server needs to be able to communicate with 
          ``https://apps.nextcloud.com`` to list and download apps. Please make sure to whitelist this target in your firewall or proxy if necessary.

.. note:: To get access to work-arounds, long-term-support, priority bug fixing
          and custom consulting for supported apps, contact our `sales team <https://nextcloud.com/enterprise/>`_.

.. note:: If you would like to develop your own Nextcloud app, you can find out
          more information in our `developer manual <https://docs.nextcloud.com/server/latest/go.php?to=developer-manual>`_.
.. TODO ON RELEASE: Update version number above on release

All apps must be licensed under AGPLv3+ or any compatible license.

Managing apps
-------------

.. figure:: images/apps_store.png
   :alt: App store page for installing, enabling and disabling apps.

You will see which apps are enabled, disabled and available. You'll also
see additional app bundles and filters, such as Customization, Security and
Monitoring for finding more apps quickly.

In the Apps page you can enable or disable applications. Some apps have
configurable options on the Apps page, such as **Enable only for specific
groups**, but mainly they are enabled or disabled here, and are configured in
your Nextcloud settings (admin and/or user-settings) or in the ``config.php``.

Click the app name to view a description of the app and any of the app settings
in the Application View field. Clicking the **Enable** button will enable the app.
If the app is not part of the Nextcloud installation, it will be downloaded from
the app store, installed and enabled.

App updates will also be offered to you on this page. Simply click on the **Update** 
button to update a specific app or use the **Update all** button on top of the page to 
update all apps.

.. note:: **Beta releases**: You can also install beta releases of apps directly from here by 
          switching your Nextcloud to the beta channel in the admin overview.

Using private API
-----------------

If private API, rather than the public APIs are used in a third-party app, the
installation fails, if ``'appcodechecker' => true,`` is set in ``config.php``.

Using custom app directories
----------------------------

Use the **apps_paths** array in ``config.php`` to set any custom apps directory
locations. The key **path** defines the absolute file system path to the app
folder. The key **url** defines the HTTP web path to that folder, starting at
the Nextcloud web root. The key **writable** indicates if a user can install apps
in that folder.

.. note:: To ensure that the default **/apps/** folder only contains apps
   shipped with Nextcloud, follow this example to setup an **/apps2/** folder
   which will be used to store all other apps.

::

    "apps_paths" => [
        [
                "path"     => OC::$SERVERROOT . "/apps",
                "url"      => "/apps",
                "writable" => false,
        ],
        [
                "path"     => OC::$SERVERROOT . "/apps2",
                "url"      => "/apps2",
                "writable" => true,
        ],
    ],

.. note:: Apps paths can be located outside the server root.  However, for any
   **path** outside the server root, you need to create a symlink in  the server
   root that points **url** to **path**.
   For instance, if **path** is ``/var/local/lib/nextcloud/apps``, and **url**
   is ``/apps2``, then you would do this in the server root:
   ``ln -sf /var/local/lib/nextcloud/apps ./apps2``

Using a self hosted apps store
------------------------------

Enables the installation of apps from a self hosted apps store. Requires that at least one of the configured apps directories is writeable.

To enable a self hosted apps store:

1. Set the **appstoreenabled** parameter to "true".

   This parameter is used to enable the apps store in Nextcloud.

2. Set the **appstoreurl** to the URL of your Nextcloud apps store.

   This parameter is used to set the http path to your self hosted Nextcloud apps store.

::

    "appstoreenabled" => true,
    "appstoreurl" => "https://my.appstore.instance/v1",


By default the apps store is enabled and configured to use ``https://apps.nextcloud.com/api/v1`` as apps store url. Nextcloud will fetch ``apps.json`` and ``categories.json`` from there. To use the defaults again remove **appstoreenabled** and **appstoreurl** from the configuration. 

Example: If ``categories.json`` is available at ``https://apps.nextcloud.com/api/v1/categories.json`` the apps store url is ``https://apps.nextcloud.com/api/v1``.
