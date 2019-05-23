.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>
..  _makefile:

========
Makefile
========

To ease our developement, we aime to have the same script naming convention.
For the npm scripts names and config, please check the :ref:`npm section <npm>`


.. code-block:: makefile

	# Do everything to have a fully working app
	all: dev-setup lint build-js-production test test-php

	# Setup the development environment
	dev-setup: clean clean-dev npm-init

	# Init npm modules
	npm-init:
		npm install

	# Update npm modules
	npm-update:
		npm update

	# Create development build
	build-js:
		npm run dev

	# Create production build
	build-js-production:
		npm run build

	# Create development build and watch changes
	watch-js:
		npm run watch

	# Cleaning compiled files
	clean:
		rm -f js/contacts.js
		rm -f js/contacts.js.map
		rm -Rf js/chunks

	# Remove node_modules and every files
	# that the package manager creates on init
	clean-dev:
		rm -rf node_modules
		