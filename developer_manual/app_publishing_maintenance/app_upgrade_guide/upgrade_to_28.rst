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

* ``OC.loadScript`` and ``OC.loadStyle``: Use ``OCP.Loader`` instead.
* ``OC.appSettings``: There is no replacement.

Back-end changes
----------------

Development dependency hell
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Due to the popularity of CLI tools for development of Nextcloud apps, the likelihood of package conflicts has increased. It's highly recommended to see :ref:`app-composer-bin-tools` and migrate to composer bin directories.

Added APIs
^^^^^^^^^^

* ``\OCP\Mail\IMessage::setSubject`` to set an email subject. See :ref:`email` for an example.
* ``\OCP\Mail\IMessage::setHtmlBody`` and ``\OCP\Mail\IMessage::setPlainBody`` to set an email body See :ref:`email` for an example.
* ``\OCP\IEventSourceFactory`` to create a ``OCP\IEventSource`` instance.
* ``\OCP\Preview\BeforePreviewFetchedEvent::getCrop``
* ``\OCP\Preview\BeforePreviewFetchedEvent::getHeight``
* ``\OCP\Preview\BeforePreviewFetchedEvent::getMode``
* ``\OCP\Preview\BeforePreviewFetchedEvent::getWidth``

Changed APIs
^^^^^^^^^^^^

* ``\OCP\Preview\BeforePreviewFetchedEvent`` now accepts: ``width, height, crop and mode`` as optional constructor arguments.
* Interface ``\OCP\Files\Folder`` got a new method: ``searchBySystemTag(string $tagName, string $userId, int $limit = 0, int $offset = 0)``.
* ``OCP\SystemTag\ISystemTagManager::getTagsByIds()`` now optionally accepts `IUser` as second parameter, to only retrieve system tags visible to that user.

Deprecated APIs
^^^^^^^^^^^^^^^

* ``\OCP\Preview\BeforePreviewFetchedEvent`` passing ``null`` for ``width, height, crop or mode`` is deprecated. Starting with Nextcloud 31 they are mandatory.

Removed APIs
^^^^^^^^^^^^

* ``\OC_App::getAppVersion``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAppVersion``.
* ``\OC_App::getAppInfo``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAppInfo``.
* ``\OC_App::getNavigation``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAll``.
* ``\OC_App::getSettingsNavigation``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::getAll('settings')``.
* ``\OC_App::isEnabled``: inject ``\OCP\App\IAppManager`` and call ``\OCP\App\IAppManager::isEnabledForUser``.
* ``\OC_Defaults::getLogoClaim``: there is no replacement.
* ``\OCP\Util::linkToPublic``: there is no replacement.
* ``\OC_Defaults::getLogoClaim``: There is no replacement.
* ``\OC::$server->createEventSource()`` has been removed, use ``\OC::$server->get(\OCP\IEventSourceFactory::class)->create()`` instead.

The factory ``\OCP\IEventSourceFactory`` works only from Nextcloud 28.
For older versions use ``\OC::$server->createEventSource()``.

If you want to support Nextcloud 27 and Nextcloud 28:

.. code-block:: php

	// @TODO: Remove method_exists when min-version="28"
	if (method_exists(\OC::$server, 'createEventSource')) {
		$eventSource = \OC::$server->createEventSource();
	} else {
		$eventSource = \OCP\Server::get(IEventSourceFactory::class)->create();
	}
