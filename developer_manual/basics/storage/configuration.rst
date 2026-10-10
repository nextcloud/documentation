=============
Configuration
=============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Nextcloud provides three configuration scopes: system-wide values (``config.php``),
per-app values, and per-user values. Each scope has a dedicated API.


System values
-------------

System values are saved in :file:`config/config.php`. Inject ``\OCP\IConfig``
and use the ``getSystemValue*`` / ``setSystemValue`` methods.

Note that ``setSystemValue`` may throw ``OCP\HintException`` when the config file is read-only.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\HintException;
    use OCP\IConfig;

    class AuthorService {
        public function __construct(
            private IConfig $config,
        ) {}

        public function getSystemValue(string $key): mixed {
            return $this->config->getSystemValue($key);
        }

        public function setSystemValue(string $key, mixed $value): void {
            try {
                $this->config->setSystemValue($key, $value);
            } catch (HintException $e) {
                // Handle exception, e.g. when config file is read-only
            }
        }
    }

.. note::

   Use ``getSystemValueBool()``, ``getSystemValueString()``, and ``getSystemValueInt()``
   for typed return values.

Naming conventions
~~~~~~~~~~~~~~~~~~

For consistency there are conventions for config keys:

* System config keys should only contain lower case letters, numbers and ``_``. This ensures that they can be used as environment variables.
* Keys can be scoped to subsystems like ``<subsystem>_<key>``. This makes it easier to group related configuration.

Here are some examples:

1. ``files_external_allow_create_new_local``
2. ``filesystem_cache_readonly``
3. ``log_rotate_size``
4. ``mail_smtpname``
5. ``session_lifetime``


App values
----------

.. versionchanged:: 29

   Use ``\OCP\AppFramework\Services\IAppConfig`` (app-scoped) or ``\OCP\IAppConfig``
   (global) instead of ``IConfig::getAppValue()`` / ``IConfig::setAppValue()``,
   which are deprecated.

App values are stored in the database and are useful for global app settings.

Inside an AppFramework app, inject ``\OCP\AppFramework\Services\IAppConfig``.
Methods are automatically scoped to your app — no app ID argument needed.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\AppFramework\Services\IAppConfig;

    class AuthorService {
        public function __construct(
            private IAppConfig $appConfig,
        ) {}

        public function getRetryCount(): int {
            return $this->appConfig->getAppValueInt('retry_count', 3);
        }

        public function setRetryCount(int $count): void {
            $this->appConfig->setAppValueInt('retry_count', $count);
        }
    }

Use ``\OCP\IAppConfig`` when you need to read or write configuration for an
arbitrary app ID (e.g. from a different app's config).

For a full reference — typed values, lazy loading, sensitive values, key management —
see :doc:`/digging_deeper/config/appconfig`.


User values
-----------

.. versionchanged:: 31

   Use ``\OCP\Config\IUserConfig`` instead of ``IConfig::getUserValue()`` /
   ``IConfig::setUserValue()``, which are deprecated.

User values are stored in the database per user and app and are suitable for
per-user app settings.

Inject ``\OCP\Config\IUserConfig`` and use the typed getter/setter methods:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\Config\IUserConfig;

    class AuthorService {
        public function __construct(
            private IUserConfig $userConfig,
        ) {}

        public function getUserTheme(string $userId): string {
            return $this->userConfig->getValueString($userId, 'myapp', 'theme', 'default');
        }

        public function setUserTheme(string $userId, string $theme): void {
            $this->userConfig->setValueString($userId, 'myapp', 'theme', $theme);
        }
    }

For a full reference — typed values, lazy loading, sensitive and indexed values,
key management — see :doc:`/digging_deeper/config/userconfig`.
