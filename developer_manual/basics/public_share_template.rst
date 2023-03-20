=====================
Public share template
=====================

.. sectionauthor:: Louis Chmn <louis@chmn.me>

It is possible to override the default public share view. This is possible by implementing the ``IPublicShareTemplateProvider`` interface.

.. code-block:: php

    <?php
    // lib/AppInfo/Application.php
    namespace OCA\MyApp;

    class Application extends App implements IBootstrap {
        ...

        public function register(IRegistrationContext $context): void {
            ...

            $context->registerPublicShareTemplateProvider(MyPublicShareTemplateProvider::class);
        }
    }

.. code-block:: php

    <?php
    // lib/providers/MyPublicShareTemplateProvider.php
    namespace OCA\MyApp;

    use OCA\MyApp\AppInfo\Application;
    use OCP\AppFramework\Http\ContentSecurityPolicy;
    use OCP\AppFramework\Http\Template\PublicTemplateResponse;
    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\Defaults;
    use OCP\IL10N;
    use OCP\IURLGenerator;
    use OCP\IUserManager;
    use OCP\Share\IShare;
    use OCP\Share\IPublicShareTemplateProvider;
    use OCP\AppFramework\Services\IInitialState;
    use OCP\Util;

    class E2EEPublicShareTemplateProvider implements IPublicShareTemplateProvider {
        public function __construct(
            private IUserManager $userManager,
            private IUrlGenerator $urlGenerator,
            private IL10N $l10n,
            private Defaults $defaults,
            private IInitialState $initialState,
        ) {
        }

        public function shouldRespond(IShare $share): bool {
            $node = $share->getNode();
            return ...; // Whether your provider should be used or not.
        }

        public function renderPage(IShare $share, string $token, string $path): TemplateResponse {
            $shareNode = $share->getNode();
            $owner = $this->userManager->get($share->getShareOwner());

            $this->initialState->provideInitialState('fileId', $shareNode->getId());
            ...; // More initial state that you might need in your view.

            // OpenGraph Support: http://ogp.me/
            Util::addHeader('meta', ['property' => "og:title", 'content' => $this->l10n->t("Encrypted share")]);
            Util::addHeader('meta', ['property' => "og:description", 'content' => $this->defaults->getName() . ($this->defaults->getSlogan() !== '' ? ' - ' . $this->defaults->getSlogan() : '')]);
            Util::addHeader('meta', ['property' => "og:site_name", 'content' => $this->defaults->getName()]);
            Util::addHeader('meta', ['property' => "og:url", 'content' => $this->urlGenerator->linkToRouteAbsolute('files_sharing.sharecontroller.showShare', ['token' => $token])]);
            Util::addHeader('meta', ['property' => "og:type", 'content' => "object"]);

            $csp->addAllowedFrameDomain('\'self\'');
            $response->setContentSecurityPolicy($csp);

            $response = new PublicTemplateResponse(Application::APP_ID, 'myCustomTemplateFileName', []);
            $response->setHeaderTitle($this->l10n->t("My custom title"));

            $csp = new ContentSecurityPolicy();

            return $response;
        }
    }
