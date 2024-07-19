=======================
Upgrade to Nextcloud 30
=======================

General
-------

Capabilities
------------

``files``
^^^^^^^^^

- ``blacklist_files_regex`` is deprecated now use ``forbidden_filenames`` instead
- ``forbidden_filename_characters`` was added to provide a list of characters not allowed within filenames
- ``forbidden_filename_extensions`` was added to provide a list of extensions (suffixes) not allwed for filenames

Front-end changes
-----------------

Font sizes
^^^^^^^^^^

Nextcloud now provides meaningful default styles for heading elements.
This can cause visual regressions if your code does not explicitly set font size and weight.
If you need to use heading elements outside of text content, you might need to adjust their styles.

Added APIs
^^^^^^^^^^

Changed APIs
^^^^^^^^^^^^

Removed APIs
^^^^^^^^^^^^

Removed globals
^^^^^^^^^^^^^^^

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

Removed APIs
^^^^^^^^^^^^

- ``OCP\Util::isValidFileName`` was deprecated in 8.1.0 and is now removed, use either ``OCP\Files\Storage\IStorage::verifyPath`` or the new ``OCP\Files\IFilenameValidator``.
- ``OCP\Util::getForbiddenFileNameChars`` was removed, use either ``OCP\Files\Storage\IStorage::verifyPath`` or the new ``OCP\Files\IFilenameValidator`` for filename validation.

Removed events
^^^^^^^^^^^^^^
