Runtime configuration
=====================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

The App Framework assembles the application by using an Inversion of Control container which does :doc:`../general/dependencyinjection`. Dependency Injection helps you to create testable code. For a very simple and good Tutorial, watch the `Dependency Injection and the art of Services and Containers Tutorial on YouTube<http://www.youtube.com/watch?v=DcNtg4_i-2w>`_ A broader overview over how it works and what the benefits are can be seen on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

The container is configured in :file:`dependencyinjection/dicontainer.php`. By default `Pimple <http://pimple.sensiolabs.org/>`_ is used as dependency injection container. A `tutorial can be found here <http://jtreminio.com/2012/10/an-introduction-to-pimple-and-service-containers/>`_


To add your own classes simply open the :file:`dependencyinjection/dicontainer.php` and add a line like this to the constructor:

.. code-block:: php

  <?php

  class DIContainer extends OCA\AppFramework\DependencyInjection\DIContainer {

      public function __construct(){
          // tell parent container about the app name
          parent::__construct('myapp');

          $this['MyClass'] = function($c){
              return new MyClass($c['SomeOtherClass']);
          };
      }
  }

You can also inject and overwrite already existing items from the App Framework.

The App Framework lets you inject/overwrite the following items:

* **API**: The API layer. Overwrite this if you use an API layer that inherited from the App Framework API layer and provides additional methods.
* **Request**: The Request object which holds the $_POST, $_GET, etc. variables
* **TwigTemplateDirectory**: If set to the template directory, Twig templates can be used.
* **TwigTemplateCacheDirectory**: Set this to enable caching for Twig templates
* **MiddlewareDispatcher**: Can be used to :doc:`add aditional middleware <middleware>`


API abstraction layer
=====================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

ownCloud currently has a ton of static methods which is a very bad thing concerning testability. Therefore the App Framework comes with an :php:class:`OCA\\AppFramework\\Core\\API` abstraction layer (basically a `facade <http://en.wikipedia.org/wiki/Facade_pattern>`_) which wraps the static method calls inside an object.

.. note:: This is a temporary solution until ownCloud offers a proper API with normal classes that can be used in the DIContainer.

This will allow you to easily mock the API in your unittests.

Extend the API
--------------
If you find yourself in need to use more ownCloud internal static methods simply inherit from the API class:

:file:`core/api.php`

.. code-block:: php

  <?php

  namespace MyApp\Core;

  class API extends \OCA\AppFramework\Core\API {

      public function __construct($appName){
          parent::__construct($appName);
      }


      public function methodName($someParam){
         \OCP\Util::methodName($this->appName, $someParam);
      }

  }

and wire it up in the container:

:file:`dependencyinjection/dicontainer.php`

.. code-block:: php

  <?php

  use \OCA\MyApp\Core\API;

  class DIContainer extends OCA\AppFramework\DependencyInjection\DIContainer {

      public function __construct(){
          // tell parent container about the app name
          parent::__construct('myapp');

          $this['API'] = $this->share(function($c){
              return new API($c['AppName']);
          });
      }
  }
  ?>

