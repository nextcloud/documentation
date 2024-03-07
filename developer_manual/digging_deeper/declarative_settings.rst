.. _declarative_settings_section:

====================
Declarative settings
====================

.. sectionauthor:: Andrey Borysenko <andrey18106x@gmail.com>

.. versionadded:: 29.0.0

With Nextcloud 29 there is a new way to define app settings in a declarative way.
This means that you can just register your settings schema 
without writing a custom settings handling front-end and back-end code 
(except when more complex settings logic or design is required).

Registering settings schema
^^^^^^^^^^^^^^^^^^^^^^^^^^^

There are two ways to register a declarative settings schema:

1. Class-based using ``OCP\Settings\IDeclarativeSettingsForm`` interface
2. By using an event listener for the ``OCP\Settings\Events\DeclarativeSettingsRegisterFormEvent``

Additionally, you can register multiple declarative parameter schemes per application.

.. note::

	Form fields ids (configkeys) must be unique within an app.

Class-based schema registration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To register a declarative settings schema using a class, you need to create a class that implements the ``OCP\Settings\IDeclarativeSettingsForm`` interface:

.. code-block:: php
	:emphasize-lines: 8,11

	<?php

	declare(strict_types=1);

	namespace OCA\MyApp\DeclarativeSettings;

	use OCP\Settings\DeclarativeSettingsTypes;
	use OCP\Settings\IDeclarativeSettingsForm;

	class MyDeclarativeSettingsForm implements IDeclarativeSettingsForm {
		public function getSchema(): array {
			return [
				'id' => 'my_declarative_settings_form', // unique form id
				'priority' => 10, // declarative section priority (ordering)
				'section_type' => DeclarativeSettingsTypes::SECTION_TYPE_ADMIN, // admin, personal
				'section_id' => 'my_section_id', // existing section id or your custom section id
				'storage_type' => DeclarativeSettingsTypes::STORAGE_TYPE_INTERNAL, // external, internal (handled by core to store in appconfig and preferences)
				'title' => 'MyApp settings title', // NcSettingsSection name
				'description' => 'My app settings section description', // NcSettingsSection description
				'doc_url' => '', // NcSettingsSection doc_url for documentation or help page, empty string if not needed
				'fields' => [
					[
						'id' => 'my_field_key', // configkey
						'title' => 'Field title', // name or label
						'description' => 'Additional setting hint or description', // hint
						'type' => DeclarativeSettingsTypes::MULTI_SELECT,
						'options' => ['foo', 'bar', 'baz'],
						'placeholder' => 'Select some multiple options', // input placeholder
						'default' => ['foo', 'bar'],
					],
				]
			];
		}
	}

The ``OCP\Settings\IDeclarativeSettingsForm`` interface has only one method ``getSchema`` that should return an array with the settings schema.


After that, you can register schema class using ``IRegistrationContext->registerDeclarativeSettings`` method:

.. code-block:: php
	:emphasize-lines: 9,17

	<?php

	declare(strict_types=1);

	namespace OCA\MyApp\AppInfo;

	use OCP\AppFramework\App;
	use OCP\AppFramework\Bootstrap\IRegistrationContext;
	use OCA\MyApp\DeclarativeSettings\MyDeclarativeSettingsForm;

	class Application extends App {
		public function __construct(array $urlParams = []) {
			parent::__construct('my_app', $urlParams);
		}

		public function register(IRegistrationContext $context): void {
			$context->registerDeclarativeSettings(MyDeclarativeSettingsForm::class);
		}
	}


Event-based schema registration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To register a declarative settings schema using an event system you need to implement event listener for ``OCP\Settings\Events\DeclarativeSettingsRegisterFormEvent``:

.. code-block:: php

	<?php

	declare(strict_types=1);

	namespace OCA\MyApp\Listener;

	use OCP\EventDispatcher\Event;
	use OCP\EventDispatcher\IEventListener;
	use OCP\Settings\DeclarativeSettingsTypes;
	use OCP\Settings\Events\DeclarativeSettingsRegisterFormEvent;

	class RegisterDeclarativeSettingsListener implements IEventListener {

		public function __construct() {
		}

		public function handle(Event $event): void {
			if (!($event instanceof DeclarativeSettingsRegisterFormEvent)) {
				return;
			}

			$event->registerSchema('my_app', [
				// your declarative settings schema here
			]);
		}
	}


And register the event listener as usually in your ``AppInfo/Application.php`` registration context:

.. code-block:: php
	:emphasize-lines: 9,10,18

	<?php

	declare(strict_types=1);

	namespace OCA\MyApp\AppInfo;

	use OCP\AppFramework\App;
	use OCP\AppFramework\Bootstrap\IRegistrationContext;
	use OCP\Settings\Events\DeclarativeSettingsRegisterFormEvent;
	use OCA\MyApp\Listener\RegisterDeclarativeSettingsListener;

	class Application extends App {
		public function __construct(array $urlParams = []) {
			parent::__construct('my_app', $urlParams);
		}

		public function register(IRegistrationContext $context): void {
			$context->registerEventListener(DeclarativeSettingsRegisterFormEvent::class, RegisterDeclarativeSettingsListener::class);
		}
	}


Handling settings storage
^^^^^^^^^^^^^^^^^^^^^^^^^

There are two types of schema ``storage_type`` supported:

1. internal ``OCP\Settings\DeclarativeSettingsTypes::STORAGE_TYPE_INTERNAL`` - settings values changes handled by core
1. external ``OCP\Settings\DeclarativeSettingsTypes::STORAGE_TYPE_EXTERNAL`` - settings values changes handled by your app handlers (event listeners).

Internal storage type
---------------------

Internal (``storage_type='internal'``) storage type is handled by core, you don't have to implement additional handlers for that.

Section type admin
******************

For declarative settings schema with ``section_type`` set to ``DeclarativeSettingsTypes::SECTION_TYPE_ADMIN`` - settings values 
are stored in ``appconfig`` table.

Accessible via ``OCP\IConfig->getAppValue`` interface.

Section type personal
*********************

For declarative settings schema with ``section_type`` set to ``DeclarativeSettingsTypes::SECTION_TYPE_PERSONAL`` - settings values 
are user specific and stored in ``preferences`` table.

Accessible via ``OCP\IConfig->getUserValue`` interface.

External storage type
---------------------

Handling of an external (``storage_type='external'``) storage type is always done via listening to the following events:

1. ``OCP\Settings\Events\DeclarativeSettingsGetValueEvent`` - to return the declarative setting value from your storage
2. ``OCP\Settings\Events\DeclarativeSettingsSetValueEvent`` - to save the declarative setting value where you want to

Example of DeclarativeSettingsGetValueEvent event listener:

.. code-block:: php
	:emphasize-lines: 27,28

	<?php

	declare(strict_types=1);

	namespace OCA\MyApp\Listener;

	use OCP\EventDispatcher\Event;
	use OCP\EventDispatcher\IEventListener;
	use OCP\IConfig;
	use OCP\Settings\Events\DeclarativeSettingsGetValueEvent;

	class GetDeclarativeSettingsValueListener implements IEventListener {

		public function __construct(private IConfig $config) {
		}

		public function handle(Event $event): void {
			if (!$event instanceof DeclarativeSettingsGetValueEvent) {
				return;
			}

			// Always check if the event is related to your app declarative settings
			if ($event->getApp() !== 'my_app') {
				return;
			}

			$value = $this->config->getUserValue($event->getUser()->getUID(), $event->getApp(), $event->getFieldId());
			$event->setValue($value);
		}
	}

Example of DeclarativeSettingsSetValueEvent event listener:

.. code-block:: php
	:emphasize-lines: 27

	<?php

	declare(strict_types=1);

	namespace OCA\MyApp\Listener;

	use OCP\EventDispatcher\Event;
	use OCP\EventDispatcher\IEventListener;
	use OCP\IConfig;
	use OCP\Settings\Events\DeclarativeSettingsSetValueEvent;

	class SetDeclarativeSettingsValueListener implements IEventListener {

		public function __construct(private IConfig $config) {
		}

		public function handle(Event $event): void {
			if (!$event instanceof DeclarativeSettingsSetValueEvent) {
				return;
			}

			// Always check if the event is related to your app declarative settings
			if ($event->getApp() !== 'my_app') {
				return;
			}

			$this->config->setUserValue($event->getUser()->getUID(), $event->getApp(), $event->getFieldId(), $event->getValue());
		}
	}

Register get/set listeners
--------------------------

.. code-block:: php
	:emphasize-lines: 9,10,11,12,20,21

	<?php

	declare(strict_types=1);

	namespace OCA\MyApp\AppInfo;

	use OCP\AppFramework\App;
	use OCP\AppFramework\Bootstrap\IRegistrationContext;
	use OCP\Settings\Events\DeclarativeSettingsGetValueEvent;
	use OCP\Settings\Events\DeclarativeSettingsSetValueEvent;
	use OCA\MyApp\Listener\GetDeclarativeSettingsValueListener;
	use OCA\MyApp\Listener\SetDeclarativeSettingsValueListener;

	class Application extends App {
		public function __construct(array $urlParams = []) {
			parent::__construct('my_app', $urlParams);
		}

		public function register(IRegistrationContext $context): void {
			$context->registerEventListener(DeclarativeSettingsGetValueEvent::class, GetDeclarativeSettingsValueListener::class);
			$context->registerEventListener(DeclarativeSettingsSetValueEvent::class, SetDeclarativeSettingsValueListener::class);
		}
	}



Schema field types
^^^^^^^^^^^^^^^^^^

Supported field types are declared in  ``OCP\Settings\DeclarativeSettingsTypes`` class:

- ``DeclarativeSettingsTypes::TEXT`` - input type text
- ``DeclarativeSettingsTypes::PASSWORD``- input type password
- ``DeclarativeSettingsTypes::EMAIL`` - input type email
- ``DeclarativeSettingsTypes::TEL`` - input type tel
- ``DeclarativeSettingsTypes::URL`` - input type url
- ``DeclarativeSettingsTypes::NUMBER`` - input type number
- ``DeclarativeSettingsTypes::CHECKBOX`` - input type checkbox
- ``DeclarativeSettingsTypes::MULTI_CHECKBOX`` - multiple checkboxes representing one setting with multiple options
- ``DeclarativeSettingsTypes::RADIO`` - input type radio for setting with single option
- ``DeclarativeSettingsTypes::SELECT`` - input type select for setting with single option
- ``DeclarativeSettingsTypes::MULTI_SELECT`` - input type select for setting with multiple options

The examples of each field type are listed below.

.. note::

	Field order is the same as in the schema array.


Basic input types
-----------------

For text, password, email, tel, url, number schema is similar:

.. figure:: ../images/declarative_settings_input_fields.png
	:alt: Declarative settings input fields (text, password, email, tel, url, number)

.. code-block:: php

	[
		'id' => 'my_field_unique_id', // configkey
		'title' => 'Default text field', // label
		'description' => 'Set some simple text setting', // hint
		'type' => DeclarativeSettingsTypes::TEXT, // text, password, email, tel, url, number
		'placeholder' => 'Enter text setting', // placeholder
		'default' => 'foo',
	],

Checkbox and Multi-checkbox
---------------------------

.. figure:: ../images/declarative_settings_checkboxes.png
	:alt: checkbox and multi-checkbox field types

.. code-block:: php

	[
		'id' => 'my_checkbox_field',
		'title' => 'Toggle something',
		'description' => 'Select checkbox option setting',
		'type' => DeclarativeSettingsTypes::CHECKBOX, // checkbox, multiple-checkbox
		'label' => 'Verify something if enabled',
		'default' => false,
	],
	[
		'id' => 'my_multicheckbox_field',
		'title' => 'Multiple checkbox toggles, describing one setting, checked options are saved as an JSON object {foo: true, bar: false}',
		'description' => 'Select checkbox option setting',
		'type' => DeclarativeSettingsTypes::MULTI_CHECKBOX, // checkbox, multi-checkbox
		'default' => ['foo' => true, 'bar' => true, 'baz' => true],
		'options' => [
			[
				'name' => 'Foo',
				'value' => 'foo', // multiple-checkbox configkey
			],
			[
				'name' => 'Bar',
				'value' => 'bar',
			],
			[
				'name' => 'Baz',
				'value' => 'baz',
			],
			[
				'name' => 'Qux',
				'value' => 'qux',
			],
		],
	],

Radio
-----

.. figure:: ../images/declarative_settings_radio.png
	:alt: radio field type

.. code-block:: php

	[
		'id' => 'my_radio_field',
		'title' => 'Radio toggles, describing one setting like single select',
		'description' => 'Select radio option setting',
		'type' => DeclarativeSettingsTypes::RADIO, // radio (NcCheckboxRadioSwitch type radio)
		'label' => 'Select single toggle',
		'default' => 'foo',
		'options' => [
			[
				'name' => 'First radio', // NcCheckboxRadioSwitch display name
				'value' => 'foo' // NcCheckboxRadioSwitch value
			],
			[
				'name' => 'Second radio',
				'value' => 'bar'
			],
			[
				'name' => 'Third radio',
				'value' => 'baz'
			],
		],
	],

Select and Multi-select
-----------------------

.. figure:: ../images/declarative_settings_select.png
	:alt: select field type

.. code-block:: php

	[
		'id' => 'my_select_field',
		'title' => 'Selection',
		'description' => 'Select some option setting',
		'type' => DeclarativeSettingsTypes::SELECT, // select, radio, multi-select
		'options' => ['foo', 'bar', 'baz'],
		'placeholder' => 'Select some option setting',
		'default' => 'foo',
	],

.. figure:: ../images/declarative_settings_multi_select.png
	:alt: multi-select field type

.. code-block:: php

	[
		'id' => 'my_multi_select_field', // configkey
		'title' => 'Multi-selection', // name or label
		'description' => 'Select some option setting', // hint
		'type' => DeclarativeSettingsTypes::MULTI_SELECT, // select, radio, multi-select
		'options' => ['foo', 'bar', 'baz'], // simple options for select, radio, multi-select
		'placeholder' => 'Select some multiple options', // input placeholder
		'default' => ['foo', 'bar'],
	],