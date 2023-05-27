=============
Configuration
=============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The config that allows the app to set global, app and user settings can be injected from the ServerContainer. All values are saved as strings and must be cast to the correct value.


.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use OCP\AppFramework\App;
    use OCP\IConfig;
    use OCP\IServerContainer;
    use OCA\MyApp\Service\AuthorService;

    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('AuthorService', function(IServerContainer $c): AuthorService {
                return new AuthorService(
                    $c->get(IConfig::class),
                    $c->get('appName')
                );
            });
        }
    }

System values
-------------

System values are saved in the :file:`config/config.php` and allow the app to modify and read the global configuration. Please note that ``setSystemValue`` might throw a ``OCP\HintException`` when the config file is read-only.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\HintException;
    use OCP\IConfig;

    class AuthorService {
        private IConfig $config;
        private string $appName;

        public function __construct(IConfig $config, string $appName){
            $this->config = $config;
            $this->appName = $appName;
        }

        public function getSystemValue(string $key) {
            return $this->config->getSystemValue($key);
        }

        public function setSystemValue(string $key, $value): void {
            try {
                $this->config->setSystemValue($key, $value);
            } catch (HintException $e) {
                // Handle exception, e.g. when config file is read-only
            }
        }
    }

.. note:: It's also possible to use ``getSystemValueBool``, ``getSystemValueString``, ``getSystemValueInt`` to get type hinted return values.

App values
----------

App values are saved in the database per app and are useful for setting global app settings:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\IConfig;

    class AuthorService {
        private IConfig $config;
        private string $appName;

        public function __construct(IConfig $config, string $appName){
            $this->config = $config;
            $this->appName = $appName;
        }

        public function getAppValue(string $key): string {
            return $this->config->getAppValue($this->appName, $key);
        }

        public function setAppValue(string $key, string $value): void {
            $this->config->setAppValue($this->appName, $key, $value);
        }
    }

User values
-----------

User values are saved in the database per user and app and are good for saving user specific app settings: 

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\IConfig;

    class AuthorService {
        private IConfig $config;
        private string $appName;

        public function __construct(IConfig $config, string $appName){
            $this->config = $config;
            $this->appName = $appName;
        }

        public function getUserValue(string $key, string $userId): string {
            return $this->config->getUserValue($userId, $this->appName, $key);
        }

        public function setUserValue(string $key, string $userId, string $value): void {
            $this->config->setUserValue($userId, $this->appName, $key, $value);
        }
    }
