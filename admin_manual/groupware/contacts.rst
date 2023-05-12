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

The address book is updated automatically with every added, modified, disabled or removed user. Admins can also trigger a full rewrite of the address book :ref:`with occ<occ-dav-sync-system-address-book>`.
