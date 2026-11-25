========================
Nextcloud filesystem API
========================

High level overview
-------------------

The Nextcloud filesystem provides a uniform API over multiple storage backends mounted into a single virtual filesystem.

Application code mainly interacts with the filesystem through two APIs:

- the newer ``IRootFolder`` / ``Node`` API
- the legacy ``View`` API

New code should prefer the ``IRootFolder`` / ``Node`` API. Internally, the two APIs still interoperate, and Node operations still rely on lower-level View-based functionality in several places.

.. code-block:: text

         ┌──────────────────────────────────┐
         │ Code using the filesystem        │
         └─────────┬───────────────────┬────┘
                   │                   │
                   │                   │
    ┌╌╌╌╌╌╌╌╌╌╌╌╌╌Filesystem layer╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
    ╎              │                   │            ╎
    ╎          new │                   │ legacy     ╎
    ╎              ▼                   ▼            ╎
    ╎   ┌────────────────┐   ┌──────────────────┐   ╎
    ╎   │IRootFolder /   │   │View API          │   ╎
    ╎   │Node API        │   │(path based)      │   ╎
    ╎   └────────┬───────┘   └────────┬─────────┘   ╎
    ╎            │                    │             ╎
    ╎            └──── compatibility ─┘             ╎
    ╎                   hooks/events                ╎
    ╎                                               ╎
    ╎        mount management and path routing      ╎
    └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┬╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
                    │
    ┌╌╌╌╌╌╌╌╌╌╌╌╌Storage layer and metadata services╌╌╌╌╌╌╌╌╌╌┐
    ╎                                                         ╎
    ╎                      ┌──────────┐                       ╎
    ╎                      │ Storage  │                       ╎
    ╎                      └────┬─────┘                       ╎
    ╎           ┌───────────────┼───────────────┐             ╎
    ╎           │               │               │             ╎
    ╎           ▼               ▼               ▼             ╎
    ╎   ┌────────────┐  ┌────────────┐  ┌────────────┐        ╎
    ╎   │  Scanner   │◄─│  Watcher   │  │  Updater   │        ╎
    ╎   └──────┬─────┘  └─────┬──────┘  └──────┬─────┘        ╎
    ╎          │              │                │              ╎
    ╎          │              │                ▼              ╎
    ╎          │              │         ┌────────────┐        ╎
    ╎          │              │         │ Propagator │        ╎
    ╎          │              │         └──────┬─────┘        ╎
    ╎          │              │                │              ╎
    ╎          ▼              ▼                ▼              ╎
    ╎   ┌──────────────────────────────────────────────┐      ╎
    ╎   │                   Cache                      │      ╎
    ╎   └──────────────────────────────────────────────┘      ╎
    ╎                                                         ╎
    ╎   Wrappers can alter storage, cache and                 ╎
    ╎   related behavior without reimplementing               ╎
    ╎   a backend                                             ╎
    └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘

Filesystem layer
^^^^^^^^^^^^^^^^

The filesystem layer exposes a virtual filesystem assembled from multiple mounts.

Node API
""""""""

The preferred API for new code is the ``IRootFolder`` / ``Node`` API, exposed through interfaces such as:

- ``OCP\Files\IRootFolder``
- ``OCP\Files\Folder``
- ``OCP\Files\File``
- ``OCP\Files\Node``

This API provides an object-oriented view of the filesystem and is the preferred entry point for application code. Typical flows start from ``IRootFolder`` and then access user folders, files, or subfolders as ``Node`` objects.

View API
""""""""

The legacy API is centered around ``OC\Files\View`` and path-based operations.

It is still widely used internally and remains important for compatibility. New code should avoid introducing new dependencies on ``View`` where a Node-based alternative exists.

Compatibility between APIs
""""""""""""""""""""""""""

The newer and legacy APIs are not fully separate stacks. In the current implementation, Node operations still rely on lower-level View-based functionality in several places.

Nextcloud also maintains compatibility between old and new event systems. Legacy filesystem hooks are bridged to Node-level events so that existing integrations continue to work while newer code can subscribe to typed events.

Mount management
""""""""""""""""

The filesystem layer also manages mounts.

This includes:

- registering mounts provided by core or apps
- resolving filesystem paths to a mount point and an internal path within the mounted storage
- exposing mount information for a path or subtree
- caching per-user mount metadata to support efficient lookup and file resolution

Mount handling is a core part of the filesystem design, not just a helper around storages. A user may see the same underlying storage through different mounts, with different visibility or permissions.

Metadata services
^^^^^^^^^^^^^^^^^

Each storage is paired with a metadata cache that stores information about files and folders such as path, file id, size, mtime, etag, mimetype, permissions, and related metadata.

This cache is persistent and database-backed. It is not just an in-memory optimization layer: many filesystem operations depend on it for lookup, search, move, and consistency behavior.

Metadata cache maintenance is shared between several components and services:

Scanner
"""""""

The scanner reads metadata from a storage backend and inserts or updates entries in the cache.

It is used for initial discovery and for refreshing metadata from the backend.

Watcher
"""""""

The watcher checks whether files or folders may have changed outside of the current Nextcloud process, determines whether cached entries should be refreshed, triggers rescans (via the Scanner),
and may also directly update/remove stale cache entries when necessary.

Updater
"""""""

The updater reacts to changes performed through the filesystem APIs, keeps cache entries in sync with those changes, and triggers propagation of parent-folder metadata updates.

Propagator
""""""""""

The propagator updates parent folder metadata, such as mtimes, etags, sizes, and sometimes other information, after changes to child entries.

Together, these components keep filesystem metadata coherent for both internal and external changes.

Storage layer
^^^^^^^^^^^^^

The storage layer abstracts the details of concrete backends and provides a uniform API for filesystem operations.

Examples of storage backends include local filesystem storage and object storage backends.

Most storage implementations inherit common behavior from shared base classes and can provide additional services such as:

- cache
- scanner
- watcher
- updater
- propagator
- locking
- streaming and direct file access helpers

Wrappers
--------

To allow apps and core components to customize behavior without reimplementing every backend, Nextcloud uses wrappers.

A wrapper encapsulates another storage and overrides selected behavior while forwarding all other calls to the wrapped storage.

This allows behavior to be composed orthogonally to backend type. For example, a wrapper can:

- restrict access to a subdirectory
- mask permissions
- add encryption-related behavior
- adjust metadata handling

Wrappers can be stacked, so multiple behavior changes can be combined around the same base storage.

Cache and related wrappers
^^^^^^^^^^^^^^^^^^^^^^^^^^

When a storage wrapper changes visible behavior, corresponding metadata behavior usually needs to change as well.

For that reason, many storage wrappers are paired with corresponding cache wrappers. Depending on the feature,
wrapper-specific behavior may also extend to watcher, propagator, or other metadata-related services.

For example:

- a jail wrapper must map visible paths to paths inside the wrapped storage
- a permissions wrapper must ensure cached permissions match the restricted view
- wrapper-specific propagator or watcher logic may be needed so metadata updates remain consistent

.. code-block:: text

    ┌────────────────┐      ┌──────────────────────┐
    │PermissionsMask │─────►│CachePermissionsMask  │
    └───────┬────────┘      └──────────────────────┘
            │
            ▼
    ┌────────────────┐      ┌──────────────────────┐
    │Jail            │─────►│CacheJail             │
    └───────┬────────┘      ├──────────────────────┤
            │               │JailWatcher           │
            │               ├──────────────────────┤
            │               │JailPropagator        │
            ▼               └──────────────────────┘
    ┌────────────────┐      ┌──────────────────────┐
    │Base storage    │─────►│Cache                 │
    └────────────────┘      └──────────────────────┘

A common example is the combination of:

- ``Jail`` to expose only a subtree of a storage
- ``PermissionsMask`` to reduce the effective permissions of that view

This is the basis for building restricted views over shared or app-managed storage.

Code map
--------

Approximate overview of significant filesystem code.

AppData
^^^^^^^

High-level API for application data directories.

The ``AppData`` implementation is built on top of the Node API and exposed through the simpler ``IAppData`` / ``ISimpleFile`` interfaces.

Cache
^^^^^

- metadata cache implementation
- database-backed file metadata storage
- cache wrappers
- scanner, watcher, updater, and propagation logic
- search and query support over cached metadata

Mount
^^^^^

- mount point representation
- mount registration and lookup
- user-specific mount setup and cached mount metadata

Node
^^^^

- ``IRootFolder`` / ``Node`` filesystem API implementation
- file and folder objects
- compatibility bridging between legacy hooks and Node events

ObjectStorage
^^^^^^^^^^^^^

Implementation of supported object storage backends and their filesystem integration.

SimpleFS
^^^^^^^^

Simplified filesystem API used for selected use cases such as app data access.

Storage
^^^^^^^

- common storage base classes
- concrete storage backends
- storage wrappers

Streams
^^^^^^^

Low-level PHP stream wrappers used by storage implementations.

Type
^^^^

Mimetype handling and detection.

View.php
^^^^^^^^

Legacy path-based filesystem API.

Guidance for new code
---------------------

For new application code:

- prefer ``IRootFolder`` / ``Node`` over ``View``
- avoid depending directly on storage-specific details unless required
- treat the metadata cache as part of the filesystem contract, not merely a performance optimization
- be aware that mounts and wrappers can change visible paths, permissions, and metadata behavior
- use app data and simplified abstractions such as ``SimpleFS`` where they fit the use case
