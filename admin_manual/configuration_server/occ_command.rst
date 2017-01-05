=====================
Using the occ Command
=====================

Nextcloud's ``occ`` command (origins from "ownCloud Console") is Nextcloud's command-line
interface. You can perform many common server operations with ``occ``, such as 
installing and upgrading Nextcloud, manage users, encryption, passwords, LDAP 
setting, and more.

``occ`` is in the :file:`nextcloud/` directory; for example 
:file:`/var/www/nextcloud` on Ubuntu Linux. ``occ`` is a PHP script. **You must 
run it as your HTTP user** to ensure that the correct permissions are maintained 
on your Nextcloud files and directories.

occ Command Directory
---------------------

* :ref:`http_user_label`
* :ref:`apps_commands_label`
* :ref:`background_jobs_selector_label`
* :ref:`config_commands_label`
* :ref:`dav_label`
* :ref:`database_conversion_label`
* :ref:`encryption_label`
* :ref:`federation_sync_label`
* :ref:`file_operations_label`
* :ref:`files_external_label`
* :ref:`integrity_check_label`
* :ref:`create_javascript_translation_files_label`
* :ref:`ldap_commands_label`
* :ref:`logging_commands_label`
* :ref:`maintenance_commands_label`
* :ref:`security_commands_label`
* :ref:`shibboleth_label`
* :ref:`trashbin_label`
* :ref:`user_commands_label`
* :ref:`versions_label`
* :ref:`command_line_installation_label`
* :ref:`command_line_upgrade_label`
* :ref:`two_factor_auth_label`
* :ref:`disable_user_label`

.. _http_user_label:

Run occ As Your HTTP User
-------------------------

The HTTP user is different on the various Linux distributions. See 
:ref:`strong_perms_label` to learn how to find your HTTP user.
   
* The HTTP user and group in Debian/Ubuntu is www-data.
* The HTTP user and group in Fedora/CentOS is apache.
* The HTTP user and group in Arch Linux is http.
* The HTTP user in openSUSE is wwwrun, and the HTTP group is www.   

If your HTTP server is configured to use a different PHP version than the 
default (/usr/bin/php), ``occ`` should be run with the same version. For 
example, in CentOS 6.5 with SCL-PHP56 installed, the command looks like this::

  sudo -u apache /opt/rh/php56/root/usr/bin/php /var/www/html/nextcloud/occ

Running ``occ`` with no options lists all commands and options, like this 
example on Ubuntu::

 sudo -u www-data php occ 
 Nextcloud version 9.0.0

 Usage:
  command [options] [arguments]

 Options:
  -h, --help            Display this help message
  -q, --quiet           Do not output any message
  -V, --version         Display this application version
      --ansi            Force ANSI output
      --no-ansi         Disable ANSI output
  -n, --no-interaction  Do not ask any interactive question
      --no-warnings     Skip global warnings, show command output only
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 
                        2 for more verbose output and 3 for debug

 Available commands:
  check                 check dependencies of the server 
                        environment
  help                  Displays help for a command
  list                  Lists commands
  status                show some status information
  upgrade               run upgrade routines after installation of 
                        a new release. The release has to be 
                        installed before.

This is the same as ``sudo -u www-data php occ list``.

Run it with the ``-h`` option for syntax help::

 sudo -u www-data php occ -h
 
Display your Nextcloud version::

 sudo -u www-data php occ -V
   Nextcloud version 9.0.0
   
Query your Nextcloud server status::

 sudo -u www-data php occ status
   - installed: true
   - version: 9.0.0.19
   - versionstring: 9.0.0
   - edition: 

``occ`` has options, commands, and arguments. Options and arguments are 
optional, while commands are required. The syntax is::

 occ [options] command [arguments]
 
Get detailed information on individual commands with the ``help`` command, like 
this example for the ``maintenance:mode`` command::

 sudo -u www-data php occ help maintenance:mode
 Usage:
  maintenance:mode [options]

 Options:
      --on              enable maintenance mode
      --off             disable maintenance mode
  -h, --help            Display this help message
  -q, --quiet           Do not output any message
  -V, --version         Display this application version
      --ansi            Force ANSI output
      --no-ansi         Disable ANSI output
  -n, --no-interaction  Do not ask any interactive question
      --no-warnings     Skip global warnings, show command output only
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 
                        2 for more verbose output and 3 for debug

The ``status`` command from above has an option to define the output format.
The default is plain text, but it can also be ``json``::

 sudo -u www-data php occ status --output=json
 {"installed":true,"version":"9.0.0.19","versionstring":"9.0.0","edition":""}

or ``json_pretty``::

 sudo -u www-data php occ status --output=json_pretty
 {
    "installed": true,
    "version": "9.0.0.19",
    "versionstring": "9.0.0",
    "edition": ""
 }

This output option is available on all list and list-like commands:
``status``, ``check``, ``app:list``, ``config:list``, ``encryption:status``
and ``encryption:list-modules``

Enabling autocompletion
-----------------------

.. note:: This currently only works, if the user you use to execute the occ commands has a profile.
  ``www-data`` in most cases is ``nologon`` and therefor can **not** use this.

Since Nextcloud 11 autocompletion is available for bash (and bash based consoles).
To enable it, you have to run **one** of the following commands::

 # BASH ~4.x, ZSH
 source <(/var/www/html/nextcloud/occ _completion --generate-hook)

 # BASH ~3.x, ZSH
 /var/www/html/nextcloud/occ _completion --generate-hook | source /dev/stdin

 # BASH (any version)
 eval $(/var/www/html/nextcloud/occ _completion --generate-hook)

This will allow you to use autocompletion with the full path ``/var/www/html/nextcloud/occ <tab>``.

If you also want to use autocompletion on occ from within the directory without using the full path,
you need to specify ``--programm occ`` after the ``--generate-hook``.

If you want the completion to apply automatically for all new shell sessions, add the command to your
shell's profile (eg. ``~/.bash_profile`` or ``~/.zshrc``).

.. _apps_commands_label:

Apps Commands
-------------

The ``app`` commands list, enable, and disable apps::

 app
  app:check-code   check code to be compliant
  app:disable      disable an app
  app:enable       enable an app
  app:getpath      Get an absolute path to the app directory
  app:list         List all available apps

List all of your installed apps, and show whether they are 
enabled or disabled::

 sudo -u www-data php occ app:list
 
Enable an app, for example the External Storage Support app::

 sudo -u www-data php occ app:enable files_external
 files_external enabled
   
Disable an app::

 sudo -u www-data php occ app:disable files_external
 files_external disabled   
   
``app:check-code`` has multiple checks: it checks if an app uses Nextcloud's 
public API (``OCP``) or private API (``OC_``), and it also checks for deprecated 
methods and the validity of the ``info.xml`` file. By default all checks are 
enabled. The Activity app is an example of a correctly-formatted app::

 sudo -u www-data php occ app:check-code notifications
 App is compliant - awesome job!

If your app has issues, you'll see output like this::

 sudo -u www-data php occ app:check-code foo_app
 Analysing /var/www/nextcloud/apps/files/foo_app.php
 4 errors
    line   45: OCP\Response - Static method of deprecated class must not be 
    called
    line   46: OCP\Response - Static method of deprecated class must not be 
    called
    line   47: OCP\Response - Static method of deprecated class must not be 
    called
    line   49: OC_Util - Static method of private class must not be called

You can get the full filepath to an app::
    
    sudo -u www-data php occ app:getpath notifications
    /var/www/nextcloud/apps/notifications

.. _background_jobs_selector_label:   
   
Background Jobs Selector
------------------------

Use the ``background`` command to select which scheduler you want to use for 
controlling background jobs, Ajax, Webcron, or Cron. This is the same as using 
the **Cron** section on your Nextcloud Admin page::

 background
  background:ajax       Use ajax to run background jobs
  background:cron       Use cron to run background jobs
  background:webcron    Use webcron to run background jobs

This example selects Ajax::

 sudo -u www-data php occ background:ajax
   Set mode for background jobs to 'ajax'

The other two commands are:

* ``background:cron``
* ``background:webcron``

See :doc:`../configuration_server/background_jobs_configuration` to learn more.

.. _config_commands_label:

Config Commands
---------------

The ``config`` commands are used to configure the Nextcloud server::

 config
  config:app:delete      Delete an app config value
  config:app:get         Get an app config value
  config:app:set         Set an app config value
  config:import          Import a list of configs
  config:list            List all configs
  config:system:delete   Delete a system config value
  config:system:get      Get a system config value
  config:system:set      Set a system config value

You can list all configuration values with one command::

 sudo -u www-data php occ config:list

By default, passwords and other sensitive data are omitted from the report, so 
the output can be posted publicly (e.g. as part of a bug report). In order to 
generate a full backport of all configuration values the ``--private`` flag 
needs to be set::

 sudo -u www-data php occ config:list --private

The exported content can also be imported again to allow the fast setup of 
similar instances. The import command will only add or update values. Values 
that exist in the current configuration, but not in the one that is being 
imported are left untouched::

 sudo -u www-data php occ config:import filename.json

It is also possible to import remote files, by piping the input::

 sudo -u www-data php occ config:import < local-backup.json

.. note::

  While it is possible to update/set/delete the versions and installation
  statuses of apps and Nextcloud itself, it is **not** recommended to do this
  directly. Use the ``occ app:enable``, ``occ app:disable`` and ``occ update``
  commands instead.  

Getting a Single Configuration Value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These commands get the value of a single app or system configuration::

  sudo -u www-data php occ config:system:get version
  9.0.0.19

  sudo -u www-data php occ config:app:get activity installed_version
  2.2.1

Setting a Single Configuration Value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These commands set the value of a single app or system configuration::

  sudo -u www-data php occ config:system:set logtimezone 
  --value="Europe/Berlin"
  System config value logtimezone set to Europe/Berlin

  sudo -u www-data php occ config:app:set files_sharing 
  incoming_server2server_share_enabled --value="yes" --type=boolean
  Config value incoming_server2server_share_enabled for app files_sharing set to yes

The ``config:system:set`` command creates the value, if it does not already 
exist. To update an existing value,  set ``--update-only``::

  sudo -u www-data php occ config:system:set doesnotexist --value="true" 
  --type=boolean --update-only
  Value not updated, as it has not been set before.

Note that in order to write a Boolean, float, or integer value to the 
configuration file, you need to specify the type on your command. This 
applies only to the ``config:system:set`` command. The following values are 
known:

* ``boolean``
* ``integer``
* ``float``
* ``string`` (default)

When you want to e.g. disable the maintenance mode run the following command::

  sudo -u www-data php occ config:system:set maintenance --value=false 
  --type=boolean
  Nextcloud is in maintenance mode - no app have been loaded
  System config value maintenance set to boolean false

Setting an array Configuration Value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Some configurations (e.g. the trusted domain setting) are an array of data.
In order to set (and also get) the value of one key, you can specify multiple
``config`` names separated by spaces::

  sudo -u www-data php occ config:system:get trusted_domains
  localhost
  nextcloud.local
  sample.tld

To replace ``sample.tld`` with ``example.com`` trusted_domains => 2 needs to be
set::

  sudo -u www-data php occ config:system:set trusted_domains 2 
  --value=example.com
  System config value trusted_domains => 2 set to string example.com

  sudo -u www-data php occ config:system:get trusted_domains
  localhost
  nextcloud.local
  example.com

Deleting a Single Configuration Value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These commands delete the configuration of an app or system configuration::

  sudo -u www-data php occ config:system:delete maintenance:mode
  System config value maintenance:mode deleted

  sudo -u www-data php occ config:app:delete appname provisioning_api
  Config value provisioning_api of app appname deleted

The delete command will by default not complain if the configuration was not set
before. If you want to be notified in that case, set the
``--error-if-not-exists`` flag::

  sudo -u www-data php occ config:system:delete doesnotexist 
  --error-if-not-exists
  Config provisioning_api of app appname could not be deleted because it did not 
  exist
  
.. _dav_label:  
   
Dav Commands
------------
  
A set of commands to create addressbooks, calendars, and to 
migrate addressbooks from 8.2 when you upgrade to 9.0::

 dav
  dav:create-addressbook        Create a dav addressbook
  dav:create-calendar           Create a dav calendar
  dav:migrate-addressbooks      Migrate addressbooks from the contacts  
                                app to core
  dav:migrate-calendars         Migrate calendars from the calendar app to 
                                core
  dav:sync-birthday-calendar    Synchronizes the birthday calendar
  dav:sync-system-addressbook   Synchronizes users to the system 
                                addressbook
                                   
                                      
The syntax for ``dav:create-addressbook`` and  ``dav:create-calendar`` is 
``dav:create-addressbook [user] [name]``. This example creates the addressbook 
``mollybook`` for the user molly::

 sudo -u www-data php occ dav:create-addressbook molly mollybook

This example creates a new calendar for molly::

 sudo -u www-data php occ dav:create-calendar molly mollycal
 
Molly will immediately see these on her Calendar and Contacts pages.

In 9.0, the CalDAV server has been integrated into core. Your existing 
calendars and contacts should migrate automatically when you upgrade. If 
something goes wrong you can try a manual migration. First delete any 
partially-migrated calendars or addressbooks. Then run this 
command to migrate user's contacts::

 sudo -u www-data php occ dav:migrate-addressbooks [user]
 
Run this command to migrate calendars::

 sudo -u www-data php occ dav:migrate-calendars [user]
 
See `ownCloud 9.0 - calendar migration analysis
<http://morrisjobke.de/2016/03/07/ownCloud-9.0-calendar-migration-analysis/>`_ 
for help with troubleshooting and reporting problems. 

``dav:sync-birthday-calendar`` adds all birthdays to your calendar from 
addressbooks shared with you. This example syncs to your calendar from user 
bernie::

 sudo -u www-data php occ dav:sync-birthday-calendar bernie
 
``dav:sync-system-addressbook`` synchronizes all users to the system 
addressbook::

 sudo -u www-data php occ dav:sync-system-addressbook

.. _database_conversion_label:  
  
Database Conversion
-------------------

The SQLite database is good for testing, and for Nextcloud servers with small 
single-user workloads that do not use sync clients, but production servers with 
multiple users should use MariaDB, MySQL, or PostgreSQL. You can use ``occ`` to 
convert from SQLite to one of these other databases.

::

 db
  db:convert-type           Convert the Nextcloud database to the newly 
                            configured one
  db:generate-change-script generates the change script from the current 
                            connected db to db_structure.xml

You need:

* Your desired database and its PHP connector installed.
* The login and password of a database admin user.
* The database port number, if it is a non-standard port.

This is example converts SQLite to MySQL/MariaDB:: 

 sudo -u www-data php occ db:convert-type mysql oc_dbuser 127.0.0.1 
 oc_database

For a more detailed explanation see 
:doc:`../configuration_database/db_conversion`

.. _encryption_label:

Encryption
----------

``occ`` includes a complete set of commands for managing encryption::

 encryption
  encryption:change-key-storage-root   Change key storage root
  encryption:decrypt-all               Disable server-side encryption and 
                                       decrypt all files
  encryption:disable                   Disable encryption
  encryption:enable                    Enable encryption
  encryption:enable-master-key         Enable the master key. Only available 
                                       for fresh installations with no existing 
                                       encrypted data! There is also no way to 
                                       disable it again.
  encryption:encrypt-all               Encrypt all files for all users
  encryption:list-modules              List all available encryption modules
  encryption:migrate                   initial migration to encryption 2.0
  encryption:set-default-module        Set the encryption default module
  encryption:show-key-storage-root     Show current key storage root
  encryption:status                    Lists the current status of encryption
  
``encryption:status`` shows whether you have active encryption, and your default 
encryption module. To enable encryption you must first enable the Encryption 
app, and then run ``encryption:enable``::

 sudo -u www-data php occ app:enable encryption
 sudo -u www-data php occ encryption:enable
 sudo -u www-data php occ encryption:status
  - enabled: true
  - defaultModule: OC_DEFAULT_MODULE
   
``encryption:change-key-storage-root`` is for moving your encryption keys to a 
different folder. It takes one argument, ``newRoot``, which defines your new 
root folder::

 sudo -u www-data php occ encryption:change-key-storage-root /etc/oc-keys
 
You can see the current location of your keys folder::

 sudo -u www-data php occ encryption:show-key-storage-root
 Current key storage root:  default storage location (data/)
 
``encryption:list-modules`` displays your available encryption modules. You will 
see a list of modules only if you have enabled the Encryption app. Use 
``encryption:set-default-module [module name]`` to set your desired module.

``encryption:encrypt-all`` encrypts all data files for all users. You must first 
put your Nextcloud server into :ref:`single-user 
mode<maintenance_commands_label>` to prevent any user activity until encryption 
is completed.

``encryption:decrypt-all`` decrypts all user data files, or optionally a single 
user::

 sudo -u www-data php occ encryption:decrypt freda

Users must have enabled recovery keys on their Personal pages. You must first 
put your Nextcloud server into :ref:`single-user 
mode <maintenance_commands_label>` to prevent any user activity until 
decryption is completed.

Use ``encryption:disable`` to disable your encryption module. You must first put 
your Nextcloud server into :ref:`single-user mode <maintenance_commands_label>` 
to prevent any user activity.

``encryption:enable-master-key`` creates a new master key, which is used for all 
user data instead of individual user keys. This is especially useful to enable 
single-sign on. Use this only on fresh installations with no existing data, or 
on systems where encryption has not already been enabled. It is not possible to 
disable it.

``encryption:migrate`` migrates encryption keys after a major Nextcloud version 
upgrade. You may optionally specify individual users in a space-delimited list.

See :doc:`../configuration_files/encryption_configuration` to learn more.
 
.. _federation_sync_label:
 
Federation Sync
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

  sudo -u www-data php occ federation:sync-addressbooks

.. _file_operations_label:

File Operations
---------------

``occ`` has three commands for managing files in Nextcloud::

 files
  files:cleanup              cleanup filecache
  files:scan                 rescan filesystem
  files:transfer-ownership   All files and folders are moved to another 
                             user - shares are moved as well.
 
The ``files:scan`` command scans for new files and updates the file cache. You 
may rescan all files, per-user, a space-delimited list of users, and limit the 
search path. If not using ``--quiet``, statistics will be shown at the end of 
the scan::

 sudo -u www-data php occ files:scan --help
   Usage:
   files:scan [-p|--path="..."] [-q|--quiet] [-v|vv|vvv --verbose] [--all] 
   [user_id1] ... [user_idN]

 Arguments:
   user_id               will rescan all files of the given user(s)

 Options:
   --path                limit rescan to the user/path given
   --all                 will rescan all files of all known users
   --quiet               suppress any output
   --verbose             files and directories being processed are shown 
                         additionally during scanning
   --unscanned           scan only previously unscanned files

Verbosity levels of ``-vv`` or ``-vvv`` are automatically reset to ``-v``

Note for option --unscanned:
In general there is a background job (through cron) that will do that scan periodically.
The --unscanned option makes it possible to trigger this from the CLI.

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

The ``--path``, ``--all`` and ``[user_id]`` parameters and are exclusive - only 
one must be specified.

``files:cleanup`` tidies up the server's file cache by deleting all file 
entries that have no matching entries in the storage table. 

You may transfer all files and shares from one user to another. This is useful 
before removing a user::

 sudo -u www-data php occ files:transfer-ownership <source-user>
 <destination-user>

.. _files_external_label:

Files External
--------------

.. note::
  These commands are only available when the "External storage support" app
  (``files_external``) is enabled.

Commands for managing external storage::

 files_external
  files_external:applicable  Manage applicable users and groups for a mount
  files_external:backends    Show available authentication and storage backends
  files_external:config      Manage backend configuration for a mount
  files_external:create      Create a new mount configuration
  files_external:delete      Delete an external mount
  files_external:export      Export mount configurations
  files_external:import      Import mount configurations
  files_external:list        List configured mounts
  files_external:option      Manage mount options for a mount
  files_external:verify      Verify mount configuration
  files_external:notify      Listen for active update notifications for a configured external mount

These commands replicate the functionality in the Nextcloud Web GUI, plus two new 
features:  ``files_external:export`` and ``files_external:import``. 

Use ``files_external:export`` to export all admin mounts to stdout, and 
``files_external:export [user_id]`` to export the mounts of the specified 
Nextcloud user. 

Use ``files_external:import [filename]`` to import legacy JSON configurations, 
and to copy external mount configurations to another Nextcloud server.

.. _integrity_check_label:

Integrity Check
---------------

Apps which have an official tag MUST be code signed with Nextcloud. Unsigned official apps won't be installable anymore. Code signing is optional for all third-party applications::

 integrity
  integrity:check-app                 Check app integrity using a signature.
  integrity:check-core                Check core integrity using a signature.
  integrity:sign-app                  Signs an app using a private key.
  integrity:sign-core                 Sign core using a private key
  
After creating your signing key, sign your app like this example:: 
 
 sudo -u www-data php occ integrity:sign-app --privateKey=/Users/lukasreschke/contacts.key --certificate=/Users/lukasreschke/CA/contacts.crt --path=/Users/lukasreschke/Programming/contacts
 
Verify your app::

  sudo -u www-data php occ integrity:check-app --path=/pathto/app appname
  
When it returns nothing, your app is signed correctly. When it returns a message then there is an error. See `Code Signing 
<https://docs.nextcloud.org/server/11/developer_manual/app/code_signing.html#how-to-get-your-app-signed>`_ in the Developer manual for more detailed information.
.. TODO ON RELEASE: Update version number above on release

``integrity:sign-core`` is for Nextcloud core developers only.

See :doc:`../issues/code_signing` to learn more.

.. _create_javascript_translation_files_label:
 
l10n, Create Javascript Translation Files for Apps
--------------------------------------------------

This command is for app developers to update their translation mechanism from
ownCloud 7 to Nextcloud.

.. _ldap_commands_label: 
 
LDAP Commands
-------------

.. note::
  These commands are only available when the "LDAP user and group backend" app
  (``user_ldap``) is enabled.

These LDAP commands appear only when you have enabled the LDAP app. Then 
you can run the following LDAP commands with ``occ``::

 ldap
  ldap:check-user               checks whether a user exists on LDAP.
  ldap:create-empty-config      creates an empty LDAP configuration
  ldap:delete-config            deletes an existing LDAP configuration
  ldap:search                   executes a user or group search
  ldap:set-config               modifies an LDAP configuration
  ldap:show-config              shows the LDAP configuration
  ldap:show-remnants            shows which users are not available on 
                                LDAP anymore, but have remnants in 
                                Nextcloud.
  ldap:test-config              tests an LDAP configuration

Search for an LDAP user, using this syntax::

 sudo -u www-data php occ ldap:search [--group] [--offset="..."] 
 [--limit="..."] search

Searches will match at the beginning of the attribute value only. This example 
searches for givenNames that start with "rob"::

 sudo -u www-data php occ ldap:search "rob"
 
This will find robbie, roberta, and robin. Broaden the search to find, for 
example, ``jeroboam`` with the asterisk wildcard::

 sudo -u www-data php occ ldap:search "*rob"

User search attributes are set with ``ldap:set-config`` 
(below). For example, if your search attributes are 
``givenName`` and ``sn`` you can find users by first name + last name very 
quickly. For example, you'll find Terri Hanson by searching for ``te ha``. 
Trailing whitespaces are ignored.
 
Check if an LDAP user exists. This works only if the Nextcloud server is 
connected to an LDAP server::

 sudo -u www-data php occ ldap:check-user robert
 
``ldap:check-user`` will not run a check when it finds a disabled LDAP 
connection. This prevents users that exist on disabled LDAP connections from 
being marked as deleted. If you know for certain that the user you are searching for 
is not in one of the disabled connections, and exists on an active connection, 
use the ``--force`` option to force it to check all active LDAP connections::

 sudo -u www-data php occ ldap:check-user --force robert

``ldap:create-empty-config`` creates an empty LDAP configuration. The first 
one you create has no ``configID``, like this example::

 sudo -u www-data php occ ldap:create-empty-config
   Created new configuration with configID ''
   
This is a holdover from the early days, when there was no option to create 
additional configurations. The second, and all subsequent, configurations 
that you create are automatically assigned IDs::
 
 sudo -u www-data php occ ldap:create-empty-config
    Created new configuration with configID 's01' 
 
Then you can list and view your configurations::

 sudo -u www-data php occ ldap:show-config
 
And view the configuration for a single configID::

 sudo -u www-data php occ ldap:show-config s01
 
``ldap:delete-config [configID]`` deletes an existing LDAP configuration:: 

 sudo -u www-data php occ ldap:delete  s01
 Deleted configuration with configID 's01'
 
The ``ldap:set-config`` command is for manipulating configurations, like this 
example that sets search attributes::
 
 sudo -u www-data php occ ldap:set-config s01 ldapAttributesForUserSearch 
 "cn;givenname;sn;displayname;mail"
 
``ldap:test-config`` tests whether your configuration is correct and can bind to 
the server::

 sudo -u www-data php occ ldap:test-config s01
 The configuration is valid and the connection could be established!
 
``ldap:show-remnants`` is for cleaning up the LDAP mappings table, and is 
documented in :doc:`../configuration_user/user_auth_ldap_cleanup`.

.. _logging_commands_label:

Logging Commands
----------------

These commands view and configure your Nextcloud logging preferences::

 log
  log:manage     manage logging configuration
  log:owncloud   manipulate Nextcloud logging backend

Run ``log:owncloud`` to see your current logging status::

 sudo -u www-data php occ log:owncloud 
 Log backend Nextcloud: enabled
 Log file: /opt/nextcloud/data/nextcloud.log
 Rotate at: disabled

Use the ``--enable`` option to turn on logging. Use ``--file`` to set a 
different log file path. Set your rotation by log file size in bytes with 
``--rotate-size``; 0 disables rotation. 

``log:manage`` sets your logging backend, log level, and timezone. The defaults 
are ``owncloud``, ``Warning``, and ``UTC``. Available options are:

* --backend [owncloud, syslog, errorlog]
* --level [debug, info, warning, error]

.. _maintenance_commands_label:
   
Maintenance Commands
--------------------

Use these commands when you upgrade Nextcloud, manage encryption, perform 
backups and other tasks that require locking users out until you are finished::

 maintenance
  maintenance:mimetype:update-db       Update database mimetypes and update 
                                       filecache
  maintenance:mimetype:update-js       Update mimetypelist.js
  maintenance:mode                     set maintenance mode
  maintenance:repair                   repair this installation
  maintenance:singleuser               set single user mode

``maintenance:mode`` locks the sessions of all logged-in users, including 
administrators, and displays a status screen warning that the server is in 
maintenance mode. Users who are not already logged in cannot log in until 
maintenance mode is turned off. When you take the server out of maintenance mode 
logged-in users must refresh their Web browsers to continue working::

 sudo -u www-data php occ maintenance:mode --on
 sudo -u www-data php occ maintenance:mode --off
 
Putting your Nextcloud server into single-user mode allows admins to log in and 
work, but not ordinary users. This is useful for performing maintenance and 
troubleshooting on a running server::

 sudo -u www-data php occ maintenance:singleuser --on
 Single user mode enabled
   
Turn it off when you're finished::

 sudo -u www-data php occ maintenance:singleuser --off
 Single user mode disabled

The ``maintenance:repair`` command runs automatically during upgrades to clean 
up the database, so while you can run it manually there usually isn't a need 
to::
  
 sudo -u www-data php occ maintenance:repair
 
``maintenance:mimetype:update-db`` updates the Nextcloud database and file cache 
with changed mimetypes found in ``config/mimetypemapping.json``. Run this 
command after modifying ``config/mimetypemapping.json``. If you change a 
mimetype, run ``maintenance:mimetype:update-db --repair-filecache`` to apply the 
change to existing files.

.. _security_commands_label:

Security
--------

Use these commands to manage server-wide SSL certificates. These are useful when you create federation shares with other Nextcloud servers that use self-signed certificates::

 security
  security:certificates         list trusted certificates
  security:certificates:import  import trusted certificate
  security:certificates:remove  remove trusted certificate

This example lists your installed certificates::

 sudo -u www-data php occ security:certificates
 
Import a new certificate::

 sudo -u www-data php occ security:import /path/to/certificate
 
Remove a certificate::

 sudo -u www-data php occ security:remove [certificate name]

.. _shibboleth_label:

Shibboleth Modes (Enterprise Edition only)
------------------------------------------

.. note::
  This command is only available when the "Shibboleth user backend" app
  (``user_shibboleth``) is enabled.

``shibboleth:mode`` sets your Shibboleth mode to ``notactive``, 
``autoprovision``, or ``ssoonly``::

 shibboleth:mode [mode]

.. _trashbin_label: 

Trashbin
--------

.. note::
  This command is only available when the "Deleted files" app
  (``files_trashbin``) is enabled.

The ``trashbin:cleanup`` command removes the deleted files of the specified 
users in a space-delimited list, or all users if none are specified.

::
 
 trashbin
  trashbin:cleanup   Remove deleted files
  
This example removes the deleted files of all users::  
  
  sudo -u www-data php occ trashbin:cleanup 
  Remove all deleted files
  Remove deleted files for users on backend Database
   freda
   molly
   stash
   rosa 
   edward

This example removes the deleted files of users molly and freda::  

 sudo -u www-data php occ trashbin:cleanup molly freda
 Remove deleted files of   molly
 Remove deleted files of   freda

.. _user_commands_label: 
 
User Commands
-------------

The ``user`` commands create and remove users, reset passwords, display a simple 
report showing how many users you have, and when a user was last logged in::

 user
  user:add                            adds a user
  user:delete                         deletes the specified user
  user:disable                        disables the specified user
  user:enable                         enables the specified user
  user:lastseen                       shows when the user was logged in last time
  user:report                         shows how many users have access
  user:resetpassword                  Resets the password of the named user
  user:setting                        Read and modify user settings


You can create a new user with their display name, login name, and any group 
memberships with the ``user:add`` command. The syntax is::

 user:add [--password-from-env] [--display-name[="..."]] [-g|--group[="..."]] 
 uid

The ``display-name`` corresponds to the **Full Name** on the Users page in your 
Nextcloud Web UI, and the ``uid`` is their **Username**, which is their 
login name. This example adds new user Layla Smith, and adds her to the 
**users** and **db-admins** groups. Any groups that do not exist are created:: 
 
 sudo -u www-data php occ user:add --display-name="Layla Smith" 
   --group="users" --group="db-admins" layla
   Enter password: 
   Confirm password: 
   The user "layla" was created successfully
   Display name set to "Layla Smith"
   User "layla" added to group "users"
   User "layla" added to group "db-admins"

Go to your Users page, and you will see your new user.   

``password-from-env`` allows you to set the user's password from an environment 
variable. This prevents the password from being exposed to all users via the 
process list, and will only be visible in the history of the user (root) 
running the command. This also permits creating scripts for adding multiple new 
users.

To use ``password-from-env`` you must run as "real" root, rather than ``sudo``, 
because ``sudo`` strips environment variables. This example adds new user Fred 
Jones::

 export OC_PASS=newpassword
 su -s /bin/sh www-data -c 'php occ user:add --password-from-env 
   --display-name="Fred Jones" --group="users" fred'
 The user "fred" was created successfully
 Display name set to "Fred Jones"
 User "fred" added to group "users" 

You can reset any user's password, including administrators (see 
:doc:`../configuration_user/reset_admin_password`)::

 sudo -u www-data php occ user:resetpassword layla
   Enter a new password: 
   Confirm the new password: 
   Successfully reset password for layla
   
You may also use ``password-from-env`` to reset passwords::

 export OC_PASS=newpassword
 su -s /bin/sh www-data -c 'php occ user:resetpassword --password-from-env 
   layla'
   Successfully reset password for layla
   
You can delete users::

 sudo -u www-data php occ user:delete fred
   
View a user's most recent login::   
   
 sudo -u www-data php occ user:lastseen layla 
   layla's last login: 09.01.2015 18:46

Read user settings::

 sudo -u www-data php occ user:setting layla
   - core:
     - lang: en
   - login:
     - lastLogin: 1465910968
   - settings:
     - email: layla@example.tld

Filter by app::

 sudo -u www-data php occ user:setting layla core
   - core:
     - lang: en

Get a single setting::

 sudo -u www-data php occ user:setting layla core lang
 en

Set a setting::

 sudo -u www-data php occ user:setting layla settings email "new-layla@example.tld"

Delete a setting::

 sudo -u www-data php occ user:setting layla settings email --delete

Generate a simple report that counts all users, including users on external user
authentication servers such as LDAP::

 sudo -u www-data php occ user:report
 +------------------+----+
 | User Report      |    |
 +------------------+----+
 | Database         | 12 |
 | LDAP             | 86 |
 |                  |    |
 | total users      | 98 |
 |                  |    |
 | user directories | 2  |
 +------------------+----+
 
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
  
This example deletes all versions for all users::

 sudo -u www-data php occ versions:cleanup
 Delete all versions
 Delete versions for users on backend Database
   freda
   molly
   stash
   rosa
   edward

You can delete versions for specific users in a space-delimited list::

 sudo -u www-data php occ versions:cleanup
 Delete versions of   freda
 Delete versions of   molly 
 
.. _command_line_installation_label: 
 
Command Line Installation
-------------------------

These commands are available only after you have downloaded and unpacked the 
Nextcloud archive, and taken no further installation steps.

You can install Nextcloud entirely from the command line. After downloading the 
tarball and copying Nextcloud into the appropriate directories you can use ``occ`` 
commands in place of running the graphical Installation Wizard.

Apply correct permissions to your Nextcloud directories; see 
:ref:`strong_perms_label`. Then choose your ``occ`` options. This lists your 
available options::

 sudo -u www-data php /var/www/nextcloud/occ
 Nextcloud is not installed - only a limited number of commands are available
 Nextcloud version 9.0.0

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
  app:check-code        check code to be compliant
  l10n
  l10n:createjs         Create javascript translation files for a given app
  maintenance
  maintenance:install   install Nextcloud
  
Display your ``maintenance:install`` options::

 sudo -u www-data php occ help maintenance:install
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
  --database-table-prefix  Prefix for all tables (default: oc_)
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
 sudo -u www-data php occ maintenance:install --database 
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
   
Command Line Upgrade
--------------------

These commands are available only after you have downloaded upgraded packages or 
tar archives, and before you complete the upgrade.

List all options, like this example on CentOS Linux::

 sudo -u apache php occ upgrade -h
 Usage:
 upgrade [--skip-migration-test] [--dry-run] [--no-app-disable]

 Options:
 --skip-migration-test  skips the database schema migration simulation and 
    update directly
 --dry-run              only runs the database schema migration simulation, do 
   not actually update
 --no-app-disable       skips the disable of third party apps
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

 sudo -u www-data php occ upgrade
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

 sudo -u www-data php occ upgrade -v
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

Before completing the upgrade, Nextcloud first runs a simulation by copying all 
database tables to new tables, and then performs the upgrade on them, to ensure 
that the upgrade will complete correctly. The copied tables are deleted after 
the upgrade. This takes twice as much time, which on large installations can be 
many hours, so you can omit this step with the ``--skip-migration-test`` 
option::

 sudo -u www-data php occ upgrade --skip-migration-test

You can perform this simulation manually with the ``--dry-run`` option::

 sudo -u www-data php occ upgrade --dry-run

.. _two_factor_auth_label:

Two-factor Authentication
-------------------------
If a two-factor provider app is enabled, it is enabled for all users by default
(though the provider can decide whether or not the user has to pass the challenge).
In the case of an user losing access to the second factor (e.g. lost phone with
two-factor SMS verification), the admin can temporarily disable the two-factor
check for that user via the occ command::

 sudo -u www-data php occ twofactor:disable <username>

To re-enable two-factor auth again use the following commmand::

 sudo -u www-data php occ twofactor:enable <username>

.. _disable_user_label:

Disable Users
-------------
Admins can disable users via the occ command too::

 sudo -u www-data php occ user:disable <username>

Use the following command to enable the user again::

 sudo -u www-data php occ user:enable <username>

Note that once users are disabled, their connected browsers will be disconnected.
