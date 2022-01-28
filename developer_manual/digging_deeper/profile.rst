=======
Profile
=======

The user profile presents the information of a user including their full name,
profile picture, organisation, role, location, biography, headline, as well as
actionable information that we call profile actions. These actions can include
starting a `Nextcloud Talk <https://nextcloud.com/talk/>`_ chat with the user,
sending an email, visiting their website, opening their Twitter profile,
calling their phone number, scheduling an appointment, and more.

App developers can integrate into profile and provide their own actions.

Register a profile action
-------------------------

A profile action is represented by a class implementing the ``OCP\\Profile\\ILinkAction``
interface. This class is instantiated whenever the user profile is loaded.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Profile;

    use OCP\Accounts\IAccountManager;
    use OCP\IURLGenerator;
    use OCP\IUser;
    use OCP\IL10N;
    use OCP\Profile\ILinkAction;

    class MyProfileAction implements ILinkAction {

        /** @var string */
        private $targetUser;

        /** @var IAccountManager */
        private $accountManager;

        /** @var IL10N */
        private $l10n;

        /** @var IUrlGenerator */
        private $urlGenerator;

        public function __construct(
            IAccountManager $accountManager,
            IL10N $l10n,
            IURLGenerator $urlGenerator
        ) {
            $this->accountManager = $accountManager;
            $this->l10n = $l10n;
            $this->urlGenerator = $urlGenerator;
        }

        /**
         * Preload the user specific value required by the action
         *
         * e.g. the email is loaded for the email action and the userId for the Talk action
         *
         * @since 23.0.0
         */
        public function preload(IUser $targetUser): void {
            $this->targetUser = $targetUser;
        }

        /**
         * Returns the app ID of the action
         *
         * e.g. 'spreed'
         *
         * @since 23.0.0
         */
        public function getAppId(): string {
            return 'my_app_id';
        }

        /**
         * Returns the unique ID of the action
         *
         * *For account properties this is the constant defined in lib/public/Accounts/IAccountManager.php*
         *
         * e.g. 'email'
         *
         * @since 23.0.0
         */
        public function getId(): string {
            return 'my_unique_action';
        }

        /**
         * Returns the translated unique display ID of the action
         *
         * Should be something short and descriptive of the action
         * as this is seen by the end-user when configuring actions
         *
         * e.g. 'Email'
         *
         * @since 23.0.0
         */
        public function getDisplayId(): string {
            return $this->l10n->t('My unique action');
        }

        /**
         * Returns the translated title
         *
         * e.g. 'Mail user@domain.com'
         *
         * Use the L10N service to translate it
         *
         * @since 23.0.0
         */
        public function getTitle(): string {
            return $this->l10n->t('Ping %s', [$this->targetUser->getDisplayName()]);
        }

        /**
         * Returns the priority
         *
         * *Actions are sorted in ascending order*
         *
         * e.g. 60
         *
         * @since 23.0.0
         */
        public function getPriority(): int {
            return 60;
        }

        /**
         * Returns the URL link to the 16*16 SVG icon
         *
         * @since 23.0.0
         */
        public function getIcon(): string {
            return $this->urlGenerator->getAbsoluteURL($this->urlGenerator->imagePath('my_app_id', 'actions/my_unique_action.svg'));
        }

        /**
         * Returns the target of the action,
         * if null is returned the action won't be registered
         *
         * e.g. 'mailto:user@domain.com'
         *
         * @since 23.0.0
         */
        public function getTarget(): ?string {
            return $this->urlGenerator->linkToRouteAbsolute('my_app_id.Page.index') . '?pingUser=' . $this->targetUser->getUID();
        }
    }

The ``MyProfileAction`` class needs to be registered during the :ref:`app bootstrap<Bootstrapping>`.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;
    use OCA\MyApp\Profile\MyProfileAction;

    class Application extends App implements IBootstrap {

        public const APP_ID = 'my_app_id';

        public function __construct(array $urlParams = []) {
            parent::__construct(self::APP_ID, $urlParams);
        }

        public function register(IRegistrationContext $context): void {
            $context->registerProfileLinkAction(MyProfileAction::class);
        }

        public function boot(IBootContext $context): void {
        }
    }
