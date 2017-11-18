=============
Configuration
=============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The config that allows the app to set global, app and user settings can be injected from the ServerContainer. All values are saved as strings and must be cast to the correct value.


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
                    $c->query('Config'),
                    $c->query('AppName')
                );
            });

            $container->registerService('Config', function($c) {
                return $c->query('ServerContainer')->getConfig();
            });
        }
    }

System values
-------------

System values are saved in the :file:`config/config.php` and allow the app to modify and read the global configuration: 

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use \OCP\IConfig;


    class AuthorService {

        private $config;
        private $appName;

        public function __construct(IConfig $config, $appName){
            $this->config = $config;
            $this->appName = $appName;
        }

        public function getSystemValue($key) {
            return $this->config->getSystemValue($key);
        }

        public function setSystemValue($key, $value) {
            $this->config->setSystemValue($key, $value);
        }

    }


App values
----------

App values are saved in the database per app and are useful for setting global app settings: 

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use \OCP\IConfig;


    class AuthorService {

        private $config;
        private $appName;

        public function __construct(IConfig $config, $appName){
            $this->config = $config;
            $this->appName = $appName;
        }

        public function getAppValue($key) {
            return $this->config->getAppValue($this->appName, $key);
        }

        public function setAppValue($key, $value) {
            $this->config->setAppValue($this->appName, $key, $value);
        }

    }

User values
-----------

User values are saved in the database per user and app and are good for saving user specific app settings: 

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use \OCP\IConfig;


    class AuthorService {

        private $config;
        private $appName;

        public function __construct(IConfig $config, $appName){
            $this->config = $config;
            $this->appName = $appName;
        }

        public function getUserValue($key, $userId) {
            return $this->config->getUserValue($userId, $this->appName, $key);
        }

        public function setUserValue($key, $userId, $value) {
            $this->config->setUserValue($userId, $this->appName, $key, $value);
        }

    }
