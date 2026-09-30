=======================
Upgrade to Nextcloud 35
=======================

Deprecations
------------

All deprecations that were announced in the :ref:`Deprecated APIs <deprecated-apis>` section.

Updated PHP requirements
------------------------

The support for PHP 8.2 has been dropped, the minimum supported PHP version of Nextcloud 35 is now 8.3.

Updated database requirements
-----------------------------

The following database versions are no longer supported as they are out of support by their respective vendors:

- MariaDB 10.6. The minimum supported version of MariaDB is now 10.11 LTS.
- MySQL 8.0. The minimum supported version of MySQL is now 8.4 LTS.

The following new database versions are supported, make sure to adjust your CI matrix for testing with them.
This is automatically done if you use the workflow templates provided by Nextcloud.

- MariaDB 12.3 is now supported.

  .. note:: In MariaDB 12+ the query parser is stricter, when using GROUP BY clauses.

    If you have constructs like ``SELECT `a`, CAST(`b` as CHAR) as `b` FROM `table` GROUP BY `a`, CAST(`b` as CHAR)``
    this will break as the GROUP BY clause will self reference the alias ``b``.
    Using a different alias name will fix MariaDB but not all other database systems, as then the cast expression is missing from the GROUP BY clause.
    So make this work on all supported database systems you need to use a subquery:

    .. code-block:: sql

      SELECT `a`, `b`
      FROM (
        SELECT `a`, CAST(`b` as CHAR) as `b`
        FROM `table`
      ) AS `subquery`
      GROUP BY `a`, `b`

- MySQL 9.7 is now supported.

  .. note:: MySQL 9+ deprecated support for MD5, so we strongly recommend to migrate away from the MD5 SQL function in your apps.

Updated 3rd party libraries
---------------------------

phpseclib 3.0
^^^^^^^^^^^^^

The ``phpseclib`` library has been updated from version 2 to version 3.
This is a breaking change, apps that rely on the library need to update to the new version,
this includes a new namespace (``\phpseclib3``).
Changes can be found on the `library's website <https://phpseclib.com/docs/why#phpseclib-30-vs-phspeclib-10--20>`__.

Symfony Console
^^^^^^^^^^^^^^^

Symfony Console was updated from version 6 to version 7. This changes the signature of the
``execute`` method, which now requires a return type declaration. If your commands still extend
``OC\Core\Command\Base`` and implement ``configure()``/``execute()``, fix them by running:

.. code-block:: bash

    find lib -iname '*.php' -exec sed -i 's/function execute(InputInterface $input, OutputInterface $output) {/function execute(InputInterface $input, OutputInterface $output): int {/g' {} \;

To insulate apps from breakage like this in the future, Nextcloud 35 also introduces a new,
attribute-based interface for writing commands that does not require extending a Symfony base class.
See :ref:`occ_commands` for the full documentation. Existing commands keep working unchanged (once
fixed with the command above), migrating to the new interface is optional but recommended.

Removed front-end APIs and libraries
------------------------------------

Removed global aliases
^^^^^^^^^^^^^^^^^^^^^^

The following global aliases were removed,
they have been deprecated since Nextcloud 17 and scheduled for removal since Nextcloud 20:

- ``oc_appswebroots`` use ``OC.appswebroots`` instead
- ``oc_config`` use ``OC.config`` instead
- ``oc_current_user`` use ``OC.getCurrentUser().uid`` instead
- ``oc_debug`` use ``OC.debug`` instead
- ``oc_defaults`` use ``OC.theme`` instead
- ``oc_isadmin`` use ``OC.isUserAdmin()`` instead
- ``oc_requesttoken`` use ``OC.requestToken`` instead
- ``oc_webroot`` use ``OC.webroot`` instead
- ``OCDialogs`` use ``OC.dialogs`` instead

Please keep in mind that ``OC`` is considered a private namespace for which our stability rules do not fully apply.
Its recommended to use the :ref:`Nextcloud frontend libraries<js-libraries>` instead if possible.

Removed global libraries
^^^^^^^^^^^^^^^^^^^^^^^^

The following global libraries were removed,
they have been deprecated since Nextcloud 17 and scheduled for removal since Nextcloud 20:

* ``_`` (underscore) use modern ES2015+ syntax instead supported by all modern browsers
* ``Clipboard`` and ``ClipboardJS`` use native `Clipboard API <https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API>`_ instead
* ``dav`` use the :ref:`@nextcloud/files <js-library_nextcloud-files>` or `webdav <https://www.npmjs.com/package/webdav>`_ library instead
* ``moment`` use the ``@nextcloud/moment`` library or native `Intl.DateTimeFormat <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat>`_ or `Temporal API <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal>`_ instead

Modified back-end APIs
----------------------

Nextcloud now provides a wrapper for the DBAL/migration classes from ``doctrine/dbal``. This will allow
us in the future to more easily update this dependency without breaking your applications and make it
easier for the static analyser to analyse this part of your code without providing stubs.

There are a few hard breaking changes:

- ``Type::lookupName($column->getType())`` will have to be replaced with ``$column->getType()->getName()``
- Methods taking a ``Doctrine\DBAL`` classes, will have to be changed to take a ``OCP\DB\Schema`` instead

Additionally, some part of the public API were removed and are now only available in the private API for runtime compatibility reason.

- ``Column->setOptions(array $options)`` is no longer available in the public API and you will have to use the typed setters instead like ``Column->setLength``
- ``Column->setType(DBAL\Type $type)`` is no longer available in the public API and you will have to provide one of the constants available in ``\OCP\DB\Types`` instead.

Apps with a custom ``\OCP\Federation\ICloudFederationProvider`` that receives notifications must also implement
``\OCP\Federation\ISignedCloudFederationProvider``. The implementation must resolve the remote federation ID from the
notification's shared secret and trusted data stored when the share was accepted. Return an empty string when the
secret does not identify exactly one remote origin.

Removed back-end APIs
---------------------

Remote API
^^^^^^^^^^

All these interfaces were deprecated since Nextcloud 23 and were removed without replacement:

- ``\OCP\Remote\ICredentials``
- ``\OCP\Remote\IInstance``
- ``\OCP\Remote\IInstanceFactory``
- ``\OCP\Remote\IUser``
- ``\OCP\Remote\API\IUserApi``
- ``\OCP\Remote\API\ICapabilitiesApi``
- ``\OCP\Remote\API\IApiFactory``
- ``\OCP\Remote\API\IApiCollection``

Preview API
^^^^^^^^^^^

The registration method of the preview manager ``\OCP\IPreview::registerProvider`` was deprecated since Nextcloud 23 and was removed now.
Instead of using the manager register your provider via the ``IRegistrationContext`` when booting the app.

Other removed back-end APIs
^^^^^^^^^^^^^^^^^^^^^^^^^^^

- All the deprecated methods of ``\OCP\Calendar\Resource\IManager`` and ``\OCP\Calendar\Room\IManager`` were deprecated since Nextcloud 24 and were removed without replacement.
- The ``\OCP\Collaboration\AutoComplete\AutoCompleteEvent`` event was deprecated since Nextcloud 28 and was removed with ``OCP\Collaboration\AutoComplete\AutoCompleteFilterEvent`` as replacement;
- ``\OCP\Files\IRootFolder`` does not publicly implement the deprecated and private ``OC\Hooks\Emitter`` interface anymore. The private implementations still do, but support might be removed at any moment without notice. The replacement for the hooks provided by ``IRootFolder`` are the node events defined in the ``OCP\Files\Events\Node`` namespace.

New APIs and features
---------------------

Database
^^^^^^^^

``\OCP\DB\QueryBuilder\ITypedQueryBuilder`` was added in favour of ``\OCP\DB\QueryBuilder\IQueryBuilder`` and can be
accessed through ``\OCP\IDBConnection::getTypedQueryBuilder``. It accurately returns the selected columns in a query
result, increasing type safety.

.. todo:: This linked page does not have coverage for the new API.

See :ref:`database` for details.

Migrations
^^^^^^^^^^

``\OCP\Migration\IRepairStepExpensive`` was added to mark post-migration repair steps as expensive. Expensive repair
steps are non-critical steps that might take a long time to execute. They are not required for a working instance
directly after the migration, but might be required for a fully working instance later on, and are only executed when
explicitly requested by the administrator. See :ref:`migration-repair-steps` for details.

Task processing
^^^^^^^^^^^^^^^

Support for streaming the text output of TaskProcessing providers has been added:

- The new provider interface ``\OCP\TaskProcessing\ISynchronousOptionsAwareProvider`` takes a
  ``\OCP\TaskProcessing\SynchronousProviderOptions`` option object that contains ``includeWatermarks``,
  ``preferStreaming`` and the callback to report intermediate output.
- ``\OCP\TaskProcessing\Task`` gained ``getPreferStreaming`` and ``setPreferStreaming`` to indicate whether the provider
  should report the output progressively if it supports it.
- The TaskProcessing OCS API now also accepts the ``preferStreaming`` flag when scheduling tasks.

See :ref:`task_processing-options` for details about how to adjust your providers.

Context Chat
^^^^^^^^^^^^

The new interface ``\OCP\ContextChat\IContentProviderWithSearchTask`` was added, extending
``\OCP\ContextChat\IContentProvider``. It allows content providers to supply additional metadata for improved document
retrieval and LLM responses and can be implemented as a drop-in replacement for ``\OCP\ContextChat\IContentProvider``.

See :ref:`context_chat` for details.
