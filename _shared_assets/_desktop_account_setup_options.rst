.. Shared parameter table for desktop account provisioning commands.

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``--userid <user>``
     - Required
     - User ID for the account to create.
   * - ``--serverurl <url>``
     - Required
     - Base URL of the Nextcloud server, for example ``https://cloud.example.com``.
   * - ``--apppassword <password>``
     - Not set
     - App password for the account. If omitted, the account is saved and you must log in from the desktop app later.
   * - ``--localdirpath <path>``
     - Suggested folder
     - Local sync folder. If omitted, use the folder suggested by the setup wizard. An existing folder must be empty.
       Ignored when macOS File Provider mode is enabled.
   * - ``--remotedirpath <path>``
     - ``/``
     - Remote folder for the new classic sync connection. Applies when a local sync folder is created.
   * - ``--isvfsenabled <0|1>``
     - ``0``
     - Use ``1`` to request virtual files for the new classic sync folder, where supported, or ``0`` to download
       files. This does not enable macOS File Provider mode.

