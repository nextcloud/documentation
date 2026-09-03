=======================
Upgrade to Nextcloud 35
=======================

This is **not** an exhaustive list of changes, including numerous new features, but only a summary of key operational related changes relevant to those upgrading from a previous major version of Nextcloud.

System requirements
-------------------

* PHP 8.2 is no longer supported. PHP 8.3 is now the minimum supported version.
* PHP 8.6 and newer are not supported yet.

----

The list of officially supported operating systems has been updated:

* The minimum supported version of *SUSE Linux Enterprise Server 15* has been bumped to SP7.
* The minimum supported version of *Debian Linux* has been bumped to *13 (Trixie)*.
* The minimum supported version of *Ubuntu Linux* has been bumped to *24.04*.

----

The list of officially supported databases has been updated:

- MariaDB 10.6 is out of support and thus Nextcloud dropped support for it. The minimum supported version of MariaDB is now 10.11 LTS.
- MariaDB 12.3 is released as a new LTS version and is now supported by Nextcloud.
- MySQL 8.0 is out of support and thus Nextcloud dropped support for it. The minimum supported version of MySQL is now 8.4 LTS.
- MySQL 9.7 is released as a new LTS version and is now supported by Nextcloud.

----

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

``sharing.federation.ocm.apiVersion``
``sharing.federation.ocm.removePublicKey``

Do not enable ``sharing.federation.ocm.removePublicKey`` until all federated
peers support RFC 9421 HTTP Message Signatures. Leave
``sharing.federation.ocm.apiVersion`` empty unless the compatibility of all
federated peers has been verified.

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

Background job diagnostics
--------------------------

Nextcloud 35 adds commands for inspecting configured background jobs and
historical job executions:

``occ background-job:list``
``occ background-job:history``

The history output includes the job status, class, start time, server ID,
process ID, duration, and peak memory usage. This can help identify failed or
slow jobs and determine which server executed a job.

Running ``occ`` as root
-----------------------

When ``occ`` is invoked as root, it now attempts to switch to the owner of
``config/config.php`` before executing the command.

This helps prevent files generated by ``occ`` from being owned by root.
However, the switch is best-effort and is not a complete security sandbox.
Ensure that ``config/config.php`` has the expected owner and that the account
running ``occ`` has access to the data directory and other required paths.
