=======
Theming
=======

With our theming feature, you are able to customize the look and feel of your
Nextcloud instance according to the corporate design of your organization by
replacing the Nextcloud logo and color with your own assets.

The theming app is enabled by default so the section should appear by default in
your admin-settings. If not, check in the apps management that this app is enabled.

Modify the appearance of Nextcloud
----------------------------------

You can change the following parameters of the look and feel on your instance:

.. figure:: ../configuration_server/images/theming1.png

* Name (e.g. ACME Inc. Cloud)
* Web link (e.g. https://acme.inc/)
* Slogan
* Primary color: The color used for important buttons, checkboxes, and folder icon
* Background color: The background color if no image is used, the color of header bar icons is also generated from this
* Logo: The logo will appear in the header and on the login page. The default has 62/34 px.
* Background and login image: The background image

.. figure:: ../configuration_server/images/theming2.png

* Additional legal links (Legal notice and Privacy policy link)
* Custom header logo and favicon as an alternative to auto-generation based on logo
* Disable user theming: Although you can select and customize your instance, users can change their backgrounds and colors. If you want to enforce your customization, you can toggle this on.
		

Configure theming through CLI
-----------------------------

Theming configuration can also be adjusted through the ``occ theming:config`` command.

The following values are available to be set through this:

- name, url, imprintUrl, privacyUrl, slogan, color, primary_color ``occ theming:config name "My Example Cloud"``
- background, logo, favicon, logoheader ``occ theming:config logo /tmp/mylogo.png``
- disable-user-theming (yes/no) ``occ theming:config disable-user-theming yes`` 

.. note:: Images require to be read from a local file on the Nextcloud server

Use a color instead of an image as a background:

::

   occ theming:config color "#0082c9"
   occ theming:config background backgroundColor

Theming of icons
----------------

According to the parameters you have set, Nextcloud will automatically generate
favicons and a header logo depending on the current logo and theming color.

This requires the following additional dependencies:

 - PHP module ``imagick``
 - SVG support for imagick (e.g. ``libmagickcore-6.q16-3-extra`` on Debian 9 and Ubuntu 18.04)

.. note:: In the advanced options of the theming app you are able to set a custom
   favicon in case you do not want to use the same logo resources you have set above
   or you do not want to install the mentioned dependencies.

Branded clients
---------------

.. note:: Nextcloud GmbH provides branding services, delivering sync clients (mobile
   and desktop) which use your corporate identity and are pre-configured to help your
   users get up and running in no time. If you are interested in our advanced branding &
   support subscription, `contact our sales team <https://nextcloud.com/enterprise/>`_.

The theming app supports changing the URLs to the mobile apps (Android & iOS) that
are shown when the web interface is opened on one of those devices. Then there was a
header shown, that redirects the user to the app in the app store. By default,
this redirects to the Nextcloud apps. In some cases, it is wanted that this
links to branded versions of those apps. In those cases the IDs and URLs can be
set via the ``occ``-command::

    occ config:app:set theming AndroidClientUrl --value "https://play.google.com/store/apps/details?id=com.nextcloud.client"
    occ config:app:set theming iTunesAppId --value "1125420102"
    occ config:app:set theming iOSClientUrl --value "https://itunes.apple.com/us/app/nextcloud/id1125420102?mt=8"
