====================
Calendar integration
====================

On this page you can learn more about integrating with the Nextcloud calendar services.

Access calendars and events
---------------------------

.. _calendar-search:

Calendar objects
~~~~~~~~~~~~~~~~

You can query the contents of calendars in the back end through the calendar manager service. Queries are always scoped to a principal (user) but may follow further search criteria like string matches or date ranges.

:ref:`Inject <dependency-injection>` the calendar manager into your class. Then you can use ``newQuery`` and ``searchForPrincipal`` to build and execute a search query.

In the following example you see a basic use case of the calendar query API where specific user's calendar is searched for any events and tasks during a given duration.

.. code-block:: php

    <?php

    use OCP\Calendar\IManager;

    class MyService {

        /** @var IManager */
        private $calendarManager;

        public function __construct(IManager $calendarManager) {
            $this->calendarManager = $calendarManager;
        }

        public function searchInUserCalendar(string $uid,
                                             string $calendarUri,
                                             DateTimeImmutable $from,
                                             DateTimeImmutable $to): void {
            $principal = 'principals/users/' . $uid;

            // Prepare the query
            $query = $this->calendarManager->newQuery($principal);
            $query->addSearchCalendar($uri);
            $query->setTimerangeStart($from);
            $query->setTimerangeEnd($to);

            // Execute the query
            $objects = $this->calendarManager->searchForPrincipal($query);
        }

    }

Study the interface ``\OCP\Calendar\ICalendarQuery`` to learn more about other query options.

.. _calendar-access:

Calendars
~~~~~~~~~

You can access calendars through the ``IManager``. :ref:`Inject <dependency-injection>` the service, then use the ``getCalendarsForPrincipal`` method.

You can either query all calendars of the principal if you omit the second argument, or look for specific calendars only. See the examples below.

.. code-block:: php

    <?php

    use OCP\Calendar\IManager;

    class MyService {

        /** @var IManager */
        private $calendarManager;

        public function __construct(IManager $calendarManager) {
            $this->calendarManager = $calendarManager;
        }

        public function processCalendarData(string $uid): void {
            $principal = 'principals/users/' . $uid;

            // This will find all calendars of the principal
            $calendars = $this->calendarManager->getCalendarsForPrincipal($principal);

            // Work with calendars
        }

        public function processCalendarData(string $uid, string $calendarUri): void {
            $principal = 'principals/users/' . $uid;

            // This will only find specific calendars of the principal
            $calendars = $this->calendarManager->getCalendarsForPrincipal(
                $principal,
                [$calendarUri]
            );

            // Check if the requested calendar was found and work with it
        }

    }

The returned objects implement ``\OCP\Calendar\ICalendar``. Study the interface methods to discover what data is available.

.. note:: All calendars are by default only readable, therefore ``ICalendar`` does not offer methods for mutation. Some of the calendars are mutable, however, and they may further extend the interface ``\OCP\Calendar\ICreateFromString``.

Calendar providers
-------------------

The Nextcloud groupware integration provides access to internal calendars.
It is, however, for third party apps possible to provide individual calendars.
The section :ref:`Integration of custom calendar providers<calendar-providers>` describes on how to implement a provider within the Nextcloud server.

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
