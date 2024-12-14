.. _events_listener:

===============
Events Listener
===============

This API allows you to listen to :doc:`Nextcloud events <../../../basics/events>`.

Currently only a **limited** number of events are supported.

Please let us know if there are any specific event we should add support to.

.. note::

	Unlike PHP events, all information from events comes to the ExApp **asynchronously**, more like a notification system
	in order to not slow down the server.

Register
^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/events_listener``

Params
******

.. code-block:: json

	{
		"eventType": "node_event",
		"actionHandler": "/action_handler_route"
		"eventSubtypes": [],
	}

.. note:: ``eventSubtypes`` is an optional parameter, when it is not specified all event subtypes will be propagated to ExApp.

	Url in ``actionHandler`` is relative to the ExApp root, starting slash is not required.

Unregister
^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/events_listener``

Params
******

To unregister EventsListener, you just need to provide an `eventType` for the registered EventsListener:

.. code-block:: json

	{
		"eventType": "node_event"
	}

Event payload
^^^^^^^^^^^^^

.. code-block:: json

	{
		"event_type": "node_event",
		"event_subtype": "NodeCreatedEvent",
		"event_data": "associative array depending on `event_subtype`"
	}

Events types
^^^^^^^^^^^^

Node Events
***********

``node_event`` - events about File `Nodes`

Supported event sub-types:
	* ``NodeCreatedEvent``
	* ``NodeTouchedEvent``
	* ``NodeWrittenEvent``
	* ``NodeDeletedEvent``
	* ``NodeRenamedEvent``
	* ``NodeCopiedEvent``

For all Node events, ``event_data`` contains a ``target`` key which has the same format as in :ref:`FileActionsMenu payload <node_info>`.

For ``NodeCopiedEvent`` and ``NodeRenamedEvent``, there is also a ``source`` key in the same format.
