Entity
======





.. php:namespace:: OCA\AppFramework\Db
.. php:class:: Entity

  * **Abstract**


  .. php:attr:: $id
    
    



  .. php:method:: __construct()




  .. php:method:: resetUpdatedFields()



    Marks the entity as clean needed for setting the id after the insertion


  .. php:method:: __call($methodName, $args)

    :param mixed $methodName: 
    :param mixed $args: 


    Each time a setter is called, push the part after setinto an array: for instance setId will save Id in theupdated fields array so it can be easily used to create thegetter method


  .. php:method:: markFieldUpdated($attribute)

    :param string $attribute: the name of the attribute

    * **Protected**


    Mark am attribute as updated


  .. php:method:: columnToProperty($columnName)

    :param string $columnName: the name of the column
    :returns string: the property name


    Transform a database columnname to a property


  .. php:method:: propertyToColumn($property)

    :param string $property: the name of the property
    :returns string: the column name


    Transform a property to a database column name


  .. php:method:: getUpdatedFields()

    :returns array: array of updated fields for update query



  .. php:method:: fromRow($row)

    :param array $row: the row to map onto the entity


    Maps the keys of the row array to the attributes
