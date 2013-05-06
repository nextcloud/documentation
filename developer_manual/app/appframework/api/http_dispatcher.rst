Dispatcher
==========


Class to dispatch the request to the middleware disptacher


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: Dispatcher




  .. php:method:: __construct($protocol, $middlewareDispatcher)

    :param \\OCA\\AppFramework\\Http\\Http $protocol: the http protocol with contains all status headers
    :param \\OCA\\AppFramework\\Middleware\\MiddlewareDispatcher $middlewareDispatcher: the dispatcher which runs the middleware



  .. php:method:: dispatch($controller, $methodName)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller which will be called
    :param string $methodName: the method name which will be called onthe controller
    :returns array: $array[0] contains a string with the http main header,$array[1] contains headers in the form: $key => value, $array[2] containsthe response output


    Handles a request and calls the dispatcher on the controller


