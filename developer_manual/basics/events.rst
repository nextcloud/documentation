.. _Events:

======
Events
======

Events are used to communicate between different aspects of the Nextcloud eco system. They are used in the Nextcloud server internally, for server-to-apps communcation as well as inter-app communication.


Overview
--------

The term "events" is a bit broad in Nextcloud and there are multiple ways of emitting them.

* `OCP event dispatcher`_
* `Symfony event dispatcher`_
* `Hooks`_
* `Public Emitter`_


OCP event dispatcher
--------------------

This mechanism is a versatile and typed approach to events in Nextcloud's php code. It uses objects rather than just passing primitives or untyped arrays. This should help provide a better developer experience while lowering the risk of unexpected changes in the API that are hard to find after the initial implementation.

Naming scheme
`````````````

The name should reflect the subject and the actions. Suffixing event classes with `Event` makes it easier to recognize their purpose.

For example, if a user is created, a `UserCreatedEvent` will be emitted.

Events are ususally evmitted *after* the event has happened. If it's emitted before, it should be prefixed with `Before`.

Thus `BeforeUserCreatedEvent` is emitted *before* the user data is written to the database.

.. note:: Although you may chose to name your event classes differently, sticking to the convention will allow Nextcloud developers understand each other's apps more easily.

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

        /** @var IUser */
        private $user;

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
                /* @var IEventDispatcher $eventDispatcher */
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
                $dispatcher = $this->getContainer()->query(IEventDispatcher::class);
                $dispatcher->addServiceListener(AddEvent::class, AddTwoListener::class);
        }
    }

.. note:: The listener is resolved via the DI container, therefore you can add a constructor and type-hint services required for processing the event.

Available Events
````````````````

Here you find an overview of the public events that can be consumed in apps. See their source files for more details.

``\OCA\DAV\Events\AddressBookCreatedEvent``
*******************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user creates a new address-book.

``\OCA\DAV\Events\AddressBookDeletedEvent``
*******************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user deletes an address-book.

``\OCA\DAV\Events\AddressBookShareUpdatedEvent``
************************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user shares or unshares an address-book.

``\OCA\DAV\Events\AddressBookUpdatedEvent``
*******************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user updates an address-book.

``\OCA\DAV\Events\CachedCalendarObjectCreatedEvent``
****************************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a cached calendar object is being created while fetching a calendar-subscription.

``\OCA\DAV\Events\CachedCalendarObjectDeletedEvent``
****************************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a cached calendar object is being deleted while fetching a calendar-subscription.

``\OCA\DAV\Events\CachedCalendarObjectUpdatedEvent``
****************************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a cached calendar object is being updated while fetching a calendar-subscription.

``\OCA\DAV\Events\CalendarCreatedEvent``
****************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user creates a new calendar.

``\OCA\DAV\Events\CalendarDeletedEvent``
****************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user deletes a calendar.

``\OCA\DAV\Events\CalendarObjectCreatedEvent``
**********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user creates a calendar-object.

``\OCA\DAV\Events\CalendarObjectDeletedEvent``
**********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user deletes a calendar-object.

``\OCA\DAV\Events\CalendarObjectUpdatedEvent``
**********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user updates a calendar-object.

``\OCA\DAV\Events\CalendarPublishedEvent``
******************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user publishes a calendar.

``\OCA\DAV\Events\CalendarShareUpdatedEvent``
*********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user shares or unshares a calendar.

``\OCA\DAV\Events\CalendarUnpublishedEvent``
********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user unpublishes calendar.

``\OCA\DAV\Events\CalendarUpdatedEvent``
****************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user updates a calendar.

``\OCA\DAV\Events\CardCreatedEvent``
************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user creates a new card in an address-book.

``\OCA\DAV\Events\CardDeletedEvent``
************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user deletes a card in an address-book.

``\OCA\DAV\Events\CardUpdatedEvent``
************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user updates a card in an address-book.

``\OCA\DAV\Events\SabrePluginAuthInitEvent``
********************************************

*Available in Nextcloud 20 and later.*

This event is triggered during the setup of the SabreDAV server to allow the registration of additional authentication backends.

``\OCA\DAV\Events\SubscriptionCreatedEvent``
********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user creates a new calendar-subscription.

``\OCA\DAV\Events\SubscriptionDeletedEvent``
********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user deletes a calendar-subscription.

``\OCA\DAV\Events\SubscriptionUpdatedEvent``
********************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a user deletes a calendar-subscription.

``\OCA\FederatedFileSharing\Events\FederatedShareAddedEvent``
*************************************************************

*Available in Nextcloud 20 and later.*

This event is triggered when a federated share is successfully added.

``\OCA\Files\Event\LoadAdditionalScriptsEvent``
***********************************************

*Available in Nextcloud 17 and later.*

This event is triggered when the files app is rendered. It canb e used to add additional scripts to the files app.

``\OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent``
********************************************************

*Available in Nextcloud 20 and later.*

Emitted before the rendering step of the public share page happens. The event holds a flag that specifies if it is the authentication page of a public share.

``\OCA\Settings\Events\BeforeTemplateRenderedEvent``
********************************************************

*Available in Nextcloud 20 and later.*

This event is triggered right before the user management template is rendered.

``\OCA\User_LDAP\Events\GroupBackendRegistered``
************************************************

*Available in Nextcloud 20 and later.*

This event is triggered right after the LDAP group backend is registered.

``\OCA\User_LDAP\Events\UserBackendRegistered``
************************************************

*Available in Nextcloud 20 and later.*

This event is triggered right after the LDAP user backend is registered.

``\OCA\Viewer\Event\LoadViewer``
********************************

*Available in Nextcloud 17 and later.*

This event is triggered whenever the viewer is loaded and extensions should be loaded.

``\OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent``
*************************************************************

*Available in Nextcloud 20 and later.*

Emitted before the rendering step of each TemplateResponse. The event holds a flag that specifies if an user is logged in.

``\OCP\Authentication\Events\LoginFailedEvent``
***********************************************

*Available in Nextcloud 19 and later.*

Emitted when the authentication fails, but only if the login name can be associated with an existing user.

``\OCP\Authentication\TwoFactorAuth\TwoFactorProviderDisabled``
***************************************************************

*Available in Nextcloud 20 and later.*

``\OCP\Contacts\Events\ContactInteractedWithEvent``
***************************************************

*Available in Nextcloud 19 and later.*

Event emitted by apps whenever there was an interaction with another user or contact.

It is an event that allows apps to notify other components about an interaction between two users. This can be used to build better recommendations and suggestions in user interfaces.

Emitters should add at least one identifier (uid, email, federated cloud ID) of the recipient of the interaction.

``\OCP\DirectEditing\RegisterDirectEditorEvent``
************************************************

*Available in Nextcloud 18 and later.*

Event to allow to register the direct editor.

``\OCP\Files\Events\BeforeFileScannedEvent``
********************************************

*Available in Nextcloud 18 and later.*

``\OCP\Files\Events\BeforeFolderScannedEvent``
**********************************************

*Available in Nextcloud 18 and later.*

``\OCP\Files\Events\FileCacheUpdated``
**************************************

*Available in Nextcloud 18 and later.*

``\OCP\Files\Events\FileScannedEvent``
**************************************

*Available in Nextcloud 18 and later.*

``\OCP\Files\Events\FolderScannedEvent``
****************************************

*Available in Nextcloud 18 and later.*

``\OCP\Files\Events\NodeAddedToCache``
**************************************

*Available in Nextcloud 18 and later.*

``\OCP\Files\Events\NodeRemovedFromCache``
******************************************

*Available in Nextcloud 18 and later.*

``\OCP\Group\Events\BeforeGroupCreatedEvent``
*********************************************

*Available in Nextcloud 18 and later.*

``\OCP\Group\Events\BeforeGroupDeletedEvent``
*********************************************

*Available in Nextcloud 18 and later.*

``\OCP\Group\Events\BeforeUserAddedEvent``
******************************************

*Available in Nextcloud 18 and later.*

``\OCP\Group\Events\BeforeUserRemovedEvent``
********************************************

*Available in Nextcloud 18 and later.*

Deprecated in 20.0.0 - it can't be guaranteed that this event is triggered in all case (e.g. for LDAP users this isn't possible)

``\OCP\Group\Events\GroupCreatedEvent``
***************************************

*Available in Nextcloud 18 and later.*

``\OCP\Group\Events\GroupDeletedEvent``
***************************************

*Available in Nextcloud 18 and later.*

``\OCP\Group\Events\SubAdminAddedEvent``
****************************************

*Available in Nextcloud 21 and later.*

``\OCP\Group\Events\SubAdminRemovedEvent``
******************************************

*Available in Nextcloud 21 and later.*

``\OCP\Group\Events\UserAddedEvent``
************************************

*Available in Nextcloud 18 and later.*

``\OCP\Group\Events\UserRemovedEvent``
**************************************

*Available in Nextcloud 18 and later.*

``\OCP\Mail\Events\BeforeMessageSent``
**************************************

*Available in Nextcloud 19 and later.*

Emitted before a system mail is sent. It can be used to alter the message.

``\OCP\Security\CSP\AddContentSecurityPolicyEvent``
***************************************************

*Available in Nextcloud 17 and later.*

Allows to inject something into the default content policy. This is for example useful when you're injecting Javascript code into a view belonging to another controller and cannot modify its Content-Security-Policy itself. Note that the adjustment is only applied to applications that use AppFramework controllers.

WARNING: Using this API incorrectly may make the instance more insecure. Do think twice before adding whitelisting resources. Please do also note that it is not possible to use the `disallowXYZ` functions.

``\OCP\Security\Events\GenerateSecurePasswordEvent``
****************************************************

*Available in Nextcloud 18 and later.*

``\OCP\Security\Events\ValidatePasswordPolicyEvent``
****************************************************

*Available in Nextcloud 18 and later.*

``\OCP\Security\FeaturePolicy\AddFeaturePolicyEvent``
*****************************************************

*Available in Nextcloud 17 and later.*

Event that allows to register a feature policy header to a request.

``\OCP\Share\Events\ShareCreatedEvent``
***************************************

*Available in Nextcloud 18 and later.*

``\OCP\Share\Events\VerifyMountPointEvent``
*******************************************

*Available in Nextcloud 19 and later.*

``\OCP\User\Events\BeforeUserLoggedInWithCookieEvent``
******************************************************

*Available in Nextcloud 18 and later.*

Emitted before a user is logged in via remember-me cookies.

``\OCP\User\Events\UserLoggedInWithCookieEvent``
************************************************

*Available in Nextcloud 18 and later.*

Emitted when a user has been succesfully logged in via remember-me cookies.

``\OCP\User\Events\BeforePasswordUpdatedEvent``
***********************************************

*Available in Nextcloud 18 and later.*

Emitted before the user password is updated.

``\OCP\User\Events\PasswordUpdatedEvent``
*****************************************

*Available in Nextcloud 18 and later.*

Emitted when the user password has been updated.

``\OCP\User\Events\BeforeUserCreatedEvent``
*******************************************

*Available in Nextcloud 18 and later.*

Emitted before a new user is created on the back-end.

``\OCP\User\Events\UserCreatedEvent``
*************************************

*Available in Nextcloud 18 and later.*

Emitted when a new user has been created on the back-end.

``\OCP\User\Events\BeforeUserDeletedEvent``
*******************************************

*Available in Nextcloud 18 and later.*

``\OCP\User\Events\UserDeletedEvent``
*************************************

*Available in Nextcloud 18 and later.*

``\OCP\User\Events\BeforeUserLoggedInEvent``
********************************************

*Available in Nextcloud 18 and later.*

``\OCP\User\Events\BeforeUserLoggedOutEvent``
*********************************************

*Available in Nextcloud 18 and later.*

Emitted before a user is logged out.

``\OCP\User\Events\CreateUserEvent``
************************************

*Available in Nextcloud 18 and later.*

``\OCP\User\Events\PostLoginEvent``
***********************************

*Available in Nextcloud 18 and later.*

``\OCP\User\Events\UserChangedEvent``
*************************************

*Available in Nextcloud 18 and later.*

``\OCP\User\Events\UserLiveStatusEvent``
****************************************

*Available in Nextcloud 20 and later.*

``\OCP\User\Events\UserLoggedInEvent``
**************************************

*Available in Nextcloud 18 and later.*

``\OCP\User\Events\UserLoggedOutEvent``
***************************************

*Available in Nextcloud 18 and later.*

Emitted when a user has been logged out successfully.

``\OCP\WorkflowEngine\LoadSettingsScriptsEvent``
************************************************

*Available in Nextcloud 20 and later.*

Emitted when the workflow engine settings page is loaded.

``\OCP\WorkflowEngine\RegisterChecksEvent``
*******************************************

*Available in Nextcloud 18 and later.*

``\OCP\WorkflowEngine\RegisterEntitiesEvent``
*********************************************

*Available in Nextcloud 18 and later.*

``\OCP\WorkflowEngine\RegisterOperationsEvent``
***********************************************

*Available in Nextcloud 18 and later.*

Symfony event dispatcher
------------------------

.. warning:: Using the Symfony event dispatcher mechanism is discouraged. Use the `OCP event dispatcher`_ abstraction instead.

tbd


Hooks
-----

.. warning:: The hooks mechanism is deprecated. Use the `OCP event dispatcher`_ instead.

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Hooks are used to execute code before or after an event has occurred. This is for instance useful to run cleanup code after users, groups or files have been deleted. Hooks should be registered in the :doc:`app.php <init>`:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    $app = new Application();
    $app->getContainer()->query('UserHooks')->register();

The hook logic should be in a separate class that is being registered in the :doc:`requests/container`:

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
                    $c->query('ServerContainer')->getUserManager()
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

Injectable from the ServerContainer by calling the method **getUserSession()**.

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

Injectable from the ServerContainer by calling the method **getUserManager()**.

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
--------------------

.. warning:: The public emitter mechanism is deprecated. Use the `OCP event dispatcher`_ instead.

tbd
