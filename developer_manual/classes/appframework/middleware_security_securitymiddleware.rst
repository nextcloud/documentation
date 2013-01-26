SecurityMiddleware
==================


Used to do all the authentication and checking stuff for a controller method
It reads out the annotations of a controller method and checks which if
security things should be checked and also handles errors in case a security
check fails


.. php:namespace:: OCA\AppFramework\Middleware\Security
.. php:class:: SecurityMiddleware




  .. php:method:: __construct($api)

    :param \\OCA\\AppFramework\\Core\\API $api: an instance of the api



  .. php:method:: beforeController($controller, $methodName)

    :param \\OCA\\AppFramework\\Middleware\\Security\\string/Controller $controller: the controllername or string
    :param string $methodName: the name of the method
    :throws \\OCA\\AppFramework\\Middleware\\Security\\SecurityException: when a security check fails


    This runs all the security checks before a method call.
    Thesecurity checks are determined by inspecting the controller methodannotations


  .. php:method:: afterException($controller, $methodName, $exception)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller
    :param \\Exception $exception: the thrown exception
    :returns \\OCA\\AppFramework\\Http\\Response: a Response object or null in case that the exception could not be handled


    If an SecurityException is being caught, ajax requests return a JSON errorresponse and non ajax requests redirect to the index
