.. _collection_preload:

=================================
WebDAV collection preload events
=================================

Overview
--------

During a WebDAV PROPFIND on a SabreDAV collection with ``Depth > 0``,
Nextcloud emits a preload event so DAV plugins can fetch data for the
collection's children in one go. The goal is to avoid N+1 database queries by
preloading what your property handlers need before per-node property handling
starts. In practice, this means your plugin can fill a cache up front, then
read from it in the usual ``propFind`` handlers for a faster and more
efficient response.

When the event is emitted
-------------------------

The event is emitted during PROPFIND requests, before the ``propFind`` event,
for nodes implementing ``Sabre\DAV\ICollection`` with ``Depth > 0``.

The event may be emitted multiple times for a given request path; plugins should
check their caches to avoid duplicate work.

Subscribing to the event in a plugin
------------------------------------

Register a listener in your implementation of Sabre's ``ServerPlugin::initialize()`` method:

.. code-block:: php

   use Sabre\DAV\ICollection;
   use Sabre\DAV\PropFind;
   use Sabre\DAV\ServerPlugin;

   class MyDavPlugin extends ServerPlugin {

       public function initialize(\Sabre\DAV\Server $server): void {
           // Called before per-node property handlers
           $server->on('preloadCollection', $this->preloadCollection(...));

           // Your usual property handlers
           $server->on('propFind', $this->handleGetProperties(...));
       }

       private function preloadCollection(PropFind $propFind, ICollection $collection): void {
           // Only preload when your properties were actually requested
           $requested = [
               '{http://appdomain.example/ns}your-prop',
               '{http://appdomain.example/ns}another-prop',
           ];
           $anyRequested = array_reduce(
               $requested,
               fn($result, $property) => $result || $propFind->getStatus($property) !== null,
               false
           );
           if (!$anyRequested) {
               return;
           }

           // Fetch data for the collection and its children in bulk
           // and cache results for use in your propFind handler
           $this->cache = $this->bulkLoadDataForCollection($collection); // implement your own caching
       }

       private function handleGetProperties(PropFind $propFind, \Sabre\DAV\INode $node): void {
           // Read and return values from $this->cache to avoid per-node queries

           // Handle per-node property loading here to support Depth = 0
           // and cases where the 'preloadCollection' event is not emitted.
       }

   }


Built-in examples
-----------------

- Tags: ``OCA\DAV\Connector\Sabre\TagsPlugin`` preloads tags and favorite
  info for a folder and its children.
- Shares: ``OCA\DAV\Connector\Sabre\SharesPlugin`` preloads share types and
  sharees for items within a folder.
- Comments: ``OCA\DAV\Connector\Sabre\CommentPropertiesPlugin`` preloads unread
  comment counts for items within a folder.

Best practices
--------------

- Check requested properties: Use ``$propFind->getStatus('{ns}property')`` to
  confirm that your properties were actually requested before querying.
- Cache results: The event can fire multiple times; cache by file ID or path
  to avoid redundant work during the same request.
- Scope your preload: Only fetch data for the current collection and (at most)
  its direct children; avoid fetching across the whole tree.
