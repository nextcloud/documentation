.. _exapp_declarative_settings_section:

====================
Declarative Settings
====================

Starting from Nextcloud **29**, AppAPI provides the ability to display ExApp settings.
When an admin or user changes some ExApp settings,
they will be stored in the database and can be retrieved using :doc:`preferences` or :doc:`appconfig` API.

.. note::

	These settings are rendered only for enabled ExApps.

.. warning::

	``section_id`` from **scheme** should be already registered by any PHP application.

	**AppAPI** provides two sections which you can use for that: ``ai_integration_team`` and ``declarative_settings``.

Register Settings
^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/ui/settings``

Params
******

Complete list of params (including optional):

.. code-block:: json

	{
		"formScheme": "settings scheme"
	}

Unregister Menu Entry
^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ui/settings``

Params
******

.. code-block:: json

	{
		"formId": "formId from scheme"
	}

Example of settings scheme in Python:

.. code-block:: python

	{
		"id": "settings_example",
		"priority": 10,
		"section_type": "admin",
		"section_id": "ai_integration_team",
		"title": "AppAPI declarative settings",
		"description": "These fields are rendered dynamically from declarative schema",
		"fields": [
			{
				"id": "field1",
				"title": "Multi-selection",
				"description": "Select some option setting",
				"type": 'multi-select',
				"options": ["foo", "bar", "baz"],
				"placeholder": "Select some multiple options",
				"default": ["foo", "bar"],
			},
			{
				"id": "some_real_setting",
				'title': 'Choose init status check background job interval',
				'description': 'How often AppAPI should check for initialization status',
				'type': 'radio',
				'placeholder': 'Choose init status check background job interval',
				'default': '40m',
				'options': [
					{
						'name': 'Each 40 minutes',
						'value': '40m',
					},
					{
						'name': 'Each 60 minutes',
						'value': '60m',
					},
					{
						'name': 'Each 120 minutes',
						'value': '120m',
					},
					{
						'name': 'Each day',
						'value': f"{60 * 24}m",
					},
				],
			},
			{
				'id': 'test_ex_app_field_1',
				'title': 'Default text field',
				'description': 'Set some simple text setting',
				'type': 'text',
				'placeholder': 'Enter text setting',
				'default': 'foo',
			},
			{
				'id': 'test_ex_app_field_1_1',
				'title': 'Email field',
				'description': 'Set email config',
				'type': 'email',
				'placeholder': 'Enter email',
				'default': '',
			},
			{
				'id': 'test_ex_app_field_1_2',
				'title': 'Tel field',
				'description': 'Set tel config',
				'type': 'tel',
				'placeholder': 'Enter your tel',
				'default': '',
			},
			{
				'id': 'test_ex_app_field_1_3',
				'title': 'Url (website) field',
				'description': 'Set url config',
				'type': url',
				'placeholder': 'Enter url',
				'default': '',
			},
			{
				'id': 'test_ex_app_field_1_4',
				'title': 'Number field',
				'description': 'Set number config',
				'type': 'number',
				'placeholder': 'Enter number value',
				'default': 0,
			},
			{
				'id': 'test_ex_app_field_2',
				'title': 'Password',
				'description': 'Set some secure value setting',
				'type': password',
				'placeholder': 'Set secure value',
				'default': '',
			},
			{
				'id': 'test_ex_app_field_3',
				'title': 'Selection',
				'description': 'Select some option setting',
				'type': 'select',
				'options': ['foo', 'bar', 'baz'],
				'placeholder': 'Select some option setting',
				'default': 'foo',
			},
			{
				'id': 'test_ex_app_field_4',
				'title': 'Toggle something',
				'description': 'Select checkbox option setting',
				'type': 'checkbox',
				'label': 'Verify something if enabled',
				'default': False,
			},
			{
				'id': 'test_ex_app_field_5',
				'title': 'Multiple checkbox toggles, describing one setting, checked options are saved as a JSON object {foo: true, bar: false}',
				'description': 'Select checkbox option setting',
				'type': 'multi-checkbox',
				'default': {'foo': True, 'bar': True},
				'options': [
					{
						'name':'Foo',
						'value': 'foo',
					},
					{
						'name': 'Bar',
						'value': 'bar',
					},
					{
						'name': 'Baz',
						'value': 'baz',
					},
					{
						'name': 'Qux',
						'value': 'qux',
					},
				],
			},
			{
				'id': 'test_ex_app_field_6',
				'title': 'Radio toggles, describing one setting like single select',
				'description': 'Select radio option setting',
				'type': 'radio',
				'label': 'Select single toggle',
				'default': 'foo',
				'options': [
					{
						'name': 'First radio',
						'value': 'foo'
					},
					{
						'name': 'Second radio',
						'value': 'bar'
					},
					{
						'name': 'Second radio',
						'value': 'baz'
					},
				],
			},
		]
	}
