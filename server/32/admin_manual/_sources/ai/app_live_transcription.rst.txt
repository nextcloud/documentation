==============================================================
App: Live Transcription in Nextcloud Talk (live_transcription)
==============================================================

.. _ai-live-transcription:

This app provides live transcription of speech in Nextcloud Talk calls using open source AI models provided by `Vosk <https://alphacephei.com/vosk/>`_.
The transcription is done on your own server, preserving your privacy and data sovereignty.

A good set of language models are auto-downloaded. They include Arabic, Arabic (Tunisian), Breton, Catalan, Czech, German, English, Esperanto, Spanish, Persian (Farsi), French, Hindi, Italian, Japanese, Kazakh, Korean, Dutch, Polish, Portuguese (Brazilian), Russian, Telegu, Tajik, Turkish, Ukrainian, Uzbek, Vietnamese and Chinese.

Installation
------------

1. Make sure the `Nextcloud Talk app <https://apps.nextcloud.com/apps/spreed>`_ is installed.
2. Make sure the High-Performance Backend (latest or released after September 2025) is installed and configured in Nextcloud Talk settings. See the `Nextcloud Talk install manual <https://nextcloud-talk.readthedocs.io/en/latest/quick-install/>`_ for more information.
3. Setup a :ref:`Deploy Daemon <ai-app_api>` in AppAPI Admin settings.
4. Install the **live_transcription** app via the "Apps" page in Nextcloud, or by executing

.. code-block::

   occ app_api:app:register live_transcription \
     --env LT_HPB_URL=wss://cloud.example.com/standalone-signaling/spreed \
     --env LT_INTERNAL_SECRET=1234 \
     --wait-finish


.. note::

   Environment variables and mounts can be set during the app installation from the "Deploy Options" button.
   The models are stored in a persistent volume at ``/nc_app_live_transcription_data``.
   This volume is created automatically during the installation but you can also mount your own volume there.
   As the name suggests, this volume is persistent and will not be deleted when the app is updated or uninstalled
   (without removing data).


.. important::

   The environment variables ``LT_HPB_URL`` and ``LT_INTERNAL_SECRET`` must be set in the Deploy Options,
   and the High-Performance Backend must be functionally configured in Nextcloud Talk settings for the app to work.


Requirements
------------

* Nextcloud AIO is supported
* We currently support NVIDIA GPUs and x86_64 CPUs. Only CPU-based transcription is supported and works well on modern x86 CPUs.
* CUDA >= v12.4.1 on your host system for GPU-based transcription
* GPU Sizing

   * A NVIDIA GPU with at least 10 GB VRAM
   * 16 GB of system RAM should be enough for one or two concurrent calls

* CPU Sizing

   * x86 CPU with 4 threads. Additional 2 threads per concurrent call.
   * 16 GB of RAM should be enough for one or two concurrent calls

* Space usage
   * ~ 2.8 GB for the docker container
   * ~ 6.0 GB for the default models

.. note::

   We currently have very little real-world experience running this software on production instances.
   The above sizing recommendations come from our estimates and are not real-world benchmarks.
   Actual requirements will vary based on factors such as the number of concurrent calls, audio quality, and selected languages.
   Please do thorough testing to confirm your hardware meets your needs.

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/live_transcription>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/live_transcription>`_

Nextcloud customers should file bugs directly with our Customer Support.

