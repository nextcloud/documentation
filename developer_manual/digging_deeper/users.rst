===============
User management
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
--------------

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
---------------

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

User session information
------------------------

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

User objects
------------

User objects can be acquired from the ``IUserManager::get`` method.

.. code-block:: php
    :caption: lib/Service/UserService.php
    :emphasize-lines: 17

    <?php

    namespace OCA\MyApp\Service;

    use OCP\IUser;
    use OCP\IUserManager;

    class UserService {
        private IUserManager $userManager;

        public function __construct(IUserManager $userManager) {
            $this->userManager = $userManager;
        }

        public function foo(string $userId): void {
            /** @var IUser|null $user */
            $user = $this->userManager->get($userId);
            if ($user !== null) {
                // User exists
            } else {
                // The user does not exist
            }
        }
    }

User managers
^^^^^^^^^^^^^

.. versionadded:: 27

Nextcloud users can be defined as managers of other users. This is an informational property and has no influence on authorization. A user manager is not to confuse with admins or sub admins.

.. code-block:: php
    :caption: lib/Service/UserService.php
    :emphasize-lines: 22, 29-31

    <?php

    namespace OCA\MyApp\Service;

    use OCP\IUser;
    use OCP\IUserManager;

    class UserService {
        private IUserManager $userManager;

        public function __construct(IUserManager $userManager) {
            $this->userManager = $userManager;
        }

        public function updateUserManagers(string $userId): void {
            /** @var IUser|null $user */
            $user = $this->userManager->get('user123');
            if ($user === null) {
                throw \InvalidArgumentException("User $userId does not exist");
            }

            $managerUids = $user->getManagerUids();
            // Turn UIDs into user objects
            $managers = array_map(function(string $uid) {
                return $this->userManager->get($uid);
            }, $managerUids));
            // Remove and managers that no longer exist as user
            $existingManagers = array_filter($managers);
            $user->setManagerUids(array_map(function(IUser $admin) {
                return $user->getUID();
            }, $existingManagers));
        }
    }
