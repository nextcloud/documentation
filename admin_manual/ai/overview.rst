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
   "Text processing using LLMs","`llm2 (ExApp) <https://apps.nextcloud.com/apps/llm2>`_","Green","Yes","Yes - Llama 3.1 model by Meta","Yes","Yes"
   "","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Yellow","Yes","Yes - e.g. Llama models by Meta", "No","Yes"
   "Machine translation","`Local Machine Translation 2 (ExApp) <https://apps.nextcloud.com/apps/translate2>`_","Green","Yes","Yes - MADLAD models by Google","Yes","Yes"
   "","`DeepL integration <https://apps.nextcloud.com/apps/integration_deepl>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_","Red","No","No","No","No"
   "","`OpenAI and LocalAI integration (via LocalAI) <https://apps.nextcloud.com/apps/integration_openai>`_","Green","Yes","Yes","Yes","Yes"
   "Speech to Text","`Local Whisper Speech-To-Text 2 (ExApp) <https://apps.nextcloud.com/apps/stt_whisper2>`_","Yellow","Yes","Yes - Whisper models by OpenAI","No","Yes"
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

Text processing
^^^^^^^^^^^^^^^

.. _tp-consumer-apps:

As you can see in the table above we have multiple apps offering text processing using Large language models.
In downstream apps like Context Chat and assistant, users can use the text processing functionality regardless of which app implements it behind the scenes.

Frontend apps
~~~~~~~~~~~~~

* *Text* for offering an inline graphical UI for the various tasks
* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ for offering a graphical UI for the various tasks and a smart picker
* `Mail <https://apps.nextcloud.com/apps/mail>`_ for summarizing mail threads (see :ref:`the Nextcloud Mail docs<mail_thread_summary>` for how to enable this)
* `Summary Bot <https://apps.nextcloud.com/apps/summary_bot>`_ for summarizing chat histories in `Talk <https://apps.nextcloud.com/apps/spreed>`_


Backend apps
~~~~~~~~~~~~

* :ref:`llm2<ai-app-llm2>` - Runs open source AI LLM models on your own server hardware  (Customer support available upon request)
* `OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_ - Integrates with the OpenAI API to provide AI functionality from OpenAI servers  (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)


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

* :ref:`translate2 (ExApp)<ai-app-translate2>` - Runs open source AI translation models locally on your own server hardware (Customer support available upon request)
* *integration_deepl* - Integrates with the deepl API to provide translation functionality from Deepl.com servers (Only community supported)

Speech-To-Text
^^^^^^^^^^^^^^

.. _stt-consumer-apps:

As you can see in the table above we have multiple apps offering Speech-To-Text capabilities. In downstream apps like the Talk app, users can use the transcription functionality regardless of which app implements it behind the scenes.

Frontend apps
~~~~~~~~~~~~~

* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ offering a graphical translation UI and a smart picker
* `Talk <https://apps.nextcloud.com/apps/spreed>`_ for transcribing calls (see `Nextcloud Talk docs <https://nextcloud-talk.readthedocs.io/en/latest/settings/#app-configuration>`_ for how to enable this)

Backend apps
~~~~~~~~~~~~

* :ref:`stt_whisper2<ai-app-stt_whisper2>` - Runs open source AI Speech-To-Text models on your own server hardware  (Customer support available upon request)
* `OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_ - Integrates with the OpenAI API to provide AI functionality from OpenAI servers  (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)


Image generation
^^^^^^^^^^^^^^^^

.. _t2i-consumer-apps:

As you can see in the table above we have multiple apps offering Image generation capabilities. In downstream apps like the Text-to-Image helper app, users can use the image generation functionality regardless of which app implements it behind the scenes.

Frontend apps
~~~~~~~~~~~~~

* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ for offering a graphical UI and a smart picker

Backend apps
~~~~~~~~~~~~

* text2image_stablediffusion (Customer support available upon request)
* `OpenAI and LocalAI integration (via OpenAI API) <https://apps.nextcloud.com/apps/integration_openai>`_ - Integrates with the OpenAI API to provide AI functionality from OpenAI servers (Customer support available upon request; see :ref:`AI as a Service<ai-ai_as_a_service>`)
* *integration_replicate* - Integrates with the replicate API to provide AI functionality from replicate servers (see :ref:`AI as a Service<ai-ai_as_a_service>`)


Context Chat
^^^^^^^^^^^^
Our Context Chat feature was introduced in Nextcloud Hub 7 (v28). It allows asking questions to the assistant related to your documents in Nextcloud. You will need to install both the context_chat app as well as the context_chat_backend External App. Be prepared that things might break or be a little rough around the edges. We look forward to your feedback!

Frontend apps
~~~~~~~~~~~~~

* `Assistant <https://apps.nextcloud.com/apps/assistant>`_ for offering a graphical UI for the context chat tasks

Backend apps
~~~~~~~~~~~~

* :ref:`context_chat + context_chat_backend<ai-app-context_chat>` -  (Customer support available upon request)

Provider apps
~~~~~~~~~~~~~

Apps can integrate their content with Context Chat to make it available for querying using Context Chat. The following apps have implemented this integration so far:

* *files*
* `Analytics <https://apps.nextcloud.com/apps/analytics>`_

.. _ai-overview_improve-ai-task-pickup-speed:

Improve AI task pickup speed
----------------------------

Most AI tasks will be run as part of the background job system in Nextcloud which only runs jobs every 5 minutes by default.
To pick up scheduled jobs faster you can set up background job workers inside your Nextcloud main server/container that process AI tasks as soon as they are scheduled.
If the PHP code or the Nextcloud settings values are changed while a worker is running, those changes won't be effective inside the runner. For that reason, the worker needs to be restarted regularly. It is done with a timeout of N seconds which means any changes to the settings or the code will be picked up after N seconds (worst case scenario). This timeout does not, in any way, affect the processing or the timeout of the AI tasks.

Screen or tmux session
^^^^^^^^^^^^^^^^^^^^^^

Run the following occ command inside a screen or a tmux session, preferably 4 or more times for parallel processing of multiple requests by different or the same user (and as a requirement for some apps like context_chat).
It would be best to run one command per screen session or per tmux window/pane to keep the logs visible and the worker easily restartable.

.. code-block::

   set -e; while true; do sudo -u www-data occ background-job:worker -v -t 60 "OC\TaskProcessing\SynchronousBackgroundJob"; done

For Nextcloud-AIO you should use this command on the host server.

.. code-block::

   set -e; while true; do docker exec -u www-data -it nextcloud-aio-nextcloud php occ background-job:worker -v -t 60 "OC\TaskProcessing\SynchronousBackgroundJob"; done

You may want to adjust the number of workers and the timeout (in seconds) to your needs.
The logs of the worker can be checked by attaching to the screen or tmux session.

Systemd service
^^^^^^^^^^^^^^^

1. Create a systemd service file in ``/etc/systemd/system/nextcloud-ai-worker@.service`` with the following content:

.. code-block::

   [Unit]
   Description=Nextcloud AI worker %i
   After=network.target

   [Service]
   ExecStart=/opt/nextcloud-ai-worker/taskprocessing.sh %i
   Restart=always
   StartLimitInterval=60
   StartLimitBurst=10

   [Install]
   WantedBy=multi-user.target

2. Create a shell script in ``/opt/nextcloud-ai-worker/taskprocessing.sh`` with the following content and make sure to make it executable:

.. code-block::

   #!/bin/sh
   echo "Starting Nextcloud AI Worker $1"
   cd /path/to/nextcloud
   sudo -u www-data php occ background-job:worker -t 60 'OC\TaskProcessing\SynchronousBackgroundJob'

You may want to adjust the timeout to your needs (in seconds).

3. Enable and start the service 4 or more times:

.. code-block::

   for i in {1..4}; do systemctl enable --now nextcloud-ai-worker@$i.service; done

The status of the workers can be checked with (replace 1 with the worker number):

.. code-block::

   systemctl status nextcloud-ai-worker@1.service

The list of workers can be checked with:

.. code-block::

   systemctl list-units --type=service | grep nextcloud-ai-worker

The complete logs of the workers can be checked with (replace 1 with the worker number):

.. code-block::

   journalctl -xeu nextcloud-ai-worker@1.service -f


Frequently Asked Questions
--------------------------

Why is my prompt slow?
^^^^^^^^^^^^^^^^^^^^^^

Reasons for slow performance from a user perspective can be

 * Using CPU processing instead of GPU (sometimes this limit is imposed by the used app)
 * High user demand for the feature: User prompts and AI tasks are usually processed in the order they are received, which can cause delays when a lot of users access these features at the same time.
