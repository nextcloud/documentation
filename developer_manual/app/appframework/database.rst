Database Access
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Your database layer should go into the **db/** folder. It's recommended to split your data entities from your database queries. You can do that by creating a very simple PHP object with getters and setters. This object will hold your data.

:file:`db/item.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  class Item {

      private $id;
      private $name;
      private $path;
      private $user;

      public function __construct($fromRow=null){
          if($fromRow){
             $this->fromRow($fromRow);
          }
      }

      public function fromRow($row){
          $this->id = $row['id'];
          $this->name = $row['name'];
          $this->path = $row['path'];
          $this->user = $row['user'];
      }


      public function getId(){
          return $this->id;
      }

      public function getName(){
          return $this->name;
      }

      public function getUser(){
          return $this->user;
      }

      public function getPath(){
          return $this->path;
      }


      public function setId($id){
          $this->id = $id;
      }

      public function setName($name){
          $this->name = $name;
      }

      public function setUser($user){
          $this->user = $user;
      }

      public function setPath($path){
          $this->path = $path;
      }

  }


All database queries for that object should be put into a mapper class. This follows the `data mapper pattern <http://www.martinfowler.com/eaaCatalog/dataMapper.html>`_. The mapper class could look like this (more method examples are in the **Apptemplate Advanced** app):

:file:`db/itemmapper.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  use \OCA\AppFramework\Db\DoesNotExistException;
  use \OCA\AppFramework\Db\Mapper;


  class ItemMapper extends Mapper {


      private $tableName;

      /**
       * @param API $api Instance of the API abstraction layer
       */
      public function __construct($api){
          parent::__construct($api);
          $this->tableName = '*PREFIX*apptemplateadvanced_items';
      }


      /**
       * Finds an item by id
       * @throws DoesNotExistException if the item does not exists
       * @throws MultipleObjectsReturnedException if more than one item exists
       * @return Item the item
       */
      public function find($id){
          $row = $this->findQuery($this->tableName, $id);
          return new Item($row);
      }


      /**
       * Finds an item by user id
       * @param string $userId the id of the user that we want to find
       * @throws DoesNotExistException if the item does not exist
       * @return Item the item
       */
      public function findByUserId($userId){
          $sql = 'SELECT * FROM ' . $this->tableName . ' WHERE user = ?';
          $params = array($userId);

          $result = $this->execute($sql, $params)->fetchRow();
          if($result){
              return new Item($result);
          } else {
              throw new DoesNotExistException('Item with user id ' . $userId . ' does not exist!');
          }
      }


      /**
       * Saves an item into the database
       * @param Item $item the item to be saved
       * @return Item the item with the filled in id
       */
      public function save($item){
          $sql = 'INSERT INTO '. $this->tableName . '(name, user, path)'.
              ' VALUES(?, ?, ?)';

          $params = array(
              $item->getName(),
              $item->getUser(),
              $item->getPath()
          );

          $this->execute($sql, $params);

          $item->setId($this->api->getInsertId());
          return $item;
      }


      /**
       * Updates an item
       * @param Item $item: the item to be updated
       */
      public function update($item){
          $sql = 'UPDATE '. $this->tableName . ' SET
              name = ?,
              user = ?,
              path = ?
              WHERE id = ?';

          $params = array(
              $item->getName(),
              $item->getUser(),
              $item->getPath(),
              $item->getId()
          );

          $this->execute($sql, $params);
      }


      /**
       * Deletes an item
       * @param int $id the id of the item
       */
      public function delete($id){
          $this->deleteQuery($this->tableName, $id);
      }


  }

.. note:: Always use **?** to mark placeholders for arguments in SQL queries and pass the arguments as a second parameter to the execute function to prevent `SQL Injection <http://php.net/manual/en/security.database.sql-injection.php>`_

**DONT**:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM ' . $this->tableName . ' WHERE user = ' . $user;
  $result = $this->execute($sql);


**DO**:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM ' . $this->tableName . ' WHERE user = ?';
  $params = array($userId);

  $result = $this->execute($sql, $params);

