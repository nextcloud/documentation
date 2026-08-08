=============
Deleted files
=============

When you delete a file or folder in Nextcloud, it is normally moved to the
trash bin instead of being deleted immediately. This allows you to restore it
later.

Items in the trash bin are permanently deleted when one of the following
occurs:

- You manually select *Delete permanently*.
- The Deleted Files app removes the item according to the configured retention
  policy.
- The effective trash-bin size limit is exceeded and the item is eligible for
  removal to free space.

Find your deleted files by selecting **Deleted files** in the Files area of the
Nextcloud Web interface. From there, you can restore items, download them to
your device, or delete them permanently.

When you restore an item, Nextcloud normally attempts to return it to its
original location. If that location no longer exists or is not writable, the
item is restored to the root of your Files area. If an item with the same name
already exists, Nextcloud gives the restored item a unique name.

.. note:: If the Versions app is enabled, versions associated with a deleted
   file are moved to the trash bin and are restored when the file is restored.

Quotas
------

Files and folders in your trash bin do not count against your normal storage
quota.

See :doc:`quota` for more information about how storage quotas are calculated.

What happens when shared files are deleted
------------------------------------------

The behavior of deleted shared files depends on who deletes the item and who
owns it.

For example, User1 shares a folder named ``TheProject/`` with User2 and User3:

1. User2, a share recipient (sharee), deletes a folder or file named
   ``Phase2`` inside ``TheProject/``.

   ``TheProject/Phase2`` is moved to the trash bin of User1, the owner, and a
   copy is placed in User2's trash bin when possible. The item is removed from
   the shared folder for User3, but User3 does not receive a copy in their
   trash bin.

2. User1, the owner, deletes ``TheProject/Phase2``.

   The item is moved to User1's trash bin and removed from the shared folder for
   User2 and User3. It is not placed in their trash bins.

The exact behavior can depend on the type of share and the permissions granted
by the share. Depending on those permissions, other users may be able to copy,
rename, move, or re-share shared files. These operations can affect which
account owns the resulting files and which trash bin receives a deleted item.

.. note::

   When a sharee deletes an item owned by another user, Nextcloud moves the item
   to the owner's trash bin. A copy in the deleting user's trash bin is also
   created (in most cases; the copy is on a best-effort basis and is not
   guaranteed).

How the Deleted Files app manages storage space
------------------------------------------------

The Deleted Files app manages trash-bin contents using two related rules:

- A storage limit determines how much space the trash bin may use.
- A retention policy determines when deleted items become eligible for
  permanent deletion.

Trash-bin storage limit
~~~~~~~~~~~~~~~~~~~~~~~

For accounts with a storage quota, the default trash-bin limit is up to 50% of
the account's remaining quota space. This is calculated after the account's
active files have been taken into account; it is not 50% of the account's total
quota.

For example, if your quota is 10 GB and your active files use 8 GB, the default
trash-bin allowance is calculated from the remaining 2 GB.

For accounts without a storage quota, the default limit is calculated using
available filesystem space instead. Your administrator can override either
default by configuring a global or per-account trash-bin size.

When the effective trash-bin limit is exceeded, Nextcloud removes eligible
deleted items, starting with the oldest items, until the limit is satisfied
again.

Retention and permanent deletion
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default, deleted files are retained for at least 30 days. After that,
eligible items may be permanently deleted when space is needed; they are not
necessarily deleted immediately after 30 days.

Your administrator can configure different minimum and maximum retention
periods. Depending on the configuration, items may be permanently deleted
after a maximum age even when storage space is not currently needed. Automatic
expiration can also be disabled.

For policies with a configured minimum retention period, an item is eligible
for space-based cleanup only after that period has elapsed. Policies without a
minimum retention period may allow space-based cleanup regardless of the
item's age. Items that have exceeded a configured maximum retention period can
be permanently deleted regardless of whether space is currently needed.

The relevant configuration setting is
``trashbin_retention_obligation``. For details about the available values and
their interaction with quotas and trash-bin sizes, see the
:doc:`Deleted Files <../../admin_manual/configuration_files/trashbin_configuration>`
section in the Administrator Manual.

.. note::

   The Deleted Files app may permanently delete an item before its maximum
   retention period when the effective trash-bin limit is exceeded and the
   item's minimum retention period has elapsed.
