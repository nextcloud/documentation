=======
Logging
=======

Use your Nextcloud log to review system status, or to help debug problems. You may adjust logging levels, and choose how and where log data is stored. If additional event logging is required, you can optionally activate the **admin_audit** app. 

When ``file`` based logging is utilized, both the Nextcloud log and, optionally, the **admin_audit** app log can be viewed within the Nextcloud interface under *Administration settings -> Logging* (this functionality is provided by the **logreader** app).

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

Additional file-based logging parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following optional parameters can also be set in :file:`config/config.php`:

**logfilemode**
    Sets the file permissions (in octal notation) for the log file.

    Defaults to ``0640``.

    ::

        "logfilemode" => 0640,

**logtimezone**
    Sets the timezone used for log timestamps. See the `PHP list of supported timezones <https://www.php.net/manual/en/timezones.php>`_.

    Defaults to ``UTC``.

    ::

        "logtimezone" => "Europe/Berlin",

**log_rotate_size**
    Enables log rotation and limits the total size of log files. The value is
    specified in bytes. When the current log file reaches this size a new log
    file is created. If a rotated log file already exists it will be
    overwritten. Set to ``0`` to disable rotation.

    Defaults to ``104857600`` (100 MB).

    ::

        "log_rotate_size" => 100 * 1024 * 1024,

**log.backtrace**
    When enabled, a backtrace is appended to every log line, not only to
    exceptions. This significantly increases log size and should only be used
    for debugging.

    Defaults to ``false``.

    ::

        "log.backtrace" => true,

**log_query**
    Appends all database queries and their parameters to the log file. Use
    this only for debugging as it produces very large log files.

    Defaults to ``false``.

    ::

        "log_query" => true,

**loglevel_frontend**
    Sets a separate log level for messages originating from the Nextcloud
    frontend (browser). Accepts the same values as ``loglevel`` (0–4).

    Defaults to ``2`` (WARN).

    ::

        "loglevel_frontend" => 2,

**loglevel_dirty_database_queries**
    Sets the log level at which dirty database queries (queries executed
    after the response has already been sent) are logged.

    Defaults to ``0`` (DEBUG).

    ::

        "loglevel_dirty_database_queries" => 0,
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

Conditional logging (log.condition)
-----------------------------------

Nextcloud supports conditional overrides that temporarily increase the log
level to **DEBUG** when certain criteria are met. This is useful for
diagnosing problems in production without flooding the entire log with debug
output.

The ``log.condition`` parameter is set in :file:`config/config.php`.

Basic conditions
~~~~~~~~~~~~~~~~

At the top level you can specify one or more of the following keys. When
*any* of them match, the log level for that request is set to **DEBUG**:

**shared_secret**
    Match requests that pass the query parameter ``log_secret`` with this
    value.

**users**
    An array of user IDs. If the currently authenticated user is in the
    list, the condition is satisfied.

**apps**
    An array of app identifiers. Any log message whose app context matches
    one of these apps will be logged at DEBUG level.

Example – enable debug logging for user ``jane`` and the ``files`` app:

::

    'log.condition' => [
        'users' => ['jane'],
        'apps' => ['files'],
    ],

Advanced compound conditions (matches)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``matches`` key accepts an array of condition groups. Each group can
combine all of the keys above plus:

**message**
    A substring that must appear in the log message.

**loglevel**
    The log level to apply when this group matches (instead of the default
    DEBUG / ``0``).

All keys within a single group must match for the group to apply (logical
AND). Multiple groups are evaluated independently (logical OR).

Example – log all messages from the ``files`` app at INFO level, and log any
message containing ``"Lock"`` for user ``admin`` at DEBUG level:

::

    'log.condition' => [
        'matches' => [
            [
                'apps' => ['files'],
                'loglevel' => 1,
            ],
            [
                'users' => ['admin'],
                'message' => 'Lock',
                'loglevel' => 0,
            ],
        ],
    ],

Using a shared secret for on-demand debugging
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can trigger debug logging for a single request by adding a
``log_secret`` query parameter. Set a secret in :file:`config/config.php`:

::

    'log.condition' => [
        'shared_secret' => '57b58edb6637fe3059b3595cf9c41b9',
    ],

Then call your Nextcloud URL with the secret appended:

::

    https://cloud.example.com/index.php?log_secret=57b58edb6637fe3059b3595cf9c41b9

.. warning::

    Keep the shared secret private. Anyone who knows it can enable debug-level
    logging on your instance.

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
* **remoteAddr**: the IP address of the user (if applicable – empty for occ commands)
* **user**: acting user's id (if applicable)
* **app**: affected app (always admin_audit in audit.log)
* **method**: HTTP method, for example GET, POST, PROPFIND, etc. – empty on occ calls
* **url**: request path (if applicable – empty on occ calls)
* **scriptName**: the PHP script name that handled the request
* **message**: event information message
* **userAgent**: user agent (if applicable – empty on occ calls)
* **exception**: full exception with trace (if applicable)
* **data**: additional structured data (if applicable)
* **version**: Nextcloud version at the time of request
* **clientReqId**: value of the ``X-Request-Id`` HTTP header sent by the client (only present when the header is set)
* **occ_command**: the occ command that was executed, as an array of up to two arguments (only present in CLI mode)
* **backtrace**: full PHP backtrace (only present when ``log.backtrace`` is enabled in config.php)

Empty values are written as two dashes: ``--``.

Admin audit log (Optional)
--------------------------

.. _config-admin-audit:

By enabling the **admin_audit** app, additional information about various
events can be logged. The audit log supports all of the logging backends
described above (file, syslog, systemd, errorlog).

.. note::
	Detailed documentation on auditable events for enterprises can be found in the Nextcloud GmbH
	`customer portal <https://portal.nextcloud.com/article/using-the-audit-log-44.html>`_.

Default audit log location
~~~~~~~~~~~~~~~~~~~~~~~~~~

When using the default ``file`` backend, the audit log is written to
**audit.log** inside the directory configured by ``datadirectory`` in
:file:`config/config.php` (e.g. ``/var/www/html/data/audit.log``).

You can override the path with the ``logfile_audit`` system config key:

::

    'logfile_audit' => '/var/log/nextcloud/audit.log',

Dedicated audit logging configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The audit log backend can be configured independently from the main
Nextcloud log using three dedicated keys in :file:`config/config.php`:

**log_type_audit**
    The logging backend for audit events. Accepts the same values as
    ``log_type``: ``file``, ``syslog``, ``systemd``, or ``errorlog``.

    Defaults to ``file``.

**logfile_audit**
    Path to the audit log file (only used when ``log_type_audit`` is
    ``file``). When empty, the default ``audit.log`` in the data directory
    is used.

**syslog_tag_audit**
    The syslog identifier for audit messages (only used when
    ``log_type_audit`` is ``syslog`` or ``systemd``). Defaults to the value
    of ``syslog_tag``.

Example – send audit events to syslog instead of a file:

::

    'log_type_audit' => 'syslog',
    'syslog_tag_audit' => 'Nextcloud',
    'logfile_audit' => '',

Log level interaction
~~~~~~~~~~~~~~~~~~~~~

The **admin_audit** app writes its messages at **INFO** level (``1``).
Because the default system ``loglevel`` is **WARN** (``2``), audit messages
are suppressed unless you explicitly lower the system log level or add a
conditional override.

The recommended approach is to add a ``log.condition`` entry that forces
DEBUG-level logging for the ``admin_audit`` app context, without affecting
other apps:

::

    'log.condition' => [
        'apps' => ['admin_audit'],
    ],

This ensures audit events are always written regardless of the global
``loglevel`` setting.

Integrating into the web interface
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The built-in **logreader** app (which provides *Administration settings →
Logging*) only reads the file-based ``nextcloud.log``. By default the
audit log is written to a separate ``audit.log`` file, so audit entries
will not appear in the web interface.

If you want audit events to appear in the logreader, point
``logfile_audit`` at the same file as ``nextcloud.log``:

::

    'log.condition' => [
        'apps' => ['admin_audit'],
    ],
    'logfile_audit' => '/var/www/html/data/nextcloud.log',

.. note::

    Adjust the path above to match your actual ``datadirectory`` location.
    This merges audit entries into the main log file; the separate
    ``audit.log`` will no longer be written.

Configuring through admin_audit app settings (legacy)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Previously the audit log file was defined via app config. This setting is
still read as a fallback when ``logfile_audit`` is not set in
:file:`config/config.php`, but it is considered a **legacy** parameter.
The system config key should be preferred for new installations.

::

    occ config:app:set admin_audit logfile --value=/var/log/nextcloud/audit.log

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
