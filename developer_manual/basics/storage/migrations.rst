.. _app_db_migrations:

==========
Migrations
==========

Migrations allow apps to evolve their database schema and migrate existing
data between app versions.

A migration can implement three phases, which run in this order during an
upgrade:

#. ``preSchemaChange()``
#. ``changeSchema()``
#. ``postSchemaChange()``

Use ``changeSchema()`` for declarative schema changes. Use the pre- and
post-schema phases for data changes or other work that must happen before or
after the schema change.

Apps can contain multiple migrations. Splitting a complex change across
multiple migrations makes it possible, for example, to add a replacement
column, copy existing data to it, and remove the old column safely.

Migration location and naming
-----------------------------

Migration files for an app are discovered in the app's ``lib/Migration/``
directory. The directory is relative to the app's actual installation path,
which may be in a custom apps directory.

Migration classes must use the app's migration namespace:

.. code-block:: php

   OCA\<AppNamespace>\Migration

Migration filenames and class names must begin with ``Version``. The migration
identifier is the remainder of the class name after removing that prefix. For
example:

.. code-block:: text

   Class:      Version2404Date20220903071748
   Identifier: 2404Date20220903071748

Files matching ``Version*.php`` are discovered recursively below the migration
directory. ``Version0`` is reserved and must not be used.

Migration classes must extend
``\OCP\Migration\SimpleMigrationStep``.

Fresh installations
-------------------

Fresh app installations run migrations in *schema-only* mode. In this mode,
Nextcloud evaluates the ``changeSchema()`` methods of all pending migrations
and applies the resulting schema, but it does not call
``preSchemaChange()`` or ``postSchemaChange()``.

As a result:

* The retained ``changeSchema()`` methods must collectively produce the
  complete current schema of the app.
* An app must not depend on a pre- or post-schema method to create its final
  schema.
* Data backfills in pre- or post-schema methods are upgrade operations and are
  not run on a fresh installation.
* Old migration classes must remain loadable for fresh installations.

Writing durable migrations
--------------------------

Nextcloud records completed migration identifiers in the database. A migration
that has already been recorded is normally not executed again.

Do not change a released migration to introduce additional database changes.
Create a new migration instead. A released migration should only be adjusted
when necessary to keep it executable with the currently supported code and
dependencies.

Migration classes may be evaluated years after they were written, including
during a fresh installation. Avoid depending on mutable application
implementation classes whose behavior or constructor may change. Prefer stable
public APIs from the ``OCP`` namespace and keep migration-specific logic within
the migration when practical.

Schema operations should normally be guarded with methods such as
``hasTable()``, ``hasColumn()``, and ``hasIndex()``. This makes the intended
behavior explicit and helps retained migrations tolerate compatible database
states.

Return the schema only if the migration changed it. If no schema change is
required, return ``null``.

Construction of migration classes
---------------------------------

Migration classes are normally instantiated through Nextcloud's
:ref:`dependency-injection` container. Public services required by a migration
can therefore be declared as constructor arguments.

For example, inject ``\OCP\IDBConnection`` when a migration needs to execute
database queries:

.. code-block:: php

   use Closure;
   use OCP\DB\ISchemaWrapper;
   use OCP\IDBConnection;
   use OCP\Migration\IOutput;
   use OCP\Migration\SimpleMigrationStep;
   use Override;

   class Version2404Date20220903071748 extends SimpleMigrationStep {
       public function __construct(
           private readonly IDBConnection $db,
       ) {
       }

       #[Override]
       public function postSchemaChange(
           IOutput $output,
           Closure $schemaClosure,
           array $options,
       ): void {
           $query = $this->db->getQueryBuilder();
           // Execute the required data migration.
       }
   }

Use public ``OCP`` services where possible. Depending on an app service that is
later renamed, removed, or given new required constructor arguments can prevent
an old migration from being instantiated.

Example: replacing a column
---------------------------

Replacing or renaming a populated column should normally be split across
multiple migrations:

#. Add the replacement column.
#. Copy existing data in ``postSchemaChange()``.
#. Apply the final constraints and drop the old column in a later migration.

The old column must not be removed in the same schema phase that adds the new
column because the data copy runs only after that schema phase has completed.

Migration 1: add and populate the replacement column
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The first migration adds the replacement column and copies existing values
after the schema change:

.. code-block:: php

   <?php

   declare(strict_types=1);

   namespace OCA\MyApp\Migration;

   use Closure;
   use OCP\DB\ISchemaWrapper;
   use OCP\DB\Types;
   use OCP\IDBConnection;
   use OCP\Migration\Attributes\AddColumn;
   use OCP\Migration\Attributes\ColumnType;
   use OCP\Migration\IOutput;
   use OCP\Migration\SimpleMigrationStep;
   use Override;

   #[AddColumn(
       table: 'twofactor_backupcodes',
       name: 'user_id',
       type: ColumnType::STRING,
       description: 'Replacement for the uid column',
   )]
   class Version1000Date20260825090000 extends SimpleMigrationStep {
       public function __construct(
           private readonly IDBConnection $db,
       ) {
       }

       #[Override]
       public function changeSchema(
           IOutput $output,
           Closure $schemaClosure,
           array $options,
       ): ?ISchemaWrapper {
           $schema = $schemaClosure();

           if (!$schema->hasTable('twofactor_backupcodes')) {
               return null;
           }

           $table = $schema->getTable('twofactor_backupcodes');

           if ($table->hasColumn('user_id')) {
               return null;
           }

           $table->addColumn('user_id', Types::STRING, [
               'notnull' => false,
               'length' => 64,
               'default' => null,
           ]);

           return $schema;
       }

       #[Override]
       public function postSchemaChange(
           IOutput $output,
           Closure $schemaClosure,
           array $options,
       ): void {
           $schema = $schemaClosure();

           if (!$schema->hasTable('twofactor_backupcodes')) {
               return;
           }

           $table = $schema->getTable('twofactor_backupcodes');
           if (
               !$table->hasColumn('uid')
               || !$table->hasColumn('user_id')
           ) {
               return;
           }

           $query = $this->db->getQueryBuilder();
           $query->update('twofactor_backupcodes')
               ->set('user_id', 'uid')
               ->where($query->expr()->isNull('user_id'));
           $query->executeStatement();
       }
   }

Passing the source column name directly to ``set()`` creates a
column-to-column assignment. Use ``createNamedParameter()`` or
``createParameter()`` instead when assigning a literal value.

The replacement column is nullable in this example so that it can be added
before existing rows are populated. Depending on the data and supported
databases, another valid approach is to add a non-null column with an
appropriate temporary default.

Restricting the update to rows where ``user_id`` is null makes the backfill
safer if it is interrupted or manually repeated during development.

Migration 2: finalize the replacement
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This example assumes that the source ``uid`` column is non-null and that every
row was copied successfully. If the source permits null values, preserve that
nullability or handle those values explicitly before applying a non-null
constraint.

A later migration applies the final constraint and removes the old column:

.. code-block:: php

   <?php

   declare(strict_types=1);

   namespace OCA\MyApp\Migration;

   use Closure;
   use OCP\DB\ISchemaWrapper;
   use OCP\Migration\Attributes\ColumnType;
   use OCP\Migration\Attributes\DropColumn;
   use OCP\Migration\Attributes\ModifyColumn;
   use OCP\Migration\IOutput;
   use OCP\Migration\SimpleMigrationStep;
   use Override;

   #[ModifyColumn(
       table: 'twofactor_backupcodes',
       name: 'user_id',
       type: ColumnType::STRING,
       description: 'Make the replacement user identifier non-null',
   )]
   #[DropColumn(
       table: 'twofactor_backupcodes',
       name: 'uid',
       description: 'Replaced by user_id',
   )]
   class Version1000Date20260825091000 extends SimpleMigrationStep {
       #[Override]
       public function changeSchema(
           IOutput $output,
           Closure $schemaClosure,
           array $options,
       ): ?ISchemaWrapper {
           $schema = $schemaClosure();

           if (!$schema->hasTable('twofactor_backupcodes')) {
               return null;
           }

           $table = $schema->getTable('twofactor_backupcodes');

           if (!$table->hasColumn('user_id')) {
               return null;
           }

           $table->modifyColumn('user_id', [
               'notnull' => true,
               'length' => 64,
           ]);

           if ($table->hasColumn('uid')) {
               $table->dropColumn('uid');
           }

           return $schema;
       }
   }

On an upgrade, the post-schema phase of the first migration copies the existing
data before the second migration removes the old column. On a fresh
installation, only the schema phases run, and their combined result contains
the final non-null ``user_id`` column without the obsolete ``uid`` column.

Example: modifying and transforming a column
--------------------------------------------

Some migrations modify a column and then transform its existing values. For
example, increasing the length of a hash column must happen before replacing
short hashes with longer hashes.

The schema change belongs in ``changeSchema()``:

.. code-block:: php

   use Closure;
   use OCP\DB\ISchemaWrapper;
   use OCP\IDBConnection;
   use OCP\Migration\Attributes\ColumnType;
   use OCP\Migration\Attributes\ModifyColumn;
   use OCP\Migration\IOutput;
   use OCP\Migration\SimpleMigrationStep;

   #[ModifyColumn(
       table: 'jobs',
       name: 'argument_hash',
       type: ColumnType::STRING,
       description: 'Increase the column size for SHA-256 hashes',
   )]
   class Version1000Date20260825100000 extends SimpleMigrationStep {
       public function __construct(
           private readonly IDBConnection $connection,
       ) {
       }

       public function changeSchema(
           IOutput $output,
           Closure $schemaClosure,
           array $options,
       ): ?ISchemaWrapper {
           $schema = $schemaClosure();

           if (!$schema->hasTable('jobs')) {
               return null;
           }

           $table = $schema->getTable('jobs');

           if (!$table->hasColumn('argument_hash')) {
               return null;
           }

           $table->modifyColumn('argument_hash', [
               'notnull' => false,
               'length' => 64,
           ]);

           return $schema;
       }

       // postSchemaChange() follows below.
   }

The dependent data transformation belongs in ``postSchemaChange()``.

Processing data in batches
--------------------------

Data transformations can take significant time on large tables. Process large
result sets in bounded batches when practical.

The following example uses increasing primary-key values rather than offsets.
This avoids repeatedly scanning and skipping previously processed rows:

.. code-block:: php

   use OCP\DB\QueryBuilder\IQueryBuilder;

   public function postSchemaChange(
       IOutput $output,
       Closure $schemaClosure,
       array $options,
   ): void {
       $chunkSize = 1000;
       $lastId = 0;

       $update = $this->connection->getQueryBuilder();
       $update->update('jobs')
           ->set(
               'argument_hash',
               $update->createParameter('argument_hash'),
           )
           ->where(
               $update->expr()->eq(
                   'id',
                   $update->createParameter('id'),
               ),
           );

       do {
           $select = $this->connection->getQueryBuilder();
           $select->select('id', 'argument')
               ->from('jobs')
               ->where(
                   $select->expr()->gt(
                       'id',
                       $select->createNamedParameter(
                           $lastId,
                           IQueryBuilder::PARAM_INT,
                       ),
                   ),
               )
               ->orderBy('id', 'ASC')
               ->setMaxResults($chunkSize);

           $result = $select->executeQuery();
           $rows = $result->fetchAllAssociative();
           $result->closeCursor();

           foreach ($rows as $row) {
               $id = (int)$row['id'];
               $argument = (string)$row['argument'];

               $update->setParameter(
                   'argument_hash',
                   hash('sha256', $argument),
                   IQueryBuilder::PARAM_STR,
               );
               $update->setParameter(
                   'id',
                   $id,
                   IQueryBuilder::PARAM_INT,
               );
               $update->executeStatement();

               $lastId = $id;
           }

           $output->debug(
               'Updated ' . count($rows) . ' background job hashes',
           );
       } while (count($rows) === $chunkSize);
   }

Important considerations for batched migrations include:

* Select only the columns needed by the transformation.
* Use an explicit and stable ordering.
* Prefer key-based pagination on a unique, monotonically ordered column over
  increasing offsets for large tables.
* Use typed query parameters.
* Close database cursors before executing further queries when practical.
* Consider how concurrent inserts or updates could affect the selected rows.
* Keep individual queries and transactions small enough for large
  installations and database clusters.
* Log progress through ``IOutput`` when a migration may take noticeable time.

Key-based pagination prevents rows from being skipped because earlier rows
were inserted or removed. It does not isolate the migration from concurrent
updates. If the application can write to the affected table during an upgrade,
design the transformation to be idempotent and determine whether newly
inserted rows require processing.

The correct batching strategy depends on the table and transformation. For
small tables, one set-based ``UPDATE`` can be simpler and faster than reading
and updating individual rows.

Set-based updates
-----------------

When every row can be transformed using the same database expression, prefer a
set-based update:

.. code-block:: php

   $query = $this->connection->getQueryBuilder();
   $query->update('user_status')
       ->set('status_message_timestamp', 'status_timestamp');
   $query->executeStatement();

When assigning a literal value, bind it as a parameter:

.. code-block:: php

   $query = $this->connection->getQueryBuilder();
   $query->update('oauth2_access_tokens')
       ->set(
           'token_count',
           $query->createNamedParameter(
               1,
               IQueryBuilder::PARAM_INT,
           ),
       );
   $query->executeStatement();

Migration metadata
------------------

Since Nextcloud 30, migration classes can contain repeatable PHP attributes
that describe their effects to administrators.

The attributes are metadata only. They do not perform, validate, or
automatically infer the corresponding schema or data change. Keep the metadata
consistent with the implementation of the migration.

For example:

.. code-block:: php
   :emphasize-lines: 7-19

   use Closure;
   use OCP\DB\ISchemaWrapper;
   use OCP\Migration\Attributes\ColumnType;
   use OCP\Migration\Attributes\CreateTable;
   use OCP\Migration\Attributes\ModifyColumn;
   use OCP\Migration\IOutput;
   use OCP\Migration\SimpleMigrationStep;

   #[CreateTable(
       table: 'new_table',
       description: 'Stores things processed by the app',
       notes: [
           'Creation can take additional time on large installations',
       ],
   )]
   #[ModifyColumn(
       table: 'other_table',
       name: 'this_field',
       type: ColumnType::BIGINT,
   )]
   class Version30000Date20240729185117 extends SimpleMigrationStep {
       public function changeSchema(
           IOutput $output,
           Closure $schemaClosure,
           array $options,
       ): ?ISchemaWrapper {
           // Implement the changes described by the attributes.
       }
   }

Available migration attributes include:

* ``\OCP\Migration\Attributes\AddColumn`` for adding a column.
* ``\OCP\Migration\Attributes\AddIndex`` for adding an index.
* ``\OCP\Migration\Attributes\CreateTable`` for creating a table.
* ``\OCP\Migration\Attributes\DataCleansing`` for cleansing data in a table.
* ``\OCP\Migration\Attributes\DropColumn`` for dropping a column.
* ``\OCP\Migration\Attributes\DropIndex`` for dropping an index.
* ``\OCP\Migration\Attributes\DropTable`` for dropping a table.
* ``\OCP\Migration\Attributes\ModifyColumn`` for modifying a column.

``DataCleansing`` is available since Nextcloud 32.

Attributes can contain a human-readable ``description`` and a list of
``notes``. Depending on the attribute, additional properties describe the
table, column, column type, index type, or affected columns.

It is valid to repeat an attribute when a migration performs multiple changes
of the same kind:

.. code-block:: php

   #[ModifyColumn(
       table: 'jobs',
       name: 'argument_hash',
       type: ColumnType::STRING,
       description: 'Increase the column size from 32 to 64',
   )]
   #[ModifyColumn(
       table: 'jobs',
       name: 'argument_hash',
       type: ColumnType::STRING,
       description: 'Rehash existing values using SHA-256',
   )]
   class Version28000Date20240828142927 extends SimpleMigrationStep {
       // ...
   }

.. _migration_console_command:

Console commands
----------------

The following ``occ`` commands help create, inspect, and execute migrations::

 migrations
  migrations:execute  Execute a single migration version manually
  migrations:generate Generate a new migration file for an app
  migrations:migrate  Execute pending migrations up to a target
  migrations:preview  Preview migration metadata for an upgrade
  migrations:status   View a migration status summary for an app

These commands are primarily development and administration tools. Normal app
installation and upgrade processes execute the required migrations
automatically.

migrations:execute
~~~~~~~~~~~~~~~~~~

Execute one migration manually.

The ``version`` argument is the migration identifier: the class name without
the ``Version`` prefix. For example, the identifier for
``Version2404Date20220903071748`` is ``2404Date20220903071748``:

.. code-block:: console

   sudo -E -u www-data php occ migrations:execute myapp 2404Date20220903071748

This command directly executes the selected migration's pre-schema, schema,
and post-schema phases and then records it as executed.

Without debug mode, the command refuses identifiers that are already recorded
as executed. It also rejects the reserved values ``0`` and ``prev``. It does
not implement a migration rollback.

During development, debug mode can be enabled in ``config/config.php``:

.. code-block:: php

   'debug' => true,

Debug mode permits an already recorded migration to be executed again. Use
this only in a disposable development environment. Migration code is not
required to be safely repeatable, and rerunning a data migration can corrupt or
duplicate data.

migrations:generate
~~~~~~~~~~~~~~~~~~~

Generate a migration class for an app:

.. code-block:: console

   sudo -E -u www-data php occ migrations:generate myapp 1000

The ``version`` argument is the app-version prefix used to order migrations
from parallel development branches. The expected value is calculated as:

.. code-block:: text

   major * 1000 + minor

Examples include:

.. code-block:: text

   App version 1.0.x  -> 1000
   App version 2.34.x -> 2034
   App version 30.0.x -> 30000

Only decimal digits are accepted, with a maximum length of 16 digits. If the
provided value differs from the value calculated from the current app version,
the command emits a warning and, in interactive mode, asks whether it should
continue.

The command appends the current timestamp and generates a class name such as:

.. code-block:: text

   Version1000Date20260825090000

The file is written to:

.. code-block:: text

   <resolved-app-path>/lib/Migration/

The generated class contains empty ``preSchemaChange()`` and
``postSchemaChange()`` methods and a ``changeSchema()`` method that initially
returns ``null``. Remove unused methods or implement the required migration
logic.

If the app uses a Composer-generated class map or another generated autoloader,
regenerate that autoloader after creating the class. For Composer-based
autoloaders, this can require:

.. code-block:: console

   composer dump-autoload

migrations:migrate
~~~~~~~~~~~~~~~~~~

Execute all pending migrations for an app:

.. code-block:: console

   sudo -E -u www-data php occ migrations:migrate myapp

Without an explicit target, the command runs all pending migrations and is
equivalent to targeting ``latest``:

.. code-block:: console

   sudo -E -u www-data php occ migrations:migrate myapp latest

An explicit migration identifier can be supplied to execute pending migrations
up to that ordering boundary:

.. code-block:: console

   sudo -E -u www-data php occ migrations:migrate myapp 2404Date20220903071748

Use a complete migration identifier, including its app-version and ``Date``
components.

This command only executes migrations that are not recorded as completed. It
does not roll back migrations or remove completed migration records. Do not
use ``prev``, ``next``, or ``first`` as rollback or navigation operations.

migrations:preview
~~~~~~~~~~~~~~~~~~

Preview administrator-facing migration metadata for a proposed upgrade without
executing the migrations:

.. code-block:: console

   sudo -E -u www-data php occ migrations:preview 30.0.0

The command obtains release metadata for the destination version and filters
out migrations already known to the local installation. It displays metadata
for core and relevant apps. Apps that do not provide migration metadata are
reported separately because they might still run migrations during the
upgrade.

The argument can also be:

* A URL from which release metadata can be downloaded.
* An absolute path, beginning with ``/``, to a local JSON metadata file.

For example:

.. code-block:: console

   sudo -E -u www-data php occ migrations:preview https://example.test/metadata.json
   sudo -E -u www-data php occ migrations:preview /tmp/metadata.json

Only use metadata from a trusted source.

The preview is based on published migration metadata. It does not execute the
migration classes and cannot predict unreported effects of migrations whose
attributes are absent or incomplete.

migrations:status
~~~~~~~~~~~~~~~~~

Display a migration status summary for an app:

.. code-block:: console

   sudo -E -u www-data php occ migrations:status myapp

The summary includes information such as:

* The migrations table, namespace, and directory.
* Previous, current, next, and latest migration identifiers.
* Summary information about executed, available, unavailable, and new
  migrations.
* Human-readable descriptions of pending migrations when those migrations
  implement non-empty ``name()`` and ``description()`` methods.

The command presents a summary; it does not list every executed and pending
migration identifier.

Adding indices
--------------

Adding an index to an existing large table can take significant time. Instead
of adding such an index in a normal app migration, an app can declare it using
``AddMissingIndicesEvent``. Administrators can then add the index separately
using the database maintenance command.

Register a listener in the app's bootstrap class:

.. code-block:: php

   use OCA\MyApp\Listener\AddMissingIndicesListener;
   use OCP\AppFramework\Bootstrap\IRegistrationContext;
   use OCP\DB\Events\AddMissingIndicesEvent;

   public function register(IRegistrationContext $context): void {
       $context->registerEventListener(
           AddMissingIndicesEvent::class,
           AddMissingIndicesListener::class,
       );
   }

Implement the listener:

.. code-block:: php

   namespace OCA\MyApp\Listener;

   use OCP\DB\Events\AddMissingIndicesEvent;
   use OCP\EventDispatcher\Event;
   use OCP\EventDispatcher\IEventListener;

   /**
    * @template-implements IEventListener<AddMissingIndicesEvent>
    */
   class AddMissingIndicesListener implements IEventListener {
       public function handle(Event $event): void {
           if (!$event instanceof AddMissingIndicesEvent) {
               return;
           }

           $event->addMissingIndex(
               'my_table',
               'my_index',
               ['column_a', 'column_b'],
           );
       }
   }

The arguments to ``addMissingIndex()`` are:

.. code-block:: php

   addMissingIndex(
       string $tableName,
       string $indexName,
       array $columns,
       array $options = [],
       bool $dropUnnamedIndex = false,
   ): void

Set ``dropUnnamedIndex`` to ``true`` when an existing unnamed index covering
exactly the same columns should be removed before the named index is added.

To request a unique index, use ``addMissingUniqueIndex()``:

.. code-block:: php

   $event->addMissingUniqueIndex(
       'my_table',
       'my_unique_index',
       ['column_a', 'column_b'],
   );

Declaring an index through this event does not add it during normal app
migration execution. The declaration is consumed by database setup checks and
by the following command:

.. code-block:: console

   sudo -E -u www-data php occ db:add-missing-indices

To print the schema operations without applying them, use:

.. code-block:: console

   sudo -E -u www-data php occ db:add-missing-indices --dry-run

Keep the listener registered after releasing the change. It must remain
available to installations that have not run the maintenance command yet.

Replacing indices
-----------------

.. versionadded:: 29.0.0

Use ``replaceIndex()`` when one or more existing indices should be replaced
with a new index. This can be used, for example, to:

* Replace a non-unique index with a unique index.
* Merge multiple single-column indices into a multi-column index.
* Change the columns or options of an existing index while using a new name.

The maintenance command creates the new index before removing the old indices,
avoiding a period where none of the indices exist.

If the new index already exists, the replacement is skipped. Otherwise,
Nextcloud:

#. Creates the new index.
#. Applies that schema change.
#. Removes any named old indices that exist.
#. Applies the removal schema change.

If none of the old indices exist, the new index is still treated as a missing
index and is created.

Do not reuse one of the old index names as the new index name.

.. code-block:: php

   namespace OCA\MyApp\Listener;

   use OCP\DB\Events\AddMissingIndicesEvent;
   use OCP\EventDispatcher\Event;
   use OCP\EventDispatcher\IEventListener;

   /**
    * @template-implements IEventListener<AddMissingIndicesEvent>
    */
   class ReplaceIndicesListener implements IEventListener {
       public function handle(Event $event): void {
           if (!$event instanceof AddMissingIndicesEvent) {
               return;
           }

           $event->replaceIndex(
               'my_table',
               ['my_old_index_one', 'my_old_index_two'],
               'my_new_index',
               ['column_a', 'column_b'],
               false,
           );
       }
   }

The arguments to ``replaceIndex()`` are:

.. code-block:: php

   replaceIndex(
       string $tableName,
       array $oldIndexNames,
       string $newIndexName,
       array $columns,
       bool $unique,
       array $options = [],
   ): void

Set ``unique`` to ``true`` to create a unique replacement index. The optional
``options`` array is passed to the schema API when the new index is created.
