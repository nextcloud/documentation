.. _security:

========
Security
========

.. _programmatic-rate-limiting:

Rate Limiting
-------------

Rate limiting can be used to restrict how often someone can execute an operation in a defined time frame. For app framework controllers it is recommended to use rate limiting attributes.

Outside controllers, e.g. in DAV code, it's also possible to guard operations by :ref:`injecting<dependency-injection>` ``\OCP\Security\RateLimiting\ILimiter`` and registering requests *before* the operation:

.. code-block:: php
    :emphasize-lines: 13-21, 27-36

    <?php

    use OCP\Security\RateLimiting\ILimiter;

    class MyDavPlugin {
        private ILimiter $limiter;

        public function __construct(ILimiter $limiter) {
            $this->limiter = $limiter;
        }

        public function calledAnonymously(): void {
            try {
                $this->limiter->registerAnonRequest(
                    'my-dav-plugin-anon',
                    5, // Allow five executions …
                    60 * 60, // … per hour
                );
            } catch (IRateLimitExceededException $exception) {
                // Respond with a HTTP 429 error
            }

            // No rate limiting reached. Carry on.
        }

        public function calledByUser(IUser $user): void {
            try {
                $this->limiter->registerUserRequest(
                    'my-dav-plugin-user',
                    5, // Allow five executions …
                    60 * 60, // … per hour
                    $user
                );
            } catch (IRateLimitExceededException $exception) {
                // Respond with a HTTP 429 error
            }

            // No rate limiting reached. Carry on.
        }
    }

Remote Host Validation
----------------------

Nextcloud can help validating a remote host so that no internal infrastructure is contacted by user-provided host names or IPs. The validator ``\OCP\Security\IRemoteHostValidator`` can be :ref:`injected<dependency-injection>` into any app class:

.. code-block:: php

    <?php

    use OCP\Security\IRemoteHostValidator;

    class MyRemoteServerIntegration {
        private IRemoteHostValidator $hostValidator;

        public function __construct(IRemoteHostValidator $hostValidator) {
            $this->hostValidator = $hostValidator;
        }

        public function contactRemoteServer(string $hostname): void {
            if (!$this->hostValidator->isValid($hostname)) {
                // ABORT
            }

            // Contact the server
        }
    }

.. note:: Nextcloud's HTTP clients obtained from ``\OCP\Http\Client\IClientService`` have this validation built in so you don't have to check hosts of HTTP requests as long as you use this provided abstraction.

Trusted domain
----------------

In some cases it might be required that an app checks that a user given link is one of the current instance.
This is possible with the ``OCP\Security\ITrustedDomainHelper``:

.. code-block:: php

    <?php

    declare(strict_types=1);
    use OCP\Security\ITrustedDomainHelper;

    $helper = \OC::$server->get(ITrustedDomainHelper::class);

    // Compare a full URL example given
    $url = 'https://localhost/nextcloud/index.php/apps/files/';
    $helper->isTrustedUrl($url);

    // Compare a domain and port
    $domain = 'example.tld:8443';
    $helper->isTrustedDomain($domain);
