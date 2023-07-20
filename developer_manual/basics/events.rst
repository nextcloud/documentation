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

``\OCA\DAV\Events\SabrePluginAuthInitEvent``
********************************************

.. versionadded:: 20

This event is triggered during the setup of the SabreDAV server to allow the registration of additional authentication backends.

``OCP\BeforeSabrePubliclyLoadedEvent``
**************************************

.. versionadded:: 26

This event is triggered when accessing public webdav endpoints.

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

``\OCP\App\Events\AppEnableEvent``
**********************************

.. versionadded:: 27

This event is triggered when an app is enabled.

``\OCP\App\Events\AppUpdateEvent``
**********************************

.. versionadded:: 27

This event is triggered when an app is updated.

``\OCP\App\Events\AppDisableEvent``
***********************************

.. versionadded:: 27

This event is triggered when an app is disabled.

``\OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent``
*************************************************************

.. versionadded:: 20

Emitted before the rendering step of each TemplateResponse. The event holds a flag that specifies if an user is logged in.

``\OCP\Authentication\Events\LoginFailedEvent``
***********************************************

.. versionadded:: 19

Emitted when the authentication fails, but only if the login name can be associated with an existing user.

``\OCP\Authentication\TwoFactorAuth\TwoFactorProviderDisabled``
***************************************************************

.. versionadded:: 20

``\OCP\Collaboration\Reference\RenderReferenceEvent``
*****************************************************

.. versionadded:: 25

Event emitted when apps might render references like link previews or smart picker widgets.

This can be used to inject scripts for extending that. Further details can be found in the 
:ref:`Reference providers` deep dive.

``\OCP\Contacts\Events\ContactInteractedWithEvent``
***************************************************

.. versionadded:: 19

Event emitted by apps whenever there was an interaction with another user or contact.

It is an event that allows apps to notify other components about an interaction between two users. This can be used to build better recommendations and suggestions in user interfaces.

Emitters should add at least one identifier (uid, email, federated cloud ID) of the recipient of the interaction.

``\OCP\DB\Events\AddMissingIndicesEvent``
************************************************

.. versionadded:: 28

Event to allow apps to register information about missing database indices

This event will be dispatched for checking on the admin settings and when running
``occ db:add-missing-indices`` which will then create those indices or can be used
to generate the SQL statements for manual execution.

``\OCP\DB\QueryBuilder\Events\BeforeQueryExecutedEvent``
************************************************

.. versionadded:: 28

This event is triggered immediately before the execution of SQL statements. It provides access to the `\OC\DB\QueryBuilder\QueryBuilder` object and allows for the inspection and/or modification of the query.

``\OCP\DB\QueryBuilder\Events\QueryExecutedEvent``
************************************************

.. versionadded:: 28

This event is triggered immediately after the execution of SQL statements. It provides access to the `\OC\DB\QueryBuilder\QueryBuilder` object and allows for the inspection and/or modification of the result.

``\OCP\DirectEditing\RegisterDirectEditorEvent``
************************************************

.. versionadded:: 18

Event to allow to register the direct editor.

``\OCP\Files\Events\BeforeFileScannedEvent``
********************************************

.. versionadded:: 18

``\OCP\Files\Events\BeforeFolderScannedEvent``
**********************************************

.. versionadded:: 18

``\OCP\Files\Events\FileCacheUpdated``
**************************************

.. versionadded:: 18

``\OCP\Files\Events\FileScannedEvent``
**************************************

.. versionadded:: 18

``\OCP\Files\Events\FolderScannedEvent``
****************************************

.. versionadded:: 18

``\OCP\Files\Events\NodeAddedToCache``
**************************************

.. versionadded:: 18

``\OCP\Files\Events\NodeRemovedFromCache``
******************************************

.. versionadded:: 18

``\OCP\Group\Events\BeforeGroupCreatedEvent``
*********************************************

.. versionadded:: 18

``\OCP\Group\Events\BeforeGroupDeletedEvent``
*********************************************

.. versionadded:: 18

``\OCP\Group\Events\BeforeUserAddedEvent``
******************************************

.. versionadded:: 18

``\OCP\Group\Events\BeforeUserRemovedEvent``
********************************************

.. versionadded:: 18

Deprecated in 20.0.0 - it can't be guaranteed that this event is triggered in all case (e.g. for LDAP users this isn't possible)

``\OCP\Group\Events\GroupCreatedEvent``
***************************************

.. versionadded:: 26

``\OCP\Group\Events\GroupChangedEvent``
***************************************

.. versionadded:: 18

``\OCP\Group\Events\GroupDeletedEvent``
***************************************

.. versionadded:: 18

``\OCP\Group\Events\SubAdminAddedEvent``
****************************************

.. versionadded:: 21

``\OCP\Group\Events\SubAdminRemovedEvent``
******************************************

.. versionadded:: 21

``\OCP\Group\Events\UserAddedEvent``
************************************

.. versionadded:: 18

``\OCP\Group\Events\UserRemovedEvent``
**************************************

.. versionadded:: 18

``\OCP\Mail\Events\BeforeMessageSent``
**************************************

.. versionadded:: 19

Emitted before a system mail is sent. It can be used to alter the message.

``OCP\Preview\BeforePreviewFetchedEvent``
*****************************************

.. versionadded:: 26

Emitted before a file preview is being fetched. It can be used to block preview rendering by throwing a ``OCP\Files\NotFoundException``.

``\OCP\Security\CSP\AddContentSecurityPolicyEvent``
***************************************************

.. versionadded:: 17

Allows to inject something into the default content policy. This is for example useful when you're injecting Javascript code into a view belonging to another controller and cannot modify its Content-Security-Policy itself. Note that the adjustment is only applied to applications that use AppFramework controllers.

WARNING: Using this API incorrectly may make the instance more insecure. Do think twice before adding whitelisting resources. Please do also note that it is not possible to use the `disallowXYZ` functions.

``\OCP\Security\Events\GenerateSecurePasswordEvent``
****************************************************

.. versionadded:: 18

``\OCP\Security\Events\ValidatePasswordPolicyEvent``
****************************************************

.. versionadded:: 18

``\OCP\Security\FeaturePolicy\AddFeaturePolicyEvent``
*****************************************************

.. versionadded:: 17

Event that allows to register a feature policy header to a request.

``\OCP\Share\Events\ShareCreatedEvent``
***************************************

.. versionadded:: 18

``\OCP\Share\Events\VerifyMountPointEvent``
*******************************************

.. versionadded:: 19

``\OCP\User\Events\BeforeUserLoggedInWithCookieEvent``
******************************************************

.. versionadded:: 18

Emitted before a user is logged in via remember-me cookies.

``\OCP\User\Events\UserLoggedInWithCookieEvent``
************************************************

.. versionadded:: 18

Emitted when a user has been successfully logged in via remember-me cookies.

``\OCP\User\Events\BeforePasswordUpdatedEvent``
***********************************************

.. versionadded:: 18

Emitted before the user password is updated.

``\OCP\User\Events\PasswordUpdatedEvent``
*****************************************

.. versionadded:: 18

Emitted when the user password has been updated.

``\OCP\User\Events\BeforeUserCreatedEvent``
*******************************************

.. versionadded:: 18

Emitted before a new user is created on the back-end.

``\OCP\User\Events\UserCreatedEvent``
*************************************

.. versionadded:: 18

Emitted when a new user has been created on the back-end.

``\OCP\User\Events\BeforeUserDeletedEvent``
*******************************************

.. versionadded:: 18

``\OCP\User\Events\UserDeletedEvent``
*************************************

.. versionadded:: 18

``\OCP\User\Events\BeforeUserLoggedInEvent``
********************************************

.. versionadded:: 18

``\OCP\User\Events\BeforeUserLoggedOutEvent``
*********************************************

.. versionadded:: 18

Emitted before a user is logged out.

``\OCP\User\Events\PostLoginEvent``
***********************************

.. versionadded:: 18

``\OCP\User\Events\UserChangedEvent``
*************************************

.. versionadded:: 18

``\OCP\User\Events\UserLiveStatusEvent``
****************************************

.. versionadded:: 20

``\OCP\User\Events\UserLoggedInEvent``
**************************************

.. versionadded:: 18

``\OCP\User\Events\UserLoggedOutEvent``
***************************************

.. versionadded:: 18

Emitted when a user has been logged out successfully.

``\OCP\WorkflowEngine\LoadSettingsScriptsEvent``
************************************************

.. versionadded:: 20

Emitted when the workflow engine settings page is loaded.

``\OCP\WorkflowEngine\RegisterChecksEvent``
*******************************************

.. versionadded:: 18

``\OCP\WorkflowEngine\RegisterEntitiesEvent``
*********************************************

.. versionadded:: 18

``\OCP\WorkflowEngine\RegisterOperationsEvent``
***********************************************

.. versionadded:: 18

Symfony event dispatcher
------------------------

.. warning:: Using the Symfony event dispatcher mechanism is discouraged. Use the `OCP event dispatcher`_ abstraction instead.

tbd


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
