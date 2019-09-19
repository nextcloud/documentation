=======
Logging
=======

Use your Nextcloud log to review system status, or to help debug problems. You may adjust logging levels, and choose between using the Nextcloud log or your syslog. If additional audit information is required, you can optionally activate the **admin_audit** app, which by default generates a separate audit.log file in the data directory.

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
    "loglevel" => "3",
    "logdateformat" => "F d, Y H:i:s",

syslog
~~~~~~

All log information will be sent to your default syslog daemon.

::

    "log_type" => "syslog",
    "logfile" => "",
    "loglevel" => "3",

Admin audit log
---------------

If required, the name and path of the audit log file can be customized by using the following command:

::

    occ config:app:set admin_audit logfile --value=/var/log/nextcloud/audit.log


.. _PHP date function: http://www.php.net/manual/en/function.date.php

Find detailed documentation on auditable events for enterprises in our `customer portal <https://portal.nextcloud.com/article/using-the-audit-log-44.html>`_.
