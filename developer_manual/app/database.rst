===============
Database Access
===============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The basic way to run a database query is to inject the **Db** service.

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Db\AuthorDAO;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Database Layer
             */
            $container->registerService('AuthorDAO', function($c) {
                return new AuthorDAO($c->query('ServerContainer')->getDb());
            });
        }
    }

Inside your database layer class you can now start running queries like:

.. code-block:: php

    <?php
    // db/authordao.php

    namespace OCA\MyApp\Db;

    use \OCP\IDb;

    class AuthorDAO {

        private $db;

        public function __construct(IDb $db) {
            $this->db = $db;
        }

        public function find($id) {
            $sql = 'SELECT * FROM `*PREFIX*myapp_authors` ' .
                'WHERE `id` = ?';
            $query = $db->prepareQuery($sql);
            $query->bindParam(1, $id, \PDO::PARAM_INT);
            $result = $query->execute();

            while($row = $result->fetchRow()) {
                return $row;
            }
        }

    }


Mappers
=======
The aforementioned example is the most basic way write a simple database query but the more queries amass, the more code has to be written and the harder it will become to maintain it. 

To generalize and simplify the problem, split code into resources and create an **Entity** and a **Mapper** class for it. The mapper class provides a way to run Sql queries and maps the result onto the related entities.


To create a mapper, inherit from the mapper baseclass and call the parent constructor with the following parameters:

* Database connection
* Table name
* **Optional**: Entity class name, defaults to \\OCA\\MyApp\\Db\\Author in the example below

.. code-block:: php

    <?php
    // db/authormapper.php

    namespace OCA\MyApp\Db;

    use \OCP\IDb;
    use \OCP\AppFramework\Db\Mapper;

    class AuthorMapper extends Mapper {

        public function __construct(IDb $db) {
            parent::__construct($db, 'myapp_authors'); 
        }


        /**
         * @throws \OCP\AppFramework\Db\DoesNotExistException if not found
         * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException if more than one result
         */
        public function find($id) {
            $sql = 'SELECT * FROM `*PREFIX*myapp_authors` ' .
                'WHERE `id` = ?';
            return $this->findEntity($sql, array($id));
        }


        public function findAll($limit=null, $offset=null) {
            $sql = 'SELECT * FROM `*PREFIX*myapp_authors`';
            return $this->findEntities($sql, $limit, $offset);
        }


        public function authorNameCount($name) {
            $sql = 'SELECT COUNT(*) AS `count` FROM `*PREFIX*myapp_authors` ' .
                'WHERE `name` = ?';
            $query = $this->db->prepareQuery($sql);
            $query->bindParam(1, $name, \PDO::PARAM_STR);
            $result = $query->execute();

            while($row = $result->fetchRow()) {
                return $row['count'];
            }
        }

    }

Every mapper also implements default methods for deleting and updating an entity based on its id::

    $authorMapper->delete($entity);

or::

    $authorMapper->update($entity);

Mappers should be registered in the constructor to reuse them inside the application:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Db\AuthorMapper;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Database Layer
             */
            $container->registerService('AuthorMapper', function($c) {
                return new AuthorMapper($c->query('ServerContainer')->getDb());
            });
        }
    }

Entities
========
Entities are data objects that carry all the table's information for one row. Every Entity has an **id** field by default that is set to the integer type. Table rows are mapped from lower case and underscore separated names to pascal case attributes:

* **Table column name**: phone_number
* **Property name**: phoneNumber

.. code-block:: php

    <?php
    // db/author.php
    namespace OCA\MyApp\Db;

    use \OCP\AppFramework\Db\Entity;

    class Author extends Entity {

        protected $stars;
        protected $name;
        protected $phoneNumber;

        public function __construct() {
            // add types in constructor
            $this->addType('stars', 'integer');
        }
    }

Types
-----
The following properties should be annotated by types, to not only assure that the types are converted correctly for storing them in the database (e.g. PHP casts false to the empty string which fails on postgres) but also for casting them when they are retrieving from the database. 

The following types can be added for a field:

* integer
* float
* boolean

Accessing attributes
--------------------
Since all attributes should be protected, getters and setters are automatically generated for you:


.. code-block:: php

    <?php
    // db/author.php
    namespace OCA\MyApp\Db;

    use \OCP\AppFramework\Db\Entity;

    class Author extends Entity {
        protected $stars;
        protected $name;
        protected $phoneNumber;
    }

    $author = new Author();
    $author->setId(3);
    $author->getPhoneNumber()  // null

Custom attribute to database column mapping
-------------------------------------------

By default each attribute will be mapped to a database column by a certain convention, e.g. **phoneNumber** 
will be mapped to the column **phone_number** and vice versa. Sometimes it is needed though to map attributes to
different columns because of backwards compability. To define a custom 
mapping, simply override the **columnToProperty** and **propertyToColumn** methods of the entity in question:

.. code-block:: php


    <?php
    // db/author.php
    namespace OCA\MyApp\Db;

    use \OCP\AppFramework\Db\Entity;

    class Author extends Entity {
        protected $stars;
        protected $name;
        protected $phoneNumber;

        // map attribute phoneNumber to the database column phonenumber
        public function columnToProperty($column) {
            if ($column === 'phonenumber') {
                return 'phoneNumber';
            } else {
                return parent::columnToProperty($column);
            }
        }

        public function propertyToColumn($property) {
            if ($column === 'phoneNumber') {
                return 'phonenumber';
            } else {
                return parent::propertyToColumn($property);
            }
        }

    }
    
    
Slugs
-----
Slugs are used to identify resources in the URL by a string rather than integer id. Since the URL allows only certain values, the entity baseclass provides a slugify method for it:

.. code-block:: php

    <?php
    $author = new Author();
    $author->setName('Some*thing');
    $author->slugify('name');  // Some-thing

 
