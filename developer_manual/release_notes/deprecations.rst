============
Deprecations
============

In order to improve our platform we are phasing out some APIs. Deprecated APIs are not removed before ???,
unless the breakage can not be avoided.

We highly recommend using the `Nextcloud Rector <https://packagist.org/packages/nextcloud/rector>`_
rules, which can fix some API changes automatically.

Database result fetching
------------------------

The ``\OCP\DB\IResult::fetch`` and ``\OCP\DB\IResult::fetchAll`` are soft-deprecated. Instead you can use
``\OCP\DB\IResult::fetchAssociative``, ``\OCP\DB\IResult::fetchNumeric`` and ``\OCP\DB\IResult::fetchOne``
as replacement for ``\OCP\DB\IResult::fetch``; and ``\OCP\DB\IResult::fetchAllAssociative``,
``\OCP\DB\IResult::fetchAllNumeric`` and ``\OCP\DB\IResult::fetchFirstColumn`` as replacement for 
``\OCP\DB\IResult::fetchAll``.
