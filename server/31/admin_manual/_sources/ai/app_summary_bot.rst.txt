==========================================
App: Summary Bot (Talk chat summarize bot)
==========================================

.. _ai-app-summary-bot:

The *Summary Bot* app utilizes Large Language Model (LLM) providers in Nextcloud and can be added to a conversation in `Nextcloud Talk` to generate summaries from the chat messages of that room either on-demand or following a schedule.
It can run on only open source or proprietary models either on-premises or in the cloud leveraging apps like `Local large language model app <https://apps.nextcloud.com/apps/llm2>`_ or `OpenAI and LocalAI integration app <https://apps.nextcloud.com/apps/integration_openai>`_.

Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

The app currently supports the following languages:

* English (en)

The quality of summaries depends directly on the quality of the underlying model. It is recommended to test the model for the desired use-case before applying it.

Requirements
------------

* Minimal Nextcloud version: 30
* Docker
* AppAPI >= 3.0.0
* Talk
* Task Processing Provider like Local large language model app (llm2) or OpenAI and LocalAI integration app (integration_openai)

Space usage
~~~~~~~~~~~

* ~100MB

Installation
------------

0. Make sure the following apps are installed:

   - `Nextcloud AppAPI app <https://apps.nextcloud.com/apps/app_api>`_

   - `Nextcloud Talk app (Spreed) <https://apps.nextcloud.com/apps/spreed>`_

   - One of the following AI model providers:

     - `Nextcloud Local large language model app <https://apps.nextcloud.com/apps/llm2>`_

     - `Nextcloud OpenAI and LocalAI integration app <https://apps.nextcloud.com/apps/integration_openai>`_


Setup (via App Store)
~~~~~~~~~~~~~~~~~~~~~

1. Install the *Summary Bot* app via the "Apps" page in Nextcloud

2. Enable the *Summary Bot* Bot for the selected Chatroom via the three dots menu of the Chatroom (The Bots settings are located inside the *Bots* section)

Setup (Manual)
~~~~~~~~~~~~~~

After cloning this app *manually* (cloned via git to your apps directory) you will need to execute the following steps:

1. Change to the folder you have cloned the source to:
.. code-block::

   cd  /path/to/your/nextcloud/webroot/apps/summary_bot/


2. Build the docker image:
.. code-block::

   docker build --no-cache -f Dockerfile -t local_summary_bot .

3. Run the docker image:

*Info:*

- APP_VERSION environment variable should be equal to the version of the *Summary Bot* you are using

- NEXTCLOUD_URL environment variable must be set to your Nextcloud instance's URL, ensuring it's reachable by the docker image.

.. code-block::

   sudo docker run -ti -v /etc/localtime:/etc/localtime:ro -v /etc/timezone:/etc/timezone:ro -e APP_ID=summary_bot -e APP_DISPLAY_NAME="Summary Bot" -e APP_HOST=0.0.0.0 -e APP_PORT=9031 -e APP_SECRET=12345 -e APP_VERSION=1.0.0 -e NEXTCLOUD_URL='<YOUR_NEXTCLOUD_URL_REACHABLE_FROM_INSIDE_DOCKER>' -p 9031:9031 local_summary_bot


4. Un-register the Summary Bot if its already installed

.. code-block::

   sudo -u <the_user_the_webserver_is_running_as> php /path/to/your/nextcloud/webroot/occ app_api:app:unregister summary_bot
   

5. Register the Summary Bot so that your Nextcloud instance is aware of it

*Info:* Adjust the host value in the following example to the IP address of the docker container (for added security)

.. code-block::

   sudo -u <the_user_the_webserver_is_running_as> php ./occ app_api:app:register summary_bot manual_install --json-info '{ "id": "summary_bot", "name": "Summary Bot", "daemon_config_name": "manual_install", "version": "1.0.0", "secret": "12345", "host": "0.0.0.0", "port": 9031, "scopes": ["AI_PROVIDERS", "TALK", "TALK_BOT"], "protocol": "http"}' --force-scopes --wait-finish


6. Enable the *Summary Bot* for the selected Chatroom via the three dots menu of the Chatroom (The Bots settings are located inside the *Bots* section)

Usage
-----

After enabling the *Summary Bot* in a Chatroom, you can test its functionality by simply sending the message below:

   "@summary" or "@summary help"

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/summary_bot>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/summary_bot>`_

Nextcloud customers should file bugs directly with our Customer Support.

Ethical AI Rating
-----------------

The ethical rating of the *Summary Bot*, which utilizes a model for text processing through the Nextcloud Assistant app, is significantly influenced by the choice and implementation of the underlying model.

Learn more about the Nextcloud Ethical AI Rating `in our blog<https://nextcloud.com/blog/nextcloud-ethical-ai-rating/>`.

Known Limitations
-----------------

* The Summary Bot cannot access previous conversations, it only recognizes messages from the moment it was enabled in the chatroom.
* Summary of maximum 40000 characters is supported. This assumes the underlying model can handle this amount of text (which should be close to 16000 context length).
* Languages other than English are not supported. The underlying model may still be able to understand other languages.
* AI models may occasionally produce inaccurate information. Therefore, they should be employed with caution in non-critical scenarios. It's essential to verify the accuracy of the bot's output before application.
* Be aware that AI models can consume a significant amount of energy. It's advisable to consider this factor in the planning and operation of AI systems if hosted on-premises or sustainability is a concern.
* AI models can exhibit extended processing times when run on CPUs. For enhanced efficiency, utilizing GPU support is recommended to expedite request handling.
* Customer support is available upon request, however we can't solve false or problematic output (hallucinations), most performance issues, or other problems caused by the underlying models. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)
