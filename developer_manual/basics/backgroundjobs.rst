.. _app-backgroundjobs:

======================
Background jobs (Cron)
======================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Often there is a need to run background jobs. For example there are Background
jobs in Nextcloud that send out the activity emails. Or expire the trashbin.

Types of background jobs
------------------------
Nextcloud by default offers you two types of background jobs. The ``\OCP\BackgroundJob\QueuedJob``
and ``\OCP\BackgroundJob\TimedJob``.

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

    use OCA\MyApp\Service\SomeService;
    use OCP\BackgroundJob\TimedJob;
    use OCP\AppFramework\Utility\ITimeFactory;

    class SomeTask extends TimedJob {

        private SomeService $myService;

        public function __construct(ITimeFactory $time, SomeService $service) {
            parent::__construct($time);
            $this->myService = $service;

            // Run once an hour
            $this->setInterval(3600);
        }

        protected function run($arguments) {
            $this->myService->doCron($arguments['uid']);
        }

    }

As you can see our dependency injection also works just fine for background jobs.
The ITimeFactory always needs to be passed to the parent constructor. Since it is
required to be set.

In this case it is a background job that runs every hour. And we take the ``uid`` argument
to pass on to the service to run the background job.

The ``run`` function is the main thing you need to implement and where all the
logic happens.

.. _app-backgroundjobs-time-sensitivity:

Heavy load and time insensitive
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When the background job is a ``\OCP\BackgroundJob\TimedJob`` and can impact the performance of
the instance and is not time sensitive, e.g. clearing old data, running training of AI models
or similar things, consider flagging it as time insensitive in the constructor.

.. code-block:: php

    <?php

    // Run once a day
    $this->setInterval(24 * 3600);
    // Delay until low-load time
    $this->setTimeSensitivity(\OCP\BackgroundJob\IJob::TIME_INSENSITIVE);

This allows the Nextcloud to delay the job until a given nightly time window so the users
are not that impacted by the heavy load of the background job.

Configuring parallelism
^^^^^^^^^^^^^^^^^^^^^^^

.. versionadded:: 27

With resource-heavy background jobs that run for longer than a few minutes, be they ``QueuedJob`` and ``TimedJob`` instances, you may want to restrict parallelism to prevent multiple such jobs from clogging up the server's resources. You can do this with the ``setAllowParallelRuns`` method of ``OCP\BackgroundJob\Job`` (``QueuedJob`` and ``TimedJob`` both inherit from this class, so they also have this available).

.. code-block:: php

    <?php

    // Only run one instance of this job at a time
    $this->setAllowParallelRuns(false);

Registering a background job
----------------------------

Now that you have written your background job there is of course the small matter of
how to make sure the system actually runs your job. In order to do this your
job needs to be registered.

info.xml
^^^^^^^^

You can register your jobs in your info.xml by adding;

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

    use OCA\MyApp\Cron\SomeTask;
    use OCP\AppFramework\Controller;
    use OCP\BackgroundJob\IJobList;
    use OCP\IRequest;

    class SomeController extends Controller {

        private IJobList $jobList

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

Scheduling
^^^^^^^^^^

A background job can be scheduled to run after a specific time and date. This avoids maintaining a time check inside a background job.

Beware that the reliability of the execution time is limited. Systems that do not use system cron may have no active users and therefore no reliable cron trigger at the target time. System cron can also not guarantee that the job is picked up right away if the background job queue is full. The only guarantee you get is that the job is not picked up earlier than the specified time.

.. code-block:: php
    :caption: lib/Service/ShareService.php
    :emphasize-lines: 19-23

    <?php

    namespace OCA\MyApp\Service;

    use OCA\MyApp\BackgroundJob\RevokeShare;
    use OCP\BackgroundJob\IJobList;

    class ShareService {

        private IJobList $jobList

        public function __construct(IJobList $jobList) {
            $this->jobList = $jobList;
        }

        public function shareWithUser(string $uid, int $expiration) {
            // create an expiring share

            $this->jobList->scheduleAfter(
                RevokeShare::class, 
                ['id' => $shareId],
                $expiration,
            );
        }
    }
