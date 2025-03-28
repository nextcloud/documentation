.. _file_actions_menu_section:

=================
File Actions Menu
=================

FileActionsMenu is a simple API for registering entry to the file actions menu for ExApps.
AppAPI takes responsibility to register FileActionsMenu; ExApps only need to register it in AppAPI.

.. note::

	The FileActionsMenu is rendered only for enabled ExApps.

Register
^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v2/ui/files-actions-menu``

Params
******

Complete list of params (including optional):

.. code-block:: json

	{
		"name": "unique_name_of_file_actions_menu",
		"displayName": "Display name (for UI listing)",
		"actionHandler": "/action_handler_route"
		"mime": "mime of files where to display action menu",
		"icon": "img/icon.svg",
		"permissions": "permissions",
		"order": "order_in_file_actions_menu",
	}

.. note:: Urls ``icon`` and ``actionHandler`` are relative to the ExApp root, starting slash is not required.

Optional params
***************

	* `permissions` - File permissions required to display action menu, default: **31** (all permissions)
	* `order` - Order in file actions menu, default: **0**
	* `icon` - Url to icon, default: **null**
	* `mime` - One mime or mimes separated by commas, default: **file**

Unregister
^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/ui/files-actions-menu``

Params
******

To unregister FileActionsMenu, you just need to provide the name of the registered FileActionsMenu:

.. code-block:: json

	{
		"name": "unique_name_of_file_action_menu"
	}

.. _node_info:

Action payload to ExApp
^^^^^^^^^^^^^^^^^^^^^^^

When FileActionsMenu is invoked, AppAPI forwards the handling action to the ExApp.
The following data is sent to the ExApp FileActionsMenu handler from the context of the action:

.. code-block:: json

	{
		"fileId": "123",
		"name": "filename",
		"directory": "relative/to/user/path/to/directory",
		"etag": "file_etag",
		"mime": "file_full_mime",
		"fileType": "dir/file",
		"mtime": "last modify time(integer)",
		"size": "integer",
		"favorite": "nc_favorite_flag",
		"permissions": "file_permissions_for_owner",
		"shareOwner": "optional, str",
		"shareOwnerId": "optional, str",
		"shareTypes": "optional, int",
		"shareAttributes": "optional, int",
		"sharePermissions": "optional, int",
		"userId": "string",
		"instanceId": "string",
	}

Redirect to ExApp UI page (top menu)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note::
    Supported only for Nextcloud 28+.

If you want to open some files in the ExApp UI, your FileActionsMenu has to be registered using OCS v2 version (``/apps/app_api/api/v2/ui/files-actions-menu``).

After that, AppAPI will expect in the JSON response of the ExApp ``action_handler``
the ``redirect_handler`` - a relative path on the ExApp Top Menu page,
to which AppAPI will attach a ``fileIds`` query parameter with the selected file IDs, for example:

``/index.php/apps/app_api/embedded/ui_example/first_menu/second_page?fileIds=123,124,125``,

where the ``first_menu`` is the name of the Top Menu ExApp UI page,
and the ``second_page`` the relative route handled on the frontend routing of the ExApp.
the ``fileIds`` query parameter contains the selected file IDs separated by commas.
After that, you can get the files info via WebDAV search request, see `ui_example <https://github.com/nextcloud/ui_example>`_.


Request flow
^^^^^^^^^^^^

General ExApp workflow based on FileActionsMenu.

User action
***********

.. mermaid::

	sequenceDiagram
		User->>FileActionMenu: Press on registered ExApp action
		FileActionMenu->>AppAPI: send action context payload
		AppAPI->>ExApp: forward request to handler
		ExApp->>AppAPI: handler accepted action status
		AppAPI->>User: Alert (action sent or error)


Action results
**************

File processing results could be stored next to the initial file or anywhere else,
e.g. on a location configured in ExApp settings (``appconfig_ex``) or ExApp user settings (``preferences_ex``).

.. mermaid::

	sequenceDiagram
		ExApp->>Nextcloud: Upload result file
		ExApp->>AppAPI: Send notification about action results

Examples
^^^^^^^^

Here is a list of simple example ExApps based on FileActionsMenu:

* `to_gif <https://github.com/cloud-py-api/nc_py_api/tree/main/examples/as_app/to_gif>`_ - ExApp based on FileActionsMenu to convert videos to GIF in place
* `upscaler_example <https://github.com/cloud-py-api/upscaler_example.git>`_ - ExApp based on FileActionsMenu to upscale image in place
