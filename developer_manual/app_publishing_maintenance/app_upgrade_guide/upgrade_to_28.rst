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
        <nextcloud min-version="26" max-version="28" />
    </dependencies>

Front-end changes
-----------------

Added APIs
^^^^^^^^^^

* The new Files initialising much faster than the old one, you will face some
  race conditions if you register some custom properties loading your scripts
  by using the ``Util::addScript`` method.
  We recommend you use the new ``Util::addInitScript`` method instead, your script
  will be loaded right after the common core scripts and right before the Files app.
  See :ref:`ApplicationJs` for more information.

* File actions: to register file actions, please use the dedicated API from https://npmjs.org/@nextcloud/files or
  https://nextcloud-libraries.github.io/nextcloud-files/functions/registerFileAction.html
* New file menu: to register entries in the new file menu, please use the dedicated API from https://npmjs.org/@nextcloud/files or 
  https://nextcloud-libraries.github.io/nextcloud-files/functions/addNewFileMenuEntry.html
* Reminder from 27, to interact with the Files app router, use ``OCP.Files.Router``. See :ref:`FilesAPI`
* To Interact with the Files app data, please use the following events. All of them have a `Node object <https://nextcloud-libraries.github.io/nextcloud-files/classes/Node.html>`_ as main parameter.

  * ``files:node:created``: the node has been created
  * ``files:node:deleted``: the node has been deleted
  * ``files:node:moved``: the node has been moved (and its data is already updated)
  * ``files:node:updated``: the node data has been updated

Changed APIs
^^^^^^^^^^^^

* tbd

Deprecated APIs
^^^^^^^^^^^^^^^

* The CSS variables ``--color-text-light`` and  ``--color-text-lighter`` were made aliases of ``--color-main-text`` and ``--color-text-maxcontrast``
  in `Nextcloud 20 <https://github.com/nextcloud/server/pull/21117>`_ and are now officially deprecated and will be removed in the near future.

Removed APIs
^^^^^^^^^^^^

* ``OC.loadScript`` and ``OC.loadStyle``: Use ``OCP.Loader`` instead.
* ``OC.appSettings``: There is no replacement.
* ``OCA.Files``: Everything removed but Sidebar and Settings. See the Added API section for replacements.

Back-end changes
----------------

PHP 8.3
^^^^^^^

In this release support for PHP 8.3 was added. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``max-version`` to 8.3.

.. code-block:: xml

  <dependencies>
    <php min-version="8.0" max-version="8.3" />
    <nextcloud min-version="26" max-version="28" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.0 <=8.3"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, extend your test matrix with PHP 8.3 tests and linters.

Information about code changes can be found on `php.net <https://www.php.net/migration83>`__ and `stitcher.io <https://stitcher.io/blog/new-in-php-83>`__.

Development dependency hell
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Due to the popularity of CLI tools for development of Nextcloud apps, the likelihood of package conflicts has increased. It's highly recommended to see :ref:`app-composer-bin-tools` and migrate to composer bin directories.

Updated core libraries
^^^^^^^^^^^^^^^^^^^^^^

If apps use only official public APIs of Nextcloud, the update of core libraries should have little to no effect on apps. However, there are some edge cases where an app still has a code dependency to a library shipped with Nextcloud, e.g. when those 3rdparty classes or functions are used, and therefore app developers are recommended to check their code for any incompatibility. Moreover it's recommended to check compatibility with sophisticated tools, as documented at the  :ref:`static analysis<app-static-analysis>` section.

``doctrine/dbal``
*****************

The Doctrine Database Abstraction Layer powers Nextcloud's database connection and query builder. In Nextcloud 28, this dependency was updated from 3.3 to 3.7.

Optimistically speaking, the database connection and the query builder should mostly work like in Nextcloud 27 or older.
Some (minor) breaking changes were inevitable. Here's the summary:

- When a query builder instance is using positional parameters ``->setValue('name', '?')`` ``setParameter(0, $name)``, all parameters need to be set again when executing the query multiple times, e.g. in a loop. It is recommended to switch to named parameters using ``createParameter()`` instead.

The details of this change can also be seen in the `pull request on GitHub <https://github.com/nextcloud/server/pull/38556>`__ and in the upstream documentation `dbal 3.7.x upgrade document <https://github.com/doctrine/dbal/blob/3.7.x/UPGRADE.md>`__.

``symfony/event-dispatcher``
****************************

Over the last 2 major versions the ``symfony/event-dispatcher`` package first deprecated and then removed the way Nextcloud
server dispatched old events. This means the way we wrapped away symfony's ``\Symfony\Component\EventDispatcher\EventDispatcherInterface``
as well as using the ``\Symfony\Component\EventDispatcher\GenericEvent`` could not be kept alive in a backwards compatible way.

Therefore migrating from ``\Symfony\Component\EventDispatcher\EventDispatcherInterface``
to ``\OCP\EventDispatcher\IEventDispatcher`` (exists since Nextcloud 17) is required to be compatible with Nextcloud 28.
All code places that dispatched a ``\Symfony\Component\EventDispatcher\GenericEvent`` have been adjusted
and have ``\OCP\EventDispatcher\Event`` based dedicated event now that is dispatched as a typed-event so all available parameters are documented.

The details of this change can also be seen in the todo items that are linked from the `pull request on GitHub <https://github.com/nextcloud/server/pull/38546>`__.

Added APIs
^^^^^^^^^^

* ``\OCP\AppFramework\Http\EmptyContentSecurityPolicy::useStrictDynamicOnScripts`` to set 'strict-dynamic' on the 'script-src-elem' CSP, this is set by default to true to allow apps using module JS to import dependencies.
* ``\OCP\Mail\IMessage::setSubject`` to set an email subject. See :ref:`email` for an example.
* ``\OCP\Mail\IMessage::setHtmlBody`` and ``\OCP\Mail\IMessage::setPlainBody`` to set an email body See :ref:`email` for an example.
* ``\OCP\IEventSourceFactory`` to create a ``OCP\IEventSource`` instance.
* ``\OCP\Preview\BeforePreviewFetchedEvent::getCrop``
* ``\OCP\Preview\BeforePreviewFetchedEvent::getHeight``
* ``\OCP\Preview\BeforePreviewFetchedEvent::getMode``
* ``\OCP\Preview\BeforePreviewFetchedEvent::getWidth``
* ``\OCP\IPhoneNumberUtil::convertToStandardFormat`` to convert input into an E164 formatted phone number. See :ref:`phonenumberutil` for an example.
* ``\OCP\IPhoneNumberUtil::getCountryCodeForRegion`` to get the E164 country code for a given region. See :ref:`phonenumberutil` for an example.
* ``\OCP\AppFramework\Http\EmptyContentSecurityPolicy::allowEvalWasm(bool)``: sets ``wasm-unsafe-eval`` in ``script-src`` of the Content Security Policy `to allow compilation and execution of WebAssembly on the page <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#unsafe_webassembly_execution>`_
* ``\OCP\FilesMetadata\IMetadataBackgroundEvent::getNode``
* ``\OCP\FilesMetadata\IMetadataBackgroundEvent::getMetadata``
* ``\OCP\FilesMetadata\IMetadataLiveEvent::getNode``
* ``\OCP\FilesMetadata\IMetadataLiveEvent::getMetadata``
* ``\OCP\FilesMetadata\IMetadataLiveEvent::requestBackgroundJob``
* ``\OCP\FilesMetadata\IFilesMetadataManager::refreshMetadata``
* ``\OCP\FilesMetadata\IFilesMetadataManager::getMetadata``
* ``\OCP\FilesMetadata\IFilesMetadataManager::saveMetadata``
* ``\OCP\FilesMetadata\IFilesMetadataManager::deleteMetadata``
* ``\OCP\FilesMetadata\IFilesMetadataManager::getMetadataQuery``
* ``\OCP\FilesMetadata\IFilesMetadataManager::getKnownMetadata``
* ``\OCP\FilesMetadata\IFilesMetadataManager::initMetadata``
* ``\OCP\FilesMetadata\IMetadataQuery::retrieveMetadata``
* ``\OCP\FilesMetadata\IMetadataQuery::extractMetadata``
* ``\OCP\FilesMetadata\IMetadataQuery::joinIndex``
* ``\OCP\FilesMetadata\IMetadataQuery::getMetadataKeyField``
* ``\OCP\FilesMetadata\IMetadataQuery::getMetadataValueField``

  * ``wasm-unsafe-eval`` is `supported by most browsers <https://caniuse.com/mdn-http_headers_content-security-policy_script-src_wasm-unsafe-eval>`_
  * WebAssembly compilation and execution in worker threads is not affected by this directive (browsers allow compilation and execution of WebAssembly in worker threads by default)
  * ``OCP\Authentication\Token\IProvider::getToken`` to get a token by its token string id
  * ``OCP\Authentication\Token\IToken`` public interface for tokens returned by the function above. Please use those instead of things from ``OC`` namespace.
  * ``OCP\User\Backend\IProvideEnabledStateBackend`` for user backends that wants to alter disabled state of users (used by user_ldap to mark remnants as disabled if the option is enabled).


Changed APIs
^^^^^^^^^^^^

* ``\OCP\Preview\BeforePreviewFetchedEvent`` now accepts: ``width, height, crop and mode`` as optional constructor arguments.
* Interface ``\OCP\Files\Folder`` got a new method: ``searchBySystemTag(string $tagName, string $userId, int $limit = 0, int $offset = 0)``.
* ``OCP\SystemTag\ISystemTagManager::getTagsByIds()`` now optionally accepts `IUser` as second parameter, to only retrieve system tags visible to that user.

Deprecated APIs
^^^^^^^^^^^^^^^

* ``\OCP\DB\IResult::fetch``: use the new ``fetchAssociative``, ``fetchNumeric`` and ``fetchOne`` instead. If you called ``fetch`` without arguments, ``fetchAssociative`` is the direct replacement. Beware that the new methods throw a different exception.
* ``\OCP\DB\IResult::fetchAll``: use the new ``fetchAllAssociative``, ``fetchAllNumeric`` and ``fetchOne`` instead. If you called ``fetchAll`` without arguments, ``fetchAllAssociative`` is the direct replacement. Beware that the new methods throw a different exception.
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
* ``\OC::$server->createEventSource()`` has been removed, use ``\OCP\Server::get(\OCP\IEventSourceFactory::class)->create()`` instead.
* ``\OCP\Util::writeLog`` has been removed, use ``\OCP\Server::get(LoggerInterface::class)->…`` instead.

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
* Typed event ``OCP\FilesMetadata\Event\MetadataBackgroundEvent`` was added
* Typed event ``OCP\FilesMetadata\Event\MetadataLiveEvent`` was added
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



Removed WebDAV properties
^^^^^^^^^^^^^^^^^^^^^^^^^

* <nc:file-metadata-size>
* <nc:file-metadata-gps>











