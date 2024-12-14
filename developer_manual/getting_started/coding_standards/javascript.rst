=========================
JavaScript and Typescript
=========================

.. contents::
	 :local:

General rules and advices
-------------------------

- Nextcloud uses Vue.js for its interface, for a consistent user interface we recommend apps to also use Vue with :ref:`provided components <js-library_nextcloud-vue>`.
  Yet also vanilla JavaScript and HTML can be used.
- We recommend using Typescript for its type checking and improved static code analysis features.
- Do not create global variables, instead if needed use global namespace objects like ``OCA.YourApp.…``
- Use JavaScript strict mode (automatically the case when using JavaScript modules)

ESLint config
^^^^^^^^^^^^^

There is a shared configuration for `eslint <https://eslint.org/>`_ that you can use to automatically format your Nextcloud apps's JavaScript and Typescript code.
It consists of two parts: a `config package <https://github.com/nextcloud-libraries/eslint-config>`_ that contains the formatting preferences
and a `plugin <https://github.com/nextcloud-libraries/eslint-plugin>`_ to detect deprecated and removed APIs in your code. See their readmes for instructions.

Filesystem structure
^^^^^^^^^^^^^^^^^^^^

For vanilla JavaScript we recommend the following structure:

- ``appid/``: Root of the app
	- ``js/``: JavaScript files
		- ``appid.js``: Your app entry point
	- ``css/``: Location for all CSS files
		- ``appid.css``

When using a bundler to compile Typescript (or JavaScript) we recommend the following structure:

- ``appid/``: Root of the app
	- ``js/``: Compiled JavaScript files
	- ``css/``: Compiled CSS output
	- ``src/``: Root of all source files
		- ``components/``: Location of Vue components
		- ``composables/``: Location of Vue composables
		- ``services/``: Location for service files like API abstractions
		- ``stores/``: Location of Pinia stores
		- ``views/``: Location of views
		- ``main.ts``: Main entry point of your app

Filenames
"""""""""

We do not have strict rules for filenames, either kebab case or camel case will work.

Yet we strongly recommend for Vue apps to follow the Vue recommendations and use the same filename as the component name.
E.g. if your component is called ``AppRoot`` then the file should be called ``AppRoot.vue``.

Code style
----------

General
^^^^^^^

Naming and casing
"""""""""""""""""

- Use **camelCase** for

	- functions
	- methods
	- properties
	- variables

- Use **PascalCase** for

	- classes
	- enums
	- types
	- interfaces
	- Vue components

- For readability only capitalize the first letter of abbreviations like ``callHttpApi()`` instead of ``callHTTPAPI()``.
- Sub-components should be prefixed.
  E.g. splitting a component like ``FileListEntry`` into smaller components called ``FileListEntryName``, ``FileListEntryIcon`` …
- Components should not have single-word names, this could conflict with current or future native HTML tags as these are always single-word.
  E.g. if you have a settings view, do not call it ``Settings`` but ``SettingsView`` or ``UserSettings`` etc.

.. list-table:: Use camelCase for functions, methods, properties, and variables
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const fileId = 123
			const obj = {
				myProperty: false,
			}
			doSomething()

	  -
		.. code-block:: javascript

			const file_id = 123
			const obj = {
				'my-property': false,
			}
			do_something()

.. list-table:: Use PascalCase for classes, interfaces, types and Vue components
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			class MyClass { /* ... */ }
			interface IRequest { /* ... */ }
			type Arguments = string[]

	  -
		.. code-block:: javascript

			class myClass { /* ... */ }
			interface I_request { /* ... */ }
			type arguments = string[]

Indentation
"""""""""""

- Use tabs instead of spaces for indenting - tab width is 4 spaces.

	- You can align e.g. comments using spaces if needed.

Semicolons
""""""""""

.. list-table:: Avoid semicolons where not needed.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const text = 'foo'
			doSomething()

	  -
		.. code-block:: javascript

			const text = 'foo';
			doSomething();

	* -
		.. code-block:: javascript

			const text = 'foo'
			;(someProp as SomeType).handle()

	  -

Strings
^^^^^^^

.. list-table:: Use single quotes.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const text = 'foo'

	  -
		.. code-block:: javascript

			const text = "foo"

.. list-table:: Prefer template literals for readability.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const text = `Hello ${username}!`

	  -
		.. code-block:: javascript

			const text = 'Hello ' + username

Arrays
^^^^^^

.. list-table:: Avoid multiple properties on the same line
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const arr = [
				'first',
				'second',
				'third',
			]

	  -
		.. code-block:: javascript

			const arr = ['first', 'second', 'third']

.. list-table:: Use dangling commas, this reduces the diff when adding new properties.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const arr = [
				'first',
				'second',
				'third',
			]

	  -
		.. code-block:: javascript

			const arr = [
				'first',
				'second',
				'third'
			]
	* -
		.. code-block:: diff

			const arr = [
				'first',
				'second',
			+	'third',
			]

	  -
		.. code-block:: diff

			const arr = [
				'first',
			-	'second'
			+	'second',
			+	'third'
			]

Functions
^^^^^^^^^

- No spaces between function name and parameters.
- Braces on same line as the definition.
- Use consistent new lines in parameters (either all on one line, or one parameter per line).
- For top-level functions, prefer regular functions over arrow functions.
  In Javascript functions defined with the ``function`` keyword will be hoisted, thus can even be used in other functions above their definition.
  Also using the ``function`` keyword makes the definition more explicit for readability.
  For callbacks anonymous arrow functions are often better suited as they do not create their own ``this`` binding.
- Always use parenthesis for arrow functions. This helps for readability and prevents issues if parameters are added.
- When using implicit return values in arrow functions with multi-line body use parenthesis around the body.

.. list-table:: No space between function name and parameters
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			doSomething(1, false)

	  -
		.. code-block:: javascript

			doSomething (1, false)

.. list-table:: Braces on same line as the definition.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			function foo(name: string): boolean {
				// do something
			}

	  -
		.. code-block:: javascript

			function foo(name: string): boolean
			{
				// do something
			}
	* -
		.. code-block:: javascript

			function bar(
				firstName: string,
				lastName: string,
			): boolean {
				// do something
			}

	  -
		.. code-block:: javascript

			function bar(
				firstName: string,
				lastName: string,
			): boolean
			{
				// do something
			}
	* -
		.. code-block:: javascript

			const arrow = (name: string) => {
				// do something
			}

	  -
		.. code-block:: javascript

			const arrow = (name: string) =>
			{
				// do something
			}

.. list-table:: Use consistent new lines in function parameters
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			function doSomething(num: number, enable: boolean) {
				// ...
			}

	  -
		.. code-block:: javascript

			function doSomething(num: number,
				enable: boolean) {
				// ...
			}
	* -
		.. code-block:: javascript

			function doSomething(
				num: number,
				enable: boolean,
			) {
				// ...
			}

	  -
		.. code-block:: javascript

			function doSomething(
				num: number, enable: boolean,
			) {
				// ...
			}

.. list-table:: Prefer regular top-level functions.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			export function doSomething(num: number, enable: boolean) {
				// ...
			}

	  -
		.. code-block:: javascript

			export const doSomething = (num: number, enable: boolean) => {
				// ...
			}
	* -
		.. code-block:: javascript

			someArray.map((item) => item.name)
			// or
			someArray.map((item) => {
				return item.name
			})

	  -
		.. code-block:: javascript

			// while this is valid and work
			someArray.map(function (item) {
				return item.name
			})
			// there is a caveat with accessing "this"
			someArray.map(function (item) {
				// "this" is not the previous context
				// but the context of the callback function.
				// Thus this.category will be undefined.
				return `${this.category}: ${item.name}`
			})

.. list-table:: Always use parenthesis for arrow function parameters.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			myArray.map((item) => item.name)

	  -
		.. code-block:: javascript

			myArray.map(item => item.name)

	* -
		.. code-block:: javascript

			myArray.map((item, index) => getName(item, index))

	  -

.. list-table:: Use parenthesis for multi-line body of arrow functions.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			myArray.map((item) => (
				item.value
					? 'yes'
					: 'no'
			))

	  -
		.. code-block:: javascript

			myArray.map((item) => item.value
				? 'yes'
				: 'no'
			)

	* -
		.. code-block:: javascript

			myArray.map((item) => ({
				prop: item.value,
				other: true,
			}))

	  -

Objects
^^^^^^^

.. list-table:: Only quote properties when needed.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const obj = {
				noQuotesNeeded: true,
				'quotes-needed': false,
			}

	  -
		.. code-block:: javascript

			const obj = {
				'noQuotesNeeded': true,
				'quotes-needed': false,
			}

.. list-table:: Prefer shorthand properties
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const name = 'jdoe'
			// ...
			const obj = {
				name,
				id: 123,
			}

	  -
		.. code-block:: javascript

			const name = 'jdoe'
			// ...
			const obj = {
				name: name,
				id: 123,
			}

.. list-table:: Avoid multiple properties on the same line
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const obj = {
				first: 1,
				second: 'two',
			}

	  -
		.. code-block:: javascript

			const obj = { first: 1, second: 'two' }

.. list-table:: Add spaces around content when needed
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const obj = { prop: true }

	  -
		.. code-block:: javascript

			const obj = {prop: true}

.. list-table:: Use dangling commas, this reduces the diff when adding new properties.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			const obj = {
				first: 1,
				second: 2,
			}

	  -
		.. code-block:: javascript

			const obj = {
				first: 1,
				second: 2
			}
	* -
		.. code-block:: diff

			const obj = {
				first: 1,
				second: 2,
			+	third: 3,
			}

	  -
		.. code-block:: diff

			const obj = {
				first: 1,
			-	second: 2
			+	second: 2,
			+	third: 3
			}

Operators
^^^^^^^^^

- Always use ``===`` and ``!==`` instead of ``==`` and ``!=``
- Prefer explicit comparisons

Here's why:

.. code-block:: javascript

  '' == '0'           // false
  0 == ''             // true
  0 == '0'            // true

  false == 'false'    // false
  false == '0'        // true

  false == undefined  // false
  false == null       // false
  null == undefined   // true

  ' \t\r\n ' == 0     // true

.. list-table:: Use explicit comparisons
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			if (array.length > 0) { /* ... */ }

	  -
		.. code-block:: javascript

			if (array.length) { /* ... */ }
	* -
	  -
		.. code-block:: javascript

			if (array) { /* this is always true! */ }

Control structures
^^^^^^^^^^^^^^^^^^

- Always use braces, also for one line ifs
- Split long ifs into multiple lines
- Always use break in switch statements and prevent a default block with warnings if it shouldn't be accessed

.. list-table:: Always use braces.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			if (myVar === 'hi') {
				doSomething()
			}

	  -
		.. code-block:: javascript

			if (array.length > 0) doSomething()
	* -
		.. code-block:: javascript

			for (let i = 0; i < 4; i++) {
				// your code
			}

	  -
		.. code-block:: javascript

			for (let i = 0; i < 4; i++)
				// your code

.. list-table:: Split long conditions into multiple lines.
	:widths: 50 50
	:header-rows: 1

	* - ✅ Do
	  - ❌ Don't
	* -
		.. code-block:: javascript

			if (something === 'something'
				|| condition2
				&& condition3
			) {
				// your code
			}

	  -
		.. code-block:: javascript

			if (something === 'something' || condition2 && condition3) {
				// your code
			}
