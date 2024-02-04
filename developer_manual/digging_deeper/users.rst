===============
User management
===============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Users can be managed using the IUserManager service that can be :ref:`injected<dependency-injection>`.

.. code-block:: php
    :caption: lib/Service/UserService.php
    :emphasize-lines: 8, 10-12

    <?php

    namespace OCA\MyApp\Service;

    use OCP\IUserManager;

    class UserService {
        private IUserManager $userManager;

        public function __construct(IUserManager $userManager){
            $this->userManager = $userManager;
        }

        public function createUser($userId, $password) {
            return $this->userManager->create($userId, $password);
        }
    }


Creating users
--------------

Creating a user is done by passing a username and password to the create method:

.. code-block:: php
    :caption: lib/Service/UserService.php
    :emphasize-lines: 13

    <?php

    namespace OCA\MyApp\Service;

    class UserService {
        private IUserManager $userManager;

        public function __construct(IUserManager $userManager){
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
    :emphasize-lines: 13

    <?php
    namespace OCA\MyApp\Service;

    class UserService {

        private IUserManager $userManager;

        public function __construct(IUserManager $userManager){
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

To login, logout or getting the currently logged in user, the IUserSession service that can be :ref:`injected<dependency-injection>`.

.. code-block:: php
    :caption: lib/Service/UserService.php

    <?php

    namespace OCA\MyApp\Service;

    use OCP\IUserSession;

    class UserService {
        private IUserSession $userSession;

        public function __construct(IUserSession $userSession){
            $this->userSession = $userSession;
        }
    }


Then users can be logged in and out by using:

.. code-block:: php
    :caption: lib/Service/UserService.php
    :emphasize-lines: 15,19

    <?php

    namespace OCA\MyApp\Service;

    use OCP\IUserSession;

    class UserService {
        private IUserSession $userSession;

        public function __construct(IUserSession $userSession){
            $this->userSession = $userSession;
        }

        public function login(string $userId, string $password): void {
            return $this->userSession->login($userId, $password);
        }

        public function logout(): void {
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
