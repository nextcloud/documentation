========
Settings
========

.. sectionauthor:: Carl Schwan <carl@carlschwan.eu>

Each Nextcloud applications can provide both personal and admin settings. For this
you will need to create a section implementing `IIconSection`. This section will be
used in the setting sidebar to create a new entry.

In our case we will create an admin section class in **<myapp>/lib/Sections/NotesAdmin.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Sections;

    use OCP\IL10N;
    use OCP\IURLGenerator;
    use OCP\Settings\IIconSection;

    class NotesAdmin extends IIconSection {

        /** @var IL10N */
        private $l;
 
        /** @var IURLGenerator */
        private $urlGenerator;

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


The next steps is to fill the new admin section with am admin setting. For that, we create a new class
in *<myapp>/lib/Settings/NotesAdmin.php**.

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Settings;

    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\IConfig;
    use OCP\IL10N;
    use OCP\Settings\ISettings;

    class NotesAdmin extends ISettings {

        /** @var IL10N */
        private $l;
 
        /** @var IURLGenerator */
        private $urlGenerator;

        /** @var IConfig */
        private $config;

        /** @var IL10N $l*/
        private $l;

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

Additionally since Nextcloud 23, groups can be granted authorization to access individual
admin settings (`see admin docs <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/admin_delegation_configuration>`_).
This is a feature that needs to be enabled for each admin setting class.
To do so, the setting class needs to implement `IDelegatedSettings` instead of `ISettings`
and implement two additional methods.

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Settings;

    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\IConfig;
    use OCP\IL10N;
    use OCP\Settings\IDelegatedSettings;

    class NotesAdmin extends IDelegatedSettings {

        ...

        public function getName(): ?string {
            // This can also return an empty string in case there is only one setting
            // in the section.
            return $this->l->t('Notes Admin Settings');
        }

        public function getAuthorizedAppConfig(): array {
            return [
                // Allow list of regex that the user can modify with this setting.
                'notes' => ['/notes_.*/', '/my_notes_setting/'],
            ];
        }
    }

Additionally, if your setting class needs to fetch data or send data to some admin-only
controllers, you will need to mark the methods in the controller as accessible by the
setting with annotations.

.. code-block:: php

    <?php
    class NotesSettingsController extends Controller {
        /**
         * Save settings
         * @PasswordConfirmationRequired
         * @AuthorizedAdminSetting(settings=OCA\NotesTutorial\Settings\NotesAdmin)
         */
         public function saveSettings($mySetting) {
             ....
         }
         ...
    }

