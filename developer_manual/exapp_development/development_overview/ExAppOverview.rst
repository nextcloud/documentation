.. _ExAppOverview:

ExApp overview
==============

The basic concept of the AppAPI is to provide a way to develop/write an app for Nextcloud in any language, especially the backend part.
The frontend part is usually kept the same. You can think of the ExApp as a microservice.


ExApp structure
---------------

The typical ExApp folder structure is the following:

- **appinfo/**: contains the ExApp metadata, which is based on the regular :doc:`Nextcloud PHP appinfo <../../app_development/info>`,
  but with additional new fields under the ``external-app`` key.
- **ex_app/**: the ExApp specific folder, which contains the ExApp frontend and backend parts.
	- **lib/**: contains the ExApp backend part, which can be written in any language.
	- **src/**: contains the ExApp frontend part, which is a regular Nextcloud Vue.js application, with small adjustments to the script loading paths (see :ref:`ExApp specific frontend changes <ex_app_specific_frontend_changes>`).
	- **img/**: contains the ExApp images.
	- **css/**: contains the ExApp CSS files.
- **l10n**: contains the :ref:`ExApp translations <ex_app_translations>`.
- **translationfiles**: contains the source translation (``.po``, ``.mo``) files for the ExApp.
- **other folders or files**: depends on your case, e.g. screenshots, scripts, etc.


.. _ex_app_info_xml_metadata:

ExApp metadata
**************

The ``<external-app>`` info.xml tag is required for the ExApp metadata.
It should contain the following fields:

.. code-block::

	<external-app>
		<docker-install>
			<registry>ghcr.io</registry>
			<image>nextcloud/skeleton</image>
			<image-tag>latest</image-tag>
		</docker-install>
	</external-app>

- **docker-install**: contains the Docker image information for the ExApp.
	- **registry**: the Docker registry where the image is stored.
	- **image**: the Docker image name.
	- **image-tag**: the Docker image tag (version tag).


Backend
-------

The ExApp backend part can be implemented in any language and framework you want.
The only requirement here is to follow the microservice architecture and ExApp <-> Nextcloud :ref:`communication flow <ex_app_lifecycle_methods>`.

.. note::

	There is a limitation of AppAPI ExApp proxy - the websocket connections are not supported.

Each ExApp container has environment variables set by AppAPI; you can find out more about them :ref:`here <ex_app_env_vars>`.

Persistent storage
******************

For each ExApp, AppAPI creates a Docker volume (``nc_app_<app_id>_data``) that is attached to the ExApp container as persistent storage.
It is available inside the container under the ``/nc_app_<app_id>_data`` path or via the ``APP_PERSISTENT_STORAGE`` environment variable passed by AppAPI.


.. _ex_app_specific_frontend_changes:

Frontend
--------

The ExApp frontend part is loaded only for :ref:`TopMenu entry <top_menu_section>`.
It is a regular Nextcloud Vue.js application with a small routing adjustment to the paths,
as they are being loaded via AppAPI proxy from the ExApp server.

To simplify the usage, we declare a few constants:

.. code-block::

    export const EX_APP_ID = 'ui_example'
    export const EX_APP_MENU_ENTRY_NAME = 'first_menu'
    export const APP_API_PROXY_URL_PREFIX = '/apps/app_api/proxy'
    export const APP_API_ROUTER_BASE = '/apps/app_api/embedded'

The bootstrap of the Vue app (`UI Example bootstrap <https://github.com/nextcloud/ui_example/blob/main/src/bootstrap.js>`_) is changed as follows:

.. code-block::

    import Vue from 'vue'
    import { translate, translatePlural } from '@nextcloud/l10n'
    import { generateUrl } from '@nextcloud/router'
    import { APP_API_PROXY_URL_PREFIX, EX_APP_ID } from './constants/AppAPI.js'
    import { getRequestToken } from '@nextcloud/auth'

    Vue.prototype.t = translate
    Vue.prototype.n = translatePlural
    Vue.prototype.OC = window.OC
    Vue.prototype.OCA = window.OCA

    __webpack_public_path__ = generateUrl(`${APP_API_PROXY_URL_PREFIX}/${EX_APP_ID}/js/`) // eslint-disable-line
    __webpack_nonce__ = btoa(getRequestToken()) // eslint-disable-line


Frontend routing
****************

The frontend routing base URL is also adjusted to be loaded via AppAPI proxy.
For example, the **vuex** router has the following base URL configuration:

.. code-block::

	...
	const router = new VueRouter({
		mode: 'history',
		base: generateUrl(`${APP_API_ROUTER_BASE}/${EX_APP_ID}/${EX_APP_MENU_ENTRY_NAME}`, ''), // setting base to AppAPI embedded URL
		linkActiveClass: 'active',
	...

The same applies to the frontend API requests to the ExApp backend API:

.. code-block::

	...
	axios.get(generateUrl(`${APP_API_PROXY_URL_PREFIX}/${EX_APP_ID}/some_api_endpoint`))
	...


.. _ex_app_translations:

L10n translations
-----------------

Currently, only :ref:`manual translations <manual-translation>` are supported.
To add support of your programming language from translations string extraction using Nextcloud translation tool,
you just need to add your file extensions to it `in createPotFile <https://github.com/nextcloud/docker-ci/blob/master/translations/translationtool/src/translationtool.php#L69>`_
and down below adjust the ``--language`` and ``keyword`` parameters.
Here is an example using translationtool adjusted in the same way:

.. code-block::

    diff --git a/translations/translationtool/src/translationtool.php b/translations/translationtool/src/translationtool.php
    index 42513563..8aa06618 100644
    --- a/translations/translationtool/src/translationtool.php
    +++ b/translations/translationtool/src/translationtool.php
    @@ -67,7 +67,7 @@ public function createPotFile() {
     		$this->createFakeFileForVueFiles();
     		$this->createFakeFileForLocale();
     		$translatableFiles = $this->findTranslatableFiles(
    -			['.php', '.js', '.jsx', '.mjs', '.html', '.ts', '.tsx'],
    +			['.php', '.js', '.jsx', '.mjs', '.html', '.ts', '.tsx', '.py'],
     			['.min.js']
     		);

    @@ -79,6 +79,8 @@ public function createPotFile() {
     			$keywords = '';
     			if (substr($entry, -4) === '.php') {
     				$keywords = '--keyword=t --keyword=n:1,2';
    +			} else if (substr($entry, -3) === '.py') {
    +				$keywords = '--keyword=_ --keyword=_n:1,2';
     			} else {
     				$keywords = '--keyword=t:2 --keyword=n:2,3';
     			}
    @@ -86,6 +88,8 @@ public function createPotFile() {
     			$language = '--language=';
     			if (substr($entry, -4) === '.php') {
     				$language .= 'PHP';
    +			} else if (substr($entry, -3) === '.py') {
    +				$language .= 'Python';
     			} else {
     				$language .= 'Javascript';
     			}

where we declare the methods used in source code for translating strings.

The ExApp translations are stored in the ``l10n`` directory under the ExApp project root directory.
On the Nextcloud side, it still has to contain the translation files as with regular Nextcloud apps (.js and .json).
The ExApp translation files are copied to the Nextcloud server during installation (removed on uninstall),
and can be used to translate ExApp strings on the backend or frontend in the same way as PHP apps.

.. note::
    In a clustered Nextcloud setup, the ExApp translations must be also copied to the other Nextcloud instances,
    if the apps folder is not shared between them.
    It is done automatically only for the instance where the installation is performed.


You might need to convert the translation files to the format that is used in your language.
And this can be done with simple bash script, as `in our example for Python <https://github.com/nextcloud/ui_example/blob/main/scripts/convert_to_locale.sh>`_:


.. code-block::

	#!/bin/bash

	# This script is used to transform default translation files folders (translationfiles/<lang>/*.(po|mo))
	# to the locale folder (locale/<lang>/LC_MESSAGES/*.(po|mo))

	cd ..

	# Remove the locale/* if it exists to cleanup the old translations
	if [ -d "locale" ]; then
	  rm -rf locale/*
	fi

	# Create the locale folder if it doesn't exist
	if [ ! -d "locale" ]; then
	  mkdir locale
	fi

	# Loop through the translation folders and copy the files to the locale folder
	# Skip the templates folder

	for lang in translationfiles/*; do
	  if [ -d "$lang" ]; then
		lang=$(basename $lang)
		if [ "$lang" != "templates" ]; then
		  if [ ! -d "locale/$lang/LC_MESSAGES" ]; then
			mkdir -p locale/$lang/LC_MESSAGES
		  fi
		  # Echo the language being copied
		  echo "Copying $lang locale"
		  cp translationfiles/$lang/*.po locale/$lang/LC_MESSAGES/
		  cp translationfiles/$lang/*.mo locale/$lang/LC_MESSAGES/
		fi
	  fi
	done



Makefile
--------

It is recommended to use the following default set of commands:

- ``help``: shows the list of available commands.
- ``build-push-cpu``: builds the Docker image for CPU and uploads it to the Docker registry.
- ``build-push-cuda``: builds the Docker image for CUDA and uploads it to the Docker registry.
- ``build-push-rocm``: builds the Docker image for ROCm and uploads it to the Docker registry.
- ``run``: installs the ExApp for Nextcloud latest via the ``occ app_api:app:register`` command, like from the UI.
- ``register``: performs registration of running manually ExApp using the ``manual_install`` Deploy daemon.
- ``translation_templates``: execute translationtool.phar to extract translation strings from sources (frontend and backend).
- ``convert_translations_nc``: converts translations to Nextcloud format files (json, js).
- ``convert_to_locale``: copies translations to the common locale/<lang>/LC_MESSAGES/<appid>.(po|mo). Depending on the language, you might need to adjust the script.

.. note::
	These Makefiles are typically written to work in the `nextcloud-docker-dev <https://github.com/juliusknorr/nextcloud-docker-dev>`_ development environment.

For a complete example, you can take a look at our `Makefile for the 3rd-party service example <https://github.com/cloud-py-api/visionatrix/blob/main/Makefile>`_.
This example also requires the ``xmlstarlet`` program to be installed so that the Makefile can automatically detect the ExApp version from the info.xml file.
