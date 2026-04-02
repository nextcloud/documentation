============
Activity app
============

You can configure your Nextcloud server to automatically send out e-mail notifications
to your users for various events like:

* A file or folder has been shared
* A new file or folder has been created
* A file or folder has been changed
* A file or folder has been deleted

Users can see actions (delete, add, modify) that happen to files they have access to.
Sharing actions are only visible to the sharer and sharee.

Enabling the activity app
-------------------------

The Activity App is shipped and enabled by default. If it is not enabled
simply go to your Nextcloud Apps page to enable it.

Configuring your Nextcloud for the activity app
-----------------------------------------------

To configure your Nextcloud to send out e-mail notifications a working
:doc:`email_configuration` is mandatory.

Furthermore it is recommended to configure the background job ``Webcron`` or
``Cron`` as described in :doc:`background_jobs_configuration`.

There is also a configuration option ``activity_expire_days`` available in your
``config.php`` (See :ref:`label-activity-app-config`) which allows
you to clean-up older activities from the database.

.. _label-activities-groupfolders:

Activities in groupfolders or external storages
-----------------------------------------------

By default activities in groupfolders or external storages are only generated for the current user.
This is due to the logic of groupfolders and external storages. There is a config flag
``activity_use_cached_mountpoints`` that makes activities in groupfolders and external storages work
like in normal shares when set to ``true``.

.. warning::

    This config option comes with the following limitations:

    1. If "Advanced Permissions" (ACLs) are enabled in a groupfolder, the activities don't respect the permissions and therefore all users see all activities, even for files and directories they don't have access to. **This potentially leaks sensitive information!** See `this issue <https://github.com/nextcloud/groupfolders/issues/1057>`_ for more information.
    2. Users that had access to a groupfolder, share or external storage can see activities in their stream and emails that happen after they are removed until they login again
    3. Users that are newly added to a groupfolder, share or external storage can not see activities in their stream nor emails that happen after they are added until they login again

Better scheduling of activity emails
------------------------------------

In certain scenarios it makes sense to send the activity emails out more regularly,
e.g. you want to send the hourly emails always at the full hour, daily emails before
people start to work in the morning and weekly mails shall be send on monday morning,
so people can read up when starting into the week.

A console command is available to trigger sending those emails.
This allows to set up special cron jobs on your server with the known
granularity, instead of relying on the Nextcloud cron feature which is not very flexible
on scheduling.

To implement the samples mentioned above, the following three entries are necessary::

  # crontab -u www-data -e
   0  *  *  *  *    php -f /var/www/nextcloud/occ activity:send-mails hourly
  30  7  *  *  *    php -f /var/www/nextcloud/occ activity:send-mails daily
  30  7  *  *  MON  php -f /var/www/nextcloud/occ activity:send-mails weekly

If you want to manually send out all activity emails which are queued, you can run
``occ activity:send-mails`` without any argument.
