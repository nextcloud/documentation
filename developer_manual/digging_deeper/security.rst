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
--------------

In some cases it might be required that an app checks that a user given link is one of the current instance.
This is possible with the ``OCP\Security\ITrustedDomainHelper``. Inject it into your class instead of using the private ``\OC::$server`` API:

.. code-block:: php

    <?php

    declare(strict_types=1);

    use OCP\Security\ITrustedDomainHelper;

    class MyLinkChecker {
        public function __construct(
            private ITrustedDomainHelper $trustedDomainHelper,
        ) {
        }

        public function isInstanceLink(string $url): bool {
            return $this->trustedDomainHelper->isTrustedUrl($url);
        }

        public function isInstanceDomain(string $domain): bool {
            // Compare a domain and optional port, e.g. example.tld:8443
            return $this->trustedDomainHelper->isTrustedDomain($domain);
        }
    }

Cryptography helpers
--------------------

Nextcloud provides public cryptography helpers that apps should :ref:`inject<dependency-injection>` rather than calling PHP's low-level crypto or hashing functions directly.

``ICrypto`` encrypts and decrypts strings with AES-CBC and an HMAC (Encrypt-Then-MAC). When no password is passed, the instance ``secret`` from ``config.php`` is used:

.. code-block:: php

    <?php

    use OCP\Security\ICrypto;

    class MySecretStore {
        public function __construct(
            private ICrypto $crypto,
        ) {
        }

        public function store(string $plaintext): string {
            return $this->crypto->encrypt($plaintext);
        }

        public function load(string $ciphertext): string {
            return $this->crypto->decrypt($ciphertext);
        }
    }

``ISecureRandom`` generates cryptographically secure random strings (tokens, passwords, nonces):

.. code-block:: php

    <?php

    use OCP\Security\ISecureRandom;

    class MyTokenFactory {
        public function __construct(
            private ISecureRandom $secureRandom,
        ) {
        }

        public function createToken(): string {
            return $this->secureRandom->generate(
                32,
                ISecureRandom::CHAR_ALPHANUMERIC,
            );
        }
    }

``IHasher`` hashes and verifies passwords (or similar secrets) with a versioned format that supports future algorithm upgrades:

.. code-block:: php

    <?php

    use OCP\Security\IHasher;

    class MyPasswordStore {
        public function __construct(
            private IHasher $hasher,
        ) {
        }

        public function hash(string $password): string {
            return $this->hasher->hash($password);
        }

        public function verify(string $password, string $hash, ?string &$newHash = null): bool {
            return $this->hasher->verify($password, $hash, $newHash);
        }
    }

Deserialization
---------------

Never call ``unserialize()`` on data that can be influenced by a user (request bodies, file contents, database values written from user input, etc.). PHP object injection via ``unserialize()`` can lead to remote code execution.

Prefer JSON for structured data:

.. code-block:: php

    <?php

    // Safe: decode into arrays / scalars only
    $data = json_decode($userProvidedJson, true, 512, JSON_THROW_ON_ERROR);

    // Unsafe — do not do this with user-influenced input:
    // $data = unserialize($userProvidedPayload);

CSV and spreadsheet export
--------------------------

When exporting user-influenced values to CSV (or similar spreadsheet formats), cells that start with ``=``, ``+``, ``-``, or ``@`` can be interpreted as formulas by Excel, LibreOffice Calc, and similar tools (formula / CSV injection).

Neutralise those cells before writing them — for example by prefixing a single quote, which spreadsheets treat as a text marker:

.. code-block:: php

    <?php

    function neutralizeCsvCell(string $value): string {
        if ($value !== '' && str_contains('=+-@', $value[0])) {
            return "'" . $value;
        }
        return $value;
    }

    // Then write neutralizeCsvCell($cell) for every exported field.
