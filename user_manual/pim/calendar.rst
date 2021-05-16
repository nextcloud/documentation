======================
Using the Calendar app
======================

.. note:: The calendar app is not enabled by default and needs to be installed
          separately from our App Store. Please ask your Administrator for it.

The Nextcloud Calendar app works similar to other calendar applications you can
sync your Nextcloud calendars and events with.

When you first access the Calendar app, a default first calendar will be
pre-generated for you.

.. figure:: images/calendar_application.png

Managing your calendars
-----------------------

Import a Calendar
~~~~~~~~~~~~~~~~~

If you want to transfer your calendar and their respective events to your Nextcloud
instance, importing is the best way to do so.

.. figure:: images/calendar_settings.png
            :scale: 50%

1. Click on the settings-icon labeled with ``Settings & Import`` at the left-bottom.

2. After clicking on ``+ Import Calendar`` you can select one or more calendar files
   from your local device to upload.

3. The upload can take some time and depends on how big the calendar you import
   is.

.. note:: The Nextcloud Calendar application only supports iCalendar-compatible
          ``.ics``-files, defined in RFC 5545.

Create a new Calendar
~~~~~~~~~~~~~~~~~~~~~

If you plan to setup a new calendar without transferring any old data from your
previous calendar, creating a new calendar is the way you should go.

.. only:: html

  .. figure:: images/calendar_create.gif

1. Click on ``+ New Calendar`` in the left sidebar.

2. Type in a name for your new calendar, e.g. "Work", "Home" or "Studies".

3. After clicking on the checkmark, your new calendar is created and can be
   synced across your devices, filled with new events and shared with your friends
   and colleagues.

Edit, Download or Delete a Calendar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sometimes you may want to change the color or the entire name of a previous
imported or created calendar. You may also want to export it to your local
hard drive or delete it forever.

.. note:: Please keep in mind that deleting a calendar is a irreversible action.
          After deletion, there is no way of restoring the calendar unless you
          have a local backup.

.. figure:: images/calendar_dropdown.png
            :scale: 50%

1. Click on the three-dot-menu of the respective calendar.

.. figure:: images/calendar_editing.png
            :scale: 50%

2. Click on ``Edit``, ``Download`` or ``Delete``.

Sharing calendars
~~~~~~~~~~~~~~~~~

You may share your calendar with other users or groups. Calendars may be shared with write access or read-only. When sharing a calendar with write access, users with whom the calendar is shared will be able to create new events into the calendar as well as edit and delete existing ones.

.. note:: Calendar shares currently can't be accepted or rejected. If you want to stop having a calendar that someone shared with you, you can click on the 3-dot menu next to the calendar in the calendar list and click on "Unshare from me".

Publishing a calendar
~~~~~~~~~~~~~~~~~~~~~

Calendars can be published through a public link to make them viewable (read-only) to external users. You may create a public link by opening the share menu for a calendar and clicking on « + » next to « Share link ». Once created you can copy the public link to your clipboard or send it through email.

There's also an « embedding code » that provides an HTML iframe to embed your calendar into public pages.

On the public page, users are able to get the subscription link for the calendar and download the whole calendar directly.

Subscribe to a Calendar
~~~~~~~~~~~~~~~~~~~~~~~

You can subscribe to iCal calendars directly inside of your Nextcloud. By
supporting this interoperable standard (RFC 5545) we made Nextcloud calendar
compatible to Google Calendar, Apple iCloud and many other calendar-servers
you can exchange your calendars with, including subscription links from calendar published on other Nextcloud instances, as described above.

1. Click on ``+ New Subscription`` in the left sidebar.
2. Type in or paste the link of the shared calendar you want to subscribe to.

Finished. Your calendar subscriptions will be updated regularly.

.. note:: Subscriptions are refreshed every week by default. Your admin may have changed this setting.

Managing Events
---------------

Create a new event
~~~~~~~~~~~~~~~~~~

Events can be created by clicking in the area when the event is scheduled.
In the day- and week-view of the calendar you just click, pull and left your
cursor over the area when the event is taking place.

.. only:: html

  .. figure:: images/calendar_new-event_week.gif

The month-view only requires a single click into the area of the specific day.

.. only:: html

  .. figure:: images/calendar_new-event_month.gif

After that, you can type in the event's name (e.g. **Meeting with Lukas**), choose
the calendar in which you want to choose the event (e.g. **Personal**, **Work**),
check and concretize the time span or set the event as all-day event.

If you want to edit advanced details such as the **Location**, a **Description**,
**Attendees**, **Reminders** or to set the event as a repeating-event click on
the ``More...``-button to open the advanced sidebar-editor.

.. note:: If you always want to open the advanced sidebar-editor instead of the
          simple event editor popup, you can set a ``Skip simple event
          editor``-checkmark in the ``Settings & Import``-section of the app.

Clicking on the blue ``Create``-button will finally create the event.

Edit or Delete an event
~~~~~~~~~~~~~~~~~~~~~~~

If you want to edit or delete a specific event, you just need to click on it.
After that you will be able to re-set all event details and open the
advanced sidebar-editor by clicking on ``More``.

Clicking on the ``Update``-button will update the event. To cancel your changes, click on the close icon on top right of the popup or sidebar editor.

If you open the sidebar view and click the three dot menu next to the event name, you have an option to export the event as an ``.ics`` file or remove the event from your calendar.

  .. figure:: images/calendar_event_menu.png

Invite attendees to an event
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You may add attendees to an event to let them know they're invited. They will receive an email confirmation and will be able to confirm or cancel their participation to the event.
Attendees may be other users on your Nextcloud instances, contacts in your addressbooks and direct email addresses. You also may change the level of participation per-attendees, or disable email confirmation for a specific attendee.

  .. figure:: images/calendar_event_invitation_level.png

.. tip:: When adding other Nextcloud users as attendees to an event, you may access their FreeBusy information if it's available, helping you to determine when is the best time slot for your event.

.. attention:: Only the calendar owner can send out invitations, the sharees are not able to do that, whether they have write access to the event's calendar or not.

Setup Reminders
~~~~~~~~~~~~~~~

You can set up reminders to be notified before an event occurs. Currently supported notification methods are :

* Email notifications
* Nextcloud notifications

You may set reminders at a time relative to the event or at a specific date.

.. figure:: images/calendar_event_reminders.png

.. note:: Only the calendar owner and people or groups with whom the calendar is shared with write access will get notifications. If you don't get any notifications but think you should, your Administrator could also have disabled this for your server.

.. note:: If you synchronize your calendar with mobile devices or other 3rd-party
          clients, notifications may also show up there.

Add recurring options
~~~~~~~~~~~~~~~~~~~~~

An event may be set as "recurring", so that it can happen every day, week, month or year. Specific rules can be added to set which day of the week the event happens or more complex rules, such as every fourth Wednesday of each month.

You can also tell when the recurrence ends.

.. figure:: images/calendar_event_repeat.png

Birthday calendar
-----------------

The birthday calendar is a auto-generated calendar which will automatically
fetch the birthdays from your contacts. The only way to edit this calendar is by
filing your contacts with birthday dates. You can not directly edit this calendar
from the calendar-app.

.. note:: If you do not see the birthday calendar, your Administrator may have
          disabled this for your server.
