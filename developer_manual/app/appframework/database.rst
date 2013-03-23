Database Access
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Your database layer should go into the **db/** folder. It's recommended to split the data entities from the database queries. You can do that by creating a very simple PHP object which extends the class :php:class:`\\OCA\\AppFramework\\Db\\Entity`. This object will hold the data. 

Getters and setters will automatically be created for all public attributes. Should it be required to use special setter or getters, simply create the method. Make sure to mark the field as updated though if it was set by passing the fieldname to the **markFieldUpdated()** method.

:file:`db/item.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  use \OCA\AppFramework\Db\Entity

  class Item {

      public $id;
      public $name;
      public $path;
      public $user;

      // transform username to lower case
      public function function setName($name){
          $this->markFieldUpdated('name');
          $this->name = strtolower($name);
      }

  }


All database queries for that object should be put into a mapper class. This follows the `data mapper pattern <http://www.martinfowler.com/eaaCatalog/dataMapper.html>`_.

:file:`db/itemmapper.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  use \OCA\AppFramework\Db\Mapper;


      class ItemMapper extends Mapper {


      public function __construct(API $api) {
        parent::__construct($api, 'news_feeds');
      }


      public function find($id, $userId){
        $sql = 'SELECT * FROM `' . $this->getTableName() . '` ' .
          'WHERE `id` = ? ' .
          'AND `user_id` = ?';

        $row = $this->findOneQuery($sql, array($id, $userId));
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

