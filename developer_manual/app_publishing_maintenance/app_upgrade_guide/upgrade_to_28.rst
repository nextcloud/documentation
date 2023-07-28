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

Added events
^^^^^^^^^^^^

* Typed event ``OCA\DAV\Events\SabrePluginAddEvent`` was added
* Typed event ``OCP\Accounts\UserUpdatedEvent`` was added
* Typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengeFailed`` was added
* Typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengePassed`` was added
* Typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserRegistered`` was added
* Typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserUnregistered`` was added
* Typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderUserDeleted`` was added
* Typed event ``OCP\Comments\CommentsEntityEvent`` was added
* Typed event ``OCP\DB\Events\AddMissingColumnsEvent`` to add missing indices to the database schema.
* Typed event ``OCP\DB\Events\AddMissingIndicesEvent`` to add missing indices to the database schema.
* Typed event ``OCP\DB\Events\AddMissingPrimaryKeyEvent`` to add missing indices to the database schema.
* Typed event ``OCP\Files\Events\NodeAddedToFavorite`` was added
* Typed event ``OCP\Files\Events\NodeRemovedFromFavorite`` was added
* Typed event ``OCP\Share\Events\BeforeShareCreatedEvent`` was added
* Typed event ``OCP\Share\Events\BeforeShareDeletedEvent`` was added
* Typed event ``OCP\Share\Events\ShareAcceptedEvent`` was added
* Typed event ``OCP\Share\Events\ShareDeletedFromSelfEvent`` was added
* Typed event ``OCP\SystemTag\SystemTagsEntityEvent`` was added
* Typed event ``OCP\User\Events\UserFirstTimeLoggedInEvent`` was added

Deprecated events
^^^^^^^^^^^^^^^^^

* ``OC\Console\Application::run`` was deprecated. Listen to the typed event ``OCP\Console\ConsoleEvent`` instead
* ``OCA\DAV\Connector\Sabre::addPlugin`` was deprecated. Listen to the typed event ``OCA\DAV\Events\SabrePluginAddEvent`` instead
* ``OCA\Files_Trashbin::moveToTrash`` was deprecated. Listen to the typed event ``OCA\Files_Trashbin\Events\MoveToTrashEvent`` instead
* ``OCA\Files_Trashbin::moveToTrash`` was deprecated. Listen to the typed event ``OCA\Files_Trashbin\Events\MoveToTrashEvent`` instead
* ``OCP\Console\ConsoleEvent::EVENT_RUN`` was deprecated. Listen to the typed event ``OCP\Console\ConsoleEvent`` instead
* ``OCP\Authentication\TwoFactorAuth\RegistryEvent`` was deprecated. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserRegistered`` and ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserUnregistered`` instead
* ``OCP\Authentication\TwoFactorAuth\IRegistry::enable`` was deprecated. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserRegistered`` instead
* ``OCP\Authentication\TwoFactorAuth\IRegistry::disable`` was deprecated. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserUnregistered`` instead
* ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderDisabled`` was deprecated. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderUserDeleted`` instead
* ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserDisabled`` was deprecated. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengeFailed`` instead
* ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderForUserEnabled`` was deprecated. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengePassed`` instead
* ``OCP\Comments\CommentsEntityEvent::EVENT_ENTITY`` was deprecated. Listen to the typed event ``OCP\Comments\CommentsEntityEvent`` instead
* ``OCP\Comments\ICommentsManager::registerEntity`` was deprecated. Listen to the typed event ``OCP\Comments\CommentsEntityEvent`` instead
* ``OCP\SystemTag\ISystemTagManager::registerEntity`` was deprecated. Listen to the typed event ``OCP\SystemTag\SystemTagsEntityEvent`` instead
* ``OCP\SystemTag\SystemTagsEntityEvent::EVENT_ENTITY`` was deprecated. Listen to the typed event ``OCP\SystemTag\SystemTagsEntityEvent`` instead
* ``OCP\IUser::firstLogin`` was deprecated. Listen to the typed event ``OCP\User\Events\UserFirstTimeLoggedInEvent`` instead

Removed events
^^^^^^^^^^^^^^

* ``OC\AccountManager::userUpdated`` was removed. Listen to the typed event ``OCP\Accounts\UserUpdatedEvent`` instead
* ``OCA\Files::loadAdditionalScripts`` was removed. Listen to the typed event ``OCA\Files\Event\LoadAdditionalScriptsEvent`` instead
* ``OCA\Files\Service\TagService::addFavorite`` was removed. Listen to the typed event ``OCP\Files\Events\NodeAddedToFavorite`` instead
* ``OCA\Files\Service\TagService::removeFavorite`` was removed. Listen to the typed event ``OCP\Files\Events\NodeRemovedFromFavorite`` instead
* ``OCA\Files_Sharing::loadAdditionalScripts`` was removed. Listen to the typed event ``OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent`` instead
* ``OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS`` (deprecated since 20) was removed. Listen to the typed event ``OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent`` instead
* ``OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS_LOGGEDIN`` (deprecated since 20) was removed. Listen to the typed event ``OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent`` instead
* ``OCP\AppFramework\Http\TemplateResponse::loadAdditionalScripts`` (deprecated since 20) was removed. Listen to the typed event ``OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent`` instead
* ``OCP\AppFramework\Http\TemplateResponse::loadAdditionalScriptsLoggedIn`` (deprecated since 20) was removed. Listen to the typed event ``OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent`` instead
* ``OCP\Authentication\TwoFactorAuth\IProvider::EVENT_SUCCESS`` (deprecated since 22) was removed. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengePassed`` instead
* ``OCP\Authentication\TwoFactorAuth\IProvider::EVENT_FAILED`` (deprecated since 22) was removed. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengeFailed`` instead
* ``OCP\Authentication\TwoFactorAuth\IProvider::failed`` (deprecated since 22) was removed. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengeFailed`` instead
* ``OCP\Authentication\TwoFactorAuth\IProvider::success`` (deprecated since 22) was removed. Listen to the typed event ``OCP\Authentication\TwoFactorAuth\TwoFactorProviderChallengePassed`` instead
* ``OCP\IDBConnection::ADD_MISSING_COLUMNS`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingColumnsEvent`` instead
* ``OCP\IDBConnection::ADD_MISSING_INDEXES`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingIndicesEvent`` instead
* ``OCP\IDBConnection::ADD_MISSING_PRIMARY_KEYS`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingPrimaryKeyEvent`` instead
* ``OCP\IDBConnection::CHECK_MISSING_COLUMNS`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingColumnsEvent`` instead
* ``OCP\IDBConnection::CHECK_MISSING_COLUMNS_EVENT`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingColumnsEvent`` instead
* ``OCP\IDBConnection::CHECK_MISSING_INDEXES`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingIndicesEvent`` instead
* ``OCP\IDBConnection::CHECK_MISSING_INDEXES_EVENT`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingIndicesEvent`` instead
* ``OCP\IDBConnection::CHECK_MISSING_PRIMARY_KEYS`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingPrimaryKeyEvent`` instead
* ``OCP\IDBConnection::CHECK_MISSING_PRIMARY_KEYS_EVENT`` (deprecated since 22) was removed. Listen to the typed event ``OCP\DB\Events\AddMissingPrimaryKeyEvent`` instead
* ``OCP\IGroup::postAddUser`` was removed. Listen to the typed event ``OCP\Group\Events\UserAddedEvent`` instead
* ``OCP\IGroup::postDelete`` was removed. Listen to the typed event ``OCP\Group\Events\GroupDeletedEvent`` instead
* ``OCP\IGroup::postRemoveUser`` was removed. Listen to the typed event ``OCP\Group\Events\UserRemovedEvent`` instead
* ``OCP\IGroup::preAddUser`` was removed. Listen to the typed event ``OCP\Group\Events\BeforeUserAddedEvent`` instead
* ``OCP\IGroup::preDelete``  was removed. Listen to the typed event ``OCP\Group\Events\BeforeGroupDeletedEvent`` instead
* ``OCP\IGroup::preRemoveUser`` was removed. Listen to the typed event ``OCP\Group\Events\BeforeUserRemovedEvent`` instead
* ``OCP\IPreview::EVENT`` (deprecated since 22) was removed. Listen to the typed event ``OCP\Preview\BeforePreviewFetchedEvent`` instead
* ``OCP\IPreview:PreviewRequested`` (deprecated since 22) was removed. Listen to the typed event ``OCP\Preview\BeforePreviewFetchedEvent`` instead
* ``OCP\IUser::changeUser`` was removed. Listen to the typed event ``OCP\User\Events\UserChangedEvent`` instead
* ``OCP\IUser::postDelete`` (deprecated since 17) was removed. Listen to the typed event ``OCP\User\Events\UserDeletedEvent`` instead
* ``OCP\IUser::postSetPassword`` was removed. Listen to the typed event ``OCP\User\Events\PasswordUpdatedEvent`` instead
* ``OCP\IUser::preDelete`` (deprecated since 17) was removed. Listen to the typed event ``OCP\User\Events\BeforeUserDeletedEvent`` instead
* ``OCP\IUser::preSetPassword`` was removed. Listen to the typed event ``OCP\User\Events\BeforePasswordUpdatedEvent`` instead
* ``OCP\Share::preShare`` was removed. Listen to the typed event ``OCP\Share\Events\BeforeShareCreatedEvent`` instead
* ``OCP\Share::preUnshare`` was removed. Listen to the typed event ``OCP\Share\Events\BeforeShareDeletedEvent`` instead
* ``OCP\Share::postAcceptShare`` was removed. Listen to the typed event ``OCP\Share\Events\ShareAcceptedEvent`` instead
* ``OCP\Share::postShare`` was removed. Listen to the typed event ``OCP\Share\Events\ShareCreatedEvent`` instead
* ``OCP\Share::postUnshare`` was removed. Listen to the typed event ``OCP\Share\Events\ShareDeletedEvent`` instead
* ``OCP\Share::postUnshareFromSelf`` was removed. Listen to the typed event ``OCP\Share\Events\ShareDeletedFromSelfEvent`` instead
* ``OCP\WorkflowEngine::registerChecks`` (deprecated since 17) was removed. Listen to the typed event ``OCP\WorkflowEngine\Events\RegisterChecksEvent`` instead
* ``OCP\WorkflowEngine::registerEntities`` (deprecated since 17) was removed. Listen to the typed event ``OCP\WorkflowEngine\Events\RegisterEntitiesEvent`` instead
* ``OCP\WorkflowEngine::registerOperations`` (deprecated since 17) was removed. Listen to the typed event ``OCP\WorkflowEngine\Events\RegisterOperationsEvent`` instead
* ``\OCP\Collaboration\Resources::loadAdditionalScripts`` was removed. Listen to the typed event ``OCP\Collaboration\Resources\LoadAdditionalScriptsEvent`` instead















