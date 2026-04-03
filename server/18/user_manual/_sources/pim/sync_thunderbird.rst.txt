==============================
Synchronizing with Thunderbird
==============================

Contacts
--------

As someone who is new to Nextcloud and new to CardBook here is what you need in excruciating pithy detail to make this work:

- `Thunderbird <https://www.thunderbird.net/>`_ for your OS unless it comes with your OS distribution (Linux)
- `CardBook <https://addons.thunderbird.net/en-US/thunderbird/addon/cardbook/>`_ (a Thunderbird contacts add-on.)

Using the CardBook add-on (Contacts only)
-----------------------------------------
`CardBook <https://addons.thunderbird.net/de/thunderbird/addon/cardbook/>`_ is an advanced alternative to Thunderbird's address book, which supports CardDAV. You can have TBSync and CardBook installed in parallel.
 
1. Click the Cardbook icon in the upper right corner of Thunderbird:

.. image:: ../images/cardbook_icon.png

2. In Cardbook:

   -  "Adressbook > New Adressbook **Remote** > Next
   -  Select **CardDAV**, fill in the address of your Nextcloud server, your user name and password

.. image:: ../images/new_addressbook.png

4. Click on "Validate", click Next, then choose the name of the addressbook and click Next again.

.. image:: ../images/addressbook_name.png

5. When you are finished, CardBook synchronizes your addressbooks. You can always trigger a synchronisation manually by clicking "Synchronize" in the top left corner of CardBook.

.. image:: ../images/synchronize_cardbook.png

Calendar
--------

- `Thunderbird <https://www.thunderbird.net/>`_ for your OS unless it comes with your OS distribution (Linux)
- `Lightning <https://addons.mozilla.org/en-US/thunderbird/addon/lightning/>`_ (a Thunderbird calendar add-on.)

Once you've installed Lighning and Thunderbird do like this:

1. Go to your Nextcloud Calendar and click on the 3 dotted menu for the calendar that you want to synchronize which will display and URL that looks something like this:
https://cloud.nextcloud.com/remote.php/dav/calendars/daniel/personal/

2. Go to the calendar view in Thunderbird and right click in the calendar menu to the left (where the names of the calendars are) to add a **New Calendar**.

3. Choose **On the network**

.. image:: ../images/new_calendar.png

4. Choose **CalDAV** and fill in the missing information:

.. image:: ../images/CalDAV_calendar.png

Fix for Thunderbird 60
----------------------
If you are still using Thunderbird 60, you need to change a configuration setting to make CalDAV/CardDAV work around Thunderbird bug `#1468918 <https://bugzilla.mozilla.org/show_bug.cgi?id=1468912>`_ as described `here <https://help.nextcloud.com/t/thunderbird-60-problems-with-address-and-calendar-sync/35773>`_ 
