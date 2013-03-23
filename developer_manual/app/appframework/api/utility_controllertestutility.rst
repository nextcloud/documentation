ControllerTestUtility
=====================


Simple utility class for testing controllers


.. php:namespace:: OCA\AppFramework\Utility
.. php:class:: ControllerTestUtility

  * **Abstract**




  .. php:method:: assertAnnotations($controller, $method, $expected, $valid=array())

    :param \\OCA\\AppFramework\\Utility\\Controller/string $controller: name or instance of the controller
    :param mixed $method: 
    :param array $expected: an array containing the expected annotations
    :param array $valid: if you define your own annotations, pass them here

    * **Protected**


    Checks if a controllermethod has the expected annotations


  .. php:method:: assertHeaders($expected=array(), $response)

    :param array $expected: an array with the expected headers
    :param \\OCA\\AppFramework\\Http\\Response $response: the response which we want to test for headers

    * **Protected**


    Shortcut for testing expected headers of a response


  .. php:method:: getRequest($params)

    :param array $params: a hashmap with the parameters for request
    :returns \\OCA\\AppFramework\\Http\\Request: a request instance

    * **Protected**


    Instead of using positional parameters this function instantiatesa request by using a hashmap so its easier to only set specific params
