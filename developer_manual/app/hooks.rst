=====
Hooks
=====

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Hooks are used to execute code before or after an event has occurred. This is for instance useful to run cleanup code after users, groups or files have been deleted. Hooks should be registered in the :doc:`app.php <init>`:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    $app = new Application();
    $app->getContainer()->query('UserHooks')->register();

The hook logic should be in a separate class that is being registered in the :doc:`container`:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Hooks\UserHooks;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('UserHooks', function($c) {
                return new UserHooks(
                    $c->query('ServerContainer')->getUserManager()
                );
            });
        }
    }

.. code-block:: php

    <?php
    namespace OCA\MyApp\Hooks;
    use OCP\IUserManager;

    class UserHooks {

        private $userManager;

        public function __construct(IUserManager $userManager){
            $this->userManager = $userManager;
        }

        public function register() {
            $callback = function($user) {
                // your code that executes before $user is deleted
            };
            $this->userManager->listen('\OC\User', 'preDelete', $callback);
        }

    }

Available hooks
===============
The scope is the first parameter that is passed to the **listen** method, the second parameter is the method and the third one the callback that should be executed once the hook is being called, e.g.:

.. code-block:: php

    <?php
    
    // listen on user predelete
    $callback = function($user) {
        // your code that executes before $user is deleted
    };
    $userManager->listen('\OC\User', 'preDelete', $callback);


Hooks can also be removed by using the **removeListener** method on the object:

.. code-block:: php

    <?php
    
    // delete previous callback
    $userManager->removeListener(null, null, $callback);


The following hooks are available:

Session
-------
Injectable from the ServerContainer by calling the method **getUserSession()**. 

Hooks available in scope **\\OC\\User**:
 
* **preSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **postSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **changeUser** (\\OC\\User\\User $user, string $feature, string $value)
* **preDelete** (\\OC\\User\\User $user)
* **postDelete** (\\OC\\User\\User $user)
* **preCreateUser** (string $uid, string $password)
* **postCreateUser** (\\OC\\User\\User $user)
* **preLogin** (string $user, string $password)
* **postLogin** (\\OC\\User\\User $user, string $password)
* **logout** ()

UserManager
-----------
Injectable from the ServerContainer by calling the method **getUserManager()**. 

Hooks available in scope **\\OC\\User**:

* **preSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **postSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **preDelete** (\\OC\\User\\User $user)
* **postDelete** (\\OC\\User\\User $user)
* **preCreateUser** (string $uid, string $password)
* **postCreateUser** (\\OC\\User\\User $user, string $password)

GroupManager
------------
Hooks available in scope **\\OC\\Group**:

* **preAddUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **postAddUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **preRemoveUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **postRemoveUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **preDelete** (\\OC\\Group\\Group $group)
* **postDelete** (\\OC\\Group\\Group $group)
* **preCreate** (string $groupId)
* **postCreate** (\\OC\\Group\\Group $group)

Filesystem Root
---------------
Injectable from the ServerContainer by calling the method **getRootFolder()**, **getUserFolder()** or **getAppFolder()**.

Filesystem hooks available in scope **\\OC\\Files**:

* **preWrite** (\\OCP\\Files\\Node $node)
* **postWrite** (\\OCP\\Files\\Node $node)
* **preCreate** (\\OCP\\Files\\Node $node)
* **postCreate** (\\OCP\\Files\\Node $node)
* **preDelete** (\\OCP\\Files\\Node $node)
* **postDelete** (\\OCP\\Files\\Node $node)
* **preTouch** (\\OCP\\Files\\Node $node, int $mtime)
* **postTouch** (\\OCP\\Files\\Node $node)
* **preCopy** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)
* **postCopy** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)
* **preRename** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)
* **postRename** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)

Filesystem Scanner
------------------
Filesystem scanner hooks available in scope **\\OC\\Files\\Utils\\Scanner**:

* **scanFile** (string $absolutePath)
* **scanFolder** (string $absolutePath)
* **postScanFile** (string $absolutePath)
* **postScanFolder** (string $absolutePath)
