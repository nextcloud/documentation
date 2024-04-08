=======================
Upgrade to Nextcloud 30
=======================

General
-------

Front-end changes
-----------------

Added APIs
^^^^^^^^^^

Changed APIs
^^^^^^^^^^^^

Removed APIs
^^^^^^^^^^^^

Removed globals
^^^^^^^^^^^^^^^

Back-end changes
----------------

Support for PHP 8.0 removed
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this release support for PHP 8.0 was removed. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``min-version`` to 8.1.

.. code-block:: xml

  <dependencies>
    <php min-version="8.1" max-version="8.3" />
    <nextcloud min-version="27" max-version="30" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.1 <=8.3"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, remove PHP 8.0 from the matrices of tests and linters.

Added APIs
^^^^^^^^^^

Changed APIs
^^^^^^^^^^^^

Removed APIs
^^^^^^^^^^^^

Removed events
^^^^^^^^^^^^^^
