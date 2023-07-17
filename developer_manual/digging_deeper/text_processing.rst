.. _text_processing:

===============
Text Processing
===============

.. versionadded:: 27.1.0

Nextcloud offers a **Text Processing** API. The overall idea is that there is a central OCP API that apps can use to prompt tasks to Large Language Models and similar text processing tools. To be technology agnostic any app can provide this functionality by registering Text Processing providers.

Consuming the Text Processing API
---------------------------------

To consume the  Language Model API, you will need to :ref:`inject<dependency-injection>` ``\OCP\TextProcessing\IManager``. This manager offers the following methods:

 * ``hasProviders()`` This method returns a boolean which indicates if any providers have been registered. If this is false you cannot use the TextProcessing feature.
 * ``getAvailableTaskTypes()`` This method returns a list of class strings representing the tasks that are currently supported.
 * ``runTask(Task $task)`` This method provides the actual prompt functionality. The task is defined using Task class. This method runs the task synchronously, so depending on the implementation it is uncertain how long it will take (between 3s - 10min).
 * ``scheduleTask(Task $task)`` This method provides the actual prompt functionality. The task is defined using the Task class. This method runs the task asynchronously in a background job.
 * ``getTask(int $id)`` This method fetches a task specified by its id.


If you would like to use the text processing functionality in a client, there are also OCS endpoints available for this: :ref:`OCS Text Processing API<ocs-textprocessing-api>`

Tasks types
^^^^^^^^^^^
The following task types are available:

 * ``\OCP\TextProcessing\FreePromptTaskType``: This task allows passing an arbitrary prompt to the language model.
 * ``\OCP\TextProcessing\HeadlineTaskType``: This task will generate a headline for the passed input text.
 * ``\OCP\TextProcessing\TopicsTaskType``: This task will generate a comma-separated list of topics for the passed input text.
 * ``\OCP\TextProcessing\SummaryTaskType``: This task will summarize the passed input text.

Tasks
^^^^^
To create a task we use the ``\OCP\TextProcessing\Task`` class. Its constructor takes the following arguments: ``new \OCP\TextProcessing\Task(string $type, string $input, string $appId, ?string $userId, string $identifier = '')``. For example:

.. code-block:: php

    if (in_array(SummaryTaskType::class, $languageModelManager->getAvailableTaskTypes()) {
        $summaryTask = new Task(SummaryTaskType::class, $emailText, "my_app", $userId, (string) $emailId);
        $languageModelManager->scheduleTask($summaryTask);
    } else {
        // cannot use summarization
    }

The task class objects have the following methods available:

 * ``getType()`` This returns the task type.
 * ``getStatus()`` This method returns one of the below statuses.
 * ``getId()`` This method will return ``null`` before the task has been passed to ``runTask`` or ``scheduleTask``
 * ``getInput()`` This returns the input string.
 * ``getOutput()`` This method will return ``null`` unless the task is successful
 * ``getAppId()`` This returns the originating application ID of the task.
 * ``getIdentifier()`` This returns the original scheduler-defined identifier for the task
 * ``getUserId()`` This returns the originating user ID of the task.

Task statuses
^^^^^^^^^^^^^

All tasks always have one of the below statuses:

.. code-block:: php

    Task::STATUS_FAILED = 4;
    Task::STATUS_SUCCESSFUL = 3;
    Task::STATUS_RUNNING = 2;
    Task::STATUS_SCHEDULED = 1;
    Task::STATUS_UNKNOWN = 0;


Listening to the text processing events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Since ``scheduleTask`` does not block, you will need to listen to the following events in your app to obtain the output or be notified of any failure.

 * ``OCP\TextProcessing\Events\TaskSuccessfulEvent`` This event class offers the ``getTask()`` method which returns the up-to-date task object, with the output from the model.
 * ``OCP\TextProcessing\Events\TaskFailedEvent`` In addition to the ``getTask()`` method, this event class provides the ``getErrorMessage()`` method which returns the error message as a string (only in English and for debugging purposes, so don't show this to the user)


For example, in your ``lib/AppInfo/Application.php`` file:

.. code-block:: php

    $context->registerEventListener(OCP\TextProcessing\Events\TaskSuccessfulEvent::class, MyPromptResultListener::class);
    $context->registerEventListener(OCP\TextProcessing\Events\TaskFailedEvent::class, MyPromptResultListener::class);

The corresponding ``MyPromptResultListener`` class can look like:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Listener;

    use OCA\MyApp\AppInfo\Application;
    use OCP\TextProcessing\Events\AbstractTextProcessingEvent;
    use OCP\TextProcessing\Events\TaskSuccessfulEvent;
    use OCP\TextProcessing\Events\TaskFailedEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    class MyPromptResultListener implements IEventListener {
        public function handle(Event $event): void {
            if (!$event instanceof AbstractTextProcessingEvent || $event->getTask()->getAppId() !== Application::APP_ID) {
                return;
            }

            if ($event instanceof TaskSuccessfulEvent) {
                $output = $event->getTask()->getOutput()
                // store $output somewhere
            }

            if ($event instanceof TaskSuccessfulEvent) {
                $error = $event->getErrorMessage()
                $userId = $event->getTask()->getUserId()
                // Notify relevant user about failure
            }
        }
    }


Implementing a TextProcessing provider
--------------------------------------

A **Text processing provider** is a class that implements the interface ``OCP\TextProcessing\IProvider``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\TextProcessing;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\TextProcessing\IProvider;
    use OCP\TextProcessing\SummaryTaskType;
    use OCP\IL10N;

    class Provider implements IProvider {

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome text processing provider');
        }

        public function getTaskType(): string {
            return SummaryTaskType::class;
        }

        public function process(string $input): string {
            // Return the output here
        }
    }

The method ``getName`` returns a string to identify the registered provider in the user interface.

The method ``process`` implements the text processing step, e.g. it passes the prompt to a language model. In case execution fails for some reason, you should throw a ``RuntimeException`` with an explanatory error message.

The class would typically be saved into a file in ``lib/TextProcessing`` of your app but you are free to put it elsewhere as long as it's loadable by Nextcloud's :ref:`dependency injection container<dependency-injection>`.

Providing more task types
^^^^^^^^^^^^^^^^^^^^^^^^^

If you would like to implement providers that handle additional task types, you can create your own TaskType classes implementing the ``OCP\TextProcessing\ITaskType``
interface:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\TextProcessing;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\TextProcessing\ITaskType;
    use OCP\IL10N;

    class OscarWildeTaskType implements ITaskType {

         public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('Oscar Wilde Generator');
        }

        public function getDescription(): string {
          return $this->l->t('Turn text into Oscar Wilde prose');
        }
    }

Provider registration
---------------------

The provider class is registered via the :ref:`bootstrap mechanism<Bootstrapping>` of the ``Application`` class.

.. code-block:: php
    :emphasize-lines: 16

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\TextProcessing\Provider;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerTextProcessingProvider(Provider::class);
        }

        public function boot(IBootContext $context): void {}

    }