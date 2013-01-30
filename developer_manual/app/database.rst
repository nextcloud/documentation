Database Access
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

.. note:: This will likely change with the introduction of an ORM

ownCloud uses a database abstraction layer on top of either MDB2 or PDO, depending on the availability of PDO on the server.

Your database schema will be inside :file:`appinfo/database.xml` in MDB2's `XML scheme notation <http://www.sulc.edu/sulcalumni/app/lib/pear/docs/MDB2_Schema/docs/xml_schema_documentation.html>`_ where the placeholders \*dbprefix* (\*PREFIX* in your SQL) and \*dbname* can be used for the configured database table prefix and database name.

An example database XML file would look like this:

.. code-block:: xml

  <?xml version="1.0" encoding="ISO-8859-1" ?>
  <database>
   <name>*dbname*</name>
   <create>true</create>
   <overwrite>false</overwrite>
   <charset>utf8</charset>
   <table>
    <name>*dbprefix*yourapp_items</name>
    <declaration>
      <field>
        <name>id</name>
        <type>integer</type>
        <default>0</default>
        <notnull>true</notnull>
            <autoincrement>1</autoincrement>
        <length>4</length>
      </field>
      <field>
        <name>user</name>
        <type>text</type>
        <notnull>true</notnull>
        <length>64</length>
      </field>
      <field>
        <name>name</name>
        <type>text</type>
        <notnull>true</notnull>
        <length>100</length>
      </field>
      <field>
        <name>path</name>
        <type>clob</type>
        <notnull>true</notnull>
      </field>
    </declaration>
  </table>
  </database>



To update the tables used by the app, simply adjust the database.xml file and increase the app version number in :file:`appinfo/version` to trigger an update.


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


All database queries for that object should be put into a mapper class. This follows the `data mapper pattern <http://www.martinfowler.com/eaaCatalog/dataMapper.html>`_. The mapper class could look like this (more method examples are in the **advancedapptemplate** app):

:file:`db/itemmapper.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  use \OCA\AppFramework\Db\DoesNotExistException;
  use \OCA\AppFramework\Db\Mapper;


  class ItemMapper extends Mapper {


      private $tableName;

      /**
       * @param API $api: Instance of the API abstraction layer
       */
      public function __construct($api){
          parent::__construct($api);
          $this->tableName = '*PREFIX*apptemplateadvanced_items';
      }


      /**
       * Finds an item by id
       * @throws DoesNotExistException: if the item does not exist
       * @return the item
       */
      public function find($id){
          $row = $this->findQuery($this->tableName, $id);
          return new Item($row);
      }


      /**
       * Finds an item by user id
       * @param string $userId: the id of the user that we want to find
       * @throws DoesNotExistException: if the item does not exist
       * @return the item
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
       * @param Item $item: the item to be saved
       * @return the item with the filled in id
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
       * @param int $id: the id of the item
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

For more information about MDB2 style prepared statements, please see the `official MDB2 documentation <http://pear.php.net/package/MDB2/docs>`_
