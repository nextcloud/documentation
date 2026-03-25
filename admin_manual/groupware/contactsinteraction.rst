=====================
Contacts Interaction
=====================

The Contacts Interaction app automatically tracks which people a user has recently interacted with
and provides this data as a read-only CardDAV address book called **Recently contacted**. This
enables autocomplete suggestions in sharing dialogs, email composition, calendar invitations and
other places that query the user's address books — even for people who are not saved as explicit
contacts.

The app is shipped with Nextcloud and enabled by default. It can be disabled.

How interactions are tracked
----------------------------

The app listens for ``ContactInteractedWithEvent`` events dispatched by other Nextcloud apps. The
following apps dispatch this event:

* **File sharing**: When a user creates a share with another local user, an email address or a
  federated remote user.
* **Calendar**: When a user shares a calendar with another user.
* **Mail**: When a user sends an email.

Any app can integrate by dispatching a ``ContactInteractedWithEvent`` with at least one identifier:
a Nextcloud user ID, an email address or a federated cloud ID.

When an interaction is recorded, the app first checks whether the contacted person already exists in
one of the user's regular address books. If a match is found, no entry is created in the recently
contacted address book since the person is already a known contact. Self-interactions (where the
user interacts with themselves) are also ignored.

For new contacts, a minimal vCard is generated containing:

* ``FN`` (display name): Resolved from the Nextcloud user profile if the person is a local user,
  falling back to the email address or federated cloud ID.
* ``EMAIL``: Included when an email address is known.
* ``CLOUD``: Included when a federated cloud ID is known.
* ``CATEGORIES``: Set to ``Recently contacted``, which allows the Contacts app to identify entries
  from this address book and offer users the option to copy them to a regular address book.

If the same person is contacted again, the existing entry's timestamp is updated rather than
creating a duplicate.

The recently contacted address book
------------------------------------

Each user's recently contacted address book is accessible via CardDAV at::

    /remote.php/dav/addressbooks/users/{userId}/z-app-generated--contactsinteraction--recent/

The ``z-app-generated`` prefix ensures the address book sorts after user-created address books. Users
cannot create their own address books with this reserved prefix.

The address book is **read-only** and **not shareable**. Users cannot create, modify or delete
entries. Entries are only removed automatically by the cleanup job or when a user account is deleted.

The address book is visible in:

* **CardDAV clients**: Any client syncing with the user's Nextcloud (e.g., Thunderbird, macOS
  Contacts, DAVx5) will see the address book.
* **Nextcloud Contacts**: The address book and its entries appear in the Contacts UI if the
  Contacts app is enabled. Contacts from this address book can be copied to a regular address book.
* **Autocomplete**: Entries are available for recipient suggestions in sharing dialogs and other
  places across the Nextcloud web interface.

Data retention
--------------

A background job runs every 24 hours and removes entries that have not been updated within the last
7 days. Both the retention period and the cleanup interval are fixed and cannot be configured.

.. note::

    The cleanup job depends on the Nextcloud background job system. Make sure cron is configured
    correctly for your instance. See :doc:`../configuration_server/background_jobs_configuration`.

User deletion
-------------

When a user account is deleted, all of that user's recently contacted entries are automatically
removed from the database.
