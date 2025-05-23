.. _Bootstrapping:

=============
Bootstrapping
=============

Every php process has a relatively short lifespan that lasts as long as the HTTP request or the invocation of the command
line program. At the beginning of this lifespan, Nextcloud initializes its services. At the same time, any additional apps
might want to register their services to Nextcloud as well. This event is called the *bootstrapping* and this chapter
shall shed some light on how to hook into this with an app.


.. _application-php:

The Application class
---------------------

The `Application` class is the main entry point of an app. This class is optional but highly recommended if your app needs
to register any services or run some code for every request.


Nextcloud will try to autoload the class from the namespace ``\OCA\<App namespace>\AppInfo\Application``, like 
``\OCA\MyApp\AppInfo\Application``, where *MyApp* would be the name of your app. The file will therefore have the location ``myapp/lib/AppInfo/Application.php``. 

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCP\AppFramework\App;

    class Application extends App {

        public function __construct() {
            parent::__construct('myapp');
            \OCP\Util::connectHook('OC_User', 'pre_deleteUser', 'OCA\MyApp\Hooks\User', 'deleteUser');
        }

    }

The class **must** extend ``OCP\AppFramework\App`` and may optionally implement ``\OCP\AppFramework\Bootstrap\IBootstrap``:

.. code-block:: php
    :caption: lib/AppInfo/Application.php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\Listeners\UserDeletedListener;
    use OCA\MyApp\Notifications\Notifier;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;
    use OCP\Notification\IManager;
    use OCP\User\Events;

    class Application extends App implements IBootstrap {

        public function __construct() {
            parent::__construct('myapp');
        }

        public function register(IRegistrationContext $context): void {
            // ... registration logic goes here ...

            // Register the composer autoloader for packages shipped by this app, if applicable
            include_once __DIR__ . '/../../vendor/autoload.php';

            $context->registerEventListener(
                BeforeUserDeletedEvent::class,
                UserDeletedListener::class
            );
        }

        public function boot(IBootContext $context): void {
            // ... boot logic goes here ...

            /** @var IManager $manager */
            $manager = $context->getAppContainer()->query(IManager::class);
            $manager->registerNotifierService(Notifier::class);
        }

    }
    
Note that the context objects of the methods ``register`` and ``boot`` have different interfaces and thus have different capabilities appropriate for their stage.

Bootstrapping process
---------------------

To give a better overview of *when* each of the bootstrapping stages are reached and how they app can interact with them,
this section explains the changes done for Nextcloud 20.

Nextcloud 20 and later
**********************

Nextcloud 20 is the first release with the interface ``\OCP\AppFramework\Bootstrap\IBootstrap``. This interface can be
implemented by your app's ``Application`` class to signal that it wants to act on the bootstrapping stages. The major difference
between this and the old process is that the bootstrapping is not performed in sequence, but apps register and boot
interleaved. This should ensure that an app that ``boot``\s can rely on all other apps' registration to be finished.

The overall process is as follows:

1) In each installed and enabled app that has an ``Application`` class that also implements ``IBootstrap``, the ``register``
   method will be called. This method receives a context argument via which the app can prime the dependency injection
   container and register other services lazily, e.g. by calling ``$context->registerService(...)``. The emphasis is on **laziness**. At this very early stage of the
   process lifetime, no other apps nor all of the server components are ready. Therefore the app **must not** try to use
   anything except the API provided by the context. That shall ensure that all apps can safely run their registration logic
   before any services are queried (instantiated) from the DI container or related code is run.
2) Nextcloud will load groups of certain apps early, e.g. filesystem or session apps, and other later.
3) Nextcloud will query the app's ``Application`` class (again), no matter whether it implements ``IBootstrap`` or not.
4) Nextcloud will invoke the :ref:`boot <app-bootstrap-boot>` method of every ``Application`` instance that implements ``IBootstrap``. At this stage
   you may assume that all registrations via ``IBootstrap::register`` have completed.


.. _app-bootstrap-boot:

Booting an app
^^^^^^^^^^^^^^

Any code that should run once for every Nextcloud process goes into the ``boot`` method of an app's ``Application`` class. Use this mechanism carefully as it could have a negative effect on Nextcloud's overall performance.

.. code-block:: php
    :caption: lib/AppInfo/Application.php
    :emphasize-lines: 11-15

    <?php

    class Application extends App implements IBootstrap {

        public function __construct() {
            parent::__construct('myapp');
        }

        public function register(IRegistrationContext $context): void {}

        public function boot(IBootContext $context): void {
            /** @var IFooManager $manager */
            $manager = $context->getAppContainer()->query(IFooManager::class);
            $manager->registerCustomFoo(MyFooImpl::class);
        }

    }

The code above fetches a fictional *foo manager* to register an app class. The boot context object comes with a ``injectFn`` helper that eases dependency injection inside the ``boot`` method by injecting arguments of a callable:

.. code-block:: php
    :caption: lib/AppInfo/Application.php
    :emphasize-lines: 12-14

    <?php

    class Application extends App implements IBootstrap {

        public function __construct() {
            parent::__construct('myapp');
        }

        public function register(IRegistrationContext $context): void {}

        public function boot(IBootContext $context): void {
            $context->injectFn(function(IFooManager $manager) {
                $manager->registerCustomFoo(MyFooImpl::class);
            });
        }

    }

With the help of ``Closure::fromCallable`` you can also delegate to other methods that get their arguments injected:

.. code-block:: php
    :caption: lib/AppInfo/Application.php
    :emphasize-lines: 12,15-17

    <?php

    class Application extends App implements IBootstrap {

        public function __construct() {
            parent::__construct('myapp');
        }

        public function register(IRegistrationContext $context): void {}

        public function boot(IBootContext $context): void {
            $context->injectFn($this->registerFoo(...));
        }

        protected function registerFoo(IFooManager $manager): void {
            $manager->registerCustomFoo(MyFooImpl::class);
        }

    }
