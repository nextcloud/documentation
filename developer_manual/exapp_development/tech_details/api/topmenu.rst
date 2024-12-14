.. _top_menu_section:

==============
Top Menu Entry
==============

TopMenu is an API for registering entry in the Nextcloud Top Menu for ExApps.
AppAPI takes responsibility to register TopMenu and proxy all requests to the ExApp.

.. note::

	The TopMenu is rendered only for enabled ExApps.

Register Menu Entry
^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/ui/top-menu``

Params
******

Complete list of params (including optional):

.. code-block:: json

	{
		"name": "unique_name_of_top_menu",
		"displayName": "Display name",
		"icon": "img/icon.svg",
		"adminRequired": "0 or 1",
	}

.. note:: ``icon`` is relative to the ExApp root, starting slash is not required.


Optional params
***************

	* `icon` - Url to icon, default: **null**
	* `adminRequired` - Value indicating whether the entry should be visible to all or only to admins

Unregister Menu Entry
^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ui/top-menu``

Params
******

To unregister TopMenu, just provide the name of registered TopMenu:

.. code-block:: json

	{
		"name": "unique_name_of_top_menu"
	}

Set Initial state
^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/ui/initial-state``

Params
******

.. code-block:: json

	{
		"type": "top_menu",
		"name": "unique_name_of_top_menu",
		"key": "key_name",
		"value": "array with value(s)",
	}

Remove Initial state
^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ui/initial-state``

Params
******

.. code-block:: json

	{
		"type": "top_menu",
		"name": "unique_name_of_top_menu",
		"key": "key_name",
	}

Add script
^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/ui/script``

Params
******

.. code-block:: json

	{
		"type": "top_menu",
		"name": "unique_name_of_script",
		"path": "Url to script, e.g.: js/ui_example-main",
		"afterAppId": "optional value",
	}

.. note:: Url to script is relative to the ExApp root, starting slash is not required,
	".js" extension is not needed and will be appended automatically by server.

Remove script
^^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ui/script``

Params
******

.. code-block:: json

	{
		"type": "top_menu",
		"name": "unique_name_of_script",
		"path": "Url to script",
	}

Add style
^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/ui/style``

Params
******

.. code-block:: json

	{
		"type": "top_menu",
		"name": "unique_name_of_style",
		"path": "Url to style, e.g.: css/my-style",
	}

.. note:: Url to style is relative to the ExApp root, starting slash is not required,
	".css" extension is not needed and will be appended automatically by server.

Remove style
^^^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ui/style``

Params
******

.. code-block:: json

	{
		"type": "top_menu",
		"name": "unique_name_of_style",
		"path": "Url to style",
	}
