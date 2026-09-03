.. _database:

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

Repositories and entities
-------------------------

The aforementioned example is the most basic way to write a simple database query but the more queries amass, the more code has to be written and the harder it will become to maintain it.

To generalize and simplify the problem, split code into resources and create an **Entity** and a **Repository**
class for it: the entity is a plain PHP class carrying one table row's data, and the repository knows how to
read and write entities of that class.

.. versionadded:: 35
   The attribute-based ``OCP\AppFramework\ORM`` namespace described in this section. Apps built against
   older Nextcloud versions used ``QBMapper`` and ``Entity`` instead; see the
   `Nextcloud 34 developer manual <https://docs.nextcloud.com/server/34/developer_manual/basics/storage/database.html>`_
   for that approach.

Defining an entity
^^^^^^^^^^^^^^^^^^^

An entity is a plain class with one public, typed property per column. Mark the class with the
**#[Entity]** attribute, giving it the table name, and mark every mapped property with a **#[Column]**
attribute describing its database column. Exactly one property must carry the **#[Id]** attribute to mark
the table's primary key.

.. code-block:: php
    :caption: lib/Db/Author.php

    <?php

    namespace OCA\MyApp\Db;

    use OCP\AppFramework\ORM\Attribute\Column;
    use OCP\AppFramework\ORM\Attribute\Entity;
    use OCP\AppFramework\ORM\Attribute\Id;
    use OCP\DB\Schema\ColumnType;

    #[Entity(name: 'myapp_authors')]
    final class Author {
        #[Id]
        #[Column(name: 'id', type: ColumnType::Integer)]
        public ?int $id = null;

        #[Column(name: 'name', type: ColumnType::String, length: 64)]
        public string $name;

        #[Column(name: 'stars', type: ColumnType::Integer, default: 0)]
        public int $stars = 0;
    }

Unlike the legacy ``Entity`` base class, there is no base class to extend and no getters or setters are
generated for you: read and write the properties directly, for example ``$author->name`` or
``$author->name = 'Jane Doe'``. The property name and the column name are independent and set explicitly
in the ``#[Column]`` attribute, so there is no implicit camelCase-to-underscore conversion to reason about,
and no need to override a mapping method to deviate from it.

By default, as in the example above, a bare ``#[Id]`` relies on the database's autoincrement column:
``insert()`` only fills in ``$author->id`` after the row has been written. Pass a ``generatorClass`` to
generate the id application-side, before the row is inserted, instead. ``OCP\Snowflake\ISnowflakeGenerator``
produces such an id — a `Snowflake ID <https://en.wikipedia.org/wiki/Snowflake_ID>`_, unique across your
whole cluster and sortable by creation time — which is useful when you need the id before the row exists
(for example to pass it to another service as part of the same request), or to avoid the write contention
a single autoincrement column creates across a cluster. Snowflake ids are ``non-empty-string`` values even
though they are typically stored in a ``ColumnType::Bigint`` column:

.. code-block:: php

    <?php

    use OCP\Snowflake\ISnowflakeGenerator;

    #[Id(generatorClass: ISnowflakeGenerator::class)]
    #[Column(name: 'id', type: ColumnType::Bigint)]
    public ?string $id = null;

A property without a ``#[Column]`` attribute is never read from or written to the database. This is the
replacement for what used to be called *transient attributes*: just leave the property unannotated.

.. note:: The ``#[Entity]`` and ``#[Column]`` attributes only describe how PHP objects map onto an
   already-existing table. They do not create the table for you. You still need a schema migration (see
   :doc:`migrations`) whose columns, types, length, and primary key match your entity's attributes.

Column types
^^^^^^^^^^^^

The ``type`` of a ``#[Column]`` is one of the cases of ``OCP\DB\Schema\ColumnType``, and controls how the
value is converted for storage (e.g. PHP casts ``false`` to an empty string, which fails on PostgreSQL) and
how it is cast back when read from the database:

* ``ColumnType::Integer``, ``ColumnType::Smallint``, ``ColumnType::Bigint``
* ``ColumnType::Float``, ``ColumnType::Decimal``
* ``ColumnType::Boolean``
* ``ColumnType::String`` - for short text; provide a ``length``
* ``ColumnType::Text`` - for long text without a length limit
* ``ColumnType::Binary``, ``ColumnType::Blob`` - for binary data
* ``ColumnType::Json`` - decoded automatically when read; avoid using it in ``findBy()``/``findOneBy()``
  criteria, as ``JSON`` columns cannot properly be filtered on in Oracle and MySQL
* For dates and/or times, provided as ``\DateTimeImmutable`` objects:

  * ``ColumnType::DateImmutable`` - only the date is stored (without timezone)
  * ``ColumnType::TimeImmutable`` - only the time is stored (without timezone)
  * ``ColumnType::DatetimeImmutable`` - date and time are stored, but without timezone
  * ``ColumnType::DatetimeTzImmutable`` - date and time are stored with timezone information

* ``ColumnType::Date``, ``ColumnType::Time``, ``ColumnType::Datetime``, ``ColumnType::DatetimeTz`` -
  the same, but provided as ``\DateTime`` objects. Prefer the immutable variants above.

Defining a repository
^^^^^^^^^^^^^^^^^^^^^^

To read and write ``Author`` entities, extend the **Repository** base class and set its ``entityClass``
constant to the entity it manages:

.. code-block:: php
    :caption: lib/Db/AuthorMapper.php

    <?php

    namespace OCA\MyApp\Db;

    use OCP\AppFramework\ORM\Repository;

    /**
     * @template-extends Repository<Author>
     */
    class AuthorMapper extends Repository {
        public const string entityClass = Author::class;
    }

There is no constructor to write: dependency injection builds the repository for you, so ``AuthorMapper``
can be injected into a controller or service just like any other class.

Inserting, updating, and deleting entities
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: php

    <?php

    $author = new Author();
    $author->name = 'Jane Doe';

    $authorMapper->insert($author);
    // $author->id is now populated

    $author->name = 'Jane D. Doe';
    $authorMapper->update($author);

    $authorMapper->delete($author);

``insertOrUpdate()`` tries to insert the entity, and falls back to updating the existing row instead when
the database reports a unique constraint violation::

    $authorMapper->insertOrUpdate($author);

Finding entities
^^^^^^^^^^^^^^^^

``Repository`` provides ready-made finder methods keyed by property name, so you rarely need to write a
query by hand:

.. code-block:: php

    <?php

    // A single entity; throws DoesNotExistException if there is no match, or
    // MultipleObjectsReturnedException if there is more than one
    $author = $authorMapper->findOneBy(['id' => $id]);

    // Every entity matching the criteria, as a \Generator
    foreach ($authorMapper->findBy(['name' => $name]) as $author) {
        // ...
    }

    // Sorting, and simple offset-based pagination
    $authors = iterator_to_array($authorMapper->findBy(
        criteria: [],
        orderBy: ['name' => \SortDirection::Ascending],
        limit: 20,
        offset: 40,
    ));

    // Every entity in the table
    $authors = iterator_to_array($authorMapper->yieldAll());

.. note:: ``findBy()``, ``yieldAll()``, and ``findByAfterId()`` all return a ``\Generator``. Iterate it
   with ``foreach`` or collect it with ``iterator_to_array()``; the underlying database cursor is closed
   automatically once the generator is exhausted.

For paginating a large table, prefer keyset (seek) pagination over ``offset``: an ``offset`` forces the
database to scan and discard every preceding row on each call, while ``findByAfterId()`` seeks straight to
the right spot through the primary key's index, so each page costs the same regardless of how deep it is.
Pass ``null`` to fetch the first page, then the id of the last entity returned to fetch the next one, and
stop once fewer than ``$limit`` entities come back:

.. code-block:: php

    <?php

    $lastId = null;
    do {
        $page = iterator_to_array($authorMapper->findByAfterId([], $lastId, 20));
        foreach ($page as $author) {
            // ...
            $lastId = $author->id;
        }
    } while (count($page) === 20);

.. warning:: ``findByAfterId()`` does not support entities with a composite primary key.

To delete every entity matching a set of criteria in one query, without loading them first, use
``deleteBy()``, which returns the number of rows deleted::

    $deletedCount = $authorMapper->deleteBy(['stars' => 0]);

Custom queries in a repository
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The built-in finders cover simple equality and ``IN`` criteria. For anything else — aggregates, joins your
entity doesn't declare, and so on — add a method to your repository and fall back to the query builder,
using the protected ``$this->connection`` and ``$this->getTableName()``:

.. code-block:: php
    :caption: lib/Db/AuthorMapper.php

    <?php

    namespace OCA\MyApp\Db;

    use OCP\AppFramework\ORM\Repository;
    use OCP\DB\QueryBuilder\IQueryBuilder;

    /**
     * @template-extends Repository<Author>
     */
    class AuthorMapper extends Repository {
        public const string entityClass = Author::class;

        public function authorNameCount(string $name): int {
            $qb = $this->connection->getQueryBuilder();

            $qb->select($qb->func()->count('*', 'count'))
               ->from($this->getTableName())
               ->where(
                   $qb->expr()->eq('name', $qb->createNamedParameter($name, IQueryBuilder::PARAM_STR))
               );

            $result = $qb->executeQuery();
            $row = $result->fetchAssociative();
            $result->closeCursor();

            return (int)$row['count'];
        }
    }

Relations between entities
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Two entities can be linked with the **#[ManyToOne]** or **#[OneToOne]** attribute, paired with
**#[JoinColumn]** on the property holding the foreign key. Related entities are always resolved eagerly, in
the same query, via a ``LEFT JOIN`` — there is no lazy-loading, and a missing relation resolves to ``null``:

.. code-block:: php

    <?php

    #[Entity(name: 'myapp_merchants')]
    final class Merchant {
        #[Id]
        #[Column(name: 'id', type: ColumnType::Bigint)]
        public ?int $id = null;

        #[Column(name: 'name', type: ColumnType::String, length: 64)]
        public string $name;
    }

    #[Entity(name: 'myapp_orders')]
    final class Order {
        #[Id]
        #[Column(name: 'id', type: ColumnType::Bigint)]
        public ?int $id = null;

        #[ManyToOne(targetEntity: Merchant::class)]
        #[JoinColumn(name: 'merchant_id', referencedColumnName: 'id', nullable: true)]
        public ?Merchant $merchant = null;
    }

Reading an ``Order`` back through its repository also resolves ``$order->merchant`` to the matching
``Merchant`` entity, or ``null`` if none is set. Unlike ``OneToOne``, several ``Order`` rows may reference
the same ``Merchant``.

``OneToOne`` works the same way, but is additionally enforced with a unique constraint on the join column.
A bidirectional ``OneToOne`` relation is declared from both sides, with ``mappedBy``/``invertedBy`` naming
the property on the other side, and the ``#[JoinColumn]`` only repeated on the owning (``invertedBy``) side:

.. code-block:: php

    <?php

    #[Entity(name: 'myapp_customers')]
    final class Customer {
        #[Id]
        #[Column(name: 'id', type: ColumnType::Bigint)]
        public ?int $id = null;

        #[OneToOne(targetEntity: Cart::class, mappedBy: 'customer')]
        #[JoinColumn(name: 'cart_id', referencedColumnName: 'id')]
        public ?Cart $cart = null;
    }

    #[Entity(name: 'myapp_carts')]
    final class Cart {
        #[Id]
        #[Column(name: 'id', type: ColumnType::Bigint)]
        public ?int $id = null;

        #[OneToOne(targetEntity: Customer::class, invertedBy: 'cart')]
        #[JoinColumn(name: 'customer_id', referencedColumnName: 'id')]
        public ?Customer $customer = null;
    }

Set ``onDelete: 'CASCADE'`` on a ``#[JoinColumn]`` to have the database remove dependent rows automatically;
otherwise deleting an entity that is still referenced by another entity's join column throws a
``\LogicException``.

Composite primary keys
^^^^^^^^^^^^^^^^^^^^^^^

Applying ``#[Id]`` to more than one property declares a composite primary key:

.. code-block:: php

    <?php

    #[Entity(name: 'myapp_shelf_items')]
    final class ShelfItem {
        #[Id]
        #[Column(name: 'shelf_id', type: ColumnType::Bigint)]
        public ?int $shelfId = null;

        #[Id]
        #[Column(name: 'author_id', type: ColumnType::Bigint)]
        public ?int $authorId = null;
    }

A composite key cannot rely on a single autoincrement column, so every id property must already have a
value set by the caller before ``insert()`` is called.
``findByAfterId()`` is not supported for entities with a composite primary key; use ``findBy()`` with an
``offset`` instead.

.. note:: Nextcloud 34 and earlier documented a different, hand-written approach based on ``QBMapper``
   and the ``Entity`` base class. Both classes are still shipped for backwards compatibility, but are no
   longer the recommended way to write new code; see the
   `Nextcloud 34 developer manual <https://docs.nextcloud.com/server/34/developer_manual/basics/storage/database.html>`_
   for their documentation.

Table management tips
----------------------

It makes sense to apply some general tips from the beginning, so you don't have to migrate your data and schema later on.

1. Don't use table name longer than 23 characters. As Oracle is limited to 30 chars and we need 3 more for ``oc_`` at the beginning and 5 for the primary key suffix ``_pkey``.

2. Add an auto-incremented ``id`` column. This will ease the use of the ``Repository`` + attributes approach:

    - https://github.com/nextcloud/server/blob/master/lib/public/AppFramework/ORM/Repository.php
    - https://github.com/nextcloud/server/blob/master/lib/public/AppFramework/ORM/Attribute/Id.php

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
-------------------------------

If you would like to find out which database your app is running on, use the ``IDBConnection::getDatabaseProvider`` method.
This can be helpful in cases where specific databases have their own
requirements, such as Oracle limiting ``IN``- queries to 1000 expressions.


Supporting more databases
--------------------------

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
