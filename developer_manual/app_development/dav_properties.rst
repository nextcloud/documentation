====
Apps DAV Properties
====

Add description of what DAV properties are and link SabreDAV.

Registering a DAV plugin
--------

Adding/registering a new property
--------

Preloading properties for better performance
--------

When properties are listed for files, your plugin will need to load the property from the storage and return it. This
becomes quickly an issue for directories with many files as the plugin may issue one or more queries per file and reduce
Nextcloud's performance. To avoid this, a convenience event `preloadCollection` is emitted by the DAV server for
nodes of type collection, whenever properties are being loaded for all files inside a collection.

Following the example above to register a DAV plugin, you can do the same to register the same plugin to preload the
data your application needs.

# TODO add example snippet

