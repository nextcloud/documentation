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
- The ``OC.SystemTags`` api was removed. If you need to get the list of system tags, check `this merge request <https://github.com/nextcloud/files_retention/pull/855>`_ for how to fetch the tags directly.
- ``OC.set`` and ``OC.get`` were removed. Both are deprecated since Nextcloud 19.
  For ``get``, if really needed, use `lodash get <https://lodash.com/docs#get>`_.
  And for ``set``, use `lodash set <https://lodash.com/docs#set>`_.
- The `OCA.Sharing.ExternalLinkActions` API was deprecated in Nextcloud 23 and is now removed.
  It was replaced with `OCA.Sharing.ExternalShareAction` which now have a proper API by using `registerSidebarAction` from `@nextcloud/sharing` instead.

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

Added Events
^^^^^^^^^^^^

- TBD

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

- The ``\OCP\BackgroundJob\IJob::execute`` method was deprecated since Nextcloud 25 and was now removed.
  Instead use the ``IJob::start`` method, available since Nextcloud 25.
- The ``\OCP\Search\PagedProvider``, ``\OCP\Search\Provider`` and ``\OCP\Search\Result`` classes were
  deprecated since Nextcloud 20 and were now removed. Instead use ``\OCP\Search\SearchResult`` and
  ``\OCP\Search\IProvider``, available since Nextcloud 20.
