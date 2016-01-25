Configuring the Activity App
============================

You can configure your ownCloud server to automatically send out e-mail notifications
to your users for various events like:

* A file or folder has been shared
* A new file or folder has been created
* A file or folder has been changed
* A file or folder has been deleted

Users can see actions (delete, add, modify) that happen to files they have access to.
Sharing actions are only visible to the sharer and sharee.

Enabling the Activity App
-------------------------

The Activity App is shipped and enabled by default. If it is not enabled
simply go to your ownCloud Apps page to enable it.

Configuring your ownCloud for the Activity App
----------------------------------------------

To configure your ownCloud to send out e-mail notifications a working
:doc:`email_configuration` is mandatory.

Furthermore it is recommended to configure the background job ``Webcron`` or
``Cron`` as described in :doc:`background_jobs_configuration`.

There is also a configuration option ``activity_expire_days`` available in your
``config.php`` (See :doc:`config_sample_php_parameters`) which allows
you to clean-up older activies from the database.