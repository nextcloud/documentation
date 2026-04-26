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

``\OCP\DB\QueryBuilder\ITypedQueryBuilder`` was added in favour of ``\OCP\DB\QueryBuilder\IQueryBuilder`` and can be
accessed through ``\OCP\IDBConnection::getTypedQueryBuilder``.

This query builder has the benefit of accurately returning the selected columns in a query result, increasing type
safety.

.. todo:: This linked page does not have coverage for the new API.

See :ref:`database` for details.
