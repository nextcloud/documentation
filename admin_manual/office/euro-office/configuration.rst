==========================
Configuration
==========================

After installing the Euro-Office Document Server, install the Nextcloud connector app
and connect it to the server.

Installing the connector app
-----------------------------

Install the **Euro-Office** app from the Nextcloud App Store:

1. Open :menuselection:`Settings --> Apps` in your Nextcloud admin interface.
2. Search for **Euro-Office**.
3. Click **Download and enable**.

Alternatively, install the app using the :command:`occ` command:

.. code-block:: bash

    sudo -E -u www-data php occ app:install eurooffice

Server settings
---------------

Open :menuselection:`Settings --> Administration --> Euro-Office` to configure the connection.

**Nextcloud Office address**
    The URL of the Euro-Office Document Server, accessible from both the Nextcloud server
    and end-user browsers:

    .. code-block:: text

        https://<documentserver>/

**Disable certificate verification (insecure)**
    Disables TLS certificate checks. Only enable this in test environments.

**Secret key (leave blank to disable)**
    The JWT shared secret. Must match the value configured on the Document Server:

    - **deb/rpm install:** ``/etc/euro-office/documentserver/local.json`` →
      ``services.CoAuthoring.secret.browser.string``
    - **Docker install:** the ``JWT_SECRET`` environment variable

Click **Save** to apply. A green status indicator confirms a successful connection.

Advanced server settings
^^^^^^^^^^^^^^^^^^^^^^^^

Expand **Advanced server settings** when the public Document Server URL is not directly
reachable from your Nextcloud host (for example, behind a NAT or split-horizon DNS):

**Authorization header (leave blank to use default header)**
    The HTTP header used to carry the JWT token. Defaults to ``Authorization``.

**Nextcloud Office address for internal requests from the server**
    The URL Nextcloud uses to contact the Document Server directly (server-to-server).
    Must be reachable from the Nextcloud host.

**Server address for internal requests from Nextcloud Office**
    The URL the Document Server uses to send callbacks back to Nextcloud. Must be
    reachable from the Document Server host.

.. tip::
    **Docker Compose example**

    When Nextcloud and Euro-Office run as services in the same Docker Compose network,
    containers can reach each other by service name. Given a ``compose.yml`` with services
    named ``nextcloud`` and ``eurooffice``:

    - **Nextcloud Office address** (public): ``https://office.example.com/``
    - **Nextcloud Office address for internal requests from the server**: ``http://eurooffice/``
    - **Server address for internal requests from Nextcloud Office**: ``http://nextcloud/``

    The public address is used by end-user browsers. The internal addresses bypass the
    public reverse proxy and let the two containers communicate directly over the
    shared Docker network.

Common settings
---------------

These settings become available after a successful server connection.

.. list-table::
    :header-rows: 1
    :widths: 50 50

    * - Setting
      - Description
    * - Allow the following groups to access the editors
      - Restricts editor access to specified Nextcloud groups.
    * - Use Nextcloud Office to generate a document preview
      - Generates thumbnail previews for Office files. Takes up additional disk space.
    * - Open file in the same tab
      - Opens documents inside Nextcloud instead of a new browser tab.
    * - Enable sharing
      - Allows users to share files from within the editor. May increase editor load time.
    * - Provide advanced document permissions
      - Enables per-user fine-grained permissions (review-only, comment-only, etc.)
        on shared files via the sharing dialog.
    * - Keep metadata for each version once the document is edited
      - Stores version metadata each time a document is saved. Takes up additional disk space.
    * - Enable background connection check to the editors
      - Runs a periodic cron job to verify the Document Server is reachable.
    * - Enable e-mail notifications
      - Sends e-mail notifications on comments and edits.
    * - Unknown author display name
      - Display name shown for edits made by users not known to Nextcloud.

**Default application for opening the format**
    Checkboxes for each supported file format. When enabled for a format, Nextcloud
    Office becomes the default handler when that file type is clicked.

**Open the file for editing**
    Checkboxes for formats that can be edited natively. Enabling a format allows users
    to edit it directly. Note that saving back to some formats may result in data loss
    due to format restrictions.

Editor customization settings
------------------------------

.. list-table::
    :header-rows: 1
    :widths: 50 50

    * - Setting
      - Description
    * - Keep intermediate versions when editing (forcesave)
      - Saves an intermediate version each time a user explicitly saves, in addition
        to the final version saved when the editor closes.
    * - Enable live-viewing mode when accessing file by public link
      - Shows live updates to external viewers accessing a file via a public link.
    * - Display Chat menu button
      - Shows or hides the in-editor chat panel.
    * - Display the header more compact
      - Displays a more compact toolbar header.
    * - Display Feedback & Support menu button
      - Shows or hides the Feedback & Support entry in the editor menu.
    * - Display Help menu button
      - Shows or hides the Help entry in the editor menu.

**REVIEW mode for viewing**
    Default mode for displaying tracked changes: **Markup**, **Final**, or **Original**.

**Default editor theme**
    Color theme for the editor interface: **Same as system**, **Light**, or **Dark**.

Common templates
----------------

Administrators can upload shared document templates that are available to all users
when creating new files. Templates are managed in the **Common templates** section of
the admin settings page.

Security
--------

**Enable plugins**
    Allows third-party plugins to run inside the editor.

**Run document macros**
    Allows macros embedded in documents to execute.

**Enable document protection for**
    Controls who can protect or unprotect documents:

    - **All users** — any editor can protect or unprotect the document.
    - **Owner only** — only the file owner can change protection.

Watermarks
^^^^^^^^^^

Watermarks are overlaid on documents when they are opened by specified users or via shares.
Enable **Enable watermarking** to configure the watermark.

**Watermark text** — the text overlaid on the document. Supported placeholders:

- ``{userId}`` — Nextcloud user ID
- ``{userDisplayName}`` — user's display name
- ``{email}`` — user's e-mail address
- ``{date}`` — current date
- ``{themingName}`` — Nextcloud instance name from theming settings

Watermark visibility can be configured per audience:

.. list-table::
    :header-rows: 1
    :widths: 50 50

    * - Option
      - When the watermark is shown
    * - Show watermark on tagged files
      - Files with specific system tags (requires the System Tags app).
    * - Show watermark for users of groups
      - Users belonging to selected groups.
    * - Show watermark for all shares
      - Any user who accesses the file via a share.
    * - Show watermark for read only shares
      - Users with read-only share access.
    * - Show watermark for all link shares
      - Anyone accessing the file via a public link.
    * - Show watermark for download hidden shares
      - Public links where file download is disabled.
    * - Show watermark for read only link shares
      - Public links with read-only access.
    * - Show watermark on link shares with specific system tags
      - Public links on files with specific system tags.

occ commands
------------

Settings can also be managed via :command:`occ`:

.. code-block:: bash

    # Read a setting
    sudo -E -u www-data php occ config:app:get eurooffice DocumentServerUrl

    # Write a setting
    sudo -E -u www-data php occ config:app:set eurooffice DocumentServerUrl --value="https://office.example.com/"

The ``eurooffice:documentserver`` command shows the configured server URL and optionally
tests the connection:

.. code-block:: bash

    # Print the currently configured Document Server URL
    sudo -E -u www-data php occ eurooffice:documentserver

    # Check the connection to the Document Server
    sudo -E -u www-data php occ eurooffice:documentserver --check

config.php
----------

Settings can also be set directly in ``config/config.php`` under the ``eurooffice`` key:

.. code-block:: php

    "eurooffice" => [
        "DocumentServerUrl" => "https://office.example.com/",
        "jwt_secret" => "your-secret",
        "verify_peer_off" => "true",
    ],

.. note::
    ``verify_peer_off`` is read as a string — use ``"true"`` to disable certificate
    verification, not a PHP boolean.

Settings defined in ``config.php`` are used as fallback when no value is set via the
admin UI or :command:`occ`. The UI takes precedence.
