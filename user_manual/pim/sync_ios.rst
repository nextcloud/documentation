======================
Synchronizing with iOS
======================

Calendar
--------

#. Open the settings application.
#. Select Passwords and Accounts.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CalDAV account.
#. For server, type ``example.com``
#. Enter your user name and password.
#. Select Next.

Your calendar will now be visible in the Calendar application

Beginning with iOS 12 an SSL encryption is necessary. Therefore do not disable SSL <br/> 
(For this reason a certificate is required at your domain, https://letsencrypt.org/ will do)



Contacts
--------

#. Open the settings application.
#. Select Passwords and Accounts.
#. Select Add Account.
#. Select Other as account type.
#. Select Add CardDAV account.
#. For server, type ``example.com``
#. Enter your user name and password.
#. Select Next.


You should now find your contacts in the address book of your iPhone.

Beginning with iOS 12 an SSL encryption is necessary. Therefore do not disable SSL  <br/>
(For this reason a certificate is required at your domain, https://letsencrypt.org/ will do).<br/> 
If it's still not working, have a look at the `Troubleshooting Contacts & Calendar`_
guide.

.. _Troubleshooting Contacts & Calendar: https://docs.nextcloud.org/server/14/admin_manual/issues/index.html#troubleshooting-contacts-calendar
.. TODO ON RELEASE: Update version number above on release
