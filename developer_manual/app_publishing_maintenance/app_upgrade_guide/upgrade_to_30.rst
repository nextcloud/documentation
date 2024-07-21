=======================
Upgrade to Nextcloud 30
=======================

General
-------

A new dependency type ``backend`` was added to info.xml.
If your app requires or makes use of the CalDAV backend in server, please add the backend
``caldav`` to the dependencies of your app.

.. code-block:: xml

   <dependencies>
       <backend>caldav</backend>
   </dependencies>

If no app is requiring the CalDAV backend, the CalDAV section in the admin settings will be hidden.
Currently, there is no other effect but that might change in the future.

Capabilities
------------

``files``
^^^^^^^^^

- ``blacklist_files_regex`` is deprecated now use ``forbidden_filenames`` instead
- ``forbidden_filename_characters`` was added to provide a list of characters not allowed within filenames
- ``forbidden_filename_extensions`` was added to provide a list of extensions (suffixes) not allowed for filenames

Front-end changes
-----------------

The overall design was changed to be less round and more compact,
as a part of this some CSS variables were added and other deprecated with Nextcloud 30, see :ref:`cssvars`.

Clickable area
^^^^^^^^^^^^^^
The size of the CSS variable ``--clickable-area`` variable has shrunk from ``44px`` to ``34px``.
This will result in several regressions and paper-cuts in your app that will need to be manually fixed.
It's recommended to:

1) Link the ``@nextcloud/vue`` current master to your app (pull often cause fixes are getting in there too);
2) Do a codebase-wide search of `44px` and replace with the variable `--default-clickable-area` if appropriate;
3) Check for regressions and visual bugs;
4) Report the regression of your app in this issue (you can create a heading with the name of your own app);
5) Also report ``@nextlcoud/vue`` library regressions if they're not reported already in their list;
6) Fix regression in your app (only the ones that are unrelated to the ``@nextcloud/vue`` components);

Line height
^^^^^^^^^^^
The ``--default-line-height`` variable has changed from ``24px``` to ``1.5`` for the ``--default-font-size`` this
means that the actual value in pixel will go from 24 to 22.5. Although this is a slight change, it's recommended
to check for visual regressions in your app.


Font sizes
^^^^^^^^^^

Nextcloud now provides meaningful default styles for heading elements.
This can cause visual regressions if your code does not explicitly set font size and weight.
If you need to use heading elements outside of text content, you might need to adjust their styles.

Border radius
^^^^^^^^^^^^^

The border radius CSS variables have been refactored:

- Added

  - ``--border-radius-small`` was added for smaller elements like chips.
  - ``--border-radius-container`` was added for smaller containers like action menus.
  - ``--border-radius-container-large`` was added for larger containers like body or modals.
  - ``--border-radius-element`` was added for interactive elements such as buttons, input, navigation and list items.

- Deprecated

  - ``--border-radius`` is deprecated now in favor of ``--border-radius-small``.
  - ``--border-radius-large`` is deprecated now in favor of ``--border-radius-element``.
  - ``--border-radius-pill`` is deprecated now in favor of ``--border-radius-element``.
  - ``--border-radius-rounded`` is deprecated now in favor of ``--border-radius-container``.

CSP Nonce
^^^^^^^^^

A bug was fixed that prevented Nextcloud form using the ``CSP_NONCE`` environment variable,
this now means that the CSP nonce for JavaScript assets is no longer (guaranteed to be) based on the CSRF token.
Instead administrators can choose to use a differently generated token.
When using JavaScript modules this does not make a difference, as they are imported and the nonce has only to be set on the root module (done by Nextcloud),
but if you are using Webpack or otherwise dynamically load scripts, you now need adjust the CSP nonce handling.

Get the CSP nonce:

- Either use ``getCSPNonce`` from the ``@nextcloud/auth`` :ref:`package<js-library_nextcloud-auth>`, which is also backwards compatible.
- Or directly read the nonce from the ``<meta name="csp-nonce" />`` tag.

When using Webpack:

.. code-block:: diff

    - import { getRequestToken } from '@nextcloud/auth'
    - __webpack_nonce__ = btoa(getRequestToken())
    + import { getCSPNonce } from '@nextcloud/auth'
    + __webpack_nonce__ = getCSPNonce()

Deprecated APIs
^^^^^^^^^^^^^^^

- ``OC.config.blacklist_files_regex`` is deprecated now, use the ``files`` capabilities instead
- ``OC.config.forbidden_filename_characters`` is deprecated now, use the ``files`` capabilities instead
- ``OC.dialogs.fileexists`` was already deprecated in Nextcloud 29, but is now also marked as such.
  Use ``openConflictPicker`` from `@nextcloud/upload <https://nextcloud-libraries.github.io/nextcloud-upload/functions/openConflictPicker.html>`_ instead.
- Most ``OC.dialogs`` API is now deprecated and will be removed in the future. For generic dialogs use the ``DialogBuilder`` from the :ref:`js-library_nextcloud-dialogs`.
  A list of the now deprecated methods:

  - ``OC.dialogs.alert``
  - ``OC.dialogs.info``
  - ``OC.dialogs.confirm``
  - ``OC.dialogs.confirmDestructive``
  - ``OC.dialogs.confirmHtml``
  - ``OC.dialogs.prompt``
  - ``OC.dialogs.message``

Back-end changes
----------------

Support for PHP 8.0 removed
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this release support for PHP 8.0 was removed. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``min-version`` to 8.1.

.. code-block:: xml

  <dependencies>
    <php min-version="8.1" max-version="8.3" />
    <nextcloud min-version="27" max-version="30" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.1 <=8.3"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, remove PHP 8.0 from the matrices of tests and linters.

Added APIs
^^^^^^^^^^

- ``OCP\Activity\Exceptions\FilterNotFoundException`` is thrown by ``OCP\Activity\IManager::getFilterById()`` when no filter with the given identifier registered
- ``OCP\Activity\Exceptions\IncompleteActivityException`` is thrown by ``OCP\Activity\IManager::publish()`` when not all required fields have been set on the ``OCP\Activity\IEvent`` object
- ``OCP\Activity\Exceptions\InvalidValueException`` is thrown by ``OCP\Activity\IEvent::set*()`` when the value did not match the required criteria
- ``OCP\Activity\Exceptions\SettingNotFoundException`` is thrown by ``OCP\Activity\IManager::getSettingById()`` when no setting with the given identifier registered
- ``OCP\Activity\Exceptions\UnknownActivityException`` should be thrown by ``OCP\Activity\IProvider::parse()`` when they didn't handle the event
- ``OCP\AppFramework\Db\QbMapper::yieldEntities()`` was added to allow iterating over entities by returning a ``Generator`` without loading all of them into memory.
- ``OCP\Authentication\Token\IToken::SCOPE_FILESYSTEM`` and ``OCP\Authentication\Token\IToken::SCOPE_SKIP_PASSWORD_VALIDATION`` constants were introduced as constants for token scopes. Previously, the value of ``SCOPE_FILESYSTEM`` was hardcoded.
- ``OCP\Notification\IncompleteNotificationException`` is thrown by ``OCP\Notification\IManager::notify()`` when not all required fields have been set on the ``OCP\Notification\INotification`` object
- ``OCP\Notification\IncompleteParsedNotificationException`` is thrown by ``OCP\Notification\IManager::prepare()`` when no ``OCP\Notification\INotifier`` handled the ``OCP\Notification\INotification`` object
- ``OCP\Notification\InvalidValueException`` is thrown by ``OCP\Notification\IAction::set*()`` and ``OCP\Notification\INotification::set*()`` when the value did not match the required criteria
- ``OCP\Notification\UnknownNotificationException`` should be thrown by ``OCP\Notification\INotifier::prepare()`` when they didn't handle the notification
- ``OCA\Files_Trashbin\Trash\ITrashItem::getDeletedBy()`` should return the user who deleted the item or null if unknown
- ``OCP\IUser::getPasswordHash()`` should return the password hash of the user
- ``OCP\IUser::setPasswordHash()`` should set the password hash of the user
- ``OCP\AppFramework\Http\Attribute\OpenAPI::SCOPE_EX_APP`` attribute for scoping APIs only to be used by ExApps.
- ``OCP\AppFramework\Http\Attribute\ExAppRequired`` attribute for restricting controller methods to be only accessible by ExApps.
- ``OCP\Collaboration\Reference\IPublicReferenceProvider`` added for reference providers that support reference lookups from public shares.
- ``OCP\Files\IFilenameValidator`` was added to allow storage independent filename validation.
- ``OCP\Files\Storage\IStorage::setOwner()`` was added to allow setting the owner of a storage so it can be handled independently from the current session user. This is especially useful for storages that have a shared ownership like groupfolders, external storages where the storage owner needs to be set to the user that is initializing the storage through their personal mountpoint.
- ``ShareAPIController::sendShareEmail()`` was added and is accessible via ocs ``/api/v1/shares/{shareId}/send-email``. See :ref:`send-email<Send email>` documentation.
- ``OCP\Calendar\Room\IManager::update()`` was added to update all rooms from all backends right now.
- ``OCP\Calendar\Resource\IManager::update()`` was added to update all resources from all backends right now.
- ``OCP\App\IAppManager::BACKEND_CALDAV`` was added to represent the caldav backend dependency for ``isBackendRequired()``.
- ``OCP\App\IAppManager::isBackendRequired()`` was added to check if at least one app requires a specific backend (currently only ``caldav``).
- ``OCP\Accounts\IAccountManager::PROPERTY_BIRTHDATE`` was added to allow users to configure their date of birth in their profiles.
- ``OCP\TaskProcessing``` was added to unify task processing of AI tasks and other types of tasks. See :ref:`Task Processing<task_processing>`
- ``OCP\AppFramework\Bootstrap\IRegistrationContext::registerTaskProcessingProvider()`` was added to allow registering task processing providers
- ``OCP\AppFramework\Bootstrap\IRegistrationContext::registerTaskProcessingTaskType()`` was added to allow registering task processing task types
- ``OCP\Files\IRootFolder::getAppDataDirectoryName()`` was added to allow getting the name of the app data directory
- ``OCP\Console\ReservedOptions`` was added and contains constants for options reserved for occ core features. ``--debug-log`` and ``--debug-log-level`` are now reserved by occ as they allow to show debug information to the output on any occ command.
- ``OCP\Security\IHasher::validate()`` should return true if the passed string is a valid hash generated by ``OCP\Security\IHasher::hash()``
- ``OCP\AppFramework\Http\JSONResponse()`` constructor now supports passing additional ``json_encode`` flags, see https://www.php.net/manual/en/function.json-encode.php for details

Changed APIs
^^^^^^^^^^^^

- ``OCP\Activity\IEvent::set*()`` (all setters) throw ``OCP\Activity\Exceptions\InvalidValueException`` instead of ``\InvalidArgumentException`` when the value does not match the required criteria.
- Calling ``OCP\Activity\IEvent::setIcon()`` with a relative URL is deprecated and will throw ``OCP\Activity\Exceptions\InvalidValueException`` in a future version.
- Calling ``OCP\Activity\IEvent::setLink()`` with a relative URL is deprecated and will throw ``OCP\Activity\Exceptions\InvalidValueException`` in a future version.
- ``OCP\Activity\IManager::publish()`` throws ``OCP\Activity\Exceptions\IncompleteActivityException`` instead of ``\InvalidArgumentException`` when a required field is not set before publishing.
- ``OCP\Activity\IProvider::parse()`` should no longer throw ``\InvalidArgumentException``. ``OCP\Activity\Exceptions\UnknownNotificationException`` should be thrown when the provider does not want to handle the event. ``\InvalidArgumentException`` are logged as debug for now and will be logged as error in the future to help developers find issues from code that unintentionally threw ``\InvalidArgumentException``
- ``OCP\Dashboard\IIconWidget::getIconUrl()`` clarification: The URL must be an absolute URL. The served icon should be dark. The icon will be inverted automatically in mobile clients and when using dark mode.
- ``OCP\Dashboard\IWidget::getId()`` clarification: Implementations should only return ``a-z``, ``0-9``, ``-`` and ``_`` based strings starting with a letter, as the identifier is used in CSS classes and that is otherwise invalid
- ``OCP\Dashboard\IWidget::getIconClass()`` clarification: The returned CSS class should render a dark icon. The icon will be inverted automatically in mobile clients and when using dark mode. Therefore, it is NOT recommended to use a css class that sets the background with ``var(--icon-…)``` as those will adapt to dark/bright mode in the web and still be inverted resulting in a dark icon on dark background.
- ``OCP\Files\Lock\ILockManager::registerLazyLockProvider()`` was added to replace ``registerLockProvider`` and allows to register a lock provider that is only loaded when needed.
- ``OCP\Notification\IAction::set*()`` (all setters) throw ``OCP\Notification\InvalidValueException`` instead of ``\InvalidArgumentException`` when the value does not match the required criteria.
- Calling ``OCP\Notification\IAction::setLink()`` with a relative URL is deprecated and will throw ``OCP\Notification\InvalidValueException`` in a future version.
- ``OCP\Notification\IApp::notify()`` throws ``OCP\Notification\IncompleteNotificationException`` instead of ``\InvalidArgumentException`` when a required field is not set before notifying.
- ``OCP\Notification\IManager::prepare()`` throws ``OCP\Notification\IncompleteParsedNotificationException`` instead of ``\InvalidArgumentException`` when a required field is not set after preparing a notification.
- ``OCP\Notification\INotification::set*()`` (all setters) throw ``OCP\Notification\InvalidValueException`` instead of ``\InvalidArgumentException`` when the value does not match the required criteria.
- Calling ``OCP\Notification\INotification::setLink()`` with a relative URL is deprecated and will throw ``OCP\Notification\InvalidValueException`` in a future version.
- Calling ``OCP\Notification\INotification::setIcon()`` with a relative URL is deprecated and will throw ``OCP\Notification\InvalidValueException`` in a future version.
- ``OCP\Notification\INotifier::prepare()`` should no longer throw ``\InvalidArgumentException``. ``OCP\Notification\UnknownNotificationException`` should be thrown when the notifier does not want to handle the notification. ``\InvalidArgumentException`` are logged as debug for now and will be logged as error in the future to help developers find issues from code that unintentionally threw ``\InvalidArgumentException``
- ``OCP\IGroupManager::isAdmin()`` should be used instead of checking is current user is part of admin group manually.
- ``IAttributes`` ``enabled`` key have bee renamed to ``value`` and supports more than boolean.
- ``OCP\DB\Exception`` uses the reason code ``REASON_LOCK_WAIT_TIMEOUT`` now, instead of ``REASON_SERVER`` for a LockWaitTimeoutException.
- ``OCP\Share\IShare::setNoExpirationDate()`` now sets an overwrite flag for falsy expiry date values, this flag is used to determine whether the system should overwrite falsy expiry date values before creating a share.
- ``OCP\Share\IShare::getNoExpirationDate()`` retrieves the value of the ``noExpirationDate`` flag.

Deprecated APIs
^^^^^^^^^^^^^^^

- Using the ``@PasswordConfirmationRequired`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\PasswordConfirmationRequired]`` attribute should be used instead.
- Using the ``@CORS`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\CORS]`` attribute should be used instead.
- Using the ``@PublicPage`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\PublicPage]`` attribute should be used instead.
- Using the ``@ExAppRequired`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\ExAppRequired]`` attribute should be used instead.
- Using the ``@AuthorizedAdminSetting`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting]`` attribute should be used instead.
- Using the ``@SubAdminRequired`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\SubAdminRequired]`` attribute should be used instead.
- Using the ``@NoAdminRequired`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\NoAdminRequired]`` attribute should be used instead.
- Using the ``@StrictCookieRequired`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\StrictCookiesRequired]`` attribute should be used instead.
- Using the ``@NoCSRFRequired`` annotation is deprecated and the ``#[OCP\AppFramework\Http\Attribute\NoCSRFRequired]`` attribute should be used instead.
- Using the ``OCP\Group\Backend\ICreateGroupBackend`` interface is now deprecated and the ``OCP\Group\Backend\ICreateNamedGroupBackend`` interface should be used instead.
- Calling ``OCP\DB\QueryBuilder\IExpressionBuilder::andX()`` without arguments is deprecated and will throw an exception in a future version as the underlying library is removing the functionality.
- Calling ``OCP\DB\QueryBuilder\IExpressionBuilder::orX()`` without arguments is deprecated and will throw an exception in a future version as the underlying library is removing the functionality.
- Calling ``OCP\DB\QueryBuilder\IQueryBuilder::delete()`` with ``$alias`` is deprecated and will throw an exception in a future version as the underlying library is removing the functionality.
- Calling ``OCP\DB\QueryBuilder\IQueryBuilder::getQueryPart()`` is deprecated and will throw an exception in a future version as the underlying library is removing the functionality.
- Calling ``OCP\DB\QueryBuilder\IQueryBuilder::getQueryParts()`` is deprecated and will throw an exception in a future version as the underlying library is removing the functionality.
- Calling ``OCP\DB\QueryBuilder\IQueryBuilder::getState()`` is deprecated and will throw an exception in a future version as the underlying library is removing the functionality.
- Calling ``OCP\DB\QueryBuilder\IQueryBuilder::resetQueryPart()`` is deprecated and will throw an exception in a future version as the underlying library is removing the functionality. Create a new query builder object instead.
- Calling ``OCP\DB\QueryBuilder\IQueryBuilder::resetQueryParts()`` is deprecated and will throw an exception in a future version as the underlying library is removing the functionality. Create a new query builder object instead.
- Calling ``OCP\DB\QueryBuilder\IQueryBuilder::update()`` with ``$alias`` is deprecated and will throw an exception in a future version as the underlying library is removing the functionality.
- Calling ``OCP\IDBConnection::getDatabasePlatform()`` is deprecated and will throw an exception in a future version as the underlying library is renaming and removing platforms which breaks the backwards-compatibility. Use ``getDatabaseProvider()`` instead.
- Calling ``OCP\Files\Lock\ILockManager::registerLockProvider()`` is deprecated and will be removed in the future. Use ``registerLazyLockProvider()`` instead.
- Using ``OCP\Translation`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\Translation\CouldNotTranslateException`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\Translation\IDetectLanguageProvider`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\Translation\ITranslationManager`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\Translation\ITranslationProvider`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\Translation\ITranslationProviderWithId`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\Translation\ITranslationProviderWithUserId`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\Translation\LanguageTuple`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`).
- Using ``OCP\SpeechToText`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\SpeechToText\Events\AbstractTranscriptionEvent`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\SpeechToText\Events\TranscriptionFailedEvent`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\SpeechToText\Events\TranscriptionSuccessfulEvent`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\SpeechToText\ISpeechToTextManager`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\SpeechToText\ISpeechToTextProvider`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\SpeechToText\ISpeechToTextProviderWithId`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\SpeechToText\ISpeechToTextProviderWithUserId`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``SpeechToText`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\Task`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\IProviderWithUserId`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\IProvider`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\IManager`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\Exception\TextToImageException`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\Exception\TaskNotFoundException`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\Exception\TaskFailureException`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\Events\TaskSuccessfulEvent`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\Events\TaskFailedEvent`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextToImage\Events\AbstractTextToImageEvent`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextToImage`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\Events\AbstractTextProcessingEvent`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\Events\TaskFailedEvent`` is deprecated and will be removed in the future.Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\Events\TaskSuccessfulEvent`` is deprecated and will be removed in the future.Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\Exception\TaskFailureException`` is deprecated and will be removed in the future.Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\FreePromptTaskType`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\HeadlineTaskType`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\IManager`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\IProvider`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\IProviderWithExpectedRuntime`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\IProviderWithId`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\IProviderWithUserId`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\ITaskType`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\SummaryTaskType`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\Task`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.
- Using ``OCP\TextProcessing\TopicsTaskType`` is deprecated and will be removed in the future. Use ``OCP\TaskProcessing`` instead (see :ref:`Task Processing<task_processing>`). Existing ``TextProcessing`` providers will continue to work with the TaskProcessing API until then.

Removed APIs
^^^^^^^^^^^^

- ``OCP\Util::isValidFileName`` was deprecated in 8.1.0 and is now removed, use either ``OCP\Files\Storage\IStorage::verifyPath`` or the new ``OCP\Files\IFilenameValidator``.
- ``OCP\Util::getForbiddenFileNameChars`` was removed, use either ``OCP\Files\Storage\IStorage::verifyPath`` or the new ``OCP\Files\IFilenameValidator`` for filename validation.
