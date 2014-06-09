Using the Calendar App
======================

.. figure:: ../images/calendar_manage-calendars.png

  Calendar view with global settings pane is open

.. _managing-calendars:

Managing calendars
------------------

You can manage your calendars by clicking appropriate buttons next to
your calendar in the calendar list on the left. You can also click on |gear| icon
to change global settings for all calendars. Here, there will be also
links for CalDAV access.

Create
~~~~~~

If you use the calendar the first time, there will be already a calendar called
"Personal". To create another calendar, click on *New Calendar* button on the left
pane, type a calendar name and pick a color. Then, click on the tick button to
complete.

.. _eds:

Edit/Delete
~~~~~~~~~~~~~~~~~~~~~~~~~~

To edit a calendar name and/or color, click on the |pencil| icon and change the values.
Then, click on the tick button to apply changes.

.. |pencil| image:: ../images/pencil.png

To delete a calendar, click on the |cross| icon next to the calendar name.

.. |cross| image:: ../images/cross.png


Show/Hide
~~~~~~~~~

To hide/show a calendar, click on the color next to the calendar name. The calendar view
will be refreshed automatically. Currently, in shared calendars, only the users with update
permission can hide/show the calendars.


Share
~~~~~

Calendar sharing is done in the same way as the other apps in ownCloud. To share a calendar,
click on the |share| icon and fill in the desired fields.

.. |share| image:: ../images/share.png

A calendar can be shared with a user, group, and/or public. It can have a password and a
expiration date which will expiry the share after the specified date.

If the calendar is shared with a user or group, it is possible to set permissions to
create, edit, delete, and share the events in it.


Import
~~~~~~

.. figure:: ../images/calendar_import.png

  Importing calendar

Importing your calendar as iCal file is done by using the files app. Upload the iCal file
and just click on the calendar file to open the import dialog. You can import the calendar
into a new calendar or an already existing one.

.. note:: If the progress bar does not work properly, the folder
          ``apps/calendar/import_tmp/`` has probably no write permission. Please contact
          your administrator for this issue.

.. _export-calendar:

Export
~~~~~~

If you want to export a whole calendar to an iCal file, use the |download| icon
next to your calendar in the calendar list.

.. |download| image:: ../images/download.png

.. figure:: ../images/calendar_export.png

  Exporting calendar

Managing events
---------------

Create events
~~~~~~~~~~~~~

To create an event, just click on the date in the month view or choose the
timeframe in the weekview. In the dialog which will appear, you can enter the event
information such as title, category, etc. If there is more than one calendar, you will
be given an option to choose the calendar in which you would like to create the event.

.. figure:: ../images/calendar_createevent.png

  New event window

With the advanced options you can set the description, the location, categories etc.

In the repeating tab, you can choose one from various options. If repeating should end,
you can choose between setting the end by date or by occurrences by clicking *Advanced*
button next to the repeat option.

.. note:: Events are draggable. You can also bring the mouse cursor close to the right
	  (in monthly view) or bottom (in weekview or day view) of an event to adjust
	  date/time.


Edit/Delete events
~~~~~~~~~~~~~~~~~~

Events can be edited by clicking on them in the calendar view. To export or share,
an event needs to be saved first. You can also delete the event by clicking
on *Delete event*.

Import events
~~~~~~~~~~~~~

Importing events is done as importing calendars. Upload your event's iCal file
using the files app. Then, click on the event file to open the import dialog.
You can import the event into a new calendar or an already existing one.

.. note:: If the progress bar does not work properly, the folder
          ``apps/calendar/import_tmp/`` has probably no write permission. Please contact
          your administrator for this issue.

Export events
~~~~~~~~~~~~~

If you want to export a single event click on it and press the *Export* button
on the bottom left corner of the event (you need to expand *Advanced* settings
in event editing window to see this button).

To export all events in calendar see :ref:`export-calendar` section in :ref:`managing-calendars`.


Synchronising Calendars with CalDAV
-----------------------------------

To synchronise the calendars with your favourite calendar software, you can
use the *CalDAV Links* of your calendars.

To get this link, click on the |caldav| icon next to your calendar name in the
calendars list. You will be provided with a link to access your calendars
with the software you like.

.. |caldav| image:: ../images/caldav.png

To get the global link of your calendars, click on the |gear| icon on the bottom
left of the calendar app and copy the relevant address.

To manually get those addresses, please follow the following steps.

Assuming you access your web interface via an address like this::

  http://ADDRESS

Then you can access your calendars with CalDAV-compatible programs like
Kontact, Evolution, Thunderbird using the following URL::

  http://ADDRESS/remote.php/caldav

To use the ownCloud calendar with Apple iCal you will need to use the following
URL, including the trailing slash::

  http://ADDRESS/remote.php/caldav/principals/username/

Mozilla Lightning users need to this URL scheme::

  https://ADDRESS/remote.php/caldav/calendars/USERNAME/CALENDARNAME

   Example for a simple calendar: The "Default calendar" is referred to as "defaultcalendar",
   and the username here is "test".
   The full URL is then:

       https://ADDRESS/remote.php/caldav/calendars/test/defaultcalendar

.. note:: Calendar names are lowercased and the spaces removed. They are not to be URL-encoded
	  anymore.


Why is the calendar app asking for my current location?
-------------------------------------------------------

.. figure:: ../images/calendar_newtimezone1.png

  Timezone set notification

The calendar needs your current position in order to detect your timezone.
Without the correct timezone there will be a time offset between the events in
ownCloud and your desktop calendar you synchronise with ownCloud. You can also
set the timezone manually in the personal settings.

.. |gear| image:: ../images/gear.png
