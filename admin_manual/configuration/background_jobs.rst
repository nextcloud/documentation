Background Jobs
===============
A system like ownCloud sometimes requires tasks to be done on a regular
base without blocking the user interface. For that purpose you, as a system
administrator, can define background jobs which make it possible to execute
tasks without any need of user interaction, e.g. database clean-ups etc.
For the sake of completeness it is worse to know that additionally background
jobs can also be defined by installed apps.

Parameters
----------
In the admin settings menu you can configure how cron-jobs should be executed. 
You can choose between the following options:

-   AJAX
-   Webcron
-   Cron

Cron-Jobs
---------

AJAX
~~~~

This option is the default option, although it is the least reliable. Every
time a user visits the ownCloud page a single background job will be executed.
The advantage of this mechanism is, that is does not require access to the
system nor registration at a third party service.
The disadvantage of this solution compared to the Webcron service is, that it
requires regular visits of the page to get triggered.

Webcron
~~~~~~~

By registering your ownCloud ``cron.php`` script address at an external webcron
service, like e.g. easyCron_, you ensure that background jobs will be executed
regularly. To use such a service your server need to be reachable via the Internet.

**Example**

::

  URL to call: http[s]://<domain-of-your-server>/owncloud/cron.php

Cron
~~~~

Using the systems cron feature is the preferred way to run regular tasks,
because it allows to execute jobs without the limitations which a web server
may have.

**Example**

To run a cron job on a *nix system, e.g. every 15min, under the default webserver
user, e.g. **www-data**, you need to set-up the following cron job to call the
**cron.php** script. Please check the crontab man page for the exact command syntax.

::

  # crontab -u www-data -e
  */15  *  *  *  * php -f /var/www/htdocs/owncloud/cron.php

.. _easyCron: http://www.easycron.com/  
