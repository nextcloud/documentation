=======================
DAV & database commands
=======================

.. _dav_label:

Dav commands
------------

Manage addressbooks and calendars::

 dav
  dav:create-addressbook          Create a dav addressbook
  dav:create-calendar             Create a dav calendar
  dav:create-subscription         Create a dav subscription
  dav:delete-calendar             Delete a dav calendar
  dav:delete-subscription         Delete a calendar subscription for a user
  dav:fix-missing-caldav-changes  Insert missing calendarchanges rows for existing events
  dav:list-addressbooks           List all addressbooks of a user
  dav:list-calendars              List all calendars of a user
  dav:list-subscriptions          List all calendar subscriptions for a user
  dav:move-calendar               Move a calendar from an user to another
  dav:remove-invalid-shares       Remove invalid dav shares
  dav:retention:clean-up
  dav:send-event-reminders        Sends event reminders
  dav:sync-birthday-calendar      Synchronizes the birthday calendar
  dav:sync-system-addressbook     Synchronizes users to the system addressbook
 calendar
  calendar:export                 Export a calendar of a user
  calendar:import                 Import a calendar to a user


Manage addressbooks
^^^^^^^^^^^^^^^^^^^

List all addressbooks of a user
"""""""""""""""""""""""""""""""

``dav:list-addressbooks <uid>``

This example will list all addressbooks for user annie: ::

 sudo -E -u www-data php occ dav:list-addressbooks annie

Create a addressbook for a user
"""""""""""""""""""""""""""""""

``dav:create-addressbook <user> <name>``

This example creates the addressbook ``mollybook`` for the user molly: ::

 sudo -E -u www-data php occ dav:create-addressbook molly mollybook


Manage calendars
^^^^^^^^^^^^^^^^

List all calendars of a user
""""""""""""""""""""""""""""

``dav:list-calendars <uid>``

This example will list all calendars for user annie: ::

 sudo -E -u www-data php occ dav:list-calendars annie

Create a calendar for a user
""""""""""""""""""""""""""""

``dav:create-calendar <user> <name>``


This example creates the calendar ``mollycal`` for the user molly: ::

 sudo -E -u www-data php occ dav:create-calendar molly mollycal

Delete a calendar for a user
""""""""""""""""""""""""""""

``dav:delete-calendar [--birthday] [-f|--force] [--] <uid> [<name>]`` deletes the
calendar named ``name`` (or the birthday calendar if ``--birthday`` is
specified) of the user ``uid``. You can use the force option ``-f`` or
``--force`` to delete the calendar instead of moving it to the trashbin.

This example will delete the calendar mollycal of user molly::

 sudo -E -u www-data php occ dav:delete-calendar molly mollycal

This example will delete the birthday calendar of user molly::

 sudo -E -u www-data php occ dav:delete-calendar --birthday molly


Move a calendar of a user
"""""""""""""""""""""""""

.. note:: Note that this will change existing share URLs.

``dav:move-calendar [-f|--force] [--] <name> <sourceuid> <destinationuid>`` allows the admin to move a calendar named ``name`` from a user ``sourceuid`` to the user ``destinationuid``. You can use the force option `-f` to enforce the move if there are conflicts with existing shares. The system will also generate a new unique calendar name in case there is a conflict over the destination user.


This example will move calendar named personal from user dennis to user sabine: ::

 sudo -E -u www-data php occ dav:move-calendar personal dennis sabine


Export a calendar of a user
"""""""""""""""""""""""""""

``calendar:export [--format FORMAT] [--location LOCATION] [--] <uid> <uri>`` exports the calendar entries from a calendar with the given ``uri`` of user ``uid``.

**Arguments:**

* ``uid`` (mandatory): User ID whose calendar will be exported.
* ``cid`` (mandatory): Calendar URI to export.
* ``--format FORMAT`` (optional, defaults to ``ical``): Output format. One of ``ical``, ``xcal``, or ``jcal``.
* ``--location <file path>`` (optional, defaults to stdout): Path to the file to export to. If omitted, output is written to standard output.

The output format can be specified with the ``--format`` option. Valid formats are ``ical`` standard format (RFC 5545), ``xcal`` XML iCalendar (RFC 6321), and ``jcal`` JSON iCalendar (RFC 7265).

This example will export the calendar named personal of user dennis to a file named personal.ics in standard format: ::

 sudo -E -u www-data php occ calendar:export dennis personal --location /tmp/personal.ics

This example will export the calendar in XML iCalendar format: ::

 sudo -E -u www-data php occ calendar:export dennis personal --format xcal --location /tmp/personal.xcal

This example will export the calendar in JSON iCalendar format to standard output: ::

 sudo -E -u www-data php occ calendar:export dennis personal --format jcal


Import a calendar to a user
"""""""""""""""""""""""""""

``calendar:import [--format FORMAT] [--errors ERRORS] [--validation VALIDATION] [--supersede] [--show-created] [--show-updated] [--show-skipped] [--show-errors] [--] <uid> <uri> [<location>]`` imports a calendar entries to the calendar with the given ``uri`` of user ``uid``.

**Arguments:**

* ``uid`` (mandatory): User ID to import the calendar for.
* ``uri`` (mandatory): Calendar URI to import into.
* ``location`` (optional, defaults to stdin): Path to the file to import. If omitted, reads from standard input.
* ``--format FORMAT`` (optional, defaults to ``ical``): Input format. One of ``ical``, ``xcal``, or ``jcal``.
* ``--supersede`` (optional): Force override of existing objects with the same UID.
* ``--show-created`` (optional): Show UID of created objects after import.
* ``--show-updated`` (optional): Show UID of updated objects after import.
* ``--show-skipped`` (optional): Show UID of skipped objects (e.g., duplicates or invalid entries).
* ``--show-errors`` (optional): Show UID of objects with errors during import.
* ``--errors ERRORS`` (optional): How to handle errors. ``0`` = continue on error, ``1`` = fail on error.
* ``--validation VALIDATION`` (optional): How to handle object validation. ``0`` = no validation, ``1`` = validate and skip on issue, ``2`` = validate and fail on issue.

The input format can be specified with the ``--format`` option, valid formats are ``ical`` standard format (RFC 5545), ``xcal`` XML iCalendar (RFC 6321) and ``jcal`` JSON iCalendar (RFC 7265), the default is ``ical``.

This example will import from a file named personal.ics in standard format to the calendar named personal of user dennis: ::

  sudo -E -u www-data php occ calendar:import dennis personal /tmp/personal.ics

This example will import from a file named personal.xcal in XML iCalendar format to the calendar named personal of user dennis: ::

  sudo -E -u www-data php occ calendar:import --format xcal dennis personal /tmp/personal.xcal

This example will import from a file named personal.jcal in JSON iCalendar format to the calendar named personal of user dennis: ::
  
  sudo -E -u www-data php occ calendar:import --format jcal dennis personal /tmp/personal.jcal

This example will import from standard input to the calendar named personal of user dennis: ::
  
  cat /tmp/personal.ics | sudo -E -u www-data php occ calendar:import dennis personal

Misc
""""

``dav:fix-missing-caldav-changes [<user>]`` attempts to restore calendar sync changes when data in the calendarchanges table has been lost. If the user ID is omitted, the command runs for all users, which may take some time to complete.

``dav:retention:clean-up`` deletes elements from the CalDAV trash that are due for removal.

``dav:remove-invalid-shares`` removes invalid shares that were created due to a bug in the calendar app.

``dav:send-event-reminders`` is a command that should be called regularly through a dedicated
cron job to send event reminder notifications. See :doc:`../groupware/calendar` for more information on how to use this command.


Manage calendar subscriptions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

List all calendar subscriptions of a user
"""""""""""""""""""""""""""""""""""""""""

``dav:list-subscriptions <uid>``

This example will list all calendar subscriptions for user annie: ::

 sudo -E -u www-data php occ dav:list-subscriptions annie


Create a calendar subscription for a user
"""""""""""""""""""""""""""""""""""""""""

``dav:create-subscription <user> <name> <url> [<color>]``

This example creates the subscription for the lunar calendar ``Lunar Calendar`` for the user molly: ::

 sudo -E -u www-data php occ dav:create-subscription molly "Lunar Calendar" webcal://cantonbecker.com/astronomy-calendar/astrocal.ics

Optionally, a color for the new subscription calendar can be passed as a HEX color code::

 sudo -E -u www-data php occ dav:create-subscription molly "Lunar Calendar" calendar webcal://cantonbecker.com/astronomy-calendar/astrocal.ics "#ff5733"

If not set, the theming default color will be used.


Delete a calendar subscription for a user
"""""""""""""""""""""""""""""""""""""""""

``dav:delete-subscription <uid> <uri>``

This example deletes the subscription for the lunar calendar ``Lunar Calendar`` for the user molly: ::

 sudo -E -u www-data php occ dav:delete-subscription molly "Lunar Calendar"


.. _dav-sync-system-address-book:

Sync system address book
^^^^^^^^^^^^^^^^^^^^^^^^

``dav:sync-system-addressbook`` synchronizes all users to the :ref:`system
address book<system-address-book>`::

 sudo -E -u www-data php occ dav:sync-system-addressbook

Sync birthday calendar
^^^^^^^^^^^^^^^^^^^^^^

``dav:sync-birthday-calendar [<user>]`` adds all birthdays to your calendar from
addressbooks shared with you. This example syncs to your calendar from user bernie: ::

 sudo -E -u www-data php occ dav:sync-birthday-calendar bernie

Disable creation of example events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This will disable the automatic creation of example events in calendar: ::

 sudo -E -u www-data php occ config:app:set dav create_example_event --value=false --type=boolean


.. _database_conversion_label:

Database conversion
-------------------

The SQLite database is good for testing, and for Nextcloud servers with small
single-user workloads that do not use sync clients, but production servers with
multiple users should use MariaDB, MySQL, or PostgreSQL. You can use ``occ`` to
convert from SQLite to one of these other databases.

::

 db
  db:convert-type           Convert the Nextcloud database to the newly
                            configured one

You need:

* Your desired database and its PHP connector installed.
* The login and password of a database admin user.
* The database port number, if it is a non-standard port.

This is example converts SQLite to MySQL/MariaDB::

 sudo -E -u www-data php occ db:convert-type mysql oc_dbuser 127.0.0.1
 oc_database

For a more detailed explanation see
:doc:`../configuration_database/db_conversion`

.. _database_add_indices_label:

Add missing indices
-------------------

It might happen that we add from time to time new indices to already existing database tables,
for example to improve performance. In order to check your database for missing indices run
following command::

 sudo -E -u www-data php occ db:add-missing-indices

Use option ``--dry-run`` to output the SQL queries without running them.


