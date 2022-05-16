=======
Logging
=======

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The logger is present by default in the container. The app that is logging is
set automatically.

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


The following methods are available:

* **emergency**
* **alert**
* **critical**
* **error**
* **warning**
* **notice**
* **info**
* **debug**
