=======================
Upgrade to Nextcloud 33
=======================

Front-end changes
-----------------

Files API
^^^^^^^^^

Breaking changes in the Files API package
"""""""""""""""""""""""""""""""""""""""""

The ``nextcloud/files`` library was updated to version v4.0.0 in Server.
This release includes breaking API changes, so you’ll need to update your code in time for Server 33.

To improve developer experience, we’ve expanded the context object passed to file actions.
It now includes additional fields such as the current folder and the current file list.
Function signatures have also changed: Action handlers now use destructured parameters instead of positional array arguments.

You can find the full changelog and migration details in the repository: `nextcloud-files (4.0.0 beta) <https://github.com/nextcloud-libraries/nextcloud-files>`_.

Sidebar
"""""""

The files API was changed in this release to use the Node API (available since Nextcloud 27) instead of the legacy ``FileInfo`` API.
For this the way to register sidebar tabs and actions has changed.
The ``OCA.Files.Sidebar`` API was removed and replaced with a new sidebar API available from the `@nextcloud/files <https://www.npmjs.com/package/@nextcloud/files>`_ package.

To register sidebar tabs you now have to use the new API which is based on web components,
for more details please refer to the changelog of the ``@nextcloud/files`` package.

If you used the Files sidebar within your app you have to now use your own sidebar using the ``NcAppSidebar`` component from the `@nextcloud/vue <https://www.npmjs.com/package/@nextcloud/vue>`_ package.

Otherwise if you already use your own sidebar implementation in your app but rely on the Viewer app to open the sidebar using the ``OCA.Files.Sidebar`` API,
you now have to listen to the ``viewer:sidebar:open`` event-bus event from the Viewer app to open your sidebar.
So enable the **open sidebar** action within the viewer you have to set ``enabledSidebar``
when opening the viewer to allow opening the sidebar from within the viewer and listen for the mentioned event.

Profile app
^^^^^^^^^^^

To make the profile sections API framework agnostic, allowing us to migrate the profile app to Vue 3
while still allow external apps to use Vue 2 based profile section,
the ``OCA.Core.ProfileSections`` API was replaced with ``OCA.Profile.ProfileSections``
which uses custom web components instead of being based on Vue components.

As of Nextcloud 33 the ``OCA.Profile.ProfileSections.registerSection`` method accepts
a section object in the following format:

.. code-block:: typescript

  interface ProfileSection {
    /**
     * Unique identifier for the section
     */
    id: string
    /**
     * The order in which the section should appear (lower numbers appear first)
     */
    order: number
    /**
     * The custom element tag name to be used for this section
     *
     * The custom element must have been registered beforehand,
     * and must have the a `user` property of type `string | undefined`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components
     */
    tagName: string
    /**
     * Static parameters to be passed to the custom web component
     */
    params?: Record<string, unknown>
  }


Added APIs
^^^^^^^^^^

- ``OCA.Profile.ProfileSections`` was added as a framework agnostic replacement for ``OCA.Core.ProfileSections``.
  See section about the profile app above.

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
- The ``OC.Settings.UserSettings`` api was removed.
- The ``OC.SystemTags`` api was removed. If you need to get the list of system tags,
  check `this merge request <https://github.com/nextcloud/files_retention/pull/855>`_ for how to fetch the tags directly.
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

- The ``OCA.Core.ProfileSections`` API was removed and replaced with the framework agnostic ``OCA.Profile.ProfileSections`` API.
  See section about the profile app above.

- The ``OCA.Files.Sidebar`` API is removed.
  This was the last API using the legacy ``FileInfo`` API.
  It is now replaced with the new Node based sidebar API available from the `@nextcloud/files <https://www.npmjs.com/package/@nextcloud/files>`_ package.

- The ``OCA.Sharing.ExternalLinkActions`` API was deprecated in Nextcloud 23 and is now removed.
  It was replaced with ``OCA.Sharing.ExternalShareAction`` which now have a proper API by using ``registerSidebarAction`` from `@nextcloud/sharing <https://www.npmjs.com/package/@nextcloud/sharing>`_ instead.

Back-end changes
----------------

Support for PHP 8.5 added
^^^^^^^^^^^^^^^^^^^^^^^^^

See below section for option code changes in your app and dependency management

Support for PHP 8.1 removed
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this release support for PHP 8.1 was removed. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``min-version`` to 8.2.

.. code-block:: xml

  <dependencies>
    <php min-version="8.2" max-version="8.5" />
    <nextcloud min-version="31" max-version="33" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.2 <=8.5"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, remove PHP 8.1 and add PHP 8.5 from the matrices of tests and linters.

Default user agent for outgoing requests changed
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Starting with this release, the default user agent for requests done by the instance was changed from ``Nextcloud Server Crawler`` to ``Nextcloud-Server-Crawler/X.Y.Z``, where ``X.Y.Z`` is the current server version.

Snowflake IDS
^^^^^^^^^^^^^

The following tables are now using snowflake ids:

- ``oc_previews``
- ``oc_jobs``
- ``oc_share_external``

The API related to these tables are now using a string instead of a int. See Changed APIs section and :doc:`/digging_deeper/snowflake_ids`.

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

- This version allows to expose some Nextcloud related metrics using OpenMetrics format.
  You can add your own exporters by implementing ``\OCP\OpenMetrics\IMetricFamily`` interface.
  See :doc:`/digging_deeper/openmetrics` for more information.

Changed APIs
^^^^^^^^^^^^

- The ``setId`` and ``getId`` methods of ``\OCP\BackgroundJob\IJob`` were changed to return/accept a string instead of an int. Same for ``\OCP\BackgroundJob\IJobList`` were some methods (``removedById``, ``getById`` and ``getDetailsById``) are now taking a string instead of an int. The string is suppose to be a snowflake id.
- The ``setObjectId`` and ``getObjectId`` methods of ``\OCP\Activity\IEvent`` were changed to return/accept a string in addition to an int. The string is suppose to be a snowflake id.

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
- The ``\OC_Util::runningOnMac()`` method was removed. Instead you can just check ``PHP_OS_FAMILY === 'Darwin'``.
- The ``\OCP\DB\IQueryBuilder::execute`` method was deprecated since Nextcloud 22 and was now removed.
  Instead use the ``\OCP\DB\IQueryBuilder::executeQuery`` when doing executing a ``SELECT`` query and ``\OCP\DB\IQueryBuilder::executeStatement``
  method when executing a ``UPDATE``, ``INSERT`` and ``DELETE`` statement, available since Nextcloud 20.

  Instead of catching a exceptions from the Doctrine DBAL package, you now need to catch ``OCP\DB\Exception``
  and check the `getReason``. For example, the following old code:

.. code-block:: php

    try {
        $qb->insert(...);
        $qb->execute();
    } catch (\Doctrine\DBAL\Exception\UniqueConstraintViolationException) {
        // Do stuff
    }

Should be replaced by the following code:

.. code-block:: php

    try {
        $qb->insert(...);
        $qb->executeStatement();
    } catch (\OCP\DB\Exception $e) {
        if ($e->getReason() !== \OCP\DB\Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
            throw $e;
        }

        // Do stuff
    }

- The ``\OCP\Files::buildNotExistingFileName`` and related private helper ``\OC_Helper::buildNotExistingFileName`` were deprecated since Nextcloud 14 and were now removed. Use ``\OCP\Files\Folder::getNonExistingName`` instead.
