=======================
Upgrade to Nextcloud 31
=======================

General
-------

- TBD

Front-end changes
-----------------

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


Back-end changes
----------------

Support for PHP 8.4 added
^^^^^^^^^^^^^^^^^^^^^^^^^

In this release support for PHP 8.4 was added. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``max-version`` to 8.4.

.. code-block:: xml

  <dependencies>
    <php min-version="8.1" max-version="8.4" />
    <nextcloud min-version="26" max-version="28" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.1 <=8.4"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, extend your test matrix with PHP 8.4 tests and linters.

Information about code changes can be found on `php.net <https://www.php.net/migration84>`__ and `stitcher.io <https://stitcher.io/blog/new-in-php-84>`__.

Added APIs
^^^^^^^^^^

- It is now possible to download folders as zip or tar archives using the WebDAV backend using :code:`GET` requests.
  See the relevant :ref:`endpoint documentation<webdav-download-folders>`.
- ``OCP\SetupCheck\CheckServerResponseTrait`` was added to ease implementing custom :ref:`setup checks<setup-checks>` which need to check HTTP calls to the the server itself.

Changed APIs
^^^^^^^^^^^^

- Clarify ``OCP\Files\Storage\IStorage::getOwner()`` returns ``string|false``.
- Added method parameter and return types to all inheritors of ``OCP\Files\Storage\IStorage``. To migrate in a backwards compatible manner:

  #. Add all return types to your implementation now.
  #. Add all parameter types to your implementation once Nextcloud 31 is the lowest supported version.

- The Nextcloud implementation of the ``log`` method of ``Psr\Log\LoggerInterface`` now supports ``Psr\Log\LogLevel`` as log level parameter.

Deprecated APIs
^^^^^^^^^^^^^^^

- The ``/s/{token}/download`` endpoint for downloading public shares is deprecated.
  Instead use the Nextcloud provided :ref:`WebDAV endpoint<webdav-download-folders>`.

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
