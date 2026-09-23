======================
Advanced configuration
======================

You can configure the desktop app through command-line options, ``nextcloud.cfg``, and environment variables.
Use the app's **Settings** window for options available there; this page describes advanced settings and overrides.
For the separate tool that performs a single synchronization run, see :doc:`commandline`.

.. contents:: On this page
   :local:
   :depth: 2

Defaults below refer to the standard Nextcloud client. Branded clients, server capabilities, and operating system
policies can change some defaults. Sync-engine settings apply to classic sync, including Windows virtual files.
The macOS File Provider extension handles its own file transfers; these settings do not configure its transfer engine.
See :doc:`macosfileprovider`.

.. _desktop-command-line-options:

Command-line options
--------------------

Start the desktop app with ``nextcloud [options]``. Use ``nextcloud --help`` to see the options in your installed
version.
Options with a value accept both ``--option value`` and ``--option=value``.

Quit the running client before applying startup options or environment variables. Starting another instance can forward
commands to the existing process instead of starting a new process with the requested environment.

General options
^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``--help``, ``-h``
     - Not requested
     - Show the available command-line options and exit.
   * - ``--version``, ``-v``
     - Not requested
     - Show version information and exit.
   * - ``--quit``, ``-q``
     - Not requested
     - Quit the running desktop client.
   * - ``--confdir <directory>``
     - Standard location
     - Use a different configuration directory. See :ref:`desktop-configuration-file` for the standard locations.
   * - ``--background``
     - Not set
     - Start without opening the main dialog.
   * - ``--set-language <language>``
     - From ``language``
     - Save the interface language and exit. For example, use ``de`` for German. An empty value restores the operating
       system language. Start the client again to apply it.
   * - ``--overrideserverurl <url>``
     - Not set
     - Save ``overrideServerUrl`` for the next account setup and exit. Start the client again to open the setup
       wizard.
   * - ``--overridelocaldir <path>``
     - Not set
     - Save ``overrideLocalDir`` for the next account setup and exit.
   * - ``--forcelegacyconfigimport``
     - Not set
     - Force import of an available legacy client configuration. Only available in builds that support account
       migration.
   * - ``--reverse``
     - Normal direction
     - Reverse the interface layout direction for this run.

Logging options
^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``--logwindow``, ``-l``
     - Not set
     - Open the log output window.
   * - ``--logfile <filename>``
     - Not set
     - Write logs to this file. Use ``-`` to write to standard output. Takes precedence over ``--logdir``.
   * - ``--logdir <directory>``
     - From ``logDir``
     - Write rotating log files to this directory.
   * - ``--logexpire <hours>``
     - From ``logExpire``
     - Set retention for rotating logs. A positive value overrides ``logExpire``; zero or a negative value uses the
       configuration setting.
   * - ``--logflush``
     - From ``logFlush``
     - Flush the log after each write so that recent messages are available immediately.
   * - ``--logdebug``
     - From ``logDebug``
     - Enable debug messages in Nextcloud logging categories. This does not enable all Qt debug categories.
   * - ``--debug``
     - Not set
     - Also enables debug logging. Prefer ``--logdebug`` when collecting diagnostic logs.

For example, collect debug output in a file on Linux:

.. code-block:: bash

   nextcloud --logdebug --logflush --logfile "$HOME/nextcloud-debug.log"

For persistent logging settings, see :ref:`desktop-general-settings`.

Account setup options
^^^^^^^^^^^^^^^^^^^^^

These options create and save an account, then exit. Start the desktop app again to use the account.

.. include:: ../../_shared_assets/_desktop_account_setup_options.rst

For example, create an account and log in from the desktop app afterward:

.. code-block:: bash

   nextcloud --userid carla --serverurl https://cloud.example.com --localdirpath "$HOME/Nextcloud"

.. _desktop-configuration-file:

Configuration file
------------------

The client stores its settings in ``nextcloud.cfg`` using the INI format. Quit the client and back up this file before
editing it, then start the client again. Changes made in the app's **Settings** window can overwrite the corresponding
values in the file.

The standard locations are:

* Linux: ``$HOME/.config/Nextcloud/nextcloud.cfg``. If ``XDG_CONFIG_HOME`` is set, use
  ``$XDG_CONFIG_HOME/Nextcloud/nextcloud.cfg``.
* Windows: ``%APPDATA%\Nextcloud\nextcloud.cfg``.
* macOS, client 33.0.0 and later:
  ``$HOME/Library/Containers/com.nextcloud.desktopclient/Data/Library/Preferences/Nextcloud/nextcloud.cfg``.
* Older macOS clients: ``$HOME/Library/Preferences/Nextcloud/nextcloud.cfg``.

``--confdir`` overrides the configuration directory. Branded clients can use a different directory and filename.
In Citrix and other environments with roaming profiles, persist the user's configuration between sessions to retain
account setup.

The tables identify the INI section for each setting. For example:

.. code-block:: ini

   [Nextcloud]
   remotePollInterval=30000

   [General]
   logDebug=true
   logExpire=48

Account identities, credentials, sync-folder state, window geometry, caches, migration markers, and updater state are
managed by the client. Use the setup wizard and **Settings** window to change those values.

Precedence depends on the setting. The environment overrides listed below apply only to their corresponding settings.
For ``skipUpdateCheck`` and ``autoUpdateCheck``, a value in ``[General]`` takes precedence over ``[Nextcloud]``.
On Windows, administrator policies can override those update settings and the folder-size and external-storage settings.
See :ref:`preventing-automatic-updates-in-windows-environments` for details about update policies.

.. _nextcloud-section:

``[Nextcloud]`` section
^^^^^^^^^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``remotePollInterval``
     - ``30000`` ms
     - Interval for polling the server for changes. Values below ``5000`` ms fall back to ``30000`` ms. Server push
       can reduce the need for polling.
   * - ``forceSyncInterval``
     - ``7200000`` ms
     - Schedule a sync after this much time has passed since the last sync (2 hours). Values below
       ``remotePollInterval`` are raised to that interval.
   * - ``fullLocalDiscoveryInterval``
     - ``3600000`` ms
     - After this interval (1 hour), the next eligible sync scans the local filesystem fully. Use ``-1`` to disable
       periodic full scans. Overridden by ``OWNCLOUD_FULL_LOCAL_DISCOVERY_INTERVAL``.
   * - ``notificationRefreshInterval``
     - ``60000`` ms
     - Interval for polling server notifications. Values below ``60000`` ms are raised to ``60000`` ms.
   * - ``skipUpdateCheck``
     - ``false``
     - Disable update checks and hide the updater interface.
   * - ``autoUpdateCheck``
     - ``true``
     - Enable automatic update checks, provided ``skipUpdateCheck`` is false.
   * - ``updateCheckInterval``
     - ``36000000`` ms
     - Automatic update-check interval (default: 10 hours). Values below ``300000`` ms (5 minutes) are raised to that minimum.

.. _general-section:
.. _desktop-general-settings:

``[General]`` section
^^^^^^^^^^^^^^^^^^^^^

.. list-table:: Synchronization and transfers
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``chunkSize``
     - ``104857600`` bytes
     - Initial upload chunk size (100 MiB). The client can adjust it during upload. Server capabilities can replace
       it; ``OWNCLOUD_CHUNK_SIZE`` overrides the resulting value.
   * - ``minChunkSize``
     - ``5242880`` bytes
     - Minimum configured upload chunk size (5 MiB). The sync engine initially bounds it between 5 MB and 5 GB.
       Overridden by ``OWNCLOUD_MIN_CHUNK_SIZE``.
   * - ``maxChunkSize``
     - ``104857600`` bytes
     - Maximum configured upload chunk size (100 MiB). A server-provided maximum takes precedence.
       ``OWNCLOUD_MAX_CHUNK_SIZE`` overrides the resulting value.
   * - ``timeout``
     - ``300`` seconds
     - Default network inactivity timeout. Activity can reset the timer and individual requests can use different
       timeouts. A nonzero ``OWNCLOUD_TIMEOUT`` overrides it.
   * - ``promptDeleteAllFiles``
     - ``false``
     - Ask for confirmation when all files are detected as deleted or when the number of deleted files exceeds
       ``deleteFilesThreshold``. Applies to desktop classic sync; ``nextcloudcmd`` does not show this prompt.
   * - ``deleteFilesThreshold``
     - ``100`` files
     - Deletion count above which ``promptDeleteAllFiles`` asks for confirmation. Has no effect unless that setting is
       enabled.
   * - ``moveToTrash``
     - ``false``
     - Move files deleted on the server to the local trash instead of deleting them permanently, where the local
       filesystem supports it.
   * - ``newBigFolderSizeLimit``
     - ``500`` MB
     - Size above which a new remote folder requires confirmation before downloading. Used when
       ``useNewBigFolderSizeLimit`` is true; a negative value disables the limit. Does not apply to virtual-file
       folders.
   * - ``useNewBigFolderSizeLimit``
     - ``true``
     - Enable the folder-size confirmation limit.
   * - ``confirmExternalStorage``
     - ``true``
     - Ask before synchronizing newly discovered external storage folders.
   * - ``notifyExistingFoldersOverLimit``
     - ``false``
     - Notify when an existing synchronized folder grows beyond the active folder-size limit. Requires that limit to
       be enabled and virtual files to be disabled.
   * - ``stopSyncingExistingFoldersOverLimit``
     - From ``notifyExistingFoldersOverLimit``
     - Also stop synchronizing such folders until you choose to keep syncing them. Requires
       ``notifyExistingFoldersOverLimit`` and the folder-size limit to be enabled.

For classic desktop sync, the client applies chunk settings from the configuration file, then server capabilities,
then environment overrides. It adjusts the minimum and maximum afterward to include the initial chunk size.
The ``targetChunkUploadDuration`` configuration key is not used by the sync engine; use
``OWNCLOUD_TARGET_CHUNK_UPLOAD_DURATION`` instead. ``forceLoginV2`` is no longer read by the client.

.. list-table:: Interface and notifications
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``showExperimentalOptions``
     - ``false``
     - Show experimental options in the interface. This does not itself enable experimental features.
   * - ``showMainDialogAsNormalWindow``
     - ``false``
     - Show the main dialog as a normal window even when a tray icon is available.
   * - ``monoIcons``
     - Platform dependent
     - Use monochrome tray icons. Defaults to ``true`` for the standard Nextcloud client on macOS and ``false``
       elsewhere.
   * - ``optionalServerNotifications``
     - ``true``
     - Show optional server notifications. Individual notification settings below also apply.
   * - ``showChatNotifications``
     - ``true``
     - Show chat notifications when optional server notifications are enabled.
   * - ``showCallNotifications``
     - ``true``
     - Show call notifications when optional server notifications are enabled.
   * - ``showQuotaWarningNotifications``
     - ``true``
     - Show quota warnings when optional server notifications are enabled.
   * - ``showInExplorerNavigationPane``
     - Platform dependent
     - Show sync folders in the Windows Explorer navigation pane. Defaults to ``true`` on Windows 10 and later, and
       ``false`` on other platforms.
   * - ``launchOnSystemStartup``
     - ``true``
     - Store the startup preference. Use **Settings** to change it so that the operating system startup registration
       is updated too.
   * - ``language``
     - Empty
     - Interface language code, for example ``de``. An empty value uses the operating system language.
   * - ``updateChannel``
     - Build/server dependent
     - Select a supported update channel. Invalid values are ignored. Branded clients and server subscription settings
       can restrict the selection. See :doc:`updatechannel`.
   * - ``showConfigBackupWarning``
     - ``false``
     - Show a notification listing configuration backups created during startup.

.. list-table:: Logging
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``logToTemporaryLogDir``
     - ``false``
     - Use a temporary log directory when logging has not already been directed to a file or standard output. Also
       enables debug logging and sets retention to 4 hours.
   * - ``logDir``
     - ``<config path>/logs``
     - Directory for rotating log files. Overridden by ``--logdir``; ``--logfile`` selects a file or standard output
       instead.
   * - ``logDebug``
     - ``false``
     - Enable Nextcloud debug logging. ``--logdebug`` also enables it.
   * - ``logExpire``
     - ``24`` hours
     - Retention for rotating logs. A value of ``0`` disables age-based removal. A positive ``--logexpire`` value
       overrides this setting.
   * - ``logFlush``
     - ``false``
     - Flush the log after every write. ``--logflush`` also enables it.

Development and debug builds can enable debug logging and immediate flushing regardless of these defaults.

.. list-table:: Account setup defaults
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``overrideServerUrl``
     - Empty
     - Force the server URL in the next account setup and start login automatically. Cleared after successful wizard
       setup. Can also be set with ``--overrideserverurl``.
   * - ``overrideLocalDir``
     - Empty
     - Suggested local directory for account setup. Cleared after successful wizard setup. Can also be set with
       ``--overridelocaldir``.
   * - ``isVfsEnabled``
     - ``false``
     - Virtual-file preference used with ``overrideServerUrl`` during setup. Does not convert existing sync folders or
       enable macOS File Provider mode.

Per-account network settings
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use the account's network settings in the app where possible. Values below belong to the existing account group inside
``[Accounts]``. In the INI file they appear with the account ID prefix, for example ``0\networkProxyType=0`` for account
``0``. Use the account ID already present in your file. Proxy passwords belong in the system keychain.

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``networkProxyType``
     - ``0`` if absent
     - ``0``: system proxy; ``1``: SOCKS5 proxy; ``2``: no proxy; ``3``: HTTP proxy. Account setup or migration can
       store a different value.
   * - ``networkProxyHostName``
     - Empty
     - Proxy hostname.
   * - ``networkProxyPort``
     - ``0``
     - Proxy port. Set the actual port when configuring a manual proxy.
   * - ``networkProxyNeedsAuth``
     - ``false``
     - Whether the proxy requires authentication.
   * - ``networkProxyUser``
     - Empty
     - Proxy username.
   * - ``networkUploadLimitSetting``
     - ``0``
     - Upload limit mode: ``0`` for unlimited, ``1`` for a manual limit. Negative values are reserved for legacy
       migration.
   * - ``networkDownloadLimitSetting``
     - ``0``
     - Download limit mode: ``0`` for unlimited, ``1`` for a manual limit. Negative values are reserved for legacy
       migration.
   * - ``networkUploadLimit``
     - ``0`` KB/s
     - Manual upload limit, used when ``networkUploadLimitSetting`` is ``1``.
   * - ``networkDownloadLimit``
     - ``0`` KB/s
     - Manual download limit, used when ``networkDownloadLimitSetting`` is ``1``.

.. _legacy-proxy-section:

Legacy proxy settings
^^^^^^^^^^^^^^^^^^^^^

The top-level ``[Proxy]`` section is retained for migration from older clients. Current desktop accounts use the
per-account settings above. Legacy proxy settings can be removed automatically after migration.

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``type``
     - ``0``
     - Legacy proxy type: ``0`` for system proxy, ``1`` for SOCKS5, ``2`` for no proxy, or ``3`` for HTTP proxy.
   * - ``host``
     - Empty
     - Legacy proxy hostname.
   * - ``port``
     - ``0``
     - Legacy proxy port.
   * - ``needsAuth``
     - ``false``
     - Whether the legacy proxy requires authentication.
   * - ``user``
     - Empty
     - Legacy proxy username.

.. _desktop-environment-variables:

Environment variables
---------------------

Set environment variables before starting the client. A variable set in a terminal applies to processes launched from
that terminal; an already running client or a client launched from the desktop does not automatically inherit it.
For example, temporarily change the network inactivity timeout on Linux:

.. code-block:: bash

   OWNCLOUD_TIMEOUT=600 nextcloud

The historic ``OWNCLOUD_`` prefix is still used by the Nextcloud client. Follow the value format in each description:
some switches require ``0`` or ``1``, while others react to any nonempty value, including ``0``.
``Default`` describes behavior when the variable is unset.

Transfer settings
^^^^^^^^^^^^^^^^^

The chunk-size and parallel-job overrides apply after configuration values and server capabilities in desktop classic
sync. ``nextcloudcmd`` also reads these variables, but starts with its sync-engine defaults instead of the desktop app's
chunk configuration.

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``OWNCLOUD_CHUNK_SIZE``
     - Effective chunk size
     - Initial chunk size in bytes. Desktop sync starts from ``chunkSize`` or the server-provided size.
       ``nextcloudcmd`` defaults to ``104857600`` bytes (100 MiB).
   * - ``OWNCLOUD_MIN_CHUNK_SIZE``
     - Effective minimum
     - Minimum chunk size in bytes. Desktop sync starts from ``minChunkSize``; ``nextcloudcmd`` defaults to
       ``5000000`` bytes (5 MB).
   * - ``OWNCLOUD_MAX_CHUNK_SIZE``
     - Effective maximum
     - Maximum chunk size in bytes. Desktop sync starts from ``maxChunkSize`` or the server-provided maximum;
       ``nextcloudcmd`` defaults to ``5000000000`` bytes (5 GB).
   * - ``OWNCLOUD_TARGET_CHUNK_UPLOAD_DURATION``
     - ``60000`` ms
     - Target duration for dynamic chunk sizing (1 minute). Use ``0`` to disable dynamic sizing. The similarly named
       configuration-file key has no effect.
   * - ``OWNCLOUD_MAX_PARALLEL``
     - Server/protocol dependent
     - Positive maximum number of parallel sync jobs. Desktop sync uses the server-provided value when available;
       otherwise it uses ``20`` for HTTP/2 or ``6`` for HTTP/1. ``nextcloudcmd`` defaults to ``6``. This is not the
       number of simultaneous file transfers.
   * - ``OWNCLOUD_TIMEOUT``
     - ``timeout`` or 300 seconds
     - Network inactivity timeout. A nonzero integer overrides ``timeout`` in the desktop app. ``nextcloudcmd``
       defaults to 300 seconds. Zero or an invalid value uses the normal default.
   * - ``OWNCLOUD_HTTP2_ENABLED``
     - Disabled
     - Set to ``1`` to allow HTTP/2 for HTTPS requests. Other values disable it. Actual use still depends on the
       server and network connection.
   * - ``OWNCLOUD_CHUNKING_NG``
     - Server capability
     - Set to ``0`` to disable the newer chunked-upload protocol or ``1`` to force it. Other values use the server
       capability. Only force it when the server supports it.
   * - ``NEXTCLOUD_BULK_UPLOAD``
     - Server capability
     - Set to ``0`` to disable bulk uploads or ``1`` to force them. Other values use the server capability. Only force
       them when the server supports them.
   * - ``OWNCLOUD_PARALLEL_CHUNK``
     - Server dependent
     - For the legacy chunked-upload path only: ``0`` or ``false`` disables parallel chunks. Other nonempty values
       enable them unless the server disables them.
   * - ``OWNCLOUD_LAZYOPS``
     - Disabled
     - A nonzero integer adds the ``OC-LazyOps: true`` header to upload requests. Its effect depends on server
       support.

Keep chunk sizes positive. The client adjusts the minimum and maximum to include the initial chunk size.
The environment parser accepts unsigned 32-bit byte values for the three chunk-size overrides, so do not use values
above ``4294967295`` bytes for those variables.

Synchronization and disk space
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``OWNCLOUD_FULL_LOCAL_DISCOVERY_INTERVAL``
     - ``fullLocalDiscoveryInterval``
     - Desktop classic sync only. Override the full local scan interval in milliseconds. Use ``-1`` to disable
       periodic full scans.
   * - ``OWNCLOUD_CRITICAL_FREE_SPACE_BYTES``
     - ``512000000`` bytes
     - Abort the folder sync when remaining local space is below this threshold (512 MB). The value is bounded between
       zero and ``OWNCLOUD_FREE_SPACE_BYTES``.
   * - ``OWNCLOUD_FREE_SPACE_BYTES``
     - ``1000000000`` bytes
     - Skip or abort downloads that would leave less than this amount of local free space (1 GB). Other
       synchronization can continue.
   * - ``OWNCLOUD_BLACKLIST_TIME_MIN``
     - ``25`` seconds
     - Minimum retry delay for files that failed to synchronize. Values below ``25`` are raised to ``25``.
   * - ``OWNCLOUD_BLACKLIST_TIME_MAX``
     - ``86400`` seconds
     - Maximum retry delay for files that failed to synchronize (1 day). Only positive values override the default.
   * - ``OWNCLOUD_UPLOAD_CONFLICT_FILES``
     - Server capability
     - Set to ``1`` to upload conflict copies or ``0`` to prevent their upload. A nonempty value overrides the server
       setting. See :doc:`conflicts`.

.. _low-disk-space:

Downloads skipped because of the free-space threshold are retried in later sync runs. The critical threshold stops the
whole folder sync. These limits are independent of your server storage quota.

Checksums
^^^^^^^^^

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``OWNCLOUD_CONTENT_CHECKSUM_TYPE``
     - Server preference, then ``SHA1``
     - Override the preferred upload checksum algorithm. Choose an algorithm supported by both client and server.
   * - ``OWNCLOUD_DISABLE_CHECKSUM_UPLOAD``
     - Unset
     - Any nonempty value disables sending upload checksums. Unset it to restore normal checksum uploads.
   * - ``OWNCLOUD_DISABLE_CHECKSUM_COMPUTATIONS``
     - Unset
     - Any nonempty value disables synchronous checksum calculations. Upload and download paths using asynchronous
       calculations still run.

Use checksum overrides only when diagnosing a specific compatibility problem; disabling checksums reduces integrity
checks used during synchronization.

Troubleshooting
^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``OWNCLOUD_SQLITE_JOURNAL_MODE``
     - ``WAL`` or ``DELETE``
     - Override the sync journal database mode. Normally ``WAL``; ``DELETE`` on Windows FAT filesystems and macOS sync
       paths under ``/Volumes/``. Change only when diagnosing a database compatibility problem.
   * - ``OWNCLOUD_SQLITE_LOCKING_MODE``
     - ``EXCLUSIVE``
     - Override the SQLite locking mode for the sync journal database.
   * - ``OWNCLOUD_SQLITE_TEMP_STORE``
     - SQLite default
     - Override the SQLite ``temp_store`` setting for the sync journal database.
   * - ``OWNCLOUD_CORE_DUMP``
     - Unset
     - On Unix systems, any nonempty value requests an unlimited core-dump size limit for the desktop app. Operating
       system restrictions still apply.
   * - ``QT_LOGGING_RULES``
     - Qt logging defaults
     - Set logging-category filters, for example ``nextcloud.*.debug=true``. This Qt variable also allows selecting
       individual categories.

For ``nextcloudcmd`` credentials, see :ref:`desktop-command-line-credentials`. Its ``NC_USER`` and ``NC_PASSWORD``
variables do not configure accounts in the desktop app.
