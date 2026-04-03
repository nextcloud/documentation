========
Calendar
========

Invitations
-----------
Nextcloud can send invitations for event attendees if this option is activated.
Be sure to have configured the email server first so that the invitations go through.
See :doc:`../configuration_server/email_configuration`.

You must also make sure the "Send invitations to attendees" setting is activated in the admin setting groupware section for the emails to be sent.

Birthday calendar
-----------------
Contacts that have a birthday date filled are automatically added as events to a special Birthday calendar.
If you deactivate this option, all users will no longer have this calendar.

When activating this option, users birthday calendars won't be available right away because they need to be generated
by a background task. See :doc:`../configuration_server/occ_command` section Dav commands.

Reminder notifications
----------------------
Nextcloud handles sending notifications for events.

Nextcloud currently handles two types of reminder notifications: Build-in Nextcloud notifications and
email notifications. For the emails to be send, you'll need a configured email server.
See :doc:`../configuration_server/email_configuration`.

Make sure the "Send notifications for events" and the "Enable notifications for events via push" are activated in the admin setting groupware section for this feature to work.

Background jobs
~~~~~~~~~~~~~~~
As this can be a expensive task, depending on the number of events, reminders and event sharees and attendees that also needs to happen
often enough so that the notifications are send on time, you can use a dedicated occ command that should be run
more often than the standard cron system::

 # crontab -u www-data -e
 */5 * * * * php -f /var/www/nextcloud/occ dav:send-event-reminders

See :doc:`../configuration_server/occ_command` section Dav commands.

You'll also need to change the sending mode from ``background-job`` to ``occ``::

 php occ config:app:set dav sendEventRemindersMode --value occ

If you don't use this dedicated command, the reminders will just be send as soon as possible when the background jobs run.

FreeBusy
--------

When logged-in, Nextcloud can return FreeBusy information for all users of the instance, to know when they are available so that you can schedule an event at the right time.
If you don't wish for users to have this possibility, you can disable FreeBusy for the whole instance with the following setting::

 php occ config:app:set dav disableFreeBusy --value yes

Subscriptions
----------------------
Refresh rate
~~~~~~~~~~~~

Calendar subscriptions are cached on server and refreshed periodically. The default refresh rate is of one week, unless the subscription itself tells otherwise.

To set up a different default refresh rate, change the ``calendarSubscriptionRefreshRate`` option::

 php occ config:app:set dav calendarSubscriptionRefreshRate --value "P1D"

Where the value is a `DateInterval <https://www.php.net/manual/dateinterval.construct.php>`_, for instance with the above command all of the Nextcloud instance's calendars would be refreshed every day.

Allow subscriptions on local network
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because of security issues, Nextcloud forbids subscriptions from local network hosts. If you need to allow this, change the following parameter to::

 php occ config:app:set dav webcalAllowLocalAccess --value yes
