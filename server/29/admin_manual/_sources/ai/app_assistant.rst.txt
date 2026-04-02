===================
Nextcloud Assistant
===================

.. _ai-app-assistant:

Nextcloud assistant is the primary graphical user interface for interacting with artificial intelligence features in Nextcloud.

It offers the graphical user interface for text processing tasks like summarizing text, generating headlines, and asking arbitrary questions, for Speech-To-Text transcription of media files, for Text-To-Image picture generation and it integrates with the context_chat app to offer in-context answers about your own data stored in Nextcloud. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

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
