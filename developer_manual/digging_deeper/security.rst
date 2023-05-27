.. _security:

========
Security
========

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
