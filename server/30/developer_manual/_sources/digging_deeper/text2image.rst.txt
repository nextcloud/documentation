.. _text2image:

=============
Text-To-Image
=============

.. versionadded:: 28

.. deprecated:: 30
    Use the TaskProcessing API instead

Nextcloud offers a **Text-To-Image** API. The overall idea is that there is a central OCP API that apps can use to prompt tasks to latent diffusion AI models and similar image generation tools. To be technology agnostic any app can provide this functionality by registering a Text-To-Image provider.

Consuming the Text-To-Image API
-------------------------------

To consume the Text-To-Image API, you will need to :ref:`inject<dependency-injection>` ``\OCP\TextToImage\IManager``. This manager offers the following methods:

 * ``hasProviders()`` This method returns a boolean which indicates if any providers have been registered. If this is false you cannot use the image generation feature.
 * ``runTask(Task $task)`` This method provides the actual functionality. The task is defined using the Task class. This method runs the task synchronously, so depending on the implementation it is uncertain how long it will take (between 3s and several hours).
 * ``scheduleTask(Task $task)`` This method also runs a task, but asynchronously in a background job. The task is defined using the Task class.
 * ``runOrScheduleTask(Task $task)`` This method also runs a task, but fist checks the expected runtime of the provider to be used. If the runtime fits inside the available processing time for the current request the task is run synchronously, otherwise it is scheduled as a background job. The task is defined using the Task class.
 * ``getTask(int $id)`` This method fetches a task specified by its id.
 * ``getUserTask(int $id, ?string $userId)`` This method fetches a task specified by its id and the user that is associated with it.
 * ``getUserTasksByApp(?string $userId, string $appId, ?string $identifier = null)`` This method fetches tasks by a user created by a specific app (optionally, you can also specify the task identifier as an additional filter)

If you would like to use the image generation functionality in a client, there are also OCS endpoints available for this: :ref:`OCS Text-To-Image API<ocs-text2image-api>`

Tasks
^^^^^
To create a task we use the ``\OCP\TextToImage\Task`` class. Its constructor takes the following arguments: ``new \OCP\TextToImage\Task(string $input, string $appId, int $numberOfImages, ?string $userId, string $identifier = '')``. For example:

.. code-block:: php

    $text2imageTask = new Task($documentTitle, "my_app", 8, $userId, (string) $documentId);

The task class objects have the following methods available:

 * ``getStatus()`` This method returns one of the below statuses.
 * ``getId()`` This method will return ``null`` before the task has been passed to ``runTask`` or ``scheduleTask``, otherwise it will return an integer
 * ``getInput()`` This returns the input string.
 * ``getAppId()`` This returns the originating application ID of the task.
 * ``getNumberOfImages()`` This returns the number of generated images for the task.
 * ``getIdentifier()`` This returns the original scheduler-defined identifier for the task
 * ``getUserId()`` This returns the originating user ID of the task.
 * ``getOutputImages()`` This method will return ``null`` unless the task is successful, if its, it will return a list of ``IImage`` objects

You could run the task directly as follows. However, this will block the current PHP process until the task is done, which can sometimes take dozens of minutes, depending on which provider is used.

.. code-block:: php

    try {
        $text2imageManager->runTask($text2imageTask);
    } catch (\OCP\PreConditionNotMetException|\OCP\TextToImage\Exception\TaskFailureException $e) {
        // task failed
        // return error
    }
    // task was successful

The wiser choice, when you are in the context of a HTTP controller, is to schedule the task for execution in a background job, as follows:

.. code-block:: php

    try {
        $text2imageManager->scheduleTask($text2imageTask);
    } catch (\OCP\PreConditionNotMetException|\OCP\DB\Exception $e) {
        // scheduling task failed
    }
    // task was scheduled successfully

Of course, you might want to schedule the task in a background job **only** if it takes longer than the request timeout. This is what runOrScheduleTask does.

.. code-block:: php

    try {
        $text2imageManager->runOrScheduleTask($text2imageTask);
    } catch (\OCP\PreConditionNotMetException|\OCP\DB\Exception $e) {
        // scheduling task failed
        // return error
    } catch (\OCP\TextToImage\Exception\TaskFailureException $e) {
        // task was run but failed
        // status will be STATUS_FAILED
        // return error
    }

    switch ($text2imageTask->getStatus()) {
    case \OCP\TextToImage\Task::STATUS_SUCCESSFUL:
        // task was run directly and was successful
    case \OCP\TextToImage\Task::STATUS_RUNNING:
    case \OCP\TextToImage\Task::STATUS_SCHEDULED:
        // task was deferred to background job
    default:
        // something went wrong
    }

Task statuses
^^^^^^^^^^^^^

.. _text2image_statuses:

All tasks always have one of the below statuses:

.. code-block:: php

    Task::STATUS_FAILED = 4;
    Task::STATUS_SUCCESSFUL = 3;
    Task::STATUS_RUNNING = 2;
    Task::STATUS_SCHEDULED = 1;
    Task::STATUS_UNKNOWN = 0;


Listening to the image generation events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Since ``scheduleTask`` does not block, you will need to listen to the following events in your app to obtain the resulting images or be notified of any failure.

 * ``OCP\TextToImage\Events\TaskSuccessfulEvent`` This event class offers the ``getTask()`` method which returns the up-to-date task object, with the output from the model.
 * ``OCP\TextToImage\Events\TaskFailedEvent`` In addition to the ``getTask()`` method, this event class provides the ``getErrorMessage()`` method which returns the error message as a string (only in English and for debugging purposes, so don't show this to the user)


For example, in your ``lib/AppInfo/Application.php`` file:

.. code-block:: php

    $context->registerEventListener(OCP\TextToImage\Events\TaskSuccessfulEvent::class, ImageGenerationResultListener::class);
    $context->registerEventListener(OCP\TextToImage\Events\TaskFailedEvent::class, ImageGenerationResultListener::class);

The corresponding ``ImageGenerationResultListener`` class could look like the following:

.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp\Listener;

    use OCA\MyApp\AppInfo\Application;
    use OCP\TextToImage\Events\AbstractTextToImageEvent;
    use OCP\TextToImage\Events\TaskSuccessfulEvent;
    use OCP\TextToImage\Events\TaskFailedEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    class ImageGenerationResultListener implements IEventListener {
        public function handle(Event $event): void {
            if (!$event instanceof AbstractTextProcessingEvent || $event->getTask()->getAppId() !== Application::APP_ID) {
                return;
            }

            if ($event instanceof TaskSuccessfulEvent) {
                $images = $event->getTask()->getOutputImages()
                // store $images somewhere
            }

            if ($event instanceof TaskFailedEvent) {
                $error = $event->getErrorMessage()
                $userId = $event->getTask()->getUserId()
                // Notify relevant user about failure
            }
        }
    }


Implementing a Text-To-Image provider
--------------------------------------

A **Text-To-Image provider** is a class that implements the interface ``OCP\TextToImage\IProvider``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\TextToImage;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\TextToImage\IProvider;
    use OCP\IL10N;

    class ImageGenerationProvider implements IProvider {

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getId(): string {
            return self::class;
        }

        public function getName(): string {
            return $this->l->t('My awesome text to image provider');
        }

        public function generate(string $input, array $resources): void {
            // write the resulting images to the file resources in $resources
        }
    }

The method ``getId`` returns a string to uniquely identify the registered provider. You can use the class name for this for example.

The method ``getName`` returns a string to identify the registered provider in the user interface and should be localized.

The method ``generate`` implements the image generation step. It gets passed an array of ``resource`` values. The length of the array indicates how many images should be generated. Each image should be written to one of the resources, e.g. using ``fwrite()``. In case execution fails for some reason, you should throw a ``RuntimeException`` with an explanatory error message.

The class would typically be saved into a file in ``lib/TextToImage`` of your app but you are free to put it elsewhere as long as it's loadable by Nextcloud's :ref:`dependency injection container<dependency-injection>`.


Provider registration
---------------------

The provider class is registered via the :ref:`bootstrap mechanism<Bootstrapping>` of the ``Application`` class.

.. code-block:: php
    :emphasize-lines: 16

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\TextToImage\ImageGenerationProvider;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerTextToImageProvider(ImageGenerationProvider::class);
        }

        public function boot(IBootContext $context): void {}

    }
