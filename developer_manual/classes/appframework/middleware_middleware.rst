Middleware
==========


Middleware is used to provide hooks before or after controller methods and
deal with possible exceptions raised in the controller methods.
They're modeled after Django's middleware system:
https://docs.djangoproject.com/en/dev/topics/http/middleware/

.. php:namespace:: OCA\AppFramework\Middleware
.. php:class:: Middleware

  * **Abstract**




  .. php:method:: beforeController($controller, $methodName)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller


    This is being run in normal order before the controller is beingcalled which allows several modifications and checks


  .. php:method:: afterException($controller, $methodName, $exception)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller
    :param \\Exception $exception: the thrown exception
    :returns \\OCA\\AppFramework\\Http\\Response: a Response object or null in case that the exception could not be handled


    This is being run when either the beforeController method or thecontroller method itself is throwing an exception.
    The middleware isasked in reverse order to handle the exception and to return a response.If the response is null, it is assumed that the exception could not behandled and the error will be thrown again


  .. php:method:: afterController($controller, $methodName, $response)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller
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
