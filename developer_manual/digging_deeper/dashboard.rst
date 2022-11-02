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
        private IInitialStateService $initialStateService;
        private IL10N $l10n;
        private IURLGenerator $urlGenerator;

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
         */
        public function getId(): string {
            return 'myappwidgetid';
        }

        /**
         * @return string User facing title of the widget
         */
        public function getTitle(): string {
            return $this->l10n->t('My app');
        }

        /**
         * @return int Initial order for widget sorting
         *   in the range of 10-100, 0-9 are reserved for shipped apps
         */
        public function getOrder(): int {
            return 0;
        }

        /**
         * @return string css class that displays an icon next to the widget title
         */
        public function getIconClass(): string {
            return 'icon-class';
        }

        /**
         * @return string|null The absolute url to the apps own view
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
            $dispatcher = $container->getServer()->get(IEventDispatcher::class);
            $dispatcher->addListener(RegisterWidgetEvent::class, function (RegisterWidgetEvent $event) use ($container): void {
                    \OCP\Util::addScript('myapp', 'dashboard');
                    $event->registerWidget(MyAppWidget::class);
            });
        }
    }

++++++++++++++++++++++++++++++++
The IConditionalWidget interface
++++++++++++++++++++++++++++++++

The IConditionalWidget interface adds the **isEnabled** method to provide the option for a widget to opt-out later.
While registering the widget the information whether or not a widget should be displayed to the specific user might
not be available or to complex to calculate up front. In this case the IConditionalWidget allows you to check the
conditions only when really needed.

.. code-block:: php

	public function isEnabled(): bool {
		return false;
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

To provide more information about your widget through the dashboard API for clients, you can implement
those additional interfaces:

* IButtonWidget to add buttons to be rendered by the client in the widget
* IIconWidget to set the widget icon URL
* IOptionWidget to set additional options
* IAPIWidget to actually provide the widget content (the item list)

+++++++++++++++++++++++++++
The IButtonWidget interface
+++++++++++++++++++++++++++


The IButtonWidget interface adds the **getWidgetButtons** method to provide a list of buttons
to be displayed by the clients in the widget.
Those buttons let you define actions that can be triggered from the widget in the clients.

There are 3 types of buttons:

* WidgetButton::TYPE_NEW To let users create new elements in your app
* WidgetButton::TYPE_MORE To let users see more information
* WidgetButton::TYPE_SETUP If the widget requires some configuration

.. code-block:: php

	public function getWidgetButtons(string $userId): array {
		return [
			new WidgetButton(
				WidgetButton::TYPE_NEW,
				'https://somewhere.org',
				$this->l10n->t('Create new element')
			),
			new WidgetButton(
				WidgetButton::TYPE_MORE,
				'https://my.nextcloud.org/apps/your-app/',
				$this->l10n->t('More notifications')
			),
			new WidgetButton(
				WidgetButton::TYPE_SETUP,
				'https://my.nextcloud.org/apps/settings/user',
				$this->l10n->t('Configure')
			),
		];
	}

+++++++++++++++++++++++++++
The IIconWidget interface
+++++++++++++++++++++++++++

The IIconWidget interface adds the **getIconUrl** method to provide the URL to the widget icon. In the following example
it returns the URL to the img/app.svg file in your app.

.. code-block:: php

	public function getIconUrl(): string {
		return $this->urlGenerator->getAbsoluteURL(
			$this->urlGenerator->imagePath(Application::APP_ID, 'app.svg')
		);
	}

+++++++++++++++++++++++++++
The IOptionWidget interface
+++++++++++++++++++++++++++

The IOptionWidget interface adds the **getWidgetOptions** method to provide additional widget options. It returns
a WidgetOptions object which only contains the **roundItemIcons** boolean value for now. This tells the clients if
the widget item icons should be rounded or kept as squares.

.. code-block:: php

	public function getWidgetOptions(): WidgetOptions {
		return new WidgetOptions(true);
	}

+++++++++++++++++++++++++++
The IAPIWidget interface
+++++++++++++++++++++++++++

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

The list of enabled widgets can be requested like that:

.. code-block:: bash

    curl -u user:passwd https://my.nextcloud.org/ocs/v2.php/apps/dashboard/api/v1/widgets \
        -H "Accept: application/json" \
        -X GET

Example response:

.. code-block:: json

    {
      "ocs": {
        "meta": {
          "status": "ok",
          "statuscode": 200,
          "message": "OK"
        },
        "data": {
          "spreed": {
            "id": "spreed",
            "title": "Talk mentions",
            "order": 10,
            "icon_class": "dashboard-talk-icon",
            "icon_url": "https://my.nextcloud.org/apps/spreed/img/app-dark.svg",
            "widget_url": "https://my.nextcloud.org/index.php/apps/spreed/",
            "item_icons_round": true,
            "buttons": [
              {
                "type": "more",
                "text": "More unread mentions",
                "link": "https://my.nextcloud.org/index.php/apps/spreed/"
              }
            ]
          },
          "github_notifications": {
            "id": "github_notifications",
            "title": "GitHub notifications",
            "order": 10,
            "icon_class": "icon-github",
            "icon_url": "https://my.nextcloud.org/apps/integration_github/img/app-dark.svg",
            "widget_url": "https://my.nextcloud.org/index.php/settings/user/connected-accounts",
            "item_icons_round": true,
            "buttons": [
              {
                "type": "more",
                "text": "More notifications",
                "link": "https://github.com/notifications"
              }
            ]
          },
        }
      }
    }

The items list for each enabled widgets can be requested like that:

.. code-block:: bash

    curl -u user:passwd http://my.nc/ocs/v2.php/apps/dashboard/api/v1/widget-items \
        -H Content-Type:application/json \
        -X GET \
        -d '{"sinceIds":{"myappwidgetid":"2021-03-22T15:01:10Z","my_other_appwidgetid":"333"}}'

If your client periodically gets widget items content with this API,
include the latest `sinceId` for each widget to avoid getting the items you already have.

Example response:

.. code-block:: json

    {
      "ocs": {
        "meta": {
          "status": "ok",
          "statuscode": 200,
          "message": "OK"
        },
        "data": {
          "github_notifications": [
            {
              "subtitle": "nextcloud-docker-dev#87",
              "title": "Improve getting started",
              "link": "https://github.com/juliushaertl/nextcloud-docker-dev/pull/87",
              "iconUrl": "https://my.nextcloud.org/index.php/apps/integration_github/avatar/juliushaertl",
              "sinceId": "2022-10-13T12:34:19Z"
            },
            {
              "subtitle": "integration_github",
              "title": "v1.0.11",
              "link": "https://github.com/nextcloud/integration_github/releases",
              "iconUrl": "https://my.nextcloud.org/index.php/apps/integration_github/avatar/nextcloud",
              "sinceId": "2022-10-13T12:32:04Z"
            },
            {
              "subtitle": "text#3209",
              "title": "Rich workspaces: If there is no Readme.md, don’t show editor placeholder but move into \"+\" menu",
              "link": "https://github.com/nextcloud/text/issues/3209",
              "iconUrl": "https://my.nextcloud.org/index.php/apps/integration_github/avatar/nextcloud",
              "sinceId": "2022-10-13T12:14:39Z"
            }
          ],
          "spreed": [
            {
              "subtitle": "- Send chat messages without notifying the recipients in case it is not urgent",
              "title": "Talk updates ✅",
              "link": "https://my.nextcloud.org/index.php/call/hw39yxkp",
              "iconUrl": "https://my.nextcloud.org/core/img/actions/group.svg",
              "sinceId": ""
            },
            {
              "subtitle": "@roberto What's up?",
              "title": "Jane",
              "link": "https://my.nextcloud.org/index.php/call/z87agy2o",
              "iconUrl": "https://my.nextcloud.org/index.php/avatar/toto/64",
              "sinceId": ""
            }
          ]
        }
      }
    }
