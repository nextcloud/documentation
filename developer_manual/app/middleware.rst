==========
Middleware
==========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Middleware is logic that is run before and after each request and is modelled after `Django's Middleware system <https://docs.djangoproject.com/en/dev/topics/http/middleware/>`_. It offers the following hooks:

* **beforeController**: This is executed before a controller method is being executed. This allows you to plug additional checks or logic before that method, like for instance security checks
* **afterException**: This is being run when either the beforeController method or the controller method itself is throwing an exception. The middleware is asked in reverse order to handle the exception and to return a response. If the middleware can't handle the exception, it throws the exception again
* **afterController**: This is being run after a successful controller method call and allows the manipulation of a Response object. The middleware is run in reverse order
* **beforeOutput**: This is being run after the response object has been rendered and allows the manipulation of the outputted text. The middleware is run in reverse order

To generate your own middleware, simply inherit from the Middleware class and overwrite the methods that should be used.


.. code-block:: php

  <?php

  namespace OCA\MyApp\Middleware;

  use \OCP\AppFramework\Middleware;


  class CensorMiddleware extends Middleware {

      /**
       * this replaces "bad words" with "********" in the output
       */
      public function beforeOutput($controller, $methodName, $output){
          return str_replace('bad words', '********', $output);
      }

  }

The middleware can be registered in the :doc:`container` and added using the **registerMiddleware** method:

.. code-block:: php

  <?php

  namespace OCA\MyApp\AppInfo;

  use \OCP\AppFramework\App;

  use \OCA\MyApp\Middleware\CensorMiddleware;

  class MyApp extends App {

      /**
       * Define your dependencies in here
       */
      public function __construct(array $urlParams=array()){
          parent::__construct('myapp', $urlParams);
  
          $container = $this->getContainer();
  
          /**
           * Middleware
           */
          $container->registerService('CensorMiddleware', function($c){
              return new CensorMiddleware();
          });
      
          // executed in the order that it is registered
          $container->registerMiddleware('CensorMiddleware');
  
      }
  }


.. note::

  The order is important! The middleware that is registered first gets run first in the **beforeController** method. For all other hooks, the order is being reversed, meaning: if a middleware is registered first, it gets run last.


Parsing annotations 
===================
Sometimes it is useful to conditionally execute code before or after a controller method. This can be done by defining custom annotations. An example would be to add a custom authentication method or simply add an additional header to the response. To access the parsed annotations, inject the **ControllerMethodReflector** class:

.. code-block:: php

  <?php

  namespace OCA\MyApp\Middleware;

  use \OCP\AppFramework\Middleware;
  use \OCP\AppFramework\Utility\ControllerMethodReflector;
  use \OCP\IRequest;

  class HeaderMiddleware extends Middleware {

    private $reflector;

    public function __construct(ControllerMethodReflector $reflector) {
        $this->reflector = $reflector;
    }

    /**
     * Add custom header if @MyHeader is used
     */
    public function afterController($controller, $methodName, IResponse $response){
        if($this->reflector->hasAnnotation('MyHeader')) {
            $response->addHeader('My-Header', 3);
        }
        return $response;
    }

  }

Now adjust the container to inject the reflector:

.. code-block:: php

  <?php

  namespace OCA\MyApp\AppInfo;

  use \OCP\AppFramework\App;

  use \OCA\MyApp\Middleware\HeaderMiddleware;

  class MyApp extends App {

      /**
       * Define your dependencies in here
       */
      public function __construct(array $urlParams=array()){
          parent::__construct('myapp', $urlParams);
  
          $container = $this->getContainer();
  
          /**
           * Middleware
           */
          $container->registerService('HeaderMiddleware', function($c){
              return new HeaderMiddleware($c->query('ControllerMethodReflector'));
          });

          // executed in the order that it is registered
          $container->registerMiddleware('HeaderMiddleware');
      }

  }

.. note:: An annotation always starts with an uppercase letter
