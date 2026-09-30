.. _using-the-command-line-client:

===================
Command-line client
===================

``nextcloudcmd`` synchronizes a local directory with a Nextcloud server, then exits. It can perform follow-up syncs
when needed, but it does not continuously monitor local files or poll for server changes like the desktop app.
For options passed to the desktop app's ``nextcloud`` command, see :ref:`desktop-command-line-options`.

.. _install:

Installation
------------

Install a package that provides ``nextcloudcmd``. Availability depends on your operating system and package:

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 25 75

   * - Operating system
     - Package source
   * - Alpine Linux
     - `nextcloud-client <https://pkgs.alpinelinux.org/package/edge/community/x86_64/nextcloud-client>`__
   * - Debian
     - `nextcloud-desktop-cmd
       <https://packages.debian.org/search?suite=all&arch=any&searchon=names&keywords=nextcloud-desktop-cmd>`__
   * - Fedora
     - `nextcloud-client <https://packages.fedoraproject.org/pkgs/nextcloud-client/nextcloud-client/>`__
   * - Ubuntu
     - `nextcloud-desktop-cmd <https://packages.ubuntu.com/search?keywords=nextcloud-desktop-cmd>`__
   * - Ubuntu PPA
     - `Nextcloud client PPA <https://launchpad.net/~nextcloud-devs/+archive/ubuntu/client>`__
   * - Windows
     - `Nextcloud downloads <https://nextcloud.com/install/#install-clients>`__

Usage
-----

Use an existing local directory and the base URL of the Nextcloud server:

.. code-block:: console

   nextcloudcmd [options] local_directory server_url

.. _example:

For example, synchronize the remote ``Music`` folder into an existing local folder:

.. code-block:: bash

   nextcloudcmd --user carla --path /Music "$HOME/media/music" https://cloud.example.com

The client prompts for the password. You can use an app password from your Nextcloud account's security settings.
Do not append a WebDAV endpoint to the server URL; use ``--path`` for a remote subfolder.

Run ``nextcloudcmd`` without arguments to display its help, or ``nextcloudcmd --version`` to display its version.
Options with values accept both ``--option value`` and ``--option=value``.

Options
-------

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``--path <path>``
     - Server root
     - Synchronize a remote subfolder, for example ``/Documents``.
   * - ``--user <user>``, ``-u <user>``
     - See credentials below
     - Login name. Overrides the username in the server URL.
   * - ``--password <password>``, ``-p <password>``
     - See credentials below
     - Password or app password. Overrides the password in the server URL. Command-line passwords may be visible in
       process listings and shell history.
   * - ``-n``
     - Not set
     - Read credentials from a matching host or default entry in ``.netrc``. These replace credentials supplied in the URL or
       with ``--user`` and ``--password``.
   * - ``--non-interactive``
     - Not set
     - Do not prompt for credentials. Read missing credentials from ``NC_USER`` and ``NC_PASSWORD``.
   * - ``--silent``, ``-s``
     - Not set
     - Suppress Qt log messages. Does not suppress every console message.
   * - ``--trust``
     - Not set
     - Accept untrusted TLS certificates. Use only for a controlled diagnostic run; normally fix the certificate trust
       configuration.
   * - ``--httpproxy <url>``
     - No explicit proxy
     - Set an HTTP proxy using ``http://hostname:port``. This option does not parse proxy credentials in the URL.
   * - ``--exclude <file>``
     - System exclude list
     - Add an exclude list. The file must exist. Pattern anchoring depends on its filename; see
       :ref:`desktop-command-line-excludes`.
   * - ``--exclude-anchored <file>``
     - Not set
     - Add an exclude list with patterns anchored at the sync root, regardless of the filename.
   * - ``--unsyncedfolders <file>``
     - Not set
     - Read remote folders to exclude from synchronization, one relative path per line. Empty lines and lines starting
       with ``#`` are ignored.
   * - ``--max-sync-retries <number>``
     - ``3``
     - Maximum number of follow-up runs when the sync engine requests another sync. This is not a general retry count
       for every failed request.
   * - ``--uplimit <number>``
     - ``0`` KB/s
     - Upload speed limit in KB/s (1000 bytes per second). Zero means unlimited.
   * - ``--downlimit <number>``
     - ``0`` KB/s
     - Download speed limit in KB/s (1000 bytes per second). Zero means unlimited.
   * - ``-h``
     - Hidden files included
     - Include hidden files. This is already the default; ``-h`` does not display help.
   * - ``--logdebug``
     - Not set
     - Enable Nextcloud debug logging and send log output to standard output.
   * - ``--confdir <directory>``
     - Standard location
     - Use a different configuration directory. Does not make the one-run sync inherit all desktop sync settings.
   * - ``--version``, ``-v``
     - Not requested
     - Display version information and exit. Run this option without the directory and server arguments.

.. _credential-handling:
.. _desktop-command-line-credentials:

Credential handling
-------------------

Credentials are read in this order:

1. Username and password in the server URL, if supplied.
2. ``--user`` and ``--password``, which replace the corresponding URL values.
3. A matching host or default ``.netrc`` entry when ``-n`` is used, which replaces both values.
4. Prompts for any missing values, or the environment variables below when ``--non-interactive`` is used.

Prefer a password prompt or a protected ``.netrc`` file over putting passwords in a command or URL.

.. list-table::
   :header-rows: 1
   :class: configuration-table
   :widths: 32 18 50

   * - Parameter
     - Default
     - Description
   * - ``NC_USER``
     - Unset
     - Username fallback for a one-run sync with ``--non-interactive``. Only used if no username was supplied by the
       preceding methods.
   * - ``NC_PASSWORD``
     - Unset
     - Password fallback for a one-run sync with ``--non-interactive``. Only used if no password was supplied by the
       preceding methods.

These variables do not supply credentials for the account setup mode below.
For transfer overrides shared with the desktop sync engine, see :ref:`desktop-environment-variables`.
``nextcloudcmd`` uses an initial chunk size of 100 MiB, a minimum of 5 MB, a maximum of 5 GB, and 6 parallel jobs unless
overridden by those variables. It does not read the desktop app's chunk-size settings from ``nextcloud.cfg``.

.. _exclude-list:
.. _desktop-command-line-excludes:

Exclude lists
-------------

The client loads the system exclude list when available. You can add your own list with ``--exclude`` or
``--exclude-anchored``. A missing explicitly supplied file is an error.

With ``--exclude``, a file named ``sync-exclude.lst`` uses the sync root for pattern matching. Other filenames can use
the exclude file's directory as the base. Use ``--exclude-anchored`` when the filename and location should not affect
matching.

Write one pattern per line. Wildcards are supported, for example:

.. code-block:: text

   *.tmp
   ._*
   Thumbs.db

Account setup
-------------

``nextcloudcmd`` can also save an account for use by the desktop app. The presence of ``--userid`` selects this mode;
omit the positional local directory and server URL used for a one-run sync. The command exits after setup completes.

.. include:: ../../_shared_assets/_desktop_account_setup_options.rst

For example, save an account and log in from the desktop app afterward:

.. code-block:: bash

   nextcloudcmd --userid carla --serverurl https://cloud.example.com --localdirpath "$HOME/Nextcloud"
