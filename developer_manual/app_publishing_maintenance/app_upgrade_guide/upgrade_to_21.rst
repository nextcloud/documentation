=======================
Upgrade to Nextcloud 21
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/23210>`__. See the original ticket for links to the pull requests and tickets.

Back-end changes
----------------

The biggest change in Nextcloud 21 is the initial support for PHP 8 and the corresponding updates of many core dependencies, which could have direct and indirect consequences for apps.

PHP 8 support
^^^^^^^^^^^^^

Nextcloud 21 is the first major release that is compatible with the new PHP 8.0. As a consequence, some previously working syntax can cause problems when an app is deployed with PHP newer than 7.4. The full changelog can be found `on the php.net website <https://www.php.net/ChangeLog-8.php>`__. There is also a document for all breaking changes `on GitHub <https://github.com/php/php-src/blob/PHP-8.0/UPGRADING#L20>`__.

To check compatibility automatically we recommend adding or updating the :ref:`app-ci` of your app so that linters, tests and static analysis can warn you about any problems before the app is shipped to users.

Updated core libraries
^^^^^^^^^^^^^^^^^^^^^^

If apps use only official public APIs of Nextcloud, the update of core libraries should have little to no effect on apps. However, there are some edge cases where an app still has a code dependency to a library shipped with Nextcloud, e.g. when those 3rdparty classes or functions are used, and therefore app developers are recommended to check their code for any incompatibility. Moreover it's recommended to check compatibility with sophisticated tools, as documented at the  :ref:`static analysis<app-static-analysis>` section.

``doctrine/dbal``
*****************

The Doctrine Database Abstraction Layer powers Nextcloud's database connection and query builder. In Nextcloud 21, this dependency was updated from 2.x to 3.0. As a consequence, some types that were previously exported through the Nextcloud OCP API are removed or changed by this update. For backwards-compatibility, there is now a tiny compatibility layer between the original Doctrine API and what apps use via the Nextcloud API.

Optimistically speaking, the database connection and the query builder should mostly work like in Nextcloud 20 or older. The main differences are that prepared statements and query results are not handled by the removed Doctrine ``Statement`` but two new Nextcloud types ``IPreparedStatement`` and ``IResult``. You don't have to worry about these types unless you pass around the result of a query to class/method/function with type hints. In this rare case, please adjust the type hints accordingly for the new type if you only support Nextcloud 21 in your apps or remove the type hint temporarily for multi-version Nextcloud support.

Some (minor) breaking changes were inevitable. Here's the summary

* Many of the database connection methods have now a documented exception that can be thrown: ``\OCP\DB\Exception``. This also acts as a replacement for the removed ``\Doctrine\DBAL\DBALException``.
* ``$queryBuilder->execute()->fetch()`` only has one argument now (there were three previously)
* ``$queryBuilder->execute()->fetchColumn()`` has no more arguments and got also deprecated. Use ``fetchOne`` instead
* ``$queryBuilder->execute()->bindParam()`` was removed because conceptually it does not make sense to bind a parameter *after* executing a query. Use ``bindParam`` on the ``IPeparedStatement`` instead.
* ``$queryBuilder->execute()->bindValue()`` was removed because conceptually it does not make sense to bind a value *after* executing a query. Use ``bindValue`` on the ``IPeparedStatement`` instead.
* ``$queryBuilder->execute()->columnCount()`` was removed
* ``$queryBuilder->execute()->errorCode()`` was removed from Doctrine
* ``$queryBuilder->execute()->errorInfo()`` was removed from Doctrine
* ``$queryBuilder->execute()->setFetchMode()`` was removed from Doctrine
* ``$connection->prepare()->execute()`` previously returned ``false`` under some error conditions, it now always gives you an ``IResult`` or throws a ``\OCP\DB\Exception``.
* ``\Doctrine\DBAL\Types\Type::*`` type constants were moved, which some apps used for column type constants in apps. Use the new ``\OCP\DB\Types::*`` as a replacement.

The details of this change can also be seen in the `pull request on GitHub <https://github.com/nextcloud/server/pull/24948>`__ and in the upstream `dbal 3.0.xx upgrade document <https://github.com/doctrine/dbal/blob/3.0.x/UPGRADE.md>`__.

``guzzlehttp/guzzle``
*********************

The HTTP client library behind the Nextcloud HTTP client was updated for PHP 8 compatibility. The Nextcloud abstraction remained untouched and will work like before. If you used Guzzle directly, make sure you don't use the fluent API on requests or responses.

``psr/log``
***********

The :ref:`psr3` package was updated to v1.1. The ``log`` method can now theoretically throw an ``\Psr\Log\InvalidArgumentException``, though Nextcloud does not make use of this at the moment. It's recommended to check any usage of the method nevertheless and add error handling if appropriate.

``sabre/*``
***********

The Sabre packages received a minor update. Only apps that provide DAV functionality should be effected, if any.

App code checker deprecation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The app code checker (``occ app:check-code myapp``) is obsolete due to :ref:`static analysis<app-static-analysis>`. For Nextcloud 21 it will act as NOOP, meaning that you can still call the command but it will never fail. This allows you to still use it on CI if you test against 21, 20 and older releases. But prepare the switch to static analysis if you haven't already. Please also note that the app code checker hadn't received many updates recently, hence the number of issues it can detect is low.

PSR-0 deprecation
^^^^^^^^^^^^^^^^^

The original `PSR-0` standard was deprecated in 2014 and therefore the support for it in Nextcloud will also end soon. Hence we recommend migrating your class file names to `PSR-4`.

.. _`PSR-0`: https://www.php-fig.org/psr/psr-0/
.. _`PSR-4`: https://www.php-fig.org/psr/psr-4/

Last version with database.xml support and migration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud 21 is the last major release that supports an app's ``appinfo/database.xml`` to define the database schema. This is your last chance to automatically convert this deprecated file into the new migration classes using ``occ migrations:generate-from-schema``.

Replaced well-known handler API
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

There was an old, unused and unofficial mechanism to hook into well-known discovery via config settings. This includes ``host-meta``, ``host-meta.json``, ``nodeinfo`` and ``webfinger``. A :ref:`new public API replaces this mechanism<web-host-metadata>` in Nextcloud 21.

