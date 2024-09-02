=================
Webhook Listeners
=================

.. _webhook_listeners:

Nextcloud supports listening to internal events via webhooks.

Installation
------------

 * Enable the ``webhook_listeners`` app that comes bundled with Nextcloud

.. code-block:: bash

   occ app:enable webhook_listeners

Listening to events
-------------------

You can use the OCS API to add webhooks for specific events: https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/webhook_listeners-webhooks-index

Filters
~~~~~~~

When registering a webhook listener, you can specify a filter parameter. The value of this parameter must be a JSON object whose properties represent filter conditions. The ``{}`` is an empty query, meaning no specific criteria, so all events are matched.

If you would like to match events fired by a specific user, you can pass ``{ "user.uid": "bob" }`` to match all events fired in the context of user ``"bob"``.

If you would like to enforce multiple criteria, you can simply pass multiple properties ``{ "event.tableId": 42, "event.rowId": 3 }``

You can also use additional comparison operators (``$eq, $ne, $gt, $gte, $lt, $lte, $in, $nin``) as well as logical operators (``$and, $or, $not, $nor``). For example use ``{ "time" : { "$lt": 1711971024 } }`` to accept only events prior to April 1st 2024 and ``{ "time" : { "$not": { "$lt": 1711971024 } } }`` to accept events after April 1st 2024.

Nextcloud Webhook Events
------------------------
This is a non-exhaustive list of available events. It features the event ID and the available variables for filtering.

 * OCA\\Tables\\Event\\RowAddedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "tableId": int,
        "rowId": int,
        "previousValues": null|array<int, mixed>,
        "values": null|array<int, mixed>
      }
    }

 * OCA\\Tables\\Event\\RowDeletedEvent

  .. code-block:: text

     array{
       "user": array {"uid": string, "displayName": string},
       "time": int,
       "event": array{
         "class": string,
         "tableId": int,
         "rowId": int,
         "previousValues": null|array<int, mixed>,
         "values": null|array<int, mixed>
       }
     }

 * OCA\\Tables\\Event\\RowUpdatedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "tableId": int,
        "rowId": int,
        "previousValues": null|array<int, mixed>,
        "values": null|array<int, mixed>
      }
    }

 * OCP\\Files\\Events\\Node\\BeforeNodeCreatedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\BeforeNodeWrittenEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\BeforeNodeDeletedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\BeforeNodeRenamedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "source": array{"id": string, "path": string}
        "target": array{"id": string, "path": string}
      }
    }
