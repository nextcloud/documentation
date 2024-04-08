==========================================
App: SummarAI (Talk chat summarize bot)
==========================================

.. _ai-app-summarai:

The *SummarAI* app is one of the apps that utilize the llm or any other configured llm provider in Nextcloud and act as a configurable bot for `Nextcloud Talk`.
The *SummarAI* app can be running on only open source models, on-premise or any configured llm provider and does so entirely on-premises.
Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

The app currently supports the following languages:

* English (en)

As the models are entirely open source, the quality of translations may not be comparable to commercially available services.

Requirements
------------

* Minimal Nextcloud version: 27
* x86 CPU
* Docker
* AppAPI >= 2.3.2
* Talk
* Assistant
* Local large language model

Space usage
~~~~~~~~~~~

 * ~100MB

Installation
------------

0. Make sure the following apps are installed:

   `Nextcloud AppAPI app <https://apps.nextcloud.com/apps/app_api>`_

   `Nextcloud Talk app (Spreed) <https://apps.nextcloud.com/apps/spreed>`_

   :ref:`Nextcloud Assistant app<ai-app-assistant>`

   One of the following AI model providers:

   `Nextcloud Local large language model app <https://apps.nextcloud.com/apps/llm>`_

   `Nextcloud OpenAI and LocalAI integration app <https://apps.nextcloud.com/apps/integration_openai>`_


Setup (via App Store)
~~~~~~~~~~~~~~~~~~~~~

1. Install the *SummarAI* app via the "Apps" page in Nextcloud

2. Enable the *SummarAI* Bot for the selected Chatroom via the three dots menue of the Chatroom (The Bots settings are located inside the *Bot Section*)

Setup (Manual)
~~~~~~~~~~~~~~

After cloning this app *manually* (cloned via git to your apps directory) you will need to execute the following steps:

1. Change to the folder you have cloned the source to:
.. code-block::

   cd  /path/to/your/nextcloud/webroot/apps/summarai/


2. Build the docker image:
.. code-block::

   docker build --no-cache -f Dockerfile -t ghcr.io/nextcloud/summarai:latest .  

3. Run the docker image:

*Info:*

- APP_VERSION environmet variable should be equal to the version of the *SummarAI Bot* you are using

- NEXTCLOUD_URL environment variable must be set to your Nextcloud instance's URL, ensuring it's reachable by the docker image.

.. code-block::

   sudo docker run -ti -v /etc/localtime:/etc/localtime:ro -v /etc/timezone:/etc/timezone:ro -e APP_ID=summarai -e APP_HOST=0.0.0.0 -e APP_PORT=9031 -e APP_SECRET=12345 -e APP_VERSION=1.0.0 -e NEXTCLOUD_URL='<YOUR_NEXTCLOUD_URL_REACHABLE_FROM_INSIDE_DOCKER>' -p 9031:9031 ghcr.io/nextcloud/summarai:latest


4. Un-register the SummarAI Bot if its already installed

.. code-block::

   sudo -u <the_user_the_webserver_is_running_as> php /path/to/your/nextcloud/webroot/occ app_api:app:unregister summarai
   

5. Register the SummarAI Bot so that your Nextcloud instance is aware of it

*Info:* Adjust the host value in the following example to the IP the docker image can reache your nextcloud instance on

.. code-block::

   sudo -u <the_user_the_webserver_is_running_as> php ./occ app_api:app:register summarai manual_install --json-info '{ "id": "summarai", "name": "SummarAI", "daemon_config_name": "manual_install", "version": "1.0.0", "secret": "12345", "host": "192.168.0.199", "port": 9031, "scopes": ["AI_PROVIDERS", "NOTIFICATIONS", "TALK", "TALK_BOT", "TEXT_PROCESSING"], "protocol": "http", "system": 1}' --force-scopes --wait-finish


6. Enable the *SummarAI* Bot for the selected Chatroom via the three dots menue of the Chatroom (The Bots settings are located inside the *Bot Section*)

Usage
-----

- After enabling the *SummarAI* Bot in a Chatroom, you can test its functionality by simply sending the message below:

   - @summarai

   > Hi! I am here and listening

- A full list of the available commands can be received via this message

   - @summarai help

- Add a SummarAI job (The job will be executed daily at the same time):

   - @summarai add <hour>:<minute>

- List scheduled SummarAI jobs:

   - @summarai list

- Delete a SummarAI job:

   - @summarai delete <job_id>

- Prints a help message:

   - @summarai help


App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/summarai>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/sumupbot>`_

Nextcloud customers should file bugs directly with our Customer Support.

Ethical AI Rating
-----------------

The ethical rating of the *SummarAI Bot*, which utilizes a model for text processing through the Nextcloud Assistant app, is significantly influenced by the choice and implementation of the underlying model.

Learn more about the Nextcloud Ethical AI Rating `in our blog<https://nextcloud.com/blog/nextcloud-ethical-ai-rating/>`.

Known Limitations
-----------------

* The SummarAI Bot cannot access previous conversations, it only recognizes messages from the moment it was enabled in the chatroom.
* Restarting the server or the SummarAI Docker image will erase any knowledge of messages and added jobs, as they are not persistently stored.
* Instructional models may occasionally produce inaccurate information. Therefore, they should be employed with caution in non-critical scenarios. It's essential to verify the accuracy of the bot's output before application.
* Make sure to test the instruction model you are using for whether it meets the use-case's quality requirements
* Be aware that AI models can consume a significant amount of energy. It's advisable to consider this factor in the planning and operation of AI systems.
* AI models can exhibit extended processing times when run on CPUs. For enhanced efficiency, utilizing GPU support is recommended to expedite request handling.
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying models. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)
