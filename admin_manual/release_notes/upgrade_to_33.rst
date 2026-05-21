#######################
Upgrade to Nextcloud 33
#######################

.. danger::
    Before upgrading to a new major version, review *Critical Changes*, at a minimum. 
    You're also encouraged to read the full release notes below for additional context
    and changes coverage, some which may be critical in your environment/for your use case,
    but nonetheless not highlighted in the *Critical Changes* sction.

.. tip::
    For new minor/patch release, review *⚠️ Notes for Administrators* below for the respective release,
    highlights of additional particularly noteworthy changes.

****************
Critical Changes
****************

System requirements
===================

* PHP 8.5 is now supported.
* PHP 8.2 is now deprecated but still supported.
* PHP 8.1 is no longer supported.
* Oracle 11g is no longer supported.
* PostgreSQL 13 is no longer supported.

If you configured restrictions on which domains can be contacted on the internet, you need to add connectivity.nextcloud.com to the allowlist, as it’s now used by default to test internet connectivity instead of www.nextcloud.com. You can also configure any other URL to use in the configuration instead. See :ref:`connections_to_remote_servers`.

Previews
========

The preview provider for MP3 files, which reads cover images embedded in the files, is disabled by default for performance and stability reasons.
See :doc:`../configuration_files/previews_configuration` for details on how to enable or disable the preview provider.

Snowflake IDs
=============

This version of Nextcloud ships with `Snowflake IDs <https://en.wikipedia.org/wiki/Snowflake_ID>`_. Those IDs include the creation time of object, a sequence ID and a server ID.
The server ID should now be configured in your config.php file or using environment variables. See :doc:`../configuration_server/config_sample_php_parameters` for more information.

OpenMetrics endpoint
====================

Nextcloud 33 introduces a ``/metrics`` endpoint that can be integrated into every OpenMetrics (Prometheus) system.
For security, it only answers on localhost by default.

See :doc:`../configuration_monitoring/index` for more information about it.

Default user agent for outgoing requests changed
================================================

Starting with this release, the default user agent for requests done by the instance was changed from ``Nextcloud Server Crawler`` to ``Nextcloud-Server-Crawler/X.Y.Z``, where ``X.Y.Z`` is the current server version.

*******************
Admin Release Notes
*******************

Changes in 33.0.1
=================

**Release date:** March 26, 2026 | `Full changelog <https://github.com/nextcloud-releases/server/releases/tag/v33.0.1>`_

**Release Type: Minor (Maintenance)**

Overview
--------

This is the first patch release for Nextcloud 33. It delivers a comprehensive set of bug fixes, targeted performance improvements, and several new features across the core server and bundled apps.

.. note::
    The final v33.0.1 release notes below are fully cumulative — includes everything from RC1
    and RC2 in addition to a handful of changes that landed after RC2. Items present in the final 
    changelog but not in any RC i.e., truly post-RC2) are: 

    - `server#58796 <https://github.com/nextcloud/server/pull/58796>`_ (bulk preview regeneration — immediately reverted by `server#59231 <https://github.com/nextcloud/server/pull/59231>`_)
    - `server#59172 <https://github.com/nextcloud/server/pull/59172>`_ (revert "authoritative share")
    - `server#59226 <https://github.com/nextcloud/server/pull/58796>`_ (final release bump).

----

✨ New Features
---------------

Files & Search
~~~~~~~~~~~~~~

- **Upload time tracking in search and recent files:** Files now record ``upload_time``, enabling search and filtering by upload date, and surfacing files in the "recent files" view. (`server#58374 <https://github.com/nextcloud/server/pull/58374>`_)
- **Creation time tracking:** Files also now record ``creation_time`` on creation, and the files app renders a "recently created" indicator. (`server#58694 <https://github.com/nextcloud/server/pull/58694>`_)
- **Custom memcache prefix:** A new ``memcache_customprefix`` configuration option allows administrators to set a custom prefix for Redis and Memcached cache keys — useful when multiple Nextcloud instances share the same cache backend. (`server#58810 <https://github.com/nextcloud/server/pull/58810>`_)

CalDAV / Calendar
~~~~~~~~~~~~~~~~~

- **Calendar read/write federation:** Federated calendar sharing now supports both reading and writing across Nextcloud instances. (`server#58590 <https://github.com/nextcloud/server/pull/58590>`_)
- **Improved calendar migrator:** The CalDAV calendar migrator has been enhanced. (`server#58907 <https://github.com/nextcloud/server/pull/58907>`_)
- **Public calendar token API:** A new function allows retrieving the token for a publicly shared calendar. (`server#59080 <https://github.com/nextcloud/server/pull/59080>`_)

AI / Task Processing
~~~~~~~~~~~~~~~~~~~~

- **New** ``occ taskprocessing:worker`` **command:** Runs a dedicated polling loop that processes AI tasks via synchronous providers (``ISynchronousProvider``). Supports ``--timeout``, ``--interval``, ``--once``, and ``--taskTypes`` flags, with starvation prevention ensuring the globally oldest scheduled task is always processed next. Suitable for deployments that need a persistent, dedicated task processing process outside the standard background job system. (`server#59082 <https://github.com/nextcloud/server/pull/59082>`_)

External Storage
~~~~~~~~~~~~~~~~

- **SFTP: fixed empty port field causing host-embedded port to be ignored.** If a port was specified as part of the host string (e.g., ``1.2.3.4:22``) but the separate port field was left blank, the port was incorrectly being ignored due to a regression. (`server#58358 <https://github.com/nextcloud/server/pull/58358>`_)
- **Hide local storage from user-facing options** in the external storage configuration UI. (`server#58424 <https://github.com/nextcloud/server/pull/58424>`_)

Password Policy
~~~~~~~~~~~~~~~

- **Context parameter for generate/validate endpoints:** The Password Policy app's API now accepts a ``context`` parameter for generating and validating passwords. (`password_policy#900 <https://github.com/nextcloud/password_policy/pull/900>`_)

----

🐛 Bug Fixes
-------------

Core Server
~~~~~~~~~~~

- Fixed PostgreSQL transaction aborts when caching user mounts. (`server#58884 <https://github.com/nextcloud/server/pull/58884>`_)
- Fixed Snowflake ID generation to allow multiple Nextcloud instances sharing the same temp directory. (`server#58561 <https://github.com/nextcloud/server/pull/58561>`_)
- Fixed language/locale codes: the server no longer strips underscores from locale codes (e.g., ``zh_CN`` was being incorrectly reduced to ``zh``). (`server#58575 <https://github.com/nextcloud/server/pull/58575>`_)
- Fixed log level configuration: ``log.condition.matches`` no longer overrides the configured log level. (`server#58612 <https://github.com/nextcloud/server/pull/58612>`_)
- Fixed WebCron access being logged at the wrong level — now correctly logged at INFO. (`server#58517 <https://github.com/nextcloud/server/pull/58517>`_)
- Fixed ``files:repair`` steps when the ``files_sharing`` app is disabled. (`server#58607 <https://github.com/nextcloud/server/pull/58607>`_)
- Fixed S3 object store: the path ``"0"`` is no longer treated as the root path. (`server#58666 <https://github.com/nextcloud/server/pull/58666>`_)
- Fixed S3 ``deleteObjects`` call: was incorrectly passing full objects instead of just keys. (`server#58605 <https://github.com/nextcloud/server/pull/58605>`_)
- Fixed file copy: copied files now correctly receive all permissions. (`server#58846 <https://github.com/nextcloud/server/pull/58846>`_)
- Fixed copy event emission to correctly check both source and target. (`server#58673 <https://github.com/nextcloud/server/pull/58673>`_)
- Fixed file size detection after DAV ``OPEN`` when size cannot be determined. (`server#58736 <https://github.com/nextcloud/server/pull/58736>`_)
- Fixed return value for filesize on non-existing files (now correctly returns ``false``). (`server#58553 <https://github.com/nextcloud/server/pull/58553>`_)
- Fixed mount cache update when multiple entries exist for the same root ID. (`server#58733 <https://github.com/nextcloud/server/pull/58733>`_)
- Fixed file path propagation to skip Groupfolder root, version, and trash entries, reducing unnecessary database queries. (`server#58433 <https://github.com/nextcloud/server/pull/58433>`_, `server#58450 <https://github.com/nextcloud/server/pull/58450>`_)
- Fixed Propagator to skip running queries when there are no parent entries. (`server#58521 <https://github.com/nextcloud/server/pull/58521>`_)
- Fixed ``TransferOwnershipService``: Groupfolder sizes are now correctly excluded from the ownership transfer size-difference calculation. Since Groupfolder-mounted files are not included in user ownership transfers, their sizes were causing spurious size-mismatch warnings. (`server#58449 <https://github.com/nextcloud/server/pull/58449>`_)
- Fixed the file cache filter (``getFolderContentsById``) to remove invalid entries. (`server#58378 <https://github.com/nextcloud/server/pull/58378>`_)
- Fixed ``SecurityMiddleware`` response header to correctly distinguish error types. (`server#58880 <https://github.com/nextcloud/server/pull/58880>`_)
- Fixed background job argument storage: now stored as ``TEXT`` with a cap of 32,000 characters (previously could be silently truncated for long arguments). (`server#59067 <https://github.com/nextcloud/server/pull/59067>`_)
- Fixed custom app order: now loaded before service container closures are resolved. (`server#58972 <https://github.com/nextcloud/server/pull/58972>`_)
- Fixed delegation admin panel to use the correct delegation class. (`server#59011 <https://github.com/nextcloud/server/pull/59011>`_)
- Fixed ``renewpassword`` route: missing attribute and incorrect parameter type corrected. (`server#59014 <https://github.com/nextcloud/server/pull/59014>`_)
- Fixed session HMAC logging: only escalates to ``CRITICAL`` when the problem is genuinely critical. (`server#59016 <https://github.com/nextcloud/server/pull/59016>`_)
- Fixed comments: mentions inside Markdown code blocks are no longer returned as mention results. (`server#58981 <https://github.com/nextcloud/server/pull/58981>`_, `server#59024 <https://github.com/nextcloud/server/pull/59024>`_)
- Fixed comments sidebar: properly handles opening when Activity integration is in use. (`server#58294 <https://github.com/nextcloud/server/pull/58294>`_)
- Fixed LDAP display name lookup to use the local database cache before querying the LDAP server, improving performance of user-facing actions and reducing queries to the LDAP server. (`server#59035 <https://github.com/nextcloud/server/pull/59035>`_)
- Fixed DAV serialized class allowlist to use an exhaustive (explicit) list. (`server#58511 <https://github.com/nextcloud/server/pull/58511>`_)
- Fixed path parsing to only strip the user component at the beginning of a path. (`server#58527 <https://github.com/nextcloud/server/pull/58527>`_)
- Fixed notification exception handling in the notifier. (`server#58583 <https://github.com/nextcloud/server/pull/58583>`_)
- Fixed node handling for Snowflake IDs in the files layer. (`server#58999 <https://github.com/nextcloud/server/pull/58999>`_)
- Fixed PHP 8.5 compatibility: removed deprecated ``RFC7231`` constant. (`server#58911 <https://github.com/nextcloud/server/pull/58911>`_)
- Fixed X-NC-Scheduling flag not being obeyed on delete operations. (`server#58341 <https://github.com/nextcloud/server/pull/58341>`_)
- Fixed a raw path info fallback for request path resolution. (`server#58831 <https://github.com/nextcloud/server/pull/58831>`_)
- Fixed ``hasAnnotationOrAttribute`` method: moved to the reflector for correct behavior. (`server#59057 <https://github.com/nextcloud/server/pull/59057>`_)
- Added ``files_sharing_raw`` to ``rootUrlApps`` for correct routing. (`server#58838 <https://github.com/nextcloud/server/pull/58838>`_)
- Fixed dead documentation link for Windows file naming conventions. (`server#58291 <https://github.com/nextcloud/server/pull/58291>`_)
- Fixed a missing database index (``properties_name_path_user``) in the install-time schema — new installations were generating spurious "missing index" warnings immediately after setup. No action is required for existing installations. (`server#58418 <https://github.com/nextcloud/server/pull/58418>`_)

Sharing & Federation
~~~~~~~~~~~~~~~~~~~~

- Fixed share expiration: shares now expire at end-of-day (23:59:59) rather than the beginning of the expiration day, allowing access throughout the entire selected expiration day. The API response also now returns the actual stored expiration time rather than a hardcoded ``00:00:00``, preventing timezone-related display issues in the UI. (`server#58536 <https://github.com/nextcloud/server/pull/58536>`_)
- Fixed: prevented empty passwords on password-required shares — creation is now blocked when the field is empty. (`server#59090 <https://github.com/nextcloud/server/pull/59090>`_)
- Fixed federated reshares. (`server#58899 <https://github.com/nextcloud/server/pull/58899>`_)
- Reverted "authoritative share" change that was causing regressions. (`server#59172 <https://github.com/nextcloud/server/pull/59172>`_)
- Fixed external shares no longer appearing incorrectly in the local share list. (`server#58717 <https://github.com/nextcloud/server/pull/58717>`_)
- Fixed: local-to-local shares no longer trigger unnecessary remote/federation notifications. (`server#58719 <https://github.com/nextcloud/server/pull/58719>`_)
- Fixed ``files_sharing``: respect configuration to skip strict TLS certificate verification for remote shares. (`server#59050 <https://github.com/nextcloud/server/pull/59050>`_)
- Fixed ``files_sharing``: ensure share API error messages are surfaced to the UI. (`server#58441 <https://github.com/nextcloud/server/pull/58441>`_)
- Fixed ``files_sharing``: strict share validation now works correctly. (`server#58688 <https://github.com/nextcloud/server/pull/58688>`_)
- Fixed ``files_sharing``: legacy ``downloadShare`` endpoint compatibility with legacy behavior. (`server#58468 <https://github.com/nextcloud/server/pull/58468>`_)
- Fixed ``canDownload`` helper for shares, applied consistently throughout. (`server#59021 <https://github.com/nextcloud/server/pull/59021>`_)
- Fixed external sharing to allow plain ``http://localhost`` targets. (`server#58523 <https://github.com/nextcloud/server/pull/58523>`_)

External Storage (``files_external``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fixed: ignore unsatisfied optional dependencies without throwing errors. (`server#58588 <https://github.com/nextcloud/server/pull/58588>`_)
- Fixed: set correct default values for new storage configurations. (`server#58690 <https://github.com/nextcloud/server/pull/58690>`_)
- Fixed: properly handle API errors. (`server#59042 <https://github.com/nextcloud/server/pull/59042>`_)

Previews
~~~~~~~~

- Fixed preview folder creation to avoid errors when the folder already exists. (`server#58328 <https://github.com/nextcloud/server/pull/58328>`_)
- Fixed preview MIME type validation. (`server#58814 <https://github.com/nextcloud/server/pull/58814>`_)
- Fixed index usage when cleaning up old previews (performance). (`server#58431 <https://github.com/nextcloud/server/pull/58431>`_)
- **Reverted** bulk preview regeneration (`server#58796 <https://github.com/nextcloud/server/pull/58796>`_) due to regressions — removed in the final release. (`server#59231 <https://github.com/nextcloud/server/pull/59231>`_)

Theming
~~~~~~~

- Fixed theming admin panel: error messages now display on image upload, and the previous image is only deleted after validation succeeds. (`server#58323 <https://github.com/nextcloud/server/pull/58323>`_)

Security / CSP
~~~~~~~~~~~~~~

- Removed wildcard CSP entry previously used for video verification. (`server#58877 <https://github.com/nextcloud/server/pull/58877>`_)

Files UI
~~~~~~~~

- Fixed file view sorting. (`server#58375 <https://github.com/nextcloud/server/pull/58375>`_)
- Fixed tab navigation from "select all" checkbox to batch actions. (`server#58462 <https://github.com/nextcloud/server/pull/58462>`_)
- Fixed file drop from external sources (drag-and-drop into the files app). (`server#58701 <https://github.com/nextcloud/server/pull/58701>`_)

User Status
~~~~~~~~~~~

- Fixed emoji picker being mounted inside a dialog (caused display issues). (`server#58429 <https://github.com/nextcloud/server/pull/58429>`_)

----

🐛 Bug Fixes — Bundled Apps
-----------------------------

Activity
~~~~~~~~

- Fixed handling of deleted self-shares (the activity for a share-from-self delete no longer throws errors). (`activity#2385 <https://github.com/nextcloud/activity/pull/2385>`_)
- Fixed activity emails: failed emails are no longer re-queued indefinitely. (`activity#2429 <https://github.com/nextcloud/activity/pull/2429>`_)
- Fixed array offset error when an activity value is not set. (`activity#2422 <https://github.com/nextcloud/activity/pull/2422>`_)
- Fixed reshare notification path. (`activity#2467 <https://github.com/nextcloud/activity/pull/2467>`_)
- Fixed activity stream file path tooltip display. (`activity#2433 <https://github.com/nextcloud/activity/pull/2433>`_)
- Fixed federation check to verify that the app is enabled before processing. (`activity#2463 <https://github.com/nextcloud/activity/pull/2463>`_)
- Fixed several accessibility issues. (`activity#2465 <https://github.com/nextcloud/activity/pull/2465>`_)
- Fixed: only write activity entries for actual public uploads, not internal ones. (`activity#2458 <https://github.com/nextcloud/activity/pull/2458>`_)
- Fixed return type formatting for user paths. (`activity#2449 <https://github.com/nextcloud/activity/pull/2449>`_)
- Added a new database index to improve activity query performance. (`activity#2447 <https://github.com/nextcloud/activity/pull/2447>`_)
- Performance: bulk query user settings instead of individual queries. (`activity#2419 <https://github.com/nextcloud/activity/pull/2419>`_)
- Performance: replaced ``getById`` calls with ``getFirstNodeById`` where possible. (`activity#2388 <https://github.com/nextcloud/activity/pull/2388>`_)

External App API (``app_api``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Fixed missing ``docker_socket_port`` in the auto-registered HaRP AIO daemon configuration. (`app_api#801 <https://github.com/nextcloud/app_api/pull/801>`_)
- Added ability to configure the Docker API version via app config. (`app_api#798 <https://github.com/nextcloud/app_api/pull/798>`_)

Circles (Teams)
~~~~~~~~~~~~~~~

- Fixed path parsing (user component now only stripped from the beginning of a path). (`circles#2374 <https://github.com/nextcloud/circles/pull/2374>`_)
- Fixed ``circles:check`` command failing due to an APCu race condition and missing CLI wrapper. (`circles#2388 <https://github.com/nextcloud/circles/pull/2388>`_)
- Fixed remote instance connectivity. (`circles#2396 <https://github.com/nextcloud/circles/pull/2396>`_)
- Fixed adding members to a circle/team. (`circles#2402 <https://github.com/nextcloud/circles/pull/2402>`_)

PDF Viewer
~~~~~~~~~~

- Fixed "allow view without download" option not being applied correctly. (`files_pdfviewer#1387 <https://github.com/nextcloud/files_pdfviewer/pull/1387>`_)

Photos
~~~~~~

- Fixed face recognition: retrieve Recognize API key and send it along with DAV requests. (`photos#3444 <https://github.com/nextcloud/photos/pull/3444>`_)

Survey Client
~~~~~~~~~~~~~

- Added a "never remind again" option to the survey notification. (`survey_client#390 <https://github.com/nextcloud/survey_client/pull/390>`_)

Notifications
~~~~~~~~~~~~~

- Fixed browser notification icon color. (`notifications#2864 <https://github.com/nextcloud/notifications/pull/2864>`_)

Viewer
~~~~~~

- Fixed Image Editor: adjusted line height so filter names are visible. (`viewer#3078 <https://github.com/nextcloud/viewer/pull/3078>`_)

Text Editor
~~~~~~~~~~~

- Fixed labels for new file actions in the menu. (`text#8296 <https://github.com/nextcloud/text/pull/8296>`_)
- Fixed workspace/README header display in "Personal files". (`text#8305 <https://github.com/nextcloud/text/pull/8305>`_)
- Fixed inline code highlighting background (always shown). (`text#8308 <https://github.com/nextcloud/text/pull/8308>`_)
- Fixed search to include user mentions. (`text#8327 <https://github.com/nextcloud/text/pull/8327>`_)
- Fixed attachment file ID when copying folders containing attachments. (`text#8339 <https://github.com/nextcloud/text/pull/8339>`_)
- Fixed inline code within links. (`text#8345 <https://github.com/nextcloud/text/pull/8345>`_)
- Fixed attached file name sanitization. (`text#8347 <https://github.com/nextcloud/text/pull/8347>`_)
- Fixed editor container growth on empty or short content. (`text#8355 <https://github.com/nextcloud/text/pull/8355>`_)
- Fixed ``README.md`` files being unnecessarily locked in the text app. (`text#8363 <https://github.com/nextcloud/text/pull/8363>`_)
- Fixed link action icons and custom link injection in the menu bar. (`text#8369 <https://github.com/nextcloud/text/pull/8369>`_, `text#8374 <https://github.com/nextcloud/text/pull/8374>`_)

First Run Wizard
~~~~~~~~~~~~~~~~

- Fixed logo being cropped in the About & New slideshow. (`firstrunwizard#1964 <https://github.com/nextcloud/firstrunwizard/pull/1964>`_)

Privacy
~~~~~~~

- Fixed deprecated ``QueryBuilder::execute()`` usage. (`privacy#1268 <https://github.com/nextcloud/privacy/pull/1268>`_)

----

⚡ Performance Improvements
----------------------------

- Avoided recomputing list of mounts by provider unnecessarily. (`server#58558 <https://github.com/nextcloud/server/pull/58558>`_)
- Improved sharing performance by avoiding loading all user shares when unsharing. (`server#58658 <https://github.com/nextcloud/server/pull/58658>`_)
- Activity: new database index for improved query performance. (`activity#2447 <https://github.com/nextcloud/activity/pull/2447>`_)
- Activity: bulk query for user settings replaces per-user queries. (`activity#2419 <https://github.com/nextcloud/activity/pull/2419>`_)
- Preview cleanup: index is now used when deleting old previews. (`server#58431 <https://github.com/nextcloud/server/pull/58431>`_)
- LDAP: display names are now resolved from the local database cache first, reducing queries to the LDAP server. (`server#59035 <https://github.com/nextcloud/server/pull/59035>`_)

----

🔧 Dependency Updates
----------------------

- Updated Symfony libraries. (`server#58546 <https://github.com/nextcloud/server/pull/58546>`_, `3rdparty#2324 <https://github.com/nextcloud/3rdparty/pull/2324>`_)
- Updated ``nextcloud/lognormalizer`` to 3.0.1. (`server#58968 <https://github.com/nextcloud/server/pull/58968>`_, `3rdparty#2354 <https://github.com/nextcloud/3rdparty/pull/2354>`_)
- Updated ``haze`` to 2.2.0. (`server#58850 <https://github.com/nextcloud/server/pull/58850>`_)
- Fixed Vite config for assets imported from Node modules. (`server#58513 <https://github.com/nextcloud/server/pull/58513>`_)

----

⚠️ Notes for Administrators
-----------------------------

- **Preview bulk regeneration was included in the v33.0.1 release but was immediately reverted** (`server#59231 <https://github.com/nextcloud/server/pull/59231>`_) after causing regressions. It does not ship as a functional feature in 33.0.1. The standard incremental preview pipeline is unaffected.
- **Authoritative share behavior was similarly reverted** (`server#59172 <https://github.com/nextcloud/server/pull/59172>`_) after regressions were found in RC testing. The share behavior from Nextcloud 33.0.0 is preserved.
- **Share expiration now uses end-of-day (23:59:59)** rather than the beginning of the expiration day. Shares will now remain accessible for the entirety of the configured expiration day. The API response has also been corrected to return the actual stored expiration time rather than a hardcoded ``00:00:00``, which previously caused timezone-related display inconsistencies in the UI. (`server#58536 <https://github.com/nextcloud/server/pull/58536>`_)
- **Snowflake IDs:** If you run multiple Nextcloud instances sharing the same temporary directory, a fix for Snowflake ID collisions is included. (`server#58561 <https://github.com/nextcloud/server/pull/58561>`_)
- **Background job argument length cap increased to 32,000 characters** (stored as ``TEXT``). Long job arguments that were previously being silently truncated will now be stored in full. (`server#59067 <https://github.com/nextcloud/server/pull/59067>`_)
- **LDAP display names** are now resolved from the local database cache first, reducing load on your LDAP/AD server for user-facing actions. Display names continue to be refreshed in the background as before. (`server#59035 <https://github.com/nextcloud/server/pull/59035>`_)
- **New install database index:** A missing database index (``properties_name_path_user``) is now correctly included in the install-time schema. New installations will no longer generate spurious "missing index" warnings immediately after setup. **No action is required for existing installations.** (`server#58418 <https://github.com/nextcloud/server/pull/58418>`_)
- **Custom memcache prefix:** If you share a Redis or Memcached backend across multiple Nextcloud instances, the new ``memcache_customprefix`` config option allows you to namespace cache keys per instance. (`server#58810 <https://github.com/nextcloud/server/pull/58810>`_)
- **``occ taskprocessing:worker``:** A new dedicated task processing worker command is now available for deployments that need AI tasks processed outside of the standard background job system. See the command's ``--help`` output for available options. (`server#59082 <https://github.com/nextcloud/server/pull/59082>`_)
