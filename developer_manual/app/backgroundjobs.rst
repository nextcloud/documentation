======================
Background jobs (Cron)
======================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Often there is a need to run background jobs. For example there are Background
jobs in Nextcloud that send out the activity emails. Or expire the trashbin.

Types of background jobs
------------------------
Nextcloud by default offers you two types of background jobs. The ``\OCP\BackgroundJob\QueuedJob``
and ```\OCP\BackgroundJob\TimedJob``.

The ``QueuedJob`` is for one time jobs. This can for example be triggered by inserting
a job because an event happened. The ``TimedJob`` has a method ``setInterval`` where
you can set the time minimum time in seconds between the jobs (from the constructor).
This is useful in case you want to have a job that is run at most once a day for example.

Of course you can customize this all to your liking by just extending ``\OCP\BackgroundJob\Job``

Writing a background job
------------------------

Writing a background job is rather straight forward. You write a class and extend
your job class of choice.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Cron;

    use \OCA\MyApp\Service\SomeService;
    use \OCP\BackgroundJob\TimedJob;

    class SomeTask extends TimedJob {

        private $myService;

        public function __construct(ITimeFactory $time, SomeService $service) {
            parent::__construct($time);
            $this->myService = $service;

            // Run once an hour
            parent::setInterval(3600);
        }

        public static function run($arguments) {
            $this->myService->doCron($arguments['uid']);
        }

    }

As you can see our dependency injection also works just fine for background jobs.
The ITimeFactory always needs to be passed to the parent constructor. Since it is
required to be set.

In this case it is a background job that runs every hour. And we take the ``uid`` arguemnt
to pass on to the service to run the background job.

The ``run`` function is the main thing you need to implement and where all the
logic happens.

Registering a background job
----------------------------

Now that you have written your background job there is of course the small matter of
how to make sure the system actually runs your job. In order to do this your
job needs to be registered.

info.xml
^^^^^^^^

You can register your jobs in your info.xml by addning;

.. code-block:: xml

    <background-jobs>
		  <job>OCA\MyApp\Cron\SomeTask</job>
    </background-jobs>

This will on install/update of the application add the job ``OCA\MyApp\Cron\SomeTask``.
Of course in this case the arguments passed to your ``run`` function is just an empty
array.

Registering manually
^^^^^^^^^^^^^^^^^^^^

In case you want more fine grained control about when a background job is inserted
and you want to pass arguments to it you need to manually register your background jobs.

You do this by using ``\OCP\BackgroundJob\IJobList``. There you can add a job or remove a job.

For example you could add or remove a certain job based on some controller:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use \OCA\MyApp\Cron\SomeTask;
    use \OCP\AppFramework\Controller;
    use \OCP\BackgroundJob\IJobList;

    class SomeController extends Controller {

        private $jobList

        public function __construct(string $appName, IRequest $request, IJobList $jobList) {
            parent::__construct($appName, $request);

            $this->jobList = $jobList;
        }

        public function addJob(string $uid) {
            $this->jobList->add(SomeTask::class, ['uid' => $uid]);
        }

        public function removeJob(string $uid) {
            $this->jobList->remove(SomeTask::class, ['uid' => $uid]);
        }
    }

This provides more fine grained control and you can pass arguments to your background
jobs easily.
