.. _app config:

=========
AppConfig
=========

.. versionadded:: 29

Nextcloud includes an AppConfig API to manage app configuration values.

Concept overview
----------------

Nextcloud provides an API to store and access app configuration values.
In addition to simple read/write operations, ``IAppConfig`` supports:

- typed values,
- lazy loading,
- sensitive values,
- key and value discovery helpers.

.. _appconfig_concepts:

.. note::
   See :ref:`Lexicon Concepts <concept-overview>` to learn more about **Lexicon**, a way to define configuration keys and avoid conflicts in your code.


AppFramework
------------

The AppConfig API is also available in AppFramework through
``OCP\AppFramework\Services\IAppConfig``.

All methods from that interface are scoped to your app automatically, so you do not
need to pass an app ID explicitly.

.. code-block:: php

    <?php
    namespace OCA\MyApp;

    use OCP\AppFramework\Services\IAppConfig;

    class MyClass {
        public function __construct(
            private IAppConfig $appConfig,
        ) {}

        public function hasConfig(): bool {
            return $this->appConfig->hasAppKey('mykey');
        }
    }

Use ``\OCP\IAppConfig`` when you need to read or write configuration for arbitrary app IDs.
Use ``OCP\AppFramework\Services\IAppConfig`` for app-scoped operations in your own app.


Typed config values
^^^^^^^^^^^^^^^^^^^

To improve safety and stability, config values are type-enforced.

A type is set when the key is created in the database and cannot be changed later.

A key’s type is defined by the setter you use when the key is first created
(for example, ``setValueString()`` creates a string key, ``setValueInt()`` an int key).

.. code-block:: php

    $appConfig->setValueInt('myapp', 'retry_count', 3);       // key type: int
    $appConfig->setValueString('myapp', 'display_name', 'A'); // key type: string

.. note::
   - Values stored before Nextcloud 29 are treated as ``mixed``.
   - It is not possible to manually create new ``mixed`` values.
   - Values that are not ``mixed`` must be retrieved using the matching typed getter.

.. note::
   Migration urgency differs between reads and writes:

   - Read paths should usually be migrated early to typed getters when adopting
     ``IAppConfig``, so runtime behavior is explicit and type-safe.
   - Write-side normalization of legacy values can often be incremental and done
     when touching related code paths, especially if:

      - you want stricter typing guarantees,
      - you are already refactoring,
      - the key is causing ambiguity/bugs

   For new keys, always use typed setters and typed getters.

   **A safe write-side migration pattern is:**

      #. Read the existing legacy value.
      #. Validate/convert it in your app code.
      #. Write it back using the appropriate typed setter (for example ``setValueInt()``,
         ``setValueString()``, ``setValueBool()``, ...).
      #. Afterwards, always use the matching typed getter.
   

Sensitive values
^^^^^^^^^^^^^^^^

When storing a new config value, you can mark it as sensitive.

Sensitive values are hidden from filtered listings/reports and are handled as protected
values in AppConfig storage.

.. code-block:: php

    $appConfig->setValueString(
        'myapp',
        'mykey',
        'myvalue',
        sensitive: true
    );

.. note::
   Once set as sensitive, this can be changed later using ``updateSensitive()``.


Lazy loading
^^^^^^^^^^^^

To reduce memory and startup overhead, config values can be marked as lazy.

Non-lazy values are loaded first. Lazy values are loaded only when needed. When one lazy
value is requested, lazy values are loaded together.

.. code-block:: php

    $appConfig->setValueString(
        'myapp',
        'mykey',
        'myvalue',
        lazy: true
    );

Retrieving a lazy value requires using the lazy read mode:

.. code-block:: php

    $appConfig->getValueString(
        'myapp',
        'mykey',
        'default',
        lazy: true
    );

Reading behavior with ``lazy`` parameter
""""""""""""""""""""""""""""""""""""""""

When reading values, the ``lazy`` argument controls which storage bucket is queried.

+----------------------+----------------------+----------------------------------------------+
| Stored key mode      | Read with ``lazy``   | Result                                       |
+======================+======================+==============================================+
| non-lazy             | ``false``            | stored value                                 |
+----------------------+----------------------+----------------------------------------------+
| non-lazy             | ``true``             | stored value                                 |
+----------------------+----------------------+----------------------------------------------+
| lazy                 | ``false``            | default value (lazy key is not searched)     |
+----------------------+----------------------+----------------------------------------------+
| lazy                 | ``true``             | stored value                                 |
+----------------------+----------------------+----------------------------------------------+

.. warning::
   If a key may be lazy, read it with ``lazy: true`` to avoid silently getting defaults.

.. note::
   Some API methods explicitly ignore lazy filtering and may load all values.
   Check each method description for warnings.

Choosing what should be lazy
""""""""""""""""""""""""""""

Good candidates for ``lazy: true``:

- Large values (for example JSON blobs, long text, large key/value maps).
- Values used only in specific flows (admin pages, background jobs, setup/migration tools).
- Values read infrequently or only after explicit user actions.

Usually keep as non-lazy (``lazy: false``):

- Small, frequently accessed values used on most requests.
- Values needed during app bootstrap, registration, capability wiring, or other early lifecycle code paths.
- Values used in hot paths (middleware, common service constructors, request-critical checks).

Practical rule:

- If a value is needed on most requests, keep it non-lazy.
- If it is large and only needed occasionally, make it lazy.

Consuming the AppConfig API
---------------------------

You can inject either interface, depending on your use case:

- ``\OCP\IAppConfig`` (global API): use when you need to access configuration
  for one or more app IDs explicitly.
- ``\OCP\AppFramework\Services\IAppConfig`` (AppFramework app-scoped API):
  use inside your app when you want methods scoped automatically to your app ID.

See :ref:`dependency-injection` for injection details.

.. important::
   Unless explicitly stated otherwise, examples in this page use the global
   interface ``\OCP\IAppConfig`` (app ID passed explicitly).

   If you inject ``\OCP\AppFramework\Services\IAppConfig``, methods are app-scoped
   and you do not pass the app ID.


Storing a config value
^^^^^^^^^^^^^^^^^^^^^^

The API provides typed methods to store configuration values.

Common arguments are:

- app ID (``string``),
- config key (``string``),
- config value (typed),
- lazy flag (``bool``),
- sensitive flag (``bool``, where supported).

The return value is ``true`` if a database update was required.

- ``setValueString(string $app, string $key, string $value, bool $lazy = false, bool $sensitive = false)``
- ``setValueInt(string $app, string $key, int $value, bool $lazy = false, bool $sensitive = false)``
- ``setValueFloat(string $app, string $key, float $value, bool $lazy = false, bool $sensitive = false)``
- ``setValueBool(string $app, string $key, bool $value, bool $lazy = false)``
- ``setValueArray(string $app, string $key, array $value, bool $lazy = false, bool $sensitive = false)``

AppFramework equivalents (app-scoped, no ``$app`` argument):

.. code-block:: php

    $appConfig->setAppValueString('mykey', 'myvalue', lazy: true);
    $appConfig->setAppValueInt('retry_count', 3);
    $appConfig->setAppValueArray('options', ['a' => true], sensitive: true);


Retrieving a config value
^^^^^^^^^^^^^^^^^^^^^^^^^

Configuration values can be retrieved using typed getters:

- ``getValueString(string $app, string $key, string $default = '', bool $lazy = false)``
- ``getValueInt(string $app, string $key, int $default = 0, bool $lazy = false)``
- ``getValueFloat(string $app, string $key, float $default = 0.0, bool $lazy = false)``
- ``getValueBool(string $app, string $key, bool $default = false, bool $lazy = false)``
- ``getValueArray(string $app, string $key, array $default = [], bool $lazy = false)``

AppFramework equivalents (app-scoped, no ``$app`` argument):

.. code-block:: php

    $name = $appConfig->getAppValueString('display_name', 'default');
    $count = $appConfig->getAppValueInt('retry_count', 0);
    $enabled = $appConfig->getAppValueBool('enabled', false, lazy: true);


Managing config keys
^^^^^^^^^^^^^^^^^^^^

- ``getApps()`` returns app IDs that have stored configuration values.
- ``getKeys(string $app)`` returns stored keys for an app.
- ``searchKeys(string $app, string $prefix = '', bool $lazy = false)`` returns keys for an app matching a prefix.
- ``hasKey(string $app, string $key, ?bool $lazy = false)`` returns ``true`` if the key exists.
- ``isSensitive(string $app, string $key, ?bool $lazy = false)`` returns ``true`` if the value is sensitive.
- ``isLazy(string $app, string $key)`` returns ``true`` if the value is lazy.
- ``updateSensitive(string $app, string $key, bool $sensitive)`` updates sensitive status.
- ``updateLazy(string $app, string $key, bool $lazy)`` updates lazy status.
- ``getValueType(string $app, string $key)`` returns the type bitflag for a value.
- ``deleteKey(string $app, string $key)`` deletes one key and its value.
- ``deleteApp(string $app)`` deletes all keys for one app.

AppFramework equivalents include:

- ``getAppKeys()``
- ``hasAppKey(string $key, ?bool $lazy = false)``
- ``isSensitive(string $key, ?bool $lazy = false)``
- ``isLazy(string $key)``

.. note::
   Methods with ``?bool $lazy`` can use ``null`` to search both lazy and non-lazy values.


Miscellaneous
^^^^^^^^^^^^^

The API also provides additional helpers:

- ``getAllValues(string $app, string $prefix = '', bool $filtered = false)``
  returns stored values for an app. If ``$filtered`` is ``true``, sensitive values are hidden.
- ``searchValues(string $key, bool $lazy = false)``
  searches apps/values containing the specified key.
- ``getDetails(string $app, string $key)``
  returns metadata/details about a key.
- ``convertTypeToInt(string $type)``
  converts a human-readable type to a type bitflag.
- ``convertTypeToString(int $type)``
  converts a type bitflag to a human-readable type.
- ``clearCache(bool $reload = false)``
  clears internal cache.

AppFramework helper equivalent:

- ``getAllAppValues(string $key = '', bool $filtered = false)``


Constants and flags
^^^^^^^^^^^^^^^^^^^

``\OCP\IAppConfig`` exposes value-type constants and flags, including:

- ``FLAG_SENSITIVE`` (since 31),
- ``FLAG_INTERNAL`` (since 33; marks values as internal and eligible to be hidden from listings).
