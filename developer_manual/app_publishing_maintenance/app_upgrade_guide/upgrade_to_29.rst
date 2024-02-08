=======================
Upgrade to Nextcloud 29
=======================

General
-------

info.xml
^^^^^^^^

Make sure your ``appinfo/info.xml`` allows for Nextcloud 29.

.. code-block:: xml

    <dependencies>
        <nextcloud min-version="27" max-version="29" />
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

* tbd

Removed globals
^^^^^^^^^^^^^^^

* Global ``autosize`` is removed, it was deprecated for over 4 years and scheduled for removal with Nextcloud 20. If you still need it you should ship your own version.

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

* ``OCP\Log\ILogFactory::getCustomLogger``: use ``\OCP\Log\ILogFactory::getCustomPsrLogger`` to get a customized :ref:`PSR3 <psr3>` logger

Added events
^^^^^^^^^^^^

* tbd

Deprecated events
^^^^^^^^^^^^^^^^^

* tbd

Removed events
^^^^^^^^^^^^^^

* tbd

Changed behavior
^^^^^^^^^^^^^^^^

The dashboard no longer loads the sidebar or Viewer scripts, if your dashboard widget relies on this it should emit the required events itself.
