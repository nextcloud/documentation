.. _setup-checks:

============
Setup checks
============

Setup checks allow to test specific functionality of the server and report issues with configuration
early to the administrators to prevent run time issues.

One example for setup checks is the JavaScript Modules test that ensures the server is able to
serve ``.mjs`` files correctly, which is needed for apps that use modern JavaScript for their UI.
Any issue with the configuration would be reported to the administrator, either on the web interface (admin setting),
or when running the ``occ setupchecks`` command, before a user experience the issue.

Register a setup check
----------------------

Setup checks are registered within the registration context of the app bootstrap:

.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            // Other registration
            $context->registerSetupCheck(JavaScriptModules::class);
        }

        // ...

    }

Define a setup check
--------------------

Defining a custom setup check is done by simply implementing ``OCP\SetupCheck\SetupResult``,
for this example we will create a check that ensures the Nextcloud instance is not running in debug mode.

.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp\SetupChecks;

    use OCP\IConfig;
    use OCP\IL10N;
    use OCP\SetupCheck\ISetupCheck;
    use OCP\SetupCheck\SetupResult;

    class DebugModeSetupCheck implements ISetupCheck {
        public function __construct(
            private IL10N $l10n,
            private IConfig $config,
        ) {
        }

        public function getName(): string {
            return $this->l10n->t('Debug mode');
        }

        public function getCategory(): string {
            return 'system';
        }

        public function run(): SetupResult {
            if ($this->config->getSystemValueBool('debug', false)) {
                return SetupResult::warning($this->l10n->t('This instance is running in debug mode. Only enable this for local development and not in production environments.'));
            } else {
                return SetupResult::success($this->l10n->t('Debug mode is disabled.'));
            }
        }
    }


First it is required to provide a name, the name which should summarize the check and should be provided as a user visible, thus translated string.

.. code-block:: php

    public function getName(): string {
        // This is user visible and thus should be translated
        return $this->l10n->t('Debug mode');
    }


Setup checks are grouped by category, the category should be one of

- ``security``: Related to the security of the instance
- ``accounts``: Related to user accounts
- ``system``: System status Related
- Custom category: Will be merged into system. Examples for existing custom categories are  ``network`` and ``database``.

.. code-block:: php

    public function getCategory(): string {
        return 'system';
    }


The most important part is the ``run`` function.
This function should perform the test and report the result as a ``OCP\SetupCheck\SetupResult``.
Available severity level are:

- ``SetupResult::success``: Test succeeded no action needed.
- ``SetupResult::info``: No action required but it can not be guaranteed that the check passed (e.g. missing precondition for running the test).
- ``SetupResult::warning``: The test failed but the result is not fatal, yet the administrator should be warned about this.
- ``SetupResult::error``: The test failed and some functionality is not available or might be broken.

It is also possible to add a link to documentation to ease administrators solving the issue.
The link is simply passed as the second parameter to the ``SetupResult``.

Additionally it is also possible to use rich objects (``OCP\RichObjectStrings``) for formatting the message,
in this case the third parameter should contain the rich object parameters.

.. note::
    Please be aware that setup checks could be ran from both,
    the web frontend and from the CLI. Meaning they might use different ``php.ini`` files.

.. code-block:: php

    public function run(): SetupResult {
        if ($this->config->getSystemValueBool('debug', false)) {
            return SetupResult::warning($this->l10n->t('This instance is running in debug mode. Only enable this for local development and not in production environments.'));
        } else {
            return SetupResult::success($this->l10n->t('Debug mode is disabled.'));
        }
    }


Running HTTP requests against the server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

As mentioned in the initial example it is sometimes needed to run HTTP requests
for a setup check, to ensure configuration is working correctly.
To ease writing tests like that we provide the ``CheckServerResponseTrait`` trait.

The ``run`` function of the JavaScript modules setup check could look like:

.. code-block:: php

    public function run(): SetupResult {
        // This is a real existing file
        $testFile = $this->urlGenerator->linkTo('settings', 'js/esm-test.mjs');

        $noResponse = true;
        foreach ($this->runRequest('HEAD', $testFile) as $response) {
            $noResponse = false;
            if (preg_match('/(text|application)\/javascript/i', $response->getHeader('Content-Type'))) {
                return SetupResult::success();
            }
        }

        if ($noResponse) {
            return SetupResult::warning($this->l10n->t('Unable to run check for JavaScript support.') . "\n" . $this->serverConfigHelp());
        }
        return SetupResult::error($this->l10n->t('Your webserver does not serve `.mjs` files using the JavaScript MIME type. This will break some apps by preventing browsers from executing the JavaScript files.'));
    }

The ``runRequest`` is provided by the ``CheckServerResponseTrait``, it accepts a HTTP request method
as the first parameter (in this example ``HEAD``) and an URL with an absolute path, so meaning
the full path but no host set, like provided when using the URL generator. One example string would be ``nextcloud/apps/settings/js/esm-test.mjs``.
Internally the function requests that URL on all possible URLs (using the current host, the trusted domains and the cli overwrite URL),
and then yields a result for each request.

``CheckServerResponseTrait::serverConfigHelp`` provides information about
common pitfalls that prevent HTTP requests against the current server.
If no response is yielded from the ``runRequest`` method then this information should be included.
