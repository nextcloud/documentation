===============
User Management
===============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Users can be managed using the UserManager which is injected from the ServerContainer:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Service\UserService;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('UserService', function($c) {
                return new UserService(
                    $c->query('UserManager')
                );
            });

            $container->registerService('UserManager', function($c) {
                return $c->query('ServerContainer')->getUserManager();
            });
        }
    }



Creating users
==============
Creating a user is done by passing a username and password to the create method:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    class UserService {

        private $userManager;

        public function __construct($userManager){
            $this->userManager = $userManager;
        }

        public function create($userId, $password) {
            return $this->userManager->create($userId, $password);
        }

    }

Modifying users
===============
Users can be modified by getting a user by the userId or by a search pattern. The returned user objects can then be used to:

* Delete them
* Set a new password
* Disable/Enable them
* Get their home directory

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    class UserService {

        private $userManager;

        public function __construct($userManager){
            $this->userManager = $userManager;
        }

        public function delete($userId) {
            return $this->userManager->get($userId)->delete();
        }

        // recoveryPassword is used for the encryption app to recover the keys
        public function setPassword($userId, $password, $recoveryPassword) {
            return $this->userManager->get($userId)->setPassword($password, $recoveryPassword);
        }

        public function disable($userId) {
            return $this->userManager->get($userId)->setEnabled(false);
        }

        public function getHome($userId) {
            return $this->userManager->get($userId)->getHome();
        }
    }

User Session Information
========================
To login, logout or getting the currently logged in user, the UserSession has to be injected from the ServerContainer:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Service\UserService;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('UserService', function($c) {
                return new UserService(
                    $c->query('UserSession')
                );
            });

            $container->registerService('UserSession', function($c) {
                return $c->query('ServerContainer')->getUserSession();
            });

            // currently logged in user, userId can be gotten by calling the
            // getUID() method on it
            $container->registerService('User', function($c) {
                return $c->query('UserSession')->getUser();
            });
        }
    }


Then users can be logged in by using:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    class UserService {

        private $userSession;

        public function __construct($userSession){
            $this->userSession = $userSession;
        }

        public function login($userId, $password) {
            return $this->userSession->login($userId, $password);
        }

        public function logout() {
            $this->userSession->logout();
        }

    }

