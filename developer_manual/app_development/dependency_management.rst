.. _app-dependencies:

=====================
Dependency management
=====================

You can leverage existing software packages to build a Nextcloud app.

.. _app-composer:

Composer
--------

You can add 3rd party php packages with `Composer`_. Composer will download the specified packages to a directory of your choice, typically to ``/vendor``. In order to benefit from Composer's autoloader, you'll want to add a ``require_once`` to the ``register`` method of your ``Application`` class in the :ref:`bootstrapping<Bootstrapping>` code of your app.

Remove unneeded files from packages
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It is heavily recommended to remove files that are not required in production from the final packages.
This especially, but not exclusively, refers to:

* Developer files, e.g. ``/Makefile``
* CI workflows, e.g. ``/.github``
* Test assets, e.g. ``/tests``
* Configuration of development tools, e.g. ``/phpunit.xml``, ``/psalm.xml``
* Git or other version control code, e.g. ``/.git``

You can check the `Server's .gitignore <https://github.com/nextcloud/3rdparty/blob/master/.gitignore>`_ file for more inspiration.

.. _app-composer-dependency-hell:

Dependency hell
^^^^^^^^^^^^^^^

Be careful with which packages you add to an app. PHP can not load two version of the same class twice, hence there can be conflicts between Nextcloud Server and an app or between two or more apps if they require the same package. So try to keep the number of production dependencies to a minimum and see :ref:`app-composer-bin-tools`.

Alternatively you can use [composer-bin-plugin](https://github.com/bamarni/composer-bin-plugin) to avoid dependency conflicts between apps.

1. Install composer-bin-plugin according to their docs.

	.. code-block:: shell

		composer require --dev bamarni/composer-bin-plugin

2. Install the tools you need in the vendor-bin directory.

	.. code-block:: shell

		composer bin psalm require --dev psalm/phar
		composer bin psalm require --dev nextcloud/ocp:dev-master

3. Adjust some config (see below)
	- Add in `composer.json`:

	.. code-block:: json
		:caption: composer.json

		{
			"extra": {
				"bamarni-bin": {
					"bin-links": true,
					"forward-command": true
				}
			}
		}

	- Add in `composer.json`:

	.. code-block:: json
		:caption: composer.json

		{
			"scripts": {
				"post-install-cmd": [
					"[ $COMPOSER_DEV_MODE -eq 0 ] || composer bin all install --ansi"
				],
				"post-update-cmd": [
					"[ $COMPOSER_DEV_MODE -eq 0 ] || composer bin all update --ansi"
				]
			}
		}

	- Adjust `psalm.xml`:
		- Ensure the schemaLocation is correct:

		.. code-block:: xml
			:caption: psalm.xml

			xsi:schemaLocation="https://getpsalm.org/schema/config vendor-bin/psalm/vendor/vimeo/psalm/config.xsd"

		- Ensure it has something like this:

		.. code-block:: xml
			:caption: psalm.xml

			<projectFiles>
				<directory name="lib" />
				<ignoreFiles>
					<directory name="vendor" />
					<directory name="vendor-bin" />
				</ignoreFiles>
			</projectFiles>
			<extraFiles>
				<directory name="vendor" />
				<directory name="vendor-bin/psalm/vendor" />
			</extraFiles>

	- Adjust `.php-cs-fixer.dist.php`

	.. code-block:: PHP
		:caption: .php-cs-fixer.dist.php

		require_once __DIR__ . '/vendor-bin/cs-fixer/vendor/autoload.php';

Conflict example
****************

To illustrate the problem imagine app *A* depends on package *foo* in version 1, app *B* depends on package *foo* in version 2. The package *foo* had a breaking change to which app *B* has been adjusted, *A* uses the old API.

Both apps ship a Composer autoloader that autoloads the *foo* functions and classes. There is a race between the two autoloaders. If *A*'s autoloader is asked to load the class first, then v1 will be used. If *B*'s autoloader loads functions and classes first it will be v2. In some scenarios there might be classes of v1 and v2 when autoloaders are invoked without a defined order.

Depending on which functions and classes are loaded, app *A* might work or break. The same applies to *B*.

.. _app-composer-bin-tools:

Development tools
^^^^^^^^^^^^^^^^^

It is very common for an app to use CLI tools for syntax checks, testing and building. Since many tools depend on common Composer packages like ``psr/*`` and ``symfony/console``, it is likely that apps produce a :ref:`dependency hell <app-composer-dependency-hell>` on development environments.

The dependency hell for CLI tools can be avoided by using the *Composer bin plugin*. It's a composer plugin that puts development dependencies into sub directorory with a dedicated autoloader. That autoloader is only used if the CLI tool is used. For Nextcloud apps this means two apps can use conflicting versions of one tool. Moreover dependency conflicts between the tools of one app are no longer an issue.

Tools known to be problematic that should be moved into bin plugin directories include

* ``friendsofphp/php-cs-fixer``
* ``phpunit/phpunit``
* ``vimeo/psalm``

Please see the `package page <https://packagist.org/packages/bamarni/composer-bin-plugin>`_ for up-to-date installation instructions.

.. _Composer: https://getcomposer.org/
