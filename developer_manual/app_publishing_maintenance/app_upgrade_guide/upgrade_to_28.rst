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

* tbd

Back-end changes
----------------

Development dependency hell
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Due to the popularity of CLI tools for development of Nextcloud apps, the likelihood of package conflicts has increased. It's highly recommended to see :ref:`app-composer-bin-tools` and migrate to composer bin directories.

Added APIs
^^^^^^^^^^

* ``\OCP\Mail\IMessage::setSubject`` to set an email subject. See :ref:`email` for an example.
* ``\OCP\Mail\IMessage::setHtmlBody`` and ``\OCP\Mail\IMessage::setPlainBody`` to set an email body See :ref:`email` for an example.

Changed APIs
^^^^^^^^^^^^

* tbd

Deprecated APIs
^^^^^^^^^^^^^^^

* tbd

Removed APIs
^^^^^^^^^^^^

* ``\OC_App::getAppVersion``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAppVersion``.
* ``\OC_App::getAppInfo``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAppInfo``.
* ``\OC_App::getNavigation``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAll``.
* ``\OC_App::getSettingsNavigation``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAll('settings')``.
* ``\OC_App::isEnabled``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::isEnabledForUser``.
* ``\OC_Defaults::getLogoClaim``: there is no replacement.
* ``\OCP\Util::linkToPublic``: there is no replacement.
