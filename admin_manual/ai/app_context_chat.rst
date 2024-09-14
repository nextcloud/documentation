=================
App: Context Chat
=================

.. _ai-app-context_chat:

Context Chat is an :ref:`assistant<ai-app-assistant>` feature that is implemented via an ensemble of two apps:

 * the *context_chat* app, written purely in PHP
 * the *context_chat_backend* ExternalApp written in Python

Together they provide the ContextChat text processing tasks accessible via the :ref:`Nextcloud Assistant app<ai-app-assistant>`.

The *context_chat* and *context_chat_backend* apps will use the Free text to text task processing providers like OpenAI integration, LLM2, etc. and such a provider is required on a fresh install, or it can be configured to run open source models entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

This app supports input and output mainly in English, other languages may work if the language model supports the language, but are currently not guaranteed to produce good results.

Requirements
------------

* Minimal Nextcloud version: 30
* The *context_chat_backend* app is built as an External App and thus depends on AppAPI >= 2.7.0
* Nextcloud AIO is supported
* We currently support NVIDIA GPUs and x86_64 CPUs
* CUDA >= v12.2 on your host system
* GPU Sizing

   * A NVIDIA GPU with at least 8GB VRAM
   * At least 12GB of system RAM

* CPU Sizing

   * At least 12GB of system RAM
   * This app makes use of the configured Text To Text Free prompt provider instead of running its own Language model, you will thus need only 4-8 cores for the embedding model

* A dedicated machine is recommended

Space usage
~~~~~~~~~~~

This app employs a bundled Vector DB called `Chroma<https://github.com/chroma-core/chroma>`. All the users' textual data is duplicated, chunked and stored on disk in this vector DB along with semantic embedding vectors for the content.

Assuming no shared files between users you can calculate with roughly the amount of textual data in user files (e.g. for PDFs, only the text counts, no images are kept). Any shared files will be duplicated per user, however, so, assuming all files are shared with all users you need to calculate with "the amount of textual data in user files * number of users". The reality will lie between these two estimates, of course.

Installation
------------

0. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
1. :ref:`Install AppAPI and setup a Deploy Demon<ai-app_api>`
2. Install the *context_chat_backend* ExApp via the "External Apps" admin page in Nextcloud
3. Install the *context_chat* app via the "Apps" page in Nextcloud, or by executing

.. code-block::

   occ app:enable context_chat

4. Optionally, run two instances of this occ command for faster processing of requests:

.. code-block::

   occ background-job:worker 'OC\TaskProcessing\SynchronousBackgroundJob'

**Note**: Both apps need to be installed and both major version and minor version of the two apps must match for the functionality to work (ie. "v1.3.4" and "v1.3.1"; but not "v1.3.4" and "v2.1.6"; and not "v1.3.4" and "v1.4.5"). Keep this in mind when updating.

Initial loading of data
-----------------------

Context chat will automatically load user data into the Vector DB using background jobs. To speed this up, you can set up multiple background job workers (possibly on dedicated machines) and run the following occ commands as daemons in parallel on each:

.. code-block::

   occ background-job:worker 'OCA\ContextChat\BackgroundJobs\StorageCrawlJob'

.. code-block::

   occ background-job:worker 'OCA\ContextChat\BackgroundJobs\IndexerJob'

This will ensure that the necessary background jobs are run as often as possible: ``StorageCrawlJob`` will crawl Nextcloud storages and put files that it finds into a queue and ``IndexerJob`` will iterate over the queue and load the file content into the Vector DB.

Make sure to restart these daemons regularly. For example once a day.

Scaling
-------

It is currently not possible to scale ExApps like Context Chat, we are working on this. Based on our calculations an instance has a rough capacity of 1000 user requests per hour. However, this number is based on theory and we do appreciate real-world feedback on this.

App store
---------

You can also find the *context_chat* app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/context_chat>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/context_chat>`_ and `<https://github.com/nextcloud/context_chat_backend>`_

Nextcloud customers should file bugs directly with our Customer Support.

Known Limitations
-----------------

* Language models are likely to generate false information and should thus only be used in situations that are not critical. It's recommended to only use AI at the beginning of a creation process and not at the end, so that outputs of AI serve as a draft for example and not as final product. Always check the output of language models before using it.
* Context Chat is not integrated into the Chat UI of assistant app, at the moment, but has it's own interface in the assistant modal
* Make sure to test this app for whether it meets your use-case's quality requirements
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)
* Nextcloud usernames can be only 56 characters long. This is a limitation of the vector database we use (Chroma DB) and will be fixed soon.
