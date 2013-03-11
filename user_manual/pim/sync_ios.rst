iOS - Synchronize iPhone/iPad
=============================

Synchronizing the Calendar
~~~~~~~~~~~~~~~~~~~~~~~~~~

#. Open the settings application.
#. Select Mail, Contacts, Calendars.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CalDAV account.
#. For server, type ``ADDRESS/remote.php/caldav/principals/username``
   (Important: Don't include http:// or https://)
#. Enter your username and password.
#. Select Next.
#. If your server does not support SSL, a warning will be displayed.
   Select Continue.
#. If the iPhone is unable to verify the account information, read
   the Troubleshooting paragraph on this page. If that doesn't help,
   try to turn off SSL (not recommended):

   -  Select OK.
   -  Select advanced settings.
   -  Make sure Use SSL is set to OFF.
   -  Change port to 80.
   -  Go back to account information and hit Save.

Your calendar should now be visible in the Calendar application (may take a few moments).


Address book
------------

#. Open the settings application.
#. Select Mail, Contacts, Calendars.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CardDAV account.
#. For server, type ``ADDRESS/remote.php/carddav/principals/username``
   (Important: Don't include http:// or https://)
#. Enter your username and password.
#. Select Next.
#. If your server does not support SSL, a warning will be displayed.
   Select Continue.
#. If the iPhone is unable to verify the account information, read
   the Troubleshooting paragraph on this page. If that doesn't help,
   try to turn off SSL (not recommended):

   -  Select OK.
   -  Select advanced settings.
   -  Make sure Use SSL is set to OFF.
   -  Change port to 80.
   -  Go back to account information and hit Save.

Now should now find your contacts in the address book of your iPhone (may take a few moments).

Troubleshooting
~~~~~~~~~~~~~~~

#. Check that you didn't include http:// or https:// in the server address.
#. Depending on your server setup the username-part of the server-address may be case sensitive. So for user ``Username`` the server-address may need to be ``ADDRESS/remote.php/caldav/principals/Username`` instead of ``ADDRESS/remote.php/caldav/principals/username``
#. If you need to change the server-address and want to use SSL you'll have to cancel the setup process and enter your data again from the very beginning, as iOS would prepend https:// to the server-address automatically.
#.  Problems have been reported for CardDAV and iOS 4.X. A possible solution is at the `forum`.

.. _forum: http://forum.owncloud.org/viewtopic.php?f=3&t=71&p=2211#p2197
