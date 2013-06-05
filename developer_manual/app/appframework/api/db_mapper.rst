Mapper
======


Simple parent class for inheriting your data access layer from.
This class
may be subject to change in the future

.. php:namespace:: OCA\AppFramework\Db
.. php:class:: Mapper

  * **Abstract**




  .. php:method:: __construct($api, $tableName)

    :param \\OCA\\AppFramework\\Core\\API $api: Instance of the API abstraction layer
    :param string $tableName: the name of the table. set this to allow entity queries without using sql



  .. php:method:: getTableName()

    :returns string: the table name



  .. php:method:: delete($entity)

    :param \\OCA\\AppFramework\\Db\\Entity $entity: 


    Deletes an entity from the table


  .. php:method:: insert($entity)

    :param \\OCA\\AppFramework\\Db\\Entity $entity: 
    :returns \\OCA\\AppFramework\\Db\\the: saved entity with the set id


    Creates a new entry in the db from an entity


  .. php:method:: update($entity)

    :param \\OCA\\AppFramework\\Db\\Entity $entity: 
    :throws \\InvalidArgumentException: if entity has no id


    Updates an entry in the db from an entity


  .. php:method:: findOneQuery($sql, $params)

    :param string $sql: the sql query
    :param array $params: the parameters of the sql query
    :throws \\OCA\\AppFramework\\Db\\DoesNotExistException: if the item does not exist
    :returns array: the result as row

    * **Protected**


    Returns an db result and throws exceptions when there are more or lessresults


  .. php:method:: execute($sql, $params=array(), $limit=null, $offset=null)

    :param string $sql: the prepare string
    :param array $params: the params which should replace the ? in the sql query
    :param int $limit: the maximum number of rows
    :param int $offset: from which row we want to start
    :returns \\PDOStatement: the database query result

    * **Protected**


    Runs an sql query


