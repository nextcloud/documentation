=============================
System & maintenance commands
=============================

.. _logging_commands_label:

Logging commands
----------------

These commands view and configure your Nextcloud logging preferences::

 log
  log:file        manipulate Nextcloud logging backend
  log:manage      manage logging configuration
  log:tail        tail the nextcloud logfile [requires app "Log Reader" to be enabled]
  log:watch       watch the nextcloud logfile live [requires app "Log Reader" to be enabled]

Run ``log:file [--] [--enable] [--file] [--rotate-size]`` to see your current logging status::

 sudo -E -u www-data php occ log:file
 Log backend Nextcloud: enabled
 Log file: /opt/nextcloud/data/nextcloud.log
 Rotate at: disabled

* ``--enable`` turns on logging.
* ``--file`` sets a different log file path.
* ``--rotate-size`` sets your rotation by log file size in bytes with; 0 disables rotation.

``log:manage [--backend] [--level] [--timezone]`` sets your logging backend, log level, and timezone. The defaults
are ``file``, ``warning``, and ``UTC``. Available options are:

* ``--backend [file, syslog, errorlog, systemd]``
* ``--level [debug|info|warning|error|fatal]``
* ``--timezone`` according to https://www.php.net/manual/en/timezones.php

.. _maintenance_commands_label:

Maintenance commands
--------------------

Use these commands when you upgrade Nextcloud, manage encryption, perform
backups and other tasks that require locking users out until you are finished::

 maintenance
  maintenance:data-fingerprint        update the systems data-fingerprint after a backup is restored
  maintenance:mimetype:update-db      Update database mimetypes and update filecache
  maintenance:mimetype:update-js      Update mimetypelist.js
  maintenance:mode                    set maintenance mode
  maintenance:repair                  repair this installation
  maintenance:theme:update            Apply custom theme changes
  maintenance:update:htaccess         Updates the .htaccess file
  maintenance:repair-share-owner      Fix some shares owner if it felt out of sync

``maintenance:mode`` locks the sessions of all logged-in users, including
administrators, and displays a status screen warning that the server is in
maintenance mode. Users who are not already logged in cannot log in until
maintenance mode is turned off. When you take the server out of maintenance mode
logged-in users must refresh their Web browsers to continue working::

 sudo -E -u www-data php occ maintenance:mode --on
 sudo -E -u www-data php occ maintenance:mode --off

After restoring a backup of your data directory or the database, you should always
call ``maintenance:data-fingerprint`` once. This changes the ETag for all files
in the communication with sync clients, allowing them to realize a file was modified.

The ``maintenance:repair`` command runs automatically during upgrades to clean
up the database, so while you can run it manually there usually isn't a need
to::

 sudo -E -u www-data php occ maintenance:repair

``maintenance:mimetype:update-db`` updates the Nextcloud database and file cache
with changed mimetypes found in ``config/mimetypemapping.json``. Run this
command after modifying ``config/mimetypemapping.json``. If you change a
mimetype, run ``maintenance:mimetype:update-db --repair-filecache`` to apply the
change to existing files.

Run the ``maintenance:theme:update`` command if the icons of your custom theme are not
updated correctly. This updates the mimetypelist.js and clears the image cache.

.. _security_commands_label:

Security
--------

Use these commands to manage server-wide security related parameters. Currently this
includes :doc:`configuration_server/bruteforce_configuration` and SSL certificates (the latter are useful when
creating federation connections with other Nextcloud servers that use self-signed certificates::

 security
  security:bruteforce:attempts  show bruteforce attempts status for a given IP address
  security:bruteforce:reset     resets bruteforce attempts for a given IP address
  security:certificates         list trusted certificates
  security:certificates:import  import trusted certificate
  security:certificates:remove  remove trusted certificate

Reset an IP::

 sudo -E -u www-data php occ security:bruteforce:reset [IP address]


This example lists your installed certificates::

 sudo -E -u www-data php occ security:certificates

Import a new certificate::

 sudo -E -u www-data php occ security:certificates:import /path/to/certificate

Remove a certificate::

 sudo -E -u www-data php occ security:certificates:remove [certificate name]

Status
------

Use the status command to retrieve information about the current installation::

 $ sudo -E -u www-data php occ status
   - installed: true
   - version: 25.0.2.3
   - versionstring: 25.0.2
   - edition:
   - maintenance: false
   - needsDbUpgrade: false
   - productname: Nextcloud
   - extendedSupport: false

This information can also be formatted via JSON instead of plain text::

 $ sudo -E -u www-data php occ status --output=json_pretty
 {
     "installed": true,
     "version": "25.0.2.3",
     "versionstring": "25.0.2",
     "edition": "",
     "maintenance": false,
     "needsDbUpgrade": false,
     "productname": "Nextcloud",
     "extendedSupport": false
 }

Status return code
^^^^^^^^^^^^^^^^^^

And finally, the ``-e`` (for exit code) parameter can be used to check
the state of the nextcloud installation via return code::

 $ sudo -E -u www-data php occ status -e
 $ echo $?
 0
 $ sudo -E -u www-data php occ maintenance:mode --on
 Maintenance mode enabled
 $ sudo -E -u www-data php occ status -e
 $ echo $?
 1
 $ sudo -E -u www-data php occ maintenance:mode --off
 Maintenance mode disabled
 $ sudo -E -u www-data php occ status -e
 $ echo $?
 0

Note that by default there is no output when run with ``-e``. This is
intentional, so it can be used in scripts, monitoring checks, and systemd
units.

+-------------+--------------------------------------------------------+
| Return code | Description                                            |
+=============+========================================================+
| 0           | normal operation                                       |
+-------------+--------------------------------------------------------+
| 1           | maintenance mode is enabled; the instance is currently |
|             | unavailable to users.                                  |
+-------------+--------------------------------------------------------+
| 2           | ``sudo -E -u www-data php occ upgrade`` is required    |
+-------------+--------------------------------------------------------+

.. _trashbin_label:

Trashbin
--------

These commands allow for manually managing various aspects of the trash bin (deleted files)::

 trashbin
  trashbin:cleanup      Permanently remove deleted files
  trashbin:expire       Expires the users trashbin
  trashbin:size         Configure the target trashbin size
  trashbin:restore      Restore all deleted files according to the given filters

.. note::
  These commands are only available when the "Deleted files" app
  (``files_trashbin``) is enabled.

The ``trashbin:cleanup  [--all-users] [--] [<user_id>...]`` command removes the deleted files of the specified
users in a space-delimited list, or all users if --all-users is specified.

This example permanently removes the deleted files of all users::

  sudo -E -u www-data php occ trashbin:cleanup --all-users
  Remove all deleted files for all users
  Remove deleted files for users on backend Database
   freda
   molly
   stash
   rosa
   edward

This example permanently removes the deleted files of users molly and freda::

 sudo -E -u www-data php occ trashbin:cleanup molly freda
 Remove deleted files of   molly
 Remove deleted files of   freda

The ``trashbin:restore  [--all-users] [--scope[=SCOPE]] [--since[=SINCE]] [--until[=UNTIL]] [--dry-run] [--] [<user_id>...]`` command restores the deleted files of the specified
users in a space-delimited list, or all users if --all-users is specified.

This example restores the deleted user-files of all users::

 sudo -E -u www-data php occ trashbin:restore --all-users

This example restores the deleted user-files of users molly and freda::

 sudo -E -u www-data php occ trashbin:restore molly freda

The ``--scope`` option can be used to limit the restore to a specific scope.
Possible values are "user", "groupfolders" or "all" [default: "user"].

This example restores the deleted files of all groupfolders which are visible to the user freda::

  sudo -E -u www-data php occ trashbin:restore --scope groupfolders freda

The ``--since`` and ``--until`` options can be used to limit the restore to files deleted inside of the given time period.

This example restores the locally deleted files and files of any groupfolders which are visible to the user
freda. Additionally the files have to be deleted between ``01.08.2023 11:55:22`` and ``02.08.2023 01:33``::

  sudo -E -u www-data php occ trashbin:restore --scope all --since "01.08.2023 11:55:22" --until "02.08.2023 01:33" freda

The ``--dry-run`` option can be used to simulate the restore without actually restoring the files.

.. note::
  You can use the verbose options (``-v`` or ``-vv``) to get more information about
  the restore process and why some files might be skipped.


.. _versions_label:

Versions
--------

.. note::
  This command is only available when the "Versions" app (``files_versions``) is
  enabled.

Use this command to delete file versions for specific users, or for all users
when none are specified::

 versions
  versions:cleanup   Delete versions
  versions:expire    Expires the users file versions

This example deletes all versions for all users::

 sudo -E -u www-data php occ versions:cleanup
 Delete all versions
 Delete versions for users on backend Database
   freda
   molly
   stash
   rosa
   edward

You can delete versions for specific users in a space-delimited list::

 sudo -E -u www-data php occ versions:cleanup freda molly
 Delete versions of   freda
 Delete versions of   molly

.. _command_line_installation_label:

Command line installation
-------------------------

These commands are available only after you have downloaded and unpacked the
Nextcloud archive, and taken no further installation steps.

You can install Nextcloud entirely from the command line. After downloading the
tarball and copying Nextcloud into the appropriate directories you can use ``occ``
commands in place of running the graphical Installation Wizard.

Then choose your ``occ`` options. This lists your available options::

 sudo -E -u www-data php /var/www/nextcloud/occ
 Nextcloud is not installed - only a limited number of commands are available
 Nextcloud version 19.0.0

 Usage:
  [options] command [arguments]

 Options:
  --help (-h)           Display this help message
  --quiet (-q)          Do not output any message
  --verbose (-v|vv|vvv) Increase the verbosity of messages: 1 for normal
  output,  2 for more verbose output and 3 for debug
  --version (-V)        Display this application version
  --ansi                Force ANSI output
  --no-ansi             Disable ANSI output
  --no-interaction (-n) Do not ask any interactive question

 Available commands:
  check                 check dependencies of the server environment
  help                  Displays help for a command
  list                  Lists commands
  status                show some status information
  app
  l10n
  l10n:createjs         Create javascript translation files for a given app
  maintenance
  maintenance:install   install Nextcloud

Display your ``maintenance:install`` options::

 sudo -E -u www-data php occ help maintenance:install
 Nextcloud is not installed - only a limited number of commands are available
 Usage:
  maintenance:install [--database="..."] [--database-name="..."]
 [--database-host="..."] [--database-user="..."] [--database-pass[="..."]]
 [--database-table-prefix[="..."]] [--admin-user="..."] [--admin-pass="..."]
 [--data-dir="..."]

 Options:
  --database               Supported database type (default: "sqlite")
  --database-name          Name of the database
  --database-host          Hostname of the database (default: "localhost")
  --database-user          User name to connect to the database
  --database-pass          Password of the database user
  --admin-user             User name of the admin account (default: "admin")
  --admin-pass             Password of the admin account
  --data-dir               Path to data directory (default:
                           "/var/www/nextcloud/data")
  --help (-h)              Display this help message
  --quiet (-q)             Do not output any message
  --verbose (-v|vv|vvv)    Increase the verbosity of messages: 1 for normal
   output, 2 for more verbose output and 3 for debug
  --version (-V)           Display this application version
  --ansi                   Force ANSI output
  --no-ansi                Disable ANSI output
  --no-interaction (-n)    Do not ask any interactive question

This example completes the installation::

 cd /var/www/nextcloud/
 sudo -E -u www-data php occ maintenance:install --database
 "mysql" --database-name "nextcloud"  --database-user "root" --database-pass
 "password" --admin-user "admin" --admin-pass "password"
 Nextcloud is not installed - only a limited number of commands are available
 Nextcloud was successfully installed

Supported databases are::

 - sqlite (SQLite3 - Nextcloud Community edition only)
 - mysql (MySQL/MariaDB)
 - pgsql (PostgreSQL)
 - oci (Oracle - Nextcloud Enterprise edition only)

.. _command_line_upgrade_label:

Command line upgrade
--------------------

These commands are available only after you have downloaded upgraded packages or
tar archives, and before you complete the upgrade.

List all options::

 sudo -E -u www-data php occ upgrade -h
 Usage:
 upgrade [--quiet]

 Options:
 --help (-h)            Display this help message.
 --quiet (-q)           Do not output any message.
 --verbose (-v|vv|vvv)  Increase the verbosity of messages: 1 for normal output,
   2 for more verbose output and 3 for debug.
 --version (-V)         Display this application version.
 --ansi                 Force ANSI output.
 --no-ansi              Disable ANSI output.
 --no-interaction (-n)  Do not ask any interactive question

When you are performing an update or upgrade on your Nextcloud server (see the
Maintenance section of this manual), it is better to use ``occ`` to perform the
database upgrade step, rather than the Web GUI, in order to avoid timeouts. PHP
scripts invoked from the Web interface are limited to 3600 seconds. In larger
environments this may not be enough, leaving the system in an inconsistent
state. After performing all the preliminary steps (see
:doc:`../maintenance/upgrade`) use this command to upgrade your databases,
like this example on CentOS Linux. Note how it details the steps::

 sudo -E -u www-data php occ upgrade
 Nextcloud or one of the apps require upgrade - only a limited number of
 commands are available
 Turned on maintenance mode
 Checked database schema update
 Checked database schema update for apps
 Updated database
 Updating <gallery> ...
 Updated <gallery> to 0.6.1
 Updating <activity> ...
 Updated <activity> to 2.1.0
 Update successful
 Turned off maintenance mode

Enabling verbosity displays timestamps::

 sudo -E -u www-data php occ upgrade -v
 Nextcloud or one of the apps require upgrade - only a limited number of commands are available
 2015-06-23T09:06:15+0000 Turned on maintenance mode
 2015-06-23T09:06:15+0000 Checked database schema update
 2015-06-23T09:06:15+0000 Checked database schema update for apps
 2015-06-23T09:06:15+0000 Updated database
 2015-06-23T09:06:15+0000 Updated <files_sharing> to 0.6.6
 2015-06-23T09:06:15+0000 Update successful
 2015-06-23T09:06:15+0000 Turned off maintenance mode

If there is an error it throws an exception, and the error is detailed in your
Nextcloud logfile, so you can use the log output to figure out what went wrong,
or to use in a bug report::

 Turned on maintenance mode
 Checked database schema update
 Checked database schema update for apps
 Updated database
 Updating <files_sharing> ...
 Exception
 ServerNotAvailableException: LDAP server is not available
 Update failed
 Turned off maintenance mode


.. _antivirus_commands_label:

Antivirus
---------

.. note::
   These commands require the `files_antivirus <https://apps.nextcloud.com/apps/files_antivirus>`_ app to be installed and enabled.

Get info about files in the scan queue::

  sudo -E -u www-data php occ files_antivirus:status [-v]

Manually trigger the background scan::

  sudo -E -u www-data php occ files_antivirus:background-scan [-v] [-m MAX]

Manually scan a single file::

  sudo -E -u www-data php occ files_antivirus:scan <path>

Mark a file as scanned or unscanned::

  sudo -E -u www-data php occ files_antivirus:mark <path> <scanned|unscanned>

.. _setupchecks_commands_label:

Setupchecks
-----------

Run the setupchecks via occ::

  sudo -E -u www-data php occ setupchecks

Example output::

  dav:
    ✓ DAV system address book: No outstanding DAV system address book sync.
  network:
    ✓ WebDAV endpoint: Your web server is properly set up to allow file synchronization over WebDAV.
    ✓ Data directory protected
    ✓ Internet connectivity
    ...

.. _snowflakes_commands_label:

Snowflake IDs
-------------

You can decode Snowflake IDs with occ::

  sudo -E -u www-data php occ decode-snowflake <snowflake_id>

Example output::

  +--------------------+-------------------------+
  | Snowflake ID       | 6768789079123765868     |
  | Seconds            | 1575981518              |
  | Milliseconds       | 50                      |
  | Created from CLI   | no                      |
  | Server ID          | 441                     |
  | Sequence ID        | 2668                    |
  | Creation timestamp | 3335258318.050          |
  | Creation date      | 2075-09-09 12:38:38.050 |
  +--------------------+-------------------------+

.. _share_operations_label:

Share operations
----------------

Available ``occ`` commands for the ``share`` namespace::

  share:list                       list shares on the system

.. _occ_share_list_label:

List
^^^^

The ``share:list`` command lists all shares created on the system, with optional filters for recipient,
sharee, shared file and more.

.. _occ_debugging:

Debugging
---------

In certain situations it's necessary to generate debugging information, e.g. before submitting a bug report. You can run ``occ`` with debug logging::

 NC_loglevel=0 sudo -E -u www-data php occ -h

