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
