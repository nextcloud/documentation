.. _new-apis:

===================
New in this release
===================

This pages covers new features of the platform.

..
    Add one section for each new feature.
    Every feature should just have a brief description. Details have to be documented on a dedicated, persistent page.
    After branch-off the contents below will be cleared.

Typed query builder
-------------------

``\OCP\DB\QueryBuilder\ITypedQueryBuilder`` was added in favour of ``\OCP\DB\QueryBuilder\IQueryBuilder`` and can be accessed through ``\OCP\IDBConnection::getTypedQueryBuilder``.

This query builder has the benefit of accurately returning the selected columns in a query result, increasing type safety.

.. todo:: This linked page does not have coverage for the new API.

See :ref:`database` for details.

Expensive post migration repair steps
-------------------------------------

``\OCP\Migration\IRepairStepExpensive`` was added and can be used to mark post-migration repair steps as expensive.

Expensive repair steps are non-critical repair steps that might take a long time to execute.
Non-critical means that they are not required to directly be executed during migration to have a working instance,
but they might be required to have a fully working instance later on.

Expensive repair steps are only executed when explicitly requested by the administrator.

See :ref:`migration-repair-steps` for details.

Task Processing
---------------

Added APIs
^^^^^^^^^^

- There is a new TaskProcessing provider interface: ``\OCP\TaskProcessing\ISynchronousOptionsAwareProvider``. It takes a ``\OCP\TaskProcessing\SynchronousProviderOptions`` option object that contains includeWatermarks, preferStreaming and the callback to report intermediate output.

Changed APIs
^^^^^^^^^^^^

- The ``\OCP\TaskProcessing\Task`` class now has ``getPreferStreaming`` and ``setPreferStreaming`` methods for indicating whether the provider should report the output progressively if it supports it.
- The TaskProcessing OCS API now also accepts the ``preferStreaming`` flag when scheduling tasks.
