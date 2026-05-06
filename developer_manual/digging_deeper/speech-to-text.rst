.. _speech-to-text:

==============
Speech-To-Text
==============

.. versionadded:: 27

.. deprecated:: 30
    Use the TaskProcessing API instead

Nextcloud offers a **Speech-To-Text** API. The overall idea is that there is a central OCP API that apps can use to request transcriptions of audio or video files. To be technology agnostic any app can provide this Speech-To-Text functionality by registering a Speech-To-Text provider.

Consuming the Speech-To-Text API
--------------------------------

To consume the Speech-To-Text API, you will need ``\OCP\SpeechToText\ISpeechToTextManager``. This manager offers the following methods:

 * ``hasProviders()`` This method returns a boolean which indicates if any providers have been registered. If this is false you cannot use Speech-To-Text.
 * ``transcribeFile(File $file)`` This method takes a ``OCP\Files\File`` Object which should point to a media file and will attempt to transcribe it **in the current process**. It will thus block until transcription has finished and will return the transcript as a string. Using this method is thus only recommend in CLI commands or Background Jobs when you are not limited by any HTTP request timeouts and execution time limits.
 * ``scheduleFileTranscription(File $file, ?string $userId, string $appId)`` This method schedules a transcription of the passed media file **in a background job** and will thus not block.

Listening to the transcription events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Since ``scheduleFileTranscription`` does not block, you will need to listen to the following events in your app to obtain the transcript or be notified of any failure.

 * ``OCP\SpeechToText\Events\TranscriptionSuccessfulEvent`` This event class offers the ``getTranscript()`` method which returns the transcript as a string
 * ``OCP\SpeechToText\Events\TranscriptionFailedEvent`` This event class offers the ``getErrorMessage()`` method which returns the error message as a string (only in English and for debugging purposes, so don't show this to the user)

Both classes provide the ``$appId`` and ``$userId`` params that you initially passed to ``scheduleFileTranscription`` via ``getAppId()`` and ``getUserId()`` as well as ``getFileId()`` and ``getFile()`` to access the media file that was transcribed.


For example, in your ``lib/AppInfo/Application.php`` file:

.. code-block:: php

    $context->registerEventListener(OCP\SpeechToText\Events\TranscriptionSuccessfulEvent::class, MyTranscriptionListener::class);
    $context->registerEventListener(OCP\SpeechToText\Events\TranscriptionFailedEvent::class, MyTranscriptionListener::class);

The corresponding ``MyReferenceListener`` class can look like:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Listener;

    use OCA\MyApp\AppInfo\Application;
    use OCP\SpeechToText\Events\AbstractTranscriptionEvent;
    use OCP\SpeechToText\Events\TranscriptionSuccessfulEvent;
    use OCP\SpeechToText\Events\TranscriptionFailedEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    class MyTranscriptionListener implements IEventListener {
        public function handle(Event $event): void {
            if (!$event instanceof AbstractTranscriptionEvent || $event->getAppId() !== Application::APP_ID) {
                return;
            }

            if ($event instanceof TranscriptionSuccessfulEvent) {
                $transcript = $event->getTranscript();
                // store $transcript somewhere
            }

            if ($event instanceof TranscriptionFailedEvent) {
                $error = $event->getErrorMessage();
                $userId = $event->getUserId();
                // Notify relevant user about failure
            }
        }
    }


Implementing a Speech-To-Text provider
--------------------------------------

A **Speech-To-Text provider** is a class that implements the interface ``OCP\SpeechToText\ISpeechToTextProvider``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\SpeechToText;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\SpeechToText\ISpeechToTextProvider;
    use OCP\IL10N;

    class Provider implements ISpeechToTextProvider {

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome speech to text provider');
        }

        public function transcribeFile(File $file): string {
            // transcribe file here and return transcript
        }
    }

The method ``getName`` returns a string to identify the registered provider in the user interface.

The method ``transcribeFile`` transcribes the passed file and returns the transcript. In case transcription fails, you should throw a ``RuntimeException`` with an explanatory error message.

The class would typically be saved into a file in ``lib/SpeechToText`` of your app but you are free to put it elsewhere as long as it's loadable by Nextcloud's :ref:`dependency injection container<dependency-injection>`.

Provider with user context
--------------------------

.. versionadded:: 29.0.0

Sometimes the processing of a the task may depend upon which user requested the task.
You can now obtain this information in your provider by additionally implementing the ``OCP\SpeechToText\ISpeechToTextProviderWithUserId`` interface:

.. code-block:: php
    :emphasize-lines: 9,12,14,25,26,27

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\SpeechToText;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\SpeechToText\ISpeechToTextProviderWithUserId;
    use OCP\IL10N;

    class Provider implements ISpeechToTextProviderWithUserId {

        private ?string $userId = null;

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome speech to text provider');
        }

        public function setUserId(?string $userId): void {
            $this->userId = $userId;
        }

        public function transcribeFile(File $file): string {
            // transcribe file here with the use of $this->userId context and return transcript
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

    use OCA\MyApp\SpeechToText\Provider;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerSpeechToTextProvider(Provider::class);
        }

        public function boot(IBootContext $context): void {}

    }
