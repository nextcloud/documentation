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

  use OCP\IDBConnection;

  // without dependency injection
  class AuthorMapper {
    private IDBConnection $db;

    public function __construct() {
      $this->db = new Db();
    }
  }

would turn into this by using Dependency Injection:

.. code-block:: php

  use OCP\IDBConnection;

  // with dependency injection
  class AuthorMapper {
    private IDBConnection $db;

    public function __construct(IDBConnection $db) {
      $this->db = $db;
    }
  }

Controller injection
--------------------

For controllers it's possible to also have dependencies injected into methods.

.. code-block:: php
  :caption: lib/Controller/ApiController.php
  :emphasize-lines: 12-13, 16-17

  <?php

  namespace OCA\MyApp\Controller;

  use OCP\IRequest;

  class ApiController {
      public function __construct($appName, IRequest $request) {
          parent::__construct($appName, $request);
      }

      public function foo(FooService $service) {
          $service->foo();
      }

      public function bar(BarService $service) {
          $service->bar();
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
use the **IRegistrationContext::registerService** method:

.. code-block:: php

  <?php

  namespace OCA\MyApp\AppInfo;

  use OCP\AppFramework\App;
  use OCP\AppFramework\Bootstrap\IBootstrap;
  use OCP\AppFramework\Bootstrap\IBootContext;
  use OCP\AppFramework\Bootstrap\IRegistrationContext;
  use OCP\IDBConnection;

  use OCA\MyApp\Controller\AuthorController;
  use OCA\MyApp\Service\AuthorService;
  use OCA\MyApp\Db\AuthorMapper;
  use Psr\Container\ContainerInterface;

  class Application extends App implements IBootstrap {

    public function __construct(array $urlParams = []){
      parent::__construct('myapp', $urlParams);
    }

    public boot(IBootContext $context): void {
      // ...
    }

    /**
     * Define your dependencies in here
     */
    public function register(IRegistrationContext $context): void {
      /**
       * Controllers
       */
      $context->registerService(AuthorController::class, function(ContainerInterface $c): AuthorController {
        return new AuthorController(
          $c->get('appName'),
          $c->get(Request::class),
          $c->get(AuthorService::class)
        );
      });

      /**
       * Services
       */
      $context->registerService(AuthorService::class, function(ContainerInterface $c): AuthorService {
        return new AuthorService(
          $c->get(AuthorMapper::class)
        );
      });

      /**
       * Mappers
       */
      $context->registerService(AuthorMapper::class, function(ContainerInterface $c): AuthorMapper {
        return new AuthorMapper(
          $c->get(IDBConnection::class)
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
      $c->get('appName'),
      $c->get(Request::class),
      $c->get(AuthorService::class)
    );

* The **appName** is queried and returned from the base class
* The **Request** is queried and returned from the server container
* **AuthorService** is queried::

    $container->registerService(AuthorService::class, function(ContainerInterface $c): AuthorService {
      return new AuthorService(
        $c->get(AuthorMapper::class)
      );
    });

* **AuthorMapper** is queried::

    $container->registerService(AuthorMappers::class, function(ContainerInterface $c): AuthorMapper {
      return new AuthorService(
        $c->get(IDBConnection::class)
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

* **SomeType $type** will use **$container->get(SomeType::class)**
* **$variable** will use **$container->get('variable')**

If all constructor parameters are resolved, the class will be created, saved as a service and returned.

So basically the following is now possible:

.. code-block:: php

  <?php
  namespace OCA\MyApp;

  class MyTestClass {}

  class MyTestClass2 {
      public MyTestClass $class;
      public string $appName;

      public function __construct(MyTestClass $class, string $appName) {
          $this->class = $class;
          $this->appName = $appName;
      }
  }

  $app = new \OCP\AppFramework\App('myapp');

  $class2 = $app->getContainer()->get(MyTestClass2::class);

  $class2 instanceof MyTestClass2;  // true
  $class2->class instanceof MyTestClass;  // true
  $class2->appName === 'myname';  // true
  $class2 === $app->getContainer()->get(MyTestClass2::class);  // true

.. note:: $appName is resolved because the container registered a parameter under the key 'appName' which will return the app id.

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

  use OCP\IRequest;

  class PageController {
      public function __construct($appName, IRequest $request) {
          parent::__construct($appName, $request);
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

  use OCA\MyApp\Db\AuthorMapper;
  use OCA\MyApp\Db\IAuthorMapper;

  use OCP\AppFramework\App;
  use OCP\AppFramework\Bootstrap\IBootstrap;
  use OCP\AppFramework\Bootstrap\IBootContext;
  use OCP\AppFramework\Bootstrap\IRegistrationContext;
  use Psr\Container\ContainerInterface;

  class Application extends App implements IBootstrap {

      public function __construct(array $urlParams = []){
          parent::__construct('myapp', $urlParams);
      }

      public boot(IBootContext $context): void {
          // ...
      }

      /**
       * Define your dependencies in here
       */
      public function register(IRegistrationContext $context): void {
          // AuthorMapper requires a location as string called $TableName
          $context->registerParameter('TableName', 'my_app_table');

          // the interface is called IAuthorMapper and AuthorMapper implements it
          $context->registerService(IAuthorMapper::class, function (ContainerInterface $c): AuthorMapper {
              return $c->get(AuthorMapper::class);
          });

          // Less verbose alternative
          $context->registerServiceAlias(IAuthorMapper::class, AuthorMapper::class);
      }

  }

Predefined core services
^^^^^^^^^^^^^^^^^^^^^^^^

The following parameter names and type hints can be used to inject core services instead of using **$container->getServer()->getServiceX()**

Parameters:

* **appName**: The app id
* **userId**: The id of the current user
* **webRoot**: The path to the Nextcloud installation

Aliases:

* **AppName**: resolves to ``appName`` (deprecated)
* **Request**: resolves to ``\OCP\IRequest``
* **ServerContainer**: resolves to ``\OCP\IServerContainer`` (deprecated)
* **UserId**: resolves to ``userId`` (deprecated)
* **WebRoot**: resolves to ``webRoot`` (deprecated)

Types:

* ``\OCP\IAppConfig``
* ``\OCP\IAppManager``
* ``\OCP\IAvatarManager``
* ``\OCP\Activity\IManager``
* ``\OCP\ICache``
* ``\OCP\ICacheFactory``
* ``\OCP\IConfig``
* ``\OCP\AppFramework\Utility\IControllerMethodReflector``
* ``\OCP\Contacts\IManager``
* ``\OCP\IDateTimeZone``
* ``\OCP\IDBConnection``
* ``\OCP\Diagnostics\IEventLogger``
* ``\OCP\Diagnostics\IQueryLogger``
* ``\OCP\Files\Config\IMountProviderCollection``
* ``\OCP\Files\IRootFolder``
* ``\OCP\IGroupManager``
* ``\OCP\IL10N``
* ``\OCP\BackgroundJob\IJobList``
* ``\OCP\INavigationManager``
* ``\OCP\IPreview``
* ``\OCP\IRequest``
* ``\OCP\AppFramework\Utility\ITimeFactory``
* ``\OCP\ITagManager``
* ``\OCP\ITempManager``
* ``\OCP\Route\IRouter``
* ``\OCP\ISearch``
* ``\OCP\Security\ICrypto``
* ``\OCP\Security\IHasher``
* ``\OCP\Security\ISecureRandom``
* ``\OCP\IURLGenerator``
* ``\OCP\IUserManager``
* ``\OCP\IUserSession``
* ``\Psr\Container\ContainerInterface``
* ``\Psr\Log\LoggerInterface``

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

Optional services
-----------------

.. versionadded:: 28

If an injected dependency can't be found or build, an exception is thrown. This can be avoided by using the a nullable type notation for a dependency:

.. code-block:: php
  :emphasize-lines: 6

  namespace OCA\MyApp\MyService;

  use Some\Service;

  class MyService {
    public function __construct(private ?Service $service) {
    }
  }

If ``\Some\Service`` exists and can be built, it will be injected. Else ``MyService`` will receive ``null``.

Accessing the container from anywhere
-------------------------------------

Sometimes it can be hard to inject some service inside legacy code, in these cases
you can use :code:`OCP\Server::get(MyService::class)`. This should only be used as
the last resort, as this makes your code more complicated to unit test and is
considered an anti-pattern.


