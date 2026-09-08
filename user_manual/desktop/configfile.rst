==================
Configuration File
==================

The Nextcloud Client reads a configuration file.  You can locate this configuration file as follows:

On Linux distributions:
        ``$HOME/.config/Nextcloud/nextcloud.cfg``

On Microsoft Windows systems:
        ``%APPDATA%\Nextcloud\nextcloud.cfg``

On macOS systems:
        Starting with version 33.0.0: ``$HOME/Library/Containers/com.nextcloud.desktopclient/Data/Library/Preferences/Nextcloud/nextcloud.cfg``

        On older versions: ``$HOME/Library/Preferences/Nextcloud/nextcloud.cfg``

.. note::
    In a Citrix workspace, the user's Roaming profile need to be persisted between sessions.
    The failure on doing so will result in users having to set up their account again in every new session.

The configuration file contains settings using the Microsoft Windows .ini file
format. You can overwrite changes using the Nextcloud configuration dialog.

.. note:: Use caution when making changes to the Nextcloud Client configuration
   file.  Incorrect settings can produce unintended results.

The configuration file also contains account details, sync folder state, window
geometry, cache values, migration markers, and updater state. Those values are
managed by the client and are not documented here for manual editing.

Some interesting values that can be set on the configuration file are:


``[Nextcloud]`` section
=======================

.. list-table::
   :header-rows: 1
   :widths: 28 22 50

   * - Variable
     - Default
     - Meaning
   * - ``remotePollInterval``
     - ``30000`` (30 sec)
     - Specifies the poll time for the remote repository in milliseconds. Values below ``5000`` are ignored and the default is used instead.
   * - ``forceSyncInterval``
     - ``7200000`` (2 hr)
     - The duration of no activity after which a synchronization run shall be triggered automatically. If this value is lower than ``remotePollInterval``, the client uses ``remotePollInterval`` instead.
   * - ``fullLocalDiscoveryInterval``
     - ``3600000`` (1 hr)
     - The interval after which the next synchronization will perform a full local discovery. Set this to ``-1`` to disable periodic full local discovery.
   * - ``notificationRefreshInterval``
     - ``60000`` (1 min)
     - Specifies the default interval of checking for new server notifications in milliseconds. Values below ``60000`` are raised to ``60000``.
   * - ``skipUpdateCheck``
     - ``false``
     - Disables update checks and hides the updater user interface.
   * - ``autoUpdateCheck``
     - ``true``
     - Enables automatic update checks when update checks are not skipped.
   * - ``updateCheckInterval``
     - ``36000000`` (10 hr)
     - Specifies the interval for automatic update checks in milliseconds. Values below ``300000`` (5 min) are raised to ``300000``.


``[General]`` section
=====================

.. list-table::
   :header-rows: 1
   :widths: 28 22 50

   * - Variable
     - Default
     - Meaning
   * - ``chunkSize``
     - ``104857600`` (100 MiB)
     - Specifies the initial chunk size of uploaded files in bytes. The client can dynamically adjust this size within the maximum and minimum bounds. Server capabilities and environment variables can also affect the effective chunk size.
   * - ``minChunkSize``
     - ``5242880`` (5 MiB)
     - Specifies the minimum configured chunk size of uploaded files in bytes. Values below the protocol minimum are raised by the sync engine.
   * - ``maxChunkSize``
     - ``104857600`` (100 MiB)
     - Specifies the maximum configured chunk size of uploaded files in bytes. Server capabilities can override this value at runtime.
   * - ``forceLoginV2``
     - ``false``
     - If the client should force the new login flow, even though some circumstances might need the old flow.
   * - ``promptDeleteAllFiles``
     - ``false``
     - If a UI prompt should ask for confirmation when all files are detected as deleted or when the number of deleted files exceeds ``deleteFilesThreshold``. This only applies to GUI syncs.
   * - ``deleteFilesThreshold``
     - ``100``
     - The number of deleted files above which ``promptDeleteAllFiles`` can trigger a confirmation prompt.
   * - ``timeout``
     - ``300``
     - The timeout for network connections in seconds. The ``OWNCLOUD_TIMEOUT`` environment variable takes precedence when set.
   * - ``moveToTrash``
     - ``false``
     - If files deleted on the server should be moved to the local trash instead of being deleted permanently.
   * - ``showExperimentalOptions``
     - ``false``
     - Whether to show experimental options that are still undergoing testing in the user interface. Turning this on does not enable experimental behavior on its own. It enables user interface options that can be used to opt in to experimental features.
   * - ``showMainDialogAsNormalWindow``
     - ``false``
     - Whether the main dialog should be shown as a normal window even if tray icons are available.
   * - ``monoIcons``
     - ``false``
     - Whether monochrome tray icons should be used. On macOS, the official Nextcloud client defaults this to ``true`` when monochrome icons are available.
   * - ``optionalServerNotifications``
     - ``true``
     - Whether optional server notifications should be shown.
   * - ``showChatNotifications``
     - ``true``
     - Whether chat notifications should be shown when optional server notifications are enabled.
   * - ``showCallNotifications``
     - ``true``
     - Whether call notifications should be shown when optional server notifications are enabled.
   * - ``showQuotaWarningNotifications``
     - ``true``
     - Whether quota warning notifications should be shown when optional server notifications are enabled.
   * - ``showInExplorerNavigationPane``
     - Platform dependent
     - Whether synced folders should be shown in the Windows Explorer navigation pane. The default is ``true`` on Windows 10 and newer, and ``false`` on other platforms.
   * - ``launchOnSystemStartup``
     - ``true``
     - Stores whether the option to launch the client on system startup is enabled.
   * - ``language``
     - empty
     - Enforces a specific language for the user interface. An empty value uses the operating system language.
   * - ``updateChannel``
     - Build dependent
     - The selected update channel. Invalid values are ignored. Branded clients may only support their default channel.
   * - ``newBigFolderSizeLimit``
     - ``500`` (MB)
     - Folder size limit in MB used when asking before synchronizing large folders.
   * - ``useNewBigFolderSizeLimit``
     - ``true``
     - Enables the large-folder confirmation limit.
   * - ``confirmExternalStorage``
     - ``true``
     - Ask before synchronizing external storages.
   * - ``notifyExistingFoldersOverLimit``
     - ``false``
     - Notify when existing synced folders grow beyond ``newBigFolderSizeLimit``.
   * - ``stopSyncingExistingFoldersOverLimit``
     - Follows ``notifyExistingFoldersOverLimit``
     - Stop syncing existing folders that exceed the configured folder size limit.
   * - ``logToTemporaryLogDir``
     - ``false``
     - Write logs to a temporary log directory.
   * - ``logDir``
     - ``<config path>/logs``
     - Directory for client log files.
   * - ``logDebug``
     - ``false``
     - Enable debug logging.
   * - ``logExpire``
     - ``24``
     - Log retention time in hours.
   * - ``logFlush``
     - ``false``
     - Flush log output immediately.

.. note::
   Upload sync options can also be overridden by environment variables.
   ``OWNCLOUD_CHUNK_SIZE``, ``OWNCLOUD_MIN_CHUNK_SIZE``,
   ``OWNCLOUD_MAX_CHUNK_SIZE``, and ``OWNCLOUD_MAX_PARALLEL`` are applied
   after configuration values and server capabilities. The dynamic chunk target
   duration can be overridden with ``OWNCLOUD_TARGET_CHUNK_UPLOAD_DURATION``.
   The ``targetChunkUploadDuration`` key in ``nextcloud.cfg`` is currently not
   applied by GUI sync.


Legacy ``[Proxy]`` section
==========================

The top-level ``[Proxy]`` section is the legacy/global proxy configuration.
Current account proxy settings are stored per account in the ``[Accounts]``
section. Proxy passwords are stored in the system keychain where possible.

.. list-table::
   :header-rows: 1
   :widths: 28 22 50

   * - Variable
     - Default
     - Meaning
   * - ``host``
     - empty
     - The address of the proxy server.
   * - ``port``
     - ``0``
     - The port where the proxy is listening. The settings dialog may show ``8080`` as the manual-proxy UI default when no port is configured.
   * - ``needsAuth``
     - ``false``
     - Whether the proxy requires authentication.
   * - ``user``
     - empty
     - Proxy username.
   * - ``type``
     - ``0``
     - ``0`` for System Proxy.
   * -
     -
     - ``1`` for SOCKS5 Proxy.
   * -
     -
     - ``2`` for No Proxy.
   * -
     -
     - ``3`` for HTTP(S) Proxy.


Per-account network settings
============================

Current proxy and bandwidth settings are stored below the individual account
group in the ``[Accounts]`` section.

.. list-table::
   :header-rows: 1
   :widths: 32 18 50

   * - Variable
     - Default
     - Meaning
   * - ``networkProxyType``
     - ``2``
     - Account proxy type. ``0`` is System Proxy, ``1`` is SOCKS5 Proxy, ``2`` is No Proxy, and ``3`` is HTTP(S) Proxy.
   * - ``networkProxyHostName``
     - empty
     - Account proxy hostname.
   * - ``networkProxyPort``
     - ``0``
     - Account proxy port.
   * - ``networkProxyNeedsAuth``
     - ``false``
     - Whether the account proxy requires authentication.
   * - ``networkProxyUser``
     - empty
     - Account proxy username.
   * - ``networkUploadLimitSetting``
     - ``0``
     - Upload bandwidth limit mode. ``0`` means no limit and ``1`` means manual limit. Legacy values ``-1`` and ``-2`` are treated as no limit or migration values.
   * - ``networkDownloadLimitSetting``
     - ``0``
     - Download bandwidth limit mode. ``0`` means no limit and ``1`` means manual limit. Legacy values ``-1`` and ``-2`` are treated as no limit or migration values.
   * - ``networkUploadLimit``
     - ``0``
     - Manual upload limit in KB/s.
   * - ``networkDownloadLimit``
     - ``0``
     - Manual download limit in KB/s.
