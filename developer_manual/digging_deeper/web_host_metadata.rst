.. _web-host-metadata:

=================
Web Host Metadata
=================

`RFC6415`_ defines how web hosts can expose their metadata through resources. Starting with Nextcloud 21, it's possible to register handlers for HTTP requests to the ``.well-known/*`` route.

Writing a handler
-----------------

A well known handler is a simple class that implements the ``\OCP\Http\WellKnown\IHandler`` interface.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Http\WellKnown;

    class Handler implements IHandler {

        public function handle(string $service, IRequestContext $context, ?IResponse $previousResponse): ?IResponse {
            // the handler-specific logic
        }

    }

The basic concept is that every handler will be called consecutively. A handler can react to the request and return a new response object or modify the one of the previous handler. The first handler will get a ``$previousResponse`` of null. The second handler gets whatever the first handler returned, so either ``null`` or an instance of ``\OCP\Http\WellKnown\IResponse``.


Example generic handler
^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Http\WellKnown;

    use OCP\AppFramework\Http\JSONResponse;
    use OCP\Http\WellKnown\GenericResponse;
    use OCP\Http\WellKnown\IHandler;
    use OCP\Http\WellKnown\IRequestContext;
    use OCP\Http\WellKnown\IResponse;
    use OCP\IURLGenerator;

    class GenericHandler implements IHandler {

        public function handle(string $service, IRequestContext $context, ?IResponse $previousResponse): ?IResponse {
            if ($service !== 'nextcloudtest') {
                // Not relevant to this handler

                return $previousResponse;
            }

            return new GenericResponse(
                new JSONResponse(['message' => 'hello']),
            );
        }
    }


Example webfinger handler
^^^^^^^^^^^^^^^^^^^^^^^^^

The following example shows how an app could react to `RFC6415`_ webfinger requests:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Http\WellKnown;

    use OCP\Http\WellKnown\IHandler;
    use OCP\Http\WellKnown\IRequestContext;
    use OCP\Http\WellKnown\IResponse;
    use OCP\Http\WellKnown\JrdResponse;
    use OCP\IURLGenerator;

    class WebFingerHandler implements IHandler {

        /** @var IURLGenerator */
        private $urlGenerator;

        public function __construct(IURLGenerator $urlGenerator) {
            $this->urlGenerator = $urlGenerator;
        }

        public function handle(string $service, IRequestContext $context, ?IResponse $previousResponse): ?IResponse {
            if ($service !== 'webfinger') {
                // Not relevant to this handler

                return $previousResponse;
            }

            $subject = $context->getHttpRequest()->getParam('resource', '');
            $href = $this->urlGenerator->linkToRouteAbsolute('myapp.example.test');

            // Use the previous response and amend it, if possible
            $response = $previousResponse;
            if (!($response instanceof JrdResponse)) {
                // We override null or any other types
                $response = new JrdResponse($subject);
            }

            return $response->addLink('self', 'application/activity+json', $href);
        }
    }

Handler registration
--------------------

The handler class is registered via the :ref:`bootstrap mechanism<Bootstrapping>` of the ``Application`` class.

.. code-block:: php


    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\Http\WellKnown\Handler;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerWellKnownHandler(Handler::class);
        }

        public function boot(IBootContext $context): void {}

    }



.. _`RFC6415`: https://tools.ietf.org/html/rfc6415
.. _`RFC7033`: https://tools.ietf.org/html/rfc7033