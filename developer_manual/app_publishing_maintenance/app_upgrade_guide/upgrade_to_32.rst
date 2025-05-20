=======================
Upgrade to Nextcloud 32
=======================

General
-------

- TBD

Front-end changes
-----------------

Added APIs
^^^^^^^^^^

- TBD

Changed APIs
^^^^^^^^^^^^

- TBD

Deprecated APIs
^^^^^^^^^^^^^^^

- TBD

Removed APIs
^^^^^^^^^^^^

- TBD

Back-end changes
----------------

Added APIs
^^^^^^^^^^

- New task processing task type ``OCP\TaskProcessing\TextToSpeech`` to convert text to speech.
- New interface ``\OCP\Share\IShareProviderSupportsAllSharesInFolder`` extending ``\OCP\Share\IShareProvider`` to add the method ``\OCP\Share\IShareProviderSupportsAllSharesInFolder::getAllSharesInFolder`` used for querying all shares in a folder without filtering by user.
- New method ``\OCP\IUser::canChangeEmail`` allowing to check if the user backend allows the user to change their email address.
- New method ``\OCP\Files\IFilenameValidator::sanitizeFilename`` allowing to sanitize a given filename to comply with configured constraints.
- New service ``\OCP\Template\ITemplateManager`` to access template related functions, and get instances of new interface  ``\OCP\Template\ITemplate`` instead of building manually ``\OCP\Template``.
- New event ``\OCP\Files\Config\Event\UserMountAddedEvent`` which is emitted when new mount is added to the ``oc_mounts`` table.
- New event ``\OCP\Files\Config\Event\UserMountRemovedEvent`` which is emitted when an existing mount is removed from the ``oc_mounts`` table.
- New event ``\OCP\Files\Config\Event\UserMountUpdatedEvent`` which is emitted when an existing mount is updated in the ``oc_mounts`` table.
- New attribute ``\OCP\AppFramework\Http\Attribute\RequestHeader`` used for documenting request headers for OpenAPI specifications generated using openapi-extractor.

Changed APIs
^^^^^^^^^^^^

- ``\OCP\Authentication\TwoFactorAuth\ILoginSetupProvider::getBody``, ``\OCP\Authentication\TwoFactorAuth\IPersonalProviderSettings::getBody`` and ``\OCP\Authentication\TwoFactorAuth\IProvider::getBody`` return type was broaden from ``\OCP\Template`` class to ``\OCP\Template\ITemplate`` interface. Should not change anything for applications.

Deprecated APIs
^^^^^^^^^^^^^^^

- The files API endpoint ``/apps/files/api/v1/thumbnail/`` for generating previews is deprecated.
  Instead use the preview endpoint provided by Nextcloud core (``/core/preview``).
- The legacy method ``\OC_Helper::canExecute`` is deprecated, please use the ``OCP\IBinaryFinder`` instead.
- ``\OC_Template`` and ``\OCP\Template`` classes are deprecated, please use the new ``\OCP\Template\ITemplateManager`` instead.
- ``\OC_User::useBackend`` is deprecated, please use ``\OCP\IUserManager::registerBackend`` available since 8.0.0
- ``\OC_User::clearBackends`` is deprecated, please use ``\OCP\IUserManager::clearBackends`` available since 8.0.0

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
