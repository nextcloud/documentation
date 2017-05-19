=============
Release Notes
=============

Changes in Nextcloud |version|
------------------------------

A detailed log of all changes can be found in the official `Changelog
<https://nextcloud.com/changelog/>`_. There are also all current and previous
versions linked.

Theming
=======
The 'old' theming method with CSS files is still available, however, we
switched to using scss on many files which is likely to break your theme.
Re-creating your theme following the usual documentation should suffice.
To lower the effort you need to spend on theming your Nextcloud instance we
highly recommend to use the theming app instead of the themes feature. See
:doc:`configuration_server/theming` for details.

Updates to Nginx configuration
==============================

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
=================================

The following error message is shown during the update: "Repair warning: Could
not install core app bundle: Could not download app <app>".

This basically means that Nextcloud could not fetch the app from the appstore
automatically. This could have multiple reasons: either you disabled the
appstore with the config.php flag or your server could not reach the app store.
The instance will work fine, but the features that are usually provided by this
app are not available.
