================================================
App: Local Whisper Speech-To-Text (stt_whisper2)
================================================

.. _ai-app-stt_whisper2:

The *stt_whisper2* app is one of the apps that provide Speech-To-Text functionality in Nextcloud and act as a media transcription backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>`, the *talk* app and :ref:`other apps making use of the core Translation API<stt-consumer-apps>`. The *stt_whisper2* app specifically runs only open source models and does so entirely on-premises. Nextcloud customers receive customer support upon request.

This app uses faster-whisper (TODO: link) under the hood. Output quality will differ depending on which model you use, we recommend the following models:

Requirements
------------

* This app is built as an External App and thus depends on AppAPI v2.3.0
* Nextcloud AIO is supported
* Using GPU processing is supported, but not required; be prepared for slow performance unless you are using GPU
* GPU Sizing

   * You will need a GPU with enough VRAM to hold the model you choose

      * the small model should fit on 2GB VRAM
      * the large-v2 (the best and largest) will need 6GB VRAM

   * The distil-whisper variants have half the parameters of the original models while supposedly staying within 1% of the original error rate (your mileage may vary)

* CPU Sizing

   * If you don't have a GPU, this app will utilize your CPU cores
   * The more cores you have and the more powerful the CPU the better, we recommend 10-20 cores
   * The app will hog all cores by default, so it is usually better to run it on a separate machine

Installation
------------

You can install the *stt_whisper2* app via the "External Apps" page in Nextcloud.

Supplying alternate models
~~~~~~~~~~~~~~~~~~~~~~~~~~

This app allows supplying alternate LLM models as *gguf* files in the ``/app/models`` directory of the docker container. You can use any `*faster-whisper* model by Systran on hugging face <https://huggingface.co/Systran>`_ by simply

1. git cloning the respective repository into the models directory
2. Selecting the respective model in the Nextcloud AI admin settings

App store
---------

You can also find this app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/stt_whisper2>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/stt_whisper2>`_

Nextcloud customers should file bugs directly with our customer support.
