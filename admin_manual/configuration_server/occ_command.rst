=====================
Using the occ Command
=====================

ownCloud's ``occ`` command (ownCloud console) is ownCloud's command-line 
interface. You can perform many common server operations with ``occ``::

* Manage apps
* Manage users
* Upgrade the ownCloud database
* Reset passwords, including administrator passwords
* Convert the ownCloud database from SQLite to a more performant DB
* Query and change LDAP settings

``occ`` is in the :file:`owncloud/` directory; for example 
:file:`/var/www/owncloud` on Ubuntu Linux. ``occ`` is a PHP script. You must run 
it as your HTTP user to ensure that the correct permissions are maintained on 
your ownCloud files and directories. 

.. note:: The HTTP user is different on the various Linux distributions. See 
   the **Setting Strong Directory Permissions** section of 
   :doc:`../installation/installation_wizard` to learn how to find your HTTP 
   user

Running it with no options lists all commands and options, like this example on 
Ubuntu::

 $ sudo -u www-data php  occ
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
   Array
   (
    [installed] => true
    [version] => 8.1.0.3
    [versionstring] => 8.1.0
    [edition] => 
   )
   
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
   
Apps Commands
-------------

The ``app`` commands list, enable, and disable apps. This lists all of your 
installed apps, and shows whether they are enabled or disabled::

 $ sudo -u www-data php occ app:list
 
Enable an app::

 $ sudo -u www-data php occ app:enable external
   external enabled
   
``app:check-code`` checks if the app uses ownCloud's public API (``OCP``) or 
private API (``OC_``), and then enables the app. If the app uses the private 
API it will print a warning::

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

Database Conversion
-------------------

The SQLite database is good for testing, and for ownCloud servers with small 
workloads, but production servers with multiple users should use MariaDB, MySQL, 
or PostgreSQL. You can use ``occ`` to convert from SQLite to one of these other 
databases. You need:

* Your desired database installed and its PHP connector
* The login and password of a database admin user
* The database port number, if it is a non-standard port

This is example converts to SQLite MySQL/MariaDB:: 

 $ sudo -u www-data php occ db:generate-change-script
 $ sudo -u www-data php occ db:convert-type mysql oc_dbuser 127.0.0.1 
 oc_database

For a more detailed explanation see 
:doc:`../configuration_database/db_conversion`

File Operations
---------------

The ``files:scan`` command scans for new files for the file cache, and isn't 
intended to be run manually.

``files:cleanup`` tidies up the server's file cache by deleting all file 
entries that have no matching entries in the storage table.
   
   
l10n, Create javascript Translation Files for Apps
--------------------------------------------------

Use the ``l10n:createjs`` to translate apps into various languages, using this 
syntax::

  l10n:createjs appname language_name
  
The output can be either ``.js`` or ``.json``. This example converts the 
Activity app to Bosnian::

 $ sudo -u www-data php occ l10n:createjs activity bs.js
  
These are the supported language codes, and `Codes for the Representation of 
Names of Languages
<http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ may be helpful::

 ach.js            es_CR.json  ja.json     ro.js                              
 ach.json          es_EC.js    jv.js       ro.json                   
 ady.js            es_EC.json  jv.json     ru.js                      
 ady.json          es.js       ka_GE.js    ru.json                    
 af_ZA.js          es.json     ka_GE.json  si_LK.js                   
 af_ZA.json        es_MX.js    km.js       si_LK.json                 
 ak.js             es_MX.json  km.json     sk.js
 ak.json           es_PE.js    kn.js       sk.json
 am_ET.js          es_PE.json  kn.json     sk_SK.js
 am_ET.json        es_PY.js    ko.js       sk_SK.json
 ar.js             es_PY.json  ko.json     sl.js
 ar.json           es_US.js    ku_IQ.js    sl.json
 ast.js            es_US.json  ku_IQ.json  sq.js
 ast.json          es_UY.js    lb.js       sq.json
 az.js             es_UY.json  lb.json     sr.js
 az.json           et_EE.js    lo.js       sr.json
 be.js             et_EE.json  lo.json     sr@latin.js
 be.json           eu_ES.js    lt_LT.js    sr@latin.json
 bg_BG.js          eu_ES.json  lt_LT.json  su.js
 bg_BG.json        eu.js       lv.js       su.json
 bn_BD.js          eu.json     lv.json     sv.js
 bn_BD.json        fa.js       mg.js       sv.json
 bn_IN.js          fa.json     mg.json     sw_KE.js
 bn_IN.json        fi_FI.js    mk.js       sw_KE.json
 bs.js             fi_FI.json  mk.json     ta_IN.js
 bs.json           fi.js       ml_IN.js    ta_IN.json
 ca.js             fi.json     ml_IN.json  ta_LK.js
 ca.json           fil.js      ml.js       ta_LK.json
 ca@valencia.js    fil.json    ml.json     te.js
 ca@valencia.json  fr_CA.js    mn.js       te.json
 cs_CZ.js          fr_CA.json  mn.json     tg_TJ.js
 cs_CZ.json        fr.js       mr.js       tg_TJ.json
 cy_GB.js          fr.json     mr.json     th_TH.js
 cy_GB.json        fy_NL.js    ms_MY.js    th_TH.json
 da.js             fy_NL.json  ms_MY.json  tl_PH.js
 da.json           gl.js       mt_MT.js    tl_PH.json
 de_AT.js          gl.json     mt_MT.json  tr.js
 de_AT.json        gu.js       my_MM.js    tr.json
 de_CH.js          gu.json     my_MM.json  tzm.js
 de_CH.json        he.js       nb_NO.js    tzm.json
 de_DE.js          he.json     nb_NO.json  ug.js
 de_DE.json        hi_IN.js    nds.js      ug.json
 de.js             hi_IN.json  nds.json    uk.js
 de.json           hi.js       ne.js       uk.json
 el.js             hi.json     ne.json     ur.js
 el.json           hr.js       nl.js       ur.json
 en_GB.js          hr.json     nl.json     ur_PK.js
 en_GB.json        hu_HU.js    nn_NO.js    ur_PK.json
 en_NZ.js          hu_HU.json  nn_NO.json  uz.js
 en_NZ.json        hy.js       nqo.js      uz.json
 en@pirate.js      hy.json     nqo.json    vi.js
 en@pirate.json    ia.js       oc.js       vi.json
 eo.js             ia.json     oc.json     
 eo.json           id.js       or_IN.js    yo.js
 es_AR.js          id.json     or_IN.json  yo.json
 es_AR.json        ignorelist  pa.js       zh_CN.js
 es_BO.js          io.js       pa.json     zh_CN.json
 es_BO.json        io.json     pl.js       zh_HK.js
 es_CL.js          is.js       pl.json     zh_HK.json
 es_CL.json        is.json     pt_BR.js    zh_TW.js
 es_CO.js          it.js       pt_BR.json  zh_TW.json
 es_CO.json        it.json     pt_PT.js
 es_CR.js          ja.js       pt_PT.json
 
LDAP Commands
-------------

You can run the following LDAP commands with ``occ``.

Search for an LDAP user, using this syntax::

 $ sudo -u www-data php occ ldap:search [--group] [--offset="..."] 
 [--limit="..."] search

This example searches for usernames that includes "rob"::

 $ sudo -u www-data php occ ldap:search rob
 
Check if an LDAP user exists. This works only if the ownCloud server is 
connected to an LDAP server::

 $ sudo -u www-data php occ ldap:check-user robert
 
You can see your whole LDAP configuration, or the configuration for a single 
configID::

 $ sudo -u www-data php occ ldap:show-config
 $ sudo -u www-data php occ ldap:show-config s01
 
The ``ldap:set-config`` command is for manipulating configurations, like this 
example that sets search attributes::
 
 $ sudo -u www-data php occ ldap:set-config s01 ldapAttributesForUserSearch 
 "cn;givenname;sn;displayname;mail"
 
``ldap:test-config`` tests whether your configuration is correct and can bind to 
the server::

 $ sudo -u www-data php occ ldap:test-config ""
 The configuration is valid and the connection could be established!
 
``ldap:show-remnants`` is for cleaning up the LDAP mappings table, and is 
documented in :doc:`../configuration_user/user_auth_ldap_cleanup`.
 
``ldap:create-empty-config`` creates an empty LDAP configuration.

``ldap:delete-config`` deletes an existing LDAP configuration.
    
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
   --group="users db-admins" layla
   Enter password: 
   Confirm password: 
   The user "layla" was created successfully
   Display name set to "Layla Smith"
   User "layla" added to group "users db-admins"
   
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
database upgrade step, rather than the Web GUI,  in order to avoid timeouts. PHP 
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