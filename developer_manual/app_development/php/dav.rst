.. _dav_extensions:

========================
Extending the DAV server
========================

Nextcloud apps can extend the DAV server by registering SabreDAV plugins that hook into
different phases of a DAV request. Plugins can add handlers for custom methods and
properties, adjust response behavior, and more. See `Writing Plugins - sabre/dav
<https://sabre.io/dav/writing-plugins/>`_ for additional possibilities.

Registering a DAV plugin
------------------------

To register a server plugin in your app, register an event listener for
``OCA\DAV\Events\SabrePluginAddEvent`` (introduced in Nextcloud 28). In the
listener's handler, add your DAV plugin to the server.
 
For example:

.. code-block:: php
   :caption: MyApplication.php

   class MyApplication extends App implements IBootstrap {
       public function register(IRegistrationContext $context): void {
           $context->registerEventListener(SabrePluginAddEvent::class, MyListener::class);
       }
   }

.. code-block:: php
   :caption: MyListener.php

   use OCP\EventDispatcher\Event;
   use OCP\EventDispatcher\IEventListener;
   use OCA\DAV\Events\SabrePluginAddEvent;

   class MyListener implements IEventListener {
       public function handle(Event $event): void {
           if (!$event instanceof SabrePluginAddEvent) {
               return;
           }
           $server = $event->getServer();
           $server->addPlugin(new MyDavPlugin());
       }
   }

Handling DAV events
-------------------

In this example, we register a handler for the ``propFind`` event and add a
custom property that is returned in PROPFIND requests.

.. code-block:: php
   :caption: MyDavPlugin.php

   use Sabre\DAV\ServerPlugin;
   use Sabre\DAV\PropFind;

   class MyDavPlugin extends ServerPlugin {

       public function initialize(\Sabre\DAV\Server $server): void {
           // Register your property handler
           $server->on('propFind', $this->handleGetProperties(...));
       }

       private function handleGetProperties(PropFind $propFind, \Sabre\DAV\INode $node): void {
           // Add a property called "my-property" with the value "custom"
           $propFind->handle('{myapplication.example}my-property', fn() => 'custom');
       }
   }


Performance considerations
--------------------------

In the example above, if you replace the "custom" value with a database lookup, you introduce a
performance issue: a query runs every time the property is loaded. This may
not be obvious at first, but it quickly becomes a problem, because a
``propFind`` event is emitted for every file in a collection to discover its
properties. If a collection contains 1,000 children, the code issues 1,000
queries that are likely very similar, differing only by the file identifier.

To mitigate this, Nextcloud 32 introduces a new event that signals your app to
preload data for a collection and its immediate children. Read more in
:ref:`collection_preload`.
