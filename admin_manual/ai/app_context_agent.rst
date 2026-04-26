==================================
App: Context Agent (context_agent)
==================================

.. _ai-app-context_agent:

The *context_agent* app is the app that provides AI agent functionality in Nextcloud's "Chat with AI" feature and acts as a backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>`. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

When the Context Agent app is installed the AI Chat in Nextcloud Assistant will be able to interact with your Nextcloud apps via virtual integrations that are called "tools". They allow the Assistant to perform actions in your Nextcloud upon sending instructions in a chat message.
Tool groups are only available if their requirements are met. They can be en- and disabled in the AI admin settings.

Currently implemented tools
---------------------------

Artificial intelligence tools
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

Calendar tools
~~~~~~~~~~~~~~

* List the user's calendars

  * Example prompt: *"List my calendars"*

* Schedule an event in the user's calendar

  * Example prompt: *"Schedule an event with Andrew tomorrow at noon."*

* Find free times in users' calendar

  * Example prompt: *"Find a free 1-hour slot for a meeting with me and Marco next week."*

Tasks tools
~~~~~~~~~~~

* Create a task

  * Example prompt: *"Create a task for grocery shopping with due date tomorrow."*

* List tasks

  * Example prompt: *"List my outstanding tasks"*

* Complete a task

  * Example prompt: *"Mark the grocery shopping task as completed."*

* Update a task's details

  * Example prompt: *"Change the priority of the grocery shopping task to the highest possible priority."*
  * Example prompt: *"Change the due date of my work report task to the beginning of next week."*

* Delete a task

  * Example prompt: *"Delete the grocery shopping task in my tasks."*


Circles/teams tools
~~~~~~~~~~~~~~~~~~~

* List circles

  * Example prompt: *"List all my teams."*

* List circle members

  * Example prompt: *"List all members of my Content Marketing team."*

* Create new circle

  * Example prompt: *"Create a new team called 'Hiking group'."*

* Add members to circles

  * Example prompt: *"Add Ralph to the Hiking group team."*

* Remove members from circles

  * Example prompt: *"Remove ralph from the Hiking group team."*

* Change circle details

  * Example prompt: *"Change the name of the Hiking group team to 'Outdoor group'."*
  * Example prompt: *"Add the following description to the Hiking group team: We go hiking together once a month. Come join us."*

* Delete a circle

  * Example prompt: *"Delete the Hiking group team."*

* Share a file with a circle

  * Example prompt: *"Share my Hiking plans.md file with the Hiking group team."*


Contacts tools
~~~~~~~~~~~~~~

* Find a contact

  * Example prompt: *"What is Anna's email address?"*

* Find a user's ID

  * Example prompt: *"What is Ralph's userID?"*

* Find the current user's details

  * Example prompt: *"Where do I live?"*

Cookbook tools
~~~~~~~~~~~~~~

* List recipes

  * Example prompt: *"List my recipes."*

* Search for recipes

  * Example prompt: *"Do I have any Spaghetti recipes?"*

* Get recipe details

  * Example prompt: *"Can you give me the details of my Spaghetti Carbonara recipe?"*

* Create a new recipe

  * Example prompt: *"Create a recipe for Guacamole in my cookbook."*

* Delete a recipe

  * Example prompt: *"Remove the Guacamole recipe from my cookbook."*

* List recipe categories

  * Example prompt: *"Which recipe categories do I have in my cookbook?"*

Deck tools
~~~~~~~~~~

* List deck boards

  * Example prompt: *"List the deck boards I have access to."*

* Add a new card

  * Example prompt: *"Can you add a card with title 'Repair kitchen sink' to my Personal deck board?"*

* Add a label to a card

  * Example prompt: *"Can you add the label 'Urgent' to the 'repair kitchen sink' card in my personal deck board?"*

* Assign a card to a user

  * Example prompt: *"Can you assign the 'Repair kitchen sink' card in my Personal deck board to Andrew?"*

* Delete a card

  * Example prompt: *"Delete the 'Repair kitchen sink' card in my Personal deck board."*

Files tools
~~~~~~~~~~~

* Get contents of a file

  * Example prompt: *"Can you fetch the following file in my documents? Design/Planning.md"*
  * Example prompt: *"Can you fetch the following file in my documents? https://mycloud.com/f/98543234"*

* Retrieve folder tree

  * Example prompt: *"List my files."*

* Create a public link for a file or folder

  * Example prompt: *"Create a public link for the following file: Design/Planning.md"*

* Create a new file

  * Example prompt: *"Create a new file Ideas.md in my files and fill it with ideas for hiking destinations in the black forest."*

* Create a new folder

  * Example prompt: *"Create a new folder 'Hiking plans' in my files."*

* Move a file

  * Example prompt: *"Move the Ideas.md file into the Hiking plans folder."*

* Copy a file

  * Example prompt: *"Copy the Ideas.md file into my Notes folder."*

* Delete a file

  * Example prompt: *"Delete the Ideas.md file."*

Forms tools
~~~~~~~~~~~

* List all forms

  * Example prompt: *"List all the forms I have access to."*

* Get details of a form

  * Example prompt: *"Can you give me all details about the Retreat signup form?"*

* Add a question to a form

  * Example prompt: *"Add the following question to the retreat signup form: 'Number of days attending'."*

* Retrieve all responses of a form

  * Example prompt: *"List all responses to the Retreat signup form."*

* Update form settings

  * Example prompt: *"Make the Retreat signup form expire end of next week."*

* Delete a form

  * Example prompt: *"Delete the Retreat signup form."*

Search tools
~~~~~~~~~~~~
All search providers in Nextcloud are also automatically available as tools.

* Search for files

  * Example prompt: *"List all the powerpoint presentations in my files with file ending pptx."*

Share tools
~~~~~~~~~~~

* List shares

  * Example prompt: *"List all files that were shared with me."*
  * Example prompt: *"List the shares of the Design/Ideas.md file."*

* Share a file or folder with a user

  * Example prompt: *"Share the Design/Ideas.md file with the user martin."*

* Share a file or folder with a group

  * Example prompt: *"Share the Design/Ideas.md file with the group Designers."*

* Update a share's permissions

  * Example prompt: *"Only allow martin read only access on the share of the Design/Ideas.md file."*

* Delete a share

  * Example prompt: *"Remove the share of the Design/Ideas.md file with martin."*

* List user groups

  * Example prompt: *"Which user groups are there?"*

* Retrieve share details

 * Example prompt: *"Does martin have write access to the Design/Ideas.md file I shared with him?"*


Talk tools
~~~~~~~~~~

* List the user's talk conversations (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"List my talk conversations"*

* List messages in a talk conversation (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"List the latest messages in my conversation with Andrew"*

* Send a message to a talk conversation (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"Can you send a joke to Andrew in talk?"*

* Create a public talk conversation (requires `Talk <https://apps.nextcloud.com/apps/spreed>`_)

  * Example prompt: *"Can you create a new public talk conversation titled 'Press conference'?"*

Miscellaneous tools
~~~~~~~~~~~~~~~~~~~

* Get coordinates for an Address from Open Street Maps Nomatim

  * Example prompt: *"What are the coordinates for Berlin, Germany?"*

* Get the URL for a map of a location using Open Street Maps

  * Example prompt: *"Can you show me a map of New York, please"*

* Get the current weather at a location

  * Example prompt: *"How is the weather in Berlin?"*

* Search for youtube videos

  * Example prompt: *"Show me the youtube video of the Nextcloud hub 10 launch."*

* Search Duckduckgo

  * Example prompt: *"Show me search results for quick pasta recipes, please."*

* Send an email via Nextcloud Mail (requires `Mail <https://apps.nextcloud.com/apps/mail>`_)

  * Example prompt: *"Send a test email from my carry@company.com account to Andrew@company.com"*

* Determine public transport routes (requires a `HERE <https://www.here.com/>`_ API key configured in the admin settings)

  * Example prompt: *"How can I get from Würzburg Hauptbahnhof to Berlin Hauptbahnhof?"*

* List all projects in OpenProject (requires the `OpenProject integration <https://apps.nextcloud.com/apps/integration_openproject>`_)

  * Example prompt: *"List all my projects in OpenProject, please"*

* List all available assignees of a project in OpenProject (requires the `OpenProject integration <https://apps.nextcloud.com/apps/integration_openproject>`_)

  * Example prompt: *"List all available assignees for the 'Product launch' project in OpenProject"*

* Create a new work package in a given project in OpenProject (requires the `OpenProject integration <https://apps.nextcloud.com/apps/integration_openproject>`_)
  * Example prompt: *"Create a work package called 'Publish release video' in the 'Product launch' project in OpenProject"*


Combining tools
---------------

These tools can also be combined by the agent to fulfil tasks like the following:

 * *"How is the weather where Andrew lives?"*

  * Uses contacts to look up Andrew's address and then checks the weather

 * *"How is the weather where I live?"*

  * Look up the current user's address and then checks the weather

 * *"Send an email from carry@company.com to Andrew"*

  * Uses contacts to look up Andrew's email and then sends an email

* *"Which of my files are from Anna?"*

  * Looks up Anna's userID and searches for files that belong to her

* *"Send the content of my draft.md file to Andrew in Talk"*

  * Gets the content of the file and sends it in a 1-1 Talk conversation with Andrew

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
