=========
Talk bots
=========

AppAPI provides API for registering ExApps Talk bots.
This means that ExApps could be just as Talk bot or it could be as one of the options of the app.
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

To unregister the ExApp Talk bot, you will have to pass the route where the Talk bot is registered.

OCS endpoint: ``DELETE /apps/app_api/api/v1/talk_bot``

Request data
************

.. code-block:: json

	{
		"route": "/route_of_talk_bot"
	}

