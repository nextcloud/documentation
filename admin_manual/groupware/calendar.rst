=================
Calendar / CalDAV
=================

Events
------

You can customize the events user interface.

Hide export buttons
~~~~~~~~~~~~~~~~~~~

By default users can export their calendar data from the editor and the sidebar. Admins can disable this feature::

 php occ config:app:set calendar hideEventExport --value=yes

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
by a background task. See :doc:`../configuration_server/occ_command` section DAV commands.

Reminder notifications
----------------------
Nextcloud handles sending notifications for events.

Nextcloud currently handles two types of reminder notifications: Build-in Nextcloud notifications and
email notifications. For the emails to be send, you'll need a configured email server.
See :doc:`../configuration_server/email_configuration`.

Make sure the "Send notifications for events" and the "Enable notifications for events via push" are activated in the admin setting groupware section for this feature to work.

Background jobs
~~~~~~~~~~~~~~~
Running background jobs can be an expensive task when there are a large number of events, reminders, event sharees and attendees. However, this needs to happen
often enough so that the notifications are sent on time. To accomplish this you should use a dedicated ``occ`` command that runs
more often than the standard ``cron`` system::

 # crontab -u www-data -e
 */5 * * * * php -f /var/www/nextcloud/occ dav:send-event-reminders

See :doc:`../configuration_server/occ_command` section Dav commands.

You'll also need to change the sending mode from ``background-job`` to ``occ``::

 php occ config:app:set dav sendEventRemindersMode --value occ

If you don't use this dedicated command, the reminders will just be sent as soon as possible when the background jobs run.

Event alarm types
-----------------

Nextcloud allows users to set notification and email reminders for events. Admins can enforce one of the two options::

 occ config:app:set calendar forceEventAlarmType --value=EMAIL

Allowed values are ``EMAIL`` (email) and ``DISPLAY`` (notification).

.. note:: This only enforces alarm types for events created with the Nextcloud Calendar. This setting has no influence for other connected applications.

FreeBusy
--------

When logged-in, Nextcloud can return FreeBusy information for all users of the instance, to know when they are available so that you can schedule an event at the right time.
If you don't wish for users to have this capability, you can disable FreeBusy for the whole instance with the following setting::

 php occ config:app:set dav disableFreeBusy --value yes

Subscriptions
-------------

Refresh rate
~~~~~~~~~~~~

Calendar subscriptions are cached on server and refreshed periodically.
The default refresh rate is one week, unless the subscription itself tells otherwise.

To set up a different default refresh rate, change the ``calendarSubscriptionRefreshRate`` option::

 php occ config:app:set dav calendarSubscriptionRefreshRate --value "P1D"

Where the value is a `DateInterval <https://www.php.net/manual/dateinterval.construct.php>`_, for instance with the above command all of the Nextcloud instance's calendars would be refreshed every day.

Allow subscriptions on local network
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because of security issues, Nextcloud forbids subscriptions from local network hosts.
If you need to allow this, change the following parameter to::

 php occ config:app:set dav webcalAllowLocalAccess --value yes

Trash bin
---------

Nextcloud supports a calendar, events and tasks trash bin.

The default delay before objects are purged from the trash bin is 30 days. A background job runs every 6 hours to clean up expired objects.

To set up a different retention period, change the ``calendarRetentionObligation`` option::

 php occ config:app:set dav calendarRetentionObligation --value=2592000

Where the value is the number of seconds for the period. Setting the value to ``0`` disables the trash bin.

Resources and rooms
-------------------

The Nextcloud CalDAV back end support resources and rooms. Resources and room can be booked for appointments and the system will schedule them so they can only be used once at a time. Those resources and rooms have to be provided by an app that provides a back end for this.

Once a back end app is installed the app typically allows admins or even users to define the resources, but this is subject of the specific implementation.

Nextcloud periodically queries all registered back ends. Therefore new and updated resources and rooms will show with a delay.

Known back ends
~~~~~~~~~~~~~~~

* `Calendar Resource Management <https://github.com/nextcloud/calendar_resource_management>`_: database back end with CLI configuration for admins
