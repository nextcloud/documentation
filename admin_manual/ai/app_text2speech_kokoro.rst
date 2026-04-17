==============================================
App: Local Text-To-Speech (text2speech_kokoro)
==============================================

.. _ai-app-text2speech_kokoro:

The *text2speech_kokoro* app is one of the apps that provide Text-To-Speech functionality in Nextcloud and act as a speech generation backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>` and :ref:`other apps making use of the core `Text-To-Speech Task type<t2s-consumer-apps>`. The *text2speech_kokoro* app specifically runs only open source models and does so entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

This app uses `Kokoro <https://github.com/hexgrad/kokoro>`_ under the hood.

The used model supports the following languages:

* American English
* British English
* Spanish
* French
* Italian
* Hindi
* Portuguese
* Japanese
* Mandarin

Requirements
------------

* Minimal Nextcloud version: 31
* This app is built as an External App and thus depends on AppAPI v2.3.0
* Nextcloud AIO is supported
* We currently support x86_64 CPUs
* We do not support GPUs

* CPU Sizing

   * The more cores you have and the more powerful the CPU the better, we recommend around 10 cores
   * The app will hog all cores by default, so it is usually better to run it on a separate machine
   * 800MB RAM

Installation
------------

0. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
1. :ref:`Install AppAPI and setup a Deploy Demon<ai-app_api>`
2. Install the *text2speech_kokoro* "Local Text-To-Speech" ExApp via the "Apps" page in the Nextcloud web admin user interface


Scaling
-------

It is currently not possible to scale this app, we are working on this. Based on our calculations an instance has a rough capacity of 4h of transcription throughput per minute (measured with 8 CPU threads on an Intel(R) Xeon(R) Gold 6226R). It is unclear how close to real-world usage this number is, so we do appreciate real-world feedback on this.

App store
---------

You can also find this app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/text2speech_kokoro>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/text2speech_kokoro>`_

Nextcloud customers should file bugs directly with our customer support.

Known Limitations
-----------------

* We currently only support languages supported by the underlying Kokoro model
* The Kokoro models perform unevenly across languages, and may show lower accuracy on low-resource and/or low-discoverability languages or languages where there was less training data available.
* Make sure to test the language model you are using it for whether it meets the use-case's quality requirements
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)
