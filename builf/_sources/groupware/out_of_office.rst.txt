=====================
Out-of-office feature
=====================

.. versionadded:: 28.0.0

The out-of-office feature allows users to schedule an out-of-office period including a status and
message that is integrated with other apps such as Nextcloud Mail. Please refer to the user
documentation for more information about the feature itself. It may be disabled globally by admins.

The feature relies on users to configure their preferred calendar time zones correctly. However, if
a user does not configure their time zone, the default time zone of the server is used. It can be
configured by setting ``default_timezone`` in the `config.php` file of your Nextcloud server. The
configuration value accepts IANA identifiers like ``Europe/Berlin`` and defaults to ``UTC``. Please
refer to the `Nextcloud configuration` section for more information about the value.

To disable the out-of-office feature for all users the ``hide_absence_settings`` app configuration
value of the `dav` app has to be set to `yes`. This can be achieved by running the following
command on your server:

::

    occ config:app:set --value=yes dav hide_absence_settings

.. note::

    Out-of-office periods that were scheduled before the feature was disabled will not be deleted.
    Disabling it will only hide the feature from the user interface. If the feature is enabled
    again, the periods will be visible again.

Set the value for `hide_absence_settings` to `no` or delete the configuration option entirely to enable the feature again. The following
command can be used to do so:

::

    occ config:app:set --value=no dav hide_absence_settings
