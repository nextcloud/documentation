==============================
Synchronizing with Thunderbird
==============================

`Thunderbird <https://www.thunderbird.net>`_ is a feature-rich and mature mail client that can be turned into a full-fledged PIM. However, it lacks support  for address book synchronisation via CardDAV and it also lacks the ability to automatically discover calendars and address books available on the server. Therefore, to synchronise with Nextcloud, add-ons are required, which can be easily installed through Thunderbird's add-on manager.
 

Recommended method
------------------

For this method, you need to have three add-ons installed:

1. The `Lightning calendar <https://addons.thunderbird.net/en/thunderbird/addon/lightning/>`_ (Only needed for Thunderbird versions up to 68).
2. `TbSync <https://addons.thunderbird.net/en/thunderbird/addon/tbsync/>`_.
3. The `TbSync provider for CalDAV and CardDAV <https://addons.thunderbird.net/en/thunderbird/addon/dav-4-tbsync/>`_.

When they are installed, if you are on Windows, go to **Extras**/**Synchronisation settings (TbSync)** or **Edit/Synchronisation settings (TbSync)** if on Linux, and then:

* In the account manager choose "**Add account** / **CalDAV / CardDAV account**"
* In the next window, go with the default called **Automatic configuration** and click **next**
* Enter an **account name**, which you can freely choose, **user name**, **password** and the **URL of your server** and click **next**
* In the next window, TbSync should have autodiscovered the CalDAV and CardDAV addresses. When it has, click **Finish**
* Now check the box **Enable and synchronize this account**. TbSync will discover all address books and calenders your account has access to on the server
* Check the box next to each calender and address book you want to have synchronised, also set how often you want them to be synchronised and push the button **sychronize now**
* After the first successful synchronisation is complete, you can close the window. Henceforth, TbSync will do the work for you. You are done and can skip the next sections (unless you need a more advanced address book)


Alternative: Using the CardBook add-on (Contacts only)
------------------------------------------------------
`CardBook <https://addons.thunderbird.net/en/thunderbird/addon/cardbook/>`_ is an advanced alternative to Thunderbird's address book, which supports CardDAV. You can have TbSync and CardBook installed in parallel.
 
1. Click the CardBook icon in the upper right corner of Thunderbird:

.. image:: ../images/cardbook_icon.png

2. In CardBook:

   -  "Address book > New Address book **Remote** > Next
   -  Select **CardDAV**, fill in the address of your Nextcloud server, your user name and password

.. image:: ../images/new_addressbook.png

4. Click on "Validate", click Next, then choose the name of the address book and click Next again:

.. image:: ../images/addressbook_name.png

5. When you are finished, CardBook synchronizes your address books. You can always trigger a synchronisation manually by clicking "Synchronize" in the top left corner of CardBook:

.. image:: ../images/synchronize_cardbook.png

The old method: Manually subscribing to calendars
-------------------------------------------------
This method is only needed if you don't want to install TBSync.

1. Go to your Nextcloud Calendar and click on the 3 dotted menu for the calendar that you want to synchronize which will display an URL that looks something like this:

   ``https://cloud.nextcloud.com/remote.php/dav/calendars/daniel/personal/``

2. Go to the calendar view in Thunderbird and right click in the calendar menu to the left (where the names of the calendars are) to add a **New Calendar**.

3. Choose **On the Network**:

.. image:: ../images/new_calendar.png

4. Choose **CalDAV** and fill in the missing information:

.. image:: ../images/CalDAV_calendar.png

Fix for Thunderbird 60
----------------------
If you are still using Thunderbird 60, you need to change a configuration setting to make CalDAV/CardDAV work around Thunderbird bug `#1468918 <https://bugzilla.mozilla.org/show_bug.cgi?id=1468912>`_ as described `here <https://help.nextcloud.com/t/thunderbird-60-problems-with-address-and-calendar-sync/35773>`_.
