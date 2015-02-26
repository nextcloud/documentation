=====================
Using the occ Command
=====================

ownCloud's ``occ`` command (ownCloud console) is ownCloud's command-line 
interface. You can perform many common server operations with ``occ``::

* Manage apps
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

 $ sudo -u www-data php occ

This is the same as ``sudo -u www-data php occ list``.

Run it with the ``-h`` option for syntax help::

 $ sudo -u www-data php occ -h
 
Display your ownCloud version::

 $ sudo -u www-data php occ -V
   ownCloud version 7.0.4
   
Query your ownCloud server status::
 
 $ sudo -u www-data php occ status
   Array
   (
    [installed] => true
    [version] => 7.0.4.2
    [versionstring] => 7.0.4
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
   
Maintenance Commands
--------------------

These three maintenance commands put your ownCloud server into
maintenance and single-user mode, and run repair steps during updates.

You must put your ownCloud server into maintenance mode whenever you perform an 
update or upgrade. This locks the sessions of all logged-in users, including 
administrators, and displays a status screen warning that the server is in 
maintenance mode. Users who are not already logged in cannot log in until 
maintenance mode is turned off. When you take the server out of maintenance 
mode 
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
    - Repair config
 
User Commands
-------------

The ``user`` commands reset passwords, display a simple report showing how 
many users you have, and when a user was last logged in.

You can reset any user's password, including administrators (see 
:doc:`../configuration_user/reset_admin_password`). In this example the 
username is layla::

 $ sudo -u www-data php occ user:resetpassword layla
   Enter a new password: 
   Confirm the new password: 
   Successfully reset password for layla
   
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
   
Apps Commands
-------------

The ``app`` commands list, enable, and disable apps. This lists all of your 
installed apps, and shows whether they are enabled or disabled::

 $ sudo -u www-data php occ app:list
 
Enable an app::

 $ sudo -u www-data php occ app:enable external
   external enabled
   
Disable an app::

 $ sudo -u www-data php occ app:disable external
   external disabled
   
Upgrade Command
---------------

When you are performing an update or upgrade on your ownCloud server (see the 
Maintenance section of this manual), it is better to use ``occ`` to perform the 
database upgrade step, rather than the Web GUI,  in order to avoid timeouts. 
PHP 
scripts invoked from the Web interface are limited to 3600 seconds. In larger 
environments this may not be enough, leaving the system in an inconsistent 
state. Use this command to upgrade your databases::

 $ sudo -u www-data php occ upgrade

Before completing the upgrade, ownCloud first runs a simulation by 
copying all database tables to a temporary directory and then performing the 
upgrade on them, to ensure that the upgrade will complete correctly. This 
takes twice as much time, which on large installations can be many hours, so 
you can omit this step with the ``--skip-migration-test`` option::

 $ sudo -u www-data php occ upgrade --skip-migration-test

You can perform this simulation manually with the ``--dry-run`` option::
 
 $ sudo -u www-data php occ upgrade --dry-run
 
Database Conversion
-------------------

The SQLite database is good for testing, and for ownCloud servers with small 
workloads, but production servers with multiple users should use MariaDB, 
MySQL, 
or PostgreSQL. You can use ``occ`` to convert from SQLite to one of these other 
databases. You need:

* Your desired database installed and its PHP connector
* The login and password of a database admin user
* The database port number, if it is a non-standard port

This is example converts to MySQL/MariaDB:: 

 $ sudo -u www-data php occ db:generate-change-script
 $ sudo -u www-data php occ db:convert-type mysql oc_dbuser 127.0.0.1 
 oc_database

For a more detailed explanation see 
:doc:`../configuration_database/db_conversion`   

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
 
``ldap:test-config`` tests whether your configuration is correct can bind to 
the server::

 $ sudo -u www-data php occ ldap:test-config ""
 The configuration is valid and the connection could be established! 
 
File Scanning
-------------

The ``files:scan`` command scans for new files for the file cache, and isn't 
intended to be run manually.
