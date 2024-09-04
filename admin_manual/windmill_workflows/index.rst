==================
Windmill Workflows
==================

Nextcloud integrates the Windmill workflow engine (https://www.windmill.dev/) to allow advanced custom workflows interacting with your Nextcloud instance.

Installation
------------

 * Install Windmill

   * Either as a standalone install or via the Windmill External App in Nextcloud (see :ref:`External Apps<ai-app_api>`)

 * Enable the ``webhook_listeners`` app that comes with Nextcloud

.. code-block:: bash

   occ app:enable webhook_listeners

Building a workflow
-------------------

Each workflow in windmill is a listener to a Nextcloud Webhook Event. If you are using the ExApp-packaged windmill, it will automatically register webhooks for the workflows you build using the following mechanism. If you are not using the ExApp-packaged windmill install then you will have to register webhooks for your workflows manually via the webhook_listeners API: see https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/webhook_listeners-webhooks-index

The magic listener script
~~~~~~~~~~~~~~~~~~~~~~~~~

The first script in any workflow you build that should listen to a nextcloud webhook must be ``CORE:LISTEN_TO_EVENT``. It must be an empty script with two parameters that you should fill statically: ``events``, which is a list of event IDs to listen to and ``filters`` a filter condition that allows more fine grained filtering for which events should be used. The filter condition as well as the available events with their payloads is documented in :ref:`the webhook_listeners documentation<webhook_listeners>`.

Nextcloud Scripts
-----------------

Nextcloud makes available a variety of scripts to be used in Windmill for interfacing with Nextcloud apps. You can find them
at https://hub.windmill.dev/ or in your windmill instance when selecting existing scripts for creating a new workflow.

Authentication
~~~~~~~~~~~~~~

All bricks have the option to use "AppAPI Authentication" or normal authentication using a Nextcloud resource in Windmill. When using normal authentication you will need to provide the correct password or app password of the user on behalf of whom you want to execute the script. When using "AppAPI Authentication" you can impersonate any Nextcloud user. This will only work when using the ExApp-packaged version of windmill.
