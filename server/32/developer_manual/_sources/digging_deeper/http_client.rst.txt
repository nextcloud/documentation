===========
HTTP Client
===========

Nextcloud comes with a simple HTTP client that can be used to send requests to other web servers. This client follows Nextcloud's configuration, security restrictions and proxy settings.

Acquiring a HTTP Client
-----------------------

HTTP client instances are built using the client service `factory <https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)>`_ ``IClientService``. The factory can be :ref:`injected<dependency-injection>` into any app class:

.. code-block:: php

    <?php

    use OCP\Http\Client\IClientService;

    class MyRemoteServerIntegration {
        private IClientService $clientService;
        public function __construct(IClientService $clientService) {
            $this->clientService = $clientService;
        }

        public function downloadNextcloudWebsite(): void {
            $client = $this->clientService->newClient();
            $response = $client->get('https://nextcloud.com');
            $body = $response->getBody();
        }
    }

HEAD request
------------

.. code-block:: php

    <?php

    $client = $this->clientService->newClient();
    $response = $client->head('https://nextcloud.com');
    $body = $response->getBody();


GET request
-----------

.. code-block:: php

    <?php

    $client = $this->clientService->newClient();
    $response = $client->get('https://nextcloud.com');
    $body = $response->getBody();

POST request
------------

.. code-block:: php

    <?php

    $client = $this->clientService->newClient();
    $response = $client->post('https://api.domain.tld/pizza', [
        'headers' => [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
            'toppings' => [
                'cheese',
                'pineapple',
            ],
        ])
    ]);
    $pizza = json_decode($response->getBody(), true);

PUT request
-----------

.. code-block:: php

    <?php

    $client = $this->clientService->newClient();
    $response = $client->put('https://api.domain.tld/pizza/42', [
        'headers' => [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
            'toppings' => [
                'cheese',
                'pineapple',
            ],
        ])
    ]);
    $pizza = json_decode($response->getBody(), true);

DELETE request
--------------

.. code-block:: php

    <?php

    $client = $this->clientService->newClient();
    $response = $client->delete('https://api.domain.tld/pizza/42');

OPTIONS request
---------------

.. code-block:: php

    <?php

    $client = $this->clientService->newClient();
    $response = $client->options('https://nextcloud.com');
    $status = $response->getStatusCode();
    $allHeaders = $response->getHeaders();
    $contentType = $response->getHeader('content-type');

Error handling
--------------

Errors are signaled with exceptions. Catch PHP's base ``Exception``.

.. code-block:: php

    <?php

    use Exception;

    $client = $this->clientService->newClient();
    try {
        $response = $client->options('https://nextcloud.com');
    } catch (\Exception $e) {
        // Handle the error
    }
