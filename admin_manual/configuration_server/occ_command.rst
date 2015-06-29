=====================
Using the occ Command
=====================

ownCloud's ``occ`` command (ownCloud console) is ownCloud's command-line 
interface. You can perform many common server operations with ``occ``::

* Manage apps
* Manage users
* Reset passwords, including administrator passwords
* Convert the ownCloud database from SQLite to a more performant DB
* Query and change LDAP settings

``occ`` is in the :file:`owncloud/` directory; for example 
:file:`/var/www/owncloud` on Ubuntu Linux. ``occ`` is a PHP script. You must run 
it as your HTTP user to ensure that the correct permissions are maintained on 
your ownCloud files and directories.

.. _http_user:

Run occ As Your HTTP User
-------------------------

The HTTP user is different on the various Linux distributions. See 
:ref:`strong_perms` to learn how to find your HTTP user
   
* The HTTP user and group in Debian/Ubuntu is www-data.
* The HTTP user and group in Fedora/CentOS is apache.
* The HTTP user and group in Arch Linux is http.
* The HTTP user in openSUSE is wwwrun, and the HTTP group is www.   

Running it with no options lists all commands and options, like this example on 
Ubuntu::

 $ sudo -u www-data php occ
 ownCloud version 8.1
 Usage:
  [options] command [arguments]

 Options:
  --help (-h)           Display this help message
  --quiet (-q)          Do not output any message
  --verbose (-v|vv|vvv) Increase the verbosity of messages: 1 for normal 
                        output, 2 for more verbose output and 3 for debug
  --version (-V)        Display this application version
  --ansi                Force ANSI output
  --no-ansi             Disable ANSI output
  --no-interaction (-n) Do not ask any interactive question

 Available commands:
  check                       check dependencies of the server environment
  help                        Displays help for a command
  list                        Lists commands
  status                      show some status information
  upgrade                     run upgrade routines after installation of a new 
                              release. The release has to be installed before.

This is the same as ``sudo -u www-data php occ list``.

Run it with the ``-h`` option for syntax help::

 $ sudo -u www-data php occ -h
 
Display your ownCloud version::

 $ sudo -u www-data php occ -V
   ownCloud version 8.1
   
Query your ownCloud server status::

 $ sudo -u www-data php occ status
   - installed: true
   - version: 8.1.0.4
   - versionstring: 8.1 alpha 3
   - edition:
   
``occ`` has options, commands, and arguments. Options and arguments are 
optional, while commands are required. The syntax is::

 occ [options] command [arguments]
 
Get detailed information on individual commands with the ``help`` command, like 
this example for the ``maintenance:mode`` command::

 $ sudo -u www-data php occ help maintenance:mode
   Usage:
   maintenance:mode [--on] [--off]

   Options:
   --on                  enable maintenance mode
   --off                 disable maintenance mode
   --help (-h)           Display this help message.
   --quiet (-q)          Do not output any message.
   --verbose (-v|vv|vvv) Increase the verbosity of messages: 1 for normal 
   output, 2 for more verbose output and 3 for debug
   --version (-V)        Display this application version.
   --ansi                Force ANSI output.
   --no-ansi             Disable ANSI output.
   --no-interaction (-n) Do not ask any interactive question.

The ``status`` command from above has an option to define the output format.
Default is plain text, but it can also be ``json``::

 $ sudo -u www-data php status --output json
 {"installed":true,"version":"8.1.0.4","versionstring":"8.1 alpha 3",
 "edition":"Enterprise"}

or ``json_pretty``::

 $ sudo -u www-data php status --output json_pretty
 {
     "installed": true,
     "version": "8.1.0.4",
     "versionstring": "8.1 alpha 3",
     "edition": "Enterprise"
 }

This ``output`` option is available on all list and list-like commands:
``status``, ``check``, ``app:list``, ``encryption:status``
and ``encryption:list-modules``

Apps Commands
-------------

The ``app`` commands list, enable, and disable apps. This lists all of your 
installed apps, and shows whether they are enabled or disabled::

 $ sudo -u www-data php occ app:list
 
Enable an app::

 $ sudo -u www-data php occ app:enable external
   external enabled
   
``app:check-code`` checks if the app uses ownCloud's public API (``OCP``) or 
private API (``OC_``). If the app uses the private API it will print a
warning::

  $ sudo -u www-data php occ app:check-code activity
    [snip]
    Analysing /var/www/owncloud/apps/activity/extension/files_sharing.php
    0 errors
    Analysing /var/www/owncloud/apps/activity/extension/files.php
    0 errors
  App is not compliant
   
Disable an app::

 $ sudo -u www-data php occ app:disable external
   external disabled   
   
Background Jobs Selector
------------------------

Select which scheduler you want to use for controlling background jobs: Ajax, 
Webcron, or Cron. This is the same as using the **Cron** section on your Admin 
page.

This example selects Ajax::

 $ sudo -u www-data php occ background:ajax
   Set mode for background jobs to 'ajax'

The other two commands are:

* ``background:cron``
* ``background:webcron``

See :doc:`../configuration_server/background_jobs_configuration` to learn more.

Database Conversion
-------------------

The SQLite database is good for testing, and for ownCloud servers with small 
workloads, but production servers with multiple users should use MariaDB, MySQL, 
or PostgreSQL. You can use ``occ`` to convert from SQLite to one of these other 
databases. You need:

* Your desired database and its PHP connector installed
* The login and password of a database admin user
* The database port number, if it is a non-standard port

This is example converts to SQLite MySQL/MariaDB:: 

 $ sudo -u www-data php occ db:convert-type mysql oc_dbuser 127.0.0.1 
 oc_database

For a more detailed explanation see 
:doc:`../configuration_database/db_conversion`

Encryption
----------

When you are using encryption, you must manually migrate your encryption 
keys after upgrading your ownCloud server::

 $ sudo -u www-data php occ encryption:migrate-keys 

File Operations
---------------

The ``files:scan`` command scans for new files and updates the file cache. You 
may rescan all files, per-user, a space-delimited list of users, and limit the 
search path::

 $ sudo -u www-data php occ  files:scan --help
   Usage:
   files:scan [-p|--path="..."] [-q|--quiet] [--all] [user_id1] ... [user_idN]

 Arguments:
   user_id               will rescan all files of the given user(s)

 Options:
   --path (-p)           limit rescan to this path, eg. 
   --path="/alice/files/Music", the user_id is determined by the path and the 
   user_id parameter and --all are ignored
   --all                 will rescan all files of all known users

``files:cleanup`` tidies up the server's file cache by deleting all file 
entries that have no matching entries in the storage table.

.. _cli_installation:

Command Line Installation
-------------------------

You can install ownCloud entirely from the command line. After downloading the 
tarball and copying ownCloud into the appropriate directories, or 
after installing ownCloud packages (See 
:doc:`../installation/linux_installation` and 
:doc:`../installation/source_installation`) you can use ``occ`` commands in 
place of running the graphical Installation Wizard.

Apply correct permissions to your ownCloud directories; see 
:ref:`strong_perms`. Then choose your ``occ`` options. This lists your 
available options::

 $ sudo -u www-data php /var/www/owncloud/occ
 ownCloud is not installed - only a limited number of commands are available
 ownCloud version 8.1 RC1

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
  maintenance:install   install ownCloud
  
Display your ``maintenance:install`` options::

 $ sudo -u www-data php /var/www/owncloud/occ help maintenance:install
 ownCloud is not installed - only a limited number of commands are available
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
                           "/var/www/owncloud/data")
  --help (-h)              Display this help message
  --quiet (-q)             Do not output any message
  --verbose (-v|vv|vvv)    Increase the verbosity of messages: 1 for normal 
   output, 2 for more verbose output and 3 for debug
  --version (-V)           Display this application version
  --ansi                   Force ANSI output
  --no-ansi                Disable ANSI output
  --no-interaction (-n)    Do not ask any interactive question

This example completes the installation::

 $ sudo -u www-data php /var/www/owncloud/occ  maintenance:install --database 
 "mysql" --database-name "owncloud"  --database-user "root" --database-pass 
 "password" --admin-user "admin" --admin-pass "password" 
 ownCloud is not installed - only a limited number of commands are available
 ownCloud was successfully installed

Supported databases are::

 - sqlite (SQLite3 - Community Edition Only)
 - mysql (MySQL/MariaDB)
 - pgsql (PostgreSQL)
 - oci (Oracle) 
 
l10n, Create javascript Translation Files for Apps
--------------------------------------------------

Use the ``l10n:createjs`` to translate apps into various languages, using this 
syntax::

  l10n:createjs appname language_name
  
This example converts the Activity app to Bosnian::

 $ sudo -u www-data php occ l10n:createjs activity bs

These are the supported language codes, and `Codes for the Representation of 
Names of Languages
<http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ may be helpful::

 ach                     gu     ml     sr
 ady          eo         he     ml_IN  sr@latin
 af_ZA        es         hi     mn     su
 ak           es_AR      hi_IN  ms_MY  sv
 am_ET        es_BO      hr     mt_MT  sw_KE
 ar           es_CL      hu_HU  my_MM  ta_IN
 ast          es_CO      hy     nb_NO  ta_LK
 az           es_CR      ia     nds    te
 be           es_EC      id     ne     tg_TJ
 bg_BG        es_MX      io     nl     th_TH
 bn_BD        es_PE      is     nn_NO  tl_PH
 bn_IN        es_PY      it     nqo    tr
 bs           es_US      ja     oc     tzm
 ca           es_UY      jv     or_IN  ug
 ca@valencia  et_EE      ka_GE  pa     uk
 cs_CZ        eu         km     pl     ur
 cy_GB        eu_ES      kn     pt_BR  ur_PK
 da           fa         ko     pt_PT  uz
 de           fi         ku_IQ  ro     vi
 de_AT        fi_FI      lb     ru     yo
 de_CH        fil        lo     si_LK  zh_CN
 de_DE        fr         lt_LT  sk     zh_HK
 el           fr_CA      lv     sk_SK  zh_TW
 en_GB        fy_NL      mg     sl
 en_NZ        gl         mk     sq

LDAP Commands
-------------

You can run the following LDAP commands with ``occ``.

Search for an LDAP user, using this syntax::

 $ sudo -u www-data php occ ldap:search [--group] [--offset="..."] 
 [--limit="..."] search

This example searches for usernames that start with "rob"::

 $ sudo -u www-data php occ ldap:search rob
 
Check if an LDAP user exists. This works only if the ownCloud server is 
connected to an LDAP server::

 $ sudo -u www-data php occ ldap:check-user robert
 
``ldap:check-user`` will not run a check when it finds a disabled LDAP 
connection. This prevents users that exist on disabled LDAP connections from 
being marked as deleted. If you know for certain that user you are searching for 
is not in one of the disabled connections, and exists on an active connection, 
use the ``--force`` option to force it to check all active LDAP connections::

 $ sudo -u www-data php occ ldap:check-user --force robert

``ldap:create-empty-config`` creates an empty LDAP configuration. The first 
one you create has no ``configID``, like this example::

 $ sudo -u www-data php occ ldap:create-empty-config
   Created new configuration with configID ''
   
This is a holdover from the early days, when there was no option to create 
additional configurations. The second, and all subsequent, configurations 
that you create are automatically assigned IDs::
 
 $ sudo -u www-data php occ ldap:create-empty-config
    Created new configuration with configID 's01' 
 
Then you can list and view your configurations::

 $ sudo -u www-data php occ ldap:show-config
 
And view the configuration for a single configID::

 $ sudo -u www-data php occ ldap:show-config s01
 
``ldap:delete-config [configID]`` deletes an existing LDAP configuration:: 

 $ sudo -u www-data php occ ldap:delete  s01
  Deleted configuration with configID 's01'
 
The ``ldap:set-config`` command is for manipulating configurations, like this 
example that sets search attributes::
 
 $ sudo -u www-data php occ ldap:set-config s01 ldapAttributesForUserSearch 
 "cn;givenname;sn;displayname;mail"
 
``ldap:test-config`` tests whether your configuration is correct and can bind to 
the server::

 $ sudo -u www-data php occ ldap:test-config s01
 The configuration is valid and the connection could be established!
 
``ldap:show-remnants`` is for cleaning up the LDAP mappings table, and is 
documented in :doc:`../configuration_user/user_auth_ldap_cleanup`. 
   
Maintenance Commands
--------------------

These maintenance commands put your ownCloud server into
maintenance and single-user mode, and run repair steps during updates.

You must put your ownCloud server into maintenance mode whenever you perform an 
update or upgrade. This locks the sessions of all logged-in users, including 
administrators, and displays a status screen warning that the server is in 
maintenance mode. Users who are not already logged in cannot log in until 
maintenance mode is turned off. When you take the server out of maintenance mode 
logged-in users must refresh their Web browsers to continue working::

 $ sudo -u www-data php occ maintenance:mode --on
 $ sudo -u www-data php occ maintenance:mode --off
 
Putting your ownCloud server into single-user mode allows admins to log in and 
work, but not ordinary users. This is useful for performing maintenance and 
troubleshooting on a running server::

 $ sudo -u www-data php occ maintenance:singleuser --on
   Single user mode enabled
   
And turn it off when you're finished::

 $ sudo -u www-data php occ maintenance:singleuser --off
   Single user mode disabled

The ``maintenance:repair`` command runs automatically during upgrades to clean 
up the database, so while you can run it manually there usually isn't a need 
to::
  
  $ sudo -u www-data php occ maintenance:repair
     - Repair mime types
 - Repair legacy storages
 - Repair config
 - Clear asset cache after upgrade
     - Asset pipeline disabled -> nothing to do
 - Generate ETags for file where no ETag is present.
     - ETags have been fixed for 0 files/folders.
 - Clean tags and favorites
     - 0 tags for delete files have been removed.
     - 0 tag entries for deleted tags have been removed.
     - 0 tags with no entries have been removed.
 - Re-enable file app    
 
User Commands
-------------

The ``user`` commands create and remove users, reset passwords, display a simple 
report showing how many users you have, and when a user was last logged in.

You can create a new user with their display name, login name, and any group 
memberships with the ``user:add`` command. The syntax is::

 user:add [--password-from-env] [--display-name[="..."]] [-g|--group[="..."]] 
 uid

The ``display-name`` corresponds to the **Full Name** on the Users page in your 
ownCloud Web UI, and the ``uid`` is their **Username**, which is their 
login name. This example adds new user Layla Smith, and adds her to the 
**users** and **db-admins** groups. Any groups that do not exist are created:: 
 
 $ sudo -u www-data php occ user:add --display-name="Layla Smith" 
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

 $ su
 Password:
 # export OC_PASS=newpassword
 # su -s /bin/sh www-data -c 'php occ user:add --password-from-env 
   --display-name="Fred Jones" --group="users" fred'
 The user "fred" was created successfully
 Display name set to "Fred Jones"
 User "fred" added to group "users" 

You can reset any user's password, including administrators (see 
:doc:`../configuration_user/reset_admin_password`)::

 $ sudo -u www-data php occ user:resetpassword layla
   Enter a new password: 
   Confirm the new password: 
   Successfully reset password for layla
   
You may also use ``password-from-env`` to reset passwords::

 # export OC_PASS=newpassword
 # su -s /bin/sh www-data -c 'php occ user:resetpassword --password-from-env 
   layla'
   Successfully reset password for layla
   
You can delete users::

 $ sudo -u www-data php occ user:delete fred
   
View a user's most recent login::   
   
 $ sudo -u www-data php occ user:lastseen layla 
   layla's last login: 09.01.2015 18:46
   
Generate a simple report that counts all users, including users on external user
authentication servers such as LDAP::

 $ sudo -u www-data php occ user:report
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
   
Upgrade Command
---------------

When you are performing an update or upgrade on your ownCloud server (see the 
Maintenance section of this manual), it is better to use ``occ`` to perform the 
database upgrade step, rather than the Web GUI, in order to avoid timeouts. PHP
scripts invoked from the Web interface are limited to 3600 seconds. In larger 
environments this may not be enough, leaving the system in an inconsistent 
state. After performing all the preliminary steps (see 
:doc:`../maintenance/upgrade`) use this command to upgrade your databases::

 $ sudo -u www-data php occ upgrade

Before completing the upgrade, ownCloud first runs a simulation by 
copying all database tables to a temporary directory and then performing the 
upgrade on them, to ensure that the upgrade will complete correctly. This 
takes twice as much time, which on large installations can be many hours, so 
you can omit this step with the ``--skip-migration-test`` option::

 $ sudo -u www-data php occ upgrade --skip-migration-test

You can perform this simulation manually with the ``--dry-run`` option::
 
 $ sudo -u www-data php occ upgrade --dry-run
