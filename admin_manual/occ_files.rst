===========================
Files & encryption commands
===========================

.. _encryption_label:

Encryption
----------

``occ`` includes a complete set of commands for managing encryption::

 encryption
  encryption:change-key-storage-root   Change key storage root
  encryption:decrypt-all               Disable server-side encryption and
                                       decrypt all files
  encryption:disable                   Disable encryption
  encryption:drop-legacy-filekey       Drop legacy filekey for files still using it
  encryption:enable                    Enable encryption
  encryption:enable-master-key         Enable the master key. Only available
                                       for fresh installations with no existing
                                       encrypted data! There is also no way to
                                       disable it again.
  encryption:encrypt-all               Encrypt all files for all users
  encryption:list-modules              List all available encryption modules
  encryption:set-default-module        Set the encryption default module
  encryption:show-key-storage-root     Show current key storage root
  encryption:status                    Lists the current status of encryption

``encryption:status`` shows whether you have active encryption, and your default
encryption module. To enable encryption you must first enable the Encryption
app, and then run ``encryption:enable``::

 sudo -E -u www-data php occ app:enable encryption
 sudo -E -u www-data php occ encryption:enable
 sudo -E -u www-data php occ encryption:status
  - enabled: true
  - defaultModule: OC_DEFAULT_MODULE

``encryption:change-key-storage-root`` is for moving your encryption keys to a
different folder. It takes one argument, ``newRoot``, which defines your new
root folder::

 sudo -E -u www-data php occ encryption:change-key-storage-root /etc/oc-keys

You can see the current location of your keys folder::

 sudo -E -u www-data php occ encryption:show-key-storage-root
 Current key storage root:  default storage location (data/)

``encryption:list-modules`` displays your available encryption modules. You will
see a list of modules only if you have enabled the Encryption app. Use
``encryption:set-default-module [module name]`` to set your desired module.

``encryption:encrypt-all`` encrypts all data files for all users. You must first
put your Nextcloud server into :ref:`maintenance
mode<maintenance_commands_label>` to prevent any user activity until encryption
is completed.

``encryption:decrypt-all`` decrypts all user data files, or optionally a single
user::

 sudo -E -u www-data php occ encryption:decrypt freda

Users must have enabled recovery keys on their Personal pages.

Note that if you do not have master key/recovery key enabled, you can ONLY
decrypt files per user, one user at a time and NOT when in maintenance mode.
You will need the users' password to decrypt the files.

Use ``encryption:disable`` to disable your encryption module. You must first put
your Nextcloud server into :ref:`maintenance mode <maintenance_commands_label>`
to prevent any user activity.

``encryption:enable-master-key`` creates a new master key, which is used for all
user data instead of individual user keys. This is especially useful to enable
single-sign on. Use this only on fresh installations with no existing data, or
on systems where encryption has not already been enabled. It is not possible to
disable it.

``encryption:drop-legacy-filekey`` scans the files for the legacy filekey
format using RC4 and get rid of it (if master key is enabled). The operation can
be quite slow as it needs to rewrite each encrypted file. If you do not do it files
will be migrated to drop their legacy filekey on the first modification. If you have
old files from Nextcloud<25 still using base64 encoding this will migrate them to the
binary format and save about 33% disk space.

See :doc:`../configuration_files/encryption_configuration` to learn more.

.. _federation_sync_label:

Federation sync
---------------

.. note::
  This command is only available when the "Federation" app (``federation``) is
  enabled.

Synchronize the addressbooks of all federated Nextcloud servers::

 federation:sync-addressbooks  Synchronizes addressbooks of all
                               federated clouds

In Nextcloud, servers connected with federation shares can share user
address books, and auto-complete usernames in share dialogs. Use this command
to synchronize federated servers::

  sudo -E -u www-data php occ federation:sync-addressbooks

.. _file_operations_label:

File operations
---------------

Available ``occ`` commands for the ``files`` namespace::

  files:cleanup                    cleanup filecache
  files:copy                       Copy a file or folder
  files:delete                     Delete a file or folder
  files:get                        Get the contents of a file
  files:move                       Move a file or folder
  files:object:delete              Delete an object from the object store
  files:object:get                 Get the contents of an object
  files:object:put                 Write a file to the object store
  files:put                        Write contents of a file
  files:recommendations:recommend
  files:reminders                  List file reminders
  files:repair-tree                Try and repair malformed filesystem tree structures
  files:scan                       rescan filesystem
  files:scan-app-data              rescan the AppData folder
  files:transfer-ownership         All files and folders are moved to another user - outgoing shares and incoming user file shares (optionally) are moved as well.

.. _occ_files_scan_label:

Scan
^^^^

The ``files:scan`` command scans for new files and updates the file cache. You
may rescan all files, per-user, a space-delimited list of users, and limit the
search path. If not using ``--quiet``, statistics will be shown at the end of
the scan::

 sudo -E -u www-data php occ files:scan --help
 Description:
   rescan filesystem

 Usage:
   files:scan [options] [--] [<user_id>...]

 Arguments:
   user_id                  will rescan all files of the given user(s)

 Options:
       --output[=OUTPUT]    Output format (plain, json or json_pretty, default is plain) [default: "plain"]
   -p, --path=PATH          limit rescan to this path, eg. --path="/alice/files/Music", the user_id is determined by the path and the user_id parameter and --all are ignored
       --generate-metadata  Generate metadata for all scanned files
       --all                will rescan all files of all known users
       --unscanned          only scan files which are marked as not fully scanned
       --shallow            do not scan folders recursively
       --home-only          only scan the home storage, ignoring any mounted external storage or share
   -h, --help               Display help for the given command. When no command is given display help for the list command
   -q, --quiet              Do not output any message
   -V, --version            Display this application version
       --ansi|--no-ansi     Force (or disable --no-ansi) ANSI output
   -n, --no-interaction     Do not ask any interactive question
       --no-warnings        Skip global warnings, show command output only
   -v|vv|vvv, --verbose     Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug


Verbosity levels of ``-vv`` or ``-vvv`` are automatically reset to ``-v``

Note for option ``--unscanned``:
In general there is a background job (through cron) that will do that scan periodically.
The ``--unscanned`` option makes it possible to trigger this from the CLI.

When using the ``--path`` option, the path must consist of following
components::

  "user_id/files/path"
    or
  "user_id/files/mount_name"
    or
  "user_id/files/mount_name/path"

where the term ``files`` is mandatory.

Example::

  --path="/alice/files/Music"

In the example above, the user_id ``alice`` is determined implicitly from the
path component given.

The ``--path``, ``--all`` and ``[user_id]`` parameters are exclusive - only
one must be specified.

Scan appdata
^^^^^^^^^^^^^

Appdata is a folder inside of the data directory which contains files that
are shared between users and can be put there by the server or apps like
avatar images, file previews and cached CSS files for example.

Since the regular files scan only operates on user files the ``occ files:scan-app-data``
command will check the appdata directory and make sure that the filecache is consistent
with the files on the actual storage.::

  Usage:
    files:scan-app-data [options] [--] [<folder>]

  Arguments:
    folder                 The appdata subfolder to scan [default: ""]

.. _occ_cleanup_previews:

Cleanup previews
^^^^^^^^^^^^^^^^

``preview:cleanup`` removes all of the server's preview files. This is useful
when changing the previews configuration (sizes, quality or file), and especially
on systems using Object Storage as Primary Storage where the ``appdata_xxx/preview``
folder can't simply be deleted.

See :doc:`configuration_files/previews_configuration`.


Cleanup
^^^^^^^

``files:cleanup`` tidies up the server's file cache by deleting all file
entries that have no matching entries in the storage table.

Repair-Tree
^^^^^^^^^^^

``files:repair-tree`` try and repair malformed filesystem tree structures.
If for any reason the path of an entry in the filecache doesn't match with
it's expected path, based on the path of it's parent node, you end up with an
entry in the filecache that exists in different places based on how the entry
is generated. For example, if while listing folder ``/foo`` it contains a file
``bar.txt``, but when trying to do anything with ``/foo/bar.txt`` the file
doesn't exists.

This command attempts to repair such entries by querying for entries where the path
doesn't match the expected path based on it's parent path and filename and resets it's
path to the expected one.

.. _occ_files_sanitize_filenames:

Sanitize filenames
^^^^^^^^^^^^^^^^^^

This command allows to automatically rename files not matching the current file naming constraints,
for example after enabling the :ref:`Windows compatible filenames <windows_compatible_filenames>`::

 Usage:
   files:sanitize-filenames [options] [--] [<user_id>...]

 Arguments:
   user_id                                 Limit filename sanitizing to files given user(s) have access to

 Options:
      --dry-run                            Do not actually rename any files but just check filenames.
  -c, --char-replacement=CHAR-REPLACEMENT  Replacement for invalid character (by default space, underscore or dash is used)

When running this command without parameters it will scan all files of all users
for filenames not comply with the current filename constraints and try to automatically
rename those files.
Invalid characters will be replaced by default with either a space, underscore, or dash
depending on which characters are allowed.
If your constraints forbid all of them, then you have to provide an character replacement
yourself by specifying the ``--char-replacement`` option.

The ``--dry-run`` option allows to perform the sanitizing without the actual renaming,
this is useful for estimating the execution time and to get an overview on what renaming
actions will be performed.

Transfer
^^^^^^^^

The command ``occ files:transfer-ownership`` can be used to transfer files from one user to another::

 Usage:
   files:transfer-ownership [options] [--] <source-user> <destination-user>

 Arguments:
   source-user                                                owner of files which shall be moved
   destination-user                                           user who will be the new owner of the files

 Options:
       --path=PATH                                            selectively provide the path to transfer. For example --path="folder_name" [default: ""]
       --move                                                 move data from source user to root directory of destination user, which must be empty
       --transfer-incoming-shares[=TRANSFER-INCOMING-SHARES]  transfer incoming user file shares to destination user. Usage: --transfer-incoming-shares=1 (value required) [default: "2"]

You may transfer all files and shares from one user to another. This is useful
before removing a user::

 sudo -E -u www-data php occ files:transfer-ownership <source-user> <destination-user>

The transferred files will appear inside a new sub-directory in the destination user's home.

.. note::
  Unless server side encryption is enabled, **the command will init the <destination-user> file system** in Nextcloud versions **22.2.6, 23.0.3 and since 24**. When it is unable to create the user's folder in the data directory it will show the following error: ``unable to rename, destination directory is not writable``. Before 22.2.6 the command ``occ files:transfer-ownership`` would only work after the user has logged in for the first time.

If the destination user has no files at all (empty home), it is possible to also transfer all the source user's files by passing ``--move``::

 sudo -E -u www-data php occ files:transfer-ownership --move <source-user> <destination-user>

In this case no sub-directory is created and all files will appear directly in the root of the user's home.

It is also possible to transfer only one directory along with its contents. This can be useful to restructure your organization or quotas. The ``--path`` argument is given as the path to the directory as seen from the source user::

 sudo -E -u www-data php occ files:transfer-ownership --path="path_to_dir" <source-user> <destination-user>

Incoming shares are not moved by default because the sharing user holds the ownership of the respective files. There is however an option to enable moving incoming shares.

In case the incoming shares must be transferred as well, use the argument ``--transfer-incoming-shares`` with ``0`` or ``1`` as parameters ::

 sudo -E -u www-data php occ files:transfer-ownership --transfer-incoming-shares=1 --path="path_to_dir" <source-user> <destination-user>

As an alternative, the system configuration option ``transferIncomingShares`` in config.php can be set to ``true`` to always transfer incoming shares.

The command line option ``--transfer-incoming-shares`` overwrites the config.php option ``transferIncomingShares``. For example, ``'transferIncomingShares => true`` can be overwritten by: ::

 sudo -E -u www-data php occ files:transfer-ownership --transfer-incoming-shares=0 <source-user> <destination-user>

Users may also transfer files or folders selectively by themselves.
See `user documentation <https://docs.nextcloud.com/server/latest/user_manual/en/files/transfer_ownership.html>`_ for details.

.. _occ_files_windows_filenames:

Toggle Windows compatibility
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The command ``occ files:windows-compatible-filenames`` can be used to toggle
enforcing :ref:`Windows compatible filenames <windows_compatible_filenames>`::

 Usage:
   files:windows-compatible-filenames [options]

 Options:
       --enable                  enable enforcing windows compatible filenames
       --disable                 disable enforcing windows compatible filenames

.. _occ_sharing_label:

Files Sharing
-------------

Commands for handling shares::

 sharing
  sharing:cleanup-remote-storages  Cleanup shared storage entries that have no matching entry in the shares_external table
  sharing:expiration-notification  Notify share initiators when a share will expire the next day
  sharing:delete-orphan-shares     Delete shares where the owner no longer has access to the file or the file is not available anymore

.. _files_external_label:

Files external
--------------

These commands are used for managing Nextcloud's *External Storage* feature. In
addition to replicating the configuration capabilities in the Web UI, additional
capabilities include exporting / importing configurations, scanning *External
Storage* mounts that require login credentials, and configuring update notifications
(if supported by the storage type).

.. note::
  These commands are only available when the "External storage support" app
  (``files_external``) is enabled.

Available commands for the "files_external" namespace::

  files_external:applicable   Manage applicable users and groups for a mount
  files_external:backends     Show available authentication and storage backends
  files_external:config       Manage backend configuration for a mount
  files_external:create       Create a new mount configuration
  files_external:delete       Delete an external mount
  files_external:export       Export mount configurations
  files_external:import       Import mount configurations
  files_external:list         List configured admin or personal mounts
  files_external:notify       Listen for active update notifications for a configured external mount
  files_external:option       Manage mount options for a mount
  files_external:scan         Scan an external storage for changed files
  files_external:verify       Verify mount configuration
  files_external:dependencies Check for any missing dependencies needed for mounting external storages

``files_external:scan`` provides the ability to provide a username and/or password for cases where login credentials are used.

Use ``files_external:export`` to export all admin mounts to stdout, and
``files_external:export [user_id]`` to export the mounts of the specified
Nextcloud user.

Use ``files_external:import [filename]`` to import legacy JSON configurations,
and to copy external mount configurations to another Nextcloud server.

.. _integrity_check_label:

Integrity check
---------------

Apps which have a ``Featured`` tag MUST be code signed with Nextcloud. Unsigned featured apps won't be installable anymore. Code signing is optional for all third-party applications::

 integrity
  integrity:check-app                 Check app integrity using a signature.
  integrity:check-core                Check core integrity using a signature.
  integrity:sign-app                  Signs an app using a private key.
  integrity:sign-core                 Sign core using a private key

After creating your signing key, sign your app like this example::

 sudo -E -u www-data php occ integrity:sign-app --privateKey=/Users/lukasreschke/contacts.key --certificate=/Users/lukasreschke/CA/contacts.crt --path=/Users/lukasreschke/Programming/contacts

Verify your app::

  sudo -E -u www-data php occ integrity:check-app --path=/pathto/app appname

When it returns nothing, your app is signed correctly. When it returns a message then there is an error. See `Code Signing
<https://docs.nextcloud.com/server/latest/developer_manual/app_publishing_maintenance/code_signing.html#how-to-get-your-app-signed>`_ in the Developer manual for more detailed information.

``integrity:sign-core`` is for Nextcloud core developers only.

See :doc:`../issues/code_signing` to learn more.

.. _create_javascript_translation_files_label:

l10n, create JavaScript translation files for apps
--------------------------------------------------

This command is for app developers to update their translation mechanism from
ownCloud 7 to Nextcloud.


