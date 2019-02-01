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
``config.php`` (See :doc:`config_sample_php_parameters`) which allows
you to clean-up older activities from the database.

Better scheduling of activity emails
------------------------------------

In certain scenarios it makes sense to send the activity emails out more regularly,
e.g. you want to send the hourly emails always at the full hour, daily emails before
people start to work in the morning and weekly mails shall be send on monday morning,
so people can read up when starting into the week.

Therefore in Nextcloud 12 a console command was added to allow sending those emails
intentionally. This allows to set up special cron jobs on your server with the known
granularity, instead of relying on the Nextcloud cron feature which is not very flexible
on scheduling.

To implement the samples mentioned above, the following three entries are necessary::

  # crontab -u www-data -e
   0  *  *  *  *    php -f /var/www/nextcloud/occ activity:send-mails hourly
  30  7  *  *  *    php -f /var/www/nextcloud/occ activity:send-mails daily
  30  7  *  *  MON  php -f /var/www/nextcloud/occ activity:send-mails weekly

If you want to manually send out all activity emails which are queued, you can run
``occ activity:send-mails`` without any argument.
