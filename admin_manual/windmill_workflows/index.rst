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

Selecting the right Workspace
-----------------------------

With Windmill installed as an ExApp, the first time one visits Windmill's web interface, make sure to select the right workspace on the first run: Only the pre-existing "nextcloud" workspace is hooked up to nextcloud's internal event system, all other workspaces will need manual webhook setups for each workflow.
If the wrong workspace is selected on the first run, it is always possible to switch workspace later in the left sidebar.

Building a workflow
-------------------

Each workflow in Windmill is a listener to a Nextcloud Webhook Event. If you are using the ExApp-packaged Windmill, it will automatically register webhooks for the workflows you build using the following mechanism. If you are not using the ExApp-packaged windmill install then you will have to register webhooks for your workflows manually via the webhook_listeners API: see https://docs.nextcloud.com/server/latest/developer_manual/_static/openapi.html#/operations/webhook_listeners-webhooks-index

The magic listener script
~~~~~~~~~~~~~~~~~~~~~~~~~

The first script (after the "Input" block) in any workflow you build that should listen to a Nextcloud webhook must be ``CORE:LISTEN_TO_EVENT``. It must be an empty script with two parameters that you should fill statically: ``events``, which is a list of event IDs to listen to and ``filters`` a filter condition that allows more fine grained filtering for which events should be used. The filter condition as well as the available events with their payloads is documented in :ref:`the webhook_listeners documentation<webhook_listeners>`.

Nextcloud Scripts
-----------------

Nextcloud makes available a variety of scripts to be used in Windmill for interfacing with Nextcloud apps. You can find them
at https://hub.windmill.dev/integrations/nextcloud and https://hub.windmill.dev/integrations/nextcloud/approvals or in your windmill instance when selecting existing scripts for creating a new workflow.

Authentication
~~~~~~~~~~~~~~

All bricks have the option to use "AppAPI Authentication" or normal authentication using a Nextcloud resource in Windmill. When using normal authentication you will need to provide the correct password or app password of the user on behalf of whom you want to execute the script. When using "AppAPI Authentication" you can impersonate any Nextcloud user. This will only work when using the ExApp-packaged version of windmill.

Passing values between blocks
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When specifying script inputs you can either fill the parameters with static values or make references to the workflow input and the previous workflow steps.

In order to reference the workflow input, use the ``flow_input`` variable. For example, ``flow_input.event.form.hash`` will reference the hash of a form from a nextcloud Forms event.

In order to reference results from previous steps in your parameters, use the ``results`` variable with the id of the step to reference as a sub property. For example, ``results.e.submission.answers`` to use the answers of of a form submission retrieved via the script identified with the letter "e" (A letter identifier is automatically assigned to each script in a workflow).

Approval/Suspend steps
~~~~~~~~~~~~~~~~~~~~~~

Windmill allows using so-called approval steps, which are essentially asynchronous scripts that wait for the call to an additional webhook URL. The most prominent use case for this are approval workflows where you get automated input from somewhere which needs to be approved by a human. Once the human approves or disapproves by triggering the webhook URL the workflow will resume.

Using the scripts provided for Nextcloud, you can send approval links to the humans in charge of approving via Nextcloud Talk or a simple notification in Nextcloud. Of course, you may also use any of the other scripts for sending messages available in the Windmill hub.
