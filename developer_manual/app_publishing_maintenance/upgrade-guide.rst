=================
App upgrade guide
=================

Once you've created and published the first version of your app, you will want to keep it up to date with the latest Nextcloud features.

This document will cover the most important changes in Nextcloud, as well as some guides on how to upgrade existing apps.

Upgrading to Nextcloud 21
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/23210>`__. See the original ticket for links to the pull requests and tickets.

General
^^^^^^^

The biggest change in Nextcloud 21 is the initial support for PHP 8 and the corresponding updates of many core dependencies, which could have direct and indirect consequences for apps.

PHP 8 support
*************

Nextcloud 21 is the first major release that is compatible with the new PHP 8.0. As a consequence, some previously working syntax can cause problems when an app is deployed with PHP newer than 7.4. The full changelog can be found `on the php.net website <https://www.php.net/ChangeLog-8.php>`__. There is also a document for all breaking changes `on Github <https://github.com/php/php-src/blob/PHP-8.0/UPGRADING#L20>`__.

To check compatibility automatically we recommend adding or updating the :ref:`app-ci` of your app so that linters, tests and static analysis can warn you about any problems before the app is shipped to users.

Updated core libraries
**********************

If apps use only official public APIs of Nextcloud, the update of core libraries should have little to no effect on apps. However, there are some edge cases where an app still has a code dependency to a library shipped with Nextcloud, e.g. when those 3rdparty classes or functions are used, and therefore app developers are recommended to check their code for any incompatibility. Moreover it's recommended to check compatibility with sophisticated tools, as documented at the  :ref:`static analysis<app-static-analysis>` section.

``doctrine/dbal``
=================

The Doctrine Database Abstraction Layer powers Nextcloud's database connection and query builder. In Nextcloud 21, this dependency was updated from 2.x to 3.0. As a consequence, some types that were previously exported through the Nextcloud OCP API are removed or changed by this update. For backwards-compatibility, there is now a tiny compatibility layer between the original Doctrine API and what apps use via the Nextcloud API.

Optimistically speaking, the database connection and the query builder should mostly work like in Nextcloud 20 or older. The main differences are that prepared statements and query results are not handled by the removed Doctrine ``Statement`` but two new Nextcloud types ``IPreparedStatement`` and ``IResult``. You don't have to worry about these types unless you pass around the result of a query to class/method/function with type hints. In this rare case, please adjust the type hints accordingly for the new type if you only support Nextcloud 21 in your apps or remove the type hint temporarily for multi-version Nextcloud support.

Some (minor) breaking changes were inevitable. Here's the summary

* ``$queryBuilder->execute()->fetch()`` only has one argument now (there were three previously)
* ``$queryBuilder->execute()->fetchColumn()`` has no more arguments and got also deprecated. Use ``fetchOne`` instead
* ``$queryBuilder->execute()->bindParam()`` was removed because conceptually it does not make sense to bind a parameter *after* executing a query. Use ``bindParam`` on the ``IPeparedStatement`` instead.
* ``$queryBuilder->execute()->bindValue()`` was removed because conceptually it does not make sense to bind a value *after* executing a query. Use ``bindValue`` on the ``IPeparedStatement`` instead.
* ``$queryBuilder->execute()->columnCount()`` was removed
* ``$queryBuilder->execute()->errorCode()`` was removed from Doctrine
* ``$queryBuilder->execute()->errorInfo()`` was removed from Doctrine
* ``$queryBuilder->execute()->setFetchMode()`` was removed from Doctrine
* ``$connection->prepare()->execute()`` previously returned ``false`` under some error conditions, it now always gives you an ``IResult`` or throws an exception
* ``\Doctrine\DBAL\Types\Type::*`` type constants were moved, which some apps used for column type constants in apps. Use ``\Doctrine\DBAL\Types\Types::*`` or inline the values.

The details of this change can also be seen in the `pull request on Github <https://github.com/nextcloud/server/pull/24948>`__ and in the upstream `dbal 3.0.xx upgrade document <https://github.com/doctrine/dbal/blob/3.0.x/UPGRADE.md>`__.

``guzzlehttp/guzzle``
=====================

The HTTP client library behind the Nextcloud HTTP client was updated for PHP 8 compatibility. The Nextcloud abstraction remained untouched and will work like before. If you used Guzzle directly, make sure you don't use the fluent API on requests or responses.

``psr/log``
===========

The :ref:`psr3` package was updated to v1.1. The ``log`` method can now theoretically throw an ``\Psr\Log\InvalidArgumentException``, though Nextcloud does not make use of this at the moment. It's recommended to check any usage of the method nevertheless and add error handling if appropriate.

``sabre/*``
===========

The Sabre packages received a minor update. Only apps that provide DAV functionality should be effected, if any.

App code checker deprecation
****************************

The app code checker (``occ app:check-code myapp``) is obsolete due to :ref:`static analysis<app-static-analysis>`. For Nextcloud 21 it will act as NOOP, meaning that you can still call the command but it will never fail. This allows you to still use it on CI if you test against 21, 20 and older releases. But prepare the switch to static analysis if you haven't already. Please also note that the app code checker hadn't received many updates recently, hence the number of issues it can detect is low.

PSR-0 deprecation
*****************

The original `PSR-0` standard was deprecated in 2014 and therefore the support for it in Nextcloud will also end soon. Hence we recommend migrating your class file names to `PSR-4`.

.. _`PSR-0`: https://www.php-fig.org/psr/psr-0/
.. _`PSR-4`: https://www.php-fig.org/psr/psr-4/

Last version with database.xml support and migration
****************************************************

Nextcloud 21 is the last major release that supports an app's ``appinfo/database.xml`` to :ref:`define the database schema<database-xml>`. This is your last change to :ref:`automatically convert this deprecated file into the new migration classes<migrate-database-xml>`.

Replaced well-known handler API
*******************************

There was an old, unused and inofficial mechanism to hook into well-known discovery via config settings. This includes ``host-meta``, ``host-meta.json``, ``nodeinfo`` and ``webfinger``. A :ref:`new public API replaces this mechanism<web-host-metadata>` in Nextcloud 21.

Upgrading to Nextcloud 20
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/20953>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
^^^^^^^^^^^^^^^^^

Body theme
**********

The body theme classes are now ``theme--highcontrast``, ``theme--dark`` and/or ``theme--light``.

jQuery update
*************

jQuery was updated to v2.2. The most notable change is that ``$(document).ready(...)`` or ``$(...)`` for short fires sooner than before. Use the `DOMContentLoaded event <https://developer.mozilla.org/fr/docs/Web/Events/DOMContentLoaded>`_ instead.

Search
******

The :ref:`unified search<unified-search>` replaces the traditional search input, hence ``OCA.Search`` became a noop. For backwards compatibility, the code will not raise any errors now, but it does not have any functionality.

Removed globals
***************

* ``escape-html``: use `the escape-html package <https://www.npmjs.com/package/escape-html>` or similar

Deprecated global variables
***************************

* ``humanFileSize``: use ``formatfilesize`` from https://www.npmjs.com/package/@nextcloud/files
* ``OC.getCanonicalLocale``: use ``getCanonicalLocale`` from https://www.npmjs.com/package/@nextcloud/l10n

Removed jQuery plugins
**********************

* ``$.tipsy``

Back-end changes
^^^^^^^^^^^^^^^^

App bootstrap logic
*******************

The code that initializes an app or anything that should run for every request and command is now moved to a dedicated and typed API. The ``appinfo/app.php`` is therefore obsolete and deprecated. See :ref:`bootstrapping<Bootstrapping>` for details.

.. _upgrade-psr3:

PSR-3 integration
*****************

Nextcloud 20 is the first major release of Nextcloud that brings full compatibility with :ref:`psr3`. From this point on it is highly recommended to use this interface mainly as the old ``\OCP\ILogger`` got deprecated with the last remaining changes. The majority of methods are identical between the Nextcloud-specific interface and the PSR one. Pay attention to usages of ``\OCP\ILogger::logException`` as that method does not exist on the PSR logger. However, you can specifcy an ``exception`` key in the ``$context`` argument of any ``\Psr\Log\LoggerInterface`` method and Nextcloud will format it like it did with the old ``logException``.

.. _upgrade-psr11:

PSR-11 integration
******************

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
      $c->get(KeyManager::class'),
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
*****************************

* ``\OCP\IServerContainer::getAppFolder``
* Hook ``\OCA\DAV\Connector\Sabre::authInit``: use the ``\OCA\DAV\Events\SabrePluginAuthInitEvent`` event instead
* Event ``\OC_User::post_removeFromGroup``: listen to ``\OCP\Group\Events\UserRemovedEvent``
* Event ``\OCA\DAV\Connector\Sabre::authInit``: listen to ``\OCA\DAV\Events\SabrePluginAuthInitEvent``


Upgrading to Nextcloud 19
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/18479>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
^^^^^^^^^^^^^^^^^

jQuery deprecation
******************

As of Nextcloud 19, the global `jquery` and `$` are deprecated for apps. While the library won't be removed immediately to give developers time to adapt, we encourage you to either replace it with another library or simply use a bundling tool like webpack to scope it to your own. The library will be upgraded in Nextcloud in future versions of Nextcloud and there are breaking changes in the newer versions of jQuery.

Deprecated global variables
***************************

* ``OC.currentUser``: use ``getCurrentUser`` from https://www.npmjs.com/package/@nextcloud/auth
* ``OC.filePath``: use ``generateFilePath`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.generateUrl``: use ``generateUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.get``: use https://lodash.com/docs#get
* ``OC.getCurrentUser``: use ``getCurrentUser`` from https://www.npmjs.com/package/@nextcloud/auth
* ``OC.getRootPath``: use ``getRootUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.imagePath``: use ``imagePath`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.linkTo``: use ``linkTo`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.linkToOCS``: use ``generateOcsUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.linkToRemote``: use ``generateRemoteUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.set``: use https://lodash.com/docs#set
* ``OC.webroot``: use ``getRootUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OCP.Toast.*``: use https://www.npmjs.com/package/@nextcloud/dialogs

Removed globals
***************

* ``getURLParameter``
* ``formatDate``
* ``humanFileSize``
* ``relative_modified_date``

Removed libraries
*****************

* ``marked``

Back-end changes
^^^^^^^^^^^^^^^^

Symfony update
**************

Symfony was updated to `v4.4 <https://github.com/symfony/symfony/blob/4.4/CHANGELOG-4.4.md>`__. The most important change for apps is to return an int value from CLI commands. Returning null (explicitly or implicitly) won't be allowed in future versions of Symfony.

Deprecation of injection of named services
******************************************

Apps had been able to query core services like the implementation of the interface ``\OCP\ITagManager`` as ``TagManager``. To unify the service resolution with type hints for the constructor injection, the named resolution is deprecated, logs warnings and will be removed in the future. Use the fully-qualifier class name (with the `::class` constant) instead:

If you had

.. code-block:: php

  $tagManager = \OC::$server->query('TagManager');

change your code to

.. code-block:: php

  $tagManager = \OC::$server->query(\OCP\ITagManager::class);

On constructor arguments you should always type-hint the service by its interface. If you do so already, nothing changes for you.

New APIs
********

* ``\OCP\Authentication\Events\LoginFailedEvent`` class added
* ``\OCP\Comments\IComment::getReferenceId`` method added
* ``\OCP\Comments\IComment::setReferenceId`` method added
* ``\OCP\Contacts\Events\ContactInteractedWithEvent`` class added
* ``\OCP\EventDispatcher\IEventDispatcher::removeListener`` method added
* ``\OCP\ITags::TAG_FAVORITE`` constant added
* ``\OCP\Mail\Events\BeforeMessageSent`` class added
* ``\OCP\Lock\LockedException::getExistingLock`` method added
* ``\OCP\Share\Events\VerifyMountPointEvent`` class added
* ``\OCP\Share\IManager::allowEnumeration`` method added
* ``\OCP\Share\IManager::limitEnumerationToGroups`` method added

Changed APIs
************

* ``\OCP\User\Events\BeforeUserLoggedInEvent::getUsername`` now correctly returns a string and not an ``\OCP\IUser``


Upgrading to Nextcloud 18
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/17131>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
^^^^^^^^^^^^^^^^^

CSS
***

* Overall font-size was increased. Please make sure you use relative units like `rem` instead of pixels.

Deprecated global variables
***************************

* ``Backbone``: ship your own.
* ``Clipboard``: ship your own.
* ``ClipboardJs``: ship your own.
* ``DOMPurify``: ship your own.
* ``Handlebars``: ship your own.
* ``jstimezonedetect``: ship your own.
* ``jstz``: ship your own.
* ``md5``: ship your own.
* ``moment``: ship your own.
* ``OC.basename``: use ``basename`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.dirname``: use ``dirname`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.encodePath``: use ``encodePath`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.isSamePath``: use ``isSamePath`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.joinPaths``: use ``joinPaths`` from https://www.npmjs.com/package/@nextcloud/paths

Back-end changes
^^^^^^^^^^^^^^^^

New APIs
********

* ``\OCP\WorkflowEngine`` namespace

Deprecations
************

* ``\OCP\Collaboration\Resources\IManager::registerResourceProvider``: use ``\OCP\Collaboration\Resources\IProviderManager::registerResourceProvider`` instead.

Behavioral changes
^^^^^^^^^^^^^^^^^^

* Email shares and link shares now share the same config.
  You cannot create mail shares if the share links are disabled by your administrator
* Please register new sidebar tabs scripts with the ``OCA\Files\Event\LoadSidebar\Event`` script
* Viewer binds the full file object to the views now. Variables names changed!


Upgrading to Nextcloud 17
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/15339>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
^^^^^^^^^^^^^^^^^

Deprecated global variables
***************************

* ``initCore``: don't use this internal function.
* ``oc_appconfig``: use ``OC.appConfig`` instead.
* ``oc_appswebroots``: use ``OC.appswebroots`` instead.
* ``oc_capabilities``: use ``OC.getCapabilities()`` instead.
* ``oc_config``: use ``OC.config`` instead.
* ``oc_current_user``: use ``OC.getCurrentUser().uid`` instead.
* ``oc_debug``: use ``OC.debug`` instead.
* ``oc_isadmin``: use ``OC.isUserAdmin()`` instead.
* ``oc_requesttoken``: use ``OC.requestToken`` instead.
* ``oc_webroot``: use ``OC.getRootPath()`` instead.
* ``OCDialogs``: use ``OC.dialogs`` instead.
* ``OC._capabilities``: use ``OC.getCapabilities()`` instead.
* ``OC.addTranslations``: use `OC.L10N.load` instead.
* ``OC.coreApps``: internal use only, no replacement.
* ``OC.getHost``: use the use ``window.location.host`` directly.
* ``OC.getHostName``: use the use ``window.location.hostname`` directly.
* ``OC.getPort``: use the use ``window.location.port`` directly.
* ``OC.getProtocol``: use the use ``window.location.protocol.split(':')[0]`` directly.
* ``OC.fileIsBlacklisted``: use the regex ``OC.config.blacklist_files_regex`` directly.
* ``OC.redirect``: use ``window.location`` directly.
* ``OC.reload``: use ``window.location.reload()`` directly.

Removed jQuery plugins
**********************

* ``singleselect``: ship your own if you really need it.


Back-end changes
^^^^^^^^^^^^^^^^

Removed from public namespace
*****************************

* ``\OCP\App::checkAppEnabled``
* ``\OCP\Security\StringUtils``
* ``\OCP\Util::callCheck``

Deprecations
************

* ``\OCP\AppFramework\Http\EmptyContentSecurityPolicy::allowEvalScript``: This means apps should no longer use eval in their JavaScript. We aim to forbid this in general in a future version of Nextcloud.
* ``\OCP\AppFramework\Utility\IControllerMethodReflector::reflec``: Will be removed in 18.

Behavioral changes
^^^^^^^^^^^^^^^^^^

* LDAP: default value for ``ldapGroupMemberAssocAttr`` changed from ``uniqueMember`` to unset. On scripted setups, it has to be set if LDAP groups should be used within Nextcloud. 
* Provisioning API: creating users will return the assigned user ID as dataset, as in ``['id' => $userid]``.


Upgrading to Nextcloud 16
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/12915>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
^^^^^^^^^^^^^^^^^

* CSP: ``frame-anchestor`` set to ``self`` by default.

Deprecation of shipped JavaScript libraries
*******************************************

The following libraries are considered as deprecated from Nextcloud 16 on. If you use one of those in your app, make sure to ship your own version that is properly bundled with your app.

* ``marked``
* ``Clipboard`` -> now exported as ``ClipboardJS`` to resolve naming conflicts in Chrome.
* Apps should ship their own javascript dependencies and not depend on server shipping for example jquery etc. Depending on the server dist package is deprecated starting NC16.
* ``escapeHTML``
* ``formatDate``
* ``getURLParameter``
* ``humanFileSize``
* ``relative_modified_date``
* ``select2``


Back-end changes
^^^^^^^^^^^^^^^^

* Php7.0 support removed. Php7.1 or higher required.
* PostgreSQL 9.5+ required.
* Autoloading: In the past it was also possible to autoload PHP classes in apps by specify a list of classes and filenames in `appinfo/classpath.php`. This should not be used anymore and also isn't used by any app that is publicly available.

Removed APIs
************

* ``\OCP\Activity\IManager::getNotificationTypes``
* ``\OCP\Activity\IManager::getDefaultTypes``
* ``\OCP\Activity\IManager::getTypeIcon``
* ``\OCP\Activity\IManager::translate``
* ``\OCP\Activity\IManager::getSpecialParameterList``
* ``\OCP\Activity\IManager::getGroupParameter``
* ``\OCP\Activity\IManager::getNavigation``
* ``\OCP\Activity\IManager::isFilterValid``
* ``\OCP\Activity\IManager::filterNotificationTypes``
* ``\OCP\Activity\IManager::getQueryForFilter``
* ``\OCP\Security\ISecureRandom::getLowStrengthGenerator``
* ``\OCP\Security\ISecureRandom::getMediumStrengthGenerator``


Upgrading to Nextcloud 15
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/15339>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
^^^^^^^^^^^^^^^^^

* ``unsafe-eval`` not allowed anymore by default.

Removed APIs
************
- ``fileDownloadPath()``
- ``getScrollBarWidth()``
- ``OC.AppConfig.hasKey()``
- ``OC.AppConfig.deleteApp()``
- ``OC.Share.ShareConfigModel.areAvatarsEnabled()``
- ``OC.Util.hasSVGSupport()``
- ``OC.Util.replaceSVGIcon()``
- ``OC.Util.replaceSVG()``
- ``OC.Util.scaleFixForIE8()``
- ``OC.Util.isIE8()``

Back-end changes
^^^^^^^^^^^^^^^^

* Removed php7.0 support

Deprecated APIs
***************

* ``\OCP\Util::linkToPublic``
* ``\OCP\Util::recursiveArraySearch``

Removed APIs
************

* ``\OCP\Activity\IManager::publishActivity``
* ``\OCP\Util::logException``
* ``\OCP\Util::mb_substr_replace``
* ``\OCP\Util::mb_str_replace``


Upgrading to Nextcloud 14
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/7827>`__. See the original ticket for links to the pull requests and tickets.

General
^^^^^^^

* php7.0 and php7.1 support added.
* Introduction of type hints for scalar types in public APIs according to existing PHPDoc.

Front-end changes
^^^^^^^^^^^^^^^^^

* ``OCA.Search`` is now ``OCA.Search.Core``.
* Overall structure changed.
* ``.with-app-sidebar`` not required anymore to open the sidebar only use `disappear` on the sidebar
* ``.svg`` not required anymore
* ``.with-settings`` not required anymore
* ``.with-icon`` not required anymore

Back-end changes
^^^^^^^^^^^^^^^^

Changed APIs
************

* ``AppFramework\Http\Request::getHeader`` always returns a string (and not null).
* ``Security\ICrypto::decrypt`` only accepts strings.
* ``\OCP\AppFramework\Utility\ITimeFactory`` is strictly typed.
* ``\OCP\IL10N`` is strictly typed.
* ``\OCP\Mail`` and the email templates got type hints.
* ``\OCP\Authentication\TwoFactorAuth`` got typehints and return type hints.
* ``\OCP\Migration\IMigrationStep`` has two new methods.
* ``EMailTemplate`` child classes should use the `%$1s` notation for replacements to be future compatible and be able to reuse parameters.

Deprecated APIs
***************

* ``OCP\Files``
* Setting custom client URLs in a custom ``\OC_Theme`` class. Settings in config.php should be used.
* Log levels in ``OCP\Util``. Moved to the ``\OCP\ILogger`` interface
* ``OCP\AppFramework\Db\Mapper``. Move to ``\OCP\AppFramework\Db\QBMapper``

Removed APIs
************

* several deprecated functions from ``\OCP\AppFramework/IAppContainer``
* ``\OCP\BackgroundJob::registerJob``
* ``\OCP\Config``
* ``\OCP\Contacts``
* ``\OCP\DB``
* ``\OCP\Files::tmpFile``
* ``\OCP\Files::tmpFolder``
* ``\OCP\IHelper``
* ``\OCP\ISearch\search``
* ``\OCP\JSON``
* ``\OCP\Response``
* ``\OCP\Share::resolveReshare``
* ``\OCP\User::getDisplayNames``
* ``\OCP\Util\formatDate``
* ``\OCP\Util::generateRandomBytes``
* ``\OCP\Util::sendMail``
* ``\OCP\Util::encryptedFiles``
* ``\OCP\Util::getServerProtocol``
* ``\OCP\Util::getServerHost``
* ``\OCP\Util::getServerProtocol``
* ``\OCP\Util::getRequestUri``
* ``\OCP\Util::getScriptName``
* ``\OCP\Util::urlgenerator``
* Deprecated `OCP` constants
* Deprecated template functions from OCP
* Some deprecated methods  of ``\OCP\Response``
* HTTPHelper

Behavioral changes
^^^^^^^^^^^^^^^^^^

* Removed ``--no-app-disable`` from ``occ upgrade`` command.
* ``$fromMailAddress`` won't be injected anymore by the DI container.
* Apps that are enabled for groups can now provide public pages, that are available even if a user is not logged in.
* OCS API method `AddUser` `POST:/users` now allow empty password iff email is set and valid.
* Email texts are not automatically escaped anymore in all cases.

Configuration changes
^^^^^^^^^^^^^^^^^^^^^

* When using Swift Objectstore as home storage make sure that to set the ``bucket/container`` parameter.
* ``mail_smtpmode`` can no longer be set to ``php``. As this option is lost with the upgrade of phpmailer.


OCS changes
^^^^^^^^^^^

Added APIs
**********

* Details endpoint for the user list
* Details endpoint for the groups list

Changed APIs
************

* OCS API `getGroup` method replaced by `getGroupUsers` #8904 


Internal changes
^^^^^^^^^^^^^^^^

.. note:: Only relevant if you used non-public APIs. Don't use them.

* cleanup of ``OC_*`` namespace - we removed quite some classes, methods and constants from our internal namespace.
* Removed ``OC_Group_Backend``
* Removed ``OC_Response::setStatus`` and the constants for status codes
