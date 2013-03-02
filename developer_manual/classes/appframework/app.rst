App
===


Entry point for every request in your app.
You can consider this as your
public static void main() method

Handles all the dependency injection, controllers and output flow

.. php:namespace:: OCA\AppFramework
.. php:class:: App




  .. php:staticmethod:: App::main($controllerName, $methodName, $urlParams, $container)

    :param string $controllerName: the name of the controller under which it is                              stored in the DI container
    :param string $methodName: the method that you want to call
    :param array $urlParams: an array with variables extracted from the routes
    :param \\Pimple $container: an instance of a pimple container.


    Shortcut for calling a controller method and printing the result
