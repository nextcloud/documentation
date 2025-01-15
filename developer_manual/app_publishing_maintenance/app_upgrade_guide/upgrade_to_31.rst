=======================
Upgrade to Nextcloud 31
=======================

General
-------

- TBD

Front-end changes
-----------------

User-, guest-, and public-template layout
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The main layout for all apps (the user, guest and public template) has been changed,
the main content is no longer rendered within a ``<main>`` element with the class ``content`` but in a ``div`` element with the class ``content``.
The reason for this is to allow writing Vue 3 based apps which would incorrectly render two stacked ``main``-elements otherwise.

For Vue 2 apps this **does not change anything**.
But if you just use vanilla templates or other frameworks this changes the page layout and might require adjustments.
We recommend you to wrap your content in a custom ``main``-element if you use non or not Vue as the framework.

Logical position CSS rules
^^^^^^^^^^^^^^^^^^^^^^^^^^

With Nextcloud 31 all server provided styles are migrated to use `logical positioning <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values>`_
instead of physical, this allows the front-end layout to adjust to different language directions (right-to-left).
App developers are strongly encouraged to migrate their apps to logical positioning too.

Examples for logical vs physical positioning:

- ``margin-inline-start: 4px;`` instead of ``margin-left: 4px;``
- ``inset-inline-end: 8px;`` instead of ``right: 8px``

Files and Files sharing
^^^^^^^^^^^^^^^^^^^^^^^

With Nextcloud 28 the Files app front-end was migrated to Vue and the private API ( ``OCA.Files`` ) was removed,
but for public shares the legacy frontend-end was still used. With Nextcloud 31 public shares also use the new Vue front-end.
This means accessing the legacy private API in ``OCA.Files`` is no longer possible, all existing apps should migrate to the :ref:`public API<js-library_nextcloud-files>`.

To make migration easier utility functions are provided in the ``@nextcloud/sharing`` :ref:`package<js-library_nextcloud-sharing>`
to check whether the current Files app instance is a public share or not, and if so to fetch the share token.

.. code-block:: JavaScript

    import { isPublicShare, getSharingToken } from '@nextcloud/sharing/public'

    if (isPublicShare()) {
        console.info('This is a public share with the sharing token: ', getSharingToken())
    }


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

- ``OCA.FilesSharingDrop`` removed as part of the Vue migration. Use the Files app API provided by the :ref:`package<js-library_nextcloud-files>` .
- ``$.Event('OCA.Notification.Action')`` jQuery event removed from Notifications app as part of the Vue migration. Use ``@nextcloud/event-bus`` :ref:`package<js-library_nextcloud-event-bus>` instead.

.. code-block:: JavaScript

    import { subscribe, unsubscribe } from '@nextcloud/event-bus'

    subscribe('notifications:action:execute', (event) => {
		console.info('Notification action has been executed:', event.notification, event.action)
    })

Back-end changes
----------------

Support for PHP 8.4 added
^^^^^^^^^^^^^^^^^^^^^^^^^

In this release support for PHP 8.4 was added. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``max-version`` to 8.4.
However, it is recommended to always support all PHP versions that are compatible with supported Nextcloud version.
In that case the ``php``-dependencies entries can be omitted.

.. code-block:: xml

  <dependencies>
    <php min-version="8.1" max-version="8.4" />
    <nextcloud min-version="29" max-version="31" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.1 <=8.4"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, extend your test matrix with PHP 8.4 tests and linters.
This happens automatically when you reuse our `GitHub Workflow templates <https://github.com/nextcloud/.github>`__,
but you can also use the underlying `icewind1991/nextcloud-version-matrix Action <https://github.com/icewind1991/nextcloud-version-matrix>`__ directly.

Information about code changes can be found on `php.net <https://www.php.net/migration84>`__ and `stitcher.io <https://stitcher.io/blog/new-in-php-84>`__.

Added APIs
^^^^^^^^^^

- It is now possible to download folders as zip or tar archives using the WebDAV backend using :code:`GET` requests.
  See the relevant :ref:`endpoint documentation<webdav-download-folders>`.
- ``OCP\SetupCheck\CheckServerResponseTrait`` was added to ease implementing custom :ref:`setup checks<setup-checks>`
  which need to check HTTP calls to the the server itself.
- Any implementation of ``OCP\Files\Mount\IMountPoint`` can additionally implement ``OCP\Files\Mount\IShareOwnerlessMount`` which allows everyone with share permission to edit and delete any share on the files and directories below the mountpoint.
- ``OCP\Navigation\Events\LoadAdditionalEntriesEvent`` is dispatched when the navigation manager needs to know about its entries, apart of standard app entries that are loaded automatically. This is only relevant for apps that provide extraneous entries.

Changed APIs
^^^^^^^^^^^^

- Clarify ``OCP\Files\Storage\IStorage::getOwner()`` returns ``string|false``.
- Added method parameter and return types to all inheritors of ``OCP\Files\Storage\IStorage``. To migrate in a backwards compatible manner:

  #. Add all return types to your implementation now.
  #. Add all parameter types to your implementation once Nextcloud 31 is the lowest supported version.

- The Nextcloud implementation of the ``log`` method of ``Psr\Log\LoggerInterface`` now supports ``Psr\Log\LogLevel`` as log level parameter.
- The ``OCP\DB\QueryBuilder\IQueryBuilder`` now supports more date / time related parameter types:

  - ``PARAM_DATE_MUTABLE`` and ``PARAM_DATE_IMMUTABLE`` for passing a ``\DateTime`` (``\DateTimeImmutable`` respectively) instance when only interested in the date part.
  - ``PARAM_TIME_MUTABLE`` and ``PARAM_TIME_IMMUTABLE`` to pass a ``\DateTime`` (``\DateTimeImmutable`` respectively) instance when only interested in the time part.
  - ``PARAM_DATETIME_MUTABLE`` and ``PARAM_DATETIME_IMMUTABLE`` to pass a ``\DateTime`` (``\DateTimeImmutable`` respectively) instance without handling of the timezone.
  - ``PARAM_DATETIME_TZ_MUTABLE`` and ``PARAM_DATETIME_TZ_IMMUTABLE`` to pass a ``\DateTime`` (``\DateTimeImmutable`` respectively) instance with handling of the timezone.

- The ``OCP\\DB\\Types`` now support more date and time related types for usage with the ``Entity``:

  - ``DATE_IMMUTABLE`` for fields that will (de)serialized as ``\DateTimeImmutable`` instances with only the date part set.
  - ``TIME_IMMUTABLE`` for fields that will (de)serialized as ``\DateTimeImmutable`` instances with only the time part set.
  - ``DATETIME_IMMUTABLE`` for fields that will (de)serialized as ``\DateTimeImmutable`` instances with both the time part set but without timezone information.
  - ``DATETIME_TZ`` for fields that will (de)serialized as ``\DateTime`` instances with both the time part set and with timezone information.
  - ``DATETIME_TZ_IMMUTABLE`` for fields that will (de)serialized as ``\DateTimeImmutable`` instances with both the time part set and with timezone information.

Deprecated APIs
^^^^^^^^^^^^^^^

- The ``/s/{token}/download`` endpoint for downloading public shares is deprecated.
  Instead use the Nextcloud provided :ref:`WebDAV endpoint<webdav-download-folders>`.
- ``OCP\DB\QueryBuilder\IQueryBuilder::PARAM_DATE`` is deprecated in favor of ``PARAM_DATETIME_MUTABLE``
  to make clear that this type also includes the time part of a date time instance.

Removed APIs
^^^^^^^^^^^^

- Legacy, non functional, ``OC_App::getForms`` was removed.
- The private and legacy ``OC_Files`` class was removed.
  Instead use ``OCP\AppFramework\Http\StreamResponse`` or ``OCP\AppFramework\Http\ZipResponse``.
- The private and legacy Ajax endpoint for downloading file archives (``/apps/files/ajax/download.php``) was removed.
  Instead use the Nextcloud provided :ref:`WebDAV endpoint<webdav-download-folders>`.
- All ``OCP\ILogger`` logging methods, deprecated since Nextcloud 20, are removed.
    - The interface now only holds the Nextcloud internal logging level constants.
      For all logging ``Psr\Log\LoggerInterface`` should be used.
    - The ``OCP\ILogger`` interface can no longer be dependency injected as it now only holds constants.
    - ``OCP\IServerContainer::getLogger`` was removed, use dependency injection with ``Psr\Log\LoggerInterface`` instead.
- The internal class ``OC\AppFramework\Logger`` was removed, it should have been never used by apps.
  All using apps should migrate to ``Psr\Log\LoggerInterface``.
