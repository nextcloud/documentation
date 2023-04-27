=======================
Upgrade to Nextcloud 27
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/37039>`_.
    See the original ticket for links to the pull requests and tickets.

General
-------

info.xml
^^^^^^^^

Make sure your ``appinfo/info.xml`` allows for Nextcloud 27.

.. code-block:: xml

    <dependencies>
        <nextcloud min-version="23" max-version="27" />
    </dependencies>

Front-end changes
-----------------

Removed APIs
^^^^^^^^^^^^

* tbd

Back-end changes
----------------

Removal of PSR-0 class loader
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud 27 no longer loads classes in the deprecated :ref:`PSR-0 naming standard<psr0>`. :ref:`Update the structure to PSR-4<app-psr4-autoloader>` or :ref:`ship a custom autoloader<app-custom-classloader>`.

Added APIs
^^^^^^^^^^

* tbd

Changed APIs
^^^^^^^^^^^^

* tbd

Deprecated APIs
^^^^^^^^^^^^^^^

* tbd

Removed APIs
^^^^^^^^^^^^

* tbd
