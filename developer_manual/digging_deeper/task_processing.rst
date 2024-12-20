.. _task_processing:

===============
Task Processing
===============

.. versionadded:: 30.0.0

Nextcloud offers a **Task Processing** API which replaces the previously introduced :ref:`Text Processing<text_processing>`, :ref:`TextToImage<text2image>` and :ref:`Speech-To-Text<speech-to-text>` APIs. The overall idea is that there is a central OCP API that apps can use to schedule all kinds of tasks (mainly intended for AI tasks). To be technology agnostic any other app can provide this task functionality by registering Task Processing providers for specific Task types.

Consuming the Task Processing API
---------------------------------

To consume the  Task Processing API, you will need to :ref:`inject<dependency-injection>` ``\OCP\TaskProcessing\IManager``. This manager offers the following methods:

 * ``hasProviders()`` This method returns a boolean which indicates if any providers have been registered. If this is false you cannot use the TextProcessing feature.
 * ``getAvailableTaskTypes(bool $showDisabled = false)`` This method returns an array of enabled task types indexed by their ID with their names and additional metadata. If you set ``$showdisabled`` to ``true`` (available since NC31), it will include disabled task types.
 * ``scheduleTask(Task $task)`` This method provides the actual scheduling functionality. The task is defined using the Task class. This method runs the task asynchronously in a background job.
 * ``getTask(int $id)`` This method fetches a task specified by its id.
 * ``deleteTask(Task $task)`` This method deletes a task
 * ``cancelTask(int $id)`` This method cancels a task specified by its id.

If you would like to use the task processing functionality in a client, there are also OCS endpoints available for this: :ref:`OCS Task Processing API<ocs-taskprocessing-api>`

Tasks types
^^^^^^^^^^^
The following built-in task types are available:

 * ``'core:text2text'``: This task allows passing an arbitrary prompt to the language model. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToText``
    * Input shape:
       * ``input``: ``Text``
    * Output shape:
       * ``output``: ``Text``
 * ``'core:text2text:chat'``: This task allows chatting with the language model. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextChat``
    * Input shape:
       * ``system_prompt``: ``Text``
       * ``input``: ``Text``
       * ``history``: ``ListOfTexts``
    * Output shape:
       * ``output``: ``Text``
 * ``'core:text2text:chatwithtools'``: This task allows chatting with the language model with tools calling support. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextChatWithTools``
    * Input shape:
       * ``system_prompt``: ``Text``
       * ``input``: ``Text``
       * ``history``: ``ListOfTexts``
       * ``tools``: ``Text`` The tools parameter should be a JSON object formatted according to the OpenAI API specifications: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools
    * Output shape:
       * ``output``: ``Text``
       * ``tool_calls``: ``Text``
 * ``'core:contextagent:interaction'``: This task allows chatting with an agent. It is implemented by ``\OCP\TaskProcessing\TaskTypes\ContextAgentInteraction``
    * Input shape:
       * ``input``: ``Text``
       * ``confirmation``: ``Number`` Boolean integer indicating whether to confirm previously requested actions: 0 to reject or 1 to confirm.
       * ``conversation_token``: ``Text`` Token representing the conversation
    * Output shape:
       * ``output``: ``Text``
       * ``conversation_token``: ``Text``
       * ``actions``: ``Text``
 * ``'core:text2text:formalization'``: This task will reformulate the passed input text to be more formal in tone. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextFormalization``
     * Input shape:
        * ``input``: ``Text``
     * Output shape:
        * ``output``: ``Text``
 * ``'core:text2text:headline'``: This task will generate a headline for the passed input text. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextHeadline``
     * Input shape:
        * ``input``: ``Text``
     * Output shape:
        * ``output``: ``Text``
 * ``'core:text2text:reformulation'``: This task will reformulate the passed input text arbitrarily. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextReformulation``
     * Input shape:
        * ``input``: ``Text``
     * Output shape:
        * ``output``: ``Text``
 * ``'core:text2text:simplification'``: This task will reformulate the passed input text to be very easy to understand, e.g. by children. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextSimplification``
     * Input shape:
        * ``input``: ``Text``
     * Output shape:
        * ``output``: ``Text``
 * ``'core:text2text:summary'``: This task will summarize the passed input text. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextSummary``
      * Input shape:
        * ``input``: ``Text``
      * Output shape:
        * ``output``: ``Text``
 * ``'core:text2text:topics'``: This task will generate a comma-separated list of topics for the passed input text. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextTopics``
      * Input shape:
        * ``input``: ``Text``
      * Output shape:
        * ``output``: ``Text``
 * ``'core:text2text:translate'``: This task will translate text from one language to another. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextTranslate``
      * Input shape:
        * ``input``: ``Text``
        * ``origin_language``: ``Enum``
        * ``target_language``: ``Enum``
      * Output shape:
        * ``output``: ``Text``
 * ``'core:audio2text'``: This task type is for transcribing audio to text. It is implemented by ``\OCP\TaskProcessing\TaskTypes\AudioToText``
     * Input shape:
        * ``input``: ``Audio``
     * Output shape:
        * ``output``: ``Text``
 * ``'core:text2image'``: This task type is for generating images from text prompts. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToImage``
      * Input shape:
         * ``input``: ``Text``
         * ``numberOfImages``: ``Number``
      * Output shape:
         * ``output``: ``ListOfImages``
 * ``'core:text2text:changetone'``: This task type is for reformulating a text, changing its tone. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextChangeTone``
      * Input shape:
         * ``input``: ``Text``
         * ``tone``: ``Enum``
      * Output shape:
         * ``output``: ``Text``
 * ``'core:text2text:proofread'``: This task type is for proofreading a text, checking it for grammar and spelling mistakes. It is implemented by ``\OCP\TaskProcessing\TaskTypes\TextToTextProofread``
      * Input shape:
         * ``input``: ``Text``
      * Output shape:
         * ``output``: ``Text``


Task types can be disabled in the AI admin settings so they are not available for the Assistant or other apps even if they are implemented. All implemented Task types are enabled by default.

LLM Prompts and multilingual I/O
################################

When writing prompts for the TextToText task type in your apps, we recommend testing it with at least

* OpenAI GPT-3.5
* Llama 3.1

Also, make sure that you instruct the model to use the correct language in its output. By default most models will answer in English if the main prompt is in English, even though the source data is in another language.
A tweak to make sure of this is to instruct the model as follows:

.. code-block:: php

   "Detect the language used in the text and make sure to answer in the same language without mentioning the language explicitly."

Input and output shapes
~~~~~~~~~~~~~~~~~~~~~~~

Each task type defines how its input and output should look. This is called the input and output shape.

For example the TextToImage type defines its input shape as follows:

.. code-block:: php

    /**
     * @return ShapeDescriptor[]
     * @since 30.0.0
     */
    public function getInputShape(): array {
        return [
            'input' => new ShapeDescriptor(
                $this->l->t('Prompt'),
                $this->l->t('Describe the image you want to generate'),
                EShapeType::Text
            ),
            'numberOfImages' => new ShapeDescriptor(
                $this->l->t('Number of images'),
                $this->l->t('How many images to generate'),
                EShapeType::Number
            ),
        ];
    }

The task input and output are always represented by an associative array. In this case, the task input for TextToImage must have an array key named ``'input'`` which must contain a text and an array key named ``'numberOfImages'`` which must contain a number.

If you want to simply use a task type, you can look up it's input and output shapes above or, if it is not built-in, in the documentation or implementation of the app introducing the task type. If you would like to use task types dynamically without knowing their shapes in advance, you can get their shape information from the ``IManager#getAvailableTaskTypes()`` method. The ShapeDescriptor class allows accessing the type data as well as human readable name and description using the ``getName()``, ``getDescription()`` and ``getShapeType()`` methods.

Shape types
~~~~~~~~~~~

Input and output shape keys can have one of a pre-defined set of types, which are enumerated in the ``\OCP\TaskProcessing\EShapeType`` Enum:

.. code-block:: php

    enum EShapeType: int {
    	case Number = 0;
    	case Text = 1;
    	case Image = 2;
    	case Audio = 3;
    	case Video = 4;
    	case File = 5;
    	case Enum = 6;
    	case ListOfNumbers = 10;
    	case ListOfTexts = 11;
    	case ListOfImages = 12;
    	case ListOfAudio = 13;
    	case ListOfVideo = 14;
    	case ListOfFiles = 15;
    }

When consuming the task processing API, ``Image``, ``Audio``, ``Video`` and ``File`` slots are filled with Nextcloud file IDs, so instead of supplying the image data directly as a string to the task you create a file for it and pass the id. Similarly, if the task outputs an image, you will receive a file ID in that slot.

Tasks
^^^^^
To create a task we use the ``\OCP\TaskProcessing\Task`` class. Its constructor takes the following arguments: ``new \OCP\TaskProcessing\Task(string $taskTypeId, array $input, string $appId, ?string $userId, string $customId = '')``. For example:

.. code-block:: php

    if (isset($textprocessingManager->getAvailableTaskTypes()[TextToTextSummary::ID]) {
        $summaryTask = new Task(TextToTextSummary::ID, $emailText, "my_app", $userId, (string) $emailId);
    } else {
        // cannot use summarization
    }

The task class objects have the following methods available:

 * ``getTaskTypeId()`` This returns the task type.
 * ``getStatus()`` This method returns one of the below statuses.
 * ``getId()`` This method will return ``null`` before the task has been passed to ``scheduleTask`` otherwise it will return the unique ID of the task.
 * ``getInput()`` This returns the input array.
 * ``getOutput()`` This method will return ``null`` unless the task was successfully run, in that case it will return the output array
 * ``getAppId()`` This returns the originating application ID of the task.
 * ``getCustomId()`` This returns the original scheduler-defined identifier for the task
 * ``getUserId()`` This returns the originating user ID of the task.
 * ``getCompletionExpectedAt()`` This is available after scheduling the task and returns the DateTime when the task is expected to be completed
 * ``getLastUpdated()`` This returns the time the task was last updated as a unix timestamp
 * ``getScheduledAt()`` This returns the time the task was scheduled as a unix timestamp
 * ``getStartedAt()`` This returns the time the task execution started as a unix timestamp
 * ``getEndedAt()`` This returns the time the task execution ended as a unix timestamp
 * ``getErrorMessage()`` This returns the error message if the task execution failed
 * ``getProgress()`` This returns the current task progress, between 0 and 1 while the task is running. Will be 1 when the task is completed
 * ``setWebhookUri()`` This sets the URI of a webhook that will be notified when the task execution has ended
 * ``setWebhookMethod()`` This sets the HTTP method that will be used for the webhook when the task execution has ended
 * ``getWebhookUri()`` This returns the webhook URI that will be notified when the task execution has ended
 * ``getWebhookMethod()`` This returns the HTTP method that will be used for the webhook when the task execution has ended

You could now schedule the task as follows:

.. code-block:: php

    try {
        $taskprocessingManager->scheduleTask($summaryTask);
    } catch (OCP\TaskProcessing\Exception\Exception|OCP\TaskProcessing\Exception\PreConditionNotMetException|OCP\TaskProcessing\Exception\UnauthorizedException|OCP\TaskProcessing\Exception\ValidationException $e) {
        // scheduling task failed
    }

Task statuses
^^^^^^^^^^^^^

All tasks always have one of the below statuses:

.. code-block:: php

    Task::STATUS_CANCELLED = 5;
    Task::STATUS_FAILED = 4;
    Task::STATUS_SUCCESSFUL = 3;
    Task::STATUS_RUNNING = 2;
    Task::STATUS_SCHEDULED = 1;
    Task::STATUS_UNKNOWN = 0;


Listening to the task processing events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Since ``scheduleTask`` does not block, you will need to listen to the following events in your app to obtain the output or be notified of any failure.

 * ``OCP\TaskProcessing\Events\TaskSuccessfulEvent`` This event class offers the ``getTask()`` method which returns the up-to-date task object, with the task output.
 * ``OCP\TaskProcessing\Events\TaskFailedEvent`` In addition to the ``getTask()`` method, this event class provides the ``getErrorMessage()`` method which returns the error message as a string (only in English and for debugging purposes, so don't show this to the user)


For example, in your ``lib/AppInfo/Application.php`` file:

.. code-block:: php

    $context->registerEventListener(OCP\TaskProcessing\Events\TaskSuccessfulEvent::class, MyPromptResultListener::class);
    $context->registerEventListener(OCP\TaskProcessing\Events\TaskFailedEvent::class, MyPromptResultListener::class);

The corresponding ``MyPromptResultListener`` class can look like:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Listener;

    use OCA\MyApp\AppInfo\Application;
    use OCP\TaskProcessing\Events\AbstractTaskProcessingEvent;
    use OCP\TaskProcessing\Events\TaskSuccessfulEvent;
    use OCP\TaskProcessing\Events\TaskFailedEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    class MyPromptResultListener implements IEventListener {
        public function handle(Event $event): void {
            if (!$event instanceof AbstractTaskProcessingEvent || $event->getTask()->getAppId() !== Application::APP_ID) {
                return;
            }

            if ($event instanceof TaskSuccessfulEvent) {
                $output = $event->getTask()->getOutput()
                // store $output somewhere
            }

            if ($event instanceof TaskFailedEvent) {
                $error = $event->getErrorMessage()
                $userId = $event->getTask()->getUserId()
                // Notify relevant user about failure
            }
        }
    }


Implementing a TaskProcessing provider
--------------------------------------

A **Task processing provider** will usually be a class that implements the interface ``OCP\TaskProcessing\ISynchrounousProvider``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\TaskProcessing;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\TaskProcessing\IProvider;
    use OCP\TaskProcessing\TaskTypes\TextToTextSummary;
    use OCP\TaskProcessing\SummaryTaskType;
    use OCP\IL10N;

    class Provider implements ISynchrounousProvider {

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getId(): string {
          return 'myapp:summary';
        }

        public function getName(): string {
            return $this->l->t('My awesome summary provider');
        }

        public function getTaskTypeId(): string {
            return TextToTextSummary::ID;
        }

        public function process(?string $userId, array $input, callable $reportProgress): array {
            // Return the output here
        }

        public function getExpectedRuntime(): int {
            // usually takes 1min on average
            return 60;
        }

        public function getInputShapeDefaults(): array {
            return [];
        }

        public function getOptionalInputShape(): array {
            return [];
        }

        public function getOptionalInputShapeDefaults(): array {
            return [];
        }

        public function getOptionalOutputShape(): array {
            return [];
        }

        public function getInputShapeEnumValues(): array {
            return [];
        }

        public function getOptionalInputShapeEnumValues(): array {
            return [];
        }

        public function getOutputShapeEnumValues(): array {
            return [];
        }

        public function getOptionalOutputShapeEnumValues(): array {
            return [];
        }
    }

The method ``getName`` returns a string to identify the registered provider in the user interface.

The method ``process`` implements the task processing step. In case execution fails for some reason, you should throw a ``\OCP\TaskProcessing\Exception\ProcessingException`` with an explanatory error message. Important to note here is that ``Image``, ``Audio``, ``Video`` and ``File`` slots in the input array will be filled with ``\OCP\Files\File`` objects for your convenience. When outputting one of these you should simply return a string, the API will turn the data into a proper file for convenience. The ``$reportProgress`` parameter is a callback that you may use at will to report the task progress as a single float value between 0 and 1. Its return value will indicate if the task is still running (``true``) or if it was cancelled (``false``) and processing should be terminated.

This class would typically be saved into a file in ``lib/TaskProcessing`` of your app but you are free to put it elsewhere as long as it's loadable by Nextcloud's :ref:`dependency injection container<dependency-injection>`.

Providing additional inputs and outputs
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Built-in task types often only specify the most basic input and output slots. If you would like to offer more input options
with your provider you can specify optional inputs and outputs using the ``getOptionalInputShape`` and ``getOptionalOutputShape`` methods.
You will need to return an associative array of ``\OCP\TaskProcessing\ShapeDescriptor`` objects.

.. code-block:: php

    public function getOptionalInputShape(): array {
        return [
            'tone' => new ShapeDescriptor($this->l->t('Tone of voice'), $this->l->t('Set the tone of voice to be used for the output'), EShapeType::Text)
        ];
    }

In the same vein you can also provide optional output shape slots in addition to the pre-defined output slots.

.. code-block:: php

    public function getOptionalOutputShape(): array {
        return [
            'co2_emissions' => new ShapeDescriptor($this->l->t('CO2 Emissions'), $this->l->t('The CO2 emissions produced by running this task in metric tons'), EShapeType::Number)
        ];
    }

Providing input defaults
^^^^^^^^^^^^^^^^^^^^^^^^

With the method ``getInputShapeDefaults`` you can specify default values for input slots (which are defined by the task type). For example:

.. code-block:: php

    public function getInputShapeDefaults(): array {
        return [
            'input' => 'There was once a man with many cows who wanted to have even more cows.'
        ];
    }

Note that you can only specify default values for 'Text' and 'Number' slots.

The same works for your optional input shapes that you defined in ``getOptionalInputShape``:

.. code-block:: php

    public function getOptionalInputShapeDefaults(): array {
        return [
            'tone' => 'Formal'
        ];
    }

Working with Enum shape types
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Both input and output shapes as well as the optional input and output shapes allow declaring slots of type ``'Enum'``. An Enum
is a type that only allows values from a pre-defined set. In the case of the TaskProcessing API this set is not defined by the task type, but
by the provider implementing the task type using ``getInputShapeEnumValues``, ``getOutputShapeEnumValues``, ``getOptionalInputShapeEnumValues`` and ``getOptionalOutputShapeEnumValues``.

You could, for example, implement the above tone of voice slot using an Enum:

.. code-block:: php

    public function getOptionalInputShape(): array {
        return [
            'tone' => new ShapeDescriptor($this->l->t('Tone of voice'), $this->l->t('Set the tone of voice to be used for the output'), EShapeType::Enum)
        ];
    }

.. code-block:: php

    public function getOptionalInputShapeEnumValues(): array {
        return [
            'tone' => [
                new ShapeEnumValue($this->l->t('Simple'), 'So that a kid could understand'),
                new ShapeEnumValue($this->l->t('Funny'), 'Funny'),
                new ShapeEnumValue($this->l->t('Formal'), 'Formal'),
            ]
        ];
    }


Providing more task types
^^^^^^^^^^^^^^^^^^^^^^^^^

If you would like to implement providers that handle additional task types, you can create your own Task type classes implementing the ``OCP\TaskProcessing\ITaskType`` interface:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\TaskProcessing;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\TaskProcessing\ITaskType;
    use OCP\IL10N;

    class AudioToImage implements ITaskType {
    	public const ID = 'myapp:audiotoimage';

    	public function getId(): string {
    		return self::ID;
    	}

    	public function getName(): string {
    		return 'Get Spectrogram';
    	}

    	public function getDescription(): string {
    		return 'Turns audio into an image';
    	}

    	public function getInputShape(): array {
    		return [
    			'audio' => new ShapeDescriptor('Audio', 'The audio', EShapeType::Audio),
    		];
    	}

    	public function getOutputShape(): array {
    		return [
    			'spectrogram' => new ShapeDescriptor('Spectrogram', 'The audio spectrogram', EShapeType::Image),
    		];
    	}
    }

Provider and task type registration
-----------------------------------

Providers and task types are registered via the :ref:`bootstrap mechanism<Bootstrapping>` of the ``Application`` class.

.. code-block:: php
    :emphasize-lines: 17,18

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\TaskProcessing\Provider;
    use OCA\MyApp\TaskProcessing\AudioToImage;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerTaskProcessingProvider(Provider::class);
            $context->registerTaskProcessingTaskType(AudioToImage::class);
        }

        public function boot(IBootContext $context): void {}

    }
