==========================================
App: Local Machine translation (translate)
==========================================

.. _ai-app-translate:

The *translate* app is one of the apps that provide machine translation functionality in Nextcloud and act as a translation backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>`, the *text* app and :ref:`other apps making use of the core Translation API<mt-consumer-apps>`. The *translate* app specifically runs only open source models and does so entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

The app currently supports the following languages:

* English (en)
* German (de)
* French (fr)
* Spanish (es)
* Chinese (zh)

As the models are entirely open source, the quality of translations may not be comparable to commercially available machine translation services.

Requirements
------------

* Minimal Nextcloud version: 26
* x86 CPU with 4-8 cores for the app to use (The more cores the faster it will be)
* 2GB of RAM for the app should be enough
* GNU lib C (musl is not supported)
* This app does not support using GPU for processing and may thus not be performing ideally for long texts
* The workload will run on the web server workers

(*Note*: Nextcloud AIO is currently not supported due to it using musl)

Space usage
~~~~~~~~~~~

 * ~1GB per language pair
 * ~10GB in total

Installation
------------

0. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
1. Install the *translate* app via the "Apps" page in Nextcloud, or by executing

   occ app:enable translate

Setup
~~~~~

After installing this app you will need to run:

.. code-block::

   occ translate:download-models

You may also download only specific languages by using the following command:

.. code-block::

   occ translate:download-models <languages>

For example

.. code-block::

   occ translate:download-models de en

will download both en->de and de->en.

.. code-block::

   occ translate:download-models de en es

will download en->de, de->en, en->es, es->en, es->de, de->es

App store
---------

You can also find the app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/translate>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/translate>`_

Nextcloud customers should file bugs directly with our Customer Support.

Ethical AI Rating
-----------------

Rating: 🟢
~~~~~~~~~~

Positive:
* the software for training and inference of this model is open source
* the trained model is freely available, and thus can be run on-premises
* the training data is freely available, making it possible to check or correct for bias or optimise the performance and CO2 usage.

Learn more about the Nextcloud Ethical AI Rating `in our blog <https://nextcloud.com/blog/nextcloud-ethical-ai-rating/>`.

Known Limitations
-----------------

* Language models are likely to generate false information and should thus only be used in situations that are not critical. It's recommended to only use AI at the beginning of a creation process and not at the end, so that outputs of AI serve as a draft for example and not as final product. Always check the output of language models before using it.
* Make sure to test the translation model you are using it for whether it meets the use-case's quality requirements
* Language models notoriously have a high energy consumption
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying models. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)
