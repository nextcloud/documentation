Database Access
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Your database layer should go into the **db/** folder. It's recommended to split the data entities from the database queries. You can do that by creating a very simple PHP object which extends the class :php:class:`OCA\\AppFramework\\Db\\Entity`. This object will hold the data. 

Getters and setters will automatically be created for all public attributes. Should it be required to use special setter or getters, simply create the method. Make sure to mark the field as updated by calling the parent method.

.. note:: Setters mark a field as updated. The :php:meth:`OCA\\AppFramework\\Db\\Entity::fromRow` method should only be used to pass in rows from a database result. Fields will not be marked as updated by using :php:meth:`OCA\\AppFramework\\Db\\Entity::fromRow`!

:php:meth:`OCA\\AppFramework\\Db\\Entity::fromRow` maps the database columns to attributes. The conversion works like the this:

* database column **my_name** gets transformed to attribute **myName**.
* the attribute **myAwesomeProperty** gets transformed to the database column **my_awesome_property**

.. versionchanged:: 6.0 Instead of manually creating and mapping all the entities, this is is now done by extending a parent class.

:file:`db/item.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  use \OCA\AppFramework\Db\Entity

  class Item extends Entity {

      public $id;
      public $name;
      public $path;
      public $user;

      // transform username to lower case
      public function function setName($name){
          $name = strtolower($name);
          parent::setName($name);
      }

  }


All database queries for that object should be put into a mapper class. This follows the `data mapper pattern <http://www.martinfowler.com/eaaCatalog/dataMapper.html>`_. Simply inherit the :php:class:`OCA\\AppFramework\\Db\\Mapper`.


.. versionchanged:: 6.0: Methods from the old mapper have been removed and deprecated to allow a small ORM.

:file:`db/itemmapper.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  use \OCA\AppFramework\Db\Mapper;


  class ItemMapper extends Mapper {


      public function __construct(API $api) {
        parent::__construct($api, 'news_feeds'); // tablename is news_feeds
      }


      public function find($id, $userId){
        $sql = 'SELECT * FROM `' . $this->getTableName() . '` ' .
          'WHERE `id` = ? ' .
          'AND `user_id` = ?';

        // use findOneQuery to throw exceptions when no entry or more than one
        // entries were found
        $row = $this->findOneQuery($sql, array($id, $userId));
        $feed = new Item();
        $feed->fromRow($row);

        return $feed;
      }


      public function findByName($name){
        $sql = 'SELECT * FROM `' . $this->getTableName() . '` ' .
        'WHERE `name` = ? ';

        $row = $this->execute($sql, array($name));
        $feed = new Item();
        $feed->fromRow($row);

        return $feed;
      }

  }

.. note:: Always use **?** to mark placeholders for arguments in SQL queries and pass the arguments as a second parameter to the execute function to prevent `SQL Injection <http://php.net/manual/en/security.database.sql-injection.php>`_

**DONT**:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM `' . $this->getTableName() . '` WHERE `user` = ' . $user;
  $result = $this->execute($sql);


**DO**:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM `' . $this->getTableName() . '` WHERE `user` = ?';
  $params = array($userId);

  $result = $this->execute($sql, $params);


The mapper class comes with simple methods for deleting, updating and finding items. To delete a database entry, simply pass an entity with an id to the :php:meth:`OCA\\AppFramework\\Db\\Mapper::delete` method.

Example:

.. code-block:: php

  <?php

  // delete the item with id 4
  $item = new Item();
  $item->setId(4);

  $mapper = new ItemMapper($api); // inject API class for db access
  $mapper->delete($item);


The same works for updating. Only the fields which have been set with setters will be updated.

Example:

.. code-block:: php

  <?php

  // change the name of item with id 4
  $item = new Item();
  $item->setId(4);
  $item->setName('tony');


  $mapper = new ItemMapper($api); // inject API class for db access
  $mapper->update($item);
