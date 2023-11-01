==============================
Synchronizing with Thunderbird
==============================

`Thunderbird <https://www.thunderbird.net>`_ is a feature-rich and mature mail client that can be turned into a full-fledged Personal Information Manager (PIM). Since version 102, it supports address book synchronization via CardDAV and automatic discovery of calendars and address books available on the server.


Recommended method
------------------

Since Thunderbird 102, the CardDAV & CalDAV protocols are natively supported.

Contacts
~~~~~~~~


#. On the address book view, click the down arrow near **New Address Book** and choose **Add CardDAV Address Book**.
#. In the next window, type your **Username** and **Location** (Server URL).
#. The next window will ask for your username and password for this account.
#. The previous window will be refreshed and ask you which address books you wish to sync.
#. Choose and then click **Continue**.

If you later want to add a new address book, you can redo all of those steps and only the books not already synchronized will be suggested.


Calendars
~~~~~~~~~

#. Go to the calendar view in Thunderbird and select the **New Calendar...** button at the bottom of the left side panel.
#. Choose **On the network**:

   .. image:: ../images/new_calendar.png

#. Type your **Username** and **Location** (Server URL), then click on **Find Calendars**.
#. Choose which calendars you want to add and click **Subscribe**

Same thing here, if you later want to add more calendars, just redo the procedure.

Alternative: Using the TbSync addon
-----------------------------------

For this method, you need to have two add-ons installed:

#. `TbSync <https://addons.thunderbird.net/en/thunderbird/addon/tbsync/>`_.
#. `TbSync provider for CalDAV and CardDAV <https://addons.thunderbird.net/en/thunderbird/addon/dav-4-tbsync/>`_.

When they are installed, go to **Extras**/**Synchronization settings (TbSync)** if you are on Windows, or **Edit/Synchronization settings (TbSync)** if on Linux, then:

#. In the account manager choose **Add new account** > **CalDAV & CardDAV**
#. In the next window, go with the default called **Automatic Configuration** and click **Next**
#. Enter an **Account name** (which you can freely choose), a **User name**, a **Password**, the **Server URL**, and click **Next**
#. In the next window, TbSync should have auto-discovered the CalDAV and CardDAV addresses. When it has, click **Finish**
#. Check the **Enable and synchronize this account** box. TbSync will now discover all address books and calendars your account has access to on the server
#. Check the box next to each calendar and address book you want to have synchronized, set how often you want them to be synchronized, and push the button **synchronize now**
#. After the first successful synchronization is complete, you can close the window.

Henceforth, TbSync will do the work for you. You are done with the basic configuration and can skip the next sections unless you need a more advanced address book.


Alternative: Using the CardBook add-on (Contacts only)
------------------------------------------------------

`CardBook <https://addons.thunderbird.net/en/thunderbird/addon/cardbook/>`_ is an advanced alternative to Thunderbird's address book, which supports CardDAV. You can have TbSync and CardBook installed in parallel.

#. Click the CardBook icon in the upper right corner of Thunderbird:

   .. image:: ../images/cardbook_icon.png

#. In CardBook:

   -  Go to Address book > New Address book **Remote** > Next
   -  Select **CardDAV**, fill in the address of your Nextcloud server, your user name and password

   .. image:: ../images/new_addressbook.png

#. Click on "Validate", click Next, then choose the name of the address book and click Next again:

   .. image:: ../images/addressbook_name.png

#. When you are finished, CardBook synchronizes your address books. You can always trigger a synchronization manually by clicking "Synchronize" in the top left corner of CardBook:

   .. image:: ../images/synchronize_cardbook.png
