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

    php occ app:install eurooffice

Connecting to the Document Server
-----------------------------------

1. Open :menuselection:`Settings --> Administration --> Euro-Office`.
2. Enter the Document Server URL in the **Euro-Office Docs address** field:

   .. code-block:: text

       https://<documentserver>/

   where ``<documentserver>`` is the hostname or IP of the machine running Euro-Office Document Server.

3. Enter the **Secret key** — this must match the JWT secret configured on the Document Server:

   - **deb/rpm install:** the secret is in ``/etc/euro-office/documentserver/local.json``
     under ``services.CoAuthoring.secret.browser.string``.
   - **Docker install:** the value of the ``JWT_SECRET`` environment variable used when
     starting the container.

4. Click **Save**.

A green status indicator confirms a successful connection.

Advanced server settings
--------------------------

If the public Document Server URL is not reachable from your Nextcloud server (for example,
behind a NAT or a split-horizon DNS), configure separate addresses for server-side and
client-side communication:

- **Euro-Office Docs address for internal requests from the server** — the URL Nextcloud uses
  to contact the Document Server directly (must be reachable from the Nextcloud host).
- **Nextcloud address available from Document Server** — the URL the Document Server uses
  to send callbacks back to Nextcloud (must be reachable from the Document Server host).

Common settings
---------------

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - Setting
      - Description
    * - Open file in the same tab
      - Opens documents inside Nextcloud instead of a new browser tab.
    * - Enable sharing
      - Allows users to share files directly from within the editor.
    * - Generate document preview
      - Uses Euro-Office to generate thumbnail previews for Office files.
    * - Advanced document permissions
      - Enables per-user fine-grained permissions (review-only, comment-only, etc.)
        on shared files.
    * - Enable e-mail notifications
      - Sends e-mail notifications when a document is commented or edited.
    * - Keep version history
      - Stores metadata for each version created while editing.
    * - Document protection
      - Sets who can protect/unprotect documents: document owners only (``owner``)
        or all editors (``all``).
    * - Restrict access to groups
      - Limits editor access to specific Nextcloud groups.

Customization settings
-----------------------

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - Setting
      - Description
    * - Display Chat menu button
      - Shows or hides the in-editor chat panel.
    * - Compact header
      - Displays a more compact toolbar header in the editor.
    * - Display Feedback & Support button
      - Shows or hides the Feedback & Support entry in the editor menu.
    * - Forcesave
      - Saves an intermediate version of the document each time a user explicitly
        saves (in addition to the final version saved on editor close).
    * - Display Help menu button
      - Shows or hides the Help entry in the editor menu.
    * - Review display mode
      - Default mode for viewing tracked changes: ``original``, ``markup``, or ``final``.
    * - Editor theme
      - Default color theme for the editor interface.
    * - Run document macros
      - Allows macros embedded in documents to execute.
    * - Enable plugins
      - Allows third-party plugins inside the editor.

Watermark settings
------------------

Watermarks are overlaid on documents when they are opened by specified users or via shares.

Enable watermarking under :menuselection:`Settings --> Administration --> Euro-Office --> Security`.

The watermark text supports the following placeholders:

- ``{userId}`` — Nextcloud user ID
- ``{userDisplayName}`` — user's display name
- ``{email}`` — user's e-mail address
- ``{date}`` — current date
- ``{themingName}`` — Nextcloud instance name from theming settings

occ commands
------------

Settings can also be managed via :command:`occ`:

.. code-block:: bash

    # Read a setting
    php occ config:app:get eurooffice DocumentServerUrl

    # Write a setting
    php occ config:app:set eurooffice DocumentServerUrl --value="https://office.example.com/"

    # Check the connection to the Document Server
    php occ eurooffice:documentserver --check

config.php
----------

Settings can also be set directly in ``config/config.php`` under the ``eurooffice`` key:

.. code-block:: php

    "eurooffice" => [
        "DocumentServerUrl" => "https://office.example.com/",
        "jwt_secret" => "your-secret",
        "verify_peer_off" => false,
    ],

Settings defined in ``config.php`` are used as fallback when no value is set via the admin UI
or :command:`occ`. The UI takes precedence.
