.. _translation:

===================
Machine Translation
===================

.. versionadded:: 26

.. deprecated:: 30
    Use the TaskProcessing API instead

Nextcloud offers a **Translation** API. The overall idea is that there is a central OCP API that apps can use to request machine translations of text. To be technology agnostic any app can provide this Translation functionality by registering a Translation provider.

Consuming the Translation API
-----------------------------

To consume the Translation API, you will need to :ref:`inject<dependency-injection>` ``\OCP\Translation\ITranslationManager``. This manager offers the following methods:

 * ``hasProviders()`` This method returns a boolean which indicates if any providers have been registered. If this is false you cannot use the Translation feature.
 * ``getLanguages()`` This method returns a list of ``OCP\Translation\LanguageTuple`` Objects which indicate which language pairs are currently supported for translation.
 * ``translate(string $text, ?string $fromLanguage, string $toLanguage)`` This method provides the actual translation functionality. Note that, depending on the length of the text you want to translate, this may take longer than the HTTP request timeout or the PHP execution time limit.
 * ``canDetectLanguage()`` This method returns a boolean indicating whether language auto-detection is possible. If this is true, you can pass ``null`` as a ``$fromLanguage`` parameter to ``translate`` and it will automatically figure out the source language.

If you would like to use the translation functionality in a client, there are also OCS endpoints available for this: :ref:`OCS Translation API<ocs-translation-api>`

Implementing a Translation provider
-----------------------------------

A **Translation provider** is a class that implements the interface ``OCP\Translation\ITranslationProvider``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Translation;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\Translation\ITranslationProvider;
    use OCP\IL10N;

    class Provider implements ITranslationProvider {

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome translation provider');
        }

        public function getAvailableLanguages(): array {
            // Return an array of OCP\Translation\LanguageTuple objects here
        }

        public function translate(?string $fromLanguage, string $toLanguage, string $text): string {
            // Do some fancy machine translation and return translated string
        }
    }

The method ``getName`` returns a string to identify the registered provider in the user interface.

The method ``translate`` translates the passed string and returns the translation. The two language parameters will be language codes that were returned by ``getAvailableLanguages`` of your provider. In case translation fails, you should throw a ``RuntimeException`` with an explanatory error message.

The class would typically be saved into a file in ``lib/Translation`` of your app but you are free to put it elsewhere as long as it's loadable by Nextcloud's :ref:`dependency injection container<dependency-injection>`.

Provider with user context
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. versionadded:: 29.0.0

Sometimes the processing of a the task may depend upon which user requested the task.
You can now obtain this information in your provider by additionally implementing the ``OCP\Translation\ITranslationProviderWithUserId`` interface:

.. code-block:: php
    :emphasize-lines: 9,12,14,29,30,31

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Translation;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\Translation\ITranslationProviderWithUserId;
    use OCP\IL10N;

    class Provider implements ITranslationProviderWithUserId {

        private ?string $userId = null;

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome translation provider');
        }

        public function getAvailableLanguages(): array {
            // Return an array of OCP\Translation\LanguageTuple objects here
        }

        public function setUserId(?string $userId): void {
            $this->userId = $userId;
        }

        public function translate(?string $fromLanguage, string $toLanguage, string $text): string {
            // Do some fancy machine translation and return translated string
        }
    }


Providing language detection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

There is also an ``IDetectLanguageProvider`` interface that allows specifying that your provider can auto-detect languages from text input. You can use this as follows:

.. code-block:: php
    :emphasize-lines: 13,32,33,34

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Translation;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Files\File;
    use OCP\Translation\ITranslationProvider;
    use OCP\Translation\IDetectLanguageProvider;
    use OCP\IL10N;

    class Provider implements ITranslationProvider, IDetectLanguageProvider {

        public function __construct(
            private IL10N $l,
        ) {
        }

        public function getName(): string {
            return $this->l->t('My awesome translation provider');
        }

        public function getAvailableLanguages(): array {
            // Return an array of OCP\Translation\LanguageTuple objects here
        }

        public function translate(?string $fromLanguage, string $toLanguage, string $text): string {
            // Do some fancy machine translation and return translated string
        }

        public function detectLanguage(string $text): ?string {
            // Detect the language of $text
        }
    }

The method ``detectLanguage`` takes a text in some language and outputs the code of that language, or ``null`` in case detection wasn't successful. The language code that this method returns should be one of the languages returned in ``getAvailableLanguages``.

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
            $context->registerTranslationProvider(Provider::class);
        }

        public function boot(IBootContext $context): void {}

    }
