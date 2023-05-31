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

* ``\OC_App::isEnabled``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::isEnabledForUser``.
* ``\OC_Defaults::getLogoClaim``: There is no replacement.

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
