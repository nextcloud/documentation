TestUtility
===========


Simple utility class for testing anything using an api


.. php:namespace:: OCA\AppFramework\Utility
.. php:class:: TestUtility

  * **Abstract**




  .. php:method:: getAPIMock($apiClass='OCA\AppFramework\Core\API', $constructor=array('appname'))

    :param string $apiClass: the class inclusive namespace of the api that we                         want to use
    :param array $constructor: constructor parameters of the api class

    * **Protected**


    Boilerplate function for getting an API Mock class


