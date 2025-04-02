=======
Lexicon
=======

.. versionadded:: 31

Since v31, Nextcloud provides a way to centralize the definition of your app's configuration keys and values in a single place.


Concept overview
----------------

Nextcloud includes the ``IConfigLexicon`` API to create a **Lexicon** of your config keys. This lexicon list config keys, their type and additional details.



Registering your Lexicon
^^^^^^^^^^^^^^^^^^^^^^^^

From your ``Application.php``:

.. code-block:: php

	public function register(IRegistrationContext $context): void {
		$context->registerConfigLexicon(\OCA\MyApp\ConfigLexicon::class);
	}

Then, the ``ConfigLexicon.php``:

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






