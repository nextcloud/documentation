===============
Background jobs
===============
A system like Nextcloud sometimes requires tasks to be done on a regular basis
without the need for user interaction or hindering Nextcloud performance. For
that purpose, as a system administrator, you can define background jobs (for
example, database clean-ups) which are executed without any need for user
interaction.

These jobs are typically referred to as *cron jobs*.  Cron jobs are commands or
shell-based scripts that are scheduled to run periodically at fixed times,
dates, or intervals.   ``cron.php`` is a Nextcloud internal process that runs
such background jobs on demand.

Nextcloud apps register actions with ``cron.php`` automatically
to take care of typical housekeeping operations, such as garbage collecting of
temporary files or checking for newly updated files using ``filescan()`` for
externally mounted file systems.

Parameters
----------
In the admin settings menu you can configure how cron-jobs should be executed.
You can choose between the following options:

-   AJAX
-   Webcron
-   Cron

Cron jobs
---------

You can schedule cron jobs in three ways -- using AJAX, Webcron, or cron. The
default method is to use AJAX.  However, the recommended method is to use cron.
The following sections describe the differences between each method.

AJAX
^^^^

The AJAX scheduling method is the default option.  Unfortunately, however, it is
also the least reliable. Each time a user visits the Nextcloud page, a single
background job is executed. The advantage of this mechanism is that it does not
require access to the system nor registration with a third party service. The
disadvantage of this mechanism, when compared to the Webcron service, is that it
requires regular visits to the page for it to be triggered.

.. note:: Especially when using the Activity App or external storages, where new
   files are added, updated or deleted one of the two methods below should be
   preferred.

Webcron
^^^^^^^

By registering your Nextcloud ``cron.php`` script address at an external webcron
service (for example, easyCron_), you ensure that background jobs are executed
regularly. To use this type of service with your server, you must be able to
access your server using the Internet. For example::

  URL to call: http[s]://<domain-of-your-server>/nextcloud/cron.php

Cron
^^^^

Using the operating system cron feature is the preferred method for executing
regular tasks.  This method enables the execution of scheduled jobs without the
inherent limitations the Web server might have.

To run a cron job on a \*nix system, every 5 minutes, under the default Web
server user (often, ``www-data`` or ``wwwrun``), you must set up the following
cron job to call the **cron.php** script::

  # crontab -u www-data -e
  */5  *  *  *  * php -f /var/www/nextcloud/cron.php

You can verify if the cron job has been added and scheduled by executing::

  # crontab -u www-data -l
  */5  *  *  *  * php -f /var/www/nextcloud/cron.php

.. note:: You have to replace the path ``/var/www/nextcloud/cron.php`` with the
          path to your current Nextcloud installation.

.. note:: On some systems it might be required to call **php-cli** instead of **php**.

.. note:: Please refer to the crontab man page for the exact command syntax.

.. _easyCron: https://www.easycron.com/

systemd
^^^^^^^

If systemd is installed on the system, a systemd timer could be an alternative to a cronjob.

This approach requires two files: **nextcloudcron.service** and **nextcloudcron.timer**. Create these two files in ``/etc/systemd/system/``.

**nextcloudcron.service** should look like this::

  [Unit]
  Description=Nextcloud cron.php job
  
  [Service]
  User=www-data
  ExecStart=/usr/bin/php -f /var/www/nextcloud/cron.php            
  
  [Install]
  WantedBy=basic.target

Replace the user ``www-data`` with the user of your http server and ``/var/www/nextcloud/cron.php`` with the location of **cron.php** in your nextcloud directory.

**nextcloudcron.timer** should look like this::

  [Unit]
  Description=Run Nextcloud cron.php every 5 minutes
  
  [Timer]
  OnBootSec=5min
  OnUnitActiveSec=5min
  Unit=nextcloudcron.service
  
  [Install]
  WantedBy=timers.target

The important parts in the timer-unit are ``OnBootSec`` and ``OnUnitActiveSec``. ``OnBootSec`` will start the timer 5 minutes after boot, otherwise you would have to start it manually after every boot. ``OnUnitActiveSec`` will set a 5 minute timer after the service-unit was last activated.

Now all that is left is to start and enable the timer by running this command::

  systemctl enable --now nextcloudcron.timer

When the option ``--now`` is used with ``enable``, the resp. unit will also be started.

.. note:: Selecting the option ``Cron`` in the admin menu for background jobs is not mandatory, because once `cron.php` is executed from the command line or cron service it will set it automatically to ``Cron``.
