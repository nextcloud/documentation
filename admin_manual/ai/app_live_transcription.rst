==============================================================================
App: Live Transcription and Translation in Nextcloud Talk (live_transcription)
==============================================================================

.. _ai-live-transcription:

| This app provides live transcription and translation of speech in Nextcloud Talk calls using open source AI models provided by `Vosk <https://alphacephei.com/vosk/>`_.
| The transcription is done on your own server, preserving your privacy and data sovereignty, while the translation is done using a translation task processing provider like the :ref:`translate2 app <ai-app-translate2>`. `OpenAI and LocalAI integration <https://apps.nextcloud.com/apps/integration_openai>`_ and `Deepl integration <http://apps.nextcloud.com/apps/integration_deepl>`_ apps will soon also be supported for translation.

| A good set of language models for transcription are auto-downloaded. They include Arabic, Arabic (Tunisian), Breton, Catalan, Czech, German, English, Esperanto, Spanish, Persian (Farsi), French, Hindi, Italian, Japanese, Kazakh, Korean, Dutch, Polish, Portuguese (Brazilian), Russian, Telegu, Tajik, Turkish, Ukrainian, Uzbek, Vietnamese and Chinese.
| The translation capabilities depend on the installed Text-to-text task processing provider app. The :ref:`translate2 app <ai-app-translate2>` supports a wide range of languages.

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

.. important::

   The environment variables ``LT_HPB_URL`` and ``LT_INTERNAL_SECRET`` must be set in the Deploy Options during installation,
   and the High-Performance Backend must be functionally configured in Nextcloud Talk settings for the app to work.

   Changing these environment variables after installation is possible through a re-installation of the app after uninstalling it first.

5. Install a Text-to-text task processing provider app like the :ref:`translate2 app <ai-app-translate2>` for translation capabilities.

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/live_transcription>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/live_transcription>`_

Nextcloud customers should file bugs directly with our Customer Support.

Limitations
-----------

* The generated transcripts may not be perfect and may contain errors. It can also depend on the audio quality and the speaker's accent.
* The app currently supports only a limited number of languages. More languages may be added in the future.
* The languages other than English may have lower accuracy mainly due to the shipped models being smaller.
* The app currently does not support punctuation in the transcription.
* `OpenAI and LocalAI integration <https://apps.nextcloud.com/apps/integration_openai>`_ and `Deepl integration <http://apps.nextcloud.com/apps/integration_deepl>`_ apps are not yet supported for translation.
