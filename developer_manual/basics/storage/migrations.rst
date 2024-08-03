.. _app_db_migrations:

==========
Migrations
==========

Migrations change the database schema and operate in three steps:

* Pre schema changes
* Schema changes
* Post schema changes

Apps can have multiple migrations, which allows a way more flexible updating process.
For example, you can rename a column while copying all the content with 3 steps
packed in 2 migrations.

The Nextcloud updater logic will look for your migration
files in the apps `lib/Migration` folder.

.. note:: While in theory you can run any code in the pre- and post-steps, we
          recommend not to use actual php classes. With migrations you can update
          from any old version to any new version as long as the migration steps
          are retained. Since they are also used for installation, you should
          keep them anyway. But this also means when you change a php class which
          you use in your migration, the code may be executed on different
          database/file/code standings when being ran in an upgrade situation.

.. note:: Since Nextcloud stores, which migrations have been executed already
          you must not “update” migrations. The recommendation is to keep them
          untouched as long as possible. You should only adjust it to make sure
          it still executes, but additional changes to the database should be done
          in a new migration.

1. Migration 1: Schema change
-----------------------------

With this step the new column gets created:

.. code-block:: php

   public function changeSchema(IOutput $output, \Closure $schemaClosure, array $options) {
		      /** @var ISchemaWrapper $schema */
		      $schema = $schemaClosure();

		      $table = $schema->getTable('twofactor_backupcodes');

		      $table->addColumn('user_id', \OCP\DB\Types::STRING, [
		              'notnull' => true,
		              'length' => 64,
		      ]);

		      return $schema;
	 }


2. Migration 1: Post schema change
----------------------------------

In this step the content gets copied from the old to the new column.

.. note:: This could also be done as part of the second migration as part of
          a pre schema change

.. code-block:: php

   public function postSchemaChange(IOutput $output, \Closure $schemaClosure, array $options) {
          $query = $this->db->getQueryBuilder();
          $query->update('twofactor_backupcodes')
                  ->set('user_id', 'uid');
          $query->executeStatement();
   }

3. Migration 2: Schema change
-----------------------------

With this the old column gets removed.

.. code-block:: php

   public function changeSchema(IOutput $output, \Closure $schemaClosure, array $options) {
          /** @var ISchemaWrapper $schema */
          $schema = $schemaClosure();

          $table = $schema->getTable('twofactor_backupcodes');
          $table->dropColumn('uid');

          return $schema;
  }

Construction of migration classes
---------------------------------

All migration classes are constructed via :ref:`dependency-injection`. So if your migration
steps need additional dependencies, these can be defined in the constructor of your migration
class.

**Example:** If your migration needs to execute SQL statements, inject a `OCP\\IDBConnection`
instance into your migration class like this:

.. code-block:: php

   class Version2404Date20220903071748 extends SimpleMigrationStep {
      public function __construct(
         private IDBConnection $db
      ) {
      }

      public function postSchemaChange(IOutput $output, \Closure $schemaClosure, array $options) {
         $query = $this->db->getQueryBuilder();
         // execute some SQL ...
      }
   }

Migrations and Metadata
-----------------------

Since 30, details about migrations are available to administrator as metadata can be attached to your migration class by adding specific PHP Attributes:

.. code-block:: php
    :emphasize-lines: 5-10

    use OCP\Migration\Attributes\CreateTable;
    use OCP\Migration\Attributes\ColumnType;
    use OCP\Migration\Attributes\ModifyColumn;

    #[CreateTable(
        table: 'new_table',
        description: 'Table is used to store things, but also to get more things',
        notes: ['this is a notice', 'and another one, if really needed']
    )]
    #[ModifyColumn(table: 'other_table', name: 'this_field', type: ColumnType::BIGINT)]
    class Version30000Date20240729185117 extends SimpleMigrationStep {
        public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
	[...]
        }
    }


List of available Migration Attributes:

* ``\OCP\Migration\Attributes\AddColumn`` if your migration implies the creation of a new column
* ``\OCP\Migration\Attributes\AddIndex`` if your migration adds a new index
* ``\OCP\Migration\Attributes\CreateTable`` if your migration creates a new table
* ``\OCP\Migration\Attributes\DropColumn`` if your migration drops a column
* ``\OCP\Migration\Attributes\DropIndex`` if your migration drops an index
* ``\OCP\Migration\Attributes\DropTable`` if your migration drops a table
* ``\OCP\Migration\Attributes\ModifyColumn`` if your migration modifies a column

.. _migration_console_command:

Console commands
----------------

There are some console commands, which should help developers to create or deal
with migrations, which are only available if you are running your
Nextcloud **in debug mode**:

* `migrations:execute`: Executes a single migration version manually.
  The version argument is the class name of the migration, without the
  "Version" prefix. For example if your migration was named
  `Version2404Date20220903071748` the version would be `2404Date20220903071748`.
* `migrations:generate`:
  This is needed to create a new migration file. This takes 2 arguments,
  first one is the `appid`, the second one should be the `version`of your
  app as an integer. We recommend to use the major and minor digits of your apps
  version for that. This allows you to introduce a new migration in your branch
  for a Nextcloud version if there is already a migration path for a newer one
  in another branch. Since you can’t change this retroactive, we recommend to
  leave enough space in between and therefore map the numbers to 3 digits:
  `1.0.x => 1000`, `2.34.x => 2034`, etc.
* `migrations:migrate`: Execute a migration to a specified or the latest available version.
* `migrations:status`: View the status of a set of migrations.

.. note:: After generating a migration, you might need to run `composer dump-autoload`
   to be able to execute it.

Adding indices
--------------

Adding indices to existing tables can take long time, especially on large tables. Therefore it is recommended to not add the indices in the migration itself, but to indicate the index requirement to the server by adding a listener for the ``AddMissingIndicesEvent``. This way the migration can be executed in a separate step and do not block the upgrade process. For new installations the index should still be added to the migration that creates the table.

.. code-block:: php

   class AddMissingIndicesListener implements IEventListener {
      public function handle(Event $event): void {
         if (!$event instanceof AddMissingIndicesEvent) {
            return;
         }

         $event->addMissingIndex('my_table', 'my_index', ['column_a', 'column_b']);
      }
   }

Replacing indices
-----------------

.. versionadded:: 29.0.0

Similar to adding an index to an existing table, it could be necessary to replace one or more indices with a new one. To avoid a gap between dropping the old indices in a migration and adding the new one through ``AddMissingIndicesEvent``, it is possible to do both at once in ``AddMissingIndicesEvent``.

.. note:: Make sure to not use the same index name for the new index as for old indices.

.. code-block:: php

   class ReplaceIndicesListener implements IEventListener {
      public function handle(Event $event): void {
         if (!$event instanceof AddMissingIndicesEvent) {
            return;
         }

         $event->replaceIndex('my_table', ['my_old_index_one', 'my_old_index_two'], 'my_new_index', ['column_a', 'column_b'], false);
      }
   }
