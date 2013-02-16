Background Jobs
===============
A system like ownCloud sometimes requires tasks to be done on a regular
base without blocking the user interface. For that purpose you, as a system
administrator, can define background jobs which make it possible to execute
tasks without any need of user interaction, e.g. database clean-ups etc.
Additionally background jobs can automatically be defines by installed apps
if necessary.

Parameters
----------
In the admin settings menu you can configure how cron-jobs should be executed. 
You can choose between the followiung options:

-   `AJAX`_: Executes a task every time a page is loaded.

-   `Webcron`_: The cron.php script has been registered at an external webcron
                service, like `easyCron`_ and will be called on a regular base.

-   `Cron`_: The cron.php script will be called on a regular base by a system
             cron-job.

Cron-Jobs
---------

.. _AJAX
~~~~

This option is the default option, although it is the least reliable. Every
time a user visits the ownCloud page a single background job gets executed.
The disadvantage of this solution compared to the Webcron service is, that
it requires regular visits of the page. The reason for making this option
the default is that this solution simply does not require access to the
system or registration on some third party service.

.. _Webcron
~~~~~~~

By registering your ownCloud cron.php address at an external webcron service
you ensure that background jobs will be executed regularly. To use such a
service your server need to be reachable via the Internet.

Example
^^^^^^^

::
URL to call: http://<domain-of-your-server>/owncloud/cron.php

.. _Cron
~~~~

Using the systems cron feature is the preferred way to run regular tasks,
because it allows to executed jobs without the limitations a web server
may have.

Example
^^^^^^^
To run a cron job on a *nix system every 15min you need to set-up the
following cron job. Please check the crontab man page for the exact 
command syntax.

::
# crontab -e
*/15  *  *  *  * php -f /var/www/htdocs/owncloud/cron.php

App Integration
---------------

When you want to implement background jobs i your app, please be aware of
the difference between the AJAX/Webcron and the cron implementation! The
AJAX/Webcron implementation gets started by your-favorite-web-server, so
you might have some limitations on execution time or memory. 
These limitations do not affect the system cron implementation, which calls
the cron.php script from the command line. As a consequence, you should split
large tasks when not using system cron. You can check whether the app has been
started by systems cron by checking if ``OC::$CLI`` is set to true.
If you want to  use background jobs in your app, you have to register them in
appinfo/app.php by calling ``OCP\BackgroundJobs::addRegularTask( $class,  $method )``.

Please keep also in mind that it is not possible to pass a frequency to the job.
The reason for this are, because you do not know when a (web-) cronjob will be
executed and you do not know when the next job will be executed when AJAX is used.

Another feature of background jobs has are queued tasks. You can add a new
task by using ``OCP\BackgroundJobs::addQueuedJob( $app, $class, $method, $parameters )``.
*$app* is the app name, *$class* and *$method* are used to call the function,
*$parameters* is some text you might pass to your task. The main problem with
this solution is that you don't know when it will be executed. It's not
necessarily happening immediately as you mightknow it from delayed jobs in
rails where a daemon runs in background all the time. In the worst case
(using AJAX, all users offline) it could be executed weeks later.

.. _easyCron: http://www.easycron.com/  
