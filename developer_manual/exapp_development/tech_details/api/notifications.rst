=============
Notifications
=============

AppAPI allows ExApps to send limited notifications to users.
The ExApp can send simple notifications using available `rich object strings <https://github.com/nextcloud/server/blob/master/lib/public/RichObjectStrings/Definitions.php#L42>`_.
More info about rich object strings can be found `here <https://github.com/nextcloud/server/issues/1706>`_.

Send notification (OCS)
^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/notification``

Request payload
***************

Example payload.

.. code-block:: json

	{
		"params": {
			"object": "app_api",
			"object_id": "app_api_id",
			"subject_type": "app_api_ex_app",
			"subject_params": {
				"rich_subject": "Image {file} successfully upscaled!",
				"rich_subject_params": {
					"file": {
						"type": "file",
						"id": 123,
						"name": "upscaled_image_name",
						"path": "path/to/upscaled_image_name"
					}
				},
				"rich_message": "{user} checkout results!",
				"rich_message_params": {
					"user": {
						"type": "user",
						"id": "admin",
						"name": "admin"
					}
				},
				"link": "http(s)://nextcloud.local/index.php/apps/files/?fileid=123"
			}
		}
	}


Params
^^^^^^

Required payload params:

	* ``object`` - ``[required]`` should be set to default value, not used yet
	* ``object_id`` - ``[required]`` should be set to default value, not used yet
	* ``subject_type`` - ``[required]`` subject type should be set to default value, not used yet
	* ``subject_params`` - ``[required]``
		* ``rich_subject`` - ``[optional]`` rich subject (title) string
		* ``rich_subject_params`` - ``[optional]`` rich subject (title) params to replace rich objects in string
		* ``rich_message`` - ``[optional]`` rich message string
		* ``rich_message_params`` - ``[optional`` rich message params to replace objects in string
		* ``link`` - absolute url to set for notification link
