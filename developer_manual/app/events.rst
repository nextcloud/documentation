======
Events
======

Events are used to communicate between different aspects of the Nextcloud eco system.
As a rule events are dedicated classes extending '\OCP\EventDispatcher\Event'.

.. code-block:: php

    <?php

    use OCP\EventDispatcher\Event;

    namespace OCA\MyApp\Event;

    class AddEvent extends Event {
        private $counter;

        public function __construct() {
            $this->counter = 0;
        }

        public function addToCounter(int $i) {
            $this->counter = $this->counter + $i;
        }
    }


A class that can handle an event will implement the '\OCP\EventDispatcher\IEventListener' interface.

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


In the 'Application.php' the event and the listening class are connected. The class is instantiated only when the actual event is fired.

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


This provides a clear interface and contract between the emitted event and the listening services.

Available Events
----------------

'OCP\Security\CSP\AddContentSecurityPolicyEvent': This event is emitted so apps can modify the CSP provided by nextcloud. For example if more domains can be used to connect to.
