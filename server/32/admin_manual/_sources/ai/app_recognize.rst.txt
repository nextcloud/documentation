======================================
App: Recognize
======================================

.. _ai-app-recognize:

The *recognize* app provides media tagging and face recognition functionality for the photos app. *Recognize* can group similar faces on user's photos ("face recognition"); it can add fitting tags to photos detecting landscapes, food, vehicles, buildings animals and other objects, as well as known landmarks and monuments; it can recognize music genres in user's audio files and adds tags for those; it can recognize human actions on user's video files and add tags for them. It specifically runs only open source models and does so entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

Front-end
---------

Tagged files will appear in the Photos app under the "Tags" section as well as in the normal Files app. Face recognition results will appear under the "People" section in the Photos app.

Requirements
------------

* Nextcloud AIO is not supported but will likely work at sub optimal speed
* Minimum supported Nextcloud version: 26
* x86 CPU
* GNU lib C
* Background Jobs must be executed via cron
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

Disk space usage
~~~~~~~~~~~~~~~~

 * ~1.5GB for all models in total

Installation
------------

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


Scaling
-------

It is possible to scale this app by adding multiple "background" nodes to your cluster that will only process background jobs by executing cron.php.

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/recognize>`_

Repository
----------

You can find the app's source repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/recognize>`_

Nextcloud customers should file bugs directly with our Support system.

Known Limitations
-----------------

* Make sure to test whether the functionality meets the use-case's quality requirements
* Machine learning models notoriously have a high energy consumption
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)

Ethical AI Rating
-----------------

Rating for Photo object detection: Green
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Positive:

* The software for training and inference of this model is open source
* The trained model is freely available, and thus can be run on-premises
* The training data is freely available, making it possible to check or correct for bias or optimize the performance and CO2 usage.

Rating for Photo face recognition: Green
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Positive:

* The software for training and inference of this model is open source
* The trained model is freely available, and thus can be run on-premises
* The training data is freely available, making it possible to check or correct for bias or optimize the performance and CO2 usage.

Rating for Video action recognition: Green
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Positive:

* The software for training and inferencing of this model is open source
* The trained model is freely available, and thus can be ran on-premises
* The training data is freely available, making it possible to check or correct for bias or optimize the performance and CO2 usage.

Rating Music genre recognition: Yellow
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Positive:

* The software for training and inference of this model is open source
* The trained model is freely available, and thus can be run on-premises

Negative:

* The training data is not freely available, limiting the ability of external parties to check and correct for bias or optimise the model’s performance and CO2 usage.

Learn more about the Nextcloud Ethical AI Rating `in our blog <https://nextcloud.com/blog/nextcloud-ethical-ai-rating/>`_.
