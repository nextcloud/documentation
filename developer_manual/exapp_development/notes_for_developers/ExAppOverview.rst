.. _ExAppOverview:

ExApp overview
==============

Basic concept of the AppAPI is to provide a way to develop an app for Nextcloud using any language.
In this way, the ExApp can be written in any language, in particular, the backend part.
Frontend is kept the same. You can think about ExApp as a microservice.


ExApp structure
---------------

The typical ExApp folder structure is the following:

- **appinfo/**: contains the ExApp metadata, which is based on the regular `Nextcloud PHP appinfo <https://docs.nextcloud.com/server/latest/developer_manual/app_development/info.html>`_,
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
			<image>cloud-py-api/skeleton</image>
			<image-tag>latest</image-tag>
		</docker-install>
		<scopes> // deprecated and removed since AppAPI 3.2.0
			<value>FILES</value>
			<value>AI_PROVIDERS</value>
			...
		</scopes>
		<system>false</system> // deprecated since AppAPI 3.0.0
	</external-app>

- **docker-install**: contains the Docker image information for the ExApp.
	- **registry**: the Docker registry where the image is stored.
	- **image**: the Docker image name.
	- **image-tag**: the Docker image tag (version tag).
- **scopes**: the list of the Nextcloud scopes that the ExApp requires (see :ref:`list of scopes <api_scopes>`).
- **system**: (deprecated since AppAPI 3.0.0) a boolean value that indicates whether the ExApp is a system app or not.


Backend
-------

The ExApp backend part can be implemented in any language and framework you want,
the only requirement here is to follow the microservice architecture and ExApp <-> Nextcloud :ref:`communication flow <ex_app_lifecycle_methods>`.

.. note::

	There is a limitation of AppAPI ExApp proxy - the websocket connections are not supported.

Each ExApp container have the environment variables set by AppAPI, you can find more about it :ref:`here <ex_app_env_vars>`.

Persistent storage
******************

For each ExApp, AppAPI creates a Docker volume (``nc_app_<app_id>_data``), that is attached to the ExApp container as a persistent storage.
It is available inside container under the ``/nc_app_<app_id>_data`` path or via ``APP_PERSISTENT_STORAGE`` env passed by AppAPI.


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

The bootstrap of the Vue app (`UI Example boostrap <https://github.com/cloud-py-api/ui_example/blob/main/src/bootstrap.js>`_) is changes as follows:

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
For example, the vuex router has the following base URL configuration:

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

Currently, only `manual translations <https://docs.nextcloud.com/server/latest/developer_manual/basics/front-end/l10n.html#manual-translation>`_ are supported.
To add support of your programming language from translations string extraction using Nextcloud translation tool,
you just need to add your file extensions to it `in createPotFile <https://github.com/nextcloud/docker-ci/blob/master/translations/translationtool/src/translationtool.php#L69>`_
and down below adjust the ``--language`` and ``keyword`` parameters.
Our examples using translationtool adjusted in the same way:

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

where we declaring the methods used in source code for translating strings.

The ExApp translations are stored in the ``l10n`` folder in the ExApp root folder.
For Nextcloud side it still has to contain the files as for regular Nextcloud apps (.js and .json).
There ExApp translation files are copied to the Nextcloud server during installation (removed on uninstall),
and can be used to translate ExApp string on backend or frontend parts the same way as for PHP apps.

.. note::

    For the clustered Nextcloud setup, the ExApp translations must be also copied to the other Nextcloud instances,
    if the apps folder is not shared between the instances.
    It is done automatically only for the instance, where the installation is performed.


You might need to convert the translation files to the format that is used in your language.
And this can be done with simple bash script, as `in our example for Python <https://github.com/cloud-py-api/ui_example/blob/main/scripts/convert_to_locale.sh>`_:


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

It is recommended to follow our Makefile example with the default set of commands:

.. note::

	Makefile is written to work in the `nextcloud-docker-dev <https://github.com/juliushaertl/nextcloud-docker-dev>`_ dev setup.

- ``help``: shows the list of available commands.
- ``build-push-cpu``: builds the Docker image for CPU and uploads it to the Docker registry.
- ``build-push-cuda``: builds the Docker image for CUDA and uploads it to the Docker registry.
- ``build-push-rocm``: builds the Docker image for ROCm and uploads it to the Docker registry.
- ``run``: installs the ExApp for Nextcloud latest via the ``occ app_api:app:register`` command, like from UI.
- ``register``: performs registration of running manually ExApp using the ``manual_install`` Deploy daemon.
- ``translation_templates``: execute translationtool.phar to extract translation strings from sources (frontend and backend).
- ``convert_translations_nc``: converts translations to Nextcloud format files (json, js).
- ``convert_to_locale``: copies translations to the common locale/<lang>/LC_MESSAGES/<appid>.(po|mo). Depending on the language, you might need to adjust the script.


Example
*******

Here is an example of regular ExApp Makefile:

.. code-block::

	.DEFAULT_GOAL := help

	.PHONY: help
	help:
		@echo "Welcome to Nextcloud Visionatrix. Please use \`make <target>\` where <target> is one of"
		@echo " "
		@echo "  Next commands are only for dev environment with nextcloud-docker-dev!"
		@echo "  They should run from the host you are developing on(with activated venv) and not in the container with Nextcloud!"
		@echo "  "
		@echo "  build-push-cpu    build image for CPU and upload to ghcr.io"
		@echo "  build-push-cuda   build image for CUDA and upload to ghcr.io"
		@echo "  build-push-rocm   build image for ROCm and upload to ghcr.io"
		@echo "  "
		@echo "  run               install Visionatrix for Nextcloud Last"
		@echo "  "
		@echo "  For development of this example use PyCharm run configurations. Development is always set for last Nextcloud."
		@echo "  First run original 'Visionatrix', then run this Visionatrix and then 'make registerXX', after that you can use/debug/develop it and easy test."
		@echo "  Do not forget to change paths in 'proxy_requests' function to point to correct files for the frontend"
		@echo "  "
		@echo "  register          perform registration of running Visionatrix-es into the 'manual_install' deploy daemon."
		@echo "  "
		@echo "  L10N (for manual translation):"
		@echo "  translation_templates      extract translation strings from sources"
		@echo "  convert_translations_nc    convert translations to Nextcloud format files (json, js)"
		@echo "  convert_to_locale    		copy translations to the common locale/<lang>/LC_MESSAGES/<appid>.(po|mo)"

	.PHONY: build-push-cpu
	build-push-cpu:
		docker login ghcr.io
		docker buildx build --push --platform linux/arm64/v8,linux/amd64 --tag ghcr.io/cloud-py-api/visionatrix:$$(xmlstarlet sel -t -v "//image-tag" appinfo/info.xml) --build-arg BUILD_TYPE=cpu .

	.PHONY: build-push-cuda
	build-push-cuda:
		docker login ghcr.io
		docker buildx build --push --platform linux/amd64 --tag ghcr.io/cloud-py-api/visionatrix-cuda:$$(xmlstarlet sel -t -v "//image-tag" appinfo/info.xml) --build-arg BUILD_TYPE=cuda .

	.PHONY: build-push-rocm
	build-push-rocm:
		docker login ghcr.io
		docker buildx build --push --platform linux/amd64 --tag ghcr.io/cloud-py-api/visionatrix-rocm:$$(xmlstarlet sel -t -v "//image-tag" appinfo/info.xml) --build-arg BUILD_TYPE=rocm .

	.PHONY: run
	run:
		docker exec master-nextcloud-1 sudo -u www-data php occ app_api:app:unregister visionatrix --silent --force || true
		docker exec master-nextcloud-1 sudo -u www-data php occ app_api:app:register visionatrix --force-scopes \
			--info-xml https://raw.githubusercontent.com/cloud-py-api/visionatrix/main/appinfo/info.xml

	.PHONY: register
	register:
		docker exec master-nextcloud-1 sudo -u www-data php occ app_api:app:unregister visionatrix --silent --force || true
		docker exec master-nextcloud-1 rm -rf /tmp/vix_l10n && docker cp l10n master-nextcloud-1:/tmp/vix_l10n
		docker exec master-nextcloud-1 sudo -u www-data php occ app_api:app:register visionatrix manual_install --json-info \
	  "{\"id\":\"visionatrix\",\"name\":\"Visionatrix\",\"daemon_config_name\":\"manual_install\",\"version\":\"1.0.0\",\"secret\":\"12345\",\"port\":9100,\"scopes\":[\"AI_PROVIDERS\", \"FILES\", \"USER_INFO\"], \"translations_folder\":\"\/tmp\/vix_l10n\"}" \
	  --force-scopes --wait-finish

	.PHONY: translation_templates
	translation_templates:
		./translationtool.phar create-pot-files

	.PHONY: convert_translations_nc
	convert_translations_nc:
		./translationtool.phar convert-po-files

	.PHONY: convert_to_locale
	convert_to_locale:
		./scripts/convert_to_locale.sh

