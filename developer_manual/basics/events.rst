.. _Events:

======
Events
======

Events are used to communicate between different aspects of the Nextcloud eco system. They are used in the Nextcloud server internally, for server-to-apps communication as well as inter-app communication.


Overview
--------

The term "events" is a bit broad in Nextcloud and there are multiple ways of emitting them.

* `OCP event dispatcher`_
* `Hooks`_
* `Public Emitter`_


OCP event dispatcher
--------------------

This mechanism is a versatile and typed approach to events in Nextcloud's php code. It uses objects rather than just passing primitives or untyped arrays. This should help provide a better developer experience while lowering the risk of unexpected changes in the API that are hard to find after the initial implementation.

Naming scheme
`````````````

The name should reflect the subject and the actions. Suffixing event classes with `Event` makes it easier to recognize their purpose.

For example, if a user is created, a `UserCreatedEvent` will be emitted.

Events are usually emitted *after* the event has happened. If it's emitted before, it should be prefixed with `Before`.

Thus `BeforeUserCreatedEvent` is emitted *before* the user data is written to the database.

.. note:: Although you may choose to name your event classes differently, sticking to the convention will allow Nextcloud developers understand each other's apps more easily.

.. note:: For backwards compatibility with the Symfony class `GenericEvent <https://symfony.com/doc/current/components/event_dispatcher/generic_event.html>`_, Nextcloud also provides a ``\OCP\EventDispatcher\Event`` class. With the release of Nextcloud 22 this class has been deprecated. Named and typed event classes should be used instead.

Writing events
``````````````

As a rule events are dedicated classes extending ``\OCP\EventDispatcher\Event``.

.. code-block:: php

    <?php

    use OCP\EventDispatcher\Event;

    namespace OCA\MyApp\Event;

    class AddEvent extends Event {}

The event above allows signalling that *something happened*. But in many cases you want to actually transport data like the affected resource with the event. Then the events act as simple `data transfer objects <https://en.wikipedia.org/wiki/Data_transfer_object>`_. Therefore they need a constructor that takes the arguments, private members to store them and getters to access the values in listeners.

.. code-block:: php

    <?php

    use OCP\EventDispatcher\Event;
    use OCP\IUser;

    class UserCreatedEvent extends Event {
        private IUser $user;

        public function __construct(IUser $user) {
            parent::__construct();
            $this->user = $user;
        }

        public function getUser(): IUser {
            return $this->user;
        }

    }

Writing a listener
``````````````````

A listener can be a simple callback function (or anything else that is `callable <https://www.php.net/manual/en/language.types.callable.php>`_, or a dedicated class.


Listener callbacks
******************

You can use simple callback to react on events. They will receive the event object as first and only parameter. You can type-hint the base `Event` class or the subclass you expect and register for.

.. code-block:: php

    <?php

    use OCA\MyApp\Event\AddEvent;
    use OCP\AppFramework\App;
    use OCP\EventDispatcher\IEventDispatcher;

    namespace OCA\MyApp\AppInfo;

    class Application extends App {
        public function __construct() {
            parent::__construct('myapp');
                /* @var IEventDispatcher $dispatcher */
                $dispatcher = $this->getContainer()->query(IEventDispatcher::class);
                $dispatcher->addListener(AddEvent::class, function(AddEvent $event) {
                    // ...
                });
        }
    }

.. note:: Type-hinting the actual event class will give you better IDE and static analyzers support. It's generally safe to assume the dispatcher will not give you any other objects.

Listener classes
****************

A class that can handle an event will implement the ``\OCP\EventDispatcher\IEventListener`` interface. Class names should end with `Listener`.

.. code-block:: php

    <?php

    use OCA\MyApp\Event\AddEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    namespace OCA\MyApp\Event;

    class AddTwoListener implements IEventListener {

        public function handle(Event $event): void {
            if (!($event instanceOf AddEvent)) {
                return;
            }

            $event->addToCounter(2);
        }
    }


.. note:: Php parameter type hints are not allowed to be more specific than the type hints on the interface, thus you can't use `AddEvent` in the method signature but use an `instanceOf` instead.

In the ``Application.php`` the event and the listener class are connected. The class is instantiated only when the actual event is fired.

.. code-block:: php

    <?php

    use OCA\MyApp\Event\AddEvent;
    use OCA\MyApp\Listener\AddTwoListener;
    use OCP\AppFramework\App;
    use OCP\EventDispatcher\IEventDispatcher;

    namespace OCA\MyApp\AppInfo;

    class Application extends App {
        public function __construct() {
            parent::__construct('myapp');
            /* @var IEventDispatcher $eventDispatcher */
            $dispatcher = $this->getContainer()->get(IEventDispatcher::class);
            $dispatcher->addServiceListener(AddEvent::class, AddTwoListener::class);
        }
    }

.. note:: The listener is resolved via the DI container, therefore you can add a constructor and type-hint services required for processing the event.

Available Events
````````````````

Here you find an overview of the public events that can be consumed in apps. See their source files for more details.

``\OCA\DAV\Events\AddressBookCreatedEvent``
*******************************************

.. versionadded:: 20

This event is triggered when a user creates a new address-book.

``\OCA\DAV\Events\AddressBookDeletedEvent``
*******************************************

.. versionadded:: 20

This event is triggered when a user deletes an address-book.

``\OCA\DAV\Events\AddressBookShareUpdatedEvent``
************************************************

.. versionadded:: 20

This event is triggered when a user shares or unshares an address-book.

``\OCA\DAV\Events\AddressBookUpdatedEvent``
*******************************************

.. versionadded:: 20

This event is triggered when a user updates an address-book.

``\OCA\DAV\Events\CachedCalendarObjectCreatedEvent``
****************************************************

.. versionadded:: 20

This event is triggered when a cached calendar object is being created while fetching a calendar-subscription.

``\OCA\DAV\Events\CachedCalendarObjectDeletedEvent``
****************************************************

.. versionadded:: 20

This event is triggered when a cached calendar object is being deleted while fetching a calendar-subscription.

``\OCA\DAV\Events\CachedCalendarObjectUpdatedEvent``
****************************************************

.. versionadded:: 20

This event is triggered when a cached calendar object is being updated while fetching a calendar-subscription.

``\OCA\DAV\Events\CalendarCreatedEvent``
****************************************

.. versionadded:: 20

This event is triggered when a user creates a new calendar.

``\OCA\DAV\Events\CalendarDeletedEvent``
****************************************

.. versionadded:: 20

This event is triggered when a user deletes a calendar.

``\OCA\DAV\Events\CalendarObjectCreatedEvent``
**********************************************

.. versionadded:: 20

This event is triggered when a user creates a calendar-object.

``\OCA\DAV\Events\CalendarObjectDeletedEvent``
**********************************************

.. versionadded:: 20

This event is triggered when a user deletes a calendar-object.

``\OCA\DAV\Events\CalendarObjectUpdatedEvent``
**********************************************

.. versionadded:: 20

This event is triggered when a user updates a calendar-object.

``\OCA\DAV\Events\CalendarPublishedEvent``
******************************************

.. versionadded:: 20

This event is triggered when a user publishes a calendar.

``\OCA\DAV\Events\CalendarShareUpdatedEvent``
*********************************************

.. versionadded:: 20

This event is triggered when a user shares or unshares a calendar.

``\OCA\DAV\Events\CalendarUnpublishedEvent``
********************************************

.. versionadded:: 20

This event is triggered when a user unpublishes calendar.

``\OCA\DAV\Events\CalendarUpdatedEvent``
****************************************

.. versionadded:: 20

This event is triggered when a user updates a calendar.

``\OCA\DAV\Events\CardCreatedEvent``
************************************

.. versionadded:: 20

This event is triggered when a user creates a new card in an address-book.

``\OCA\DAV\Events\CardDeletedEvent``
************************************

.. versionadded:: 20

This event is triggered when a user deletes a card in an address-book.

``\OCA\DAV\Events\CardUpdatedEvent``
************************************

.. versionadded:: 20

This event is triggered when a user updates a card in an address-book.

``OCA\DAV\Events\SabrePluginAddEvent``
**************************************

.. versionadded:: 28

This event is triggered during the setup of the SabreDAV server to allow the registration of additional plugins.

``\OCA\DAV\Events\SabrePluginAuthInitEvent``
********************************************

.. versionadded:: 20

This event is triggered during the setup of the SabreDAV server to allow the registration of additional authentication backends.

``\OCA\DAV\Events\SubscriptionCreatedEvent``
********************************************

.. versionadded:: 20

This event is triggered when a user creates a new calendar-subscription.

``\OCA\DAV\Events\SubscriptionDeletedEvent``
********************************************

.. versionadded:: 20

This event is triggered when a user deletes a calendar-subscription.

``\OCA\DAV\Events\SubscriptionUpdatedEvent``
********************************************

.. versionadded:: 20

This event is triggered when a user deletes a calendar-subscription.

``\OCA\FederatedFileSharing\Events\FederatedShareAddedEvent``
*************************************************************

.. versionadded:: 20

This event is triggered when a federated share is successfully added.

``\OCA\Files\Event\LoadAdditionalScriptsEvent``
***********************************************

.. versionadded:: 17

This event is triggered when the files app is rendered. It can be used to add additional scripts to the files app.

``\OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent``
********************************************************

.. versionadded:: 20

Emitted before the rendering step of the public share page happens. The event holds a flag that specifies if it is the authentication page of a public share.

``\OCA\Files_Trashbin\Events\MoveToTrashEvent``
***********************************************

.. versionadded:: 28

Emitted after a file or folder is moved to the trashbin.

``\OCA\Settings\Events\BeforeTemplateRenderedEvent``
********************************************************

.. versionadded:: 20

This event is triggered right before the user management template is rendered.

``\OCA\User_LDAP\Events\GroupBackendRegistered``
************************************************

.. versionadded:: 20

This event is triggered right after the LDAP group backend is registered.

``\OCA\User_LDAP\Events\UserBackendRegistered``
************************************************

.. versionadded:: 20

This event is triggered right after the LDAP user backend is registered.

``\OCA\Viewer\Event\LoadViewer``
********************************

.. versionadded:: 17

This event is triggered whenever the viewer is loaded and extensions should be loaded.

.. include:: _available_events_ocp.rst

Hooks
-----

.. deprecated:: 18
    Use the `OCP event dispatcher`_ instead.

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Hooks are used to execute code before or after an event has occurred. This is for instance useful to run cleanup code after users, groups or files have been deleted. Hooks should be registered in the :doc:`app.php <../app_development/init>`:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    $app = new Application();
    $app->getContainer()->query('UserHooks')->register();

The hook logic should be in a separate class that is being registered in the `App constructor <dependency_injection.html#using-a-container>`__:

.. code-block:: php

    <?php

    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Hooks\UserHooks;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('UserHooks', function($c) {
                return new UserHooks(
                    $c->get(\OCP\IUserManager::class)
                );
            });
        }
    }

.. code-block:: php

    <?php

    namespace OCA\MyApp\Hooks;

    use OCP\IUserManager;

    class UserHooks {

        private $userManager;

        public function __construct(IUserManager $userManager){
            $this->userManager = $userManager;
        }

        public function register() {
            $callback = function($user) {
                // your code that executes before $user is deleted
            };
            $this->userManager->listen('\OC\User', 'preDelete', $callback);
        }

    }

Available hooks
```````````````

The scope is the first parameter that is passed to the **listen** method, the second parameter is the method and the third one the callback that should be executed once the hook is being called, e.g.:

.. code-block:: php

    <?php

    // listen on user predelete
    $callback = function($user) {
        // your code that executes before $user is deleted
    };
    $userManager->listen('\OC\User', 'preDelete', $callback);


Hooks can also be removed by using the **removeListener** method on the object:

.. code-block:: php

    <?php

    // delete previous callback
    $userManager->removeListener(null, null, $callback);


The following hooks are available:

Session
```````

Injectable from the ServerContainer with the ``\OCP\IUserSession`` service.

Hooks available in scope **\\OC\\User**:

* **preSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **postSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **changeUser** (\\OC\\User\\User $user, string $feature, string $value)
* **preDelete** (\\OC\\User\\User $user)
* **postDelete** (\\OC\\User\\User $user)
* **preCreateUser** (string $uid, string $password)
* **postCreateUser** (\\OC\\User\\User $user)
* **preLogin** (string $user, string $password)
* **postLogin** (\\OC\\User\\User $user, string $password)
* **logout** ()

UserManager
```````````

Injectable from the ServerContainer with the ``\OCP\IUserManager`` service.

Hooks available in scope **\\OC\\User**:

* **preSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **postSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **preDelete** (\\OC\\User\\User $user)
* **postDelete** (\\OC\\User\\User $user)
* **preCreateUser** (string $uid, string $password)
* **postCreateUser** (\\OC\\User\\User $user, string $password)

GroupManager
````````````

Hooks available in scope **\\OC\\Group**:

* **preAddUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **postAddUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **preRemoveUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **postRemoveUser** (\\OC\\Group\\Group $group, \\OC\\User\\User $user)
* **preDelete** (\\OC\\Group\\Group $group)
* **postDelete** (\\OC\\Group\\Group $group)
* **preCreate** (string $groupId)
* **postCreate** (\\OC\\Group\\Group $group)

Filesystem root
```````````````

Injectable from the ServerContainer by calling the method **getRootFolder()**, **getUserFolder()** or **getAppFolder()**.

To enable these events for your app you should add the following to your `info.xml` file:

.. code-block:: xml

    <types>
        <filesystem/>
    </types>

Filesystem hooks available in scope **\\OC\\Files**:

* **preWrite** (\\OCP\\Files\\Node $node)
* **postWrite** (\\OCP\\Files\\Node $node)
* **preCreate** (\\OCP\\Files\\Node $node)
* **postCreate** (\\OCP\\Files\\Node $node)
* **preDelete** (\\OCP\\Files\\Node $node)
* **postDelete** (\\OCP\\Files\\Node $node)
* **preTouch** (\\OCP\\Files\\Node $node, int $mtime)
* **postTouch** (\\OCP\\Files\\Node $node)
* **preCopy** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)
* **postCopy** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)
* **preRename** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)
* **postRename** (\\OCP\\Files\\Node $source, \\OCP\\Files\\Node $target)

Filesystem scanner
``````````````````

Filesystem scanner hooks available in scope **\\OC\\Files\\Utils\\Scanner**:

* **scanFile** (string $absolutePath)
* **scanFolder** (string $absolutePath)
* **postScanFile** (string $absolutePath)
* **postScanFolder** (string $absolutePath)


Public emitter
--------------

.. deprecated:: 18
    Use the `OCP event dispatcher`_ instead.

tbd
