========================
Configuration Parameters
========================

Introduction
------------

Nextcloud uses ``config/config.php`` as its main configuration file. This file controls 
various fundamental aspects of server operations. It is typically modified as part of initial 
deployment, when troubleshooting, and when making adjustments to surrounding infrastructure.

This is a required file for all Nextcloud deployments and thus it is critical for Nextcloud 
administrators to be familiar with managing it.

This section of the *Administration Manual* documents how to adjust this essential file, 
certain special characteristics of the ``config/`` directory, and all of the supported 
parameters that can be specified in a ``config/config.php`` file.

.. note:: While ``config/config.php`` is a required file, many Nextcloud or Nextcloud app
   settings are managed elsewhere and thus not included in it. These settings are typically
   managed via individual apps.

Loading
-------

Configuration files located in ``config/`` are parsed automatically when Nextcloud 
starts up. They are also checked for changes periodically (approximately every two seconds 
in a standard PHP environment running with default *OPcache* settings; approximately every 
sixty seconds in many pre-packaged Nextcloud installation methods).

The ``config/config.php`` file may be supplemented by additional ``*.config.php`` files 
placed in the ``config/`` directory (if appropriately named and formatted).

.. danger:: Be cautious when naming or creating backup copies of your active 
   ``config/config.php``. If a backup is located within ``config/`` and is named
   ``(ANYTHING).config.php``, it will be loaded as part of your live configuration
   and override your ``config/config.php`` values!

.. tip:: If your configuration changes don't seem to be taking effect, check: (a) your PHP opcache 
   configuration; (b) for additional ``*.config.php`` files located in ``config/``; (c) the documentation
   for your Nextcloud installation method/package; (d) the output of ``occ config:list system``.

Format
------

The short answer is that ``config/`` files are plain text files with some special formatting 
requirements for different types of parameters and values. This makes it extensible and easy for
Nextcloud to interact with. It also makes it easy for administartors to view with any text viewer 
and from the command-line.

Technically these configuration files are PHP files containing a special (to Nextcloud) PHP array 
called ``$CONFIG``. This array consists of various Nextcloud specific "key-value" pairs (in some cases 
arrays themselves). Each pair has the form ``key => value`` and is comma-separated.

Types of Values
^^^^^^^^^^^^^^^

Strings: 

* ``"thisIsAnImportantValue"``
* Note: These must be either single or double quoted - i.e. ``"string"`` or ``'string'``.
* Note: IP addresses are considered strings.
* Examples:
   - ``'logo_url' => 'https://example.org',``
   - ``'versions_retention_obligation' => 'auto, D',``
   - ``'logtimezone' => 'Europe/Berlin',``

Boolean: 

* ``true`` or ``false``
* Note: These should **not** be surrounded by quote marks within the configuration file itself.
* Examples:
   - ``'session_keepalive' => true,``
   - ``'hide_login_form' => false,``

Numerical:

* ``12``
* This includes both integers and floating point numbers.
* Note: These should **not** be surrounded by quote marks within the configuration file itself.
* Examples:
   - ``'loglevel' => 2,``
   - ``'session_lifetime' => 60 * 60 * 24,``

Arrays of any of the above types:

* ``[ 'value1', 'value2' ]``
* All value types (including other arrays) can be included in arrays.
* Note: Only some parameters support array style values.
* Examples:
   - ``'connectivity_check_domains' => [ 'www.nextcloud.com', 'www.eff.org', ],``
   - ``'enabledPreviewProviders' => [ 'OC\Preview\BMP', 'OC\Preview\GIF', 'OC\Preview\JPEG', ],``

.. tip:: Nextcloud attempts to remedy some value type/formatting mistakes, but this is not foolproof. 
   Use the correct formatting (for the type of value in question) to avoid unexpected results arising 
   from values being cast in unexpected ways.

Modifying
---------

Parameters may be modified in a standard text editor (i.e. via the command-line or externally 
then re-uploaded). They may also, in most cases, be modified using the commands in
the ``occ config:system:*`` namespace.

.. tip:: Incorrectly formatted ``key => value`` entries (or incorrectly specified values) may
   not generate immediate errors or problems (such as parsing / syntax errors), but may still 
   lead to unexpected and undesirable results. Review your fully parsed (by PHP) configuration
   by using the command ``occ config:list system`` and/or ``occ config:list system --private``
   to identify anything unexpected.

Defaults
--------

Nextcloud creates a base ``config/config.php`` file at installation time containing the most 
essential parameters for operations. These values are a mixture of auto-generated and drawn from
information provided by the administrator at installation time.

The file ``config/config.sample.php`` lists all the parameters within Nextcloud that can be 
specified in ``config/`` files, along with example and default values for each. The content of 
that sample configuration file is included :ref:`below<config-php-sample>` for ease of reference 
and alongside additional context.

.. tip:: Only add parameters to ``config/config.php`` that you wish to modify. 

.. danger:: Do not copy everything from ``config/config.sample.php`` into your own 
   ``config/config.php``! Besides being unnecessary, it will break things and possibly even
   require re-installation.

Multiple/Merged Configuration Files
-----------------------------------

Nextcloud supports loading configuration parameters from multiple files. You can add arbitrary 
files ending with ``.config.php*`` (i.e. ``*.config.php``) in the ``config/`` directory. The values 
in these files take precedence over ``config/config.php``. This allows you to easily create and 
manage custom configurations, or to divide a large complex configuration file into a set of smaller files. 
These custom files are not overwritten by Nextcloud.

For example, you could place your email server configuration in ``config/email.config.php`` and 
whatever parameters you specify in it will be merged with your ``config/config.php``.

.. note:: The values in these additional configuration files **always** take precedence over 
   ``config/config.php``.

.. tip:: To view your fully merged configuration (i.e. incorporating all config files), use 
   ``occ config:list system`` and/or ``occ config:list system --private``.

.. danger:: Be cautious when naming or creating backup copies of your active 
   ``config/config.php``. If a backup config file is located within ``config/`` and happens to be 
   named ``(ANYTHING).config.php``, it will be loaded as part of your live configuration and override 
   your ``config/config.php`` values!

Examples
--------

These are some examples of the content of typical ``config/config.php`` files immediately after
a basic installation of Nextcloud.

When you use SQLite as your Nextcloud database, your ``config.php`` looks like
this after installation. The SQLite database is stored in your Nextcloud
``data/`` directory::

  <?php
  $CONFIG = array (
    'instanceid' => 'occ6f7365735',
    'passwordsalt' => '2c5778476346786306303',
    'trusted_domains' =>
    array (
      0 => 'localhost',
      1 => 'studio',
    ),
    'datadirectory' => '/var/www/nextcloud/data',
    'dbtype' => 'sqlite3',
    'version' => '7.0.2.1',
    'installed' => true,
  );

.. note:: SQLite is a simple, lightweight embedded database that is fine for testing 
   and simple installations, but production environments you should use MySQL/MariaDB, 
   Oracle, or PosgreSQL.

This example is from a new Nextcloud installation using MariaDB::

  <?php
  $CONFIG = array (
    'instanceid' => 'oc8c0fd71e03',
    'passwordsalt' => '515a13302a6b3950a9d0fdb970191a',
    'trusted_domains' =>
    array (
      0 => 'localhost',
      1 => 'studio',
      2 => '192.168.10.155'
    ),
    'datadirectory' => '/var/www/nextcloud/data',
    'dbtype' => 'mysql',
     'version' => '7.0.2.1',
    'dbname' => 'nextcloud',
    'dbhost' => 'localhost',
    'dbtableprefix' => 'oc_',
    'dbuser' => 'oc_carla',
    'dbpassword' => '67336bcdf7630dd80b2b81a413d07',
    'installed' => true,
  );


.. The following section is auto-generated from
.. https://github.com/nextcloud/server/blob/master/config/config.sample.php
.. Do not edit this file; edit the source file in core
.. DEFAULT_SECTION_START


Default Parameters
------------------

These parameters are configured by the Nextcloud installer, and are required
for your Nextcloud server to operate.


instanceid
^^^^^^^^^^


::

	'instanceid' => '',

This is a unique identifier for your Nextcloud installation, created
automatically by the installer. This example is for documentation only,
and you should never use it because it will not work. A valid ``instanceid``
is created when you install Nextcloud.

'instanceid' => 'd3c944a9a',

passwordsalt
^^^^^^^^^^^^


::

	'passwordsalt' => '',

The salt used to hash all passwords, auto-generated by the Nextcloud
installer. (There are also per-user salts.) If you lose this salt you lose
all your passwords. This example is for documentation only, and you should
never use it.

secret
^^^^^^


::

	'secret' => '',

Secret used by Nextcloud for various purposes, e.g. to encrypt data. If you
lose this string there will be data corruption.

trusted_domains
^^^^^^^^^^^^^^^


::

	'trusted_domains' =>
	   [
	    'demo.example.org',
	    'otherdomain.example.org',
	    '10.111.112.113',
	    '[2001:db8::1]'
	  ],

Your list of trusted domains that users can log into. Specifying trusted
domains prevents host header poisoning. Do not remove this, as it performs
necessary security checks.

You can specify:

- the exact hostname of your host or virtual host, e.g. demo.example.org.
- the exact hostname with permitted port, e.g. demo.example.org:443.
  This disallows all other ports on this host
- use * as a wildcard, e.g. ubos-raspberry-pi*.local will allow
  ubos-raspberry-pi.local and ubos-raspberry-pi-2.local
- the IP address with or without permitted port, e.g. [2001:db8::1]:8080
  Using TLS certificates where commonName=<IP address> is deprecated

datadirectory
^^^^^^^^^^^^^


::

	'datadirectory' => '/var/www/nextcloud/data',

Where user files are stored. The SQLite database is also stored here, when
you use SQLite.

Default to ``data/`` in the Nextcloud directory.

version
^^^^^^^


::

	'version' => '',

The current version number of your Nextcloud installation. This is set up
during installation and update, so you shouldn't need to change it.

dbtype
^^^^^^


::

	'dbtype' => 'sqlite3',

Identifies the database used with this installation. See also config option
``supportedDatabases``

Available:
	- sqlite3 (SQLite3)
	- mysql (MySQL/MariaDB)
	- pgsql (PostgreSQL)

Defaults to ``sqlite3``

dbhost
^^^^^^


::

	'dbhost' => '',

Your host server name, for example ``localhost``, ``hostname``,
``hostname.example.com``, or the IP address.

To specify a port use ``hostname:####``, for IPv6 addresses use the URI notation ``[ip]:port``.
To specify a Unix socket use ``/path/to/directory/containing/socket``, e.g. ``/run/postgresql/``.

dbname
^^^^^^


::

	'dbname' => 'nextcloud',

The name of the Nextcloud database, which is set during installation. You
should not need to change this.

dbuser
^^^^^^


::

	'dbuser' => '',

The user that Nextcloud uses to write to the database. This must be unique
across Nextcloud instances using the same SQL database. This is set up during
installation, so you shouldn't need to change it.

dbpassword
^^^^^^^^^^


::

	'dbpassword' => '',

The password for the database user. This is set up during installation, so
you shouldn't need to change it.

dbtableprefix
^^^^^^^^^^^^^


::

	'dbtableprefix' => 'oc_',

Prefix for the Nextcloud tables in the database.

Default to ``oc_``

dbpersistent
^^^^^^^^^^^^


::

	'dbpersistent' => '',

Enable persistent connexions to the database.

This setting uses the "persistent" option from doctrine dbal, which in turn
uses the PDO::ATTR_PERSISTENT option from the pdo driver.

dbreplica
^^^^^^^^^


::

	'dbreplica' => [
		['user' => 'nextcloud', 'password' => 'password1', 'host' => 'replica1', 'dbname' => ''],
		['user' => 'nextcloud', 'password' => 'password2', 'host' => 'replica2', 'dbname' => ''],
	],

Specify read only replicas to be used by Nextcloud when querying the database

db.log_request_id
^^^^^^^^^^^^^^^^^


::

	'db.log_request_id' => false,

Add request id to the database query in a comment.

This can be enabled to assist in mapping database logs to Nextcloud logs.

installed
^^^^^^^^^


::

	'installed' => false,

Indicates whether the Nextcloud instance was installed successfully; ``true``
indicates a successful installation, and ``false`` indicates an unsuccessful
installation.

Defaults to ``false``

.. DEFAULT_SECTION_END
.. Generated content above. Don't change this.

.. _config-php-sample:

.. Generated content below. Don't change this.
.. ALL_OTHER_SECTIONS_START


User Experience
---------------

These optional parameters control some aspects of the user interface. Default
values, where present, are shown.


default_language
^^^^^^^^^^^^^^^^


::

	'default_language' => 'en',

This sets the default language on your Nextcloud server, using ISO_639-1
language codes such as ``en`` for English, ``de`` for German, and ``fr`` for
French. The default_language parameter is only used, when the browser does
not send any language, and the user hasn’t configured own language
preferences.

Nextcloud has two distinguished language codes for German, 'de' and 'de_DE'.
'de' is used for informal German and 'de_DE' for formal German. By setting
this value to 'de_DE' you can enforce the formal version of German unless
the user has chosen something different explicitly.

Defaults to ``en``

force_language
^^^^^^^^^^^^^^


::

	'force_language' => 'en',

With this setting a language can be forced for all users. If a language is
forced, the users are also unable to change their language in the personal
settings. If users shall be unable to change their language, but users have
different languages, this value can be set to ``true`` instead of a language
code.

Defaults to ``false``

default_locale
^^^^^^^^^^^^^^


::

	'default_locale' => 'en_US',

This sets the default locale on your Nextcloud server, using ISO_639
language codes such as ``en`` for English, ``de`` for German, and ``fr`` for
French, and ISO-3166 country codes such as ``GB``, ``US``, ``CA``, as defined
in RFC 5646. It overrides automatic locale detection on public pages like
login or shared items. User's locale preferences configured under "personal
-> locale" override this setting after they have logged in.

Defaults to ``en``

reduce_to_languages
^^^^^^^^^^^^^^^^^^^


::

	'reduce_to_languages' => [],

With this setting is possible to reduce the languages available in the
language chooser. The languages have to be set as array values using ISO_639-1
language codes such as ``en`` for English, ``de`` for German etc.

For example: Set to ['de', 'fr'] to only allow German and French languages.

default_phone_region
^^^^^^^^^^^^^^^^^^^^


::

	'default_phone_region' => 'GB',

This sets the default region for phone numbers on your Nextcloud server,
using ISO 3166-1 country codes such as ``DE`` for Germany, ``FR`` for France, …
It is required to allow inserting phone numbers in the user profiles starting
without the country code (e.g. +49 for Germany).

No default value!

force_locale
^^^^^^^^^^^^


::

	'force_locale' => 'en_US',

With this setting a locale can be forced for all users. If a locale is
forced, the users are also unable to change their locale in the personal
settings. If users shall be unable to change their locale, but users have
different languages, this value can be set to ``true`` instead of a locale
code.

Defaults to ``false``

default_timezone
^^^^^^^^^^^^^^^^


::

	'default_timezone' => 'Europe/Berlin',

This sets the default timezone on your Nextcloud server, using IANA
identifiers like ``Europe/Berlin`` or ``Pacific/Auckland``. The default
timezone parameter is only used when the timezone of the user can't be
determined.

Defaults to ``UTC``

knowledgebaseenabled
^^^^^^^^^^^^^^^^^^^^


::

	'knowledgebaseenabled' => true,

``true`` enables the Help menu item in the user menu (top right of the
Nextcloud Web interface). ``false`` removes the Help item.

knowledgebase.embedded
^^^^^^^^^^^^^^^^^^^^^^


::

	'knowledgebase.embedded' => false,

``true`` embeds the documentation in an iframe inside Nextcloud.

``false`` only shows buttons to the online documentation.

allow_user_to_change_display_name
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'allow_user_to_change_display_name' => true,

``true`` allows users to change their display names (on their Personal
pages), and ``false`` prevents them from changing their display names.

skeletondirectory
^^^^^^^^^^^^^^^^^


::

	'skeletondirectory' => '/path/to/nextcloud/core/skeleton',

The directory where the skeleton files are located. These files will be
copied to the data directory of new users. Leave empty to not copy any
skeleton files.

``{lang}`` can be used as a placeholder for the language of the user.
If the directory does not exist, it falls back to non dialect (from ``de_DE``
to ``de``). If that does not exist either, it falls back to ``default``

Defaults to ``core/skeleton`` in the Nextcloud directory.

templatedirectory
^^^^^^^^^^^^^^^^^


::

	'templatedirectory' => '/path/to/nextcloud/templates',

The directory where the template files are located. These files will be
copied to the template directory of new users. Leave empty to not copy any
template files.

``{lang}`` can be used as a placeholder for the language of the user.
If the directory does not exist, it falls back to non dialect (from ``de_DE``
to ``de``). If that does not exist either, it falls back to ``default``

If this is not set creating a template directory will only happen if no custom
``skeletondirectory`` is defined, otherwise the shipped templates will be used
to create a template directory for the user.

User session
------------


remember_login_cookie_lifetime
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'remember_login_cookie_lifetime' => 60*60*24*15,

Lifetime of the remember login cookie. This should be larger than the
session_lifetime. If it is set to 0 remember me is disabled.

Defaults to ``60*60*24*15`` seconds (15 days)

session_lifetime
^^^^^^^^^^^^^^^^


::

	'session_lifetime' => 60 * 60 * 24,

The lifetime of a session after inactivity.

The maximum possible time is limited by the session.gc_maxlifetime php.ini setting
which would overwrite this option if it is less than the value in the config.php

Defaults to ``60*60*24`` seconds (24 hours)

davstorage.request_timeout
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'davstorage.request_timeout' => 30,

The timeout in seconds for requests to servers made by the DAV component (e.g., needed for federated shares).

carddav_sync_request_timeout
^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'carddav_sync_request_timeout' => 30,

The timeout in seconds for synchronizing address books, e.g. federated system address books (as run by `occ federation:sync-addressbooks`).

Defaults to ``30`` seconds

session_relaxed_expiry
^^^^^^^^^^^^^^^^^^^^^^


::

	'session_relaxed_expiry' => false,

`true` enabled a relaxed session timeout, where the session timeout would no longer be
handled by Nextcloud but by either the PHP garbage collection or the expiration of
potential other session backends like redis.

This may lead to sessions being available for longer than what session_lifetime uses but
comes with performance benefits as sessions are no longer a locking operation for concurrent
requests.

session_keepalive
^^^^^^^^^^^^^^^^^


::

	'session_keepalive' => true,

Enable or disable session keep-alive when a user is logged in to the Web UI.

Enabling this sends a "heartbeat" to the server to keep it from timing out.

Defaults to ``true``

auto_logout
^^^^^^^^^^^


::

	'auto_logout' => false,

Enable or disable the automatic logout after session_lifetime, even if session
keepalive is enabled. This will make sure that an inactive browser will log itself out
even if requests to the server might extend the session lifetime. Note: the logout is
handled on the client side. This is not a way to limit the duration of potentially
compromised sessions.

Defaults to ``false``

token_auth_enforced
^^^^^^^^^^^^^^^^^^^


::

	'token_auth_enforced' => false,

Enforce token authentication for clients, which blocks requests using the user
password for enhanced security. Users need to generate tokens in personal settings
which can be used as passwords on their clients.

Defaults to ``false``

token_auth_activity_update
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'token_auth_activity_update' => 60,

The interval at which token activity should be updated.

Increasing this value means that the last activity on the security page gets
more outdated.

Tokens are still checked every 5 minutes for validity
max value: 300

Defaults to ``60``

auth.bruteforce.protection.enabled
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'auth.bruteforce.protection.enabled' => true,

Whether the brute force protection shipped with Nextcloud should be enabled or not.

Disabling this is discouraged for security reasons.

Defaults to ``true``

auth.bruteforce.protection.force.database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'auth.bruteforce.protection.force.database' => false,

Whether the brute force protection should write into the database even when a memory cache is available

Using the database is most likely worse for performance, but makes investigating
issues a lot easier as it's possible to look directly at the table to see all
logged remote addresses and actions.

Defaults to ``false``

auth.bruteforce.protection.testing
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'auth.bruteforce.protection.testing' => false,

Whether the brute force protection shipped with Nextcloud should be set to testing mode.

In testing mode brute force attempts are still recorded, but the requests do
not sleep/wait for the specified time. They will still abort with
"429 Too Many Requests" when the maximum delay is reached.
Enabling this is discouraged for security reasons
and should only be done for debugging and on CI when running tests.

Defaults to ``false``

auth.bruteforce.max-attempts
^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'auth.bruteforce.max-attempts' => 10,

Brute force protection: maximum number of attempts before blocking

When more than max-attempts login requests are sent to Nextcloud, requests
will abort with "429 Too Many Requests".
For security reasons, change it only if you know what you are doing.

Defaults to ``10``

ratelimit.protection.enabled
^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'ratelimit.protection.enabled' => true,

Whether the rate limit protection shipped with Nextcloud should be enabled or not.

Disabling this is discouraged for security reasons.

Defaults to ``true``

auth.webauthn.enabled
^^^^^^^^^^^^^^^^^^^^^


::

	'auth.webauthn.enabled' => true,

By default, WebAuthn is available, but it can be explicitly disabled by admins

auth.storeCryptedPassword
^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'auth.storeCryptedPassword' => true,

Whether encrypted password should be stored in the database

The passwords are only decrypted using the login token stored uniquely in the
clients and allow to connect to external storages, autoconfigure mail account in
the mail app and periodically check if the password it still valid.

This might be desirable to disable this functionality when using one time
passwords or when having a password policy enforcing long passwords (> 300
characters).

By default, the passwords are stored encrypted in the database.

WARNING: If disabled, password changes on the user back-end (e.g. on LDAP) no
longer log connected clients out automatically. Users can still disconnect
the clients by deleting the app token from the security settings.

hide_login_form
^^^^^^^^^^^^^^^


::

	'hide_login_form' => false,

By default, the login form is always available. There are cases (SSO) where an
admin wants to avoid users entering their credentials to the system if the SSO
app is unavailable.

This will show an error. But the direct login still works with adding ?direct=1

lost_password_link
^^^^^^^^^^^^^^^^^^


::

	'lost_password_link' => 'https://example.org/link/to/password/reset',

If your user backend does not allow password resets (e.g. when it's a
read-only user backend like LDAP), you can specify a custom link, where the
user is redirected to, when clicking the "reset password" link after a failed
login-attempt.

In case you do not want to provide any link, replace the url with 'disabled'

logo_url
^^^^^^^^


::

	'logo_url' => 'https://example.org',

URL to use as target for the logo link in the header (top-left logo)

Defaults to the base URL of your Nextcloud instance

Mail Parameters
---------------

These configure the email settings for Nextcloud notifications and password
resets.


mail_domain
^^^^^^^^^^^


::

	'mail_domain' => 'example.com',

The return address that you want to appear on emails sent by the Nextcloud
server, for example ``nc-admin@example.com``, substituting your own domain,
of course.

mail_from_address
^^^^^^^^^^^^^^^^^


::

	'mail_from_address' => 'nextcloud',

FROM address that overrides the built-in ``sharing-noreply`` and
``lostpassword-noreply`` FROM addresses.

Defaults to different from addresses depending on the feature.

mail_smtpdebug
^^^^^^^^^^^^^^


::

	'mail_smtpdebug' => false,

Enable SMTP class debugging.

NOTE: ``loglevel`` will likely need to be adjusted too. See docs:
  https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/email_configuration.html#enabling-debug-mode

Defaults to ``false``

mail_smtpmode
^^^^^^^^^^^^^


::

	'mail_smtpmode' => 'smtp',

Which mode to use for sending mail: ``sendmail``, ``smtp``, ``qmail`` or ``null``.

If you are using local or remote SMTP, set this to ``smtp``.

For the ``sendmail`` option you need an installed and working email system on
the server, with ``/usr/sbin/sendmail`` installed on your Unix system.

For ``qmail`` the binary is /var/qmail/bin/sendmail, and it must be installed
on your Unix system.

Use the string ``null`` to send no mails (disable mail delivery). This can be
useful if mails should be sent via APIs and rendering messages is not necessary.

Defaults to ``smtp``

mail_smtphost
^^^^^^^^^^^^^


::

	'mail_smtphost' => '127.0.0.1',

This depends on ``mail_smtpmode``. Specify the IP address of your mail
server host. This may contain multiple hosts separated by a semicolon. If
you need to specify the port number append it to the IP address separated by
a colon, like this: ``127.0.0.1:24``.

Defaults to ``127.0.0.1``

mail_smtpport
^^^^^^^^^^^^^


::

	'mail_smtpport' => 25,

This depends on ``mail_smtpmode``. Specify the port for sending mail.

Defaults to ``25``

mail_smtptimeout
^^^^^^^^^^^^^^^^


::

	'mail_smtptimeout' => 10,

This depends on ``mail_smtpmode``. This sets the SMTP server timeout, in
seconds. You may need to increase this if you are running an anti-malware or
spam scanner.

Defaults to ``10`` seconds

mail_smtpsecure
^^^^^^^^^^^^^^^


::

	'mail_smtpsecure' => '',

This depends on ``mail_smtpmode``. Specify ``ssl`` when you are using SSL/TLS. Any other value will be ignored.

If the server advertises STARTTLS capabilities, they might be used, but they cannot be enforced by
this config option.

Defaults to ``''`` (empty string)

mail_smtpauth
^^^^^^^^^^^^^


::

	'mail_smtpauth' => false,

This depends on ``mail_smtpmode``. Change this to ``true`` if your mail
server requires authentication.

Defaults to ``false``

mail_smtpname
^^^^^^^^^^^^^


::

	'mail_smtpname' => '',

This depends on ``mail_smtpauth``. Specify the username for authenticating to
the SMTP server.

Defaults to ``''`` (empty string)

mail_smtppassword
^^^^^^^^^^^^^^^^^


::

	'mail_smtppassword' => '',

This depends on ``mail_smtpauth``. Specify the password for authenticating to
the SMTP server.

Default to ``''`` (empty string)

mail_template_class
^^^^^^^^^^^^^^^^^^^


::

	'mail_template_class' => '\OC\Mail\EMailTemplate',

Replaces the default mail template layout. This can be utilized if the
options to modify the mail texts with the theming app is not enough.

The class must extend  ``\OC\Mail\EMailTemplate``

mail_send_plaintext_only
^^^^^^^^^^^^^^^^^^^^^^^^


::

	'mail_send_plaintext_only' => false,

Email will be sent by default with an HTML and a plain text body. This option
allows to only send plain text emails.

mail_smtpstreamoptions
^^^^^^^^^^^^^^^^^^^^^^


::

	'mail_smtpstreamoptions' => [],

This depends on ``mail_smtpmode``. Array of additional streams options that
will be passed to underlying Swift mailer implementation.

Defaults to an empty array.

mail_sendmailmode
^^^^^^^^^^^^^^^^^


::

	'mail_sendmailmode' => 'smtp',

Which mode is used for sendmail/qmail: ``smtp`` or ``pipe``.

For ``smtp`` the sendmail binary is started with the parameter ``-bs``:
  - Use the SMTP protocol on standard input and output.

For ``pipe`` the binary is started with the parameters ``-t``:
  - Read message from STDIN and extract recipients.

Defaults to ``smtp``

Proxy Configurations
--------------------


overwritehost
^^^^^^^^^^^^^


::

	'overwritehost' => '',

The automatic hostname detection of Nextcloud can fail in certain reverse
proxy and CLI/cron situations. This option allows you to manually override
the automatic detection; for example ``www.example.com``, or specify the port
``www.example.com:8080``.

overwriteprotocol
^^^^^^^^^^^^^^^^^


::

	'overwriteprotocol' => '',

When generating URLs, Nextcloud attempts to detect whether the server is
accessed via ``https`` or ``http``. However, if Nextcloud is behind a proxy
and the proxy handles the ``https`` calls, Nextcloud would not know that
``ssl`` is in use, which would result in incorrect URLs being generated.

Valid values are ``http`` and ``https``.

overwritewebroot
^^^^^^^^^^^^^^^^


::

	'overwritewebroot' => '',

Nextcloud attempts to detect the webroot for generating URLs automatically.

For example, if ``www.example.com/nextcloud`` is the URL pointing to the
Nextcloud instance, the webroot is ``/nextcloud``. When proxies are in use,
it may be difficult for Nextcloud to detect this parameter, resulting in
invalid URLs.

overwritecondaddr
^^^^^^^^^^^^^^^^^


::

	'overwritecondaddr' => '',

This option allows you to define a manual override condition as a regular
expression for the remote IP address. For example, defining a range of IP
addresses starting with ``10.0.0.`` and ending with 1 to 3:
``^10\.0\.0\.[1-3]$``

Defaults to ``''`` (empty string)

overwrite.cli.url
^^^^^^^^^^^^^^^^^


::

	'overwrite.cli.url' => '',

Use this configuration parameter to specify the base URL for any URLs which
are generated within Nextcloud using any kind of command line tools (cron or
occ). The value should contain the full base URL:
``https://www.example.com/nextcloud``
Please make sure to set the value to the URL that your users mainly use to access this Nextcloud.

Otherwise there might be problems with the URL generation via cron.

Defaults to ``''`` (empty string)

htaccess.RewriteBase
^^^^^^^^^^^^^^^^^^^^


::

	'htaccess.RewriteBase' => '/',

To have clean URLs without `/index.php` this parameter needs to be configured.

This parameter will be written as "RewriteBase" on update and installation of
Nextcloud to your `.htaccess` file. While this value is often simply the URL
path of the Nextcloud installation it cannot be set automatically properly in
every scenario and needs thus some manual configuration.

In a standard Apache setup this usually equals the folder that Nextcloud is
accessible at. So if Nextcloud is accessible via "https://mycloud.org/nextcloud"
the correct value would most likely be "/nextcloud". If Nextcloud is running
under "https://mycloud.org/" then it would be "/".

Note that the above rule is not valid in every case, as there are some rare setup
cases where this may not apply. However, to avoid any update problems this
configuration value is explicitly opt-in.

After setting this value run `occ maintenance:update:htaccess`. Now, when the
following conditions are met Nextcloud URLs won't contain `index.php`:

- `mod_rewrite` is installed
- `mod_env` is installed

Defaults to ``''`` (empty string)

htaccess.IgnoreFrontController
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'htaccess.IgnoreFrontController' => false,

For server setups, that don't have `mod_env` enabled or restricted (e.g. suEXEC)
this parameter has to be set to true and will assume mod_rewrite.

Please check, if `mod_rewrite` is active and functional before setting this
parameter, and you updated your .htaccess with `occ maintenance:update:htaccess`.
Otherwise, your nextcloud installation might not be reachable anymore.
For example, try accessing resources by leaving out `index.php` in the URL.

proxy
^^^^^


::

	'proxy' => '',

The URL of your proxy server, for example ``proxy.example.com:8081``.

Note: Guzzle (the http library used by Nextcloud) is reading the environment
variables HTTP_PROXY (only for cli request), HTTPS_PROXY, and NO_PROXY by default.

If you configure proxy with Nextcloud any default configuration by Guzzle
is overwritten. Make sure to set ``proxyexclude`` accordingly if necessary.

Defaults to ``''`` (empty string)

proxyuserpwd
^^^^^^^^^^^^


::

	'proxyuserpwd' => '',

The optional authentication for the proxy to use to connect to the internet.

The format is: ``username:password``.

Defaults to ``''`` (empty string)

proxyexclude
^^^^^^^^^^^^


::

	'proxyexclude' => [],

List of host names that should not be proxied to.

For example: ``['.mit.edu', 'foo.com']``.

Hint: Use something like ``explode(',', getenv('NO_PROXY'))`` to sync this
value with the global NO_PROXY option.

Defaults to empty array.

allow_local_remote_servers
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'allow_local_remote_servers' => true,

Allow remote servers with local addresses e.g. in federated shares, webcal services and more

Defaults to false

Deleted Items (trash bin)
-------------------------

These parameters control the Deleted files app.


trashbin_retention_obligation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'trashbin_retention_obligation' => 'auto',

If the trash bin app is enabled (default), this setting defines the policy
for when files and folders in the trash bin will be permanently deleted.

If the user quota limit is exceeded due to deleted files in the trash bin,
retention settings will be ignored and files will be cleaned up until
the quota requirements are met.

The app allows for two settings, a minimum time for trash bin retention,
and a maximum time for trash bin retention.

Minimum time is the number of days a file will be kept, after which it
*may be* deleted. A file may be deleted after the minimum number of days
is expired if space is needed. The file will not be deleted if space is
not needed.

Whether "space is needed" depends on whether a user quota is defined or not:

 * If no user quota is defined, the available space on the Nextcloud data
   partition sets the limit for the trashbin
   (issues: see https://github.com/nextcloud/server/issues/28451).
 * If a user quota is defined, 50% of the user's remaining quota space sets
   the limit for the trashbin.

Maximum time is the number of days at which it is *guaranteed
to be* deleted. There is no further dependency on the available space.

Both minimum and maximum times can be set together to explicitly define
file and folder deletion. For migration purposes, this setting is installed
initially set to "auto", which is equivalent to the default setting in
Nextcloud.

Available values (D1 and D2 are configurable numbers):

* ``auto``
    default setting. keeps files and folders in the trash bin for 30 days
    and automatically deletes anytime after that if space is needed (note:
    files may not be deleted if space is not needed).
* ``D1, auto``
    keeps files and folders in the trash bin for D1+ days, delete anytime if
    space needed (note: files may not be deleted if space is not needed)
* ``auto, D2``
    delete all files in the trash bin that are older than D2 days
    automatically, delete other files anytime if space needed
* ``D1, D2``
    keep files and folders in the trash bin for at least D1 days and
    delete when exceeds D2 days (note: files will not be deleted automatically if space is needed)
* ``disabled``
    trash bin auto clean disabled, files and folders will be kept forever

Defaults to ``auto``

File versions
-------------

These parameters control the Versions app.


versions_retention_obligation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'versions_retention_obligation' => 'auto',

If the versions app is enabled (default), this setting defines the policy
for when versions will be permanently deleted.

The app allows for two settings, a minimum time for version retention,
and a maximum time for version retention.
Minimum time is the number of days a version will be kept, after which it
may be deleted. Maximum time is the number of days at which it is guaranteed
to be deleted.
Both minimum and maximum times can be set together to explicitly define
version deletion. For migration purposes, this setting is installed
initially set to "auto", which is equivalent to the default setting in
Nextcloud.

Available values:

* ``auto``
    default setting. Automatically expire versions according to expire
    rules. Please refer to :doc:`../configuration_files/file_versioning` for
    more information.
* ``D, auto``
    keep versions at least for D days, apply expiration rules to all versions
    that are older than D days
* ``auto, D``
    delete all versions that are older than D days automatically, delete
    other versions according to expire rules
* ``D1, D2``
    keep versions for at least D1 days and delete when exceeds D2 days
* ``disabled``
    versions auto clean disabled, versions will be kept forever

Defaults to ``auto``

Nextcloud Verifications
-----------------------

Nextcloud performs several verification checks. There are two options,
``true`` and ``false``.


appcodechecker
^^^^^^^^^^^^^^


::

	'appcodechecker' => true,

Checks an app before install whether it uses private APIs instead of the
proper public APIs. If this is set to true it will only allow to install or
enable apps that pass this check.

Defaults to ``false``

updatechecker
^^^^^^^^^^^^^


::

	'updatechecker' => true,

Check if Nextcloud is up-to-date and shows a notification if a new version is
available. It sends current version, php version, installation and last update
time and release channel to the updater server which responds with the latest
available version based on those metrics.

Defaults to ``true``

updater.server.url
^^^^^^^^^^^^^^^^^^


::

	'updater.server.url' => 'https://updates.nextcloud.com/updater_server/',

URL that Nextcloud should use to look for updates

Defaults to ``https://updates.nextcloud.com/updater_server/``

updater.release.channel
^^^^^^^^^^^^^^^^^^^^^^^


::

	'updater.release.channel' => 'stable',

The channel that Nextcloud should use to look for updates

Supported values:

- ``daily``
- ``beta``
- ``stable``

has_internet_connection
^^^^^^^^^^^^^^^^^^^^^^^


::

	'has_internet_connection' => true,

Is Nextcloud connected to the Internet or running in a closed network?

Defaults to ``true``

connectivity_check_domains
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'connectivity_check_domains' => [
		'https://www.nextcloud.com',
		'https://www.startpage.com',
		'https://www.eff.org',
		'https://www.edri.org'
	],

Which domains to request to determine the availability of an Internet
connection. If none of these hosts are reachable, the administration panel
will show a warning. Set to an empty list to not do any such checks (warning
will still be shown).

If no protocol is provided, both http and https will be tested.
For example, 'http://www.nextcloud.com' and 'https://www.nextcloud.com'
will be tested for 'www.nextcloud.com'
If a protocol is provided, only this one will be tested.

Defaults to the following domains:

 - https://www.nextcloud.com
 - https://www.startpage.com
 - https://www.eff.org
 - https://www.edri.org

check_for_working_wellknown_setup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'check_for_working_wellknown_setup' => true,

Allows Nextcloud to verify a working .well-known URL redirects. This is done
by attempting to make a request from JS to
https://your-domain.com/.well-known/caldav/

Defaults to ``true``

check_for_working_htaccess
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'check_for_working_htaccess' => true,

This is a crucial security check on Apache servers that should always be set
to ``true``. This verifies that the ``.htaccess`` file is writable and works.

If it is not, then any options controlled by ``.htaccess``, such as large
file uploads, will not work. It also runs checks on the ``data/`` directory,
which verifies that it can't be accessed directly through the Web server.

Defaults to ``true``

check_data_directory_permissions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'check_data_directory_permissions' => true,

In rare setups (e.g. on Openshift or Docker on Windows) the permissions check
might block the installation while the underlying system offers no means to
"correct" the permissions. In this case, set the value to false.

In regular cases, if issues with permissions are encountered they should be
adjusted accordingly. Changing the flag is discouraged.

Defaults to ``true``

config_is_read_only
^^^^^^^^^^^^^^^^^^^


::

	'config_is_read_only' => false,

In certain environments it is desired to have a read-only configuration file.

When this switch is set to ``true``, writing to the config file will be
forbidden. Therefore, it will not be possible to configure all options via
the Web interface. Furthermore, when updating Nextcloud it is required to
make the configuration file writable again and to set this switch to ``false``
for the update process.

Defaults to ``false``

Logging
-------


log_type
^^^^^^^^


::

	'log_type' => 'file',

This parameter determines where the Nextcloud logs are sent.

``file``: the logs are written to file ``nextcloud.log`` in the default
Nextcloud data directory. The log file can be changed with parameter
``logfile``.
``syslog``: the logs are sent to the system log. This requires a syslog daemon
to be active.
``errorlog``: the logs are sent to the PHP ``error_log`` function.
``systemd``: the logs are sent to the Systemd journal. This requires a system
that runs Systemd and the Systemd journal. The PHP extension ``systemd``
must be installed and active.

Defaults to ``file``

log_type_audit
^^^^^^^^^^^^^^


::

	'log_type_audit' => 'file',

This parameter determines where the audit logs are sent. See ``log_type`` for more information.

Defaults to ``file``

logfile
^^^^^^^


::

	'logfile' => '/var/log/nextcloud.log',

Name of the file to which the Nextcloud logs are written if parameter
``log_type`` is set to ``file``.

Defaults to ``[datadirectory]/nextcloud.log``

logfile_audit
^^^^^^^^^^^^^


::

	'logfile_audit' => '/var/log/audit.log',

Name of the file to which the audit logs are written if parameter
``log_type`` is set to ``file``.

Defaults to ``[datadirectory]/audit.log``

logfilemode
^^^^^^^^^^^


::

	'logfilemode' => 0640,

Log file mode for the Nextcloud logging type in octal notation.

Defaults to 0640 (writeable by user, readable by group).

loglevel
^^^^^^^^


::

	'loglevel' => 2,

Loglevel to start logging at. Valid values are: 0 = Debug, 1 = Info, 2 =
Warning, 3 = Error, and 4 = Fatal. The default value is Warning.

Defaults to ``2``

loglevel_frontend
^^^^^^^^^^^^^^^^^


::

	'loglevel_frontend' => 2,

Loglevel used by the frontend to start logging at. The same values as
for ``loglevel`` can be used. If not set it defaults to the value
configured for ``loglevel`` or Warning if that is not set either.

Defaults to ``2``

loglevel_dirty_database_queries
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'loglevel_dirty_database_queries' => 0,

Loglevel used by the dirty database query detection. Useful to identify
potential database bugs in production. Set this to loglevel or higher to
see dirty queries in the logs.

Defaults to ``0`` (debug)

syslog_tag
^^^^^^^^^^


::

	'syslog_tag' => 'Nextcloud',

If you maintain different instances and aggregate the logs, you may want
to distinguish between them. ``syslog_tag`` can be set per instance
with a unique id. Only available if ``log_type`` is set to ``syslog`` or
``systemd``.

The default value is ``Nextcloud``.

syslog_tag_audit
^^^^^^^^^^^^^^^^


::

	'syslog_tag_audit' => 'Nextcloud',

If you maintain different instances and aggregate the logs, you may want
to distinguish between them. ``syslog_tag_audit`` can be set per instance
with a unique id. Only available if ``log_type`` is set to ``syslog`` or
``systemd``.

The default value is the value of ``syslog_tag``.

log.condition
^^^^^^^^^^^^^


::

	'log.condition' => [
		'shared_secret' => '57b58edb6637fe3059b3595cf9c41b9',
		'users' => ['sample-user'],
		'apps' => ['files'],
		'matches' => [
			[
				'shared_secret' => '57b58edb6637fe3059b3595cf9c41b9',
				'users' => ['sample-user'],
				'apps' => ['files'],
				'loglevel' => 1,
				'message' => 'contains substring'
			],
		],
	],

Log condition for log level increase based on conditions. Once one of these
conditions is met, the required log level is set to debug. This allows to
debug specific requests, users or apps

Supported conditions:
 - ``shared_secret``: if a request parameter with the name `log_secret` is set to
               this value the condition is met
 - ``users``:  if the current request is done by one of the specified users,
               this condition is met
 - ``apps``:   if the log message is invoked by one of the specified apps,
               this condition is met
 - ``matches``: if all the conditions inside a group match,
               this condition is met. This allows to log only entries to an app
               by a few users.

Defaults to an empty array.

log.backtrace
^^^^^^^^^^^^^


::

	'log.backtrace' => false,

Enables logging a backtrace with each log line. Normally, only Exceptions
are carrying backtrace information which are logged automatically. This
switch turns them on for any log message. Enabling this option will lead
to increased log data size.

Defaults to ``false``.

logdateformat
^^^^^^^^^^^^^


::

	'logdateformat' => 'F d, Y H:i:s',

This uses PHP.date formatting; see https://www.php.net/manual/en/function.date.php

Defaults to ISO 8601 ``2005-08-15T15:52:01+00:00`` - see \DateTime::ATOM
(https://www.php.net/manual/en/class.datetime.php#datetime.constants.atom)

logtimezone
^^^^^^^^^^^


::

	'logtimezone' => 'Europe/Berlin',

The timezone for logfiles. You may change this; see
https://www.php.net/manual/en/timezones.php

Defaults to ``UTC``

log_query
^^^^^^^^^


::

	'log_query' => false,

Append all database queries and parameters to the log file. Use this only for
debugging, as your logfile will become huge.

log_rotate_size
^^^^^^^^^^^^^^^


::

	'log_rotate_size' => 100 * 1024 * 1024,

Enables log rotation and limits the total size of logfiles. Set it to 0 for
no rotation. Specify a size in bytes, for example 104857600 (100 megabytes
= 100 * 1024 * 1024 bytes). A new logfile is created with a new name when the
old logfile reaches your limit. If a rotated log file is already present, it
will be overwritten.

Defaults to 100 MB

profiler
^^^^^^^^


::

	'profiler' => false,

Enable built-in profiler. Helpful when trying to debug performance
issues.

Note that this has a performance impact and shouldn't be enabled
on production.

Alternate Code Locations
------------------------

Some Nextcloud code may be stored in alternate locations.


customclient_desktop
^^^^^^^^^^^^^^^^^^^^


::

	'customclient_desktop' =>
		'https://nextcloud.com/install/#install-clients',
	'customclient_android' =>
		'https://play.google.com/store/apps/details?id=com.nextcloud.client',
	'customclient_ios' =>
		'https://itunes.apple.com/us/app/nextcloud/id1125420102?mt=8',
	'customclient_ios_appid' =>
			'1125420102',
	'customclient_fdroid' =>
		'https://f-droid.org/packages/com.nextcloud.client/',

This section is for configuring the download links for Nextcloud clients, as
seen in the first-run wizard and on Personal pages.

Defaults to:

- Desktop client: ``https://nextcloud.com/install/#install-clients``
- Android client: ``https://play.google.com/store/apps/details?id=com.nextcloud.client``
- iOS client: ``https://itunes.apple.com/us/app/nextcloud/id1125420102?mt=8``
- iOS client app id: ``1125420102``
- F-Droid client: ``https://f-droid.org/packages/com.nextcloud.client/``

Apps
----

Options for the Apps folder, Apps store, and App code checker.


defaultapp
^^^^^^^^^^


::

	'defaultapp' => 'dashboard,files',

Set the default app to open on login. The entry IDs can be retrieved from
the Navigations OCS API endpoint: https://docs.nextcloud.com/server/latest/develper_manual/_static/openapi.html#/operations/core-navigation-get-apps-navigation.

You can use a comma-separated list of app names, so if the first
app is not enabled for a user then Nextcloud will try the second one, and so
on. If no enabled apps are found it defaults to the dashboard app.

Defaults to ``dashboard,files``

appstoreenabled
^^^^^^^^^^^^^^^


::

	'appstoreenabled' => true,

When enabled, admins may install apps from the Nextcloud app store.

Defaults to ``true``

appstoreurl
^^^^^^^^^^^


::

	'appstoreurl' => 'https://apps.nextcloud.com/api/v1',

Enables the installation of apps from a self-hosted apps store.

Requires that at least one of the configured apps directories is writeable.

Defaults to ``https://apps.nextcloud.com/api/v1``

appsallowlist
^^^^^^^^^^^^^


::

	'appsallowlist' => [],

Filters allowed installable apps from the appstore.

Empty array will prevent all apps from the store to be found.

apps_paths
^^^^^^^^^^


::

	'apps_paths' => [
		[
			'path'=> '/var/www/nextcloud/apps',
			'url' => '/apps',
			'writable' => true,
		],
	],

Use the ``apps_paths`` parameter to set the location of the Apps directory,
which should be scanned for available apps, and where user-specific apps
should be installed from the Apps store. The ``path`` defines the absolute
file system path to the app folder. The key ``url`` defines the HTTP Web path
to that folder, starting from the Nextcloud webroot. The key ``writable``
indicates if a Web server can write files to that folder.





Previews
--------

Nextcloud supports previews of image files, the covers of MP3 files, and text
files. These options control enabling and disabling previews, and thumbnail
size.


enable_previews
^^^^^^^^^^^^^^^


::

	'enable_previews' => true,

By default, Nextcloud can generate previews for the following filetypes:

- Image files
- Covers of MP3 files
- Text documents

Valid values are ``true``, to enable previews, or
``false``, to disable previews

Defaults to ``true``

preview_concurrency_all
^^^^^^^^^^^^^^^^^^^^^^^


::

	'preview_concurrency_all' => 8,

Number of all preview requests being processed concurrently,
including previews that need to be newly generated, and those that have
been generated.

This should be greater than 'preview_concurrency_new'.
If unspecified, defaults to twice the value of 'preview_concurrency_new'.

preview_concurrency_new
^^^^^^^^^^^^^^^^^^^^^^^


::

	'preview_concurrency_new' => 4,

Number of new previews that are being concurrently generated.

Depending on the max preview size set by 'preview_max_x' and 'preview_max_y',
the generation process can consume considerable CPU and memory resources.
It's recommended to limit this to be no greater than the number of CPU cores.
If unspecified, defaults to the number of CPU cores, or 4 if that cannot
be determined.

preview_max_x
^^^^^^^^^^^^^


::

	'preview_max_x' => 4096,

The maximum width, in pixels, of a preview. A value of ``null`` means there
is no limit.

Defaults to ``4096``

preview_max_y
^^^^^^^^^^^^^


::

	'preview_max_y' => 4096,

The maximum height, in pixels, of a preview. A value of ``null`` means there
is no limit.

Defaults to ``4096``

preview_max_filesize_image
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'preview_max_filesize_image' => 50,

Max file size for generating image previews with imagegd (default behavior).

If the image is bigger, it'll try other preview generators, but will most
likely either show the default mimetype icon or not display the image at all.
Set to ``-1`` for no limit and try to generate image previews on all file sizes.

Defaults to ``50`` megabytes

preview_max_memory
^^^^^^^^^^^^^^^^^^


::

	'preview_max_memory' => 256,

max memory for generating image previews with imagegd (default behavior)
Reads the image dimensions from the header and assumes 32 bits per pixel.

If creating the image would allocate more memory, preview generation will
be disabled and the default mimetype icon is shown. Set to -1 for no limit.

Defaults to ``256`` megabytes

preview_libreoffice_path
^^^^^^^^^^^^^^^^^^^^^^^^


::

	'preview_libreoffice_path' => '/usr/bin/libreoffice',

custom path for LibreOffice/OpenOffice binary

Defaults to ``''`` (empty string)

preview_ffmpeg_path
^^^^^^^^^^^^^^^^^^^


::

	'preview_ffmpeg_path' => '/usr/bin/ffmpeg',

custom path for ffmpeg binary

Defaults to ``null`` and falls back to searching ``avconv`` and ``ffmpeg``
in the configured ``PATH`` environment

preview_imaginary_url
^^^^^^^^^^^^^^^^^^^^^


::

	'preview_imaginary_url' => 'http://previews_hpb:8088/',

Set the URL of the Imaginary service to send image previews to.

Also requires the ``OC\Preview\Imaginary`` provider to be enabled in the
``enabledPreviewProviders`` array, to create previews for these mimetypes: bmp,
x-bitmap, png, jpeg, gif, heic, heif, svg+xml, tiff, webp and illustrator.

If you want Imaginary to also create preview images from PDF Documents, you
have to add the ``OC\Preview\ImaginaryPDF`` provider as well.

See https://github.com/h2non/imaginary

preview_imaginary_key
^^^^^^^^^^^^^^^^^^^^^


::

	'preview_imaginary_key' => 'secret',

If you want set a api key for imaginary.

enabledPreviewProviders
^^^^^^^^^^^^^^^^^^^^^^^


::

	'enabledPreviewProviders' => [
		'OC\Preview\BMP',
		'OC\Preview\GIF',
		'OC\Preview\JPEG',
		'OC\Preview\Krita',
		'OC\Preview\MarkDown',
		'OC\Preview\MP3',
		'OC\Preview\OpenDocument',
		'OC\Preview\PNG',
		'OC\Preview\TXT',
		'OC\Preview\XBitmap',
	],

Only register providers that have been explicitly enabled

The following providers are disabled by default due to performance or privacy
concerns:

 - ``OC\Preview\Font``
 - ``OC\Preview\HEIC``
 - ``OC\Preview\Illustrator``
 - ``OC\Preview\Movie``
 - ``OC\Preview\MSOffice2003``
 - ``OC\Preview\MSOffice2007``
 - ``OC\Preview\MSOfficeDoc``
 - ``OC\Preview\PDF``
 - ``OC\Preview\Photoshop``
 - ``OC\Preview\Postscript``
 - ``OC\Preview\StarOffice``
 - ``OC\Preview\SVG``
 - ``OC\Preview\TIFF``
 - ``OC\Preview\EMF``


Defaults to the following providers:

 - ``OC\Preview\BMP``
 - ``OC\Preview\GIF``
 - ``OC\Preview\JPEG``
 - ``OC\Preview\Krita``
 - ``OC\Preview\MarkDown``
 - ``OC\Preview\MP3``
 - ``OC\Preview\OpenDocument``
 - ``OC\Preview\PNG``
 - ``OC\Preview\TXT``
 - ``OC\Preview\XBitmap``

metadata_max_filesize
^^^^^^^^^^^^^^^^^^^^^


::

	'metadata_max_filesize' => 256,

Maximum file size for metadata generation.

If a file exceeds this size, metadata generation will be skipped.
Note: memory equivalent to this size will be used for metadata generation.

Default: 256 megabytes.

LDAP
----

Global settings used by LDAP User and Group Backend


ldapUserCleanupInterval
^^^^^^^^^^^^^^^^^^^^^^^


::

	'ldapUserCleanupInterval' => 51,

defines the interval in minutes for the background job that checks user
existence and marks them as ready to be cleaned up. The number is always
minutes. Setting it to 0 disables the feature.

See command line (occ) methods ``ldap:show-remnants`` and ``user:delete``

Defaults to ``51`` minutes

sort_groups_by_name
^^^^^^^^^^^^^^^^^^^


::

	'sort_groups_by_name' => false,

Sort groups in the user settings by name instead of the user count

By enabling this the user count beside the group name is disabled as well.

Comments
--------

Global settings for the Comments infrastructure


comments.managerFactory
^^^^^^^^^^^^^^^^^^^^^^^


::

	'comments.managerFactory' => '\OC\Comments\ManagerFactory',

Replaces the default Comments Manager Factory. This can be utilized if an
own or 3rdParty CommentsManager should be used that – for instance – uses the
filesystem instead of the database to keep the comments.

Defaults to ``\OC\Comments\ManagerFactory``

systemtags.managerFactory
^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'systemtags.managerFactory' => '\OC\SystemTag\ManagerFactory',

Replaces the default System Tags Manager Factory. This can be utilized if an
own or 3rdParty SystemTagsManager should be used that – for instance – uses the
filesystem instead of the database to keep the tags.

Defaults to ``\OC\SystemTag\ManagerFactory``

Maintenance
-----------

These options are for halting user activity when you are performing server
maintenance.


maintenance
^^^^^^^^^^^


::

	'maintenance' => false,

Enable maintenance mode to disable Nextcloud

If you want to prevent users from logging in to Nextcloud before you start
doing some maintenance work, you need to set the value of the maintenance
parameter to true. Please keep in mind that users who are already logged-in
are kicked out of Nextcloud instantly.

Defaults to ``false``

maintenance_window_start
^^^^^^^^^^^^^^^^^^^^^^^^


::

	'maintenance_window_start' => 1,

UTC Hour for maintenance windows

Some background jobs only run once a day. When an hour is defined for this config,
the background jobs which advertise themselves as not time sensitive will be
delayed during the "working" hours and only run in the 4 hours after the given time.
This is e.g. used for activity expiration, suspicious login training and update checks.

A value of 1 e.g. will only run these background jobs between 01:00am UTC and 05:00am UTC.

Defaults to ``100`` which disables the feature

ldap_log_file
^^^^^^^^^^^^^


::

	'ldap_log_file' => '',

Log all LDAP requests into a file

Warning: This heavily decreases the performance of the server and is only
meant to debug/profile the LDAP interaction manually.
Also, it might log sensitive data into a plain text file.

SSL
---


openssl
^^^^^^^


::

	'openssl' => [
		'config' => '/absolute/location/of/openssl.cnf',
	],

Extra SSL options to be used for configuration.

Defaults to an empty array.

Memory caching backend configuration
------------------------------------

Available cache backends:

* ``\OC\Memcache\APCu``       APC user backend
* ``\OC\Memcache\ArrayCache`` In-memory array-based backend (not recommended)
* ``\OC\Memcache\Memcached``  Memcached backend
* ``\OC\Memcache\Redis``      Redis backend

Advice on choosing between the various backends:

* APCu should be easiest to install. Almost all distributions have packages.
  Use this for single user environment for all caches.
* Use Redis or Memcached for distributed environments.
  For the local cache (you can configure two) take APCu.


memcache.local
^^^^^^^^^^^^^^


::

	'memcache.local' => '\OC\Memcache\APCu',

Memory caching backend for locally stored data

* Used for host-specific data, e.g. file paths

Defaults to ``none``

memcache.distributed
^^^^^^^^^^^^^^^^^^^^


::

	'memcache.distributed' => '\OC\Memcache\Memcached',

Memory caching backend for distributed data

* Used for installation-specific data, e.g. database caching
* If unset, defaults to the value of memcache.local

Defaults to ``none``

redis
^^^^^


::

	'redis' => [
		'host' => 'localhost', // can also be a unix domain socket: '/tmp/redis.sock'
		'port' => 6379,
		'timeout' => 0.0,
		'read_timeout' => 0.0,
		'user' =>  '', // Optional: if not defined, no password will be used.
		'password' => '', // Optional: if not defined, no password will be used.
		'dbindex' => 0, // Optional: if undefined SELECT will not run and will use Redis Server's default DB Index.
		// If redis in-transit encryption is enabled, provide certificates
		// SSL context https://www.php.net/manual/en/context.ssl.php
		'ssl_context' => [
			'local_cert' => '/certs/redis.crt',
			'local_pk' => '/certs/redis.key',
			'cafile' => '/certs/ca.crt'
		]
	],

Connection details for redis to use for memory caching in a single server configuration.

For enhanced security it is recommended to configure Redis
to require a password. See http://redis.io/topics/security
for more information.

We also support redis SSL/TLS encryption as of version 6.
See https://redis.io/topics/encryption for more information.

redis.cluster
^^^^^^^^^^^^^


::

	'redis.cluster' => [
		'seeds' => [ // provide some or all of the cluster servers to bootstrap discovery, port required
			'localhost:7000',
			'localhost:7001',
		],
		'timeout' => 0.0,
		'read_timeout' => 0.0,
		'failover_mode' => \RedisCluster::FAILOVER_ERROR,
		'user' =>  '', // Optional: if not defined, no password will be used.
		'password' => '', // Optional: if not defined, no password will be used.
		// If redis in-transit encryption is enabled, provide certificates
		// SSL context https://www.php.net/manual/en/context.ssl.php
		'ssl_context' => [
			'local_cert' => '/certs/redis.crt',
			'local_pk' => '/certs/redis.key',
			'cafile' => '/certs/ca.crt'
		]
	],

Connection details for a Redis Cluster.

Redis Cluster support requires the php module phpredis in version 3.0.0 or
higher.

Available failover modes:
 - \\RedisCluster::FAILOVER_NONE - only send commands to master nodes (default)
 - \\RedisCluster::FAILOVER_ERROR - failover to slaves for read commands if master is unavailable (recommended)
 - \\RedisCluster::FAILOVER_DISTRIBUTE - randomly distribute read commands across master and slaves

WARNING: FAILOVER_DISTRIBUTE is a not recommended setting, and we strongly
suggest to not use it if you use Redis for file locking. Due to the way Redis
is synchronized it could happen, that the read for an existing lock is
scheduled to a slave that is not fully synchronized with the connected master
which then causes a FileLocked exception.

See https://redis.io/topics/cluster-spec for details about the Redis cluster

Authentication works with phpredis version 4.2.1+. See
https://github.com/phpredis/phpredis/commit/c5994f2a42b8a348af92d3acb4edff1328ad8ce1

memcached_servers
^^^^^^^^^^^^^^^^^


::

	'memcached_servers' => [
		// hostname, port and optional weight
		// or path and port 0 for unix socket. Also see:
		// https://www.php.net/manual/en/memcached.addservers.php
		// https://www.php.net/manual/en/memcached.addserver.php
		['localhost', 11211],
		//array('other.host.local', 11211),
	],

Server details for one or more memcached servers to use for memory caching.

memcached_options
^^^^^^^^^^^^^^^^^


::

	'memcached_options' => [
		// Set timeouts to 50ms
		\Memcached::OPT_CONNECT_TIMEOUT => 50,
		\Memcached::OPT_RETRY_TIMEOUT =>   50,
		\Memcached::OPT_SEND_TIMEOUT =>    50,
		\Memcached::OPT_RECV_TIMEOUT =>    50,
		\Memcached::OPT_POLL_TIMEOUT =>    50,
	
		// Enable compression
		\Memcached::OPT_COMPRESSION =>          true,
	
		// Turn on consistent hashing
		\Memcached::OPT_LIBKETAMA_COMPATIBLE => true,
	
		// Enable Binary Protocol
		\Memcached::OPT_BINARY_PROTOCOL =>      true,
	
		// Binary serializer vill be enabled if the igbinary PECL module is available
		//\Memcached::OPT_SERIALIZER => \Memcached::SERIALIZER_IGBINARY,
	],

Connection options for memcached

cache_path
^^^^^^^^^^


::

	'cache_path' => '',

Location of the cache folder, defaults to ``data/$user/cache`` where
``$user`` is the current user. When specified, the format will change to
``$cache_path/$user`` where ``$cache_path`` is the configured cache directory
and ``$user`` is the user.

Defaults to ``''`` (empty string)

cache_chunk_gc_ttl
^^^^^^^^^^^^^^^^^^


::

	'cache_chunk_gc_ttl' => 60*60*24,

TTL of chunks located in the cache folder before they're removed by
garbage collection (in seconds). Increase this value if users have
issues uploading very large files via the Nextcloud Client as upload isn't
completed within one day.

Defaults to ``60*60*24`` (1 day)

Using Object Store with Nextcloud
---------------------------------


objectstore
^^^^^^^^^^^


::

	'objectstore' => [
		'class' => 'OC\\Files\\ObjectStore\\Swift',
		'arguments' => [
			// trystack will use your facebook id as the username
			'username' => 'facebook100000123456789',
			// in the trystack dashboard go to user -> settings -> API Password to
			// generate a password
			'password' => 'Secr3tPaSSWoRdt7',
			// must already exist in the objectstore, name can be different
			'container' => 'nextcloud',
			// prefix to prepend to the fileid, default is 'oid:urn:'
			'objectPrefix' => 'oid:urn:',
			// create the container if it does not exist. default is false
			'autocreate' => true,
			// required, dev-/trystack defaults to 'RegionOne'
			'region' => 'RegionOne',
			// The Identity / Keystone endpoint
			'url' => 'http://8.21.28.222:5000/v2.0',
			// uploadPartSize: size of the uploaded chunks, defaults to 524288000
			'uploadPartSize' => 524288000,
			// required on dev-/trystack
			'tenantName' => 'facebook100000123456789',
			// dev-/trystack uses swift by default, the lib defaults to 'cloudFiles'
			// if omitted
			'serviceName' => 'swift',
			// The Interface / url Type, optional
			'urlType' => 'internal'
		],
	],

This example shows how to configure Nextcloud to store all files in a
swift object storage.

It is important to note that Nextcloud in object store mode will expect
exclusive access to the object store container because it only stores the
binary data for each file. The metadata is currently kept in the local
database for performance reasons.

WARNING: The current implementation is incompatible with any app that uses
direct file IO and circumvents our virtual filesystem. That includes
Encryption and Gallery. Gallery will store thumbnails directly in the
filesystem and encryption will cause severe overhead because key files need
to be fetched in addition to any requested file.

objectstore
^^^^^^^^^^^


::

	'objectstore' => [
		'class' => 'OC\\Files\\ObjectStore\\Swift',
		'arguments' => [
			'autocreate' => true,
			'user' => [
				'name' => 'swift',
				'password' => 'swift',
				'domain' => [
					'name' => 'default',
				],
			],
			'scope' => [
				'project' => [
					'name' => 'service',
					'domain' => [
						'name' => 'default',
					],
				],
			],
			'tenantName' => 'service',
			'serviceName' => 'swift',
			'region' => 'regionOne',
			'url' => 'http://yourswifthost:5000/v3',
			'bucket' => 'nextcloud',
		],
	],

To use swift V3

objectstore.multibucket.preview-distribution
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'objectstore.multibucket.preview-distribution' => false,

If this is set to true and a multibucket object store is configured then
newly created previews are put into 256 dedicated buckets.

Those buckets are named like the mulibucket version but with the postfix
``-preview-NUMBER`` where NUMBER is between 0 and 255.

Keep in mind that only previews of files are put in there that don't have
some already. Otherwise, the old bucket will be used.

To migrate existing previews to this new multibucket distribution of previews
use the occ command ``preview:repair``. For now this will only migrate
previews that were generated before Nextcloud 19 in the flat
``appdata_INSTANCEID/previews/FILEID`` folder structure.

Sharing
-------

Global settings for Sharing


sharing.managerFactory
^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.managerFactory' => '\OC\Share20\ProviderFactory',

Replaces the default Share Provider Factory. This can be utilized if
own or 3rdParty Share Providers are used that – for instance – use the
filesystem instead of the database to keep the share information.

Defaults to ``\OC\Share20\ProviderFactory``

sharing.enable_mail_link_password_expiration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.enable_mail_link_password_expiration' => false,

Enables expiration for link share passwords sent by email (sharebymail).

The passwords will expire after the configured interval, the users can
still request a new one in the public link page.

sharing.mail_link_password_expiration_interval
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.mail_link_password_expiration_interval' => 3600,

Expiration interval for passwords, in seconds.

sharing.maxAutocompleteResults
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.maxAutocompleteResults' => 25,

Define max number of results returned by the search for auto-completion of
users, groups, etc. The value must not be lower than 0 (for unlimited).

If more, different sources are requested (e.g. different user backends; or
both users and groups), the value is applied per source and might not be
truncated after collecting the results. I.e. more results can appear than
configured here.

Default is 25.

sharing.minSearchStringLength
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.minSearchStringLength' => 0,

Define the minimum length of the search string before we start auto-completion
Default is no limit (value set to 0)

sharing.enable_share_accept
^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.enable_share_accept' => false,

Set to true to enable that internal shares need to be accepted by the users by default.

Users can change this for their account in their personal sharing settings

sharing.force_share_accept
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.force_share_accept' => false,

Set to true to enforce that internal shares need to be accepted

sharing.allow_custom_share_folder
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.allow_custom_share_folder' => true,

Set to ``false``, to prevent users from setting a custom share_folder

share_folder
^^^^^^^^^^^^


::

	'share_folder' => '/',

Define a default folder for shared files and folders other than root.

Changes to this value will only have effect on new shares.

Defaults to ``/``

sharing.enable_share_mail
^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.enable_share_mail' => true,

Set to ``false``, to stop sending a mail when users receive a share

sharing.allow_disabled_password_enforcement_groups
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.allow_disabled_password_enforcement_groups' => false,

Set to true to enable the feature to add exceptions for share password enforcement

transferIncomingShares
^^^^^^^^^^^^^^^^^^^^^^


::

	'transferIncomingShares' => false,

Set to true to always transfer incoming shares by default
when running "occ files:transfer-ownership".

Defaults to false, so incoming shares are not transferred if not specifically requested
by a command line argument.

Federated Cloud Sharing
-----------------------


sharing.federation.allowSelfSignedCertificates
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'sharing.federation.allowSelfSignedCertificates' => false,

Allow self-signed certificates for federated shares

Hashing
-------


hashing_default_password
^^^^^^^^^^^^^^^^^^^^^^^^


::

	'hashing_default_password' => false,

By default, Nextcloud will use the Argon2 password hashing if available.

However, if for whatever reason you want to stick with the PASSWORD_DEFAULT
of your php version. Then set the setting to true.

Nextcloud uses the Argon2 algorithm (with PHP >= 7.2) to create hashes by its
own and exposes its configuration options as following. More information can
be found at: https://www.php.net/manual/en/function.password-hash.php

hashingThreads
^^^^^^^^^^^^^^


::

	'hashingThreads' => PASSWORD_ARGON2_DEFAULT_THREADS,

The number of CPU threads to be used by the algorithm for computing a hash.

The value must be an integer, and the minimum value is 1. Rationally it does
not help to provide a number higher than the available threads on the machine.
Values that undershoot the minimum will be ignored in favor of the minimum.

hashingMemoryCost
^^^^^^^^^^^^^^^^^


::

	'hashingMemoryCost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,

The memory in KiB to be used by the algorithm for computing a hash. The value
must be an integer, and the minimum value is 8 times the number of CPU threads.

Values that undershoot the minimum will be ignored in favor of the minimum.

hashingTimeCost
^^^^^^^^^^^^^^^


::

	'hashingTimeCost' => PASSWORD_ARGON2_DEFAULT_TIME_COST,

The number of iterations that are used by the algorithm for computing a hash.

The value must be an integer, and the minimum value is 1. Values that
undershoot the minimum will be ignored in favor of the minimum.

hashingCost
^^^^^^^^^^^


::

	'hashingCost' => 10,

The hashing cost used by hashes generated by Nextcloud
Using a higher value requires more time and CPU power to calculate the hashes

All other configuration options
-------------------------------


dbdriveroptions
^^^^^^^^^^^^^^^


::

	'dbdriveroptions' => [
		PDO::MYSQL_ATTR_SSL_CA => '/file/path/to/ca_cert.pem',
		PDO::MYSQL_ATTR_SSL_KEY => '/file/path/to/mysql-client-key.pem',
		PDO::MYSQL_ATTR_SSL_CERT => '/file/path/to/mysql-client-cert.pem',
		PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
		PDO::MYSQL_ATTR_INIT_COMMAND => 'SET wait_timeout = 28800'
	],

Additional driver options for the database connection, e.g. to enable SSL
encryption in MySQL or specify a custom wait timeout on a cheap hoster.

When setting up TLS/SSL for encrypting the connections, you need to ensure that
the passed keys and certificates are readable by the PHP process. In addition,
PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT might need to be set to false, if the
database servers certificates CN does not match with the hostname used to connect.
The standard behavior here is different from the MySQL/MariaDB CLI client, which
does not verify the server cert except --ssl-verify-server-cert is passed manually.

sqlite.journal_mode
^^^^^^^^^^^^^^^^^^^


::

	'sqlite.journal_mode' => 'DELETE',

sqlite3 journal mode can be specified using this configuration parameter -
can be 'WAL' or 'DELETE' see for more details https://www.sqlite.org/wal.html

mysql.utf8mb4
^^^^^^^^^^^^^


::

	'mysql.utf8mb4' => false,

During setup, if requirements are met (see below), this setting is set to true
and MySQL can handle 4 byte characters instead of 3 byte characters.

If you want to convert an existing 3-byte setup into a 4-byte setup please
set the parameters in MySQL as mentioned below and run the migration command:
./occ db:convert-mysql-charset
The config setting will be set automatically after a successful run.

Consult the documentation for more details.

MySQL requires a special setup for longer indexes (> 767 bytes) which are
needed:

[mysqld]
innodb_large_prefix=ON
innodb_file_format=Barracuda
innodb_file_per_table=ON

Tables will be created with
 * character set: utf8mb4
 * collation:     utf8mb4_bin
 * row_format:    dynamic

See:
https://dev.mysql.com/doc/refman/5.7/en/charset-unicode-utf8mb4.html
https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_large_prefix
https://mariadb.com/kb/en/mariadb/xtradbinnodb-server-system-variables/#innodb_large_prefix
http://www.tocker.ca/2013/10/31/benchmarking-innodb-page-compression-performance.html
http://mechanics.flite.com/blog/2014/07/29/using-innodb-large-prefix-to-avoid-error-1071/

mysql.collation
^^^^^^^^^^^^^^^


::

	'mysql.collation' => null,

For search queries in the database, a default collation – depending on the
character set – is chosen. In some cases a different behaviour is desired,
for instances when an accent sensitive search is desired.

MariaDB and MySQL have an overlap in available collations, but also
incompatible ones, also depending on the version of the database server.

This option allows to override the automatic choice. Example:

'mysql.collation' => 'utf8mb4_0900_as_ci',

This setting has no effect on setup or creating tables. In those cases
always utf8[mb4]_bin is being used. This setting is only taken into
consideration in SQL queries that utilize LIKE comparison operators.

supportedDatabases
^^^^^^^^^^^^^^^^^^


::

	'supportedDatabases' => [
		'sqlite',
		'mysql',
		'pgsql',
		'oci',
	],

Database types that are supported for installation.

Available:
	- sqlite (SQLite3)
	- mysql (MySQL)
	- pgsql (PostgreSQL)
	- oci (Oracle)

Defaults to the following databases:
 - sqlite (SQLite3)
 - mysql (MySQL)
 - pgsql (PostgreSQL)

tempdirectory
^^^^^^^^^^^^^


::

	'tempdirectory' => '/tmp/nextcloudtemp',

Override where Nextcloud stores temporary files. Useful in situations where
the system temporary directory is on a limited space ramdisk or is otherwise
restricted, or if external storage which do not support streaming are in
use.

The Web server user/PHP must have write access to this directory.
Additionally you have to make sure that your PHP configuration considers this a valid
tmp directory, by setting the TMP, TMPDIR, and TEMP variables to the required directories.
On top of that you might be required to grant additional permissions in AppArmor or SELinux.

updatedirectory
^^^^^^^^^^^^^^^


::

	'updatedirectory' => '',

Override where Nextcloud stores update files while updating. Useful in situations
where the default `datadirectory` is on network disk like NFS, or is otherwise
restricted. Defaults to the value of `datadirectory` if unset.

If set, the value MUST be located _outside_ of the installation directory of Nextcloud and
writable by the Web server user.

forbidden_filenames
^^^^^^^^^^^^^^^^^^^


::

	'forbidden_filenames' => ['.htaccess'],

Block a specific file or files and disallow the upload of files with this name.

This blocks any access to those files (read and write).
``.htaccess`` is blocked by default.

WARNING: USE THIS ONLY IF YOU KNOW WHAT YOU ARE DOING.

Note that this list is case-insensitive.

Defaults to ``array('.htaccess')``

forbidden_filename_basenames
^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'forbidden_filename_basenames' => [],

Disallow the upload of files with specific basenames.

Matching existing files can no longer be updated and in matching folders no files can be created anymore.

The basename is the name of the file without the extension,
e.g. for "archive.tar.gz" the basename would be "archive".

Note that this list is case-insensitive.

Defaults to ``array()``

forbidden_filename_characters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'forbidden_filename_characters' => [],

Block characters from being used in filenames. This is useful if you
have a filesystem or OS which does not support certain characters like windows.

Matching existing files can no longer be updated and in matching folders no files can be created anymore.

The '/' and '\' characters are always forbidden, as well as all characters in the ASCII range [0-31].

Example for windows systems: ``array('?', '<', '>', ':', '*', '|', '"')``
see https://en.wikipedia.org/wiki/Comparison_of_file_systems#Limits

Defaults to ``array()``

forbidden_filename_extensions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'forbidden_filename_extensions' => ['.part', '.filepart'],

Deny extensions from being used for filenames.

Matching existing files can no longer be updated and in matching folders no files can be created anymore.

The '.part' extension is always forbidden, as this is used internally by Nextcloud.

Defaults to ``array('.filepart', '.part')``

theme
^^^^^


::

	'theme' => '',

If you are applying a theme to Nextcloud, enter the name of the theme here.

The default location for themes is ``nextcloud/themes/``.

Defaults to the theming app which is shipped since Nextcloud 9

enforce_theme
^^^^^^^^^^^^^


::

	'enforce_theme' => '',

Enforce the user theme. This will disable the user theming settings
This must be a valid ITheme ID.

E.g. dark, dark-highcontrast, default, light, light-highcontrast, opendyslexic

cipher
^^^^^^


::

	'cipher' => 'AES-256-CTR',

The default cipher for encrypting files. Currently supported are:
 - AES-256-CTR
 - AES-128-CTR
 - AES-256-CFB
 - AES-128-CFB

Defaults to ``AES-256-CTR``

encryption.use_legacy_base64_encoding
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'encryption.use_legacy_base64_encoding' => false,

Use the legacy base64 format for encrypted files instead of the more space-efficient
binary format. The option affects only newly written files, existing encrypted files
will not be touched and will remain readable whether they use the new format or not.

Defaults to ``false``

minimum.supported.desktop.version
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'minimum.supported.desktop.version' => '2.7.0',

The minimum Nextcloud desktop client version that will be allowed to sync with
this server instance. All connections made from earlier clients will be denied
by the server. Defaults to the minimum officially supported Nextcloud desktop
client version at the time of release of this server version.

When changing this, note that older unsupported versions of the Nextcloud desktop
client may not function as expected, and could lead to permanent data loss for
clients or other unexpected results.

Defaults to ``2.7.0``

maximum.supported.desktop.version
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'maximum.supported.desktop.version' => '99.99.99',

The maximum Nextcloud desktop client version that will be allowed to sync with
this server instance. All connections made from later clients will be denied
by the server.

Defaults to 99.99.99

localstorage.allowsymlinks
^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'localstorage.allowsymlinks' => false,

Option to allow local storage to contain symlinks.

WARNING: Not recommended. This would make it possible for Nextcloud to access
files outside the data directory and could be considered a security risk.

Defaults to ``false``

localstorage.umask
^^^^^^^^^^^^^^^^^^


::

	'localstorage.umask' => 0022,

Nextcloud overrides umask to ensure suitable access permissions
regardless of webserver/php-fpm configuration and worker state.

WARNING: Modifying this value has security implications and
may soft-break the installation.

Most installs shall not modify this value.

Defaults to ``0022``

localstorage.unlink_on_truncate
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'localstorage.unlink_on_truncate' => false,

This options allows storage systems that don't allow to modify existing files
to overcome this limitation by removing the files before overwriting.

Defaults to ``false``

quota_include_external_storage
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'quota_include_external_storage' => false,

EXPERIMENTAL: option whether to include external storage in quota
calculation, defaults to false.

Defaults to ``false``

external_storage.auth_availability_delay
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'external_storage.auth_availability_delay' => 1800,

When an external storage is unavailable for some reasons, it will be flagged
as such for 10 minutes. When the trigger is a failed authentication attempt
the delay is higher and can be controlled with this option. The motivation
is to make account lock outs at Active Directories (and compatible) more
unlikely.

Defaults to ``1800`` (seconds)

files_external_allow_create_new_local
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'files_external_allow_create_new_local' => true,

Allows to create external storages of type "Local" in the web interface and APIs.

When disabled, it is still possible to create local storages with occ using
the following command:

% php occ files_external:create /mountpoint local null::null -c datadir=/path/to/data

Defaults to ``true``

filesystem_check_changes
^^^^^^^^^^^^^^^^^^^^^^^^


::

	'filesystem_check_changes' => 0,

Specifies how often the local filesystem (the Nextcloud data/ directory, and
NFS mounts in data/) is checked for changes made outside Nextcloud. This
does not apply to external storage.

0 -> Never check the filesystem for outside changes, provides a performance
increase when it's certain that no changes are made directly to the
filesystem

1 -> Check each file or folder at most once per request, recommended for
general use if outside changes might happen.

Defaults to ``0``

part_file_in_storage
^^^^^^^^^^^^^^^^^^^^


::

	'part_file_in_storage' => true,

By default, Nextcloud will store the part files created during upload in the
same storage as the upload target. Setting this to false will store the part
files in the root of the users folder which might be required to work with certain
external storage setups that have limited rename capabilities.

Defaults to ``true``

mount_file
^^^^^^^^^^


::

	'mount_file' => '/var/www/nextcloud/data/mount.json',

Where ``mount.json`` file should be stored, defaults to ``data/mount.json``
in the Nextcloud directory.

Defaults to ``data/mount.json`` in the Nextcloud directory.

filesystem_cache_readonly
^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'filesystem_cache_readonly' => false,

When ``true``, prevent Nextcloud from changing the cache due to changes in
the filesystem for all storage.

Defaults to ``false``

trusted_proxies
^^^^^^^^^^^^^^^


::

	'trusted_proxies' => ['203.0.113.45', '198.51.100.128', '192.168.2.0/24'],

List of trusted proxy servers

You may set this to an array containing a combination of
- IPv4 addresses, e.g. `192.168.2.123`
- IPv4 ranges in CIDR notation, e.g. `192.168.2.0/24`
- IPv6 addresses, e.g. `fd9e:21a7:a92c:2323::1`
- IPv6 ranges in CIDR notation, e.g. `2001:db8:85a3:8d3:1319:8a20::/95`

When an incoming request's `REMOTE_ADDR` matches any of the IP addresses
specified here, it is assumed to be a proxy instead of a client. Thus, the
client IP will be read from the HTTP header specified in
`forwarded_for_headers` instead of from `REMOTE_ADDR`.

So if you configure `trusted_proxies`, also consider setting
`forwarded_for_headers` which otherwise defaults to `HTTP_X_FORWARDED_FOR`
(the `X-Forwarded-For` header).

Defaults to an empty array.

forwarded_for_headers
^^^^^^^^^^^^^^^^^^^^^


::

	'forwarded_for_headers' => ['HTTP_X_FORWARDED', 'HTTP_FORWARDED_FOR'],

Headers that should be trusted as client IP address in combination with
`trusted_proxies`. If the HTTP header looks like 'X-Forwarded-For', then use
'HTTP_X_FORWARDED_FOR' here.

If set incorrectly, a client can spoof their IP address as visible to
Nextcloud, bypassing access controls and making logs useless!

Defaults to ``'HTTP_X_FORWARDED_FOR'``

allowed_admin_ranges
^^^^^^^^^^^^^^^^^^^^


::

	'allowed_admin_ranges' => ['192.0.2.42/32', '233.252.0.0/24', '2001:db8::13:37/64'],

List of trusted IP ranges for admin actions

If this list is non-empty, all admin actions must be triggered from
IP addresses inside theses ranges.

Defaults to an empty array.

max_filesize_animated_gifs_public_sharing
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'max_filesize_animated_gifs_public_sharing' => 10,

max file size for animating gifs on public-sharing-site.

If the gif is bigger, it'll show a static preview

Value represents the maximum filesize in megabytes. Set to ``-1`` for
no limit.

Defaults to ``10`` megabytes

filelocking.ttl
^^^^^^^^^^^^^^^


::

	'filelocking.ttl' => 60*60,

Set the lock's time-to-live in seconds.

Any lock older than this will be automatically cleaned up.

Defaults to ``60*60`` seconds (1 hour) or the php
            max_execution_time, whichever is higher.

memcache.locking
^^^^^^^^^^^^^^^^


::

	'memcache.locking' => '\\OC\\Memcache\\Redis',

Memory caching backend for file locking

Because most memcache backends can clean values without warning using redis
is highly recommended to *avoid data loss*.

Defaults to ``none``

filelocking.debug
^^^^^^^^^^^^^^^^^


::

	'filelocking.debug' => false,

Enable locking debug logging

Note that this can lead to a very large volume of log items being written which can lead
to performance degradation and large log files on busy instance.

Thus enabling this in production for longer periods of time is not recommended
or should be used together with the ``log.condition`` setting.

upgrade.disable-web
^^^^^^^^^^^^^^^^^^^


::

	'upgrade.disable-web' => false,

Disable the web based updater

upgrade.cli-upgrade-link
^^^^^^^^^^^^^^^^^^^^^^^^


::

	'upgrade.cli-upgrade-link' => '',

Allows to modify the cli-upgrade link in order to link to a different documentation

documentation_url.server_logs
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'documentation_url.server_logs' => '',

Allows to modify the exception server logs documentation link in order to link to a different documentation

debug
^^^^^


::

	'debug' => false,

Set this Nextcloud instance to debugging mode

Only enable this for local development and not in production environments
This will disable the minifier and outputs some additional debug information

Defaults to ``false``

data-fingerprint
^^^^^^^^^^^^^^^^


::

	'data-fingerprint' => '',

Sets the data-fingerprint of the current data served

This is a property used by the clients to find out if a backup has been
restored on the server. Once a backup is restored run
./occ maintenance:data-fingerprint
To set this to a new value.

Updating/Deleting this value can make connected clients stall until
the user has resolved conflicts.

Defaults to ``''`` (empty string)

copied_sample_config
^^^^^^^^^^^^^^^^^^^^


::

	'copied_sample_config' => true,

This entry is just here to show a warning in case somebody copied the sample
configuration. DO NOT ADD THIS SWITCH TO YOUR CONFIGURATION!

If you, brave person, have read until here be aware that you should not
modify *ANY* settings in this file without reading the documentation.

lookup_server
^^^^^^^^^^^^^


::

	'lookup_server' => 'https://lookup.nextcloud.com',

use a custom lookup server to publish user data

gs.enabled
^^^^^^^^^^


::

	'gs.enabled' => false,

set to true if the server is used in a setup based on Nextcloud's Global Scale architecture

gs.federation
^^^^^^^^^^^^^


::

	'gs.federation' => 'internal',

by default federation is only used internally in a Global Scale setup
If you want to allow federation outside your environment set it to 'global'

csrf.optout
^^^^^^^^^^^


::

	'csrf.optout' => [
		'/^WebDAVFS/', // OS X Finder
		'/^Microsoft-WebDAV-MiniRedir/', // Windows webdav drive
	],

List of incompatible user agents opted out from Same Site Cookie Protection.

Some user agents are notorious and don't really properly follow HTTP
specifications. For those, have an opt-out.

WARNING: only use this if you know what you are doing

simpleSignUpLink.shown
^^^^^^^^^^^^^^^^^^^^^^


::

	'simpleSignUpLink.shown' => true,

By default, there is on public pages a link shown that allows users to
learn about the "simple sign up" - see https://nextcloud.com/signup/

If this is set to "false" it will not show the link.

login_form_autocomplete
^^^^^^^^^^^^^^^^^^^^^^^


::

	'login_form_autocomplete' => true,

By default, autocompletion is enabled for the login form on Nextcloud's login page.

While this is enabled, browsers are allowed to "remember" login names and such.
Some companies require it to be disabled to comply with their security policy.

Simply set this property to "false", if you want to turn this feature off.

login_form_timeout
^^^^^^^^^^^^^^^^^^


::

	'login_form_timeout' => 300,

Timeout for the login form, after this time the login form is reset.

This prevents password leaks on public devices if the user forgots to clear the form.

Default is 5 minutes (300 seconds), a value of 0 means no timeout.

no_unsupported_browser_warning
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'no_unsupported_browser_warning' => false,

If your user is using an outdated or unsupported browser, a warning will be shown
to offer some guidance to upgrade or switch and ensure a proper Nextcloud experience.

They can still bypass it after they have read the warning.

Simply set this property to "true", if you want to turn this feature off.

files_no_background_scan
^^^^^^^^^^^^^^^^^^^^^^^^


::

	'files_no_background_scan' => false,

Disable background scanning of files

By default, a background job runs every 10 minutes and execute a background
scan to sync filesystem and database. Only users with unscanned files
(size < 0 in filecache) are included. Maximum 500 users per job.

Defaults to ``false``

query_log_file
^^^^^^^^^^^^^^


::

	'query_log_file' => '',

Log all queries into a file

Warning: This heavily decreases the performance of the server and is only
meant to debug/profile the query interaction manually.
Also, it might log sensitive data into a plain text file.

redis_log_file
^^^^^^^^^^^^^^


::

	'redis_log_file' => '',

Log all redis requests into a file

Warning: This heavily decreases the performance of the server and is only
meant to debug/profile the redis interaction manually.
Also, it might log sensitive data into a plain text file.

diagnostics.logging
^^^^^^^^^^^^^^^^^^^


::

	'diagnostics.logging' => true,

Enable diagnostics event logging

If enabled the timings of common execution steps will be logged to the
Nextcloud log at debug level. log.condition is useful to enable this on
production systems to only log under some conditions

diagnostics.logging.threshold
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'diagnostics.logging.threshold' => 0,

Limit diagnostics event logging to events longer than the configured threshold in ms

when set to 0 no diagnostics events will be logged

profile.enabled
^^^^^^^^^^^^^^^


::

	'profile.enabled' => true,

Enable profile globally

Defaults to ``true``

account_manager.default_property_scope
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'account_manager.default_property_scope' => [],

Allows to override the default scopes for Account data.

The list of overridable properties and valid values for scopes are in
``OCP\Accounts\IAccountManager``. Values added here are merged with
default values, which are in ``OC\Accounts\AccountManager``.

For instance, if the phone property should default to the private scope
instead of the local one:

::

	[
	  \OCP\Accounts\IAccountManager::PROPERTY_PHONE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE
	]

projects.enabled
^^^^^^^^^^^^^^^^


::

	'projects.enabled' => false,

Enable the deprecated Projects feature,
superseded by Related resources as of Nextcloud 25

Defaults to ``false``

bulkupload.enabled
^^^^^^^^^^^^^^^^^^


::

	'bulkupload.enabled' => true,

Enable the bulk upload feature.

Defaults to ``true``

reference_opengraph
^^^^^^^^^^^^^^^^^^^


::

	'reference_opengraph' => true,

Enables fetching open graph metadata from remote urls

Defaults to ``true``

unified_search.enabled
^^^^^^^^^^^^^^^^^^^^^^


::

	'unified_search.enabled' => false,

Enable use of old unified search

Defaults to ``false``

enable_non-accessible_features
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'enable_non-accessible_features' => true,

Enable features that don't respect accessibility standards yet.

Defaults to ``true``

binary_search_paths
^^^^^^^^^^^^^^^^^^^


::

	'binary_search_paths' => [
		'/usr/local/sbin',
		'/usr/local/bin',
		'/usr/sbin',
		'/usr/bin',
		'/sbin',
		'/bin',
		'/opt/bin',
	],

Directories where nextcloud looks for binaries.

This is used to find external binaries like libreoffice, sendmail, ffmpeg and more.

Defaults to ``['/usr/local/sbin','/usr/local/bin','/usr/sbin','/usr/bin','/sbin','/bin','/opt/bin']``

files.chunked_upload.max_size
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'files.chunked_upload.max_size' => 100 * 1024 * 1024,

The maximum chunk size to use for chunked uploads.

A bigger chunk size results in higher throughput, but above 100 MiB there are only diminishing returns,
while services like Cloudflare already limit to 100 MiB.

Defaults to 100 MiB.

files.chunked_upload.max_parallel_count
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


::

	'files.chunked_upload.max_parallel_count' => 5,

The maximum number of chunks uploaded in parallel during chunked uploads.

A bigger count results in higher throughput, but will also consume more server workers,
while the improvements diminish.

Defaults to 5.

files.trash.delete
^^^^^^^^^^^^^^^^^^


::

	'files.trash.delete' => true,

Allow users to manually delete files from their trashbin.

Automated deletions are not affected and will continue to work in cases like low remaining quota for example.

Defaults to true.

.. ALL_OTHER_SECTIONS_END
.. Generated content above. Don't change this.

App config options
------------------

.. _label-activity-app-config:

Activity app
^^^^^^^^^^^^

Retention for activities of the activity app:


::

	'activity_expire_days' => 365,

Every day a cron job is ran, which deletes all activities for all users
which are older then the number of days that is set for ``activity_expire_days``

::

	'activity_use_cached_mountpoints' => false,

Before enabling this, read the warning in :ref:`label-activities-groupfolders`

Settings app
^^^^^^^^^^^^

If an email address of a user is changed by an admin, then it triggers an email
to the user that states "Your email address on URL was changed by an
administrator.". In some cases this should not be triggered, because it was a
normal maintenance change. To disable this specific email the appconfig option
``disable_email.email_address_changed_by_admin`` can be set to ``yes``::

	occ config:app:set settings disable_activity.email_address_changed_by_admin --value yes

To disable this behaviour change it to any other value or delete the app config::

	occ config:app:delete settings disable_activity.email_address_changed_by_admin
