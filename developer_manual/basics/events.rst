.. _Events:

======
Events
======

.. contents::
   :local:
   :depth: 2

Introduction
------------

In Nextcloud, it is often important for distinct components -- including apps -- to communicate without tightly coupling their code together. **Events** are a standard solution to this problem.

An **event** is a signal emitted by code when something noteworthy happens, such as: 

- a user logging in,
- a file being uploaded, or
- a group being deleted

Other parts of the system -- including third-party apps -- can "listen" for these events and react by running additional logic, for example:

- sending a notification,
- updating a log, or
- blocking an operation based on business rules

This pattern enables:

- **Loose coupling:** The code that emits the event does not need to know which listeners will respond.
- **Extensibility:** New features and apps can add behavior or change workflows by registering listeners for relevant events.
- **Maintainability:** Changing or extending how an event is handled does not require altering the core functionality that emits it.

**Example:**  
Imagine a file-sharing platform - ahem - where you want to log every time a file is deleted. Instead of modifying every place in the codebase where deletions happen, the component that handles deletion emits a "file deleted" event whenever it deletes a file. A logging module can then listen for this event and record the deletion whenever it occurs -- no matter the source.

**In summary:**  
Events allow Nextcloud (and its apps and integrations) to build flexible, maintainable, and powerful features that respond to key actions across the system. 

Overview of Events in Nextcloud
-------------------------------

The modern mechanism for emitting and listening to events in the server and apps is Nextcloud's **OCP Event Dispatcher**. Utilizing the OCP Event Dispatcher is the recommended and standard approach; it delivers type-safety, dependency-injection-friendly listeners, and clear, future-proof event contracts.

.. warning::
    Older approaches -- **hooks** and **public emitters** -- were used in early Nextcloud versions. They are now deprecated and available only for rare migration or compatibility scenarios.

.. tip::
    If you’re migrating old code, see `Hooks (Deprecated)`_ and `Public Emitters (Deprecated)`_ sections -- or refer to older documentation versions -- for more historical context helpful to transitioning, including some of the other ways of registering listeners.

OCP Event Dispatcher
--------------------

This mechanism provides a robust, typed approach to events in Nextcloud's PHP code. It uses objects rather than just passing primitives or untyped arrays, improving developer experience and reducing the risk of unexpected API changes that are hard to diagnose after the initial implementation.

Naming Events
`````````````

Event class names should clearly reflect the subject and the action, and should be suffixed with ``Event``, making their purpose immediately recognizable.

For example, if a user is created, a ``UserCreatedEvent`` will be emitted.

Events are usually emitted *after* the action has occurred. If emitted before, the event should be prefixed with ``Before``, e.g., ``BeforeUserCreatedEvent`` is emitted before user data is written to the database.

.. note:: 
    Although you may choose to name your event classes differently, sticking to this naming convention helps all Nextcloud developers understand each other's apps more easily.

Writing Events
``````````````

Events are dedicated classes extending ``\OCP\EventDispatcher\Event``:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Events;

    use OCP\EventDispatcher\Event;

    /**
     * Event emitted when something is added in MyApp.
     */
    class AddEvent extends Event {}

This event simply signals that *something happened*. In many cases, you want to transport data with the event -- for example, the affected resource. In these cases, events act as `data transfer objects <https://en.wikipedia.org/wiki/Data_transfer_object>`_: they need a constructor for the data, private members to store it, and getters for listeners to access the values:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Events;

    use OCP\EventDispatcher\Event;
    use OCP\IUser;

    /**
     * Event emitted after a user has been created.
     */
    class UserCreatedEvent extends Event {

        public function __construct(
            private IUser $user
        ) {
        }

        public function getUser(): IUser {
            return $this->user;
        }
    }

You may never need to write your own event, as many `Public Events <Available Public Events>`_ are already implemented by Nextcloud core and apps.

.. tip::
    Don't get too hung up regarding data transportation at the moment if you're unfamiliar  with the topic. We'll return to the ``UserCreatedEvent`` and DTO in the context of a fuller example later on. For now, let's return to the simpler ``AddEvent``, which merely fires ("this happened"), without transporting any data to our listener.

.. note::
    You may see older code that calls the parent constructor (i.e. ``parent::__construct();``) in its Event class. This is no longer necessary; it won't hurt anything in existing code, but is a no-op.

Writing Listeners
`````````````````

A listener is a class that handles an event by implementing the ``OCP\EventDispatcher\IEventListener`` interface. Class names should end with ``Listener``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Events;

    use OCA\MyApp\Events\AddEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    /**
     * Listener that adds two to a counter whenever an AddEvent is fired.
     */
    class AddTwoListener implements IEventListener {

        // The logic triggered in response to an event
        public function handle(Event $event): void {
            if (!($event instanceof AddEvent)) {
                return;
            }

            $event->addToCounter(2);
        }
    }

The listener is registered during app bootstrap and is instantiated by the upstream DI container when the corresponding event is fired. During the listener's existence, the handler (``handle()``) within it is called whenever an ``AddEvent`` is fired. The listener's handler implements the business logic (i.e. does the 
interesting thing).

.. note::
    PHP parameter type hints cannot be more specific than those on the interface, so you can't type-hint ``AddEvent`` in the method signature; instead use instanceof inside the handler method.

.. note::
    By default there is no persistent "listener object" kept by the dispatcher. Each time the event is fired, the DI container will lazily instantiate a new instance of the listener (the class), invoke the handle() method, and then discard the instance. There are more advanced approaches to listener registration (singleton/shared), but
    that is a more advanced use case -- not the default for DI-registered event listeners in Nextcloud. You may find this approach in core, but rarely in apps.

Registering Listeners 
`````````````````````

Registering connects your listener class to the events. Modern Nextcloud apps implement the ``IBootstrap`` interface in their ``Application`` class. Event listeners should be registered in the :php:meth:`register()` method of this class by calling ``registerEventListener()``. The listener class is instantiated only when the event is fired:

.. code-block:: php

    <?php

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\Events\AddEvent;
    use OCA\MyApp\Listener\AddTwoListener;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {
        public const APP_ID = 'myapp';

	    public function __construct(array $urlParams = []) {
		    parent::__construct(self::APP_ID, $urlParams);
	    }

        public function register(IRegistrationContext $context): void {
            // Register event listener AddTwoListener for handling AddEvent events
            $context->registerEventListener(AddEvent::class, AddTwoListener::class);
        }

        public function boot(IBootContext $context): void {
        }
    }

The ``EventListener`` class (``AddTwoListener``) is instantiated by the DI container, so you can add a constructor (in the listener class) with any type-hinted dependencies your event listener needs (such as services). The ``Event`` object itself will be passed to the ``handle()`` method when the event fires. Example based on the ``AddTwoListener`` event listener class we created previously:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Events;

    use OCA\MyApp\Events\AddEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    /**
     * Listener that uses MyService (external dependency) when an AddEvent is fired.
     */
    class AddTwoListener implements IEventListener {

        // The service/dependency is injected by the DI container
        public function __construct(
            private MyService $myService // injected and assigned to a private property
        ) {
        }

        // The logic
        public function handle(Event $event): void {
            if (!($event instanceof AddEvent)) {
                return;
            }

            // Use the injected service to do something (e.g. log or process the event)
            $this->myService->logAdded($event);

            // Continue with other logic if needed
            $event->addToCounter(2);
        }
    }

The event (``AddEvent``, etc) will **not** be passed to the listener's constructor; it’s passed to ``handle()``. The listener is injected with ``MyService`` at instantiate time; its handler is called whenever ``AddEvent`` is fired during its lifetime. When the event listener is instantiated, the upstream container injects dependencies per the type-hints in the listener's constructor (In this case, a service called ``MyService $myservice``). The``MyService`` dependency/injected service is available for use by the handler as needed.

.. tip::
    You may see older code that registers listeners in a slightly different way, such as by using lower level functions such as ``addServiceListener()`` and ``addListener()`` (and/or possibly registering via the constructor). These are not covered here as they are not recommended for newer implementations. If maintaining a 
    legacy app that does not implement ``IBootstrap``, event listeners may be registered in the ``Application`` class as outlined in previous versions of the documentation. For all new development, use ``IBootstrap`` pattern described here.

Expanded Example
````````````````

Below is an expanded example, building on on our earlier ``UserCreatedEvent``. It demonstrates:

- How to use the event's ``getUser()`` method to access payload data
- How to inject and use a logger service in the listener

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Events;

    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;
    use OCP\IUser;

    /**
     * Event emitted after a user has been created.
     */
    class UserCreatedEvent extends Event {

        public function __construct(
            private IUser $user
        ) {
        }

        // one of our DTO getters
        public function getUser(): IUser {
            return $this->user;
        }
    }

.. code-block:: php

    <?php

    declare(strict_types=1);

    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;
    use Psr\Log\LoggerInterface;

    /**
     * Listener that logs the creation of a user when UserCreatedEvent is fired.
     */
    class LogCreatedUserListener implements IEventListener {

        // Logger is injected by the DI container
        public function __construct(
            private LoggerInterface $logger
        ) {
        }

        public function handle(Event $event): void {
            if (!($event instanceof UserCreatedEvent)) {
                return;
            }

            // Access the created user per the event's payload
            $user = $event->getUser();

            // Log the username of the created user
            $username = $user->getUID();
            $this->logger->info("A new user was created: {$username}");
        }
    }

To register the listener in your app's boostrap class:

.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;
    use OCA\MyApp\Events\UserCreatedEvent;
    use OCA\MyApp\Events\LogCreatedUserListener;

    class Bootstrap implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerEventListener(UserCreatedEvent::class, LogCreatedUserListener::class);
        }

        public function boot(IBootContext $context): void {
        }
    }
}

**Explanation:**

- The ``UserCreatedEvent`` transports the ``IUser`` object as its payload.
- ``LogCreatedUserListener`` is an event listener that receives an injected logger service via DI.
- Inside ``handle()``, it checks if the event is a ``UserCreatedEvent``, uses ``getUser()``, then logs the new user’s UID.
- The listener is registered using ``registerEventListener()`` within the app's bootstrap.

Emitting Events
```````````````

To allow other apps or components to react to actions in your app, you can emit (dispatch) your own events at key points in your code using the ``\OCP\EventDispatcher\IEventDispatcher`` service, typically injected into your services or controllers:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Service;

    use OCP\EventDispatcher\IEventDispatcher;
    use OCP\IUser;
    use OCA\MyApp\Events\UserCreatedEvent;

    class UserManager {

        public function __construct(
            private IEventDispatcher $dispatcher
        ) {
        }

        public function createUser(string $uid): IUser {
            // ... create the user in your backend/database, e.g.:
            // $user = $this->userFactory->create($uid);

            // ... any other logic ...

            // Emit an event so other apps can react
            $event = new UserCreatedEvent($user);
            $this->dispatcher->dispatch($event);

            return $user;
        }
    }

Available Public Events
```````````````````````

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

Hooks (Deprecated)
------------------

.. deprecated:: 18
    Use the `OCP event dispatcher`_ instead.

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Hooks are a legacy event mechanism. Do **NOT** use for new app development.

Hooks should be registered in the :doc:`Bootstrapping process <../app_development/bootstrap>`.

Using Hooks
```````````

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


Available hooks
```````````````

The following hooks are available:

Session
*******

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
***********

Injectable from the ServerContainer with the ``\OCP\IUserManager`` service.

Hooks available in scope **\\OC\\User**:

* **preSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **postSetPassword** (\\OC\\User\\User $user, string $password, string $recoverPassword)
* **preDelete** (\\OC\\User\\User $user)
* **postDelete** (\\OC\\User\\User $user)
* **preCreateUser** (string $uid, string $password)
* **postCreateUser** (\\OC\\User\\User $user, string $password)

GroupManager
************

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
***************

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
******************

Filesystem scanner hooks available in scope **\\OC\\Files\\Utils\\Scanner**:

* **scanFile** (string $absolutePath)
* **scanFolder** (string $absolutePath)
* **postScanFile** (string $absolutePath)
* **postScanFolder** (string $absolutePath)


Public emitters (Deprecated)
---------------------------

.. deprecated:: 18
    Use the `OCP event dispatcher`_ instead.

Emitters are a legacy event mechanism. Do **NOT** use for new app development.
