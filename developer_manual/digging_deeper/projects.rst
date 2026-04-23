========
Projects
========

Projects are a way to link items from different apps via a common interface.

App developers can integrate into projects and provide their own entity types to link with.


Register a resource provider
----------------------------

Things like files, deck cards and talk rooms are called Resources in projects.
In order to add your own resource type, we need to create a class implementing the
``OCP\Collaboration\Resources\IProvider`` interface.

.. code-block:: php

    <?php

    namespace OCA\MyApp\Collaboration\Resources;


    use OCP\Collaboration\Resources\IProvider;
    use OCP\Collaboration\Resources\IResource;
    use OCP\IURLGenerator;
    use OCP\IUser;

    class MyResourceProvider implements IProvider {
        public const RESOURCE_TYPE = 'my-app-item';

        /**
         * @var IURLGenerator
         */
        private $url;

        public function __construct(IURLGenerator $url) {
            $this->url = $url;
        }

        /**
         * @inheritDoc
         */
        public function getType(): string {
            return self::RESOURCE_TYPE;
        }

        /**
         * @inheritDoc
         */
        public function getResourceRichObject(IResource $resource): array {
            $item = $this->getItem($resource);
            $icon = $this->url->linkToRouteAbsolute('myapp.images.get_icon', ['id' => $item->getId()]);
            $resourceUrl = $this->url->linkToRouteAbsolute('bookmarks.page.index', ['item' => $bookmark->getId()]);

            return [
                'type' => self::RESOURCE_TYPE,
                'id' => $resource->getId(),
                'name' => $item->getTitle(),
                'link' => $resourceUrl,
                'iconUrl' => $favicon,
            ];
        }

        /**
         * @inheritDoc
         */
        public function canAccessResource(IResource $resource, ?IUser $user): bool {
            if ($resource->getType() !== self::RESOURCE_TYPE || !($user instanceof IUser)) {
                return false;
            }
            $bookmark = $this->getItem($resource);
            if ($bookmark === null) {
                return false;
            }
            return $bookmark->getUserId() === $user->getUID()
        }

        private function getItem(IResource $resource) : ?Item {
            // implement me
        }
    }


The ``MyResourceProvider`` class needs to be registered during the :ref:`app bootstrap<Bootstrapping>`.

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
        }

        public function boot(IBootContext $context): void {
            $context->injectFn(Closure::fromCallable([$this, 'registerCollaborationResources']));
        }

        protected function registerCollaborationResources(IProviderManager $resourceManager, IEventDispatcher $eventDispatcher): void {
            $resourceManager->registerResourceProvider(ResourceProvider::class);

            $eventDispatcher->addListener(\OCP\Collaboration\Resources\LoadAdditionalScriptsEvent::class, static function () {
                Util::addScript(self::APP_ID, 'collections');
            });
        }
    }

As you can see we also already register a front-end script, which we are going to create next.


Provide a user interface
------------------------

The user interface can be registered through the public ``OCP.Collaboration.registerType``
JavaScript method. The first parameter represents the resource type that has already
been specified in the ``IResourceProvider`` implementation. The second parameter is an object with
three properties:

  * ``typeString`` A localized string that will be displayed in the dropdown when choosing which resource type to link to
  * ``typeIconClass`` A CSS class of the icon that should be used for this entry
  * ``action`` An async function that will produce a resource picker UI and resolves with the resource id

The following example shows how a Vue.js component could be used to render the
widget user interface, however this approach works for any other framework as well
as plain JavaScript:


.. code-block:: javascript

        import Vue from 'vue'
        import ItemPickerDialog from './components/ItemPickerDialog'

    	OCP.Collaboration.registerType('myapp', {
		action: () => {
			return new Promise((resolve, reject) => {
				const container = document.createElement('div')
				container.id = 'myapp-item-select'
				const body = document.getElementById('body-user')
				body.appendChild(container)
				const ComponentVM = new Vue({
					render: h => h(ItemPickerDialog),
				})
				ComponentVM.$mount(container)
				ComponentVM.$root.$on('close', () => {
					ComponentVM.$el.remove()
					ComponentVM.$destroy()
					reject(new Error('User cancelled resource selection'))
				})
				ComponentVM.$root.$on('select', (id) => {
					resolve(id)
					ComponentVM.$el.remove()
					ComponentVM.$destroy()
				})
			})
		},
		typeString: t('myapp', 'Link to an item'),
		typeIconClass: 'icon-file',
	})

This will allow other apps to link to your items. We also want to link to other apps' items.
Since all apps with projects support are listening on the above LoadAdditionalScriptsEvent,
we can simply dispatch it when we render our main page template.


.. code-block:: php

	<?php

	class MyController extends Controller {
		private IEventDispatcher $eventDispatcher;

		public function __construct(string $appName, IRequest $request, IEventDispatcher $eventDispatcher) {
			parent::__construct($appName, $request);
			$this->eventDispatcher = $eventDispatcher;
		}

		public function index() {
			$this->eventDispatcher->dispatchTyped(new \OCP\Collaboration\Resources\LoadAdditionalScriptsEvent());
			return new TemplateResponse('my_app', 'main');
		}
	}


In our Vue app, we can then render the pre-built projects picker available in the npm package ``nextcloud-vue-collections``.

.. code-block::

    <template>
        <div>
            <CollectionList v-if="itemId"
                :id="itemId"
                :name="itemTitle"
                type="myapp" />
        </div>
    </template>

    <script>
    import { CollectionList } from 'nextcloud-vue-collections'
    export default {
        name: 'CollaborationView',
        components: {
            CollectionList,
        },
        props: {
            id: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: '',
            }
        }
    }
    </script>
