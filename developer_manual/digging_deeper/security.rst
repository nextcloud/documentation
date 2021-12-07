.. _security:

========
Security
========

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
