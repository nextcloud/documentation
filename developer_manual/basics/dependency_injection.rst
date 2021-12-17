====================
Dependency injection
====================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The App Framework assembles the application by using a container based on the
software pattern `Dependency Injection <https://en.wikipedia.org/wiki/Dependency_injection>`_.
This makes the code easier to test and thus easier to maintain.

If you are unfamiliar with this pattern, watch the following video:

* `Google Clean Code Talks <https://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

.. _dependency-injection:

Dependency injection
--------------------

Dependency Injection sounds pretty complicated but it just means: Don't put
new dependencies in your constructor or methods but pass them in. So this:

.. code-block:: php

  <?php

  // without dependency injection
  class AuthorMapper {

    /** @var IDBConnection */
    private $db;

    public function __construct() {
      $this->db = new Db();
    }

  }

would turn into this by using Dependency Injection:

.. code-block:: php

  <?php

  use OCP\IDBConnection;

  // with dependency injection
  class AuthorMapper {

    /** @var IDBConnection */
    private $db;

    public function __construct(IDBConnection $db) {
      $this->db = $db;
    }

  }


Using a container
-----------------

.. note:: Please do use automatic dependency injection (see below). For most
    apps there is no need to register services manually.

Passing dependencies into the constructor rather than instantiating them in the
constructor has the following drawback: Every line in the source code where
**new AuthorMapper** is being used has to be changed, once a new constructor
argument is being added to it.

The solution for this particular problem is to limit the **new AuthorMapper** to
one file, the container. The container contains all the factories for creating
these objects and is configured in :file:`lib/AppInfo/Application.php`.

Nextcloud 20 and later uses the :ref:`PSR-11 standard <psr11>` for the container interface, so working
with the container might feel familiar if you've worked with other php applications
before that also adhere to the convention.

To add the app's classes simply open the :file:`lib/AppInfo/Application.php` and
use the **registerService** method on the container object:

.. code-block:: php

  <?php

  namespace OCA\MyApp\AppInfo;

  use OCP\AppFramework\App;

  use OCA\MyApp\Controller\AuthorController;
  use OCA\MyApp\Service\AuthorService;
  use OCA\MyApp\Db\AuthorMapper;
  use Psr\Container\ContainerInterface;

  class Application extends App {


    /**
     * Define your dependencies in here
     */
    public function __construct(array $urlParams=array()){
      parent::__construct('myapp', $urlParams);

      $container = $this->getContainer();

      /**
       * Controllers
       */
      $container->registerService('AuthorController', function(ContainerInterface $c){
        return new AuthorController(
          $c->get('AppName'),
          $c->get('Request'),
          $c->get('AuthorService')
        );
      });

      /**
       * Services
       */
      $container->registerService('AuthorService', function(ContainerInterface $c){
        return new AuthorService(
          $c->get('AuthorMapper')
        );
      });

      /**
       * Mappers
       */
      $container->registerService('AuthorMapper', function(ContainerInterface $c){
        return new AuthorMapper(
          $c->get('ServerContainer')->getDatabaseConnection()
        );
      });
    }
  }

How the container works
-----------------------

The container works in the following way:

* :doc:`A request comes in and is matched against a route <routing>` (for the AuthorController in this case)
* The matched route queries **AuthorController** service from the container::

    return new AuthorController(
      $c->get('AppName'),
      $c->get('Request'),
      $c->get('AuthorService')
    );

* The **AppName** is queried and returned from the base class
* The **Request** is queried and returned from the server container
* **AuthorService** is queried::

    $container->registerService('AuthorService', function(ContainerInterface $c){
      return new AuthorService(
        $c->get('AuthorMapper')
      );
    });

* **AuthorMapper** is queried::

    $container->registerService('AuthorMappers', function(ContainerInterface $c){
      return new AuthorService(
        $c->get('ServerContainer')->getDatabaseConnection()
      );
    });

* The **database connection** is returned from the server container
* Now **AuthorMapper** has all of its dependencies and the object is returned
* **AuthorService** gets the **AuthorMapper** and returns the object
* **AuthorController** gets the **AuthorService** and finally the controller can be instantiated and the object is returned

So basically the container is used as a giant factory to build all the classes that are needed for the application. Because it centralizes all the creation of objects (the **new Class()** lines), it is very easy to add new constructor parameters without breaking existing code: only the **__construct** method and the container line where the **new** is being called need to be changed.


Use automatic dependency assembly (recommended)
-----------------------------------------------

In Nextcloud it is possible to build classes and their dependencies without having to explicitly register them on the container, as long as the container can `reflect <https://www.php.net/manual/en/book.reflection.php>`_ the constructor and look up the parameters by their type. This concept is widely known as *auto-wiring*.

How does auto-wiring work
^^^^^^^^^^^^^^^^^^^^^^^^^

Automatic assembly creates new instances of classes just by looking at the class name and its constructor parameters. For each constructor parameter the type or the argument name is used to query the container, e.g.:

* **SomeType $type** will use **$container->get('SomeType')**
* **$variable** will use **$container->get('variable')**

If all constructor parameters are resolved, the class will be created, saved as a service and returned.

So basically the following is now possible:

.. code-block:: php

  <?php
  namespace OCA\MyApp;

  class MyTestClass {}

  class MyTestClass2 {
      public $class;
      public $appName;

      public function __construct(MyTestClass $class, $AppName) {
          $this->class = $class;
          $this->appName = $AppName;
      }
  }

  $app = new \OCP\AppFramework\App('myapp');

  $class2 = $app->getContainer()->get(MyTestClass2::class);

  $class2 instanceof MyTestClass2;  // true
  $class2->class instanceof MyTestClass;  // true
  $class2->appName === 'myname';  // true
  $class2 === $app->getContainer()->get(MyTestClass2:class);  // true

.. note:: $AppName is resolved because the container registered a parameter under the key 'AppName' which will return the app id. The lookup is case sensitive so while $AppName will work correctly, using $appName as a constructor parameter will fail.

How does it affect the request lifecycle
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* A request comes in
* All apps' **routes.php** files are loaded

  * If a **routes.php** file returns an array, and an **appname/lib/AppInfo/Application.php** exists, include it, create a new instance of **\\OCA\\AppName\\AppInfo\\Application.php** and register the routes on it. That way a container can be used while still benefitting from the new routes behavior
  * If a **routes.php** file returns an array, but there is no **appname/lib/AppInfo/Application.php**, create a new \\OCP\\AppFramework\\App instance with the app id and register the routes on it

* A request is matched for the route, e.g. with the name **page#index**
* The appropriate container is being queried for the entry PageController (to keep backwards compatibility)
* If the entry does not exist, the container is queried for OCA\\AppName\\Controller\\PageController and if no entry exists, the container tries to create the class by using `reflection`_ on its constructor parameters

How does this affect controllers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The only thing that needs to be done to add a route and a controller method is now:

**myapp/appinfo/routes.php**

.. code-block:: php

  <?php
  return ['routes' => [
      ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
  ]];

**myapp/appinfo/lib/Controller/PageController.php**

.. code-block:: php

  <?php
  namespace OCA\MyApp\Controller;

  class PageController {
      public function __construct($AppName, \OCP\IRequest $request) {
          parent::__construct($AppName, $request);
      }

      public function index() {
          // your code here
      }
  }

There is no need to wire up anything in **lib/AppInfo/Application.php**. Everything will be done automatically.


How to deal with interface and primitive type parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Interfaces and primitive types can not be instantiated, so the container can not automatically assemble them. The actual implementation needs to be wired up in the container:

.. code-block:: php

  <?php

  namespace OCA\MyApp\AppInfo;

  class Application extends \OCP\AppFramework\App {

      /**
       * Define your dependencies in here
       */
      public function __construct(array $urlParams=array()){
          parent::__construct('myapp', $urlParams);

          $container = $this->getContainer();

          // AuthorMapper requires a location as string called $TableName
          $container->registerParameter('TableName', 'my_app_table');

          // the interface is called IAuthorMapper and AuthorMapper implements it
          $container->registerService('OCA\MyApp\Db\IAuthorMapper', function (ContainerInterface $c) {
              return $c->get('OCA\MyApp\Db\AuthorMapper');
          });
      }

  }

Predefined core services
^^^^^^^^^^^^^^^^^^^^^^^^

The following parameter names and type hints can be used to inject core services instead of using **$container->getServer()->getServiceX()**

Parameters:

* **AppName**: The app id
* **WebRoot**: The path to the Nextcloud installation
* **UserId**: The id of the current user

Types:

* **OCP\\IAppConfig**
* **OCP\\IAppManager**
* **OCP\\IAvatarManager**
* **OCP\\Activity\\IManager**
* **OCP\\ICache**
* **OCP\\ICacheFactory**
* **OCP\\IConfig**
* **OCP\\AppFramework\\Utility\\IControllerMethodReflector**
* **OCP\\Contacts\\IManager**
* **OCP\\IDateTimeZone**
* **OCP\\IDBConnection**
* **OCP\\Diagnostics\\IEventLogger**
* **OCP\\Diagnostics\\IQueryLogger**
* **OCP\\Files\\Config\\IMountProviderCollection**
* **OCP\\Files\\IRootFolder**
* **OCP\\IGroupManager**
* **OCP\\IL10N**
* **OCP\\ILogger**
* **OCP\\BackgroundJob\\IJobList**
* **OCP\\INavigationManager**
* **OCP\\IPreview**
* **OCP\\IRequest**
* **OCP\\AppFramework\\Utility\\ITimeFactory**
* **OCP\\ITagManager**
* **OCP\\ITempManager**
* **OCP\\Route\\IRouter**
* **OCP\\ISearch**
* **OCP\\ISearch**
* **OCP\\Security\\ICrypto**
* **OCP\\Security\\IHasher**
* **OCP\\Security\\ISecureRandom**
* **OCP\\IURLGenerator**
* **OCP\\IUserManager**
* **OCP\\IUserSession**

How to enable it
^^^^^^^^^^^^^^^^

To make use of this new feature, the following things have to be done:

* **appinfo/info.xml** requires to provide another field called **namespace** where the namespace of the app is defined. The required namespace is the one which comes after the top level namespace **OCA\\**, e.g.: for **OCA\\MyBeautifulApp\\Some\\OtherClass** the needed namespace would be **MyBeautifulApp** and would be added to the info.xml in the following way:

  .. code-block:: xml

    <?xml version="1.0"?>
    <info>
       <namespace>MyBeautifulApp</namespace>
       <!-- other options here ... -->
    </info>

* **appinfo/routes.php**: Instead of creating a new Application class instance, simply return the routes array like:

  .. code-block:: php

      <?php
      return ['routes' => [
          ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
      ]];


.. note:: A namespace tag is required because you can not deduce the namespace from the app id

Which classes should be added
-----------------------------

In general all of the app's controllers need to be registered inside the container. Then the following question is: What goes into the constructor of the controller? Pass everything into the controller constructor that matches one of the following criteria:

* It does I/O (database, write/read to files)
* It is a global (e.g. $_POST, etc. This is in the request class by the way)
* The output does not depend on the input variables (also called `impure function <https://en.wikipedia.org/wiki/Pure_function>`_), e.g. time, random number generator
* It is a service, basically it would make sense to swap it out for a different object

What not to inject:

* It is pure data and has methods that only act upon it (arrays, data objects)
* It is a `pure function <https://en.wikipedia.org/wiki/Pure_function>`_

.. _`reflection`: https://www.php.net/manual/en/book.reflection.php
