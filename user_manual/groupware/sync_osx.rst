========================
Synchronizing with macOS
========================

Setup your Accounts
-------------------

In the following steps you will add **CalDAV** (Calendar)
and **CardDAV** (Contacts) to your macOS integrated Calendar and Contacts applications.
At the time of writing this guide, macOS is at version 26.3.1.

1. Click on the Apple logo in the top left corner of your screen and select
   **System Settings...** from the dropdown menu.

.. figure:: ./images/macos_1.png

2. Navigate to **Internet Accounts**:

.. figure:: ./images/macos_2.png

3. Click on the small blue **choose from a list.**

   For **CalDAV**, to subscribe to all calendars use ``https://example.com/remote.php/dav/calendars/USERNAME/``

   To subscribe to a specific calendar, use ``https://example.com/remote.php/dav/calendars/USERNAME/CALENDAR-NAME/``

   For **CardDAV**, to subscribe to all address books use ``https://example.com/remote.php/dav/addressbooks/users/USERNAME/``

   To subscribe to a specific address book, use ``https://example.com/remote.php/dav/addressbooks/users/USERNAME/ADDRESS-BOOK-NAME/``

   Replace ``example.com`` with your Nextcloud server URL and ``USERNAME`` with your Nextcloud username. You can find the URL for a specific calendar in the Nextcloud Calendar web UI by clicking the pencil icon next to a calendar and copying the **Internal link**.

.. figure:: ./images/macos_3.png

4. Click on **add Other Account...** 

.. figure:: ./images/macos_4.png

5. Select **CalDAV Account** for calendar and **CardDAV Account** for contacts.

.. figure:: ./images/macos_5.png

.. note:: You can not setup Calendar/Contacts together. You need to setup them **separately**.

6. Select **Manual** as Account Type and type in your respective credentials:

   **Username**: Your Nextcloud username or email

   **Password**: Either your password or if you use 2FA your generated app-password/token (:ref:`Learn more<managing_devices>`).

   **Server Address**: URL of your Nextcloud server (e.g. ``https://nextcloud.yourdomain.com``)

.. figure:: ./images/macos_6.png

7. Click on **Sign In**.

Troubleshooting
---------------

- macOS does **not** support syncing CalDAV/CardDAV over non-encrypted ``http://``
  connections. Make sure you have ``https://`` enabled and configured on server- and
  client-side.

- **Self-signed certificates** need to be properly set up in the macOS keychain.
