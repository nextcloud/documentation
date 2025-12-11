=======
Lexicon
=======

.. versionadded:: 32

Since v32, Nextcloud provides a way to centralize the definition of your app's configuration keys and values in a single place.


Concept overview
----------------

Nextcloud includes the ``ILexicon`` API to create a **Lexicon** of your config keys.
This lexicon allow developers to define the config keys of their apps, their value type and additional details.

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

The Lexicon is set in a local class that implements `\OCP\Config\Lexicon\ILexicon` and registered from your ``Application.php``:

.. code-block:: php

	public function register(IRegistrationContext $context): void {
		$context->registerConfigLexicon(\OCA\MyApp\ConfigLexicon::class);
	}

Example of the registered ``ConfigLexicon.php``:

.. code-block:: php

	use OCP\Config\Lexicon\Entry;
	use OCP\Config\Lexicon\ILexicon;
	use OCP\Config\Lexicon\Strictness;
	use OCP\Config\ValueType;

	class Lexicon implements ILexicon {
		public function getStrictness(): Strictness {
			return Strictness::WARNING;
		}

		public function getAppConfigs(): array {
			return [
				new Entry('key1', ValueType::STRING, 'abcde', 'test key', true, IAppConfig::FLAG_SENSITIVE),
				new Entry('key2', ValueType::INT, 12345, 'test key', false)
			];
		}

		public function getUserConfigs(): array {
			return [
				new Entry('key1', ValueType::STRING, 'abcde', 'test key', true, IUserConfig::FLAG_SENSITIVE),
				new Entry('key2', ValueType::INT, 12345, 'test key', false)
			];
		}
	}


Each method ``getUserConfigs()`` and ``getAppConfigs()`` returns a list of ``\OCP\Config\Lexicon\Entry``.

``getStrictness()`` is used to define the expected behavior of the process when reaching a config keys that is not listed in your app's Config Lexicon.
Must returns a value from enum ``\OCP\Config\Lexicon\Strictness``.

Available values:
 * ``::IGNORE`` - does not limit the set/get on an unknown config key.
 * ``::NOTICE`` - does not limit the set/get on an unknown config key, but generate a notice in the logs.
 * ``::WARNING`` - unknown config key will not be set, and get will returns the default value. A warning will be issued in the logs.
 * ``::EXCEPTION`` - set/get on an unknown config key will generate an exception.


Config Lexicon Entry
^^^^^^^^^^^^^^^^^^^^

Each config key is defined in a object through those arguments:

.. code-block:: php

	new Entry(
		key: 'my_config_key',        // config key
		type: ValueType::STRING,     // expected value type when the code set/get value
		defaultRaw: 'default value', // value to returns if a config value is not available in the database
		definition: 'this is a description of the use for this config key',
		lazy: true,                  // config value is stored as lazy
		flags: FLAG_SENSITIVE,       // value is sensitive and/or indexable, using IAppConfig::FLAG_*, IUserConfig::FLAG_*
		deprecated: false,           // if set to ``true`` will generate a notice entry in the nextcloud logs when called
	);

.. note:: Unless if set to ``null``, the default value set in the config lexicon overwrite the default value used as argument when calling ``getValueString('my_config_key', 'another default value');``

Preset
^^^^^^

With 32, Nextcloud comes with a list of `preset` to ease the default user experience, based on the context of the instance.
The selection of a preset is optional and can be done right after the setup of Nextcloud, and any time in the future using this occ command:

.. code-block:: bash

	$ ./occ config:preset
	current preset: NONE
	$ ./occ config:preset PRIVATE
	current preset: PRIVATE

If you want your app to have a different default value based on the selected Preset, you need to generate a Closure as ``$defaultRaw`` when generating the Lexicon Entry.
The first parameter of the Closure is an Enum ``'\OCP\Config\Lexicon\Preset'`` that define the current Preset:

.. code-block:: php

	new Entry('key3', ValueType::STRING, fn (Preset $p): string => match ($p) {
				Preset::FAMILY => 'family',
				Preset::CLUB, Preset::MEDIUM => 'club+medium',
				default => 'none',
			}),

Available values:
 * ``::LARGE`` - Large size organisation (> 50k accounts)
 * ``::MEDIUM`` - Medium size organisation (> 100 accounts)
 * ``::SMALL`` - Small size organisation (< 100 accounts)
 * ``::SHARED`` - Shared hosting
 * ``::EDUCATION`` - School/University
 * ``::CLUB`` - Club/Association
 * ``::FAMILY`` - Family
 * ``::PRIVATE`` - Private



./occ config:app:get --details
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Details from the Lexicon can be extracted using the ``occ`` command

.. code-block:: bash

	$ ./occ config:app:get myapp my_config_key --details
	  - app: myapp
	  - key: my_config_key
	  - value: 'a_value'
	  - type: string
	  - lazy: true
      - description:
	  - sensitive: false

