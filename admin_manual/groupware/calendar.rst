========
Calendar
========

Invitations
-----------
Nextcloud can send invitations for event attendees if this option is activated.
Be sure to have configured the email server first so that the invitations go through.
See :doc:`../configuration_server/email_configuration`.

Birthday calendar
-----------------
Contacts that have a birthday date filled are automatically added as events to a special Birthday calendar.
If you deactivate this option, all users will no longer have this calendar.

When activating this option, users birthday calendars won't be available right away because they need to be generated
by a background task. See :doc:`../configuration_server/occ_command` section Dav commands.

Reminder notifications
----------------------
Since version 17, Nextcloud handles sending notifications for events. As this can be a expensive task,
depending on the number of events, reminders and event sharees and attendees that also needs to happen
often enough so that the notifications are send on time, you can use a dedicated occ command that should be run
more often than the standard cron system::

 # crontab -u www-data -e
 */5 * * * * php -f /var/www/nextcloud/occ dav:send-event-reminders

See :doc:`../configuration_server/occ_command` section Dav commands.

You'll also need to change the sending mode from ``background-job`` to ``occ``::

 php occ config:app:set dav sendEventRemindersMode --value occ

If you don't use this dedicated command, the reminders will just be send as soon as possible when the background
jobs run.

Nextcloud currently handles two types of reminder notifications: Build-in Nextcloud notifications and
email notifications. For the emails to be send, you'll need a configured email server.
See :doc:`../configuration_server/email_configuration`.

FreeBusy
--------

Nextcloud returns FreeBusy information.

webcalAllowLocalAccess
----------------------
