=======================
Upgrade to Nextcloud 35
=======================

This is **not** an exhaustive list of changes, including numerous new features, but only a summary of key operational related changes relevant to those upgrading from a previous major version of Nextcloud.

System requirements
-------------------

There have been changes to supported PHP, operating systems, and database versions:

**PHP**

* PHP 8.2 is no longer supported. PHP 8.3 is now the minimum supported version.
* PHP 8.6 and newer are not supported yet.

**Operating Systems**

The list of officially supported operating systems has been updated:

* The minimum supported version of *SUSE Linux Enterprise Server 15* has been bumped to SP7.
* The minimum supported version of *Debian Linux* has been bumped to *13 (Trixie)*.
* The minimum supported version of *Ubuntu Linux* has been bumped to *24.04*.

**Databases**

The list of officially supported databases has been updated:

- MariaDB 10.6 is out of support and thus Nextcloud dropped support for it. The minimum supported version of MariaDB is now 10.11 LTS.
- MariaDB 12.3 is released as a new LTS version and is now supported by Nextcloud.
- MySQL 8.0 is out of support and thus Nextcloud dropped support for it. The minimum supported version of MySQL is now 8.4 LTS.
- MySQL 9.7 is released as a new LTS version and is now supported by Nextcloud.

32-bit systems
--------------

32-bit systems are no longer a recommended platform for Nextcloud. The
administrator warning for 32-bit installations has been strengthened.

Plan migration to a 64-bit operating system and PHP environment. Support for
32-bit systems is scheduled for removal in a future major release.

Behavior Changes
----------------

MySQL 9 and MD5 support
-----------------------

MySQL 9 no longer provides MD5 by default. Nextcloud still has limited
internal uses of MD5, so installations using MySQL 9 or newer must ensure that
the ``component_classic_hashing`` component is available.

For existing installations, verify this before upgrading the database server.

.. tip:: 
    Make sure that after upgrading an existing installation to to MySQL 9+,
    the MySQL component for MD5 support gets loaded. To do so, run this on
    your MySQL 9+ server::

       INSTALL COMPONENT 'file://component_classic_hashing';

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

Applications incompatible with this release
-------------------------------------------

This is mostly only relevant to developers and those that live on the bleeding
edge: When using the ``git`` update channel, the updater now ignores applications
that are incompatible with Nextcloud 35 instead of allowing them to block the
server update.

After upgrading, review the list of disabled or incompatible applications and
install compatible versions where available. Do not assume that an apparently
successful server upgrade means that every previously enabled application is
still available. And refer to the Nextcloud / server logs if your installation
appears broken after a major upgrade.

See :doc:`../configuration_server/apps_management` for more information.

Federation HTTP signatures
--------------------------

Nextcloud 35 supports RFC 9421 HTTP Message Signatures for federated
communication while retaining compatibility with the older HTTP signature
format.

If you operate federation or OCM integrations, review the federation signing
key configuration and key-rotation procedures before upgrading. Do not remove
legacy OCM discovery fields until all federation peers support RFC 9421.

See :doc:`../configuration_server/federated_cloud_share` for more information.

OCM discovery compatibility
^^^^^^^^^^^^^^^^^^^^^^^^^^^

For compatibility with older federated peers, the following options remain
disabled by default:

* ``sharing.federation.ocm.apiVersion``
* ``sharing.federation.ocm.removePublicKey``

Do not enable ``sharing.federation.ocm.removePublicKey`` until all federated
peers support RFC 9421 HTTP Message Signatures. Leave
``sharing.federation.ocm.apiVersion`` empty unless the compatibility of all
federated peers has been verified.

Deprecated external-storage backends
-------------------------------------

Deprecated external-storage backends are ignored by Nextcloud 35. If an
existing external-storage mount disappears after upgrading, check whether it
uses a deprecated backend and migrate it to a supported backend.

Review external-storage configuration and the server log after upgrading if
mounts are unexpectedly unavailable.

Unified Sharing API
-------------------

Nextcloud 35 introduces a system configuration option that can disable the
Unified Sharing API:

``sharing.unified_api_enable``

When the Unified Sharing API is disabled, requests to endpoints using it return
HTTP 501 (``Not Implemented``). Review this setting if you use applications or
integrations that depend on the new sharing API.

The option is currently disabled unless explicitly enabled. Keep it disabled
unless the applications and integrations used by your instance require it.

Sharing migration
-----------------

Nextcloud 35 includes database migrations for the sharing subsystem, including
support for per-recipient permissions and additional share metadata. Plan
sufficient maintenance time for the upgrade on instances with a large number
of shares and ensure that the database backup is current before upgrading.

Snowflake server ID
-------------------

Nextcloud 35 uses Snowflake IDs for some objects and background-job records.

If your installation has multiple PHP or web servers sharing the same
configuration and database, configure a unique, stable ``serverid`` for each
server. The value must be an integer between ``0`` and ``511`` and must not be
changed after it has been assigned.

When ``config.php`` is shared between servers, override the value independently
for each web and CLI environment, for example:

``NC_serverid=42 occ config:list system``

Make sure the override is also applied to web requests. Single-server
installations can generally use the fallback behavior, although the setup
checks may recommend configuring an explicit server ID.

Share password generation
-------------------------

Automatically generated share passwords now follow the sharing password
policy. If your instance enforces longer passwords or special-character
requirements for shares, generated passwords may appear different after the
upgrade.

Added Functionality
-------------------

Custom login names for generated app passwords
-----------------------------------------------

``occ user:add-app-password`` can now assign a custom login name to a generated
app password. This can be useful when provisioning CalDAV or CardDAV clients
that expect an email address as the login name.

Database schema verification
----------------------------

Nextcloud 35 adds a database schema consistency check:

``occ db:schema:check``

The check compares the current database schema with the schema expected by
Nextcloud and is also included in the post-upgrade checks.

If the check reports differences after an upgrade, review the migration output
and logs before returning the instance to normal operation. Do not manually
modify the database schema unless instructed by Nextcloud documentation or
support.

New database diagnostic commands
--------------------------------

These are valuable for troubleshooting:

* ``occ db:info``
* ``occ db:size``
* ``occ db:index-usage``
* ``occ db:locks``

Controlling file-version creation with workflows
-------------------------------------------------

The workflow engine can now prevent new file versions from being created when
configured conditions match. This can be used for compliance or storage-policy
scenarios.

Review existing workflow rules after upgrading if your instance uses workflows
to control file lifecycle behavior.

Database SSL/TLS configuration during installation
--------------------------------------------------

The command-line and web installers now support configuring encrypted database
connections.

For PostgreSQL, SSL mode, CA, client certificate, client key, and certificate
revocation-list options can be provided during installation. MySQL/MariaDB
installations can provide CA and client certificate options through the
installer as well.

Existing installations do not need to change their database configuration.

Background job diagnostics
--------------------------

Nextcloud 35 adds commands for inspecting configured background jobs and
historical job executions:

* ``occ background-job:list``
* ``occ background-job:history``

The history output includes the job status, class, start time, server ID,
process ID, duration, and peak memory usage. This can help identify failed or
slow jobs and determine which server executed a job.

Running ``occ`` as root
-----------------------

When ``occ`` is invoked as root, it attempts to switch to the owner of
``config/config.php`` before executing the command.

Check the ownership of ``config/config.php`` and ensure that its owner has the
permissions required by the command. This privilege switch is best-effort and
is not a complete security sandbox.

Redis and Valkey cache support
------------------------------

Nextcloud 35 adds a pure-PHP Redis-compatible cache implementation based on
Predis. This can be used where the PHP Redis extension is unavailable and
improves compatibility with recent Redis and Valkey releases.

Review the cache configuration documentation before changing an existing
production cache backend.
