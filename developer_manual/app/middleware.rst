Middleware
==========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>


Middleware is logic that is run before and after each request. It offers the following hooks:

* **beforeController**: This is executed before a controller method is being executed. This allows you to plug additional checks or logic before that method, like for instance security checks
* **afterException**: This is being run when either the beforeController method or the controller method itself is throwing an exception. The middleware is asked in reverse order to handle the exception and to return a response. If the response is null, it is assumed that the exception could not be handled and the error will be thrown again
* **afterController**: This is being run after a successful controllermethod call and allows the manipulation of a Response object. The middleware is run in reverse order
* **beforeOutput**: This is being run after the response object has been rendered and allows the manipulation of the outputted text. The middleware is run in reverse order

To generate your own middleware, simply inherit from the Middleware class :php:class:`OCA\\AppFramework\\Middleware\\Middleware`: and overwrite the methods that you want to use.


.. code-block:: php

  <?php

  use \OCA\AppFramework\Middleware\Middleware;


  class CensorMiddleware extends Middleware {

    private $api;

    /**
     * @param API $api: an instance of the api
     */
    public function __construct($api){
      $this->api = $api;
    }


    /**
     * @brief this replaces "fuck" with "****"" in the output
     */
    public function beforeOutput($controller, $methodName, $output){
      return str_replace($output, 'fuck', '****');
    }

  }

To activate the middleware, you have to overwrite the :php:class:`OCA\\AppFramework\\Middleware\\MiddlewareDispatcher`: in the DIContainer constructor:

.. note:: If you ship your own middleware, be sure to also enable the existing ones if you overwrite the MiddlewareDispatcher in the Dependency Injection Container!

.. code-block:: php

  <?php

    // in the constructor

    $this['CensorMiddleware'] = function($c){
      return new CensorMiddleware($c['API']);
    };

    $this['MiddlewareDispatcher'] = function($c){
      $dispatcher = new \OCA\AppFramework\Middleware\MiddlewareDispatcher();
      $dispatcher->registerMiddleware($c['SecurityMiddleware']);
      $dispatcher->registerMiddleware($c['CensorMiddleware']);
      return $dispatcher;
    };

.. note::

  The order is important! The middleware that is registered first gets run first in the beforeController method. For all other hooks, the order is being reversed, meaning: if something is defined first, it gets run last.