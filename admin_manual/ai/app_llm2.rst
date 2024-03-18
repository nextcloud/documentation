======================================
App: Local large language model (llm2)
======================================

.. _ai-app-llm2:

The *llm2* app is one of the apps that provide text processing functionality using Large language models in Nextcloud and act as a text processing backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>`, the *mail* app and :ref:`other apps making use of the core Translation API<tp-consumer-apps>`. The *llm2* app specifically runs only open source models and does so entirely on-premises. Nextcloud customers receive customer support upon request.

This app uses `ctransformers <https://github.com/marella/ctransformers>`_ under the hood and is thus compatible with any model in *gguf* format. Output quality will differ depending on which model you use, we recommend the following models:

* `Llama2 7b Chat <https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF>`_
* `NeuralBeagle14 7B <https://huggingface.co/mlabonne/NeuralBeagle14-7B-GGUF>`_

Requirements
------------

* This app is built as an External App and thus depends on AppAPI v2.3.0
* Nextcloud AIO is supported
* Using GPU processing is supported, but not required; be prepared for slow performance unless you are using GPU
* GPU Sizing

   * You will need a GPU with enough VRAM to hold the model you choose

      * for 7B parameter models, 5bit-quantized variants and lower should fit on a 8GB VRAM, but of course have lower quality
      * for 7B parameter models, 6bit-quantized variants and up will need 12GB VRAM
      * If you want better reasoning capabilities, you will need to look for models with more parameters, like 14B and higher, which of course also need more VRAM

* CPU Sizing

   * If you don't have a GPU, this app will utilize your CPU cores
   * The more cores you have and the more powerful the CPU the better, we recommend 10-20 cores
   * The app will hog all cores by default, so it is usually better to run it on a separate machine

Installation
------------

You can install the assistant app via the "External Apps" page in Nextcloud.

Supplying alternate models
~~~~~~~~~~~~~~~~~~~~~~~~~~

This app allows supplying alternate LLM models as *gguf* files in the ``/nc_app_<appid>_data`` directory of the docker container.

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/llm2>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/llm2>`_

Nextcloud customers should file bugs directly with our Support system.
