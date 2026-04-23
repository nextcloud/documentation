=======================
Upgrade to Nextcloud 24
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/29914>`__. See the original ticket for links to the pull requests and tickets.

General
-------

info.xml
^^^^^^^^

Make sure your ``appinfo/info.xml`` allows for Nextcloud 24.

.. code-block:: xml

	<dependencies>
	  <nextcloud min-version="21" max-version="24" />
	</dependencies>

Back-end changes
----------------

PHP 8.1
^^^^^^^

Nextcloud 24 is the first major Nextcloud release to work with PHP 8.1. In this release support for PHP 7.3 was dropped. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``max-version`` to 8.1.

.. code-block:: xml

  <dependencies>
    <php min-version="7.4" max-version="8.1" />
    <nextcloud min-version="21" max-version="24" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=7.4 <=8.1"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, extend your test matrix with PHP 8.1 tests and linters and drop any jobs for PHP 7.3.

Information about code changes can be found on `php.net <https://www.php.net/migration81>`__ and `stitcher.io <https://stitcher.io/blog/new-in-php-81#breaking-changes>`__.


Entity slug deprecation
^^^^^^^^^^^^^^^^^^^^^^^

The usage of :ref:`entity slugs <database-entity-slugs>` has been deprecated. There is no provided replacement. If your app needs slugs, add your own logic to create them.
