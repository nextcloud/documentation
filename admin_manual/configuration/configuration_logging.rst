Logging Configuration
=====================
To get an idea of how the current status of an ownCloud system is or to
solve issues log information is a good point to start with. ownCloud allows
to configure the way how and which depth of information should be logged.

Parameters
----------
First you need to decide in which way logging should be done. You can
choose between the two options **owncloud** and **syslog**. Then you need
to configure the log level which directly influences how much information
will be logged. You can choose between:

* **0**: DEBUG
* **1**: INFO
* **2**: WARN
* **3**: ERROR

The most detailed information will be written if **0** (DEBUG) is set, the
least information will be written if **3** (ERROR) is set. Keep in mind that
it might slow down the whole system if a too detailed logging will has been
configured. By default the log level is set to **2** (WARN).

This parameters can be set in the :file:`config/config.php`

ownCloud
~~~~~~~~
All log information will be written to a separate log file which can be
viewed using the log menu in the admin menu of ownCloud. By default a log
file named **owncloud.log** will be created in the directory which has
been configured by the **datadirectory** parameter.

.. code-block:: php

  <?php

    "log_type" => "owncloud",
    "logfile" => "owncloud.log",
    "loglevel" => "3",

syslog
~~~~~~
All log information will be send to the default syslog deamon of a system.

.. code-block:: php

  <?php

    "log_type" => "syslog",
    "logfile" => "",
    "loglevel" => "3",

