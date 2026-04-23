==================
Contacts / CardDAV
==================

Nextcloud ships a CardDAV backend for users to store and share their address books and contacts.

.. _system-address-book:

System Address Book
-------------------

.. versionchanged:: 27
    The system address book is now accessible to all Nextcloud users

Nextcloud maintains a read-only address book containing contact information of all users of the instance.

Disabled users are removed from this address book.

You can disable or enable access to the system address book by using the administration interface or with a command line command.

Please note that this does not influence :ref:`Federated sharing<label-direct-share-link>`.

Command Line
^^^^^^^^^^^^

Run ``occ config:app:set dav system_addressbook_exposed --value="no"`` to disable access to the system address book for all users.

Administration interface
^^^^^^^^^^^^^^^^^^^^^^^^

Navigate to *Administration Settings* -> *Groupware* -> *System Address Book* section and toggle the *Enable system address book* option.


.. warning:: If clients have already connected to the CalDAV endpoint, the clients might experience sync issues after system address book access was disabled. This can often be remedied by choosing a different default address book on the client and forcing a resync.

Privacy and User Property Scopes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Contact information in the system address book is taken from users' :ref:`profile information<profile>`. Profile properties are only written to the system contact if the :ref:`scope<profile-property-scopes>` is set to *Local* or higher.

Users who set all their property scopes to *Private* are removed from the system address book and therefore not seen by other users.

:ref:`File sharing settings<file-sharing-configuration>` controls the enumeration of other users.

* If username autocompletion is not allowed, the system address book will only show user's own system contact but no other contacts.
* If username autocompletion is allowed, users will see contact cards for all other users.

  * If autocompletion is limited to users within the same groups, users will see contact cards for other users in shared groups.
  * If autocompletion is limited to matching phone numbers, the system address book will only show user's own system contact but no other contacts.
  * If autocompletion is limited to users within the same groups **and** matching phone numbers, users will see contact cards for other users in shared groups.

Address Book Sync
^^^^^^^^^^^^^^^^^

The address book is updated automatically with every added, modified, disabled or removed user. Admins can also trigger a full rewrite of the address book :ref:`with occ<dav-sync-system-address-book>`.

Shared items
------------

.. versionadded:: 5.5.0

For this feature, the shipped `related resources app <https://apps.nextcloud.com/apps/related_resources>`_ needs to be enabled.

Rate limits
-----------

Nextcloud rate limits the creation of address books and how many can be created in a short period of time. The default is 10 address books per hour. This can be customized as follows::

  # Set limit to 15 items per 30 minutes
  sudo -E -u www-data php occ config:app:set dav rateLimitAddressBookCreation --type=integer --value=15
  sudo -E -u www-data php occ config:app:set dav rateLimitPeriodAddressBookCreation --type=integer --value=1800

Additionally, the maximum number of address books a user may create is limited to 10 items. This can be customized too::

  # Allow users to create 50 addressbooks
  sudo -E -u www-data php occ config:app:set dav maximumAdressbooks --type=integer --value=50

or::

  # Allow users to create address books without restriction
  sudo -E -u www-data php occ config:app:set dav maximumAdressbooks --type=integer --value=-1

Example contact
---------------

.. versionadded:: 32.0.0

When a user logs in for the first time an example contact is created in the user's address book.

To disable the example contact feature:

1. Navigate to the Groupware settings in the admin settings.
2. Scroll down to the "Example content" section.
3. Disable the "Add example contact ..." setting with the checkbox

If you want to set a specific contact that should be created.

4. Press the "Import contact" button.
5. Choose a vCard file (.vcf) that should be imported as an example contact.

Switching back to the default example contact provided by nextcloud is possible by pressing the
"Reset to default" button next to the import button.

.. _carddav-data-retention:

Data retention
--------------

.. versionadded:: 26.0.0

You can configure how long Nextcloud keeps some of the contacts sync tokens.

Sync tokens
^^^^^^^^^^^

The CardDAV backend keeps track of any modifications of address books. That is anything added, modified or removed. The data is used for differential synchronization of offline clients like Thunderbird. At a certain point in time, the data can be considered outdated assuming there will be no more client needing it. This can help keep the database table `addressbookchanges` small::

  sudo -E -u www-data php occ config:app:set totalNumberOfSyncTokensToKeep --value=30000

The default is keeping 10,000 entries. This option should be set adequate to the number of users. E.g. on an installation with 5000 active synced addressbooks the system would only keep an average of 10 changes per sync. This will lead to premature data deletion and synchronization problems.

.. warning:: This setting will also influence :ref:`CalDAV data retention<caldav-data-retention>`.
