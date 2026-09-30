================
Using the Client
================

The Nextcloud desktop client runs in the background. Open its settings from the system tray on Windows and Linux or
the menu bar on macOS.

.. _desktop-add-account:

Add account
-----------

To connect another Nextcloud account, open the settings dialog and click **Add account** in the sidebar. Enter the
address you use to access your Nextcloud server in a browser, then click **Log in**.

.. image:: images/wizard-server.png
   :alt: Setup wizard with the server address field and Log in button
   :width: 50%
   :align: center

If your network requires a proxy, click **Proxy settings** before logging in. Choose the system proxy or enter your
proxy settings manually, then click **Done**.

.. image:: images/wizard-proxy-settings.png
   :alt: Proxy settings dialog with no proxy, system proxy, and manual proxy options
   :width: 50%
   :align: center

If the secure connection fails, check the server address and contact your server administrator. The wizard may offer
to connect without TLS or use a client certificate. Use **Use client certificate** only if your server requires one.

.. image:: images/wizard-secure-connection.png
   :alt: Warning that the secure server connection failed, with client certificate and unencrypted options
   :width: 50%
   :align: center

If prompted for a client certificate, choose the PKCS#12 file provided by your administrator, enter its password,
and click **Connect**.

.. image:: images/wizard-client-certificate.png
   :alt: Client certificate dialog with certificate file and password fields
   :width: 50%
   :align: center

The wizard asks you to switch to your browser. Click **Open** if the browser does not open automatically. Log in and
grant the desktop client access when prompted. Then return to the wizard.

.. image:: images/wizard-browser-auth.png
   :alt: Setup wizard prompting you to open a browser to authorize the account
   :width: 50%
   :align: center

Choose how to sync your files. With classic synchronization, choose **Synchronize everything** or **Choose what to
sync**. Use **Choose** beside **Local sync folder** to change where files are stored, then click **Done**.

.. image:: images/wizard-sync-classic.png
   :alt: Classic synchronization options and local sync folder in the setup wizard
   :width: 50%
   :align: center

You can choose **File Provider** to download files on demand. Click **Done** to finish adding the account. On macOS,
see :doc:`macosfileprovider` for details about Finder integration.

.. image:: images/wizard-sync-file-provider.png
   :alt: File Provider selected in the setup wizard
   :width: 50%
   :align: center

Before finishing classic synchronization, click **Advanced** if you want confirmation before syncing large folders
or external storage. Set your preferences in **Advanced options**, then click **Done** to return to the wizard.

.. image:: images/wizard-advanced-options.png
   :alt: Advanced options for large folders and external storage in the setup wizard
   :width: 50%
   :align: center

Settings dialog
---------------

Select an account in the sidebar to see its sync status, local folder, storage usage, and connection settings. Use
**Add Folder Sync Connection** to set up another classic sync folder for that account. You can log out or remove the
account from the same page.

.. image:: images/settings-account-classic.png
   :alt: Account settings with classic sync status, connection settings, and account controls
   :width: 50%
   :align: center

Under **General**, choose whether to launch the client at startup, use monochrome icons, and show notifications.
On macOS, you can also enable File Provider for all accounts. This setting replaces classic sync folders and their
Finder integration.

.. image:: images/settings-general.png
   :alt: General settings for startup, icons, File Provider, and notifications
   :width: 50%
   :align: center

Under **Advanced**, set confirmation thresholds for large folders and external storage. You can also adjust the
server polling interval, decide whether removed files go to the trash, edit ignored files, or create a debug archive.

.. image:: images/settings-advanced.png
   :alt: Advanced settings for sync confirmations, server polling, ignored files, and debug archives
   :width: 50%
   :align: center

.. _usingIgnoredFilesEditor-label:

To exclude files or folders from synchronization, click **Edit Ignored Files** under **Advanced**. Add a pattern for
each item you want to ignore. An asterisk (``*``) matches any number of characters, a question mark (``?``)
matches one character, and a trailing slash (``/``) limits a pattern to folders. Select **Allow Deletion** only for
ignored items that the client may remove when they prevent a folder from being deleted. Click **OK** to save.

.. image:: images/settings-ignored-files.png
   :alt: Ignored files editor with patterns, Allow Deletion checkboxes, and save controls
   :width: 50%
   :align: center

Under **Info**, you can check the desktop client version and open its usage documentation or legal notice.

.. image:: images/settings-info.png
   :alt: Info page showing the desktop client version and documentation link
   :width: 50%
   :align: center

Systray icon
------------

The desktop client shows a status icon in the system tray on Windows and Linux or the menu bar on macOS. Colorful
status icons and colorful or monochrome tray icons are available for the same sync states. You can choose monochrome
icons under **General** in the settings dialog.

.. list-table:: Synchronization status icons
   :class: desktop-status-icons
   :header-rows: 1
   :widths: 46 18 18 18

   * - State
     - Status
     - Mono tray
     - Color tray
   * - Up to date and connected
     - .. image:: images/icon-status-ok.png
          :alt: Colorful up-to-date status icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-ok.png
          :alt: Monochrome up-to-date tray icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-colored-ok.png
          :alt: Colorful up-to-date tray icon
          :width: 25px
          :class: desktop-status-icon
   * - Synchronizing
     - .. image:: images/icon-status-sync.png
          :alt: Colorful synchronizing status icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-sync.png
          :alt: Monochrome synchronizing tray icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-colored-sync.png
          :alt: Colorful synchronizing tray icon
          :width: 25px
          :class: desktop-status-icon
   * - Paused
     - .. image:: images/icon-status-pause.png
          :alt: Colorful paused status icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-pause.png
          :alt: Monochrome paused tray icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-colored-pause.png
          :alt: Colorful paused tray icon
          :width: 25px
          :class: desktop-status-icon
   * - Offline
     - .. image:: images/icon-status-offline.png
          :alt: Colorful offline status icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-offline.png
          :alt: Monochrome offline tray icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-colored-offline.png
          :alt: Colorful offline tray icon
          :width: 25px
          :class: desktop-status-icon
   * - Warning; open the client for details
     - .. image:: images/icon-status-warning.png
          :alt: Colorful warning status icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-warning.png
          :alt: Monochrome warning tray icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-colored-warning.png
          :alt: Colorful warning tray icon
          :width: 25px
          :class: desktop-status-icon
   * - Error; open the client for details
     - .. image:: images/icon-status-error.png
          :alt: Colorful error status icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-error.png
          :alt: Monochrome error tray icon
          :width: 25px
          :class: desktop-status-icon
     - .. image:: images/icon-tray-colored-error.png
          :alt: Colorful error tray icon
          :width: 25px
          :class: desktop-status-icon

Open the tray or menu bar icon to view the client and its available actions, such as pausing or resuming sync.

File manager overlay icons
--------------------------

For classic sync folders, the desktop client adds overlay icons to files in the file manager. A green checkmark
means a file is up to date. A warning icon can mean that a file is ignored; a red X indicates a sync error. A blue
icon indicates a file waiting to sync or currently syncing. When the client is offline, it does not show overlays
for the folder's current sync state.

A folder's overlay reflects sync errors in its contents. Ignored files do not change the parent folder's status.
On macOS, File Provider uses the standard Finder status indicators described in :doc:`macosfileprovider`.

Sharing
-------

The desktop client integrates sharing actions into Finder on macOS and Explorer on Windows. On Linux, install the
integration package for your file manager, such as ``nautilus-nextcloud`` or ``dolphin-nextcloud``.

In your file manager, right-click a file and select **Nextcloud** > **Share options** to open the share dialog.

Use **Search for recipients** to share the file with people or groups. Existing shares and share links appear below
the search field. Use the copy button to copy an internal link or share link. Use the three-dot menu to edit a share,
or the **X** button to remove it.

.. image:: images/sharing-overview.png
   :alt: Sharing overview with recipient search, existing shares, and link controls
   :width: 50%
   :align: center

When you edit a share, choose the recipient's permission from the dropdown menu. You can also add a note for the
recipients. Changes are applied immediately.

.. image:: images/sharing-details.png
   :alt: Share details with recipients, permissions, and a note to recipients
   :width: 50%
   :align: center

Open **Sharing settings** with the gear button to set an expiration date or protect the share with a password.
Changes are applied immediately.

.. image:: images/sharing-advanced-settings.png
   :alt: Advanced sharing settings for expiration date and password protection
   :width: 50%
   :align: center
