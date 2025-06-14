=======
Lexicon
=======

.. versionadded:: 31

Since v31, Nextcloud provides a way to centralize the definition of your app's configuration keys and values in a single place.


Concept overview
----------------

Nextcloud includes the ``IConfigLexicon`` API to create a **Lexicon** of your config keys.
This lexicon allow to define all the config keys used by your app, their value type and additional details.

.. _lexicon_concepts:

Enforcing a unique configuration for each of your config keys in a single location help avoid their misuse.

Details about each config key are:
    - config value expected type,
    - a default value,
    - a description of its use,
    - lazy loading setting,
    - flags the config key as sensitive or indexable


Registering your Lexicon
^^^^^^^^^^^^^^^^^^^^^^^^

The Lexicon is set in a local class that implements `IconfigLexicon` and registered from your ``Application.php``:

.. code-block:: php

	public function register(IRegistrationContext $context): void {
		$context->registerConfigLexicon(\OCA\MyApp\ConfigLexicon::class);
	}

Example of the registered ``ConfigLexicon.php``:

.. code-block:: php

	class Lexicon implements IConfigLexicon {
		public function getStrictness(): ConfigLexiconStrictness {
			return ConfigLexiconStrictness::WARNING;
		}

		public function getAppConfigs(): array {
			return [
				new ConfigLexiconEntry('key1', ValueType::STRING, 'abcde', 'test key', true, IAppConfig::FLAG_SENSITIVE),
				new ConfigLexiconEntry('key2', ValueType::INT, 12345, 'test key', false)
			];
		}

		public function getUserConfigs(): array {
			return [
				new ConfigLexiconEntry('key1', ValueType::STRING, 'abcde', 'test key', true, IUserConfig::FLAG_SENSITIVE),
				new ConfigLexiconEntry('key2', ValueType::INT, 12345, 'test key', false)
			];
		}
	}


Each method ``getUserConfigs()`` and ``getAppConfigs()`` returns a list of ``ConfigLexiconEntry``.

``getStrictness()`` is used to define the expected behavior of the process when reaching a config keys that is not listed in your app's Config Lexicon.
Must returns a value from enum ``\OCP\Config\Lexicon\ConfigLexiconStrictness``.

Available values:
 * ``::IGNORE`` - does not limit the set/get on an unknown config key.
 * ``::NOTICE`` - does not limit the set/get on an unknown config key, but generate a notice in the logs.
 * ``::WARNING`` - unknown config key will not be set, and get will returns the default value. A warning will be issued in the logs.
 * ``::EXCEPTION`` - set/get on an unknown config key will generate an exception.


ConfigLexiconEntry
^^^^^^^^^^^^^^^^^^

.. code-block:: php

	new ``ConfigLexiconEntry``(
		'my_config_key',
		\OCP\Config\ValueType::STRING,
		'default value',
		'this is a description of the use for this config key',
		lazy: true,
		flags: FLAG_SENSITIVE
	);

Each config key is defined in a object through those arguments:

 * ``key``: config key
 * ``type``: expected value type when the code set/get the config key's value
 * ``defaultRaw``: value to returns if a config value is not available in the database
 * ``description``: textual description of the use made from the config value,
 * ``lazy``: config value is stored as Lazy
 * ``flags``: value is sensitive and/or indexable, using ``IAppConfig::FLAG_SENSITIVE``, ``IUserConfig::FLAG_SENSITIVE``, ``IUserConfig::FLAG_INDEXED``,
 * ``deprecated``: if set to ``true`` will generate a notice entry in the nextcloud logs when called


.. note:: Unless if set to ``null``, the default value set in the config lexicon overwrite the default value used as argument when calling ``getValueString('my_config_key', 'another default value');``



./occ config:app:get --details
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Details from the Lexicon can be extracted using the ``occ`` command

::

	$ ./occ config:app:get myapp my_config_key --details
	  - app: myapp
	  - key: my_config_key
	  - value: 'a_value'
	  - type: string
	  - lazy: true
      - description:
	  - sensitive: false

