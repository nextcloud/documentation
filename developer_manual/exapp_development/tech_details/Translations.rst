Translations
============

ExApps translations work in the `same way as for PHP apps <https://docs.nextcloud.com/server/latest/developer_manual/basics/front-end/l10n.html>`_ with a few adjustments
and differences.

In short, you just have to provide a ``l10n/<lang>.js`` (for front-end) and ``l10n/<lang>.json`` (for back-end) files for your app.


Front-end
*********

For the front-end part AppAPI will inject the current user's locale ``l10n/<lang>.js`` script, so that access to translated strings in kept the same as was before in PHP apps.

.. note::

	ExApp l10n files are included only on the ExApp UI pages (:ref:`Top Menu <top_menu_section>`), Files (for :ref:`FileAction <file_actions_menu_section>`) and Settings (for :ref:`DeclarativeSettings <declarative_settings_section>`).


Back-end
********

For the back-end part of ExApp which can be written in different programming languages it is **up to the developer to decide** how to handle and translations files.
There is an example repository with translations: `UI example with translations <https://github.com/cloud-py-api/ui_example>`_.


Manual install
**************

For ``manual-install`` type administrator will have to manually extract to the server's `writable apps directory <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#apps-paths>`_ ``l10n`` folder of ExApp
(e.g. ``/path/to/apps-writable/<appid>/l10n/*.(js|json)``).
This will allow server to access ExApp's strings with translations.

.. note::

	Only ``l10n`` folder must be present on the server side, ``appinfo/info.xml`` could lead to be misdetected by server as PHP app folder.



Docker install
**************

For ``docker-install`` type AppAPI will extract ``l10n`` folder to the server automatically during installation from ExApp release archive.


Translation tool
****************

To add support for your language in Nextcloud `translationtool <https://github.com/nextcloud/docker-ci/tree/master/translations/translationtool>`_ feel free to create an issue in the `nextcloud/docker-ci <https://github.com/nextcloud/docker-ci>`_ repository
or open a pull request with the changes made in ``createPotFile`` function to extract and convert translation strings.
