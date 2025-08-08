==================================
App: Context Agent (context_agent)
==================================

.. _ai-app-context_agent:

The *context_agent* app is the app that provides AI agent functionality in Nextcloud and acts as a backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>`. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

When the Context Agent app is installed the AI Chat in Nextcloud Assistant will be able to interact with your Nextcloud apps via virtual integrations that are called "tools". They allow the Assistant to perform actions in your Nextcloud upon sending instructions in a chat message.
Tool groups are only available if their requirements are met. They can be en- and disabled in the AI admin settings.

Currently implemented tools:

* List the user's calendars

  * Example prompt: *"List my calendars"*

* List the user's talk conversations (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"List my talk conversations"*

* List messages in a talk conversation (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"List the latest messages in my conversation with Andrew"*

* Send a message to a talk conversation (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"Can you send a joke to Andrew in talk?"*

* Create a public talk conversation (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"Can you create a new public talk conversation titled 'Press conference'?"*

* Find a person in the user's contacts

  * Example prompt: *"What is Andrew's Email address?"*

* Find the current user's details

  * Example prompt: *"Where do I live?"*

* Ask a question to context chat (requires :ref:`Context Chat<ai-app-context_chat>`)

  * Example prompt: *"What is the company's sick leave process?"*

* Transcribe a media file (requires Transcribe audio task type enabled)

  * Example prompt: *"Can you transcribe the following file? https://mycloud.com/f/9825679"* (Can be selected via smart picker.)

* Generate documents (requires `Nextcloud Office <https://apps.nextcloud.com/apps/richdocuments>`_)

  * Example prompt: *"Can you generate me a slide deck for my presentation about cats?"*
  * Example prompt: *"Can you generate me a spreadsheet with some plausible numbers for countries and their population count?"*
  * Example prompt: *"Can you generate me a pdf with an outline about what to see in Berlin?"*

* Generate images (requires Image generation task type enabled)

  * Example prompt: *"Can you generate me an image of a cartoon drawing of a roman soldier typing something on a laptop?"*

* Get coordinates for an Address from Open Street Maps Nomatim

  * Example prompt: *"What are the coordinates for Berlin, Germany?"*

* Get the URL for a map of a location using Open Street Maps

  * Example prompt: *"Can you show me a map of New York, please"*

* Get the current weather at a location

  * Example prompt: *"How is the weather in Berlin?"*

* Schedule an event in the user's calendar

  * Example prompt: *"Schedule an event with Andrew tomorrow at noon."*

* Find free times in users' calendar

  * Example prompt: *"Find a free 1-hour slot for a meeting with me and Marco next week."*

* Create a deck card (requires `Deck <https://apps.nextcloud.com/apps/deck>`_)

  * Example prompt: *"Create a deck card for 'Buy Groceries' in my Personal board."*

* Access information in deck boards (requires `Deck <https://apps.nextcloud.com/apps/deck>`_)

  * Example prompt: *"Which deck cards are currently in the To do list in my Personal board?"*

* Create a task

  * Example prompt: *"Create a task for 'Renovate flat' in my Personal calendar. The task should be due Monday next week."*

* Search for youtube videos

  * Example prompt: *"Show me the youtube video of the Nextcloud hub 10 launch."*

* Search Duckduckgo

  * Example prompt: *"Show me search results for quick pasta recipes, please."*

* Send an email via Nextcloud Mail (requires `Mail <https://apps.nextcloud.com/apps/mail>`_)

  * Example prompt: *"Send a test email from my carry@company.com account to Andrew@company.com"*

* Get contents of a file

  * Example prompt: *"Can you summarize the following file in my documents? Design/Planning.md"*

* Generate a public share link for a file

  * Example prompt: *"Can create a share link for the following file in my documents? Design/Planning.md"*

* Get the folder tree of the user's files

  * Example prompt: *"Can you show me the folder tree of my files?"*

* Determine public transport routes (requires a `HERE <https://www.here.com/>`_ API key configured in the admin settings)

  * Example prompt: *"How can I get from Würzburg Hauptbahnhof to Berlin Hauptbahnhof?"*

* List all projects in OpenProject (requires the `OpenProject integration <https://apps.nextcloud.com/apps/integration_openproject>`_)

  * Example prompt: *"List all my projects in OpenProject, please"*

* List all available assignees of a project in OpenProject (requires the `OpenProject integration <https://apps.nextcloud.com/apps/integration_openproject>`_)

  * Example prompt: *"List all available assignees for the 'Product launch' project in OpenProject"*

* Create a new work package in a given project in OpenProject (requires the `OpenProject integration <https://apps.nextcloud.com/apps/integration_openproject>`_)
  * Example prompt: *"Create a work package called 'Publish release video' in the 'Product launch' project in OpenProject"*


These tools can also be combined by the agent to fulfil tasks like the following:

 * *"How is the weather where Andrew lives?"*

  * Uses contacts to look up Andrew's address and then checks the weather

 * *"How is the weather where I live?"*

  * Look up the current user's address and then checks the weather

 * *"Send an email from carry@company.com to Andrew"*

  * Uses contacts to look up Andrew's email and then sends an email

Custom Tools using MCP
-----------------------

Model Context Protocol (MCP) is a protocol that enables Large Language Models (LLMs) to interact with external data sources and tools.
The Context Agent app allows administrators to extend its capabilities by adding custom services via MCP. This can be configured in the admin settings under "MCP Config," where you can provide a JSON configuration in the following format:

.. code-block:: json

  {
    "service-name": {
      "url": "https://service-url.com/endpoint",
      "transport": "streamable_http"
    }
  }

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

This app requires underlying Large language models to support tool calling. The default model in *llm2* does support tool calling since version 2.4.0.
Other models that may give good results are:

* Google Gemma 3 12B or higher
* Mistral 3 small 24B
* Qwen 2.5 8B or higher (May not work well with languages other than English)
* Watt Tool 8B or higher

See :ref:`llm2 documentation <ai-app-llm2>` on how to configure alternate models.

Using Nextcloud MCP Server
--------------------------

Context Agent exposes an MCP server that can be used by other large language models or applications to access the tools provided by Context Agent.
The server will be available at `https://your-nextcloud-domain.com/index.php/apps/app_api/proxy/context_agent/mcp/`, and
it requires authentication via an app password passed in the `Authorization` header. Ex: `Authorization: Bearer <app-password>`.

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
* Most models have difficulties with languages other than English. Some sometimes answer in another language than used by the user. 
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. 
  Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI). We still try to optimize this as far as possible, so if you encounter any false or problematic output, you can report it `in a dedicated Github issue <https://github.com/nextcloud/context_agent/issues/51>`_ to help us improve this app. 
* When multiple MCP services are configured that have tools with the same name undefined behavior will occur.
* Only remote MCP services are supported (streamable_http transport).
* MCP services that require different access tokens for each user are not currently supported.