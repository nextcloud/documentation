=======
Logging
=======

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The logger is present by default in the container. The app that is logging is
set automatically. Nextcloud uses a :ref:`PSR3 <psr3>` logger.

The logger can be used in the following way:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use Psr\Log\LoggerInterface;

    class AuthorService {
        private LoggerInterface $logger;
        private string $appName;

        public function __construct(LoggerInterface $logger, string $appName){
            $this->logger = $logger;
            $this->appName = $appName;
        }

        public function log($message) {
            $this->logger->error($message, ['extra_context' => 'my extra context']);
        }
    }

In cases where you can not :ref:`inject <dependency-injection>` a logger into a class, you can use
the ``\OCP\Log\logger`` function to acquire a logger instance. As a first argument you need to pass
the app ID.

.. code-block:: php

    <?php

    use function OCP\Log\logger;

    logger('calendar')->warning('look, no dependency injection');

Admin audit logging
-------------------

If you want to log things less for system administration but for compliance reasons, e.g. who accessed which file,
who changed the password of an item or made it public, the
`admin audit log <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/logging_configuration.html#admin-audit-log>`_
is the correct place.

.. TODO ON RELEASE: Update version number above on release

You can easily add a log by simply emitting an ``OCP\Log\Audit\CriticalActionPerformedEvent`` event:

.. code-block:: php

    <?php

    $dispatcher = \OCP\Server::get(\OCP\EventDispatcher\IEventDispatcher::class);

    $event = new \OCP\Log\Audit\CriticalActionPerformedEvent(
        'My critical action for app %s',
        ['name' => 'My App ID']
    );
    $dispatcher->dispatchTyped($event);
