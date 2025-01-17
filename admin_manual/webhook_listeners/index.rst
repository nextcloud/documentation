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

Note: When authenticating with the OCS API to register webhooks the account you authenticate as must have administrator rights or delegated administrator rights.

Filters
~~~~~~~

When registering a webhook listener, you can specify a filter parameter. The value of this parameter must be a JSON object whose properties represent filter conditions. The ``{}`` is an empty query, meaning no specific criteria, so all events are matched.

If you would like to match events fired by a specific user, you can pass ``{ "user.uid": "bob" }`` to match all events fired in the context of user ``"bob"``.

If you would like to enforce multiple criteria, you can simply pass multiple properties ``{ "event.tableId": 42, "event.rowId": 3 }``

You can also use additional comparison operators (``$eq, $ne, $gt, $gte, $lt, $lte, $in, $nin``) as well as logical operators (``$and, $or, $not, $nor``). For example use ``{ "time" : { "$lt": 1711971024 } }`` to accept only events prior to April 1st 2024 and ``{ "time" : { "$not": { "$lt": 1711971024 } } }`` to accept events after April 1st 2024.

Speeding up webhook dispatch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This app uses background jobs to trigger the registered webhooks. Thus, by default, webhooks will be triggered only every 5 minutes, as the default cron interval is 5 minutes.
To trigger webhooks earlier, you can set up a background job worker. The following command will launch a worker for the webhook call background job:

Screen or tmux session
^^^^^^^^^^^^^^^^^^^^^^

Run the following occ command inside a screen or a tmux session, preferably 4 or more times for parallel processing of multiple requests by different or the same user.
It would be best to run one command per screen session or per tmux window/pane to keep the logs visible and the worker easily restartable.

.. code-block::

   set -e; while true; do sudo -u www-data occ background-job:worker -v -t 60 "OCA\WebhookListeners\BackgroundJobs\WebhookCall"; done

For Nextcloud-AIO you should use this command on the host server.

.. code-block::

   set -e; while true; do sudo docker exec -u www-data -it nextcloud-aio-nextcloud php occ background-job:worker -v -t 60 "OCA\WebhookListeners\BackgroundJobs\WebhookCall"; done

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
   sudo -u www-data php occ background-job:worker -t 60 'OCA\WebhookListeners\BackgroundJobs\WebhookCall'

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

This is an exhaustive list of available events. It features the event ID and the available variables for filtering.

 * OCA\\Forms\\Events\\FormSubmittedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "form": array{
         "id": int,
         "hash": string,
	 "title": string,
	 "description": string,
	 "ownerId": string,
	 "fileId": string|null,
	 "fileFormat": string|null,
	 "created": int,
	 "access": int,
	 "expires": int,
	 "isAnonymous": bool,
	 "submitMultiple": bool,
	 "showExpiration": bool,
	 "lastUpdated": int,
	 "submissionMessage": string|null,
	 "state": int,
        },
        "submission": array{
          "id": int,
	  "formId": int,
	  "userId": string,
	  "timestamp": int,
        },
      }
    }

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

 * OCP\\Files\\Events\\Node\\BeforeNodeTouchedEvent

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

 * OCP\\Files\\Events\\Node\\BeforeNodeReadEvent

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

 * OCP\\Files\\Events\\Node\\NodeCreatedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\NodeTouchedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\NodeWrittenEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\NodeReadEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\NodeDeletedEvent

  .. code-block:: text

    array{
      "user": array {"uid": string, "displayName": string},
      "time": int,
      "event": array{
        "class": string,
        "node": array{"id": string, "path": string}
      }
    }

 * OCP\\Files\\Events\\Node\\NodeCopiedEvent

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

 * OCP\\Files\\Events\\Node\\NodeRestoredEvent

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

 * OCP\\Files\\Events\\Node\\NodeRenamedEvent

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

 * OCP\\Files\\Events\\Node\\BeforeNodeCopiedEvent

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

 * OCP\\Files\\Events\\Node\\BeforeNodeRestoredEvent

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
