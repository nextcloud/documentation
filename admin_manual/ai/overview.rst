========
Overview
========


We strive to bring Artificial Intelligence features to Nextcloud. This section highlights these features, how they work and where to find them.
All of these features are completely optional. If you want to have them on your server, you need install them via separate Nextcloud Apps.

Overview of AI features
-----------------------

Nextcloud uses modularity to separate raw AI functionality from the Graphical User interfaces and apps that make use of said functionality. Each instance can thus make use of various backends that provide the functionality for the same frontends and the same functionality can be implemented by multiple apps using on-premises processing or third-party AI service providers.

.. csv-table::
   :header: "Feature","App","Rating","Open source","Freely available model","Freely available training data","Privacy: Keeps data on premises"

   "Smart inbox","`Mail <https://apps.nextcloud.com/apps/mail>`_","Green","Yes","Yes","Yes","Yes"
   "Image object recognition","`Recognize <https://apps.nextcloud.com/apps/recognize>`_","Green","Yes","Yes","Yes","Yes"
   "Image face recognition","`Recognize <https://apps.nextcloud.com/apps/recognize>`_","Green","Yes","Yes","Yes","Yes"
   "Video action recognition","`Recognize <https://apps.nextcloud.com/apps/recognize>`_","Green","Yes","Yes","Yes","Yes"
   "Audio music genre recognition","`Recognize <https://apps.nextcloud.com/apps/recognize>`_","Green","Yes","Yes","Yes","Yes"
   "Suspicious login detection","`Suspicious Login <https://apps.nextcloud.com/apps/suspicious_login>`_","Green","Yes","Yes","Yes","Yes"
   "Related resources","`Related Resources <https://apps.nextcloud.com/apps/related_resources>`_","Green","Yes","Yes","Yes","Yes"
   "Recommended files","recommended_files","Green","Yes","Yes","Yes","Yes"
   "Machine translation","`Translate <https://apps.nextcloud.com/apps/translate>`_","Green","Yes","Yes - Opus models by University Helsinki","Yes","Yes"
   "","`Local Machine Translation 2 (ExApp) <https://apps.nextcloud.com/apps/translate2>`_","Green","Yes","Yes - MADLAD models by Google","Yes","Yes"
   "","`LibreTranslate integration <https://apps.nextcloud.com/apps/integration_libretranslate>`_","Green","Yes","Yes - OpenNMT models","Yes","Yes"
   "","`DeepL integration <https://apps.nextcloud.com/apps/integration_deepl>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Green","Yes","Yes","Yes","Yes"
   "","`Local Whisper Speech-To-Text 2 (ExApp) <https://apps.nextcloud.com/apps/stt_whisper2>`_","Yellow","Yes","Yes - Whisper models by OpenAI","No","Yes"
   "","`OpenAI and LocalAI integration <https://apps.nextcloud.com/apps/integration_openai>`_","Yellow","Yes","Yes - Whisper models by OpenAI","No","No"
   "","`Replicate integration <https://apps.nextcloud.com/apps/integration_replicate>`_","Yellow","Yes","Yes - Whisper models by OpenAI","No","No"
   "Image generation","`Local Stable Diffusion <https://apps.nextcloud.com/apps/text2image_stablediffusion>`_","Yellow","Yes","Yes - StableDiffusion XL model by StabilityAI","No","Yes"
   "","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Yellow","Yes","Yes - StableDiffusion models by StabilityAI","No","Yes"
   "","`Replicate integration <https://apps.nextcloud.com/apps/integration_replicate>`_","Yellow","Yes","Yes - StableDiffusion models by StabilityAI","No","No"
   "","`Local large language model 2 (ExApp) <https://apps.nextcloud.com/apps/llm2>`_","Yellow","Yes","Yes","No","Yes"
   "","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Green","Yes","Yes","Yes","Yes"
   "Context Chat","`Nextcloud Assistant Context Chat <https://apps.nextcloud.com/apps/context_chat>`_","Yellow","Yes","Yes","No","Yes"
   "","`Nextcloud Assistant Context Chat (Backend) <https://apps.nextcloud.com/apps/context_chat_backend>`_","Yellow","Yes","Yes","No","Yes"


Ethical AI Rating
-----------------

Until Hub 3, we succeeded in offering features without relying on proprietary blobs or third party services. Yet, while there is a large community developing ethical, safe and privacy-respecting technologies, there are many other relevant technologies users might want to use. We want to provide users with these cutting-edge technologies – but also be transparent. For some use cases, ChatGPT might be a reasonable solution, while for more private, professional or sensitive data, it is paramount to have a local, on-prem, open solution. To differentiate these, we developed an Ethical AI Rating.

The rating has four levels:
 * Red
 * Orange
 * Yellow
 * Green

It is based on points from these factors:
 * Is the software (both for inferencing and training) under a free and open source license?
 * Is the trained model freely available for self-hosting?
 * Is the training data available and free to use?

If all of these points are met, we give a Green label. If none are met, it is Red. If 1 condition is met, it is Orange and if 2 conditions are met, Yellow.


Features used by other apps
---------------------------

Some of our AI features are realized as generic APIs that any app can use and any app can provide an implementation for by registering a provider. So far, these are
Machine translation, Speech-To-Text, Image generation, Text processing and Context Chat.

Machine translation
^^^^^^^^^^^^^^^^^^^

.. _mt-consumer-apps:

As you can see in the table above we have multiple apps offering machine translation capabilities. Each app brings its own set of supported languages.
In downstream apps like the Text app, users can use the translation functionality regardless of which app implements it behind the scenes.

Frontend apps
~~~~~~~~~~~~~

* *Text* for offering the translation menu
* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ offering a graphical translation UI
* `Analytics <https://apps.nextcloud.com/apps/analytics>`_ for translating graph labels

Backend apps
~~~~~~~~~~~~

* :ref:`translate<ai-app-translate>` - Runs open source AI translation models locally on your own server hardware (Customer support available upon request)
* :ref:`translate2 (ExApp)<ai-app-translate2>` - Runs open source AI translation models locally on your own server hardware (Customer support available upon request)
* *integration_deepl* - Integrates with the deepl API to provide translation functionality from Deepl.com servers (Only community supported)
* *integration_libretranslate* - Integrates with the open source LibreTranslate API to provide translation functionality hosted commercially or on your own hardware (Only community supported)

Speech-To-Text
^^^^^^^^^^^^^^

.. _stt-consumer-apps:

As you can see in the table above we have multiple apps offering Speech-To-Text capabilities. In downstream apps like the Talk app, users can use the transcription functionality regardless of which app implements it behind the scenes.

Frontend apps
~~~~~~~~~~~~~

* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ offering a graphical translation UI and a smart picker
* `Speech-to-Text Helper <https://apps.nextcloud.com/apps/stt_helper>`_ for providing a Speech-To-Text smart picker (deprecated; was merged into assistant)
* `Talk <https://apps.nextcloud.com/apps/spreed>`_ for transcribing calls (see `Nextcloud Talk docs <https://nextcloud-talk.readthedocs.io/en/latest/settings/#app-configuration>`_ for how to enable this)

Backend apps
~~~~~~~~~~~~

* :ref:`stt_whisper2<ai-app-stt_whisper2>` - Runs open source AI Speech-To-Text models on your own server hardware  (Customer support available upon request)
* *integration_openai* - Integrates with the OpenAI API to provide AI functionality from OpenAI servers  (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)


Text processing
^^^^^^^^^^^^^^^

.. _tp-consumer-apps:

As you can see in the table above we have multiple apps offering Text processing capabilities. In downstream apps like the Nextcloud Assistant app, users can use the text processing functionality regardless of which app implements it behind the scenes.

Frontend apps
~~~~~~~~~~~~~

* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ for offering a graphical UI for the various tasks and a smart picker
* `GPTFreePrompt <https://apps.nextcloud.com/apps/gptfreeprompt>`_ for providing an llm smart picker (deprecated; was merged into assistant)
* `Mail <https://apps.nextcloud.com/apps/mail>`_ for summarizing mail threads (see :ref:`the Nextcloud Mail docs<mail_thread_summary>` for how to enable this)
* `Summary Bot <https://apps.nextcloud.com/apps/summarai>`_ for summarizing chat histories in `Talk <https://apps.nextcloud.com/apps/spreed>`_

Backend apps
~~~~~~~~~~~~

* :ref:`llm2<ai-app-llm2>` - Runs open source AI language models locally on your own server hardware (Customer support available upon request)
* *integration_openai* - Integrates with the OpenAI API to provide AI functionality from OpenAI servers  (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)

Image generation
^^^^^^^^^^^^^^^^

.. _t2i-consumer-apps:

As you can see in the table above we have multiple apps offering Image generation capabilities. In downstream apps like the Text-to-Image helper app, users can use the image generation functionality regardless of which app implements it behind the scenes.

Frontend apps
~~~~~~~~~~~~~

* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ for offering a graphical UI and a smart picker
* `Text-to-Image Helper <https://apps.nextcloud.com/apps/stt_helper>`_ for providing a Text-to-Image smart picker (deprecated; was merged into assistant)

Backend apps
~~~~~~~~~~~~

* text2image_stablediffusion2 (Customer support available upon request)
* *integration_openai* - Integrates with the OpenAI API to provide AI functionality from OpenAI servers (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)
* *integration_replicate* - Integrates with the replicate API to provide AI functionality from replicate servers (see :ref:`AI as a Service<ai-ai_as_a_service>`)


Context Chat (Tech preview)
^^^^^^^^^^^^^^^^^^^^^^^^^^^
Our Context Chat feature was introduced in Nextcloud Hub 7 (v28). It allows asking questions to the assistant related to your documents in Nextcloud. You will need to install both the context_chat app as well as the context_chat_backend External App. Be prepared that things might break or be a little rough around the edges. We look forward to your feedback!

Frontend apps
~~~~~~~~~~~~~

* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ for offering a graphical UI for the context chat tasks

Backend apps
~~~~~~~~~~~~

* :ref:`context_chat + context_chat_backend<ai-app-context_chat>` -  (Customer support available upon request)


Frequently Asked Questions
--------------------------

Why is my prompt slow?
^^^^^^^^^^^^^^^^^^^^^^

Reasons for slow performance from a user perspective can be

 * Using CPU processing instead of GPU (sometimes this limit is imposed by the used app)
 * High user demand for the feature: User prompts and AI tasks are usually processed in the order they are received, which can cause delays when a lot of users access these features at the same time.
