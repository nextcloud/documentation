.. _automation_overview:

=======================
Automation in Nextcloud
=======================

There are different options to orchestrate automations in and with Nextcloud:

- :ref:`Flow<file_workflows>` is a workflow engine included in Nextcloud to automate and streamline internal workflows. It can be used by both users for individual needs and administrators to set system-wide flows.
- With the `Windmill integration app <https://apps.nextcloud.com/apps/integration_windmill>`_ admin users can :ref:`connect a Windmill instance to Nextcloud<windmill_workflows>` and orchestrate all flows and apps in Windmill.
- The :ref:`webhook implementation<webhook_listeners>` allows administrators to set up webhooks that trigger actions in an external workflow orchestration software of their own choosing, e.g. Kestra, n8n or :ref:`Budibase<budibase_workflows>`.


.. note::
  The External App Nextcloud Flow including a Windmill implementation is deprecated since Nextcloud 33 and not supported anymore. For documentation on this app, please refer to the corresponding documentation version.

