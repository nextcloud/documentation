.. _llm:

====================
Large Language Model
====================

.. versionadded:: 28

Nextcloud offers a **Language Model** API. The overall idea is that there is a central OCP API that apps can use to prompt tasks to a Large Language Model. To be technology agnostic any app can provide this Language Model functionality by registering a Language Model provider.

Consuming the Language Model API
--------------------------------

To consume the  Language Model API, you will need to :ref:`inject<dependency-injection>` ``\OCP\LanguageModel\ILanguageModelManager``. This manager offers the following methods:

 * ``hasProviders()`` This method returns a boolean which indicates if any providers have been registered. If this is false you cannot use the LanguageModel feature.
 * ``getAvailableTasks()`` This method returns a list of class strings representing the tasks that are currently supported for prompting.
 * ``getAvailableTaskTypes()`` This method returns a list of strings representing the tasks that are currently supported for prompting. These strings are exposed on the Task classes (see below) via the ``TYPE`` constants.
 * ``runTask(ILanguageModelTask $task)`` This method provides the actual prompt functionality. The language model task is defined using one of the available Task classes (see below). This method runs the prompt synchronously, so depending on the implementation it is uncertain how long it will take (between 3s - 10min).
 * ``scheduleTask(ILanguageModelTask $task)`` This method provides the actual prompt functionality. The language model task is defined using one of the available Task classes (see below). This method runs the prompt asynchronously in a background job.
 * ``getTask(int $id)`` This method fetches a task specified by its id.


If you would like to use the language model functionality in a client, there are also OCS endpoints available for this: :ref:`OCS Language Model API<ocs-languagemodel-api>`

Tasks
^^^^^
The following task types are available:

 * class: ``\OCP\LanguageModel\FreePromptTask``, type: ``"free_prompt"``: This task allows passing an arbitrary prompt to the language model.
 * class: ``\OCP\LanguageModel\HeadlineTask``, type: ``"headline"``: This task will generate a headline for the passed input text.
 * class: ``\OCP\LanguageModel\TopicsTask``, type: ``"topics"``: This task will generate a comma-separated list of topics for the passed input text.
 * class: ``\OCP\LanguageModel\SummaryTask``, type: ``"summarize"``: This task will summarize the passed input text.

All Task classes implement ``OCP\LanguageModel\ILanguageModelTask``. To create a task you can write ``new <Task>(string $input, string $appId, ?string $userId)``. For example:

.. code-block:: php

    if (in_array(SummaryTask::TYPE, $languageModelManager->getAvailableTaskTypes()) {
        $summaryTask = new SummaryTask($emailText, "my_app", $userId);
        $languageModelManager->scheduleTask($summaryTask);
        // store $summaryTask->getId() somewhere
    } else {
        // cannot use summarization
    }

All task objects have the following methods available:

 * ``getType()`` This returns the task type.
 * ``getStatus()`` This method returns one of the below statuses.
 * ``getId()`` This method will return ``null`` before the task has been passed to ``runTask`` or ``scheduleTask``
 * ``getInput()`` This returns the input string.
 * ``getOutput()`` This method will return ``null`` unless the task is successful
 * ``getAppId()`` This returns the originating application ID of the task.
 * ``getUserId()`` This returns the originating user ID of the task.

Task statuses
^^^^^^^^^^^^^

.. code-block:: php

    ILanguageModelTask::STATUS_FAILED = 4;
    ILanguageModelTask::STATUS_SUCCESSFUL = 3;
    ILanguageModelTask::STATUS_RUNNING = 2;
    ILanguageModelTask::STATUS_SCHEDULED = 1;
    ILanguageModelTask::STATUS_UNKNOWN = 0;


Listening to the language model events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Since ``scheduleTask`` does not block, you will need to listen to the following events in your app to obtain the output or be notified of any failure.

 * ``OCP\LanguageModel\Events\TaskSuccessfulEvent`` This event class offers the ``getTask()`` method which returns the up-to-date task object, with the output from the model.
 * ``OCP\LanguageModel\Events\TaskFailedEvent`` In addition to the ``getTask()`` method, this event class provides the ``getErrorMessage()`` method which returns the error message as a string (only in English and for debugging purposes, so don't show this to the user)


For example, in your ``lib/AppInfo/Application.php`` file:

.. code-block:: php

    $context->registerEventListener(OCP\LanguageModel\Events\TaskSuccessfulEvent::class, MyPromptResultListener::class);
    $context->registerEventListener(OCP\LanguageModel\Events\TaskFailedEvent::class, MyPromptResultListener::class);

The corresponding ``MyPromptResultListener`` class can look like:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Listener;

    use OCA\MyApp\AppInfo\Application;
    use OCP\LanguageModel\Events\AbstractLanguageModelEvent;
    use OCP\LanguageModel\Events\TaskSuccessfulEvent;
    use OCP\LanguageModel\Events\TaskFailedEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    class MyPromptResultListener implements IEventListener {
        public function handle(Event $event): void {
            if (!$event instanceof AbstractLanguageModelEvent || $event->getTask()->getAppId() !== Application::APP_ID) {
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


Implementing a LanguageModel provider
-------------------------------------

A **Language model provider** is a class that implements the interface ``OCP\LanguageModel\ILanguageModelProvider``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\LanguageModel;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\LanguageModel\ILanguageModelProvider;
    use OCP\IL10N;

    class Provider implements ILanguageModelProvider {

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome language model provider');
        }

        public function prompt(string $input): string {
            // Return the output here
        }
    }

The method ``getName`` returns a string to identify the registered provider in the user interface.

The method ``prompt`` runs the prompt with the language model you implement. In case execution fails for some reason, you should throw a ``RuntimeException`` with an explanatory error message. All language model providers have to implement this method, which corresponds to the FreePromptTask (see above).

The class would typically be saved into a file in ``lib/LanguageModel`` of your app but you are free to put it elsewhere as long as it's loadable by Nextcloud's :ref:`dependency injection container<dependency-injection>`.

Providing more task types
^^^^^^^^^^^^^^^^^^^^^^^^^

There are also additional interfaces for each of the additional task types, that allow specifying that your provider can handle other tasks as well.

These interfaces are the following:

* ``OCP\LanguageModel\IHeadlineProvider``
    * defines ``findHeadline(string $text): string;``
* ``OCP\LanguageModel\ITopicsProvider``
    * defines ``findTopics(string $text): string``
* ``OCP\LanguageModel\ISummaryProvider``
    * defines ``summarize(string $text): string``

You can use these as follows:

.. code-block:: php
    :emphasize-lines: 13,28,29,30

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Translation;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\LanguageModel\ILanguageModelProvider;
    use OCP\LanguageModel\ISummaryProvider;
    use OCP\IL10N;

    class Provider implements ILanguageModelProvider, ISummaryProvider {

         public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome language model provider');
        }

        public function prompt(string $input): string {
            // Return the output here
        }

        public function summarize(string $text): string {
          // return the summary here
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

    use OCA\MyApp\Translation\Provider;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerLanguageModelProvider(Provider::class);
        }

        public function boot(IBootContext $context): void {}

    }