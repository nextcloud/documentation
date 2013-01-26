TwigMiddleware
==============


This template is used to add the possibility to add twig templates
By default it is only loaded when the templatepath is set


.. php:namespace:: OCA\AppFramework\Middleware\Twig
.. php:class:: TwigMiddleware




  .. php:method:: __construct($api, $twig)

    :param \\OCA\\AppFramework\\Core\\API $api: an instance of the api
    :param \\OCA\\AppFramework\\Middleware\\Twig\\Twig_Environment $twig: an instance of the twig environment


    Sets the twig loader instance


  .. php:method:: afterController($controller, $methodName, $response)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller
    :param \\OCA\\AppFramework\\Http\\Response $response: the generated response from the controller
    :returns \\OCA\\AppFramework\\Http\\Response: a Response object


    Swaps the template response with the twig response and stores if atemplate needs to be printed for the user or admin page


  .. php:method:: beforeOutput($controller, $methodName, $output)

    :param \\OCA\\AppFramework\\Controller\\Controller $controller: the controller that is being called
    :param string $methodName: the name of the method that will be called on                          the controller
    :param string $output: the generated output from a response
    :returns string: the output that should be printed


    In case the output is not rendered as blank page, we need to include theowncloud header and output
