=======================
Upgrade to Nextcloud 32
=======================

General
-------

- A new ``tests/autoload.php`` file was added to server repository, that you can include in your app ``bootstrap.php`` file for tests, to be able to load the core ``\Test\TestCase`` class.
  You should remove any call to ``\OC::$loader`` in your code as this legacy loader is being removed.
  This new file is backported to branches stable31, stable30 and stable29, so if your application supports multiple Nextcloud major versions it should still work.

Front-end changes
-----------------

Status colors are now based on secondary styling
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The status colors like ``error``, ``success`` or ``warning`` are now based on the secondary style rather than the primary style.
This means they are now much lighter and thus cannot be used for usage such as text or border colors.
To mitigate this following new CSS variables are introduced:

- ``--color-text-error`` for text that needs error highlight on **normal** background colors.
- ``--color-text-success`` for text that needs success highlight on **normal** background colors.
- ``--color-border-error`` to be used as border color for elements having an error state such as input elements with failing validity.
- ``--color-border-success`` to be used as border color for elements having a success state such as an input was saved or similar.

Please note that there are no text and border variants for ``warning`` and ``info`` as we design wise discourage them on text and borders.

Additionally as sometimes elements need a status color with proper contrast we now provide following variables for status elements like icons:

- ``--color-element-error``
- ``--color-element-info``
- ``--color-element-success``
- ``--color-element-warning``

This existing variables have changed to a secondary style:

- ``--color-error`` to be used as the background color of error style elements (like error state button or note-card).
- ``--color-error-hover`` to be used as the background color of such elements on hover.
- ``--color-error-text`` to be used as the foreground color of such elements.
- Same applies to ``--color-info``, ``--color-success``, ``--color-warning`` and their variants.

Icons should be outlined
^^^^^^^^^^^^^^^^^^^^^^^^

When using Material Icons, use the outlined variant where possible. Exceptions to this are app icons themselves, file type icons, as well as icons that were already a single line, such as the plus or checkmark icons. Reasoning and more details are in `the issue <https://github.com/nextcloud/server/issues/53701>`_.

Deprecated APIs
^^^^^^^^^^^^^^^

- ``--color-error-rgb``, ``--color-info-rgb``, ``--color-success-rgb``, ``--color-warning-rgb`` are deprecated.
  Instead use the native CSS color utils with the the existing variables like ``--color-error`` and similar.
- The ``OC.SystemTags`` api is deprecated. If you need to get the list of system tags, check `this merge request <https://github.com/nextcloud/files_retention/pull/855>`_ for how to fetch the tags directly.

Back-end changes
----------------

- OCP API split into consumable and implementable:
  For a more informed background see `RFC: Split OCP into Consumable and Implementable <https://github.com/nextcloud/standards/issues/15>`_ for more information.
  Short summary:

  - **Consumable:** Interfaces, Enums and classes that have the ``OCP\AppFramework\Attribute\Consumable`` attribute, must only be consumed by apps and can not be implemented by apps themselves.
    This means the server side can extend the interface with new methods or reduce returned types of existing methods without it being consider an API break.
    However argument types of existing methods can **not** be reduced.
    Same rules apply to ``OCP\EventsDispatcher\Event`` that have the ``OCP\AppFramework\Attribute\Listenable`` attribute and ``Exception`` with the ``OCP\AppFramework\Attribute\Catchable`` attribute.
  - **Implementable:** Interfaces, Enums and classes that have the ``OCP\AppFramework\Attribute\Implementable`` attribute, can be implemented by apps.
    This means the server side can **not** extend the interface with new methods or reduce returned types of existing methods without it being consider an API break.
    However argument types of existing methods can be reduced.
    Same rules apply to ``OCP\EventsDispatcher\Event`` that have the ``OCP\AppFramework\Attribute\Dispatchable`` attribute and ``Exception`` with the ``OCP\AppFramework\Attribute\Throwable`` attribute.
  - **ExceptionalImplementable:** Despite not being implementable for all apps, some interfaces can have the ``OCP\AppFramework\Attribute\ExceptionalImplementable`` attribute indicating that they are implementable by a single app (or multiple).
    In those cases the general ``OCP\AppFramework\Attribute\Consumable`` rules apply, but the app maintainers or repository of named exceptions have to be informed during the process of a pull request, leaving them enough time to align with the upcoming change.

- These new attributes will be applied on a "defacto standard" basis to the best of our knowledge.
  In case an API was flagged unexpectedly, leave a comment on the respective pull request in the server repository asking for clarification.

Added Events
^^^^^^^^^^^^

- New ``preloadCollection`` event emitted by the DAV server during PROPFIND requests. See :ref:`collection_preload` for details.
- New ``OCP\SystemTag\TagAssignedEvent`` emitted by the system tag object mapper
- New ``OCP\SystemTag\TagUnassignedEvent`` emitted by the system tag object mapper

Added APIs
^^^^^^^^^^

- New ``OCP\ContextChat`` API. See :ref:`context_chat` for details.
- New interface ``\OCP\OCM\ICapabilityAwareOCMProvider`` to extend the OCM provider with 1.1 and 1.2 extensions of the Open Cloud Mesh Discovery API
- New interface ``\OCP\Search\IExternalProvider`` allows extending the search provider with an explicit flag
  to indicate that the search is performed on external (3rd-party) resources.
  This is used in Unified Search to disable searches through these by default (via a toggle switch).
- New interface ``\OCP\Share\IShareProviderSupportsAllSharesInFolder`` extending ``\OCP\Share\IShareProvider``
  to add the method ``\OCP\Share\IShareProviderSupportsAllSharesInFolder::getAllSharesInFolder`` used for querying all shares in a folder without filtering by user.
- New interface ``\OCP\Notification\IPreloadableNotifier`` to allow notifier implementations to preload
  and cache data for many notifications at once to improve performance by, for example, bundling SQL queries.
- New interface ``\OCP\Template\ITemplateManager`` to access template related functions,
  and get instances of new interface  ``\OCP\Template\ITemplate`` instead of building manually ``\OCP\Template``.
- New attribute ``\OCP\AppFramework\Http\Attribute\RequestHeader`` used for documenting request headers for OpenAPI specifications generated using openapi-extractor.
- New event ``\OCP\Files\Config\Event\UserMountAddedEvent`` which is emitted when new mount is added to the ``oc_mounts`` table.
- New event ``\OCP\Files\Config\Event\UserMountRemovedEvent`` which is emitted when an existing mount is removed from the ``oc_mounts`` table.
- New event ``\OCP\Files\Config\Event\UserMountUpdatedEvent`` which is emitted when an existing mount is updated in the ``oc_mounts`` table.
- New method ``\OCA\Files\Controller\TemplateController::listTemplateFields`` to list the fields of a template,
  accessible at ``/ocs/v2.php/apps/files/api/v1/templates/fields/{fileId}``.
- New method ``\OCP\Files\IFilenameValidator::sanitizeFilename`` allowing to sanitize a given filename to comply with configured constraints.
- New method ``\OCP\Files\Template\ITemplateManager::listTemplateFields`` to allow listing the fields of a template.
- New method ``\OCP\Files\Template\BeforeGetTemplatesEvent::shouldGetFields`` to get the event's ``withFields`` property, which should determine whether or not to perform template field extraction on the returned templates.
- New method ``\OCP\IUser::canChangeEmail`` allowing to check if the user backend allows the user to change their email address.
- New method ``\OCP\IDateTimeZone::getDefaultTimezone`` allowing to get the default timezone configured for Nextcloud.
- New ``OCP\SystemTag\TagAssignedEvent`` emitted by the system tag object mapper
- New ``OCP\SystemTag\TagUnassignedEvent`` emitted by the system tag object mapper
- Task processing API:

  - New task processing task type ``OCP\TaskProcessing\TextToSpeech`` to convert text to speech.
  - New task processing task type ``OCP\TaskProcessing\AnalyzeImages`` to ask questions about images.
  - New method ``OCP\TaskProcessing\Manager::getAvailableTaskTypeIds`` to list only task type IDs without meta-data (faster than ``OCP\TaskProcessing\Manager::getAvailableTaskTypes``)

- New ``OCP\Mail\IEmailValidator`` to validate an email address.

Changed APIs
^^^^^^^^^^^^

- ``\OCP\Authentication\TwoFactorAuth\ILoginSetupProvider::getBody``, ``\OCP\Authentication\TwoFactorAuth\IPersonalProviderSettings::getBody`` and ``\OCP\Authentication\TwoFactorAuth\IProvider::getBody`` return type was broaden from ``\OCP\Template`` class to ``\OCP\Template\ITemplate`` interface. Should not change anything for applications.
- ``\OCP\Files\Template\BeforeGetTemplatesEvent`` now takes an optional boolean constructor value, ``withFields``, that allows you to explicitly control whether template fields should be extracted. The default value is ``false``.
- ``\OCP\IDateTimeZone::getTimezone`` now has a new optional string parameter ``userId`` allowing to request the timezone of another user than the current.
- ``\OCP\IDBConnection::getDatabaseProvider`` now has a new optional boolean parameter ``strict``. When specified the output will differentiate between MySQL and MariaDB. Otherwise MariaDB will be returned as MySQL

Deprecated APIs
^^^^^^^^^^^^^^^

- The files API endpoint ``/apps/files/api/v1/thumbnail/`` for generating previews is deprecated.
  Instead use the preview endpoint provided by Nextcloud core (``/core/preview``).
- The legacy method ``\OC_Helper::canExecute`` is deprecated, please use the ``OCP\IBinaryFinder`` instead.
- ``\OC_Template`` and ``\OCP\Template`` classes are deprecated, please use the new ``\OCP\Template\ITemplateManager`` instead.
- ``\OC_User::useBackend`` is deprecated, please use ``\OCP\IUserManager::registerBackend`` available since 8.0.0
- ``\OC_User::clearBackends`` is deprecated, please use ``\OCP\IUserManager::clearBackends`` available since 8.0.0
- ``\OC_Helper::isReadOnlyConfigEnabled`` is deprecated, please use the ``config_is_read_only`` system config directly.
- ``\OCP\OCM\IOCMProvider`` is deprecated, please use ``\OCP\OCM\ICapabilityAwareOCMProvider`` available since 32.0.0
- ``\OCP\Mail\IMailer::validateMailAddress`` is deprecated, please use ``\OCP\Mail\IEmailValidator`` available since 32.0.0

Removed APIs
^^^^^^^^^^^^

- The ``scssphp`` package is no longer shipped with Nextcloud. This package was not used and deprecated since Nextcloud 22.
  If you need the package for your app, then you need to ship it yourself.
- ``\OCP\Files::getStorage`` and the legacy ``OC_App_::getStorage`` methods were deprecated since Nextcloud 14, respective Nextcloud 5, and were now removed.
  Instead use ``\OCP\Files\IAppData``.
- ``\OCP\AppFramework\App::registerRoutes`` (deprecated in Nextcloud 20) was removed. Instead return the routes as an array from your routes.php or use route attributes.
- The legacy visibility constants of ``OCP\Accounts\IAccountManager``,
  ``VISIBILITY_PRIVATE``, ``VISIBILITY_CONTACTS_ONLY``, ``VISIBILITY_PUBLIC``, were deprecated since Nextcloud 21 and are now removed.
  Instead only the v2 visibility constants can be used.
- Removed deprecated methods of legacy ``\OC_Helper`` class:

  - ``humanFileSize`` was deprecated since version 4.0.0 and replaced with ``\OCP\Util::humanFileSize``
  - ``computerFileSize`` was deprecated since version 4.0.0 and replaced with ``\OCP\Util::computerFileSize``
  - ``mb_array_change_key_case`` was deprecated since version 4.5.0 and replaced with ``\OCP\Util::mb_array_change_key_case``
  - ``recursiveArraySearch`` was deprecated since version 4.5.0 and replaced with ``\OCP\Util::recursiveArraySearch``
  - ``rmdirr`` was deprecated since version 5.0.0 and replaced with ``\OCP\Files::rmdirr``
  - ``maxUploadFilesize`` was deprecated since version 5.0.0 and replaced with ``\OCP\Util::maxUploadFilesize``
  - ``freeSpace`` was deprecated since version 7.0.0 and replaced with ``\OCP\Util::freeSpace``
  - ``uploadLimit`` was deprecated since version 7.0.0 and replaced with ``\OCP\Util::uploadLimit``

- Removed deprecated methods of legacy ``\OC_Util`` class:

  - ``addScript`` was replaced by ``\OCP\Util::addScript`` in 24
  - ``addVendorScript`` was unused and removed
  - ``addTranslations`` was replace by ``\OCP\Util::addTranslations`` in 24

- Template function ``vendor_script`` was unused and removed
- The support for ``app.php`` files, deprecated since Nextcloud 19, was removed. Existence of the file is still checked to show an error if present, but that will be removed in a later version. Please move to ``OCP\AppFramework\Bootstrap\IBoostrap`` instead.
- The following getters, deprecated since 20, were removed. Please use Dependency Injection or ``\OCP\Server::get`` instead:

  - ``IServerContainer::getAppConfig()``
  - ``IServerContainer::getAvatarManager()``
  - ``IServerContainer::getCalendarManager()``
  - ``IServerContainer::getCalendarResourceBackendManager()``
  - ``IServerContainer::getCalendarRoomBackendManager()``
  - ``IServerContainer::getCloudFederationFactory()``
  - ``IServerContainer::getCloudFederationProviderManager()``
  - ``IServerContainer::getCommandBus()``
  - ``IServerContainer::getCommentsManager()``
  - ``IServerContainer::getContentSecurityPolicyManager()``
  - ``IServerContainer::getCredentialsManager()``
  - ``IServerContainer::getDateTimeFormatter()``
  - ``IServerContainer::getDateTimeZone()``
  - ``IServerContainer::getEncryptionKeyStorage()``
  - ``IServerContainer::getEventLogger()``
  - ``IServerContainer::getGlobalScaleConfig()``
  - ``IServerContainer::getHTTPClientService()``
  - ``IServerContainer::getIniWrapper()``
  - ``IServerContainer::getLogFactory()``
  - ``IServerContainer::getMountManager()``
  - ``IServerContainer::getMountProviderCollection()``
  - ``IServerContainer::getNavigationManager()``
  - ``IServerContainer::getPreviewManager()``
  - ``IServerContainer::getQueryLogger()``
  - ``IServerContainer::getRemoteApiFactory()``
  - ``IServerContainer::getRemoteInstanceFactory()``
  - ``IServerContainer::getRouter()``
  - ``IServerContainer::getShareManager()``
  - ``IServerContainer::getStorageFactory()``
  - ``IServerContainer::getSystemTagManager()``
  - ``IServerContainer::getSystemTagObjectMapper()``
  - ``IServerContainer::getTagManager()``
