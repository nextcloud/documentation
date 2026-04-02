=========
Talk bots
=========

AppAPI provides an API for registering ExApp Talk bots.
This means that ExApps could function as just a Talk bot or as one of the app options.
Read more about Talk bots `here <https://nextcloud-talk.readthedocs.io/en/latest/bots/>`_.

Register ExApp Talk bot (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/talk_bot``

Request data
************

.. code-block:: json

	{
		"name": "Talk bot display name",
		"route": "/talk_bot_webhook_route_on_ex_app",
		"description": "Talk bot description",
	}


Unregister ExApp Talk bot (OCS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To unregister the ExApp Talk bot, pass the route where the Talk bot is registered.

OCS endpoint: ``DELETE /apps/app_api/api/v1/talk_bot``

Request data
************

.. code-block:: json

	{
		"route": "/route_of_talk_bot"
	}

