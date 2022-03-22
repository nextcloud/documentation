===============
Database access
===============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The basic way to run a database query is to use the database connection provided by **OCP\\IDBConnection**.

Inside your database layer class you can now start running queries like:

.. code-block:: php

    <?php
    // db/authordao.php

    namespace OCA\MyApp\Db;

    use OCP\DB\QueryBuilder\IQueryBuilder;
    use OCP\IDBConnection;

    class AuthorDAO {

        private $db;

        public function __construct(IDBConnection $db) {
            $this->db = $db;
        }

        public function find(int $id) {
            $qb = $this->db->getQueryBuilder();

            $qb->select('*')
               ->from('myapp_authors')
               ->where(
                   $qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT))
               );

            $cursor = $qb->execute();
            $row = $cursor->fetch();
            $cursor->closeCursor();

            return $row;
        }

    }


Transactions
------------

Database operations can be run in a transaction to commit or roll back a group of changes in an atomic fashion.

.. code-block:: php

    <?php

    $this->db->beginTransaction();

    try {
        // DB operations

        $this->db->commit();
    } catch (\Throwable $e) {
        // Optional: handle the error

        // Important: roll back (or commit) your changes when an error
        //            happens, so this transaction ends
        $this->db->rollBack();

        throw $e;
    }

.. warning:: Omitting the error handling for transactions will lead to unexpected behavior as any database operations that come after your error will still run in your transaction and due to the lack of a commit PDO will automatically roll-back all changes at the end of the script.

In the context of a class you can use the ``TTransactional`` trait and move the unit of work into a closure.

.. code-block:: php

    <?php

    use OCP\AppFramework\Db\TTransactional;
    use OCP\IDBConnection;

    class MyService() {

        use TTransactional;

        private IDBConnection $db;

        public function __construct(IDBConnection $db) {
            $this->db = $db;
        }

        public function doSomeWork(): void {
            $this->atomic(function () {
                // $this->db->...
                // $this->db->...
                // $this->db->...
            }, $this->db);
        }

        /**
         * It's also possible to get a result out of the closure
         */
        public function doSomeWorkWithResults(): int {
            return $this->atomic(function () {
                // $this->db->...
                // $this->db->...
                // $this->db->...

                return 1;
            }, $this->db);
        }
    }

Mappers
-------

The aforementioned example is the most basic way to write a simple database query but the more queries amass, the more code has to be written and the harder it will become to maintain it.

To generalize and simplify the problem, split code into resources and create an **Entity** and a **Mapper** class for it. The mapper class provides a way to run SQL queries and maps the result onto the related entities.


To create a mapper, inherit from the mapper base class and call the parent constructor with the following parameters:

* Database connection
* Table name
* **Optional**: Entity class name, defaults to \\OCA\\MyApp\\Db\\Author in the example below

.. code-block:: php

    <?php
    // db/authormapper.php

    namespace OCA\MyApp\Db;

    use OCP\DB\QueryBuilder\IQueryBuilder;
    use OCP\IDBConnection;
    use OCP\AppFramework\Db\QBMapper;

    class AuthorMapper extends QBMapper {

        public function __construct(IDBConnection $db) {
            parent::__construct($db, 'myapp_authors');
        }


        /**
         * @throws \OCP\AppFramework\Db\DoesNotExistException if not found
         * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException if more than one result
         */
        public function find(int $id) {
            $qb = $this->db->getQueryBuilder();

            $qb->select('*')
               ->from('myapp_authors')
               ->where(
                   $qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT))
               );

            return $this->findEntity($qb);
        }


        public function findAll($limit=null, $offset=null) {
            $qb = $this->db->getQueryBuilder();

            $qb->select('*')
               ->from('myapp_authors')
               ->setMaxResults($limit)
               ->setFirstResult($offset);

            return $this->findEntities($sql);
        }


        public function authorNameCount($name) {
            $qb = $this->db->getQueryBuilder();

            $qb->selectAlias($qb->createFunction('COUNT(*)'), 'count')
               ->from('myapp_authors')
               ->where(
                   $qb->expr()->eq('name', $qb->createNamedParameter($name, IQueryBuilder::PARAM_STR))
               );

            $cursor = $qb->execute();
            $row = $cursor->fetch();
            $cursor->closeCursor();

            return $row['count'];
        }

    }

.. note:: The cursor is closed automatically for all **INSERT**, **DELETE**, **UPDATE** queries and when calling the methods **findOneQuery**, **findEntities**, **findEntity**, **delete**, **insert** and **update**. For custom calls using execute you should always close the cursor after you are done with the fetching to prevent database lock problems on SQLite

Every mapper also implements default methods for deleting and updating an entity based on its id::

    $authorMapper->delete($entity);

or::

    $authorMapper->update($entity);



Entities
--------

Entities are data objects that carry all the table's information for one row. Every Entity has an **id** field by default that is set to the integer type. Table rows are mapped from lower case and underscore separated names to *lowerCamelCase* attributes:

* **Table column name**: phone_number
* **Property name**: phoneNumber

.. code-block:: php

    <?php
    // db/author.php
    namespace OCA\MyApp\Db;

    use OCP\AppFramework\Db\Entity;

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
^^^^^

The following properties should be annotated by types, to not only assure that the types are converted correctly for storing them in the database (e.g. PHP casts false to the empty string which fails on PostgreSQL) but also for casting them when they are retrieved from the database.

The following types can be added for a field:

* integer
* float
* boolean

Accessing attributes
^^^^^^^^^^^^^^^^^^^^

Since all attributes should be protected, getters and setters are automatically generated for you:


.. code-block:: php

    <?php
    // db/author.php
    namespace OCA\MyApp\Db;

    use OCP\AppFramework\Db\Entity;

    class Author extends Entity {
        protected $stars;
        protected $name;
        protected $phoneNumber;
    }

    $author = new Author();
    $author->setId(3);
    $author->getPhoneNumber()  // null

Custom attribute to database column mapping
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

By default each attribute will be mapped to a database column by a certain convention, e.g. **phoneNumber**
will be mapped to the column **phone_number** and vice versa. Sometimes it is needed though to map attributes to
different columns because of backwards compatibility. To define a custom
mapping, simply override the **columnToProperty** and **propertyToColumn** methods of the entity in question:

.. code-block:: php


    <?php
    // db/author.php
    namespace OCA\MyApp\Db;

    use OCP\AppFramework\Db\Entity;

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
            if ($property === 'phoneNumber') {
                return 'phonenumber';
            } else {
                return parent::propertyToColumn($property);
            }
        }

    }


Slugs
^^^^^

Slugs are used to identify resources in the URL by a string rather than integer id. Since the URL allows only certain values, the entity base class provides a slugify method for it:

.. code-block:: php

    <?php
    $author = new Author();
    $author->setName('Some*thing');
    $author->slugify('name');  // Some-thing


Supporting more databases
-------------------------

Most queries should run fine on all supported databases, but if scaling is required and a database is split into a cluster and for some special database types more rules apply.
You can specify your supported databases in the ``appinfo/info.xml`` of your app in the dependencies section:


.. code-block:: xml

    <database>pgsql</database>
    <database>sqlite</database>
    <database>mysql</database>

When Oracle (``oci``) is supported (also when you don't list any databases), Nextcloud performs some additional tests on the schema which apply to databases in this case:

* Table names can not be longer than 27 characters (including the ``oc_`` prefix)
* Primary keys must have a custom index name when the table name is longer than 23 characters
* Column names can not be longer than 30 characters
* Index names can not be longer than 30 characters
* Foreign key names can not be longer than 30 characters
* Sequence names can not be longer than 30 characters
* String columns can not be NotNull and have an empty string as default value when being added in a later migration
* Boolean columns can not be NotNull

Additionally we assume that Oracle support means you are interested in scaling and therefor check additional restrictions of other databases in clustered setups:

* Galera Cluster: All tables must have a primary key

On top of that there are some configs which influence the queries you can run. Known problems are:

* MySQL deleting lot of entries - Use a ``LIMIT`` on the delete (not supported on other databases), see this `sample of the activity app <https://github.com/nextcloud/activity/blob/master/lib/Data.php#L385-L397>`_
* MySQL ``ONLY_FULL_GROUP_BY`` - All values selected in a query with a ``GROUP BY`` need to be aggregated as per `MySQL manual <https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html#sqlmode_only_full_group_by>`_

It makes sense to apply the restrictions from the beginning already so you don't have to migrate your data and schema later on when you want to change the set of supported databases.
