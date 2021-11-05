====================
Calendar integration
====================

On this page you can learn more about integrating with the Nextcloud calendar services.

Resources
---------

Nextcloud apps can provide resource back ends for the CalDAV server in Nextcloud.

To register a custom back end, create a class that implements ``\OCP\Calendar\Resource\IBackend``.

In the :ref:`boot method of your Application class<Bootstrapping>` you can fetch the ``\OCP\Calendar\Resource\IManager`` instance and pass the fully qualified class name of your custom back end to ``registerBackend``.

.. code-block:: php

    <?php

    use OCP\Calendar\Resource\IManager;

    class Application extends App implements IBootstrap {

        public function __construct() {
            parent::__construct('myapp');
        }

        public function register(IRegistrationContext $context): void {
            // ... registration logic goes here ...
        }

        public function boot(IBootContext $context): void {
            /** @var IManager $manager */
            $resourceManager = $serverContainer->get(IManager::class);
            $resourceManager->registerBackend(\OCA\MyApp\ResourceBackend::class);
        }

    }

.. note:: Nextcloud queries the registered back ends only periodically through a background job. If the resources do not show up in the front-end double check if cron jobs are run on your development instance.

Rooms
-----

Nextcloud apps can provide rooms back ends for the CalDAV server in Nextcloud.

To register a custom back end, create a class that implements ``\OCP\Calendar\Room\IBackend``.

In the :ref:`boot method of your Application class<Bootstrapping>` you can fetch the ``\OCP\Calendar\Room\IManager`` instance and pass the fully qualified class name of your custom back end to ``registerBackend``.

.. code-block:: php

    <?php

    use OCP\Calendar\Room\IManager;

    class Application extends App implements IBootstrap {

        public function __construct() {
            parent::__construct('myapp');
        }

        public function register(IRegistrationContext $context): void {
            // ... registration logic goes here ...
        }

        public function boot(IBootContext $context): void {
            /** @var IManager $manager */
            $resourceManager = $serverContainer->get(IManager::class);
            $resourceManager->registerBackend(\OCA\MyApp\RoomBackend::class);
        }

    }

.. note:: Nextcloud queries the registered back ends only periodically through a background job. If the rooms do not show up in the front-end double check if cron jobs are run on your development instance.
