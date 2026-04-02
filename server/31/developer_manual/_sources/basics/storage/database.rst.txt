===============
Database access
===============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The basic way to run a database query is to use the database connection provided by **OCP\\IDBConnection**.

Inside your database layer class you can now start running queries like:

.. code-block:: php
    :caption: lib/Db/AuthorDAO.php

    <?php

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

            $result = $qb->executeQuery();
            $row = $result->fetchAssociative();
            $result->closeCursor();

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
    :caption: lib/Db/AthorMapper.php

    <?php

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

            $result = $qb->executeQuery();
            $row = $result->fetchAssociative();
            $result->closeCursor();

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

Entities are data objects that carry all the table's information for one row.
Every Entity has an **id** field by default that is set to the integer type.
Table rows are mapped from lower case and underscore separated names to *lowerCamelCase* attributes:

* **Table column name**: phone_number
* **Property name**: phoneNumber

.. code-block:: php
    :caption: lib/Db/Author.php

    <?php

    namespace OCA\MyApp\Db;

    use OCP\AppFramework\Db\Entity;
    use OCP\DB\Types;

    class Author extends Entity {

        protected $stars;
        protected $name;
        protected $phoneNumber;

        public function __construct() {
            // add types in constructor
            $this->addType('stars', Types::INTEGER);
            // other fields are implicitly `Types::STRING`
        }
    }

Types
^^^^^

The following properties should be annotated by types, to not only assure that the types are converted correctly for storing them in the database
(e.g. PHP casts false to the empty string which fails on PostgreSQL) but also for casting them when they are retrieved from the database.

The following types (as part of ``OCP\DB\Types``) can be added for a field:

* ``Types::INTEGER``
* ``Types::FLOAT``
* ``Types::BOOLEAN``
* ``Types::STRING`` - For text and string columns
* ``Types::BLOB`` - For binary data
* ``Types::JSON`` - JSON data is automatically decoded on reading
* For time and/or dates, provided as ``\DateTimeImmutable`` objects, the following types can be used:

  * ``Types::DATE_IMMUTABLE`` - only the date is stored (without timezone)
  * ``Types::TIME_IMMUTABLE`` - only the time is stored (without timezone)
  * ``Types::DATETIME_IMMUTABLE`` - date and time are stored, but without timezone
  * ``Types::DATETIME_TZ_IMMUTABLE`` - date and time are stored with timezone information
  
* ``Types::DATE``, ``Types::TIME``, ``Types::DATETIME``, ``Types::DATETIME_TZ`` - similar as the immutable variants, but these will be provided as ``\DateTime`` objects.
  It is recommended to use the immutable variants as the internal state tracking of the ``Entity`` class only work with re-assignments,
  so any changes on this mutable types will not be tracked and the update method will not write back the changes to the database.

.. _database-entity-attribute-access:

Accessing attributes
^^^^^^^^^^^^^^^^^^^^

Since all attributes should be protected, getters and setters are automatically generated for you:


.. code-block:: php

    :caption: lib/Db/Author.php

    <?php

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
    :caption: lib/Db/Author.php

    <?php

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

.. _database-entity-slugs:

Transient attributes
^^^^^^^^^^^^^^^^^^^^

You can add attributes to an entity class that do not map to a database column. These are called *transient* because they are neither loaded from database rows nor are their values persisted.

.. code-block:: php
    :caption: lib/Db/User.php

    <?php

    namespace OCA\MyApp\Db;

    use OCP\AppFramework\Db\Entity;

    class User extends Entity {
        protected string $uid;       // Exists in the database
        protected $lastLogin; // Does not exist in the database

        public function getLastLogin(): ?int {
            return $this->lastLogin;
        }

        public function setLastLogin(int $lastLogin): void {
            $this->lastLogin = $lastLogin;
        }
    }

It is important to define getters and setters for any transient attributes.
Do not use the :ref:`magic getters and setters<database-entity-attribute-access>` of attributes that map to database columns.

Slugs
^^^^^

.. deprecated:: 24

Slugs are used to identify resources in the URL by a string rather than integer id.
Since the URL allows only certain values, the entity base class provides a slugify method for it:

.. code-block:: php

    <?php
    $author = new Author();
    $author->setName('Some*thing');
    $author->slugify('name');  // Some-thing

Table management tips
---------------------

It makes sense to apply some general tips from the beginning, so you don't have to migrate your data and schema later on.

1. Don't use table name longer than 23 characters. As Oracle is limited to 30 chars and we need 3 more for ``oc_`` at the beginning and 5 for the primary key suffix ``_pkey``.

2. Add an auto-incremented ``id`` column. This will ease the use of ``QBMapper`` + ``Entity`` approach:

    - https://github.com/nextcloud/server/blob/master/lib/public/AppFramework/Db/QBMapper.php
    - https://github.com/nextcloud/server/blob/master/lib/public/AppFramework/Db/Entity.php

.. code-block:: php

    <?php
    $table->addColumn('id', Types::BIGINT, [
        'autoincrement' => true,
        'notnull' => true,
        'length' => 20,
        'unsigned' => true,
    ]);

3. Set a primary key to prevent errors in clustered setups. You can use the `id` field for that.

.. code-block:: php

    <?php
    $table->setPrimaryKey(['id']);

4. Manually set the name of your indexes. It will help you to manipulate them if needed in the future. Note that the names of the index are "global" database wide in some database platforms so having generic names can create conflicts. Since Nextcloud 28 uniqueness across all tables is ensured at installation time and during updates. This happens *regardless of the in-use database platform* to maintain broad compatibility and consistency.

.. code-block:: php

    <?php
    $table->addUniqueIndex(['your', 'column', 'names', '...'], 'table_name_uniq_feature');

Querying the database provider
------------------------------

If you would like to find out which database your app is running on, use the ``IDBConnection::getDatabaseProvider`` method.
This can be helpful in cases where specific databases have their own
requirements, such as Oracle limiting ``IN``- queries to 1000 expressions.


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
* String columns can not have a length longer than 4.000 characters, use text instead
* Boolean columns can not be NotNull

Additionally we assume that Oracle support means you are interested in scaling and therefore check additional restrictions of other databases in clustered setups:

* Galera Cluster: All tables must have a primary key

On top of that there are some configs which influence the queries you can run. Known problems are:

* MySQL deleting lot of entries - Use a ``LIMIT`` on the delete (not supported on other databases), see this `sample of the activity app <https://github.com/nextcloud/activity/blob/master/lib/Data.php#L385-L397>`_
* MySQL ``ONLY_FULL_GROUP_BY`` - All values selected in a query with a ``GROUP BY`` need to be aggregated as per `MySQL manual <https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html#sqlmode_only_full_group_by>`_
