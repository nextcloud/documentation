.. _ex_app_translations_page:

Translations
============

ExApps translations work in the :ref:`same way as for PHP apps<Translations>` with a few adjustments and differences.

In short, you just have to provide the ``l10n/<lang>.js`` (for front-end) and ``l10n/<lang>.json`` (for back-end) files for your app.


Front-end
*********

For the front-end part, AppAPI will inject the current user's locale ``l10n/<lang>.js`` script, so that access to translated strings in kept the same as was before in PHP apps.

.. note::

	ExApp l10n files are included only on the ExApp UI pages (:ref:`Top Menu <top_menu_section>`), Files (for :ref:`FileAction <file_actions_menu_section>`) and Settings (for :ref:`DeclarativeSettings <exapp_declarative_settings_section>`).


Back-end
********

For the back-end part of ExApp, which can be written in different programming languages, it is **up to the developer to decide** how to handle translations files.
There is an example repository with translations: `UI example with translations <https://github.com/nextcloud/ui_example>`_.

There are two Python functions used by `translationtool <https://github.com/nextcloud/docker-ci/tree/master/translations/translationtool>`_ to extract translation string: ``_('singular string')`` and ``_n('singular string', 'plural string', count)``.


Manual translations
*******************

Manual translations instructions can be found :ref:`here <ex_app_translations>`.


Transifex sync
--------------

For automated Transifex sync there are only ``.po`` files included.
You can then compile them to ``.mo`` files using `ui_example's <https://github.com/nextcloud/ui_example/tree/main/scripts/compile_po_to_mo.sh>`_ ``scripts/compile_po_to_mo.sh`` script.


Manual install
**************

For the ``manual-install`` type, an administrator will have to manually extract to the server's `writable apps directory <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#apps-paths>`_ ``l10n`` folder of the ExApp
(e.g. ``/path/to/apps-writable/<appid>/l10n/*.(js|json)``).
This will allow the server to access the ExApp's strings with translations.

.. TODO ON RELEASE: Update version number above on release

.. note::

	Only the ``l10n`` folder must be present on the server side; ``appinfo/info.xml`` could lead to misdetection by the server as a PHP app folder.



Docker install
**************

For the ``docker-install`` type, AppAPI will extract the ``l10n`` folder to the server automatically during installation from the ExApp release archive.


Translation tool
****************

To add support for your language in Nextcloud `translationtool <https://github.com/nextcloud/docker-ci/tree/master/translations/translationtool>`_,
feel free to create an issue in the `nextcloud/docker-ci <https://github.com/nextcloud/docker-ci>`_ repository
or open a pull request with the changes made in the ``createPotFile`` function to extract and convert translation strings.
