========
Settings
========

.. sectionauthor:: Carl Schwan <carl@carlschwan.eu>

Creating an admin section
-------------------------

Each Nextcloud application can provide both personal and admin settings. For this
you will need to create a section implementing `IIconSection`. This section will be
used in the setting sidebar to create a new entry.

In our case we will create an admin section class in **<myapp>/lib/Sections/NotesAdmin.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Sections;

    use OCP\IL10N;
    use OCP\IURLGenerator;
    use OCP\Settings\IIconSection;

    class NotesAdmin implements IIconSection {
        private IL10N $l;
        private IURLGenerator $urlGenerator;

        public function __construct(IL10N $l, IURLGenerator $urlGenerator) {
            $this->l = $l;
            $this->urlGenerator = $urlGenerator;
        }

        public function getIcon(): string {
            return $this->urlGenerator->imagePath('core', 'actions/settings-dark.svg');
        }

        public function getID(): string {
            return 'notes';
        }

        public function getName(): string {
            return $this->l->t('Notes tutorial');
        }

        public function getPriority(): int {
            return 98;
        }
    }

The next step is to fill the new admin section with an admin setting. For that,
we create a new class in ``<myapp>/lib/Settings/NotesAdmin.php``.

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Settings;

    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\IConfig;
    use OCP\IL10N;
    use OCP\Settings\ISettings;

    class NotesAdmin implements ISettings {
        private IL10N $l;
        private IConfig $config;

        public function __construct(IConfig $config, IL10N $l) {
            $this->config = $config;
            $this->l = $l;
        }

        /**
         * @return TemplateResponse
         */
        public function getForm() {
            $parameters = [
                'mySetting' => $this->config->getSystemValue('my_notes_setting', true),
            ];

            return new TemplateResponse('settings', 'settings/admin', $parameters, '');
        }

        public function getSection() {
            return 'notes'; // Name of the previously created section.
        }

        /**
         * @return int whether the form should be rather on the top or bottom of
         * the admin section. The forms are arranged in ascending order of the
         * priority values. It is required to return a value between 0 and 100.
         *
         * E.g.: 70
         */
        public function getPriority() {
            return 10;
        }
    }

The last missing part is to register both classes inside **<myapp>/appinfo/info.xml**.

.. code-block:: xml

    <settings>
        <admin>OCA\NotesTutorial\Settings\NotesAdmin</admin>
        <admin-section>OCA\NotesTutorial\Sections\NotesAdmin</admin-section>
    </settings>

.. note::

   To register personal sections and settings class use `<personal-section>` and
   `<personal>` instead.

Delegated administration
------------------------

.. versionadded:: 23

Nextcloud has built-in functionality which permits `administrators to delegate authority
<https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/admin_delegation_configuration.html>`_
to others without granting them full administration privileges (and without making them a
member of the ``admin`` group).

Specific groups can be granted authorization to access individual admin settings. This is a
feature that needs to be enabled for each admin setting class. To do so, the setting class
needs to implement ``IDelegatedSettings`` instead of ``ISettings`` and implement two additional
methods.

Authorizing app-config keys
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The values returned by ``getAuthorizedAppConfig()`` define which app-config keys delegated
administrators may modify. Use exact key names whenever possible. Regular expressions are
supported for dynamic key names, but should match the complete key using ``^`` and ``$``.
Avoid unanchored expressions such as ``/notes_.*/``, which can match a key that merely
contains the intended prefix.

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Settings;

    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\IConfig;
    use OCP\IL10N;
    use OCP\Settings\IDelegatedSettings;

    class NotesAdmin implements IDelegatedSettings {

        ...

        public function getName(): ?string {
            // This can also return an empty string in case there is only one setting
            // in the section.
            return $this->l->t('Notes Admin Settings');
        }

        public function getAuthorizedAppConfig(): array {
            return [
                // Simplest: authorize one exact key from this app.
                'notes' => [
                    'my_notes_setting',
                ],
            ];
        }
    }

Using the application ID
~~~~~~~~~~~~~~~~~~~~~~~~

The app name can be referenced through ``Application::APP_ID``. This avoids duplicating
the app ID as a string:

.. code-block:: php

    use OCA\NotesTutorial\AppInfo\Application;

    public function getAuthorizedAppConfig(): array {
        return [
            // Multiple keys: authorize several exact keys in this app.
            Application::APP_ID => [
                'my_notes_setting',
                'another_notes_setting',
            ],
        ];
    }

Authorizing dynamic key names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For a family of dynamically named keys, use an anchored regular expression that is as
restrictive as possible:

.. code-block:: php

    public function getAuthorizedAppConfig(): array {
        return [
            // Authorize keys such as "notes_feature_a" and "notes_feature_b",
            // but not "custom_notes_feature_a".
            Application::APP_ID => [
                '/^notes_[a-z0-9_]+$/',
            ],
        ];
    }

Escaping dynamic regular expressions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When a regular expression is built from a variable or a constant, escape the inserted
value with ``preg_quote()``:

.. code-block:: php

    $prefix = preg_quote('notes_', '/');

    return [
        Application::APP_ID => [
            "/^{$prefix}[a-z0-9_]+$/",
        ],
    ];

Using configuration constants
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For stable, declared configuration keys, prefer dedicated constants or constants from an
app's ``ConfigLexicon`` class. This keeps the delegated authorization list synchronized
with the app's configuration definitions. 

For example, ``<myapp>/lib/ConfigLexicon.php`` might contain:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial;

    class ConfigLexicon {
         // For PHP versions before 8.3, omit the "string" type.
        public const string MY_SETTING = 'my_notes_setting';
        public const string ANOTHER_SETTING = 'another_notes_setting';
    }

Which can then reference:

.. code-block:: php

    use OCA\NotesTutorial\AppInfo\Application;
    use OCA\NotesTutorial\ConfigLexicon;

    public function getAuthorizedAppConfig(): array {
        return [
            // Constants: Preferred for stable, declared configuration keys.
            Application::APP_ID => [
                ConfigLexicon::MY_SETTING,
                ConfigLexicon::ANOTHER_SETTING,
            ],
        ];
    }

Authorizing keys from multiple apps
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If a setting intentionally authorizes configuration keys from more than one app, return
one entry for each app. Prefer the corresponding app's ``Application::APP_ID`` constant
when it is available:

.. code-block:: php

    use OCA\AnotherApp\AppInfo\Application as AnotherAppApplication;

    public function getAuthorizedAppConfig(): array {
        return [
            Application::APP_ID => [
                ConfigLexicon::MY_SETTING,
            ],
            AnotherAppApplication::APP_ID => [
                // Prefer AnotherApp's ConfigLexicon constant when available.
                'another_setting',
            ],
        ];
    }

Do not use ``/.*/`` unless the setting intentionally grants delegated administrators
access to every key belonging to the app. Do not use a regular expression for a fixed key:
return the literal key instead.

Authorizing admin-only controllers
----------------------------------

The ``getAuthorizedAppConfig()`` method controls app-config writes. It does not grant
access to arbitrary controller endpoints. If your setting class needs to call admin-only
controller methods, mark those methods with the ``AuthorizedAdminSetting`` attribute.

.. code-block:: php
    :emphasize-lines: 8

    <?php
    use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
    class NotesSettingsController extends Controller {
        /**
         * Save settings
         */
        #[PasswordConfirmationRequired]
        #[AuthorizedAdminSetting(settings: 'OCA\NotesTutorial\Settings\NotesAdmin')]
        public function saveSettings($mySetting) {
            ....
        }
        ...
    }

.. note::

    The attribute is only available in Nextcloud 27 or later. In older versions, the
    ``@AuthorizedAdminSetting(settings=OCA\NotesTutorial\Settings\NotesAdmin)`` annotation
    must be used instead.

Authorizing multiple delegated settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you have several ``IDelegatedSettings`` classes that are needed for a function, add multiple
attributes:

.. code-block:: php
    :emphasize-lines: 8-9

    <?php
    use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
    class NotesSettingsController extends Controller {
        /**
         * Save settings
         */
        #[PasswordConfirmationRequired]
        #[AuthorizedAdminSetting(settings: 'OCA\NotesTutorial\Settings\NotesAdmin')]
        #[AuthorizedAdminSetting(settings: 'OCA\NotesTutorial\Settings\NotesSubAdmin')]
         public function saveSettings($mySetting) {
             ....
         }
         ...
    }

.. note::

    If you must use the deprecated annotation, specify the classes separated by semicolons:

    ``@AuthorizedAdminSetting(settings=OCA\NotesTutorial\Settings\NotesAdmin;OCA\NotesTutorial\Settings\NotesSubAdmin)``
