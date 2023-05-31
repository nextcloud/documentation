=======================
Upgrade to Nextcloud 28
=======================

General
-------

info.xml
^^^^^^^^

Make sure your ``appinfo/info.xml`` allows for Nextcloud 28.

.. code-block:: xml

    <dependencies>
        <nextcloud min-version="25" max-version="28" />
    </dependencies>

Front-end changes
-----------------

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

* ``\OC_Defaults::getLogoClaim``: There is no replacement.
* ``\OCP\Util::writeLog``: inject the :ref:`psr3` logger or acquire an instance with ``\OCP\Log\logger``. See :ref:`logging`.

Back-end changes
----------------

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
