=======================
Upgrade to Nextcloud 35
=======================

This is **not** an exhaustive list of changes or new features. It contains
only a summary of key operational related changes relevant to those upgrading
from a previous major version of Nextcloud.

System requirements
-------------------

There have been changes to supported PHP, operating systems, and database versions:

**PHP**

- PHP 8.2 is no longer supported.
- PHP 8.3 is now the minimum supported version.

.. warning::
   PHP 8.6 is still in beta as of the first release of Nextcloud 35.
   It will not be supported by Nextcloud until Nextcloud 36 or later.

**Operating Systems**

- The minimum supported version of *SUSE Linux Enterprise Server 15* has
  been bumped to SP7.
- The minimum supported version of *Debian Linux* has been bumped to
  *13 (Trixie)*.
- The minimum supported version of *Ubuntu Linux* has been bumped to
  *24.04*.

**Databases**

The list of officially supported databases has been updated:

- MariaDB 10.6 is out of support and thus Nextcloud dropped support for it.
- The minimum supported version of MariaDB is now 10.11 LTS.
- MariaDB 12.3 is released as a new LTS version; it is now supported.
- MySQL 8.0 is out of support and thus Nextcloud dropped support for it.
- The minimum supported version of MySQL is now 8.4 LTS.
- MySQL 9.7 is released as a new LTS version; it is now supported.

MySQL 9 and MD5 support
~~~~~~~~~~~~~~~~~~~~~~~

MySQL 9 no longer provides MD5 by default. Nextcloud still has limited
internal uses of MD5, so installations using MySQL 9 or newer must ensure
that the ``component_classic_hashing`` component is available.

For existing installations, verify this before upgrading the database server.

.. note::
   Make sure that after upgrading an existing installation to MySQL 9+,
   the MySQL component for MD5 support gets loaded. To do so, run this on
   your MySQL 9+ server::

      INSTALL COMPONENT 'file://component_classic_hashing';

32-bit systems
~~~~~~~~~~~~~~

32-bit systems are no longer a recommended platform for Nextcloud. The
administrator warning for 32-bit installations has been strengthened.

Plan migration to a 64-bit operating system and PHP environment. Support for
32-bit systems is scheduled for removal in a future major release.

SQLite foreign-key enforcement
------------------------------

SQLite installations now enforce foreign-key constraints more consistently.
Direct writes to the Nextcloud SQLite database and third-party maintenance
scripts that create invalid references may fail after upgrading.

Administrators using custom database tooling should verify that it preserves
referential integrity. Direct modification of the Nextcloud database is not
supported.

ownCloud database migrations
-----------------------------

The migration code has improved compatibility with older ownCloud database
schemas. During an ownCloud-to-Nextcloud migration, Nextcloud can now
temporarily operate with the older ``appconfig`` and ``preferences`` column
sets until the required Nextcloud schema migrations have run.

Administrators performing an ownCloud migration should still make a complete
database backup and monitor the migration output for errors.

App compatibility
-----------------

When upgrading across a major version, Nextcloud clears the
``app_install_overwrite`` configuration.

Apps that were force-enabled on the previous major version and are still
incompatible with Nextcloud 35 remain disabled. Review the list of disabled
apps after upgrading and explicitly re-enable or force-enable each app only
after confirming that it supports Nextcloud 35.

The setting is retained for minor and patch upgrades.

For installations using the ``git`` update channel, incompatible apps are
ignored by the updater. When a compatible version becomes available through
the App Store, the app can be enabled again.

Review custom apps, locally installed apps, and apps previously installed
through ``app_install_overwrite`` before upgrading.

DAV sync-token retention
------------------------

The CalDAV and CardDAV sync-token cleanup jobs now correctly apply the
configured retention period.

On installations where old sync-token rows have accumulated, cleanup may
remove a larger backlog after upgrading. Make sure background jobs are running
and monitor database activity on instances with large calendar or address-book
tables.

See :ref:`CalDAV retention <caldav-data-retention>` and
:ref:`CardDAV retention <carddav-data-retention>`.

Database migrations and schema verification
--------------------------------------------

Nextcloud 35 includes improvements to migration discovery, ordering, and
idempotency. This includes fixes affecting Sharing, DAV, and TaskProcessing
migrations.

Allow the upgrade to complete fully before returning the instance to normal
operation. Do not interrupt the upgrade while database migrations are
running.

Nextcloud 35 adds the following database schema check:

``occ db:schema:check``

This compares the current database schema with the schema expected by
Nextcloud. The expected schema includes migrations from disabled apps.

The schema check is also performed after ``occ upgrade``. If schema drift is
reported, investigate and resolve it before returning the instance to normal
service. Do not manually modify the database schema without first taking a
verified database backup.

The ``dbdoctor`` app is also shipped with Nextcloud 35. Use it only according
to the database-maintenance documentation and take a verified database backup
before running database repair operations.

The help text for ``occ migrations:migrate`` has also been corrected and
clarified. Use the command-specific help from the installed version rather
than relying on examples from older releases.

.. note::
   Nextcloud 35 beta releases contained a regression affecting prepared
   statement parameter binding. This was fixed before the stable release.
   Installations that tested an early Nextcloud 35 beta should upgrade to the
   final release and rerun database-backed app operations and migrations that
   previously failed.

Unified Sharing
---------------

Nextcloud 35 introduces Unified Sharing, which centralizes sharing behavior
and share properties across supported share types.

Administrators and app developers should review the Unified Sharing
documentation, particularly if the installation uses:

- custom sharing integrations;
- automated share creation;
- share-property validation;
- delegated administration;
- public links;
- email shares;
- federated shares;
- share expiration dates;
- password-protected shares; or
- multiple mounts exposing the same file.

Existing sharing policies should be tested after upgrading.

Per-recipient permissions
~~~~~~~~~~~~~~~~~~~~~~~~~

Unified Sharing supports permissions that differ between recipients of the
same share.

Review automated share-creation workflows and verify that integrations do not
assume that all recipients have identical permissions.

Share expiration dates
~~~~~~~~~~~~~~~~~~~~~~

Required, default, and maximum expiration dates can depend on the recipients
of a share.

Email-share expiration dates are normalized using the server's configured
timezone. This prevents an expiration date selected by a user in another
timezone from being stored or evaluated at an unexpected time.

Password policies also apply to recipients of email shares. When a password is
required, a default password is generated if one was not provided.

Review sharing policies if different recipient types have different password
or expiration requirements.

Share-management permissions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For storage mounts that explicitly support ownerless sharing, users with direct
access to a shared file may be able to view and modify other shares associated
with that file, even when those shares were created by another user.

Review sharing workflows and integrations that assume only the original share
owner can modify all shares for a file.

Multiple mounts
~~~~~~~~~~~~~~~

Share creation and public-link resolution now handle files whose permissions
come from multiple mounts more reliably.

Installations using combinations of group folders, Team folders, external
storage, or other overlapping mounts should test:

- creating shares;
- modifying shares;
- resolving public links;
- downloading through public links; and
- file requests.

Cancelling share customization
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Cancelling share customization now discards all pending changes, including
password, video-verification, expiration-date, download, permission, and
recipient-note changes.

Sharing API protection
~~~~~~~~~~~~~~~~~~~~~~

The Sharing API now applies rate limiting and brute-force protection.

API clients that create or modify shares should handle throttling responses and
avoid retry loops when performing bulk operations.

Nextcloud 35 also provides a kill switch for the Sharing API. This allows
administrators to temporarily disable API-based sharing during incident
response or maintenance.

Consult the Sharing API documentation for the exact configuration option and
review its value if the installation uses API-level sharing.

Share-state filtering
~~~~~~~~~~~~~~~~~~~~~

The Sharing API can filter shares by state. Review integrations that list or
process shares if they assume that every share returned by a listing operation
is active.

Public links and file sharing
-----------------------------

When public link sharing is disabled, direct public-link actions are disabled
as well.

Integrations that create or consume direct public links should handle those
operations being rejected.

Permission masking for public links backed by group folders and other
non-home storage has also been corrected, including legacy v1 public-link
handling.

Administrators using public links or file requests for group folders, external
storage, object storage, or other non-home storage should test those links
after upgrading.

Uploads now fail with HTTP 403 when the request URI does not match the
current session or share token.

Custom WebDAV clients, upload gateways, and reverse proxies that construct
upload URLs manually should be tested after upgrading.

Authentication and security
---------------------------

Nextcloud 35 changes several authentication flows and security checks.

WebAuthn and two-factor authentication
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

WebAuthn credentials that perform user verification can satisfy the
second-factor requirement without requiring a separate 2FA challenge.

Keys without user verification continue to use the usual 2FA challenge.

Review WebAuthn and 2FA policies and test the login behavior of passkeys and
security keys after upgrading.

Password confirmation
~~~~~~~~~~~~~~~~~~~~~~

Password confirmation can be bypassed for selected IP ranges.

Use this setting only for tightly controlled, trusted networks. Do not include
broad or publicly reachable address ranges, and review password-confirmation
and trusted-network settings after upgrading.

Two-factor enforcement and brute-force protection are applied earlier and more
consistently in the login flow.

One-time QR-code login
~~~~~~~~~~~~~~~~~~~~~~

One-time QR-code login works correctly when 2FA is enabled.

Remember-me sessions
~~~~~~~~~~~~~~~~~~~~

Remember-me cookies are validated against the expected user before a session
is restored.

Users can revoke all other sessions and credentials from their security
settings while keeping the current session active. Revoking a credential that
is pending remote wipe cancels that pending wipe.

App-token creation
~~~~~~~~~~~~~~~~~~

``occ user:auth-tokens:add`` now verifies the supplied user password before
creating an app token.

Automation that creates app tokens must provide the correct password and handle
the command failing when the password does not match.

User enumeration
~~~~~~~~~~~~~~~~

User lookup and sharing responses are more consistent when an account or
recipient cannot be resolved. This reduces information that can be used to
enumerate users.

Integrations should not depend on distinguishing nonexistent users from other
lookup or authorization failures unless explicitly documented.

Remember that authentication responses may also be rate-limited or subject to
brute-force protection.

Sensitive configuration output
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

More configuration values and command parameters are classified as sensitive
and are redacted by default.

``occ config:list --private`` may display decrypted sensitive values. Protect
this output and do not include it in logs, screenshots, support bundles, or
publicly accessible diagnostics.

The EuroOffice ``jwt_secret`` app setting is treated as sensitive.

System-tag permissions
~~~~~~~~~~~~~~~~~~~~~~

All system-tag updates now require administrator permissions.

Review applications or automation that rename or otherwise modify system tags.

System-tag object IDs are also filtered according to the requesting user's
visibility. Applications should not assume that object IDs for inaccessible
objects are returned.

Storage and file handling
-------------------------

Object storage and server-side encryption
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Moving files between encrypted and unencrypted folders within the same
object-storage backend is handled safely in Nextcloud 35.

Copying encrypted files also preserves the file-cache encryption-version
metadata.

Administrators using server-side encryption with group folders, external
storage, or object storage should verify that encryption is enabled
consistently wherever required.

Keep a verified backup before performing bulk moves across encryption
boundaries.

S3 external storage
~~~~~~~~~~~~~~~~~~~

S3 and S3-compatible external-storage errors are reported more clearly in the
frontend.

Folder moves now fail visibly when one of the underlying object-copy
operations fails. Previously, some providers that rejected individual
``CopyObject`` operations could cause a move to remove the source after an
incomplete copy.

Administrators using S3-compatible external storage should test folder moves
after upgrading, especially when using server-side encryption or
provider-specific copy limitations.

The ``use_presigned_url`` setting is applied before the first storage
connection is opened. Administrators using presigned URLs should verify
WebDAV ``downloadURL`` properties and public download workflows after
upgrading.

FTP external storage
~~~~~~~~~~~~~~~~~~~~

FTP external-storage port values are validated more strictly. Empty or
non-numeric port values may be rejected.

Review FTP mount configurations and ensure that the port is either omitted
according to the documented default or supplied as a numeric value.

SFTP external storage
~~~~~~~~~~~~~~~~~~~~~

SFTP external storage handles encrypted private keys supplied through the
password field more reliably. The private-key password is cleared after the
key has been loaded.

SFTP uploads now pipeline multiple write packets instead of waiting for each
packet acknowledgement individually. This can significantly improve upload
performance, particularly over high-latency connections.

Review SFTP mounts that use encrypted private keys if they previously failed
to connect or required workarounds.

DAV uploads
~~~~~~~~~~~

Nextcloud 35 improves handling of failed and moved DAV uploads:

- part-file locks are released after failed uploads;
- DAV uploads are finalized correctly when using ``MOVE``;
- write-size detection is derived more strictly from the PUT
  ``Content-Length`` header;
- metadata-encoding failures no longer terminate the upload path
  unnecessarily; and
- missing files encountered while streaming DAV output are handled correctly.

No configuration change is required. Administrators operating DAV clients,
reverse proxies, or upload gateways should test interrupted, resumed, and
moved uploads after upgrading.

Trashbin and quota handling
~~~~~~~~~~~~~~~~~~~~~~~~~~

Restoring a file from the trashbin now checks available space in the
destination folder before completing the restore.

A restore may fail when it would exceed the applicable quota.

When ``trashbin_retention_obligation`` is set to ``disabled``,
``occ trashbin:expire`` reports that automatic expiration is disabled and
exits successfully. The retention policy itself is unchanged.

New ``occ files`` commands
--------------------------

Nextcloud 35 adds the following file-management commands and options:

- ``occ files:mkdir`` creates directories;
- ``occ files:touch`` creates empty files;
- ``occ files:put`` can create missing parent directories; and
- ``occ files:delete`` can optionally bypass the trashbin.

Review automation using these commands, especially deletion scripts that may
need to preserve the previous trashbin behavior.

Background jobs and caching
---------------------------

Background-job workers
~~~~~~~~~~~~~~~~~~~~~~

``occ background-job:worker --stop_after`` now measures the shutdown interval
from the beginning of the worker run rather than resetting the timer for each
job.

Administrators using ``--stop_after`` for controlled worker restarts or
rolling maintenance should find that workers terminate within the requested
interval.

Background-job identifiers
~~~~~~~~~~~~~~~~~~~~~~~~~~

Background-job Snowflake identifiers are preserved and bound as strings.

Integrations must not cast these identifiers to integers. This is particularly
important on 32-bit PHP systems, where large integer values can lose precision.

Review custom integrations for 32-bit compatibility. Avoid converting
Snowflake IDs, share IDs, job IDs, or millisecond timestamps to native
integers.

Redis and Predis
~~~~~~~~~~~~~~~~

The Redis cache backend remains supported in Nextcloud 35.

A pure-PHP Predis-based implementation is also available for deployments where
the PHP Redis extension cannot be installed or does not yet support the
deployed Redis or Valkey version.

Existing Redis configurations do not need to be migrated solely because of
this release.

Cache clearing now uses incremental scanning rather than a blocking ``KEYS``
operation. Redis Cluster is handled correctly, and clearing large caches is
less likely to block the Redis service.

Ensure that the configured Redis account can scan and unlink keys.

Memcached
~~~~~~~~~

Nextcloud 35 enables ``TCP_NODELAY`` for Memcached connections and uses more
suitable default connection and polling timeouts.

No configuration change is normally required. Administrators with custom
Memcached timeout settings should review them if they were added to work
around intermittent cache connection failures.

Team folders
------------

Team folders can expose and manage quotas through the TeamFolder API.

Quota values are expressed in bytes. A value of ``0`` means unlimited, while
``null`` indicates that the active TeamFolder provider does not expose quota
information.

Team folders can also be associated with teams through the Team and
TeamFolder APIs.

Review TeamFolder integrations, quota-management automation, and team-folder
provisioning after upgrading.

LDAP, federation, and OCM
-------------------------

LDAP configuration IDs
~~~~~~~~~~~~~~~~~~~~~~

The LDAP administration API again supports configurations whose configuration
ID is an empty string.

Older LDAP configurations do not need to be renamed manually.

Delegated administration
~~~~~~~~~~~~~~~~~~~~~~~~

Delegated-administrator handling has been tightened.

Delegated administrators can manage only the groups and users within their
permitted scope. They cannot add accounts to the ``admin`` group, and they
cannot edit delegated administrator accounts outside their authority.

Review delegated-administration assignments and any automation that modifies
group memberships.

Stale share recipients
~~~~~~~~~~~~~~~~~~~~~~

Share processing skips recipients that can no longer be resolved instead of
failing the entire share operation.

The unresolved recipient will not receive the share. Administrators should
investigate stale LDAP, Talk, or federated recipient records when this
occurs.

Federated and external shares
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Accepting an external share schedules a scan to synchronize its contents.

Nextcloud avoids adding empty or invalid external-share scan jobs during an
upgrade.

Federated users are identified more accurately in trashbin information,
including the remote user who deleted a file in a federated share.

Administrators may see additional background jobs after accepting external
shares. Review stale or unresolved federated recipients if synchronization or
share attribution appears incomplete.

OCM HTTP Message Signatures
~~~~~~~~~~~~~~~~~~~~~~~~~~

Nextcloud 35 updates OCM HTTP Message Signatures to follow the revised
specification.

The RFC 9421 signature format now:

- does not sign the ``Date`` header;
- uses the OCM ``tag`` parameter;
- requires the ``keyid`` parameter;
- advertises the JWKS endpoint through ``jwksUri`` in discovery; and
- discovers the signing algorithm through the JWKS metadata.

The implementation remains compatible with legacy draft-Cavage peers where
supported. Administrators operating custom federation or OCM implementations
should update and test both sides together.

OCM discovery also respects a provider response indicating that the discovery
result must not be cached.

Audit logging
-------------

Admin-audit logging now records reads of files that have not yet received a
file ID, using ``not-yet-assigned`` as the identifier.

Audit-log processing and downstream parsers should allow for this identifier.

Application configuration type conflicts now identify the affected app
configuration key and both the stored and requested types. If an app reports a
configuration type conflict after upgrading, use the key named in the error
to correct the value or update the app.

Provisioning API
----------------

The Provisioning API now interprets ``newUser.sendEmail`` as a boolean.

Clients should send JSON ``true`` or ``false`` values rather than relying on
string values such as ``"yes"`` or ``"no``.

Use the help output and API documentation from Nextcloud 35 when updating
provisioning automation.

Machine-readable ``occ`` output
-------------------------------

Errors encountered while loading app commands are now written to stderr
rather than stdout.

Commands such as ``occ app:list --output=json`` can therefore be parsed
without diagnostics being mixed into the JSON payload.

Scripts that consume machine-readable ``occ`` output should still handle
non-zero exit statuses and inspect stderr for diagnostics.

Database installation
----------------------

Database SSL/TLS options can now be supplied during command-line, web-based,
and autoconfig installation.

Review automated installation files if the database server requires encrypted
connections.

The installer also handles IPv6 database hosts correctly. Review custom
database-host, proxy, and autoconfig values if the installation uses IPv6
literals or non-standard host formats.

App-store link
--------------

The app-store link shown in the app menu can be configured.

Deployments using a private, mirrored, or restricted app store should verify
that the configured link is still correct after upgrading.

Skeleton and template directories
---------------------------------

The behavior of ``skeletondirectory`` and ``templatedirectory`` is clarified.

Skeleton content is copied during user initialization, while the template
directory is configured independently.

Review custom values if the deployment uses localized skeleton content or
user templates.

Encryption configuration values
-------------------------------

Some server-side encryption app configuration values are migrated from
string-typed values to boolean-typed values during the upgrade.

The migration is performed automatically. Administrators using scripts or
external tooling that reads these app configuration values should ensure that
the tooling handles boolean values rather than relying on the previous string
representation.

Deprecated external-storage backends
-------------------------------------

Deprecated external-storage backends are ignored by Nextcloud 35. If an
existing external-storage mount disappears after upgrading, check whether it
uses a deprecated backend and migrate it to a supported backend.

Review external-storage configuration and the server log after upgrading if
mounts are unexpectedly unavailable.

Post-upgrade checks
-------------------

After the upgrade has completed:

#. Confirm that the instance reports no pending database migrations.
#. Run ``occ db:schema:check`` and investigate any reported schema drift.
#. Review disabled and incompatible apps, especially apps previously listed in
   ``app_install_overwrite``.
#. Review delegated-administrator assignments and group-management behavior.
#. Test login with the configured authentication methods, including WebAuthn,
   2FA, app passwords, and remember-me sessions.
#. Test representative shares, including per-recipient permissions,
   password-protected shares, email shares, expiration dates, public links,
   file requests, and federated shares.
#. Test public links and share creation for files exposed through multiple
   mounts.
#. Test external-storage access and representative copy, move, upload, and
   restore operations.
#. Test S3 folder moves, presigned download URLs, FTP mounts, and SFTP mounts
   if used.
#. Check TeamFolder quotas and team-folder provisioning if used.
#. Check background-job processing and review the logs for storage,
   authentication, migration, or schema errors.
#. Verify that automated scripts consuming ``occ`` JSON output still parse
   stdout correctly and collect diagnostics from stderr.
#. Protect any diagnostic output produced with ``occ config:list --private``.
