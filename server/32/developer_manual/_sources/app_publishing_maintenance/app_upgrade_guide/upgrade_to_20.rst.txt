=======================
Upgrade to Nextcloud 20
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/20953>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
-----------------

Body theme
^^^^^^^^^^

The body theme classes are now ``theme--highcontrast``, ``theme--dark`` and/or ``theme--light``.

jQuery update
^^^^^^^^^^^^^

jQuery was updated to v2.2. The most notable change is that ``$(document).ready(...)`` or ``$(...)`` for short fires sooner than before. Use the `DOMContentLoaded event <https://developer.mozilla.org/fr/docs/Web/Events/DOMContentLoaded>`_ instead.

Search
^^^^^^

The :ref:`unified search<unified-search>` replaces the traditional search input, hence ``OCA.Search`` became a noop. For backwards compatibility, the code will not raise any errors now, but it does not have any functionality.

Removed globals
^^^^^^^^^^^^^^^

* ``escape-html``: use `the escape-html package <https://www.npmjs.com/package/escape-html>` or similar

Deprecated global variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^

* ``humanFileSize``: use ``formatfilesize`` from https://www.npmjs.com/package/@nextcloud/files
* ``OC.getCanonicalLocale``: use ``getCanonicalLocale`` from https://www.npmjs.com/package/@nextcloud/l10n

Removed jQuery plugins
^^^^^^^^^^^^^^^^^^^^^^

* ``$.tipsy``

Back-end changes
----------------

App bootstrap logic
^^^^^^^^^^^^^^^^^^^

The code that initializes an app or anything that should run for every request and command is now moved to a dedicated and typed API. The ``appinfo/app.php`` is therefore obsolete and deprecated. See :ref:`bootstrapping<Bootstrapping>` for details.

.. _upgrade-psr3:

PSR-3 integration
^^^^^^^^^^^^^^^^^

Nextcloud 20 is the first major release of Nextcloud that brings full compatibility with :ref:`psr3`. From this point on it is highly recommended to use this interface mainly as the old ``\OCP\ILogger`` got deprecated with the last remaining changes. The majority of methods are identical between the Nextcloud-specific interface and the PSR one. Pay attention to usages of ``\OCP\ILogger::logException`` as that method does not exist on the PSR logger. However, you can specify an ``exception`` key in the ``$context`` argument of any ``\Psr\Log\LoggerInterface`` method and Nextcloud will format it like it did with the old ``logException``.

.. _upgrade-psr11:

PSR-11 integration
^^^^^^^^^^^^^^^^^^

Nextcloud 20 is the first major release of Nextcloud that brings full compatibility with :ref:`psr11`. From this point on it is highly recommended to use this interface mainly as the old ``\OCP\IContainer`` got deprecated with this change.

The interfaces ``\OCP\AppFramework\IAppContainer`` and ``\OCP\IServerContainer`` will remain, but they won't extend the ``IContainer`` anymore once that interface gets removed. As a result, ``IAppContainer`` and ``IServerContainer`` will eventually become tagging interfaces with the sole purpose of making it possible to have either the app or server container injected explicitly.

If your app requires Nextcloud 20 or later, you can replace any of the old type hints with one of ``\Psr\Container\ContainerInterface`` and replace calls of ``query`` with ``get``, e.g. on the closures used when registering services:

.. code-block:: php

  // old
  $container->registerService('DecryptAll', function (IAppContainer $c) {
    return new DecryptAll(
      $c->query('Util'),
      $c->query(KeyManager::class),
      $c->query('Crypt'),
      $c->query(ISession::class)
    )
  })

becomes

.. code-block:: php

  // new
  $container->registerService('DecryptAll', function (ContainerInterface $c) {
    return new DecryptAll(
      $c->get('Util'),
      $c->get(KeyManager::class),
      $c->get('Crypt'),
      $c->get(ISession::class)
    )
  })

.. note:: For a smoother transition, the old interfaces were changed so they are based on ``ContainerInterface``, hence you can use ``has`` and ``get`` on ``IContainer`` and sub types.

Deprecated APIs
***************

* ``\OCP\IContainer``: see :ref:`upgrade-psr11`
* ``\OCP\ILogger``: see :ref:`upgrade-psr3`
* ``\OCP\IServerContainer::getEventDispatcher``
* ``\OCP\IServerContainer::getCalendarManager``: have the interface injected instead
* ``\OCP\IServerContainer::getCalendarResourceBackendManager``: have the interface injected instead
* ``\OCP\IServerContainer::getCalendarRoomBackendManager``: have the interface injected instead
* ``\OCP\IServerContainer::getContactsManager``: have the interface injected instead
* ``\OCP\IServerContainer::getEncryptionManager``: have the interface injected instead
* ``\OCP\IServerContainer::getEncryptionFilesHelper``: have the interface injected instead
* ``\OCP\IServerContainer::getEncryptionKeyStorage``: have the interface injected instead
* ``\OCP\IServerContainer::getRequest``: have the interface injected instead
* ``\OCP\IServerContainer::getPreviewManager``: have the interface injected instead
* ``\OCP\IServerContainer::getTagManager``: have the interface injected instead
* ``\OCP\IServerContainer::getSystemTagManager``: have the interface injected instead
* ``\OCP\IServerContainer::getSystemTagObjectMapper``: have the interface injected instead
* ``\OCP\IServerContainer::getAvatarManager``: have the interface injected instead
* ``\OCP\IServerContainer::getRootFolder``
* ``\OCP\IServerContainer::getUserManager``: have the interface injected instead
* ``\OCP\IServerContainer::getGroupManager``: have the interface injected instead
* ``\OCP\IServerContainer::getUserSession``: have the interface injected instead
* ``\OCP\IServerContainer::getSession``: have the interface injected instead
* ``\OCP\IServerContainer::getTwoFactorAuthManager``: have the interface injected instead
* ``\OCP\IServerContainer::getNavigationManager``: have the interface injected instead
* ``\OCP\IServerContainer::getConfig``: have the interface injected instead
* ``\OCP\IServerContainer::getSystemConfig``: have the interface injected instead
* ``\OCP\IServerContainer::getAppConfig``: have the interface injected instead
* ``\OCP\IServerContainer::getL10NFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getL10N``: have the interface injected instead
* ``\OCP\IServerContainer::getURLGenerator``: have the interface injected instead
* ``\OCP\IServerContainer::getAppFetcher``: have the interface injected instead
* ``\OCP\IServerContainer::getMemCacheFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getGetRedisFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getDatabaseConnection``: have the interface injected instead
* ``\OCP\IServerContainer::getActivityManager``: have the interface injected instead
* ``\OCP\IServerContainer::getJobList``: have the interface injected instead
* ``\OCP\IServerContainer::getLogger``: have the interface injected instead
* ``\OCP\IServerContainer::getLogFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getRouter``: have the interface injected instead
* ``\OCP\IServerContainer::getSearch``: have the interface injected instead
* ``\OCP\IServerContainer::getSecureRandom``: have the interface injected instead
* ``\OCP\IServerContainer::getCrypto``: have the interface injected instead
* ``\OCP\IServerContainer::getHasher``: have the interface injected instead
* ``\OCP\IServerContainer::getCredentialsManager``: have the interface injected instead
* ``\OCP\IServerContainer::getCertificateManager``: have the interface injected instead
* ``\OCP\IServerContainer::getHTTPClientService``: have the interface injected instead
* ``\OCP\IServerContainer::createEventSource``
* ``\OCP\IServerContainer::getEventLogger``: have the interface injected instead
* ``\OCP\IServerContainer::getQueryLogger``: have the interface injected instead
* ``\OCP\IServerContainer::getTempManager``: have the interface injected instead
* ``\OCP\IServerContainer::getAppManager``: have the interface injected instead
* ``\OCP\IServerContainer::getMailer``: have the interface injected instead
* ``\OCP\IServerContainer::getWebRoot``: have the interface injected instead
* ``\OCP\IServerContainer::getOcsClient``: have the interface injected instead
* ``\OCP\IServerContainer::getDateTimeZone``: have the interface injected instead
* ``\OCP\IServerContainer::getDateTimeFormatter``: have the interface injected instead
* ``\OCP\IServerContainer::getMountProviderCollection``: have the interface injected instead
* ``\OCP\IServerContainer::getIniWrapper``: have the interface injected instead
* ``\OCP\IServerContainer::getCommandBus``: have the interface injected instead
* ``\OCP\IServerContainer::getTrustedDomainHelper``: have the interface injected instead
* ``\OCP\IServerContainer::getLockingProvider``: have the interface injected instead
* ``\OCP\IServerContainer::getMountManager``: have the interface injected instead
* ``\OCP\IServerContainer::getUserMountCache``: have the interface injected instead
* ``\OCP\IServerContainer::getMimeTypeDetector``: have the interface injected instead
* ``\OCP\IServerContainer::getMimeTypeLoader``: have the interface injected instead
* ``\OCP\IServerContainer::getCapabilitiesManager``: have the interface injected instead
* ``\OCP\IServerContainer::getNotificationManager``: have the interface injected instead
* ``\OCP\IServerContainer::getCommentsManager``: have the interface injected instead
* ``\OCP\IServerContainer::getThemingDefaults``: have the interface injected instead
* ``\OCP\IServerContainer::getIntegrityCodeChecker``: have the interface injected instead
* ``\OCP\IServerContainer::getSessionCryptoWrapper``: have the interface injected instead
* ``\OCP\IServerContainer::getCsrfTokenManager``: have the interface injected instead
* ``\OCP\IServerContainer::getBruteForceThrottler``: have the interface injected instead
* ``\OCP\IServerContainer::getContentSecurityPolicyManager``: have the interface injected instead
* ``\OCP\IServerContainer::getContentSecurityPolicyNonceManager``: have the interface injected instead
* ``\OCP\IServerContainer::getStoragesBackendService``: have the interface injected instead
* ``\OCP\IServerContainer::getGlobalStoragesService``: have the interface injected instead
* ``\OCP\IServerContainer::getUserGlobalStoragesService``: have the interface injected instead
* ``\OCP\IServerContainer::getUserStoragesService``: have the interface injected instead
* ``\OCP\IServerContainer::getShareManager``: have the interface injected instead
* ``\OCP\IServerContainer::getCollaboratorSearch``: have the interface injected instead
* ``\OCP\IServerContainer::getAutoCompleteManager``: have the interface injected instead
* ``\OCP\IServerContainer::getLDAPProvider``: have the interface injected instead
* ``\OCP\IServerContainer::getSettingsManager``: have the interface injected instead
* ``\OCP\IServerContainer::getAppDataDir``
* ``\OCP\IServerContainer::getCloudIdManager``: have the interface injected instead
* ``\OCP\IServerContainer::getGlobalScaleConfig``: have the interface injected instead
* ``\OCP\IServerContainer::getCloudFederationProviderManager``: have the interface injected instead
* ``\OCP\IServerContainer::getRemoteApiFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getCloudFederationFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getRemoteInstanceFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getStorageFactory``: have the interface injected instead
* ``\OCP\IServerContainer::getGeneratorHelper``: have the interface injected instead
* ``\OC_App::registerLogIn()``: use :ref:`bootstrapping<Bootstrapping>` and ``\OCP\AppFramework\Bootstrap\IRegistrationContext::registerAlternativeLogin``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::createCachedCalendarObject``: listen to ``\OCA\DAV\Events\CachedCalendarObjectCreatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::createCalendar``: listen to ``\OCA\DAV\Events\CalendarCreatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::createCalendarObject``: listen to ``\OCA\DAV\Events\CalendarObjectCreatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::createSubscription``: listen to ``\OCA\DAV\Events\SubscriptionCreatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::deleteCachedCalendarObject``: listen to ``\OCA\DAV\Events\CachedCalendarObjectDeletedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::deleteCalendar``: listen to ``\OCA\DAV\Events\CalendarDeletedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::deleteCalendarObject``: listen to ``\OCA\DAV\Events\CalendarObjectDeletedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::deleteSubscription``: listen to ``\OCA\DAV\Events\SubscriptionDeletedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::publishCalendar``: listen to ``\OCA\DAV\Events\CalendarPublishedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::publishCalendar``: listen to ``\OCA\DAV\Events\CalendarUnpublishedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::updateCachedCalendarObject``: listen to ``\OCA\DAV\Events\CachedCalendarObjectUpdatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::updateCalendar``: listen to ``\OCA\DAV\Events\CalendarUpdatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::updateCalendarObject``: listen to ``\OCA\DAV\Events\CalendarObjectUpdatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::updateShares``: listen to ``\OCA\DAV\Events\CalendarShareUpdatedEvent``
* Event ``\OCA\DAV\CalDAV\CalDavBackend::updateSubscription``: listen to ``\OCA\DAV\Events\SubscriptionUpdatedEvent``
* Event ``\\OCA\DAV\CardDAV\CardDavBackend::createCard``: listen to ``\OCA\DAV\Events\CardCreatedEvent``
* Event ``\OCA\DAV\CardDAV\CardDavBackend::deleteCard``: listen to ``\OCA\DAV\Events\CardDeletedEvent``
* Event ``\OCA\DAV\CardDAV\CardDavBackend::updateCard``: listen to ``\OCA\DAV\Events\CardUpdatedEvent``
* Event ``\OCA\Files_Sharing::loadAdditionalScripts:: publicShareAuth``: listen to ``\OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent``
* Event ``\OCA\Files_Sharing::loadAdditionalScripts``: listen to ``\OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent``
* Event ``\OCA\User_LDAP\User\User::postLDAPBackendAdded``: listen to ``\OCA\User_LDAP\Events\UserBackendRegistered``
* Event ``\OCA\User_LDAP\User\User::postLDAPBackendAdded``: listen to ``\OCA\User_LDAP\Events\GroupBackendRegistered``
* Event ``\OCP\AppFramework\Http\StandaloneTemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPT``: listen to ``\OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent``
* Event ``\OCP\AppFramework\Http\StandaloneTemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS_LOGGEDIN``: listen to ``\OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent``
* Event ``\OCP\WorkflowEngine::loadAdditionalSettingScripts``: listen to ``\OCP\WorkflowEngine\Events\LoadSettingsScriptsEvent``


Removed from public namespace
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* ``\OCP\IServerContainer::getAppFolder``
* Hook ``\OCA\DAV\Connector\Sabre::authInit``: use the ``\OCA\DAV\Events\SabrePluginAuthInitEvent`` event instead
* Event ``\OC_User::post_removeFromGroup``: listen to ``\OCP\Group\Events\UserRemovedEvent``
* Event ``\OCA\DAV\Connector\Sabre::authInit``: listen to ``\OCA\DAV\Events\SabrePluginAuthInitEvent``

