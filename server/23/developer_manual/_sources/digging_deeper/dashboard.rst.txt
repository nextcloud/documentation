=========
Dashboard
=========

The dashboard app aims to provide the user with a general overview of their
Nextcloud and shows information that is currently important.

App developers can integrate into the dashboard app and provide their own widgets.


Register a dashboard widget
---------------------------

A dashboard widget is represented by a class implementing the `OCP\\Dashboard\\IWidget`
interface. This class will be instantiated whenever the dashboard is loaded.
Any bootstrap code that is needed for the widget can be implemented inside
of the `load` method and will be called when the dashboard is loaded.

.. code-block:: php

    <?php

    namespace OCA\MyApp\Dashboard;

    use OCP\Dashboard\IWidget;
    use OCP\IInitialStateService;
    use OCP\IL10N;
    use OCP\IURLGenerator;
    use OCP\IUserSession;

    class MyAppWidget implements IWidget {

        public function __construct(
            IInitialStateService $initialStateService,
            IL10N $l10n,
            IURLGenerator $urlGenerator
        ) {
            $this->initialStateService = $initialStateService;
            $this->l10n = $l10n;
            $this->urlGenerator = $urlGenerator;
        }

        /**
         * @return string Unique id that identifies the widget, e.g. the app id
         * @since 20.0.0
         */
        public function getId(): string {
            return 'myappwidgetid';
        }

        /**
         * @return string User facing title of the widget
         * @since 20.0.0
         */
        public function getTitle(): string {
            return $this->l10n->t('My app');
        }

        /**
         * @return int Initial order for widget sorting
         *   in the range of 10-100, 0-9 are reserved for shipped apps
         * @since 20.0.0
         */
        public function getOrder(): int {
            return 0;
        }

        /**
         * @return string css class that displays an icon next to the widget title
         * @since 20.0.0
         */
        public function getIconClass(): string {
            return 'icon-class';
        }

        /**
         * @return string|null The absolute url to the apps own view
         * @since 20.0.0
         */
        public function getUrl(): ?string {
            return $this->urlGenerator->linkToRouteAbsolute('myapp.view.index');
        }

        /**
         * Execute widget bootstrap code like loading scripts and providing initial state
         */
        public function load(): void {
            $this->initialStateService->provideInitialState('myapp', 'myData', []);
            \OCP\Util::addScript('myapp', 'dashboard');
        }
    }


The `MyAppWidget` class needs to be registered during the :ref:`app bootstrap<Bootstrapping>`.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;
    use OCA\MyApp\Dashboard\MyAppWidget;

    class Application extends App implements IBootstrap {

        public const APP_ID = 'myapp';

        public function __construct(array $urlParams = []) {
            parent::__construct(self::APP_ID, $urlParams);
        }

        public function register(IRegistrationContext $context): void {
            $context->registerDashboardWidget(MyAppWidget::class);
        }

        public function boot(IBootContext $context): void {
        }
    }

For compatibility reasons the widget registration can also be performed by
listening to the `OCP\\Dashboard\\RegisterWidgetEvent` for apps that still
need to support older versions where the new app boostrap flow is not available,
however this method is deprecated and will be removed once Nextcloud 19 is EOL.

.. code-block:: php

    <?php

    use OCP\Dashboard\RegisterWidgetEvent;
    use OCP\EventDispatcher\IEventDispatcher;

    class Application extends App {
        public function __construct(array $urlParams = []) {
            parent::__construct(self::APP_ID, $urlParams);
            $container = $this->getContainer();

            /** @var IEventDispatcher $dispatcher */
            $dispatcher = $container->getServer()->query(IEventDispatcher::class);
            $dispatcher->addListener(RegisterWidgetEvent::class, function (RegisterWidgetEvent $event) use ($container) {
                    \OCP\Util::addScript('myapp', 'dashboard');
                    $event->registerWidget(MyAppWidget::class);
            });
        }
    }


Provide a user interface
------------------------

The user interface can be registered through the public `OCA.Dashboard.register`
JavaScript method. The first parameter represents the widget id that has already
been specified in the `IWidget` implementation. The callback parameter will be
called to render the widget in the frontend. The user interface can be added to
the provided DOM element `el`.

The following example shows how a Vue.js component could be used to render the
widget user interface, however this approach works for any other framework as well
as plain JavaScript:


.. code-block:: javascript

    import Dashboard from './components/Dashboard.vue'

    document.addEventListener('DOMContentLoaded', () => {
        OCA.Dashboard.register('myappwidgetid', (el) => {
            const View = Vue.extend(Dashboard)
            const vm = new View({
                propsData: {},
                store,
            }).$mount(el)
        })
    })


Dashboard API for clients
---------------------------------------

+++++++++++++++++
Implement the API
+++++++++++++++++

If you want your widget content to be accessible with the dashboard API for Nextcloud clients,
it must implement the `OCP\\Dashboard\\IAPIWidget` interface rather than `OCP\\Dashboard\\IWidget`.
This interface contains an extra `getItems` method which returns an array of `OCP\\Dashboard\Model\\WidgetItem` objects.

.. code-block:: php

    /**
    * @inheritDoc
    */
    public function getItems(string $userId, ?string $since = null, int $limit = 7): array {
        return $this->myService->getWidgetItems($userId, $since, $limit);
    }


`OCP\\Dashboard\Model\\WidgetItem` contains the item information. Its constructor is:

.. code-block:: php

    public function __construct(string $title = '',
                                string $subtitle = '',
                                string $link = '',
                                string $iconUrl = '',
                                string $sinceId = '');


* title: The main widget text content
* subtitle: The secondary text content
* link: A link to the target resource
* iconUrl: URL to a square icon (svg or jpg/png of at least 44x44px)
* sinceId: Item ID or timestamp. The client will then send the latest known sinceId in next dashboard API request.

+++++++++++
Use the API
+++++++++++

From the client point of view, the dashboard widget items can then be obtained with this kind of request:

.. code-block:: bash

    curl -u user:passwd http://my.nc/ocs/v2.php/apps/dashboard/api/v1/widget-items \
        -H Content-Type:application/json \
        -X GET \
        -d '{"sinceIds":{"myappwidgetid":"2021-03-22T15:01:10Z","my_other_appwidgetid":"333"}}'

If your client periodically gets widget items content with this API,
include the latest `sinceId` for each widget to avoid getting the items you already have.
