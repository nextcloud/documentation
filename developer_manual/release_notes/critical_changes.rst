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

- TBD

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
