MapperTestUtility
=================


Simple utility class for testing mappers


.. php:namespace:: OCA\AppFramework\Utility
.. php:class:: MapperTestUtility

  * **Abstract**


  .. php:attr:: $api
    
    * **Protected**
    
    



  .. php:method:: beforeEach()


    * **Protected**


    Run this function before the actual test to either set or initialize theapi.
    After this the api can be accessed by using $this->api


  .. php:method:: setMapperResult($sql, $arguments=array(), $returnRows=array())

    :param string $sql: the sql query that you expect to receive
    :param array $arguments: the expected arguments for the prepare querymethod
    :param array $returnRows: the rows that should be returned for the resultof the database query. If not provided, it wont be assumed that fetchRowwill be called on the result

    * **Protected**


    Create mocks and set expected results for database queries


