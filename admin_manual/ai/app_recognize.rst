======================================
App: Recognize
======================================

.. _ai-app-recognize:

The *recognize* app provides media tagging and face recognition functionality for the memories app. *Recognize* can group similar faces on user's photos ("face recognition"); it can add fitting tags to photos detecting landscapes, food, vehicles, buildings animals and other objects, as well as known landmarks and monuments; it can recognize music genres in user's audio files and adds tags for those; it can recognize human actions on user's video files and add tags for them. It specifically runs only open source models and does so entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

The actual classification work can be carried out by one of two interchangeable backends (see `Classifier backends`_ below): the built-in Node.js/TensorFlow.js classifiers that run directly on your Nextcloud nodes, or the *recognize_backend* ExApp, which is deployed as a container via AppAPI and plugs into Nextcloud's TaskProcessing framework.

Front-end
---------

Tagged files will appear in the Memories app under the "Tags" section as well as in the normal Files app. Face recognition results will appear under the "People" section in the Memories app.

Classifier backends
-------------------

Regardless of the backend, *recognize* itself always does the same work: it crawls the file system, keeps a queue of files per model, schedules background jobs, writes the resulting tags and face detections to the database and clusters faces into persons. Only the classification step itself differs.

Node.js backend (default)
~~~~~~~~~~~~~~~~~~~~~~~~~

The classifiers ship with the app as TensorFlow.js models and are executed by spawning a Node.js child process on the Nextcloud node that runs the background job. The models have to be downloaded to each node with ``occ recognize:download-models``, and Node.js (plus FFmpeg for video) must be available on those nodes. This is the traditional and default setup described in the rest of this page.

recognize_backend ExApp (TaskProcessing)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`recognize_backend <https://github.com/nextcloud/recognize_backend>`_ is a separate Nextcloud ExApp that is deployed as a Docker container through :ref:`AppAPI <ai-app_api>`. It registers one TaskProcessing provider per classification task type, and *recognize* then hands off batches of files as TaskProcessing tasks instead of spawning local Node.js processes. Results are picked up asynchronously and applied to tags and face detections exactly as before.

Compared to the Node.js backend this means:

* No Node.js, no FFmpeg binary, no ``occ recognize:download-models`` and no TensorFlow.js on the Nextcloud nodes; the Nextcloud nodes only schedule and collect tasks
* The classification load can be moved to a dedicated (GPU) machine, independent of the nodes that run cron
* Newer, larger and generally more accurate models (see the table below), loaded through their canonical Python libraries (Hugging Face ``transformers``, ``insightface``)
* GPU acceleration through CUDA, with automatic fall back to CPU if no usable GPU is present
* Drawback: a sizeable container image and model downloads, and a hard dependency on AppAPI and a working deploy daemon

The following task types and models are implemented by *recognize_backend*:

.. list-table::
   :header-rows: 1

   * - Task type
     - Recognize feature
     - Model
   * - ``recognize:image:classification``
     - Object recognition
     - ConvNeXt V2 (Large, 384, ImageNet-22k)
   * - ``recognize:image:facerecognition``
     - Face recognition
     - InsightFace ``buffalo_l`` (SCRFD detector + ArcFace 512-dim embeddings)
   * - ``recognize:audio:classification``
     - Music genre recognition
     - Audio Spectrogram Transformer (AudioSet, 527 classes), plus a dedicated music genre classifier for clips detected as music
   * - ``recognize:video:classification``
     - Video action recognition
     - VideoMAE (Large, Kinetics-400)

Landmark recognition is currently **not** part of *recognize_backend*. Images that object recognition identifies as buildings are still queued for the Node.js landmarks classifier, so landmark recognition continues to require Node.js and ``occ recognize:download-models`` on the nodes running background jobs, even in TaskProcessing mode. If you do not want that, leave landmark recognition disabled.

Requirements
------------

Common requirements
~~~~~~~~~~~~~~~~~~~

* Background Jobs must be executed via cron

Node.js backend
~~~~~~~~~~~~~~~

* Nextcloud AIO is not supported but will likely work at sub optimal speed
* Minimum supported Nextcloud version: 26
* x86 CPU
* GNU lib C
* Using GPU processing is supported, but not required; slow performance is expected if you are not using a GPU
* We currently only support NVIDIA GPUs
* For GPU support you need to install:

   * NVIDIA® GPU drivers version 450.80.02 or higher.
   * CUDA® Toolkit 11.x
   * cuDNN SDK 8.x

* GPU Sizing

   * The models used by recognize require about 1GB of VRAM or less

* CPU Sizing

   * If you don't have a GPU, this app will utilize your CPU cores
   * The more cores you have and the more powerful the CPU the better, we recommend 10-20 cores
   * In the app settings you can set the number of cores to use
   * At least ~4GB of RAM dedicated for recognize

recognize_backend ExApp
~~~~~~~~~~~~~~~~~~~~~~~

* Nextcloud v35 or later, and at least *recognize* v13
* The `AppAPI <https://apps.nextcloud.com/apps/app_api>`_ app with a configured deploy daemon (Docker socket proxy or Harp proxy)
* x86-64 host for the deploy daemon; the published container image is built for ``linux/amd64``
* Outbound HTTPS access from the container to ``huggingface.co``, since the models are downloaded on first use
* Using GPU processing is supported, but not required; expect slow performance on CPU, especially for video

   * We currently only support NVIDIA GPUs
   * NVIDIA® GPU drivers and the NVIDIA container toolkit must be installed on the deploy daemon host; the image ships CUDA 12.2 and cuDNN 8
   * GPU Sizing: about 4-6GB of VRAM if all four task types are enabled; models are loaded lazily on first use and then stay resident for the lifetime of the container
   * If a CUDA/cuDNN runtime error occurs, the app permanently falls back to CPU for the remainder of the container's lifetime and logs a warning

* CPU Sizing

   * The more cores you have and the more powerful the CPU the better
   * At least ~8GB of RAM dedicated to the container

Disk space usage
~~~~~~~~~~~~~~~~

 * Node.js backend: ~1.5GB for all models in total, on every node that runs background jobs
 * recognize_backend ExApp: ~9GB for the container image, plus ~3GB of model weights downloaded into the app's persistent storage volume on first use

Installation
------------

Installation with the Node.js backend
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Install the *recognize* app via the "Apps" page in Nextcloud, or by executing

   occ app:enable recognize

2. Execute the following command on your server terminal of each node that runs background jobs:

   occ recognize:download-models

3. Go to your Nextcloud Administration settings and open the *recognize* admin settings page
4. Enable all modes of operation that you want the app to undertake
5. Enable GPU mode if you have a GPU that you want to use; if you want to use CPU only, you can set the number of cores to use here
6. Execute the following command on your server terminal to stop background processing of existing files:

   occ recognize:clear-background-jobs

7. Execute the following command on your server terminal to process all existing files in bulk (This may take a long time, depending on how many files you have on your instance):

   occ recognize:classify

8. Execute the following command on your server terminal to calculate face clusters from faces found in all existing files (Run this repeatedly until no more clusters are found):

   occ recognize:cluster-faces

9. All new files from this point on will be automatically processed in background tasks without manual intervention

Installation with the recognize_backend ExApp
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Install and configure the *AppAPI* app and a deploy daemon as described in :ref:`AppAPI and External Apps <ai-app_api>`
2. Install the *recognize* app via the "Apps" page in Nextcloud, or by executing

   occ app:enable recognize

3. Install the *Recognize Backend* ExApp from the "External Apps" page in your Nextcloud Administration settings. Note that the first deployment pulls a container image of roughly 9GB, so this can take a while.
4. Go to your Nextcloud Administration settings and open the *recognize* admin settings page. In the "Classifier backend" section, "Use Nextcloud TaskProcessing for classification" is switched on automatically as soon as the *recognize_backend* ExApp is installed and enabled; the Node.js, FFmpeg, WASM, GPU and resource usage sections disappear, because they no longer apply.
5. Enable all modes of operation that you want the app to undertake. If you want landmark recognition, you also have to run ``occ recognize:download-models`` on every node that runs background jobs, since landmarks are still classified locally.
6. Execute the following command on your server terminal to queue all existing files for classification (the actual work is then done by background jobs, which hand the files to the ExApp; this may take a long time, depending on how many files you have on your instance):

   occ recognize:recrawl

   Note that ``occ recognize:classify``, which classifies files synchronously on the terminal, does **not** work in TaskProcessing mode. Bulk classification always goes through cron in this mode.

7. Execute the following command on your server terminal to calculate face clusters from faces found in all existing files (Run this repeatedly until no more clusters are found):

   occ recognize:cluster-faces

8. All new files from this point on will be automatically processed in background tasks without manual intervention

The progress of running tasks is visible in the *recognize* admin settings, which shows the number of scheduled and running TaskProcessing tasks per model next to the queue counts.

Switching between backends
~~~~~~~~~~~~~~~~~~~~~~~~~~

Object, audio and video tags produced by the two backends are compatible: they end up as ordinary system tags, and you can simply leave existing tags in place, or remove them with ``occ recognize:reset-tags`` and reclassify.

Face detections are **not** compatible. The two backends use different face recognition models with different embeddings and different clustering distances, so detections created by one backend cannot be clustered together with detections created by the other. After switching the backend, reset the existing face data and let it be recomputed:

   occ recognize:reset-faces

   occ recognize:recrawl

   occ recognize:cluster-faces

(``occ recognize:reset-faces`` removes all face detections and clusters, ``occ recognize:recrawl`` puts all files back into the queues, and clustering then runs over the newly created detections. With the Node.js backend you can use ``occ recognize:classify`` instead of ``occ recognize:recrawl`` to do the classification on the terminal rather than through cron.)

Configuration of the recognize_backend ExApp
--------------------------------------------

The defaults are sensible for most instances. If you want to change models or thresholds, the following environment variables can be set on the ExApp, either in the deploy daemon UI or with ``occ app_api:app:register`` / your container runtime:

* ``RECOGNIZE_IMAGE_MODEL`` — Hugging Face model id for object recognition (default: ``facebook/convnextv2-large-22k-384``)
* ``RECOGNIZE_IMAGE_TOP_K`` — maximum number of labels returned per image
* ``RECOGNIZE_IMAGE_THRESHOLD`` — minimum probability for an image label to be returned
* ``RECOGNIZE_FACE_MODEL`` — InsightFace model pack for face recognition (default: ``buffalo_l``)
* ``RECOGNIZE_FACE_DET_SIZE`` — square input size in pixels for the face detector (default: ``640``); larger values find smaller faces at the cost of speed
* ``RECOGNIZE_AUDIO_MODEL`` — Hugging Face model id for audio classification (default: ``MIT/ast-finetuned-audioset-10-10-0.4593``)
* ``RECOGNIZE_AUDIO_TOP_K`` — maximum number of categories returned per audio file (default: ``5``)
* ``RECOGNIZE_AUDIO_THRESHOLD`` — minimum probability for an audio category to be returned (default: ``0.2``)
* ``RECOGNIZE_MUSIC_GENRE_ENABLED`` — set to ``0`` to skip the dedicated music genre classifier even when the audio is detected as music (default: ``1``)
* ``RECOGNIZE_MUSIC_GENRE_MODEL`` — Hugging Face model id for music genre classification (default: ``dima806/music_genres_classification``)
* ``RECOGNIZE_MUSIC_GENRE_TOP_K`` — maximum number of genre labels appended for music clips (default: ``3``)
* ``RECOGNIZE_MUSIC_GENRE_THRESHOLD`` — minimum probability for a genre label to be appended (default: ``0.25``)
* ``RECOGNIZE_MUSIC_DETECTION_THRESHOLD`` — minimum probability on a "music"/"singing" label required to run the genre classifier at all (default: ``0.3``)
* ``RECOGNIZE_VIDEO_MODEL`` — Hugging Face model id for video classification (default: ``MCG-NJU/videomae-large-finetuned-kinetics``)
* ``RECOGNIZE_VIDEO_TOP_K`` — maximum number of categories returned per video (default: ``5``)
* ``RECOGNIZE_VIDEO_THRESHOLD`` — minimum probability for a video category to be returned (default: ``0.15``)
* ``RECOGNIZE_VIDEO_FRAMES`` — number of evenly spaced frames sampled per video clip (default: ``16``)
* ``TASK_POLLING_INTERVAL`` — seconds between polls for new TaskProcessing jobs when idle (default: ``5``)

Any Hugging Face model compatible with the corresponding ``transformers`` pipeline, and any InsightFace model pack, can be used. Note that the *recognize* app maps the returned labels onto its own tag vocabulary, so swapping in an unrelated model may produce labels that are dropped.

Scaling
-------

With the Node.js backend it is possible to scale this app by adding multiple "background" nodes to your cluster that will only process background jobs by executing cron.php.

With the *recognize_backend* ExApp, the Nextcloud nodes only schedule tasks and apply results, so the classification throughput is determined by the machine that hosts the ExApp container: give it a GPU, more CPU cores and more RAM to speed up processing. Files are handed over in batches of up to 500 per task, and the container processes one task at a time. You still need cron to run on your Nextcloud nodes so that files are crawled, queued and handed over.

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/recognize>`_

The ExApp backend is listed separately: `<https://apps.nextcloud.com/apps/recognize_backend>`_

Repository
----------

You can find the app's source repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/recognize>`_

The source of the ExApp backend lives in a separate repository: `<https://github.com/nextcloud/recognize_backend>`_

Nextcloud customers should file bugs directly with our Support system.

Known Limitations
-----------------

* Make sure to test whether the functionality meets the use-case's quality requirements
* Machine learning models notoriously have a high energy consumption
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)
* When using the *recognize_backend* ExApp:

   * Landmark recognition is not provided by the ExApp and still runs locally via Node.js
   * Face detections created by the two backends are not interchangeable; switching the backend requires resetting and recomputing face data
   * Models are downloaded from Hugging Face on first use, so the container needs internet access at least once, and the first task of each type is noticeably slower than subsequent ones

Ethical AI Rating
-----------------

Node.js backend
~~~~~~~~~~~~~~~

Rating for Photo object detection: Green
****************************************

Positive:

* The software for training and inference of this model is open source
* The trained model is freely available, and thus can be run on-premises
* The training data is freely available, making it possible to check or correct for bias or optimize the performance and CO2 usage.

Rating for Photo face recognition: Green
****************************************

Positive:

* The software for training and inference of this model is open source
* The trained model is freely available, and thus can be run on-premises
* The training data is freely available, making it possible to check or correct for bias or optimize the performance and CO2 usage.

Rating for Video action recognition: Green
******************************************

Positive:

* The software for training and inferencing of this model is open source
* The trained model is freely available, and thus can be ran on-premises
* The training data is freely available, making it possible to check or correct for bias or optimize the performance and CO2 usage.

Rating Music genre recognition: Yellow
**************************************

Positive:

* The software for training and inference of this model is open source
* The trained model is freely available, and thus can be run on-premises

Negative:

* The training data is not freely available, limiting the ability of external parties to check and correct for bias or optimise the model’s performance and CO2 usage.

recognize_backend ExApp
~~~~~~~~~~~~~~~~~~~~~~~

Rating: Yellow
**************

Positive:

* The software for training and inference of all bundled models is open source
* The trained models are freely available, and thus can be run on-premises

Negative:

* The training data of the models is not freely available, limiting the ability of external parties to check and correct for bias or optimise the models' performance and CO2 usage.

Learn more about the Nextcloud Ethical AI Rating `in our blog <https://nextcloud.com/blog/nextcloud-ethical-ai-rating/>`_.
