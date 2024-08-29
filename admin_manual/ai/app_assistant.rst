===================
Nextcloud Assistant
===================

.. _ai-app-assistant:

Nextcloud assistant is the primary graphical user interface for interacting with artificial intelligence features in Nextcloud.

It offers the graphical user interface for the unified AI Task processing API offering features like summarizing text, generating headlines, asking arbitrary questions, transcription of media files, image generation and it integrates with the context_chat app to offer in-context answers about your own data stored in Nextcloud. The assistant app also offers a chat interface to interact with the chosen language model. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

Find the user documentation here: `<https://github.com/nextcloud/assistant/tree/main/docs/user>`_

Installation
------------

You can install the *assistant* app via the "Apps" page in Nextcloud, or by executing

.. code-block::

   php occ app:enable assistant

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/assistant>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/assistant>`_

Nextcloud customers should file bugs directly with our Customer Support.

Related apps
------------

Artificial intelligence at Nextcloud is built in a modular way, allowing you to choose from a variety of solutions for your needs. In order to make use of the various features of the Assistant you will need additional apps that act as backends to provide the actual implementation of the AI functionality. In the Nextcloud administration settings under "Artificial intelligence" you can select which AI backend app to use for which tasks. Note that some of the backend apps are only community maintained, while others are available for Customer support upon request.

**Note**: At Nextcloud we focus on creating on-premise AI apps that run fully self-hosted on your own servers in order to preserve your privacy and data sovereignty. However, you can also offload these resource-heavy tasks to an :ref:`"AI as a Service" provider<ai-ai_as_a_service>`.

Machine translation
~~~~~~~~~~~~~~~~~~~

In order to make use of machine translation features in the assistant, you will need an app that provides a translation backend:

* :ref:`translate<ai-app-translate>` - Runs open source AI translation models locally on your own server hardware (Customer support available upon request)
* :ref:`translate2 (ExApp)<ai-app-translate2>` - Runs open source AI translation models locally on your own server hardware (Customer support available upon request)
* *integration_deepl* - Integrates with the deepl API to provide translation functionality from Deepl.com servers (Only community supported)
* *integration_libretranslate* - Integrates with the open source LibreTranslate API to provide translation functionality hosted commercially or on your own hardware (Only community supported)

Speech-To-Text
~~~~~~~~~~~~~~

In order to make use of Speech-to-Text, you will need an app that provides a Speech-To-Text backend:

* :ref:`stt_whisper2<ai-app-stt_whisper2>` - Runs open source AI Speech-To-Text models on your own server hardware  (Customer support available upon request)
* *integration_openai* - Integrates with the OpenAI API to provide AI functionality from OpenAI servers  (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)

Text processing
~~~~~~~~~~~~~~~

In order to make use of text processing features in the assistant, you will need an app that provides a Text processing backend:

* :ref:`llm2<ai-app-llm2>` - Runs open source AI language models locally on your own server hardware (Customer support available upon request)
* *integration_openai* - Integrates with the OpenAI API to provide AI functionality from OpenAI servers  (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)

Text-To-Image
~~~~~~~~~~~~~

In order to make use of Text-To-Image features, you will need an app that provides an image generation backend:

* text2image_stablediffusion2 (Customer support available upon request)
* *integration_openai* - Integrates with the OpenAI API to provide AI functionality from OpenAI servers (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)
* *integration_replicate* - Integrates with the replicate API to provide AI functionality from replicate servers (see :ref:`AI as a Service<ai-ai_as_a_service>`)

Context Chat
~~~~~~~~~~~~

In order to make use of our special Context Chat feature, offering in-context insights about your own data stored in Nextcloud, you will need the following apps:

* :ref:`context_chat + context_chat_backend<ai-app-context_chat>` -  (Customer support available upon request)


Configuration
-------------

The Assistant admin settings can be found under the "Artificial intelligence" section.
You can disable the assistant top menu entry there. You can also disable the AI-related smart pickers.
The occ commands to change the options are listed below.

Assistant configuration
~~~~~~~~~~~~~~~~~~~~~~~

1. Top-right Assistant

.. code-block::

   occ config:app:set assistant assistant_enabled --value=1 --type=integer

To enable/disable the assistant button from the top-right corner for all the users.

2. AI text generation smart picker

.. code-block::

   occ config:app:set assistant free_prompt_picker_enabled --value=1 --type=integer

To enable/disable the AI text generation smart picker for all the users.

3. Text-to-image smart picker

.. code-block::

   occ config:app:set assistant text_to_image_picker_enabled --value=1 --type=integer

To enable/disable the text-to-image smart picker for all the users.

4. Speech-to-text smart picker

.. code-block::

   occ config:app:set assistant speech_to_text_picker_enabled --value=1 --type=integer

To enable/disable the speech-to-text smart picker for all the users.

Image storage
~~~~~~~~~~~~~

Days until generated images are deleted if they are not viewed.

.. code-block::

   occ config:app:set assistant max_image_generation_idle_time --value=90 --type=integer

Chat with AI
~~~~~~~~~~~~

1. Chat User Instructions for Chat Completions

.. code-block::

   occ config:app:set assistant chat_user_instructions --value="hello world"

The user instructions that are prepended before the chat messages for the AI model to understand the context of the block of text. This is a good place not only to instruct the AI model to be polite and kind but also to for example answer all the queries in a particular language or better yet, follow the user's language. The sky is the limit.

**Note**: The default instructions are optimized to work well across a variety of language models, but may not be optimal for the specific model you choose. Specifically, the model may be tempted to mention the user's name a bit too often and may mention the user's language in an unusual manner.

2. Chat User Instructions for Title Generation

.. code-block::

   occ config:app:set assistant chat_user_instructions_title --value="hello title"

This field is appended to the block of chat messages, i.e. attached after the messages. It is done this way to allow it to be used even with text completion models which could have the instructions as "The title for the above conversation could be \"".

3. Last N messages to consider for chat completions

.. code-block::

   occ config:app:set assistant chat_last_n_messages --value=10

The number of latest messages to consider for generating the next message. This does not include the user instructions, which is always considered in addition to this. This value should be adjusted in case you are hitting the token limit in your conversations too often.
The AI text generation provider should ideally handle the max token limit case.

Improve AI processing throughput
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Most AI tasks will be run as part of the background job system in Nextcloud which only runs jobs every 5 minutes by default.
To pick up scheduled jobs faster you can set up background job workers that process AI tasks as soon as they are scheduled:

run the following occ commands a daemon (you can also spawn multiple, for parallel processing):

.. code-block::

   occ background-job:worker 'OC\TaskProcessing\SynchronousBackgroundJob'

Make sure to restart these daemons regularly, for example once a day, to make sure the daemon runs the latest code.
