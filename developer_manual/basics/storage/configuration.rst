=============
Configuration
=============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Nextcloud provides three configuration scopes: system-wide values (``config.php``),
per-app values, and per-user values. Each scope has a dedicated API.


System values
-------------

System values are saved in :file:`config/config.php`. Inject ``\OCP\IConfig``
and read them with the typed getters ``getSystemValueBool()``,
``getSystemValueInt()`` and ``getSystemValueString()``:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\IConfig;

    class LoginService {
        public function __construct(
            private IConfig $config,
        ) {}

        public function isLoginFormHidden(): bool {
            return $this->config->getSystemValueBool('hide_login_form', false);
        }
    }

System values are usually set by administrators. If your app must write one,
use ``setSystemValue()``, which throws ``OCP\HintException`` when the config
file is read-only.

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
Its methods are scoped to your app, so they take no app ID.

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

For typed values, lazy loading, sensitive values and key management, see
:doc:`/digging_deeper/config/appconfig`.


User settings
-------------

.. versionchanged:: 31

   Use ``\OCP\Config\IUserConfig`` instead of ``IConfig::getUserValue()`` /
   ``IConfig::setUserValue()``, which are deprecated.

User settings are stored in the database per user and app and are suitable for
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

For typed values, lazy loading, sensitive and indexed values and key management,
see :doc:`/digging_deeper/config/userconfig`.


Declaring your config keys
--------------------------

.. versionadded:: 32

Declare the app values and user settings of your app in a Lexicon: one place
that defines each key, its type, its default value and whether it is lazy or
sensitive. The typed getters and setters then check every access against it.
See :doc:`/digging_deeper/config/lexicon`.
