Theming ownCloud
================

Themes can be used to customize the look and feel of ownCloud.
Themes can relate to the following topics of owncloud:

* Theming the web-frontend
* Theming the owncloud Desktop client

This documentation contains only the Web-frontend adaptations so far.

Getting started
---------------
A good idea getting starting with a dynamically created website is to inspect it with **web developer tools**, that are found in almost any browser. They show the generated HTML and the CSS Code, that the client/browser is receiving:
With this facts you can easily determine, where the following object-related attributes for the phenomenons are settled:

* place
* colour
* links
* graphics

In owncloud standard theme everything is held very simple. This allows you quick adapting. In an unchanged ownCloud version CSS files and the standard pictures reside in /owncloud/themes/default folder.
The next thing you should do, before starting any changes is:
Make a backup of your current theme(s) e.g.:

* Goto …/owncloud/themes
* cp -r default default.old

Creating and activating a new theme
===================================

There are two basic ways of creating new themings:

* Doing all new from scratch
* Starting from an existing theme and doing everything step by step and more experimentally

Depending on how you created your new theme it will be necessary to

* put a new theme into the /themes -folder. The theme can be activated by putting "theme" => ‘themename’, into the config.php file.
* make all changes in the /themes/default -file

Structure
=========

The folder structure of a theme is exactly the same as the main ownCloud
structure. You can override js files, images, translations and templates with
own versions. CSS files are loaded additionally to the default files so you can
override CSS properties.


How to change images and the logo
=================================

A new logo which you may want to insert can be added as follows:

Figure out the path of the old logo
-----------------------------------

Replace the old picture, which position you found out as described under 1.3. by adding an extension in case you want to re-use it later.

Creating an own logo
--------------------

If you want to do a quick exchange like (1) it's important to know the size of the picture before you start creating an own logo:

* Go to the place in the filesystem, that has been shown by the web developer tool/s
* You can look up sizing in most cases via the file properties inside your file-manager
* Create an own picture/logo with the same size then

The (main) pictures, that can be found inside ownCloud standard theming are the following:

* The logo at the login-page above the credentials-box: 	        …/owncloud/themes/default/core/img/logo.svg
* The logo, that's always in the left upper corner after login:   …/owncloud/themes/default/core/img/logo-wide.svg

Inserting your new logo
-----------------------
Inserting a new logo into an existing theme is as simple as replacing the old logo with the new (generated) one.
You can use: scalable vector graphics (.svg) or common graphics formats for the internet such as portable network graphics (.png) or .jepg
Just insert the new created picture by using the unchanged name of the old picture.

changing the default colours
----------------------------

With a web-developer tool like Mozilla-Inspector, you also get easily displayed the color of the background you clicked on.
On the top of the login page you can see a case- distinguished setting for different browsers:

.. code-block:: css

  /* HEADERS */
  ...
  background: #1d2d42; /* Old browsers */
  background: -moz-linear-gradient(top, #33537a 0%, #1d2d42  100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#F1B3A4), color-stop(100%,#1d2d42)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* Opera11.10+ */
  background: -ms-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* IE10+ */
  background: linear-gradient(top, #33537a 0%,#1d2d42 100%); /* W3C */


The different background-assignments indicate the headers for a lot of different browser types. What you most likely want to do is change the #35537a (lighter blue) and #ld2d42 (dark blue) color to the colours of our choice. In some older and other browsers, there is just one color, but in the rest showing gradients is possible.
The login page background is a horizontal gradient. The first hex number, #35537a, is the top color of the gradient at the login screen. The second hex number, #ld2d42 is the bottom color of the gradient at the login screen.
The gradient in top of the normal view after login is also defined by these CSS-settings, so that they take effect in logged in situation as well.
Change these colors to the hex color of your choice:
As usual:

* the first two figures give the intensity of the red channel,
* the second two give the green intensity and the
* third pair gives the blue value.

Save your CSS-file and refresh to see the new login screen.
The other major color scheme is the blue header bar on the main navigation page once you log in to ownCloud.
This color we will change with the above as well.
Save the file and refresh the browser for the changes to take effect.

How to change translations
==========================

.. versionadded 8.0

You can override the translation of single strings within your theme. Simply
create the same folder structure within your theme folder for the language file
you want to override. Only the changed strings need to be added to that file for
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

How to change names, slogans and URLs
=====================================

The ownCloud theming allows a lot of the names that are shown on the web interface to be changed. It's also possible to change the URLs to the documentation or the Android/iOS apps.

This can be done with a file named ``defaults.php`` within the root of the theme. In there you need to specify a class named ``OC_Theme`` and need to implement the methods you want to overwrite:

.. code-block:: php

  class OC_Theme {
    public function getAndroidClientUrl() {
      return 'https://play.google.com/store/apps/details?id=com.owncloud.android';
    }

    public function getName() {
      return 'ownCloud';
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
    return $this->getDocBaseUrl() . '/server/8.2/go.php?to=' . $key;
  }

Testing the new theme out
=========================

There are different options for doing so:

* If you're using a tool like the Inspector tools inside Mozilla, you can test out the CSS-Styles immediately inside the css-attributes, while looking at them.
* If you have a developing/testing server as described in 1. you can test out the effects in a real environment permanently.


.. _GitHub themes repository: https://github.com/owncloud/themes
.. _here: https://github.com/owncloud/themes/tree/master/example

Notes for Updates
=================

In case of theming it is recommended to the user,
not to perform these adaptations inside the folder /themes/default.

Please perform the following steps, to avoid conflicts with other upcoming updates:

* create a new folder inside /themes: for example: /themes/MyTheme
* Copy the folders /themes/default/core and /themes/default/settings to /themes/MyTheme
* edit the file /config/config.php
* Insert:  'theme' => 'MyTheme',   into this file

Within the folder /themes/MyTheme all files, which are needed for theming
are save from coming updates.
All company theming must be done exclusively here from now on.

In case, that one of the following files is affected due to an upgrade,

* /themes/default/settings/templates/apps.php
* /themes/default/defaults.php

the files listed below, have to be replaced by those listed above:

* /themes/MyTheme/settings/templates/apps.php
* /themes/MyTheme/defaults.php

But this is unlikely at least in the upcoming updates (5.0.x).
ownCloud aims to give further information in this case.
