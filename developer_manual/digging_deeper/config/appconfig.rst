=========
AppConfig
=========

.. versionadded:: 29

Since v29, Nextcloud includes a new API to manage your app configuration.


Concept overview
----------------

Nextcloud includes an API to store and access your app configuration values.
On top of storing and accessing your configuration values, ``IAppConfig`` comes with different concepts:

.. _appconfig_concepts:

Typed Config Values
^^^^^^^^^^^^^^^^^^^

To ensure better stability of your code, config values are typed enforced.
Type is set only once, at creation in database, and cannot be changed.

.. note::
	- Value stored before Nextcloud 29 are automatically typed as `mixed`. However, it is not possible to manually set a value as `mixed`.
	- Value not set as `mixed` must be retrieved using the corresponding method.

Values Sensitivity
^^^^^^^^^^^^^^^^^^

When storing a new config value, it can be set as `sensitive`.
Configuration values set as `sensitive` are hidden from system reports and stored encrypted in the database.

.. code-block:: php

	setValueString(
		'myapp',
		'mykey',
		'myvalue',
		sensitive: true
	);

.. note::
	Once set as `sensitive`, it can only be reverted using ``updateSensitive()``


Lazy Loading
^^^^^^^^^^^^

To lighten the loading of all apps configuration at load, you have the possibility to set config values as `lazy`.
All `lazy` configuration values are loaded from the database once one is read.

.. code-block:: php

	setValueString(
		'myapp',
		'mykey',
		'myvalue',
		lazy: true
	);

.. note::
	- Flag as `lazy` as much 'large block of text' entries (json, key pairs, ...) as possible,
	- flag as `lazy` entries that are needed on quiet endpoints,
	- do **not** flag as `lazy` part of code that might be called during the global loading of the instance and its apps.


Retrieving the configuration value will require to specify the fact that it is stored as `lazy`.

.. code-block:: php

	getValueString(
		'myapp',
		'mykey',
		'default',
		lazy: true
	);

.. note::
	- Requesting with ``1azy: false`` will returns the default value if configuration value is stored as `lazy`.
	- Requesting with ``lazy: true`` will returns the correct value even if configuration value is stored as `non-lazy (as there is a huge probability that the `non-lazy` value are already loaded)

Consuming the AppConfig API
---------------------------

To consume the API, you first need to :ref:`inject<dependency-injection>` ``\OCP\IAppConfig``


Storing a config value
^^^^^^^^^^^^^^^^^^^^^^

API provide multiple methods to store a config value, based on its type.
The global behavior for each of those methods is to call them using:

- app id (string),
- config key (string),
- config value,
- lazy flag (boolean),
- sensitivity flag (boolean)

The returned boolean will be true if an update of the database were needed.

 * ``setValueString(string $app, string $key, string $value, bool $lazy, bool $sensitive)``
 * ``setValueInt(string $app, string $key, int $value, bool $lazy, bool $sensitive)``
 * ``setValueFloat(string $app, string $key, float $value, bool $lazy, bool $sensitive)``
 * ``setValueBool(string $app, string $key, bool $value, bool $lazy)``
 * ``setValueArray(string $app, string $key, array $value, bool $lazy, bool $sensitive)``


Retrieving a config value
^^^^^^^^^^^^^^^^^^^^^^^^^

Configuration values are to be retrieved using one of the return typed method from the list:

 * ``getValueString(string $app, string $key, string $default, bool $lazy)``
 * ``getValueInt(string $app, string $key, int $default, bool $lazy)``
 * ``getValueFloat(string $app, string $key, float $default, bool $lazy)``
 * ``getValueBool(string $app, string $key, bool $default, bool $lazy)``
 * ``getValueArray(string $app, string $key, array $default, bool $lazy)``


Managing config keys
^^^^^^^^^^^^^^^^^^^^

 * ``getApps()`` returns list of ids of apps with stored configuration values
 * ``getKeys(string $app)`` returns list of stored configuration keys for an app by its id
 * ``hasKey(string $app, string $key, ?bool $lazy)`` returns TRUE if key can be found
 * ``isSensitive(string $app, string $key, ?bool $lazy)`` returns TRUE if value is set as `sensitive`
 * ``isLazy(string $app, string $key)`` returns TRUE if value is set as `lazy`
 * ``updateSensitive(string $app, string $key, bool $sensitive)`` update `sensitive` status of a configuration value
 * ``updateLazy(string $app, string $key, bool $lazy)`` update `lazy` status of a configuration value
 * ``getValueType(string $app, string $key)`` returns bitflag defining the type of a configuration value
 * ``deleteKey(string $app, string $key)`` delete a config key and its value
 * ``deleteApp(string $app)`` delete all config keys from an app (using app id)

.. note::
	Some method allows ``$lazy`` to be ``null``, meaning that the search will be extended to all configuration values, `lazy` or not.

Miscellaneous
^^^^^^^^^^^^^

API also provide extra tools for broaded uses

 * ``getAllValues(string $app, string $prefix, bool $filtered)`` returns all stored configuration values. ``$filtered`` can be set to TRUE to hide _sensitive_ values in the returned array
 * ``searchValues(string $key, bool $lazy)`` search for apps and values that have a stored value for the specified configuration key.
 * ``getDetails(string $app, string $key)`` get all details about a configuration key.
 * ``convertTypeToInt(string $type)`` convert human readable string to the bitflag defining the type of a value
 * ``convertTypeToString(int $type)`` convert bitflag defining the type of a value to human readable string
 * ``clearCache(bool $reload)`` clear internal cache



