Using the Calendar App
======================

The ownCloud Calendar app enables you to create and edit events, synchronize to 
other calendars you might use, and create new, personalized calendars.

By default, when you access the Calendar app for the first time, you get a 
"Personal" calendar that you can use or modify as you like.

.. figure:: ../images/calendar_default.png
  :scale: 75%

  **Calendar app (default)**
  
The Calendar app contains the following fields and controls:

- Calendar Date Field -- Provides the current date or enables you to select a
  date that you want to view.

- Calendar View Options -- Enables you to choose between a day, week, or month
  view for the main Calendar app window.  Also provides a quick jump button to
  access the current day (Today).
  
- Calendar Selection -- Enables you to choose the calendar that you want to view.

- Calendar Controls -- Provides controls for each individual calendar.  These
  controls include sharing, obtaining an external URL link to the calendar, an
  export function, an edit function, and a delete (trash) button.
  
- Calendar Settings -- Provides access to the calendar-specific settings.  These
  settings include the calendar timezone selection, time format selection, week
  start day, cache setting, primary CalDAV address, and iOS/OS X CalDAV address
  settings.

Creating a New Calendar
-----------------------

The ownCloud Calendar app enables you to create new calendars for work or other
activities that you want to keep separated.  You can manage each calendar
separately.

To create a new calendar:

1. Access the Calendar app.

2. Click the ``+ New Calendar`` field.

  A dialog opens to enable you to create a new calendar.
  
  .. figure:: ../images/calendar_create_new.png
  
  **New calendar**
  
3. Specify a name for the new calendar.

4. (Optional) Specify a color for the new calendar.

5. Click the blue checkbox.

  The Calendar app creates a new calendar using the name and color specified.

Managing Calendar Settings
--------------------------
  
The Calendar app settings enable you to modify the following:

- Timezone -- Provides an alphabetical listing of all available countries 
  categorized by continent.

- Time format -- Provides the option of using 24 hour or 12 hour time format.

- Start day -- Provides the option of starting the calendar week on Monday,
  Sunday, or Saturday.

- Cache -- Enables you to clear the calendar cache for repeating events.

- Primary CalDAV address -- Provides the primary CalDAV link URL.

- iOS/OS X CalDAV address -- Provides the iOS/OS X CalDAV link URL.

.. note:: The Calendar app settings are global and apply to all calendars that 
  you have created.

Synchronizing Calendars Using CalDAV
------------------------------------
*Calendaring Extensions to WebDAV*, referred to as *CalDAV*, enables clients to
access scheduling information on remote servers. As an extension to WebDAV, 
CalDAV (defined by RFC 4791) uses the iCalendar format to manage calendar data. 
CalDAV enables multiple clients to access the same information for use in 
cooperative planning and information sharing.

The Calendar app provides both the Primary CalDAV address and the iOS/OSX CalDAV
address.  Using these addresses, you can use CalDAV-compatible programs (for 
example, Kontact, Evolution, or Thunderbird) using the address provided.

To better understand the URL creation, consider the following examples:

Let's assume you access your ownCloud web interface using the following address::

  http://ADDRESS

To access your ownCloud calendars using CalDAV-compatible programs like
Kontact, Evolution, or Thunderbird, you would use the following URL::

  http://ADDRESS/remote.php/caldav

To access your ownCloud calendars using Apple iCal you would use the following
URL, making sure to include the final slash::

  http://ADDRESS/remote.php/caldav/principals/username/

To access your ownCloud calendars using Mozilla Lightning you would use the 
following URL::

  https://ADDRESS/remote.php/caldav/calendars/USERNAME/CALENDARNAME

The following is an example showing the completed URL where the calendar name is
``defaultcalendar`` and the username is ``test``::
   and the users' name here is "test".

       https://localhost/owncloud/remote.php/caldav/calendars/test/defaultcalendar

.. Note: Calendar names are lower case and any spaces are removed. They are not
  URL-encoded.

Creating events
---------------

To create an event just click on the date in the month view or choose the
timeframe in the weekview. In the dialog which will appear you can enter your
information like title, category, etc.

.. figure:: ../images/calendar_createevent.png
New event window

With the advanced options you can set the
description, the location and the repetition rate of an event. If the repeating
should end you can choose between setting the end by date or by occurrences. If
you choose in the weekview all days from Monday to Friday it will automatically
set the repeat rule to "every weekday". If the interval of the weekview can be
divided by two it automatically set the repeat rule to "Bi-Weekly".

Exporting / Importing events
----------------------------

Export
~~~~~~

.. figure:: ../images/calendar_export.png
Exporting an event

You can export either a single event or a whole calendar. If you want to export
a single event click on it and press the export button in the bottom right
corner. If you want to export a whole calendar use the "Calendar" button as
described in the chapter "Creating a calendar".

Import
~~~~~~

.. figure:: ../images/calendar_import.png
Importing events

Import your calendar as iCal file using the files app. Just click on the
calendar file to open the import dialog. You can import the calendar into a new
calendar or into an already existing calendar.

.. note:: If the progress bar does not work properly, the folder
          ``apps/calendar/import_tmp/`` has probably no write permission.

Why is the calendar app asking for my current location?
-------------------------------------------------------

.. figure:: ../images/calendar_newtimezone1.png
Timezone set notification

The calendar needs your current position in order to detect your timezone.
Without the correct timezone there will be a time offset between the events in
ownCloud and your desktop calendar you synchronise with ownCloud. You can also
set the timezone manually in the personal settings.
