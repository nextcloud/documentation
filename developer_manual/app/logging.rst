=======
Logging
=======

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The logger can be injected from the ServerContainer:


.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Service\AuthorService;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('AuthorService', function($c) {
                return new AuthorService(
                    $c->query('Logger'),
                    $c->query('AppName')
                );
            });

            $container->registerService('Logger', function($c) {
                return $c->query('ServerContainer')->getLogger();
            });
        }
    }

and then be used in the following way:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use \OCP\ILogger;


    class AuthorService {

        private $logger;
        private $appName;

        public function __construct(ILogger $logger, $appName){
            $this->logger = $logger;
            $this->appName = $appName;
        }

        public function log($message) {
            $this->logger->error('hi', array('app' => $this->appName));
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