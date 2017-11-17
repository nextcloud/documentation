=======
Theming
=======

Nextcloud has two ways of theming. There is a theming app that provides a web
UI to set up theming. The second option allows to overwrite most of the files
but a customized theme needs to be created and maintained. For more information on
this check out the `developers documentation <../../developer_manual/core/theming.html>`_.

We recommend to use the theming app, because the Nextcloud team maintains this
and verifies that all adjustments to the server work with the theming. It
covers also most use cases like replacing the name, logos and colors.

Theming app
-----------

Check in the apps management that the theming app is enabled. Then the
administrator settings show a section where you can modify the appearance of
your Nextcloud:

* Name 
* Web Address 
* Slogan
* Color: The color of header bar, checkboxes and folder icon
* Logo: The logo will appear in the header and on the log in page. Default has 62/34 px.
* Log in image: The background image of the log in page


.. figure:: ../configuration_server/images/theming.png


Log in page   

.. figure:: ../configuration_server/images/theming-log-in-page.png

Theming of icons
----------------

Nextcloud will automatically generate favicons and home screen icons
depending on the current app and theming color. 

This requires the following additional dependencies:

 - PHP module imagick
 - SVG support for imagick (e.g. `libmagickcore5-extra`)

Theming of mobile app URLs and IDs
----------------------------------

The themes supported to change the URLs to the mobile apps (Android & iOS) that
is shown when the web UI is opened on one of those devices. Then there was a
header shown, that redirects the user to the app in the app store. By default
this redirects to the Nextcloud apps. In some cases it is wanted that this
links to branded versions of those apps. In those cases the IDs and URLs can be
set via the occ command::

    occ config:app:set theming AndroidClientUrl --value "https://play.google.com/store/apps/details?id=com.nextcloud.client"
    occ config:app:set theming iTunesAppId --value "1125420102"
    occ config:app:set theming iOSClientUrl --value "https://itunes.apple.com/us/app/nextcloud/id1125420102?mt=8"

This feature was added in version 12.0.1 and 13.
