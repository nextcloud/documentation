Mapper
======


Simple parent class for inheriting your data access layer from.
This class
may be subject to change in the future

.. php:namespace:: OCA\AppFramework\Db
.. php:class:: Mapper

  * **Abstract**




  .. php:method:: __construct($api)

    :param \\OCA\\AppFramework\\Core\\API $api: Instance of the API abstraction layer



  .. php:method:: findQuery($tableName, $id)

    :param string $tableName: the name of the table to query
    :param int $id: the id of the item
    :throws \\OCA\\AppFramework\\Db\\DoesNotExistException: if the item does not exist
    :returns array: the result as row

    * **Protected**


    Returns an db result by id


  .. php:method:: findAllQuery($tableName)

    :param string $tableName: the name of the table to query
    :returns \\PDOStatement: the result

    * **Protected**


    Returns all entries of a table


  .. php:method:: deleteQuery($tableName, $id)

    :param string $tableName: the name of the table to query
    :param int $id: the id of the item

    * **Protected**


    Deletes a row in a table by id


  .. php:method:: execute($sql, $params=array(), $limit=null, $offset=null)

    :param string $sql: the prepare string
    :param array $params: the params which should replace the ? in the sql query
    :param int $limit: the maximum number of rows
    :param int $offset: from which row we want to start
    :returns \\PDOStatement: the database query result

    * **Protected**


    Runs an sql query
