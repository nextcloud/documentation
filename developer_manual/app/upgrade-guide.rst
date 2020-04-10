=================
App upgrade guide
=================

Once you've created and published the first version of your app, you will want to keep it up to date with the latest Nextcloud features.

This document will cover the most important changes in Nextcloud, as well as some guides on how to upgrade existing apps.

Upgrading to Nextcloud 19
-------------------------

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
* ``OC.set``: use ``generateFilePath`` from use https://lodash.com/docs#set
* ``OC.webroot``: use ``getRootUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OCP.Toast.*``: use https://www.npmjs.com/package/@nextcloud/dialogs

Back-end changes
^^^^^^^^^^^^^^^^

Symfony update
**************

Symfony was updated to `v4.4 <https://github.com/symfony/symfony/blob/4.4/CHANGELOG-4.4.md>`_. The most important change for apps is to return an int value from CLI commands. Returning null (explicitly or implicitly) won't be allowed in future versions of Symfony.

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

* ``\OCP\User\Events\BeforeUserLoggedInEvent::getUsername`` now correctly returns a string and not an `\OCP\IUser`


Upgrading to Nextcloud 18
-------------------------

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/17131>`_. See the original ticket for links to the pull requests and tickets.

Front-end changes
^^^^^^^^^^^^^^^^^

CSS
***

* Overall font-size was increased. Please make sure you use relative units like `rem` instead of pixels.

Deprecated global variables
***************************

* ``DOMPurify``: ship your own.

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

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/15339>`_. See the original ticket for links to the pull requests and tickets.

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

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/12915>`_. See the original ticket for links to the pull requests and tickets.

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

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/15339>`_. See the original ticket for links to the pull requests and tickets.

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

.. note:: Critical changes were collected `on Github <https://github.com/nextcloud/server/issues/7827>`_. See the original ticket for links to the pull requests and tickets.

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
