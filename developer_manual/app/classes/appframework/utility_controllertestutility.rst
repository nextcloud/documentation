ControllerTestUtility
=====================


Simple utility class for testing controllers


.. php:namespace:: OCA\AppFramework\Utility
.. php:class:: ControllerTestUtility

  * **Abstract**




  .. php:method:: getAPIMock($apiClass='OCA\AppFramework\Core\API', $constructor=array('appname'))

    :param string $apiClass: the class inclusive namespace of the api that we                         want to use
    :param array $constructor: constructor parameters of the api class

    * **Protected**


    Boilerplate function for getting an API Mock class


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
