=================================
User, Session & Cookie Management
=================================

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


Session Information
===================
To set, get or modify session variables, the Session has to be injected from the ServerContainer:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Service\SessionService;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('SessionService', function($c) {
                return new SessionService(
                    $c->query('Session'),
                    $c->query('TimeFactory')
                );
            });

            $container->registerService('Session', function($c) {
                return $c->query('ServerContainer')->getSession();
            });

        }
    }


Then session variables can be accessed like this:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use \OCP\ISession

    class SessionService {

        private $session;
        private $timeFactory;

        public function __construct(ISession $session, $timeFactory){
            $this->session = $session;
        }

        public function updateTimestamp() {
            $oldTime = 0;

            if (array_key_exists('timestamp', $this->session) {
                $oldTime = $this->session['timestamp'];
            }

            $newTime = $this->timeFactory->getTime();
            if ($newTime > $oldTime) {
                $this->session['timestamp'] = $newTime;
            }

        }

    }

Managing cookies
================
To set, get or modify cookies the `request` variable and the `response` class can be used from within controllers:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;
    use \OCP\AppFramework\Controller;
    use \OCP\IRequest;

    class BakeryController extends Controller {

        public function __construct($appName, IRequest $request) {
            parent::__construct($appName, $request);
        }


        /**
         * Gets the value of the cookie "bar"
         */
        public function getCookie() {
            $cookie = $this->request->getCookie('bar');
        }

        /**
         * Adds a cookie "foo" with value "bar" that expires after user closes the browser
         * Adds a cookie "bar" with value "foo" that expires 2015-01-01
         */
        public function addCookie() {
            $response = new TemplateResponse(...);
            $response->addCookie('foo', 'bar');
            $response->addCookie('bar', 'foo', new \DateTime('2015-01-01 00:00'));
            return $response;
        }

        /**
         * Invalidates the cookie "foo"
         * Invalidates the cookie "bar" and "bazinga"
         */
        public function invalidateCookie() {
            $response = new TemplateResponse(...);
            $response->invalidateCookie('foo');
            $response->invalidateCookies(array('bar', 'bazinga'));
            return $response;
        }
   }
