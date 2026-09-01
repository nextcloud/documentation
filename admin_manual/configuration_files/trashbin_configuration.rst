=============
Deleted Files
=============

Introduction
------------

When a file or folder is deleted, Nextcloud normally moves it to the trash bin
instead of deleting it immediately. This allows the item to be restored later.

Items in the trash bin are permanently deleted when one of the following occurs:

- The account owner selects *Delete permanently*.
- The configured retention policy expires the item.
- The effective trash-bin size limit is exceeded and the item is eligible for
  removal to free space.

Logged-in accounts can access their trash bin by selecting *Deleted files* in
the **Files** area of the Nextcloud Web interface. Items in the trash bin can
be restored, downloaded, or permanently deleted.

For information about using the trash bin as an account holder, see the
`Deleted files <https://docs.nextcloud.com/server/latest/user_manual/en/files/deleted_file_management.html>`_
section of the User Manual.

.. note:: If the *Versions* app is enabled, versions associated with a deleted
   file are moved to the trash bin and are restored when the file is restored.

When a file is restored, Nextcloud attempts to restore it to its original
location. If that location no longer exists or is not writable, the file is
restored to the account's files root. If a file with the same name already
exists, the restored file receives a unique name.

This functionality is provided by the *Deleted files* app, whose application
ID is ``files_trashbin``. The app provides:

- The web interface for viewing, restoring, downloading, and permanently
  deleting items.
- The trash-bin filesystem integration.
- Automatic expiration through a background job.
- The ``trashbin:size``, ``trashbin:expire``, ``trashbin:cleanup``, and
  ``trashbin:restore`` commands.

Policy Configuration
--------------------

The ``files_trashbin`` app uses two related mechanisms to determine when items
are permanently deleted:

- A time-based retention policy configured with
  ``trashbin_retention_obligation``.
- An effective trash-bin size limit, configured explicitly or calculated from
  the account's available space.

The default retention policy is ``auto``. In the default configuration, items
are retained for at least 30 days. After that minimum retention period, eligible
items may be permanently deleted when space is needed.

The default effective trash-bin size is calculated as follows:

- For an account with a quota, the trash bin may use up to 50% of the
  account's remaining quota space.
- For an account without a quota, the trash bin may use the available
  filesystem space.
- If an explicit global or per-account trash-bin size is configured, that
  value overrides the calculated default.

The 50% calculation is based on the account's **remaining** quota space, not
the account's total quota. For example, if an account has a 10 GB quota and is
already using 8 GB, the default trash-bin allowance is calculated from the
remaining 2 GB.

When the effective trash-bin limit is exceeded, Nextcloud processes the oldest
items first. An item can be removed to free space only when it is eligible
under the configured retention policy.

The global retention policy is configured with the
``trashbin_retention_obligation`` setting in ``config/config.php``:

.. code-block:: php

   'trashbin_retention_obligation' => 'auto',

Available retention policy values are described below. ``D1`` and ``D2`` are
numbers of days.

``auto``
   The default policy. This is equivalent to ``auto, auto``.

   Files and folders are retained for at least 30 days. After 30 days, they may
   be permanently deleted when space is needed.

``D1, auto``
   Files and folders are retained for at least ``D1`` days. After that, they
   may be permanently deleted when space is needed.

``auto, D2``
   Files and folders may be permanently deleted when space is needed,
   regardless of age. In addition, all items older than ``D2`` days are
   permanently deleted automatically, even when space is not currently needed.

``D1, D2``
   Files and folders are retained for at least ``D1`` days. Items older than
   ``D2`` days are permanently deleted automatically.

   If the effective trash-bin size is exceeded, items older than ``D1`` days
   may also be deleted early to free space, oldest first. Items younger than
   ``D1`` days are protected from size-based cleanup.

   Items older than ``D2`` days are deleted automatically even when space is
   not currently needed. If ``D2`` is smaller than ``D1``, Nextcloud adjusts
   the effective maximum retention period to ``D1``.

``disabled``
   Automatic trash-bin expiration is disabled. Files and folders remain in the
   trash bin until they are manually deleted or another operation removes them.

A single numeric value is also accepted. The value is used as the minimum
retention period, while the default maximum retention period is 30 days. If
the resulting maximum period would be shorter than the minimum period, the
maximum is raised to match the minimum.

For example, ``10`` is equivalent to ``10, 30``: items are retained for at
least 10 days and are automatically deleted once they exceed 30 days. By
contrast, ``45`` is equivalent to ``45, 45``, because the default maximum
of 30 days is shorter than the 45-day minimum and is therefore raised to
match it.

.. note::

   Unlike ``auto``, ``D1, auto``, and ``auto, D2``, this form (including a
   bare numeric value) disables purely space-triggered cleanup of the trash
   bin. Items may still be removed early if the trash-bin size limit is
   exceeded, but only once they are older than the minimum retention period
   (``D1``).

For clarity, use the explicit ``D1, D2`` form when configuring a numeric
retention policy.

Trash-bin Size Limits
---------------------

The ``trashbin:size`` command configures or displays the effective trash-bin
size.

To display the global default and any per-account values:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:size

To configure a global trash-bin size:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:size 10G

To configure a size for a specific account:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:size --user USER_ID 10G

The ``size`` argument accepts values understood by Nextcloud's file-size
parser, such as ``500M`` or ``10G``.

A per-account value takes precedence over the global value. If no per-account
value is configured, the account uses the global value. If neither value is
configured, Nextcloud uses the calculated default based on the account's
remaining quota space or available filesystem space.

To display the configured value for one account:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:size --user USER_ID

Changing a per-account size schedules cleanup for that account. Changing the
global size causes existing trash bins to be cleaned up, although an account's
trash bin can temporarily exceed the newly configured size until cleanup is
performed or another item is moved to the trash bin.

Interaction with Quotas
~~~~~~~~~~~~~~~~~~~~~~~

An explicit trash-bin size is independent of the account quota. It can
therefore be used for accounts both with and without quotas.

For accounts with quotas, the following order applies:

#. A per-account ``trashbin_size`` value is used when configured.
#. Otherwise, the global ``files_trashbin`` ``trashbin_size`` value is used
   when configured.
#. Otherwise, the default limit is calculated from 50% of the account's
   remaining quota space.

When no explicit trash-bin size is configured for an account without a quota,
the available filesystem space is used to determine whether the trash bin
needs cleanup.

Trash-bin cleanup does not necessarily remove all deleted files when an
account exceeds its quota. Items are removed according to the retention policy
and in oldest-first order until the effective trash-bin space requirement is
satisfied.

Background Jobs
---------------

The ``files_trashbin`` app registers a background job for policies with a
configured maximum retention age, such as ``auto, D2`` and ``D1, D2``. The job
runs at a 30-minute interval, processes accounts in batches of 10, and runs
for no more than 30 minutes per invocation.

For the default ``auto`` policy and other policies without a configured
maximum retention age, the background job does not perform an expiration pass.
For ``disabled``, automatic expiration is disabled.

Space-based cleanup can instead be scheduled when trash-bin usage or available
space changes.

The background job is controlled by the ``files_trashbin`` app configuration
value ``background_job_expire_trash``. It is enabled by default.

To disable the background job:

.. code-block:: console

   sudo -E -u www-data php occ config:app:set \
      --value=no files_trashbin background_job_expire_trash

To re-enable it, remove the override:

.. code-block:: console

   sudo -E -u www-data php occ config:app:delete \
      files_trashbin background_job_expire_trash

When the background job is disabled, administrators can run expiration
manually with ``occ trashbin:expire`` or configure an external system task to
run that command.

Other Commands
--------------

The below operations are useful under certain circumstances, but do not typically
need to be used directly.

Expiring Items Manually
~~~~~~~~~~~~~~~~~~~~~~~

To expire eligible items for all accounts:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:expire

To expire eligible items for one or more accounts:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:expire USER_ID

.. code-block:: console

   sudo -E -u www-data php occ trashbin:expire USER_ID_1 USER_ID_2

When no account IDs are provided, the command automatically discovers accounts
that have previously logged in. This normally covers all accounts that can have
trash-bin contents. For an account with imported or otherwise provisioned
trash-bin data but no recorded login, provide its account ID explicitly.

The command displays a progress bar when processing all accounts. Use
``--quiet`` to suppress the progress bar:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:expire --quiet

For any active retention policy, including the default ``auto`` policy,
``trashbin:expire`` performs a full expiration pass: it deletes items that
exceed the configured maximum age, and it also deletes items to satisfy the
effective trash-bin size limit when needed, subject to the retention
policy's minimum age.

If trash-bin expiration is disabled (``trashbin_retention_obligation`` set
to ``disabled``), ``trashbin:expire`` does not delete any items and exits
with a non-zero status.

Space-based cleanup can also be triggered automatically outside of
``trashbin:expire`` and the background job — for example, when a file is
moved to the trash bin or when a change to the account's available space
causes the effective trash-bin limit to be exceeded.

The trash-bin expiration command is provided by the
``files_trashbin`` app:

.. code-block:: console

   sudo -E -u www-data php occ list files_trashbin

Removing All Trashed Items
~~~~~~~~~~~~~~~~~~~~~~~~~~

To immediately and permanently delete **all** trashed items for all users
from all configured user backends, bypassing the retention policy entirely,
use ``trashbin:cleanup --all-users``:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:cleanup --all-users

To clean up the trash bin for one or more specific accounts:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:cleanup USER_ID_1 USER_ID_2

The command requires either one or more account IDs or ``--all-users``.
These forms are mutually exclusive.

.. danger::

   This command deletes trashed items unconditionally and does not honor
   the configured retention policy. Deleted items cannot be recovered.

Restoring All Trashed Items
~~~~~~~~~~~~~~~~~~~~~~~~~~~

To restore all trashed items for one or more accounts:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:restore USER_ID_1 USER_ID_2

To restore trashed items for all users from all configured user backends:

.. code-block:: console

   sudo -E -u www-data php occ trashbin:restore --all-users

Account IDs and ``--all-users`` are mutually exclusive. The command requires
one or the other.

The command supports additional filters, including ``--since``, ``--until``,
and ``--scope`` (``user``, ``groupfolders``, or ``all``), as well as
``--dry-run`` to preview which items would be restored without performing any
action. See ``occ trashbin:restore --help`` for details.
