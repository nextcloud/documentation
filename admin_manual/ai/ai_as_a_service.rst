===============
AI as a Service
===============

.. _ai-ai_as_a_service:

At Nextcloud we focus on creating on-premise AI apps that run fully self-hosted on your own servers in order to preserve your privacy and data sovereignty. However, you can also offload these resource-heavy tasks to an "AI as a Service" provider offering API access in exchange for payment. Examples of such providers are `OpenAI <https://platform.openai.com/>`_, with its ChatGPT APIs providing language model access among other APIs as well as `replicate <https://replicate.com/>`_.

Installation
------------

In order to use these providers you will need to install the respective app from the app store:

* ``integration_openai``

* ``integration_replicate``

You can then add your API token and rate limits in the administration settings and set the providers live in the "Artificial intelligence" section of the admins settings.


OpenAI integration
------------------

With this application, you can also connect to a self-hosted LocalAI or Ollama instance or to any service that implements an API similar enough to the OpenAI API, for example Plusserver or MistralAI.

Do note however, that we test the Assistant tasks that this app implements only with OpenAI models and only against the OpenAI API, we thus cannot guarantee other models and APIs will work.


Improve performance
-------------------

Prompts from integration_openai and integration_replicate can have a delay of 5 minutes. This can be optimized and more information can be found in :ref:`the relevant section in AI Overview <ai-overview_improve-ai-task-pickup-speed>`.
