=================================
Nextcloud |version| Release Notes
=================================


Changes in 11
-------------

tbd

Q & A
-----

Could not install core app bundle
=================================

The following error message is shown during the update: "Repair warning: Could
not install core app bundle: Could not download app <app>".

This basically means that Nextcloud could not fetch the app from the appstore
automatically. This could have multiple reasons: either you disabled the
appstore with the config.php flag or your server could not reach the app store.
The instance will work fine, but the features that are usually provided by this
app are not available.
