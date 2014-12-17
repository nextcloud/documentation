=========
Container
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The App Framework assembles the application by using a container based on the software pattern `Dependency Injection <https://en.wikipedia.org/wiki/Dependency_injection>`_. This makes the code easier to test and thus easier to maintain.

If you are unfamiliar with this pattern, watch the following videos:

* `Dependency Injection and the art of Services and Containers Tutorial <http://www.youtube.com/watch?v=DcNtg4_i-2w>`_
* `Google Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

Dependency Injection
====================
Dependency Injection sounds pretty complicated but it just means: Don't new dependencies in your constructor or methods but pass them in. So this:

.. code-block:: php

  <?php

  // without dependency injection
  class AuthorMapper {

    private $db;

    public function __construct() {
      $this->db = new Db();
    }

  }

would turn into this by using Dependency Injection:

.. code-block:: php

  <?php

  // with dependency injection
  class AuthorMapper {

    private $db;

    public function __construct($db) {
      $this->db = $db;
    }

  }


Using a container
=================
Passing dependencies into the constructor rather than newing them in the constructor has the following drawback: Every line in the source code where **new AuthorMapper** is being used has to be changed, once a new constructor argument is being added to it.

The solution for this particular problem is to limit the **new AuthorMapper** to one file, the container. The container contains all the factories for creating these objects and is configured in :file:`appinfo/application.php`.


To add the app's classes simply open the :file:`appinfo/application.php` use the **registerService** method on the container object:

.. code-block:: php

  <?php

  namespace OCA\MyApp\AppInfo;

  use \OCP\AppFramework\App;

  use \OCA\MyApp\Controller\AuthorController;
  use \OCA\MyApp\Service\AuthorService;
  use \OCA\MyApp\Db\AuthorMapper;

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
      $container->registerService('AuthorController', function($c){
        return new AuthorController(
          $c->query('AppName'),
          $c->query('Request'),
          $c->query('AuthorService')
        );
      });

      /**
       * Services
       */
      $container->registerService('AuthorService', function($c){
        return new AuthorService(
          $c->query('AuthorMapper')
        );
      });

      /**
       * Services
       */
      $container->registerService('AuthorMapper', function($c){
        return new AuthorMapper(
          $c->query('ServerContainer')->getDb()
        );
      });
    }
  }

How the container works
=======================

The container works in the following way:

* :doc:`A request comes in and is matched against a route <request>` (for the AuthorController in this case)
* The matched route queries **AuthorController** service form the container::

    return new AuthorController(
      $c->query('AppName'),
      $c->query('Request'),
      $c->query('AuthorService')
    );

* The **AppName** is queried and returned from the baseclass
* The **Request** is queried and returned from the server container
* **AuthorService** is queried::

    $container->registerService('AuthorService', function($c){
      return new AuthorService(
        $c->query('AuthorMapper')
      );
    });

* **AuthorMapper** is queried::

    $container->registerService('AuthorMappers', function($c){
      return new AuthorService(
        $c->query('ServerContainer')->getDb()
      );
    });

* The **database connection** is returned from the server container
* Now **AuthorMapper** has all of its dependencies and the object is being returned
* **AuthorService** gets the **AuthorMapper** and returns the object
* **AuthorController** gets the **AuthorService** and finally the controller can be newed and the object is being returned

So basically the container is used as a giant factory to build all the classes that are needed for the application. Because it centralizes all the creation of objects (the **new Class()** lines), it is very easy to add new constructor parameters without breaking existing code: only the **__construct** method and the container line where the **new** is being called need to be changed.

Which classes should be added
=============================
In general all of the app's controllers need to be registered inside the container. Then following question is: What goes into the constructor of the controller? Pass everything into the controller constructor that is responsible matches one of the following criteria:

* It does I/O (database, write/read to files)
* It is a global (e.g. $_POST, etc. This is in the request class by the way)
* The output does not depend on the input variables (also called `impure function <http://en.wikipedia.org/wiki/Pure_function>`_), e.g. time, random number generator
* It is a service, basically it would make sense to swap it out for a different object

What not to inject:

* It is pure data and has methods that only act upon it (arrays, data objects)
* It is a `pure function <http://en.wikipedia.org/wiki/Pure_function>`_
