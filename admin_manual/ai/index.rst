=======================
Artificial Intelligence
=======================

We strive to bring Artificial Intelligence features to Nextcloud. This section highlights these features, how they work and where to find them.
All of these features are completely optional and need to be installed via separate Nextcloud Apps.

Overview of AI features
-----------------------

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
   "","`LibreTranslate integration <https://apps.nextcloud.com/apps/integration_libretranslate>`_","Green","Yes","Yes - OpenNMT models","Yes","Yes"
   "","`DeepL integration <https://apps.nextcloud.com/apps/integration_deepl>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Green","Yes","Yes","Yes","Yes"
   "Speech-To-Text","`Whisper Speech-To-Text <https://apps.nextcloud.com/apps/stt_whisper>`_","Yellow","Yes","Yes - Whisper models by OpenAI","No","Yes"
   "","`OpenAI and LocalAI integration <https://apps.nextcloud.com/apps/integration_openai>`_","Yellow","Yes","Yes - Whisper models by OpenAI","No","No"
   "","`Replicate integration <https://apps.nextcloud.com/apps/integration_replicate>`_","Yellow","Yes","Yes - Whisper models by OpenAI","No","No"
   "Image generation","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Yellow","Yes","Yes - StableDiffusion models by StabilityAI","No","Yes"
   "","`Replicate integration <https://apps.nextcloud.com/apps/integration_replicate>`_","Yellow","Yes","Yes - StableDiffusion models by StabilityAI","No","No"
   "Text generation","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Green","Yes","Yes","Yes","Yes"

Features
--------

Some of our AI features are realized as generic APIs that any app can provide an implementation for by registering a provider. These are
Machine translation, Speech-To-Text and Text processing.

Machine translation
^^^^^^^^^^^^^^^^^^^
As you can see in the table above we have multiple apps offering machine translation capabilities. Each app brings its own set of supported languages.
In downstream apps like the Text app, users can use the translation functionality regardless of which app implements it behind the scenes.

Speech-To-Text
^^^^^^^^^^^^^^
As you can see in the table above we have multiple apps offering Speech-To-Text capabilities. In downstream apps like the Talk app, users can use the transcription functionality regardless of which app implements it behind the scenes.

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


