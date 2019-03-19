==============================
Synchronizing with KDE Kontact
==============================

KOrganizer and KAddressBook can synchronize your calendar, contacts and tasks with a Nextcloud server.

This can be done by following these steps:

1. Open KOrganizer and in the calendar list (bottom left) right-click and choose ``Add Calendar``.

.. image:: ../images/KOrganizer_add_calendar.png

2. In the resulting list of resources, pick ``DAV groupware resource``.

.. image:: ../images/korganizer_resource_choice.png

3. Enter your username. As password, you need to generate an app-password/token (`Learn more <https://docs.nextcloud.com/server/stable/user_manual/session_management.html#managing-devices>`_).

.. image:: ../images/korganizer_credentials.png

4. Choose ``ownCloud`` or ``Nextcloud`` as Groupware server option.

.. image:: ../images/KOrganizer_groupware_server.png

5. Enter your Nextcloud server URL and, if needed, installation path (anything that comes after the first /, for example ``mynextcloud`` in ``https://exampe.com/mynextcloud``). Then click next.

.. image:: ../images/KOrganizer_server_address.png

6. You can now test the connection, which can take some time for the initial connection. If it does not work, you can go back and try to fix it with other settings.

.. image:: ../images/KOrganizer_test1.png

.. image:: ../images/KOrganizer_test2.png

7. Pick a name for this resource, for example ``Work`` or ``Home``. By default, both CalDAV (Calendar) and CardDAV (Contacts) are synced. 

.. note:: You can set a manual refresh rate four your calendar and contacts resources. By default this setting is set to 5 minutes and should be fine for the most use cases. You may want to change this for saving your power or cellular data plan.  that you can update with a right-click on the item in the calendar list and when you create a new appointment it is synced to Nextcloud right away.

.. image:: ../images/KOrganizer_pick_resources.png

8. After a few seconds to minutes depending on your internet connection, you will finde your calendars and contacts inside the KDE Kontact applications KOrganizer and KAddressBook!

.. image:: ../images/KOrganizer.png
.. image:: ../images/KAddressBook.png
