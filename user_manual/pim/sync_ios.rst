======================
Synchronizing with iOS
======================

Calendar
--------

Get the URL of your calendar in the Nextcloud from your Apple device:
#. Go to the Calendar app in the Nextcloud in a browser (e.g. in Firefox, Safari).
#. Click on "Settings & import" at bottom-left of the page.
#. Click on "Copy iOS/macOS CalDAV address" to copy the URL to your calendar to the clipboard.

#. Open the settings application on your Apple Device.
#. Select Passwords and Accounts.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CalDAV account.
#. For server, type the URL copied on the previous step i.e. ``https://<yourNextcloudInstance.com>/ncloud/remote.php/dav/principals/users/myUser/``
#. Enter your user name and password.
#. Select Next.

Your calendar will now be visible in the Calendar application

.. note:: Beginning with iOS 12 an SSL encryption is necessary. Therefore do **not** disable **SSL**
  (For this reason a certificate is required at your domain, https://letsencrypt.org/ will do)


Contacts
--------

#. Open the settings application.
#. Select Passwords and Accounts.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CardDAV account.
#. For server, type the domain name of your server i.e. ``example.com``
#. Enter your user name and password.
#. Select Next.

You should now find your contacts in the address book of your iPhone.

.. note:: Beginning with iOS 12 an SSL encryption is necessary. Therefore do **not** disable **SSL**
  (For this reason a certificate is required at your domain, https://letsencrypt.org/ will do)


If it's still not working, have a look at the `Troubleshooting Contacts & Calendar`_
guide.

.. _Troubleshooting Contacts & Calendar: https://docs.nextcloud.org/server/stable/admin_manual/issues/index.html#troubleshooting-contacts-calendar
.. TODO ON RELEASE: Update version number above on release
