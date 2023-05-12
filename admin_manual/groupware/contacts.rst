==================
Contacts / CardDAV
==================

Nextcloud ships a CardDAV backend for users to store and share their address books and contacts.

.. _system-address-book:

System Address Book
-------------------

Nextcloud maintains a read-only address book containing contact information of all users of the instance.

Disabled users are removed from this address book.

Address Book Sync
^^^^^^^^^^^^^^^^^

The address book is updated automatically with every added, modified, disabled or removed user. Admins can also trigger a full rewrite of the address book :ref:`with occ<occ-dav-sync-system-address-book>`.
