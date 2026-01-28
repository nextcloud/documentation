==========
UserConfig
==========

.. versionadded:: 31

Since v31, Nextcloud includes a new API to manage users' preferences.


Concept overview
----------------

Nextcloud includes an API to store and access users configuration values.
On top of storing and accessing your configuration values, ``IUserConfig`` comes with different concepts:

.. _userconfig_concepts:

.. note::
	See `Lexicon Concepts`_ to learn more about **Lexicon**, a way to fully define your configuration keys and avoid conflict when using it in your code.

.. _Lexicon Concepts: https://docs.nextcloud.com/server/latest/developer_manual/digging_deeper/config/lexicon.html#concept-overview


Typed Config Values
^^^^^^^^^^^^^^^^^^^

To ensure better stability of your code, config values are typed enforced.
Type is set only once, at creation in database, and cannot be changed.

.. note::
	- Value stored before Nextcloud 31 are automatically typed as `mixed`. However, it is not possible to manually set a value as `mixed`.
	- Value not set as `mixed` must be retrieved using the corresponding method.

Values Sensitivity
^^^^^^^^^^^^^^^^^^

When storing a new config value, it can be set as `sensitive`.
Configuration values set as `sensitive` are hidden from system reports and stored encrypted in the database.

.. code-block:: php

	setValueString(
        'user',
		'myapp',
		'mykey',
		'myvalue',
		flags: IUserConfig::FLAG_SENSITIVE
	);

.. note::
	Once set as `sensitive`, it can only be reverted using ``updateSensitive()``/``updateGlobalSensitive()``

Indexed values
^^^^^^^^^^^^^^

If a search on config value is expected, it can be set as `indexed`.

.. code-block:: php

	setValueString(
        'user',
		'myapp',
		'mykey',
		'myvalue',
		flags: IUserConfig::FLAG_INDEXED
	);

.. note::
    Configuration values set as `indexed` are stored in an indexed field in the database with a limited length of 64 characters.


Lazy Loading
^^^^^^^^^^^^

To lighten the loading of user configuration, you have the possibility to set config values as `lazy`.
All `lazy` configuration values are loaded from the database once one is read.

.. code-block:: php

	setValueString(
		'user',
		'myapp',
		'mykey',
		'myvalue',
		lazy: true
	);

.. note::
	- Flag as `lazy` as much 'large block of text' entries (json, key pairs, ...) as possible,
	- flag as `lazy` entries that are needed on quiet endpoints,
	- do **not** flag as `lazy` part of code that might be called during the global loading of all pages.


Retrieving the configuration value will require to specify the fact that it is stored as `lazy`.

.. code-block:: php

	getValueString(
		'user',
		'myapp',
		'mykey',
		'default',
		lazy: true
	);

Consuming the UserConfig API
----------------------------

To consume the API, you first need to :ref:`inject<dependency-injection>` ``\OCP\IUserConfig``


Storing a config value
^^^^^^^^^^^^^^^^^^^^^^

API provide multiple methods to store a config value, based on its type.
The global behavior for each of those methods is to call them using:

- user id (string)
- app id (string),
- config key (string),
- config value,
- lazy flag (boolean),
- flags (int)

The returned boolean will be true if an update of the database were needed.

 * ``setValueString(string $userId, string $app, string $key, string $value, bool $lazy, int $flags)``
 * ``setValueInt(string $userId, string $app, string $key, int $value, bool $lazy, int $flags)``
 * ``setValueFloat(string $userId, string $app, string $key, float $value, bool $lazy, int $flags)``
 * ``setValueBool(string $userId, string $app, string $key, bool $value, bool $lazy, int $flags)``
 * ``setValueArray(string $userId, string $app, string $key, array $value, bool $lazy, int $flags)``


Retrieving a config value
^^^^^^^^^^^^^^^^^^^^^^^^^

Configuration values are to be retrieved using one of the return typed method from the list:

 * ``getValueString(string $userId, string $app, string $key, string $default, bool $lazy)``
 * ``getValueInt(string $userId, string $app, string $key, int $default, bool $lazy)``
 * ``getValueFloat(string $userId, string $app, string $key, float $default, bool $lazy)``
 * ``getValueBool(string $userId, string $app, string $key, bool $default, bool $lazy)``
 * ``getValueArray(string $userId, string $app, string $key, array $default, bool $lazy)``


Managing config keys
^^^^^^^^^^^^^^^^^^^^

 * ``getUserIds(string $appId)`` returns list of users with stored configuration values for an app
 * ``getApps(string $userId)`` returns list of apps with stored configuration values for a user
 * ``getKeys(string $userId, string $app)`` returns list of stored configuration keys for a user and an app
 * ``hasKey(string $userId, string $app, string $key, ?bool $lazy)`` returns TRUE if key can be found
 * ``isSensitive(string $userId, string $app, string $key, ?bool $lazy)`` returns TRUE if value is set as `sensitive`
 * ``isIndexed(string $userId, string $app, string $key, ?bool $lazy)`` returns TRUE if value is set as `indexed`
 * ``isLazy(string $userId, string $app, string $key)`` returns TRUE if value is set as `lazy`
 * ``updateSensitive(string $userId, string $app, string $key, bool $sensitive)`` update `sensitive` status of a configuration value for a specific user
 * ``updateGlobalSensitive(string $app, string $key, bool $sensitive)`` update `sensitive` status of a configuration value for all users
 * ``updateIndexed(string $userId, string $app, string $key, bool $sensitive)`` update `indexed` status of a configuration value for a specific user
 * ``updateGlobalIndexed(string $app, string $key, bool $sensitive)`` update `indexed` status of a configuration value for all users
 * ``updateLazy(string $userId, string $app, string $key, bool $lazy)`` update `lazy` status of a configuration value for a specific user
 * ``updateGlobalLazy(string $app, string $key, bool $lazy)`` update `lazy` status of a configuration value for all users
 * ``getValueType(string $userId, string $app, string $key, bool $lazy)`` returns bitflag defining the type of a configuration value
 * ``getValueFlags(string $userId, string $app, string $key, bool $lazy)`` returns bitflag defining the flags of a configuration value
 * ``deleteUserConfig(string $userId, string $app, string $key)`` delete a config key and its value for a user
 * ``deleteAllUserConfig(string $userId)`` delete all config values for a single user
 * ``deleteKey(string $app, string $key)`` delete a config key and its value for all users
 * ``deleteKey(string $app, string $key)`` delete a config key and its value for all users
 * ``deleteApp(string $app)`` delete all config keys from an app for all users

.. note::
	Some method allows ``$lazy`` to be ``null``, meaning that the search will be extended to all configuration values, `lazy` or not.

Miscellaneous
^^^^^^^^^^^^^

API also provide extra tools for broaded uses

 * ``getValues(string $userId, string $app, string $prefix, bool $filtered)`` returns all stored configuration values. ``$filtered`` can be set to TRUE to hide _sensitive_ values in the returned array
 * ``getAllValues(string $userId, bool $filtered)`` returns all stored configuration values. ``$filtered`` can be set to TRUE to hide _sensitive_ values in the returned array
 * ``getValuesByApps(string $userId, string $key, bool $lazy, ?ValueType $typedAs)`` returns all stored configuration values per apps, based on a specific config key.
 * ``getValuesByUsers(string $app, string $key, ?ValueType $typedAs, array $userIds)`` returns all stored configuration values per users, based on a specific config key.
 * ``searchUsersByValueString(string $app, string $key, string $value, bool $caseInsensitive)`` returns list of users with a config key set to a specific value.
 * ``searchUsersByValues(string $app, string $key, array $values)`` returns list of users with a config key set to a value from a list.
 * ``searchUsersByValueInt(string $app, string $key, string $value)`` returns list of users with a config key set to a specific value.
 * ``searchUsersByValueBool(string $app, string $key, string $value)`` returns list of users with a config key set to a specific value.
 * ``getDetails(string $userId, string $app, string $key)`` get all details about a configuration key.
 * ``clearCache(string $userId, bool $reload)`` clear internal cache for a specific user
 * ``clearCacheAll()`` clear all internal cache

