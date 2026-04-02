=======
Logging
=======

Use your Nextcloud log to review system status, or to help debug problems. You may adjust logging levels, and choose how and where log data is stored. If additional event logging is required, you can optionally activate the **admin_audit** app. 

When ``file`` based logging is utilized, both the Nextcloud log and, optionally, the **admit_audit** app log can be viewed within the Nextcloud interface under *Administration settings -> Logging* (this functionality is provided by the **logreader** app).

Further configuration and usage details for both the standard Nextcloud log and the optional **admin_audit** app log can be found below. 

Log level
---------

Logging levels range from **DEBUG**, which logs all activity, to **FATAL**, which logs only fatal errors.

* **0**: DEBUG: All activity; the most detailed logging.
* **1**: INFO:  Activity such as user logins and file activities, plus warnings, errors, and fatal errors.
* **2**: WARN:  Operations succeed, but with warnings of potential problems, plus errors and fatal errors.
* **3**: ERROR: An operation fails, but other services and operations continue, plus fatal errors.
* **4**: FATAL: The server stops.

By default the log level is set to **2** (WARN). Use **DEBUG** when you have a problem to diagnose, and then reset your log level to a less-verbose level as **DEBUG** outputs a lot of information, and can affect your server performance.

Logging level parameters are set in the :file:`config/config.php` file.

Log type
--------

errorlog
~~~~~~~~

All log information will be sent to PHP ``error_log()``.

::

    "log_type" => "errorlog",

.. warning:: Until version Nextcloud 25 log entries were prefixed with ``[owncloud]``. From 26 onwards messages start with ``[nextcloud]``.

file
~~~~

All log information will be written to a separate log file which can be
viewed using the log viewer on your Admin page. By default, a log
file named **nextcloud.log** will be created in the directory which has
been configured by the **datadirectory** parameter in :file:`config/config.php`.

The desired date format can optionally be defined using the **logdateformat** parameter in :file:`config/config.php`.
By default the `PHP date function`_ parameter ``c`` is used, and therefore the
date/time is written in the format ``2013-01-10T15:20:25+02:00``. By using the
date format in the example below, the date/time format will be written in the format
``January 10, 2013 15:20:25``.

::

    "log_type" => "file",
    "logfile" => "nextcloud.log",
    "loglevel" => 3,
    "logdateformat" => "F d, Y H:i:s",

syslog
~~~~~~

All log information will be sent to your default syslog daemon.

::

    "log_type" => "syslog",
    "syslog_tag" => "Nextcloud",
    "logfile" => "",
    "loglevel" => 3,

systemd
~~~~~~~

All log information will be sent to Systemd journal. Requires `php-systemd <https://github.com/systemd/php-systemd>`_ extension.

::

    "log_type" => "systemd",
    "syslog_tag" => "Nextcloud",

Log fields explained
--------------------

Example log entries
~~~~~~~~~~~~~~~~~~~

::

    {
        "reqId":"TBsuA2uE86DiOD0S8f9j",
        "level":1,
        "time":"April 13, 2021 16:55:37",
        "remoteAddr":"192.168.56.1",
        "user":"admin",
        "app":"admin_audit",
        "method":"GET",
        "url":"/ocs/v1.php/cloud/users?disabled",
        "message":"Login successful: \"admin\"",
        "userAgent":"curl/7.68.0",
        "version":"21.0.1.1"
    }

    {
        "reqId":"ByeDVLuwkXKMfLpBgvxC",
        "level":2,
        "time":"April 14, 2021 09:03:29",
        "remoteAddr":"192.168.56.1",
        "user":"--",
        "app":"no app in context",
        "method":"POST",
        "url":"/login",
        "message":"Login failed: asdf (Remote IP: 192.168.56.1)",
        "userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
        "version":"21.0.1.1"
    }

Log field breakdown
~~~~~~~~~~~~~~~~~~~

* **reqId** (request id): any log lines related to a single request have the same value
* **level**: logged incident's level, always 1 in audit.log
* **time**: date and time (format and timezone can be configured in config.php)
* **remoteAddr**: the IP address of the user (if applicable  – empty for occ commands)
* **user**: acting user's id (if applicable)
* **app**: affected app (always admin_audit in audit.log)
* **method**: HTTP method, for example GET, POST, PROPFIND, etc.  – empty on occ calls
* **url**: request path (if applicable – empty on occ calls)
* **message**: event information message
* **userAgent**: user agent (if applicable – empty on occ calls)
* **exception**: Full exception with trace (if applicable)
* **data** additional structured data (if applicable)
* **version**: Nextcloud version at the time of request

Empty value are written as two dashes: ``--``.

Admin audit log (Optional)
--------------------------

By enabling the **admin_audit** app, additional information about various events can be logged. Similar to the normal logging, the audit log can be provided to any of the existing logging mechanisms in :file:`config/config.php`. The default behavior, if no parameters are specified after the app is enabled, is ``file`` based logging to a file called ``audit.log`` stored in the ``datadirectory``.

If you wish to override this and log to syslog instead the following would be one approach:

::

	"log_type_audit" => "syslog",
	"syslog_tag_audit" => "Nextcloud",
	"logfile_audit" => "",

Log level interaction
~~~~~~~~~~~~~~~~~~~~~

If system ``loglevel`` in ``config.php`` is set to ``2`` or higher, audit logging needs to be triggered explicitly by adding the following setting to ``config.php``:

::

	"log.condition" => [
		"apps" => ["admin_audit"],
	],

Find detailed documentation on auditable events for enterprises in our `customer portal <https://portal.nextcloud.com/article/using-the-audit-log-44.html>`_.

Integrating into the Web Interface
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The built-in NC ``logreader`` app (which is what provides the *Administration settings->Logging* interface) only accesses the file-based ``nextcloud.log``. The **admin_audit** app log output, however, can be integrated into the web interface by configuring it to *also* log to the ``nextcloud.log``.

Add the following to your ``config.php`` (adjusting the path to your own ``nextcloud.log`` path):

::

	'log.condition' => [
		'apps' => [ 'admin_audit'],
	],
	'logfile_audit' => '/var/www/html/data/nextcloud.log',

Configuring through admin_audit app settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Previously the audit logfile was defined in the app config. This config is still used when the system config is not provided, but is considered a legacy parameter.

::

	occ config:app:set admin_audit logfile --value=/var/log/nextcloud/audit.log

.. _PHP date function: http://www.php.net/manual/en/function.date.php

Workflow log
------------

By default, the workflow log is stored to `flow.log` in the data folder.

The path of the workflow log can be set as follows:

::

	occ config:app:set workflowengine logfile --value=/var/log/nextcloud/flow.log

Set the value to `/dev/null` to avoid storing the log.


Temporary overrides
-------------------

You can run override the config.php log level of ``occ`` commands with as :ref:`documented here<occ_debugging>`.
