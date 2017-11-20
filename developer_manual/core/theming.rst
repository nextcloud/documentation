=================
Theming Nextcloud
=================
Themes can be used to customize the look and feel of Nextcloud.

.. note:: This is an advanced way of theming Nextcloud; the Nextcloud team recommends instead the use of the :doc:`configuration_server/theming` app which, when enabled, can be accessed from the Admin settings.

Getting started
---------------

A good idea to get started with a dynamically created website is to inspect it with **web developer tools**, that are found in almost any browser. They show the generated HTML and the CSS Code that the client/browser is receiving:
With this facts you can easily determine where the following object-related attributes for the phenomenons are settled:

* place
* colour
* links
* graphics

The next thing you should do, before starting any changes, is to make a backup of your current theme(s), e.g.:

* cd …/nextcloud/themes
* cp -r example mytheme


Creating and activating a new theme
-----------------------------------

There are two basic ways of creating new themings:

* doing all new from scratch
* starting from an existing theme or the example theme and doing everything step by step and more experimentally

Depending on how you created your new theme it will be necessary to:

* put a new theme into the /themes folder. The theme can be activated by putting ``'theme' => 'MyTheme'`` into the ``/config/config.php`` file.
* make your changes in the ``/themes/MyTheme`` folder
* make sure that the theming app is disabled


Structure
---------

The folder structure of a theme is exactly the same as the main Nextcloud
structure. You can override js files, images, translations and templates with
own versions. CSS files are loaded additionally to the default files so you can
override CSS properties. CSS files and the standard pictures that are used reside
for example in /nextcloud/core/ and /nextcloud/settings/ in these sub folders:

* css = style sheets
* js = JavaScripts
* img = images
* l10n = translation files
* templates = PHP and HTML template files

.. _notes-for-updates:


Notes for updates
-----------------

.. note:: With Nextcloud 12, CSS files have been merged into one server.css so in order to keep your theme working you should consolidate your existing css styles into a server.css file. As for the example theme the styles.css file has been renamed to server.css.

It is not recommended to the user to perform adaptations inside the
folder ``/themes/example`` because files inside this folder might get
replaced during the next Nextcloud update process.

During an update, files might get changed within the core and settings
folders. This could result in problems because your template files will
not 'know' about these changes and therefore must be manually merged with
the updated core file or simply be deleted (or renamed for a test).

For example if ``/settings/templates/apps.php`` gets updated by a new
Nextcloud version, and you have a ``/themes/MyTheme/settings/templates/apps.php``
in your template, you must merge the changes that where made within the update
with the ones you did in your template.

But this is unlikely and will be mentioned in the Nextcloud release notes if it occurs.


How to change images and the logo
---------------------------------

A new logo which you may want to insert can be added as follows:

Figure out the path of the old logo
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Replace the old picture, which position you found out as described under 1.3. by adding an extension in case you want to re-use it later.

Creating an own logo
^^^^^^^^^^^^^^^^^^^^

If you want to do a quick exchange like (1) it's important to know the size of the picture before you start creating an own logo:

* Go to the place in the filesystem, that has been shown by the web developer tool/s
* You can look up sizing in most cases via the file properties inside your file-manager
* Create an own picture/logo with the same size as the original photo

The (main) pictures that can be found inside Nextcloud standard theming are the following:

* The logo at the login-page above the credentials-box and in the header: 	        …/nextcloud/themes/default/core/img/logo.svg

Inserting your new logo
^^^^^^^^^^^^^^^^^^^^^^^

Inserting a new logo into an existing theme is as simple as replacing the old logo with the new (generated) one.
You can use: scalable vector graphics (.svg) or common graphics formats for the Internet such as portable network graphics (.png) or .jpeg.
Just insert the new created picture by using the unchanged name of the old picture.

The app icons can also be overwritten in a theme. To change for example the app icon of the activity app you need to overwrite it by saving the new image to …/nextcloud/themes/default/apps/activity/img/activity.svg.

Changing favicon
^^^^^^^^^^^^^^^^

For compatibility with older browsers, favicon (the image that appears in your browser tab) uses .../nextcloud/core/img/favicon.ico.

To customize favicon for MyTheme:

* Create a version of your logo in .ico format
* Store your custom favicon as .../nextcloud/themes/MyTheme/core/img/favicon.ico
* Include .../nextcloud/themes/MyTheme/core/img/favicon.svg and favicon.png to cover any future updates to favicon handling.

Changing the default colours
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can inject custom variables into the SCSS generator to apply colors to the default css code by adding the following method to defaults.php:

.. code-block:: php

    public function getScssVariables() {
        return [
            'color-primary' => '#745bca'
        ];
    }


The following variables can be overwritten:

* color-main-text
* color-main-background
* color-primary
* color-primary-text
* color-error
* color-warning
* color-success
* color-loading
* color-loading-dark
* color-box-shadow

With a web-developer tool like Mozilla-Inspector, you also get easily displayed the color of the background you clicked on.
On the top of the login page you can see a case- distinguished setting for different browsers:

.. code-block:: css

  /* HEADERS */
  ...
  body-login {
    background: #1d2d42; /* Old browsers */
    background: -moz-linear-gradient(top, #33537a 0%, #1d2d42  100%); /* FF3.6+ */
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#F1B3A4), color-stop(100%,#1d2d42)); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* Opera11.10+ */
    background: -ms-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* IE10+ */
    background: linear-gradient(top, #33537a 0%,#1d2d42 100%); /* W3C */
  }

The different background-assignments indicate the headers for a lot of different browser types. What you most likely want to do is change the #35537a (lighter blue) and #ld2d42 (dark blue) color to the colours of our choice. In some older and other browsers there is just one color, but in the rest showing gradients is possible.
The login page background is a horizontal gradient. The first hex number, #35537a, is the top color of the gradient at the login screen. The second hex number, #ld2d42, is the bottom color of the gradient at the login screen.
The gradient in top of the normal view after login is also defined by these CSS-settings, so that they take effect in logged in situation as well.
Change these colors to the hex color of your choice.
As usual:

* the first two figures give the intensity of the red channel,
* the second two give the green intensity and the
* third pair gives the blue value.

Save your CSS-file and refresh to see the new login screen.
The other major color scheme is the blue header bar on the main navigation page once you log in to Nextcloud.
This color we will change with the above as well.
Save the file and refresh the browser for the changes to take effect.


How to change translations
--------------------------

.. versionadded 8.0

You can override the translation of single strings within your theme. Simply
create the same folder structure within your theme folder for the language file
you want to override. Only the changed strings need to be added to that file; for
all other terms the shipped translation will be used.

If you want to override the translation of the term "Download" within the
``files`` app for the language ``de`` you need to create the file
``themes/THEME_NAME/apps/files/l10n/de.js`` and put the following code in:

.. code-block:: js

  OC.L10N.register(
    "files",
    {
      "Download" : "Herunterladen"
    },
    "nplurals=2; plural=(n != 1);"
  );

Additionally you need to create another file
``themes/THEME_NAME/apps/files/l10n/de.json`` with the same translations that
look like this:

.. code-block:: json

  {
    "translations": {
      "Download" : "Herunterladen"
    },
    "pluralForm" :"nplurals=2; plural=(n != 1);"
  }

Both files (``.js`` and ``.json``) are needed with the same translations,
because the first is needed to enable translations in the JavaScript code and
the second one is read by the PHP code and provides the data for translated
terms in there.

How to update custom mimetype icons
-----------------------------------

The following command is required to run after adding custom mimetype icons to your theme:

.. code-block:: bash

    sudo -u www-data php occ maintenance:mimetype:update-js


How to change names, slogans and URLs
-------------------------------------

The Nextcloud theming allows a lot of the names that are shown on the web interface to be changed. It's also possible to change the URLs to the documentation or the Android/iOS apps.

This can be done with a file named ``defaults.php`` within the root of the theme. You can find it in the example theme (*/themes/example/defaults.php*). In there you need to specify a class named ``OC_Theme`` and need to implement the methods you want to overwrite:

.. code-block:: php

  class OC_Theme {
    public function getAndroidClientUrl() {
      return 'https://play.google.com/store/apps/details?id=com.nextcloud.client';
    }

    public function getName() {
      return 'Nextcloud';
    }
  }

Each method should return a string. Following methods are available:

* ``getAndroidClientUrl``
* ``getBaseUrl``
* ``getDocBaseUrl``
* ``getEntity``
* ``getName``
* ``getHTMLName``
* ``getiOSClientUrl``
* ``getiTunesAppId``
* ``getLogoClaim``
* ``getLongFooter``
* ``getMailHeaderColor``
* ``getSyncClientUrl``
* ``getTitle``
* ``getShortFooter``
* ``getSlogan``

.. note:: Only these methods are available in the templates, because we internally wrap around hardcoded method names.

One exception is the method ``buildDocLinkToKey`` which gets passed in a key as first parameter. For core we do something like this to build the documentation link:

.. code-block:: php

  public function buildDocLinkToKey($key) {
    return $this->getDocBaseUrl() . '/server/9.0/go.php?to=' . $key;
  }


Testing the new theme out
-------------------------

There are different options for doing so:

* If you're using a tool like the Inspector tools inside Mozilla, you can test out the CSS-Styles immediately inside the css-attributes, while looking at them.
* If you have a developing/testing server as described in 1. you can test out the effects in a real environment permanently.
