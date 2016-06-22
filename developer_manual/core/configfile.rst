App config
==========

.. code-block:: php

  <?php

  $CONFIG = array(
  /* Flag to indicate Nextcloud is successfully installed (true = installed) */
  "installed" => false,

  /* Type of database, can be sqlite, mysql or pgsql */
  "dbtype" => "sqlite",

  /* Name of the Nextcloud database */
  "dbname" => "owncloud",

  /* User to access the Nextcloud database */
  "dbuser" => "",

  /* Password to access the Nextcloud database */
  "dbpassword" => "",

  /* Host running the Nextcloud database */
  "dbhost" => "",

  /* Prefix for the Nextcloud tables in the database */
  "dbtableprefix" => "",

  /* Define the salt used to hash the user passwords. All your user passwords are lost if you lose this string. */
  "passwordsalt" => "",

  /* Force use of HTTPS connection (true = use HTTPS) */
  "forcessl" => false,

  /* Theme to use for Nextcloud */
  "theme" => "",

  /* Path to the 3rdparty directory */
  "3rdpartyroot" => "",

  /* URL to the 3rdparty directory, as seen by the browser */
  "3rdpartyurl" => "",

  /* Default app to load on login */
  "defaultapp" => "files",

  /* Enable the help menu item in the settings */
  "knowledgebaseenabled" => true,

  /* Enable installing apps from the appstore */
  "appstoreenabled" => true,

  /* URL of the appstore to use, server should understand OCS */
  "appstoreurl" => "https://api.owncloud.com/v1",

  /* Mode to use for sending mail, can be sendmail, smtp, qmail or php, see PHPMailer docs */
  "mail_smtpmode" => "sendmail",

  /* Host to use for sending mail, depends on mail_smtpmode if this is used */
  "mail_smtphost" => "127.0.0.1",

  /* authentication needed to send mail, depends on mail_smtpmode if this is used
   * (false = disable authentication)
   */
  "mail_smtpauth" => false,

  /* Username to use for sendmail mail, depends on mail_smtpauth if this is used */
  "mail_smtpname" => "",

  /* Password to use for sendmail mail, depends on mail_smtpauth if this is used */
  "mail_smtppassword" => "",

  /* Check 3rdparty apps for malicious code fragments */
  "appcodechecker" => "",

  /* Check if Nextcloud is up to date */
  "updatechecker" => true,

  /* Place to log to, can be owncloud and syslog (owncloud is log menu item in admin menu) */
  "log_type" => "owncloud",

  /* File for the owncloud logger to log to, (default is ownloud.log in the data dir */
  "logfile" => "",

  /* Loglevel to start logging at. 0=DEBUG, 1=INFO, 2=WARN, 3=ERROR (default is WARN) */
  "loglevel" => "",

  /* Lifetime of the remember login cookie, default is 15 days */
  "remember_login_cookie_lifetime" => 60*60*24*15,

  /* The directory where the user data is stored, default to data in the owncloud
   * directory. The sqlite database is also stored here, when sqlite is used.
   */
  // "datadirectory" => "",

  "apps_paths" => array(

  /* Set an array of path for your apps directories
   key 'path' is for the fs path and the key 'url' is for the http path to your
   applications paths. 'writable' indicate if the user can install apps in this folder.
   You must have at least 1 app folder writable or you must set the parameter : appstoreenabled to false
  */
          array(
                  'path'=> '/var/www/owncloud/apps',
                  'url' => '/apps',
                  'writable' => true,
    ),
   ),
  );


Using alternative app directories
---------------------------------

Nextcloud can be set to use a custom app directory in /config/config.php. Customise the following code and add it to your config file:

.. code-block:: php

  'apps_paths' =>
	array (
		0 =>
		array (
			'path' => OC::$SERVERROOT.'/apps',
			'url' => '/apps',
			'writable' => true,
		),
		1 =>
		array (
			'path' => OC::$SERVERROOT.'/apps2',
			'url' => '/apps2',
			'writable' => false,
		),
	),

Nextcloud will use the first app directory which it finds in the array with 'writable' set to true.
