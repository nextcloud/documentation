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
