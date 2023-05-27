======================
Synchronizing with iOS
======================

Calendar
--------

#. Open the settings application.
#. Select Calendar.
#. Select Accounts.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CalDAV account.
#. For server, type the domain name of your server i.e. ``example.com``.
#. Enter your user name and password.
#. Select Next.

Your calendar will now be visible in the Calendar application.

.. note:: Beginning with iOS 12 an SSL encryption is necessary. Therefore do **not** disable **SSL**
  (For this reason a certificate is required at your domain, https://letsencrypt.org/ will do).


Contacts
--------

#. Open the settings application.
#. Select Contacts.
#. Select Accounts.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CardDAV account.
#. For server, type the domain name of your server i.e. ``example.com``.
#. Enter your user name and password.
#. Select Next.

You should now find your contacts in the address book of your iPhone.

.. note:: Beginning with iOS 12 an SSL encryption is necessary. Therefore do **not** disable **SSL**
  (For this reason a certificate is required at your domain, https://letsencrypt.org/ will do).


If it's still not working, have a look at `Troubleshooting Contacts & Calendar`_ or `Troubleshooting Service Discovery`_.

.. _Troubleshooting Contacts & Calendar: https://docs.nextcloud.com/server/latest/admin_manual/issues/general_troubleshooting.html#troubleshooting-contacts-calendar
.. _Troubleshooting Service Discovery: https://docs.nextcloud.com/server/latest/admin_manual/issues/general_troubleshooting.html#service-discovery

.. TODO ON RELEASE: Update version number above on release
