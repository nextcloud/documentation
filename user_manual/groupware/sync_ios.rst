======================
Synchronizing with iOS
======================

Calendar
--------

#. Open the settings application.
#. Select Apps.
#. Select Calendar.
#. Select Calendar Accounts.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CalDAV account.
#. For server, type the domain name of your server i.e. ``example.com``.
#. Enter your user name and password.
#. Select Next.
#. Open Advanced Settings
#. For server, type the domain name of your server and username, i.e., ``example.com/remote.php/dav/principals/users/username/``.
#. Close Advanced Settings

Your calendar will now be visible in the Calendar application.

.. note:: If you get an error message related to SSL, you can try the following: Make sure that you
   either specify both the protocol (``https://``) and the port (usually ``443``) in the ``Server`` field,
   i.e., ``https://example.com:443/remote.php/dav/principals/users/username/``,
   or none, like in the step-by-step guide above. Either way, the application automatically tries to use SSL,
   which you can confirm in  “Advanced Settings” of the account after saving.   

.. note:: Beginning with iOS 12 an SSL encryption is necessary. Therefore do **not** disable **SSL**
  (For this reason a certificate is required at your domain, https://letsencrypt.org/ will do).


Contacts
--------

#. Open the settings application.
#. Select Apps.
#. Select Contacts.
#. Select Contacts Accounts.
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
