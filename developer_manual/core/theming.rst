Theming
=======

Themes can be used to customise the look and feel of ownCloud without the need
to patch the source code.

Activate
--------

Themes can be placed in the theme folder ``/themes`` with the name of the theme
as foldername. The theme can be activated by putting ``"theme" => ‘themename’``,
into the ``config.php`` file.

Structure
---------

The folder structure of a theme is exactly the same as the main ownCloud
structure. You can override js files, images and templates with own versions.
css files are loaded additionally to the default files so you can override css
properties.

Development
-----------

Themes should be developed in the `GitHub themes repository`_.
You can find a simple example `here`_.

How to change images and the logo
---------------------------------

The easiest picture to change in ownCloud is the logo. When you open your
browser and point to ownCloud, you will see an ownCloud logo by default. That
image can be replaced. We will show you how to do so in this section. There are
two pictures to think about:

owncloud-logo-medium-white.png
  This is the splash screen logo, appearing
  above the login page of your ownCloud instance. size: 252x122 (w x h) pixels,
  approximately, works well. Too much bigger and the logo doesn’t fit in the
  spot on the page

logo-wide.svg
  This is the little logo that appears in the top left of the ownCloud navigate
  frame (SVGs can be created with adobe illustrator or open source inkscape)
  140x32 pixels. works well. Too much higher and the logo overflows into the
  navigation pane and looks terrible.  The width, however, can be bigger or
  smaller to meet your needs, whatever works for your logo.

To change either of these logos, simply create your own logo file with these
characteristics, and put it in you themes folder in ``core/img/``.

How to change colors
--------------------

Just put a new ``style.css`` into the ``core/css`` folder in your themes
directory.  Changing the header bar colours on the Login and Main Navigation
screen: In the style sheet, a bit further down, is a set that looks something
like this:

.. code-block:: css

  /* HEADERS */
  #body-user #header, #body-settings #header { position:fixed; top:0; z-index:100; width:100%; height:2.5em; padding:.5em; background:#1d2d42; -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5), inset 0 -2px 10px #222; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5), inset 0 -2px 10px #222; box-shadow:0 0 10px rgba(0, 0, 0, .5), inset 0 -2px 10px #222; }
  #body-login #header { margin: -2em auto 0; text-align:center; height:10em;
   -moz-box-shadow:0 0 1em rgba(0, 0, 0, .5); -webkit-box-shadow:0 0 1em rgba(0, 0, 0, .5); box-shadow:0 0 1em rgba(0, 0, 0, .5);
  background: #1d2d42; /* Old browsers */
  background: -moz-linear-gradient(top, #33537a 0%, #1d2d42  100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#F1B3A4), color-stop(100%,#1d2d42)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* Opera11.10+ */
  background: -ms-linear-gradient(top, #33537a 0%,#1d2d42 100%); /* IE10+ */
  background: linear-gradient(top, #33537a 0%,#1d2d42 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#33537a', endColorstr='#1d2d42',GradientType=0 ); /* IE6-9 */ }

  #owncloud { float:left; }

This handles the headers for a lot of different browser types. What we want to
do is change the ``#35537a`` (lighter blue) and ``#ld2d42`` (dark blue) color to
the colours of our choice. In some older and other browsers, there is just one
color, but in the rest there are gradients.The login page background is a
horizontal gradient. The first hex number, ``#35537a``, is the top color of the
gradient at the login screen. The second hex number, ``#ld2d42`` is the botton
color of the gradient at the login screen.

Change these colors to the hex color of your choice, save, and refresh to see
the new login screen. The other major color scheme is the blue header bar on the
main navigation page once you log in to ownCloud. This color we will change with
the above as well. Save the file and refresh the browser for the changes to take
affect.

.. _GitHub themes repository: https://github.com/owncloud/themes
.. _here: https://github.com/owncloud/themes/tree/master/example

Notes for Updates
-----------------

In case of theming it is recommended to the user,
not to perform these adaptions inside the folder /themes/default.

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
*	/themes/default/defaults.php

the files listed below, have to be replaced by those listed above:

*	/themes/MyTheme/settings/templates/apps.php
*	/themes/MyTheme/defaults.php

But this is unlikely at least in the upcoming updates (5.0.x).
ownCloud aims to give further information in this case.
