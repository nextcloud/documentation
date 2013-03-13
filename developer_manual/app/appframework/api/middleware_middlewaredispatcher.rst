MiddlewareDispatcher
====================


This class is used to store and run all the middleware in correct order


.. php:namespace:: OCA\AppFramework\Middleware
.. php:class:: MiddlewareDispatcher




  .. php:method:: __construct()



    Constructor


  .. php:method:: registerMiddleware($middleware)

    :param \\OCA\\AppFramework\\Middleware\\Middleware $middleware: the middleware which will be added


    Adds a new middleware


  .. php:method:: getMiddlewares()

    :returns array: the middlewares


    returns an array with all middleware elements


  .. php:method:: beforeController($controller, $methodName)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller


    This is being run in normal order before the controller is beingcalled which allows several modifications and checks


  .. php:method:: afterException($controller, $methodName, $exception)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                           the controller
    :param \\Exception $exception: the thrown exception
    :returns \\OCA\\AppFramework\\Http\\Response: a Response object or null in case that the exception could not behandled


    This is being run when either the beforeController method or thecontroller method itself is throwing an exception.
    The middleware is askedin reverse order to handle the exception and to return a response.If the response is null, it is assumed that the exception could not behandled and the error will be thrown again


  .. php:method:: afterController($controller, $methodName, $response)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                           the controller
    :param \\OCA\\AppFramework\\Http\\Response $response: the generated response from the controller
    :returns \\OCA\\AppFramework\\Http\\Response: a Response object


    This is being run after a successful controllermethod call and allowsthe manipulation of a Response object.
    The middleware is run in reverse order


  .. php:method:: beforeOutput($controller, $methodName, $output)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller
    :param string $output: the generated output from a response
    :returns string: the output that should be printed


    This is being run after the response object has been rendered andallows the manipulation of the output.
    The middleware is run in reverse order
