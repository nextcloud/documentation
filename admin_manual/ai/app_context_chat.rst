=================
App: Context Chat
=================

.. _ai-app-context_chat:

Context Chat is an :ref:`assistant<ai-app-assistant>` feature that is implemented via an ensemble of two apps:

 * the *context_chat* app, written purely in PHP
 * the *context_chat_backend* ExternalApp written in Python

Together they provide the ContextChat text processing tasks accessible via the :ref:`Nextcloud Assistant app<ai-app-assistant>`.

The *context_chat* and *context_chat_backend* apps will use the Free text-to-text task processing providers like OpenAI integration, LLM2, etc. and such a provider is required on a fresh install, or it can be configured to run open source models entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

This app supports input and output in the same languages that the currently configured Free text-to-text task processing provider supports.

Requirements
------------

* Minimal Nextcloud version: 30
* Nextcloud AIO is supported
* We currently support NVIDIA GPUs and x86_64 CPUs
* CUDA >= v12.2 on your host system
* GPU Setup Sizing

   * A NVIDIA GPU with at least 2GB VRAM
      * The requirements for the Free text-to-text providers should be checked separately
      * llm2's requirements can be found :ref:`here <ai-app-llm2>`
      * integration_openai does not have any additional GPU requirements
   * At least 8GB of system RAM
      * 2 GB + additional 500MB for each concurrent request made to the backend if configuration parameters are changed

* CPU Setup Sizing

   * At least 12GB of system RAM
      * 2 GB + additional 500MB for each request made to the backend if the Free text-to-text provider is not on the same machine
      * 8 GB is recommended in the above case for the default settings
   * This app makes use of the configured free text-to-text task processing provider instead of running its own language model by default, you will thus need 4+ cores for the embedding model only (backed configuration needs changes to make use of the extra cores, refer to `Configuration Options (Backend)`_)

* A dedicated machine is recommended

Space usage
~~~~~~~~~~~

This app employs a bundled DB with Vector support called `PostgreSQL <https://www.postgresql.org/>`_. All the users' textual data is duplicated, chunked and stored on disk in this vector DB along with semantic embedding vectors for the content.

Installation
------------

1. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
2. Setup a :ref:`Deploy Demon <ai-app_api>` in AppAPI Admin settings
3. Install the *context_chat_backend* ExApp via the "Apps" page in Nextcloud, or by executing (checkout the readme at https://github.com/nextcloud/context_chat_backend for manual install steps)

.. code-block::

   occ app_api:app:register context_chat_backend

4. Install the *context_chat* app via the "Apps" page in Nextcloud, or by executing

.. code-block::

   occ app:enable context_chat

5. Install a text generation backend like :ref:`llm2 <ai-app-llm2>` or `integration_openai <https://github.com/nextcloud/integration_openai>`_ via the "Apps" page in Nextcloud

6. Optionally but recommended, setup background workers for faster pickup of tasks. See :ref:`the relevant section in AI Overview<ai-overview_improve-ai-task-pickup-speed>` for more information.

**Note**: Both apps need to be installed and both major version and minor version of the two apps must match for the functionality to work (ie. "v1.3.4" and "v1.3.1"; but not "v1.3.4" and "v2.1.6"; and not "v1.3.4" and "v1.4.5"). Keep this in mind when updating.


Initial loading of data
-----------------------

Context chat will automatically load user data into the Vector DB using background jobs. To speed this up, you can run the following command to index all documents for a user synchronously:
Note: This does not interact with the auto-indexing feature and that list would remain unchanged. However, the indexed files would be skipped when the auto indexer runs.

.. code-block::

   occ context_chat:scan <user_id>

To speed up the asynchronous indexing, see the `Configuration Options (OCC)`_.

See :ref:`the task speedup section in AI Overview<ai-overview_improve-ai-task-pickup-speed>` to know better ways to run these jobs.

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

Commands (OCC)
--------------

The options for each command can be found like this, using scan as example: ``context_chat:scan --help``

* ``context_chat:diagnostics``
   Check currently running ContextChat background processes.

* ``context_chat:prompt``
   Ask a question about your data, with options for selective context.

* ``context_chat:scan``
   Scan and index the user's documents based on the user ID provided, synchronously.

* ``context_chat:stats``
   | Shows the time taken to complete the initial indexing of the documents if it has finished,
   | and the current no. of items in the indexer and actions queue.
   | "Actions" refers to tasks like file deletions, ownership changes through share changes, etc.
   | These file and ownership changes are synced with the backed through this actions queue.


Configuration Options (OCC)
---------------------------

* ``auto_indexing`` boolean (default: true)
   To allow/disallow the IndexerJob from running in the background

.. code-block::

   occ config:app:set context_chat auto_indexing --value=true --type=boolean

* ``indexing_batch_size`` integer (default: 100)
   The number of files to index per run of the indexer background job

.. code-block::

   occ config:app:set context_chat indexing_batch_size --value=100 --type=integer

* ``indexing_max_time`` integer (default: 1800)
   The number of seconds to index files for per run, regardless of batch size

.. code-block::

   occ config:app:set context_chat indexing_max_time --value=1800 --type=integer

* ``indexing_max_jobs_count`` integer (default: 3)
   The maximum number of Indexer jobs allowed to run at the same time

.. code-block::

   occ config:app:set context_chat indexing_max_jobs_count --value=3 --type=integer


Configuration Options (Backend)
-------------------------------

Refer to `the Configuration head <https://github.com/nextcloud/context_chat_backend?tab=readme-ov-file#configuration>`_ in the backend's readme.


Possibility of Data Leak
------------------------

It is possible that some users who have been denied access to certain files/folders still have access to the content of those files/folders through the Context Chat app. We're working on a solution for this.
The users who never had access to a particular file/folder will NOT be able to see those contents in any way.

Known Limitations
-----------------

* Language models are likely to generate false information and should thus only be used in situations that are not critical. It's recommended to only use AI at the beginning of a creation process and not at the end, so that outputs of AI serve as a draft for example and not as final product. Always check the output of language models before using it and make sure whether it meets your use-case's quality requirements.
* Context Chat is not integrated into the Chat UI of assistant app, at the moment, but has it's own interface in the assistant modal
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI).
* Large files are not supported in "Selective context" in the Assistant UI if they have not been indexed before. Use ``occ context_chat:scan <user_id> -d <directory_path>`` to index the desired directory synchronously and then use the Selective context option. "Large files" could mean differently for different users. It depends on the amount of text inside the documents in question and the hardware on which the indexer is running. Generally 20 MB should be large for a CPU-backed setup and 100 MB for a GPU-backed system.
* Password protected PDFs or any other files are not supported. There will be error logs mentioning cryptography and AES in the docker container when such files are encountered but it is nothing to worry about, they will be simply ignored and the system will continue to function normally.
