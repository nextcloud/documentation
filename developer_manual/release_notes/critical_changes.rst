.. _critical-changes:

================
Critical changes
================

..
    Add one section for each change.
    Only list changes absolutely necessary to keep an app running. Use the dedicated deprecation and new features pages for optional changes and announcements.

    The sections are somewhat ordered so changes affecting most apps come first, and more specific ones come later.


info.xml requirements
---------------------

Update info.xml to add Nextcloud 35 to the support range:

.. code-block:: xml

  <dependencies>
    <nextcloud min-version="35" max-version="35" />
  </dependencies>

To allow installation on older versions too, just keep the previous min-version.

Updated PHP requirements
------------------------

The support for PHP 8.2 has been dropped, the minimum supported PHP version of Nextcloud 35 is now 8.3.

Updated 3rd party libraries
---------------------------

phpseclib 3.0
^^^^^^^^^^^^^

The ``phpseclib`` library has been updated from version 2 to version 3.
This is a breaking change, apps that rely on the library need to update to the new version,
this includes a new namespace (``\phpseclib3``).
Changes can be found on the `library's website <https://phpseclib.com/docs/why#phpseclib-30-vs-phspeclib-10--20>`__.

Updated database requirements
-----------------------------

The following database versions are no longer supported in Nextcloud 35 as they are now out of support by their respective vendors:

- MariaDB 10.6. The minimum supported version of MariaDB is now 10.11 LTS.
- MySQL 8.0. The minimum supported version of MySQL is now 8.4 LTS.

The following new database versions are now supported in Nextcloud 35 as they are now released as LTS versions by their respective vendors.
Make sure to adjust your CI matrix for testing with them. This is automatically done if you use the workflow templates provided by Nextcloud.

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

Removed front-end APIs and libraries
------------------------------------

Removed global aliases
^^^^^^^^^^^^^^^^^^^^^^

The following global aliases were removed in Nextcloud 35,
they have been deprecated since Nextcloud 17 and scheduled for removal since Nextcloud 20:

- ``oc_appswebroots`` use ``OC.appswebroots`` instead
- ``oc_config`` use ``OC.config`` instead
- ``oc_current_user`` use ``OC.getCurrentUser().uid`` instead
- ``oc_debug`` use ``OC.debug`` instead8
- ``oc_defaults`` use ``OC.theme`` instead
- ``oc_isadmin`` use ``OC.isUserAdmin()`` instead
- ``oc_requesttoken`` use ``OC.requestToken`` instead
- ``oc_webroot`` use ``OC.webroot`` instead
- ``OCDialogs`` use ``OC.dialogs`` instead

Please keep in mind that ``OC`` is considered a private namespace for which our stability rules do not fully apply.
Its recommended to use the :ref:`Nextcloud frontend libraries<js-libraries>` instead if possible.

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
