=======================
Upgrade to Nextcloud 33
=======================

Front-end changes
-----------------

Added APIs
^^^^^^^^^^

- TBD

Changed APIs
^^^^^^^^^^^^

- TBD

Deprecated APIs
^^^^^^^^^^^^^^^

- TBD

Removed APIs
^^^^^^^^^^^^

- The global ``md5`` implementation is removed. It was deprecated since Nextcloud 20 and not used by Nextcloud anymore.
  If you still need a ``md5`` implementation you can just use some external package like `crypto-browserify <https://www.npmjs.com/package/crypto-browserify>`_.
- ``OC.AppConfig`` was deprecated since Nextcloud 16 and was now removed. Instead use ``OCP.AppConfig``.
- The ``OC.SystemTags`` api was removed. If you need to get the list of system tags, check `this merge request <https://github.com/nextcloud/files_retention/pull/855>`_ for how to fetch the tags directly.
- ``OC.set`` and ``OC.get`` were removed. Both are deprecated since Nextcloud 19.
  For ``get``, if really needed, use `lodash get <https://lodash.com/docs#get>`_.
  And for ``set``, use `lodash set <https://lodash.com/docs#set>`_.
- ``OC.redirect`` and ``OC.reload`` were removed. Both were deprecated since Nextcloud 17.
  To replace ``OC.redirect`` directly use ``window.location``.
  To replace ``OC.reload`` directly use ``window.location.reload``.
- ``OC.fileIsBlacklisted`` was removed. It was deprecated since Nextcloud 18.
  The replacement is to use ``validateFilename`` from the `@nextcloud/files <https://www.npmjs.com/package/@nextcloud/files>`_ package.
- The deprecated host methods from `OC` were deprecated since Nextcloud 17 and are now removed

  - To replace ``OC.getHost`` use ``window.location.host``.
  - To replace ``OC.getHostName`` use ``window.location.hostname``.
  - To replace ``OC.getPort`` use ``window.location.port``.
  - To replace ``OC.getProtocol`` use ``window.location.protocol``.

- The ``OCA.Sharing.ExternalLinkActions`` API was deprecated in Nextcloud 23 and is now removed.
  It was replaced with ``OCA.Sharing.ExternalShareAction`` which now have a proper API by using ``registerSidebarAction`` from `@nextcloud/sharing <https://www.npmjs.com/package/@nextcloud/sharing>`_ instead.

Back-end changes
----------------

Support for PHP 8.1 removed
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this release support for PHP 8.1 was removed. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``min-version`` to 8.2.

.. code-block:: xml

  <dependencies>
    <php min-version="8.2" max-version="8.4" />
    <nextcloud min-version="31" max-version="33" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.2 <=8.4"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, remove PHP 8.1 from the matrices of tests and linters.

Default user agent for outgoing requests changed
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Starting with this release, the default user agent for requests done by the instance was changed from ``Nextcloud Server Crawler`` to ``Nextcloud-Server-Crawler/X.Y.Z``, where ``X.Y.Z`` is the current server version.

Added Events
^^^^^^^^^^^^

- TBD

Added APIs
^^^^^^^^^^

- We now expose ``\OCP\DB\IResult::iterateAssociative``, ``\OCP\DB\IResult::iterateNumeric`` from doctrine/dbal.
  These two methods returns iterators that can be directly used in a `foreach` to iterate over a SQL query result.
  For example:

.. code-block:: php

    $result = $qb->executeQuery();
    foreach ($result->iterateAssociative() as $row) {
        $id = $row['id'];
    }
    $result->closeCursor();

Changed APIs
^^^^^^^^^^^^

- TBD

Deprecated APIs
^^^^^^^^^^^^^^^

- The ``\OCP\DB\IResult::fetch`` and ``\OCP\DB\IResult::fetchAll`` are soft-deprecated. Instead you can use
  ``\OCP\DB\IResult::fetchAssociative``, ``\OCP\DB\IResult::fetchNumeric`` and ``\OCP\DB\IResult::fetchOne``
  as replacement for ``\OCP\DB\IResult::fetch``; and ``\OCP\DB\IResult::fetchAllAssociative``,
  ``\OCP\DB\IResult::fetchAllNumeric`` and ``\OCP\DB\IResult::fetchFirstColumn`` as replacement for 
  ``\OCP\DB\IResult::fetchAll``. If you use rector, you can use the Nextcloud33 set, to automatically port
  most of your code to the new methods.

Removed APIs
^^^^^^^^^^^^

- The ``\OCP\BackgroundJob\IJob::execute`` method was deprecated since Nextcloud 25 and was now removed.
  Instead use the ``IJob::start`` method, available since Nextcloud 25.
- The ``\OCP\Search\PagedProvider``, ``\OCP\Search\Provider`` and ``\OCP\Search\Result`` classes were
  deprecated since Nextcloud 20 and were now removed. Instead use ``\OCP\Search\SearchResult`` and
  ``\OCP\Search\IProvider``, available since Nextcloud 20.
