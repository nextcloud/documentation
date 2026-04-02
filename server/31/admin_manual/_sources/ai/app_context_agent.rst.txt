==================================
App: Context Agent (context_agent)
==================================

.. _ai-app-context_agent:

The *context_agent* app is the app that provides AI agent functionality in Nextcloud and acts as a backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>`. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

When the Context Agent app is installed the AI Chat in Nextcloud Assistant will be able to interact with your Nextcloud apps via virtual integrations that are called "tools".

Currently implemented tools:

* List the user's calendars

  * Example prompt: *"List my calendars"*

* List the user's talk conversations

  * Example prompt: *"List my talk conversations"*

* List messages in a talk conversation

  * Example prompt: *"List the latest messages in my conversation with Andrew"*

* Find a person in the user's contacts

  * Example prompt: *"What is Andrew's Email address?"*

* Ask a question to context chat

  * Example prompt: *"What is the company's sick leave process?"*

* Get coordinates for an Address from Open Street Maps Nomatim

  * Example prompt: *"List my calendars"*

* Get the current weather at a location

  * Example prompt: *"How is the weather in Berlin?"*

* Schedule an event in the user's calendar

  * Example prompt: *"Make schedule an event with Andrew tomorrow at noon."*

* Send a message to a talk conversation

  * Example prompt: *"Can you send a joke to Andrew in talk?"*

* Send an email via Nextcloud Mail

  * Example prompt *"Send a test email from carry@company.com to Andrew@company.com from my account with id 12"*
  * (The account ID will soon be irrelevant)

These tools can also be combined by the agent to fulfil tasks like the following:

 * *"How is the weather where Andrew lives?"*

  * Uses contacts to look up Andrew's address and then checks the weather

 * *"Send an email from carry@company.com to Andrew"*

  * Uses contacts to look up Andrew's email and then sends an email

Requirements
------------

* This app is built as an External App and thus depends on AppAPI v3.1.0 or higher
* Nextcloud AIO is supported
* No GPU is necessary for Context Agent but one might be useful if you use it with a self-hosted provider like llm2

* CPU Sizing

   * At least 1GB of system RAM

Installation
------------

0. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
1. :ref:`Install AppAPI and setup a Deploy Demon<ai-app_api>`
2. Install the "Context Agent" ExApp via the "Apps" page in the Nextcloud web admin user interface
3. Install a text generation backend like :ref:`llm2 <ai-app-llm2>` or :ref:`integration_openai <ai-ai_as_a_service>` via the "Apps" page in Nextcloud


Model requirements
~~~~~~~~~~~~~~~~~~

This app requires underlying Large language models to support tool calling. The default model in *llm2* does *not* support tool calling. Instead we recommend:

* Qwen 2.5 8B or higher (May not work well with languages other than English)
* Watt Tool 8B or higher

See :ref:`llm2 documentation <ai-app-llm2>` on how to configure alternate models.

Scaling
-------

It is currently not possible to scale this app, we are working on this.

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/context_agent>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/context_agent>`_

Nextcloud customers should file bugs directly with our Support system.

Known Limitations
-----------------
* Make sure to test the language model you are using in concert with this app for whether they meet the use-case's quality requirements
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)