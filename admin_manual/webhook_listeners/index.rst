=================
Webhook Listeners
=================

.. _webhook_listeners:

Introduction
------------

Nextcloud supports sending notifications to external services whenever something
important happens, such as when files are changed or updated.

Overview
--------

The Webhook Listeners app enables your Nextcloud server to automatically notify
external services whenever important events - such as file changes, uploads, or
deletions - occur in your instance. By configuring webhook listeners, administrators
can set up custom HTTP notifications (webhooks) that are triggered by specific
internal events, allowing seamless integration with other platforms and automation of
workflows without manual intervention.

The app works by monitoring Nextcloud's event system and dispatching HTTP
requests to defined endpoints whenever a matching event takes place. Management and
configuration of webhook listeners are handled via the Nextcloud OCS API and
command-line tools. The app is ideal for scenarios where you want to connect Nextcloud
with notification systems, external automation platforms, or custom integrations -
without requiring manual polling.

Installation
------------

Enable the ``webhook_listeners`` app that comes bundled with Nextcloud - e.g.

.. code-block:: bash

   occ app:enable webhook_listeners

Listening to events
-------------------

You can use the OCS API to add webhooks for specific events. See:
`Register a new webhook <https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/webhook_listeners-webhooks-index>`_.

.. TODO ON RELEASE: Update version number above upon release.

Note: When authenticating with the OCS API to register webhooks, the account you
use must have administrator rights or delegated administrator rights.

Filters
~~~~~~~

When registering a webhook listener, you can specify a filter parameter. The value of
this parameter must be a JSON object whose properties represent filter conditions.
The ``{}`` object is an empty query, meaning no specific criteria are set, so all events
are matched.

If you want to match events triggered by a specific user, you can pass
``{ "user.uid": "bob" }`` to match all events associated with the user ``bob``.

To enforce multiple criteria, simply pass multiple properties:
``{ "event.tableId": 42, "event.rowId": 3 }``.

If you want to match values partially, you can use regular expressions:
``{ "user.uid": "/admin_.*/" }`` will match any user whose user ID starts with
``admin_``. This can be especially useful for filesystem events when filtering by path:
``{ "event.node.path": "/^\\/.*\\/files\\/Special folder\\//" }`` will match files
inside the ``Special folder`` of any user. Note that the slashes in the path need to be
escaped with two backslashes: once because you are inside a JSON string, and once
because you are inside a regular expression.

You can also use additional comparison operators (``$e``, ``$ne``, ``$gt``, ``$gte``,
``$lt``, ``$lte``, ``$in``, ``$nin``) as well as logical operators (``$and``, ``$or``,
``$not``, ``$nor``). For example, use ``{ "time": { "$lt": 1711971024 } }`` to accept
only events prior to April 1st, 2024, and ``{ "time": { "$not": { "$lt": 1711971024 } }}``
to accept events after April 1st, 2024.

Speeding up webhook dispatch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This app uses background jobs to trigger registered webhooks. By default, webhooks
are triggered every 5 minutes, as the default cron interval is set to 5 minutes.
To trigger webhooks sooner, you can set up a background job worker.

The following command will launch a worker for the webhook call background job:

Screen or tmux session
^^^^^^^^^^^^^^^^^^^^^^

Run the following ``occ`` command inside a screen or tmux session, preferably four
or more times, to enable parallel processing of multiple requests by different users
or the same user. It is best to run one command per screen session or tmux window/pane
to keep logs visible and make each worker easy to restart.

.. code-block::

   set -e; while true; do sudo -E -u www-data php occ background-job:worker -v -t 60 "OCA\WebhookListeners\BackgroundJobs\WebhookCall"; done

For Nextcloud-AIO you should use this command on the host server.

.. code-block::

   set -e; while true; do sudo docker exec -it nextcloud-aio-nextcloud docker exec -it nextcloud-aio-nextcloud sudo -E -u www-data php occ background-job:worker -v -t 60 "OCA\WebhookListeners\BackgroundJobs\WebhookCall"; done

You may want to adjust the number of workers and the timeout (in seconds) to your needs.
The logs of the worker can be checked by attaching to the screen or tmux session.

Systemd service
^^^^^^^^^^^^^^^

1. Create a systemd service file in ``/etc/systemd/system/nextcloud-webhook-worker@.service`` with the following content:

.. code-block::

   [Unit]
   Description=Nextcloud Webhook worker %i
   After=network.target

   [Service]
   ExecStart=/opt/nextcloud-webhook-worker/taskprocessing.sh %i
   Restart=always
   StartLimitInterval=60
   StartLimitBurst=10

   [Install]
   WantedBy=multi-user.target

2. Create a shell script in ``/opt/nextcloud-webhook-worker/taskprocessing.sh`` with the following content and make sure to make it executable:

.. code-block::

   #!/bin/sh
   echo "Starting Nextcloud Webhook Worker $1"
   cd /path/to/nextcloud
   sudo -E -u www-data php occ background-job:worker -t 60 'OCA\WebhookListeners\BackgroundJobs\WebhookCall'

You may want to adjust the timeout to your needs (in seconds).

3. Enable and start the service 4 or more times:

.. code-block::

   for i in {1..4}; do systemctl enable --now nextcloud-webhook-worker@$i.service; done

The status of the workers can be checked with (replace 1 with the worker number):

.. code-block::

   systemctl status nextcloud-webhook-worker@1.service

The list of workers can be checked with:

.. code-block::

   systemctl list-units --type=service | grep nextcloud-webhook-worker

The complete logs of the workers can be checked with (replace 1 with the worker number):

.. code-block::

   sudo journalctl -xeu nextcloud-webhook-worker@1.service -f

It is recommended to restart this worker at least once a day to make sure code changes are effective and avoid memory leaks, in this example the service restarts every 60 seconds.

Nextcloud Webhook Events
------------------------

This is list of typically available events. It features the event ID and the available variables for filtering.

.. note::

   In addition to the events listed below (which are provided by Nextcloud server and included apps), optional apps may register their own webhook-compatible events. The exact set of events available on your server will depend on your Nextcloud version and installed apps. If you need to discover available events, consult your app documentation or refer to your app source code or the Nextcloud developer documentation.

**Note:** Example payloads below are based on actual webhook HTTP POST payloads, using real JSON and data types. Field types are indicated in example objects by their value type: for example, ``"id": 123`` is an integer, not a string.

Node (Files / Folders) Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Node events include those that act on a single node as well as those that act on two nodes (such as copy, rename, and restore). In single-node events, the payload includes a single ``node`` object with information about the affected file or folder. In two-node events, the payload includes both a ``source`` object (the original node) and a ``target`` object (the resulting node after the operation). The examples below demonstrate these unique payload formats.

**1. Single-node events**

Applies to:

- ``OCP\Files\Events\Node\BeforeNodeCreatedEvent``
- ``OCP\Files\Events\Node\BeforeNodeTouchedEvent``
- ``OCP\Files\Events\Node\BeforeNodeWrittenEvent``
- ``OCP\Files\Events\Node\BeforeNodeReadEvent``
- ``OCP\Files\Events\Node\BeforeNodeDeletedEvent``
- ``OCP\Files\Events\Node\NodeCreatedEvent``
- ``OCP\Files\Events\Node\NodeTouchedEvent``
- ``OCP\Files\Events\Node\NodeWrittenEvent``
- ``OCP\Files\Events\Node\NodeDeletedEvent``

.. code-block:: json

   {
     "event": "NodeCreatedEvent",
     "node": {
       "id": 437,
       "path": "/admin/files/test-webhook.txt"
     }
   }

Where:

- ``"id"`` is an integer (unique node ID)
- ``"path"`` is a string (file/folder path)

.. note::

   In some events (such as ``NodeDeletedEvent`` or when the node refers to a non-existent file or folder), the ``node`` object may not have an ``id`` field. This happens when the node no longer exists in the filesystem/database, and is represented in Nextcloud by an internal ``NonExistingFile`` or ``NonExistingFolder``. In such cases, only the ``path`` field will be present. Always check for the presence of the ``id`` field in these payloads. Usually, the corresponding ``Before*`` event (such as ``BeforeNodeDeletedEvent``) can be used if you require the ``id`` of the node before deletion.

Example of a deleted node webhook payload:

.. code-block:: json

   {
     "event": "NodeDeletedEvent",
     "node": {
       "path": "/user/files/oldfile.txt"
     }
   }

**2. Two-node events**

Applies to:

- ``OCP\Files\Events\Node\NodeCopiedEvent``
- ``OCP\Files\Events\Node\NodeRenamedEvent``
- ``OCP\Files\Events\Node\NodeRestoredEvent``
- ``OCP\Files\Events\Node\BeforeNodeCopiedEvent``
- ``OCP\Files\Events\Node\BeforeNodeRestoredEvent``
- ``OCP\Files\Events\Node\BeforeNodeRenamedEvent``

.. code-block:: json

   {
     "event": "NodeRestoredEvent",
     "source": {
       "id": 399,
       "path": "/admin/files/Deleted/myfile.txt"
     },
     "target": {
       "id": 437,
       "path": "/admin/files/myfile.txt"
     }
   }

Where:

- ``"source"`` is an object representing the original node, with ``"id"`` (integer) and ``"path"`` (string)
- ``"target"`` is an object representing the resulting/copied/restored/renamed node, with ``"id"`` (integer) and ``"path"`` (string)

.. note::

   For some two-node events, the ``source`` or ``target`` node may not have an ``id`` field, for instance if the node was deleted or is otherwise missing from the filesystem. Always check for the presence of the ``id`` field in these objects. Typically, if you need the ``id`` of a node just before deletion or change, the respective ``Before*`` event (such as ``BeforeNodeRenamedEvent``) will include it.

Example of a two-node event (NodeRenamedEvent) where the source node is missing:

.. code-block:: json

   {
     "event": "NodeRenamedEvent",
     "source": {
       "path": "/user/files/previousname.txt"
     },
     "target": {
       "id": 599,
       "path": "/user/files/newname.txt"
     }
   }

.. note::

   Only these fields are guaranteed by Nextcloud core. Additional fields may appear if added by custom plugins or future versions.

System Tag Events
~~~~~~~~~~~~~~~~~

* ``OCP\SystemTag\TagAssignedEvent``
* ``OCP\SystemTag\TagUnassignedEvent``

.. code-block:: json

   {
     "event": "TagAssignedEvent",
     "objectType": "files",
     "objectIds": ["437","438"],
     "tagIds": [3,17]
   }

Calendar Object Events
~~~~~~~~~~~~~~~~~~~~~~

Calendar object events use two distinct payload formats, depending on the event.

**Standard payload**

Applies to:

- ``OCP\Calendar\Events\CalendarObjectCreatedEvent``
- ``OCP\Calendar\Events\CalendarObjectDeletedEvent``
- ``OCP\Calendar\Events\CalendarObjectMovedToTrashEvent``
- ``OCP\Calendar\Events\CalendarObjectRestoredEvent``
- ``OCP\Calendar\Events\CalendarObjectUpdatedEvent``

.. code-block:: json

   {
     "event": "CalendarObjectCreatedEvent",
     "user": {
       "uid": "david",
       "displayName": "David"
     },
     "time": 1700100000,
     "eventData": {
       "calendarId": 9,
       "calendarData": {
         "id": 9,
         "uri": "work",
         "{http://calendarserver.org/ns/}getctag": "1736283",
         "{http://sabredav.org/ns}sync-token": 9651,
         "{urn:ietf:params:xml:ns:caldav}supported-calendar-component-set": "VEVENT,VTODO",
         "{urn:ietf:params:xml:ns:caldav}schedule-calendar-transp": "opaque"
       },
       "shares": [
         {
           "href": "mailto:alice@example.com",
           "commonName": "Alice",
           "status": 2,
           "readOnly": false,
           "{http://owncloud.org/ns}principal": "principal:users/alice",
           "{http://owncloud.org/ns}group-share": false
         }
       ],
       "objectData": {
         "id": 22,
         "uri": "event-20251111T100000Z.ics",
         "lastmodified": 1700099500,
         "etag": "19fa45b394",
         "calendarid": 9,
         "size": 4096,
         "component": "VEVENT",
         "classification": 0
       }
     }
   }

**Distinct payload for two-calendar events**

Applies to:

- ``OCP\Calendar\Events\CalendarObjectMovedEvent``

.. code-block:: json

   {
     "event": "CalendarObjectMovedEvent",
     "sourceCalendarId": 9,
     "sourceCalendarData": {
       "id": 9,
       "uri": "work"
     },
     "targetCalendarId": 11,
     "targetCalendarData": {
       "id": 11,
       "uri": "meetings"
     },
     "sourceShares": [
       {
         "href": "mailto:alice@example.com",
         "commonName": "Alice"
       }
     ],
     "targetShares": [
       {
         "href": "mailto:bob@example.com",
         "commonName": "Bob"
       }
     ],
     "objectData": {
       "id": 22,
       "uri": "event-20251111T100000Z.ics"
     }
   }

Forms App Events
~~~~~~~~~~~~~~~~

When the optional ``forms`` app is installed:

* ``OCA\Forms\Events\FormSubmittedEvent``

.. code-block:: json

   {
     "event": "FormSubmittedEvent",
     "user": {
       "uid": "bob",
       "displayName": "Bob"
     },
     "time": 1700001234,
     "eventData": {
       "class": "OCA\\Forms\\Events\\FormSubmittedEvent",
       "form": {
         "id": 51,
         "hash": "abc123def456",
         "title": "Employee Feedback",
         "description": "Annual employee feedback form.",
         "ownerId": "alice",
         "fileId": 1002,
         "fileFormat": "pdf",
         "created": 1700001000,
         "access": 0,
         "expires": 1702606600,
         "isAnonymous": false,
         "submitMultiple": false,
         "showExpiration": true,
         "lastUpdated": 1700001200,
         "submissionMessage": null,
         "state": 1
       },
       "submission": {
         "id": 220,
         "formId": 51,
         "userId": "bob",
         "timestamp": 1700001234
       }
     }
   }

Tables App Events
~~~~~~~~~~~~~~~~~

When the optional ``tables`` app is installed:

- ``OCA\Tables\Event\RowAddedEvent``
- ``OCA\Tables\Event\RowDeletedEvent``
- ``OCA\Tables\Event\RowUpdatedEvent``

.. code-block:: json

   {
     "event": "RowAddedEvent",
     "user": {
       "uid": "carol",
       "displayName": "Carol"
     },
     "time": 1700054321,
     "eventData": {
       "class": "OCA\\Tables\\Event\\RowAddedEvent",
       "tableId": 34,
       "rowId": 7,
       "previousValues": null,
       "values": {
         "0": "Project X",
         "1": 2025,
         "2": "active"
       }
     }
   }

.. note::

   For filtering or automation, always check the actual payload you receive, as it matches the JSON examples above, not PHPDoc or internal PHP array type style.
