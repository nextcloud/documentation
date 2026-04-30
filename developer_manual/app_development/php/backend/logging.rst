=======
Logging
=======

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Nextcloud uses a :ref:`PSR-3 <psr3>` logger (``Psr\Log\LoggerInterface``).
The recommended way to use it is via :ref:`dependency injection <dependency-injection>`.

Basic usage
-----------

Inject ``Psr\Log\LoggerInterface`` into your class. When the logger is resolved
from an app container, Nextcloud automatically wraps it so that every log
message is attributed to your app -- you do **not** need to pass an app name
yourself:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use Psr\Log\LoggerInterface;

    class AuthorService {
        public function __construct(
            private LoggerInterface $logger,
        ) {
        }

        public function doSomething(): void {
            $this->logger->error('Something went wrong');
        }
    }

.. note::
   Behind the scenes, each app's DI container registers a ``ScopedPsrLogger``
   that prepends ``['app' => '<your-app-id>']`` to the context of every call.
   You do not need to set this manually.

In cases where you can not :ref:`inject <dependency-injection>` a logger into a class, you can use
the ``\OCP\Log\logger`` function to acquire a logger instance. As a first argument you need to pass
the app ID.

.. code-block:: php

    <?php

    use function OCP\Log\logger;

    logger('my_app')->warning('look, no dependency injection');


Available log methods
---------------------

The logger exposes the full set of PSR-3 methods:

- ``emergency()`` -- System is unusable
- ``alert()`` -- Action must be taken immediately
- ``critical()`` -- Critical conditions
- ``error()`` -- Runtime errors
- ``warning()`` -- Exceptional occurrences that are not errors
- ``notice()`` -- Normal but significant events
- ``info()`` -- Interesting events (e.g. user logs in)
- ``debug()`` -- Detailed debug information

Each method has the signature ``(string|\Stringable $message, array $context = []): void``.


Log level mapping
-----------------

PSR-3 defines eight severity levels, but Nextcloud internally uses five numeric
levels (set via the ``loglevel`` setting in ``config.php``). The mapping is:

.. list-table::
   :header-rows: 1

   * - PSR-3 level
     - Nextcloud level
     - Numeric value
   * - ``emergency``
     - FATAL
     - 4
   * - ``alert``, ``critical``, ``error``
     - ERROR
     - 3
   * - ``warning``
     - WARN
     - 2
   * - ``notice``, ``info``
     - INFO
     - 1
   * - ``debug``
     - DEBUG
     - 0

A message is written to the log only when its numeric level is **≥** the
configured ``loglevel`` (default: ``2`` / WARN).


Message interpolation
---------------------

Nextcloud supports PSR-3 message interpolation. Context values whose keys
appear as ``{placeholder}`` tokens in the message string are substituted
automatically:

.. code-block:: php

    $this->logger->warning('User {user} failed to log in', [
        'user' => $userId,
    ]);

This produces a log message like ``User jane failed to log in``. The ``user``
key is consumed by the interpolation and will not appear separately in the
stored log entry.


Context array
-------------

The second argument to every log method is a context array. Nextcloud
recognises several special keys:

``exception``
    If the context contains an ``exception`` key whose value is a
    ``\Throwable``, Nextcloud will serialize the full exception (class name,
    message, code, file, line, stack trace and any previous exceptions). **This
    is the recommended way to log exceptions:**

    .. code-block:: php

        try {
            $this->doRiskyThing();
        } catch (\Exception $e) {
            $this->logger->error('Operation failed', ['exception' => $e]);
        }

    You can provide a custom message as the first argument; if you omit it, the
    exception's own message is used.

``app``
    Identifies the app that produced the message. This is **set automatically**
    when you obtain the logger via dependency injection or the ``logger()``
    helper. You can override it explicitly if needed:

    .. code-block:: php

        $this->logger->info('Cross-app note', ['app' => 'other_app']);

Any other keys you add to the context array are included in the log entry as
additional data:

.. code-block:: php

    $this->logger->info('Cron job finished', [
        'duration' => $seconds,
        'items_processed' => $count,
    ]);


Logging exceptions
------------------

As shown above, passing an ``exception`` key in the context triggers detailed
exception serialization. This is preferred over manually calling
``$e->getMessage()`` because Nextcloud will capture the full stack trace and
chain of previous exceptions.

.. code-block:: php

    try {
        $this->service->process($data);
    } catch (\OCP\DB\Exception $e) {
        $this->logger->error('Database operation failed for item {id}', [
            'id' => $itemId,
            'exception' => $e,
        ]);
    }

You can combine message interpolation with exception logging -- Nextcloud
handles both.


Custom log file
---------------

If your app needs to write to a **separate log file** (for example, to keep
verbose debug output out of the main log), you can use
``OCP\Log\ILogFactory::getCustomPsrLogger()``:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Service;

    use OCP\Log\ILogFactory;
    use Psr\Log\LoggerInterface;

    class ImportService {
        private LoggerInterface $importLogger;

        public function __construct(ILogFactory $logFactory) {
            $this->importLogger = $logFactory->getCustomPsrLogger(
                '/var/log/nextcloud/import.log'
            );
        }

        public function run(): void {
            $this->importLogger->info('Import started');
        }
    }

The method signature is:

.. code-block:: php

    public function getCustomPsrLogger(
        string $path,
        string $type = 'file',
        string $tag = 'Nextcloud'
    ): LoggerInterface;

``$type`` can be ``file`` (default), ``errorlog``, ``syslog``, or ``systemd``.

.. note::
   ``getCustomPsrLogger`` has been available since Nextcloud 22.
   The ``$type`` and ``$tag`` parameters were added in Nextcloud 24.


Structured data logging
-----------------------

For advanced use cases, the logger also implements ``OCP\Log\IDataLogger``
(since Nextcloud 18.0.1), which provides a ``logData()`` method for logging
arbitrary structured data:

.. code-block:: php

    use OCP\Log\IDataLogger;

    /** @var IDataLogger $logger */
    $logger = \OCP\Server::get(\Psr\Log\LoggerInterface::class);
    $logger->logData('Sync completed', [
        'provider' => 'caldav',
        'items' => 42,
    ], [
        'app' => 'my_app',
        'level' => \OCP\ILogger::INFO,
    ]);

The first argument is a message string, the second is the structured data array,
and the third is an optional context array (which accepts the ``app`` and
``level`` keys described above).


Listening to log events
-----------------------

If your app needs to react when log messages are written (e.g. to forward them
to an external monitoring service), you can listen for the
``OCP\Log\BeforeMessageLoggedEvent`` event (since Nextcloud 28):

.. code-block:: php

    <?php
    namespace OCA\MyApp\Listener;

    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;
    use OCP\Log\BeforeMessageLoggedEvent;

    /** @template-implements IEventListener<BeforeMessageLoggedEvent> */
    class LogEventListener implements IEventListener {
        public function handle(Event $event): void {
            if (!$event instanceof BeforeMessageLoggedEvent) {
                return;
            }

            $app = $event->getApp();
            $level = $event->getLevel();
            $message = $event->getMessage(); // array with the log entry
            // ... forward to external service
        }
    }

Register the listener in your ``Application::register()`` method:

.. code-block:: php

    $context->registerEventListener(
        BeforeMessageLoggedEvent::class,
        LogEventListener::class
    );


Admin audit logging
-------------------

If you want to log things less for system administration but for compliance reasons, e.g. who accessed which file,
who changed the password of an item or made it public, the
`admin audit log <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/logging_configuration.html#admin-audit-log>`_
is the correct place.

You can easily add a log by simply emitting an ``OCP\Log\Audit\CriticalActionPerformedEvent`` event:

.. code-block:: php

    <?php

    $dispatcher = \OCP\Server::get(\OCP\EventDispatcher\IEventDispatcher::class);

    $event = new \OCP\Log\Audit\CriticalActionPerformedEvent(
        'My critical action for app %s',
        ['name' => 'My App ID']
    );
    $dispatcher->dispatchTyped($event);

The constructor also accepts an optional third parameter
``bool $obfuscateParameters = false``. Set it to ``true`` when the parameters
may contain sensitive information (passwords, tokens, etc.) that should not be
written in clear text to the audit log:

.. code-block:: php

    $event = new \OCP\Log\Audit\CriticalActionPerformedEvent(
        'Password changed for user %s',
        ['name' => $userId],
        true  // obfuscate parameters in the audit log
    );
