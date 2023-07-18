=======================
Artificial Intelligence
=======================

We strive to bring Artificial Intelligence features to Nextcloud. This section highlights these features, how they work and where to find them.
All of these features are completely optional and need to be installed via separate Nextcloud Apps.

Overview of AI features
-----------------------

.. csv-table::
   :header: "Feature","Implementation","Rating","Open source","Freely available model","Freely available training data","Privacy: Keeps data on premises"

   "Smart inbox","mail","Green 🟢","✅","✅","✅","✅"
   "Image object recognition","recognize","Green 🟢","✅","✅","✅","✅"
   "Image face recognition","recognize","Green 🟢","✅","✅","✅","✅"
   "Video action recognition","recognize","Green 🟢","✅","✅","✅","✅"
   "Audio music genre recognition","recognize","Green 🟢","✅","✅","✅","✅"
   "Suspicious login detection","suspicious_login","Green 🟢","✅","✅","✅","✅"
   "Related resources","related_resources","Green 🟢","✅","✅","✅","✅"
   "Recommended files","recommended_files","Green 🟢","✅","✅","✅","✅"
   "Machine translation","translate","Green 🟢","✅","✅ - Opus models by University Helsinki","✅","✅"
   "","integration_libretranslate","Green 🟢","✅","✅ -OpenNMT models","✅","✅"
   "","integration_deepl","Red 🔴","❌","❌","❌","❌"
   "","integration_openai via OpenAI API","Red 🔴","❌","❌","❌","❌"
   "","integration_openai via LocalAI","Green 🟢","✅","✅","✅","✅"
   "Speech-To-Text","stt_whisper","Yellow 🟡","✅","✅ - Whisper models by OpenAI","❌","✅"
   "","integration_openai","Yellow 🟡","✅","✅ - Whisper models by OpenAI","❌","❌"
   "","integration_replicate","Yellow 🟡","✅","✅ - Whisper models by OpenAI","❌","❌"
   "Image generation","integration_openai via OpenAI API","Red 🔴","❌","❌","❌","❌"
   "","integration_openai via LocalAI","Yellow 🟡","✅","✅ - StableDiffusion models by StabilityAI","❌","✅"
   "","integration_replicate","Yellow 🟡","✅","✅ - StableDiffusion models by StabilityAI","❌","❌"
   "Text generation","integration_openai via OpenAI API","Red 🔴","❌","❌","❌","❌"
   "","integration_openai via LocalAI","Green 🟢","✅","✅","✅","✅"

Features
--------

Some of our AI features are realized as generic APIs that any app can provide an implementation for by registering a provider. These are
Machine translation, Speech-To-Text and Text processing

Machine translation
^^^^^^^^^^^^^^^^^^^
As you can see in the table above we have multiple apps offering machine translation capabilities. Each app brings its own set of supported languages.
In downstream apps like the Text app, users can use the translation functionality regardless of which app implements it behind the scenes.

Speech-To-Text
^^^^^^^^^^^^^^
As you can see in the table above we have multiple apps offering Speech-To-Text capabilities. In downstream apps like the Talk app, users can use the transcription functionality regardless of which app implements it behind the scenes.

Ethical AI Rating
-----------------

Until Hub 3, we succeeded in offering features without reliance on proprietary blobs or third party servers. Yet, while there is a large community developing ethical, safe and privacy-respecting technologies, there are many other relevant technologies users might want to use. We want to provide users with these cutting-edge technologies – but also be transparent. For some use cases, ChatGPT might be a reasonable solution, while for other data, it is paramount to have a local, on-prem, open solution. To differentiate these, we developed an Ethical AI Rating.

The rating has four levels:
 * Red 🔴
 * Orange 🟠
 * Yellow 🟡
 * Green 🟢

It is based on points from these factors:
 * Is the software (both for inferencing and training) open source?
 * Is the trained model freely available for self-hosting?
 * Is the training data available and free to use?

If all of these points are met, we give a Green 🟢 label. If none are met, it is Red 🔴. If 1 condition is met, it is Orange 🟠 and if 2 conditions are met, Yellow 🟡.


