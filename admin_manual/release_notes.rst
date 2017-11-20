=============
Release notes
=============

Changes in Nextcloud |version|
------------------------------

A detailed log of all changes can be found in the official `Changelog
<https://nextcloud.com/changelog/>`_. There are also all current and previous
versions linked.

Updates to Nginx configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* In the Nginx configuration the Same-Origin header was removed. This is now
  handled in PHP and keeping it will result in a wrong header. Please remove
  those lines in your Nginx config:
  ``add_header X-Frame-Options "SAMEORIGIN";``
  See :doc:`installation/nginx`
* For improvements in serving HTTP requests the Nginx configuration now has
  HTTP 2 enabled. Please update your Nginx config accordingly. See
  :doc:`installation/nginx`
* The GZip configuration for Nginx was updated. See :doc:`installation/nginx`
  for details.

Common questions
----------------

Could not install core app bundle
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following error message is shown during the update: "Repair warning: Could
not install core app bundle: Could not download app <app>".

This basically means that Nextcloud could not fetch the app from the appstore
automatically. This could have multiple reasons: either you disabled the
appstore with the config.php flag or your server could not reach the app store.
The instance will work fine, but the features that are usually provided by this
app are not available.

Theming changes
---------------

With Nextcloud 12, CSS files have been merged into one server.css so in order
to keep your theme working you should consolidate your existing css styles into
a server.css file. As for the example theme the styles.css file has been
renamed to server.css.
