.. _snowflake_ids:

=============
Snowflake IDs
=============

.. versionadded:: 33

Nextcloud integrates a customized version of Snowflake IDs (https://en.wikipedia.org/wiki/Snowflake_ID).

It allows to generates unique IDs in advance and also contains information about creation:
 - creation time at millisecond precision
 - identifier of server which created the ID. It's usually a hash of server hostname or random if not hostname found.
 - whether the ID was created from CLI or not

Store a Snowflake ID in database
--------------------------------

Snowflake IDs are designed to be used as primary key in database.
They should be stored as ``UNSIGNED BIGINT`` (64 bits integer, always positive)

In Nextcloud migrations it looks like:

.. code-block:: php

    public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
        /** @var ISchemaWrapper $schema */
        $schema = $schemaClosure();

        if (!$schema->hasTable('my_table')) {
            $table = $schema->createTable('my_table');
            $table->addColumn(
                'id', 
                Types::BIGINT, 
                ['notnull' => true, 'unsigned' => true]
            );
            $table->setPrimaryKey(['id']);

            // TODO Add other fields
        }


Generate a Snowflake ID
-----------------------

To generate a new ID, call ``nextId`` function on the generator: 

.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp;

    use OCP\Snowflake\IGenerator;

    class MyObjectFactory {
        public function __construct(
         		private readonly IGenerator $generator,
        ) {
          // TODO Add your implementation
        }

        public function create(): MyObject {
            /** @var string $id */
            $id = $this->generator->nextId();

            // TODO Create other properties and insert into database
        }
    }


Decode a Snowflake ID
---------------------

IDs can be decoded with ``occ snowflake:decode <id>`` command.

It’s also possible to decode IDs in your code, for example to get creation time of your object:


.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp;

    use DateTimeImmutable
    use OCP\Snowflake\IDecoder;

    class MyObject {
        private string $id; 

        public function __construct(
         		private readonly IDecoder $decoder,
        ) {
          // TODO Add your implementation
        }

        public function createdAt(): DateTimeImmutable {
            return $this->decoder->decode($this->id)['createdAt'];
        }
    }
