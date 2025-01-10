=============================================
App: Local Machine translation 2 (translate2)
=============================================

.. _ai-app-translate2:

The *translate2* app is one of the apps that provide machine translation functionality in Nextcloud and act as a translation backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>`. The *translate2* app specifically runs only open source models and does so entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

The app currently supports 400+ languages. See the complete list here: https://huggingface.co/datasets/allenai/MADLAD-400

Requirements
------------

* Minimal Nextcloud version: 30
* This app is built as an External App and thus depends on AppAPI v3.1.0 or higher
* Nextcloud AIO is supported
* We currently support NVIDIA GPUs and x86_64 CPUs
* CUDA >= v12.2.2 on your host system
* GPU Sizing

   * A NVIDIA GPU with at least 4 GB VRAM
   * At least 6 GB of system RAM

* CPU Sizing

   * x86 CPU with 4-8 cores for the app to use (The more cores the faster it will be)
   * At least 6 GB of RAM for the app should be enough (includes software+libraries and the model)

Space usage
~~~~~~~~~~~

 * ~ 2.95 GB for the docker container
 * ~ 2.77 GB for the default model

Installation
------------

0. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
1. :ref:`Install AppAPI and setup a Deploy Demon<ai-app_api>`
2. Install the "Local Machine Translation" (translate2) ExApp via the "Apps" page in the Nextcloud web admin user interface

Model Switch
------------

1. Remove ``hf_model_path`` key from ``loader`` object in the ``config.json`` file in the docker container named ``nc_app_translate2``.
2. Change ``model_name`` to the new model name to ``Nextcloud-AI/madlad400-7b-mt-bt-ct2-int8_float32``.
3. Restart the docker container ``docker restart nc_app_translate2``

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/translate2>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/translate2>`_

Nextcloud customers should file bugs directly with our Customer Support.

Ethical AI Rating
-----------------

Rating: 🟢
~~~~~~~~~~

Positive:
* the software for training and inference of this model is open source
* the trained model is freely available, and thus can be run on-premises
* the training data is freely available, making it possible to check or correct for bias or optimise the performance and CO2 usage.

Learn more about the Nextcloud Ethical AI Rating `in our blog <https://nextcloud.com/blog/nextcloud-ethical-ai-rating>`_.

Known Limitations
-----------------

* AI translations are not a replacement for human professional translations and in many cases post-editing is required. AI translations can be used for understanding the main content of a text but not for translations that require special knowledge (such as technical content or legal content), or translations that require specific writing style to convey style, deeper meaning, or emotions (such as marketing content or translating books).
* While the quality of the output will be fine for the most common languages (English, French, Spanish) the quality will suffer for languages that have less coverage in the original training set.
* Make sure to test the translation model you are using it for whether it meets the use-case's quality requirements. The default model is the smallest of the batch and might produce duplicate translation outputs. Switch to a larger model if you need better quality and less artifacts, see `Model Switch`_.
* Language models notoriously have a high energy consumption.
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying models. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI).
