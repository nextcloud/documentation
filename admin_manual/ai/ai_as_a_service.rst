===============
AI as a Service
===============

.. _ai-ai_as_a_service:

At Nextcloud we focus on creating on-premise AI apps that run fully self-hosted on your own servers in order to preserve your privacy and data sovereignty. However, you can also offload these resource-heavy tasks to an "AI as a Service" provider offering API access in exchange for payment. Examples of such providers are `OpenAI <https://platform.openai.com/>`_, with its ChatGPT APIs providing language model access among other APIs as well as `replicate <https://replicate.com/>`_.

Installation
------------

In order to use these providers you will need to install the respective app from the app store:

* ``integration_openai`` (With this application, you can also connect to a self-hosted LocalAI instance or to any service that implements an API similar to OpenAI, for example Plusserver or MistralAI.)

* ``integration_replicate``

You can then add your API token and rate limits in the administration settings and set the providers live in the "Artificial intelligence" section of the admins settings.
