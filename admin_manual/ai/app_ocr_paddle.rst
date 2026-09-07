=====================================================
App: Local Optical Character Recognition (ocr_paddle)
=====================================================

.. _ai-app-ocr_paddle:

The *ocr_paddle* app is one of the apps that provide Optical Character Recognition functionality in Nextcloud and act as an OCR backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>` and :ref:`other apps making use of the core OpticalCharacterRecognition Task type<ocr-consumer-apps>`. The *ocr_paddle* app specifically runs only open source models and does so entirely on-premises. Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

This app uses `PaddleOCR_VL <https://huggingface.co/PaddlePaddle/PaddleOCR-VL>`_ under the hood.

The used model supports 109 languages, covering major global languages, including but not limited to Chinese, English, Japanese, Latin, and Korean, as well as languages with different scripts and structures, such as Russian (Cyrillic script), Arabic, Hindi (Devanagari script), and Thai.

PDFs are supported; multi-page PDFs come back as one document.

Requirements
------------

* Minimal Nextcloud version: 35
* This app is built as an External App and thus depends on at least AppAPI v3.1.0
* Nextcloud AIO is supported
* We currently support x86_64 & arm64 CPUs as well as NVIDIA GPUs

* CPU Sizing

   * If you don't have a GPU, this app will utilize your CPU cores
   * The more cores you have and the more powerful the CPU the better, we recommend 10-20 cores, but the runtime will still be very slow on CPU only
   * The app will hog all cores by default, so it is usually better to run it on a separate machine
   * 7.5GB of free system RAM

* GPU Sizing

   * NVIDIA GPU
   * Minimum of 6GB free VRAM

Installation
------------

0. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
1. :ref:`Install AppAPI and setup a Deploy Daemon<ai-app_api>`
2. Install the *ocr_paddle* "Local OCR: PaddleOCR" ExApp via the "Apps" page in the Nextcloud web admin user interface


Scaling
-------

It is currently not possible to scale this app, we are working on this. If you have real world data on how many files this app can process per minute, we will gladly list it here.

App store
---------

You can also find this app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/ocr_paddle>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/ocr_paddle>`_

Nextcloud customers should file bugs directly with our customer support.

Known Limitations
-----------------

* We currently only support languages supported by the underlying PaddleOCR-VL model
* The PaddleOCR-VL model performs unevenly across languages, and may show lower accuracy on low-resource and/or low-discoverability languages or languages where there was less training data available.
* Only the first 50 pages of PDF files are read (configurable via the ``OCR_MAX_PDF_PAGES`` deploy option), longer PDFs are silently truncated.
* PDF pages are rasterized at 170 DPI (configurable via the ``OCR_PDF_DPI`` deploy option) before OCR
* Inputs are downscaled to ≤2.8 MP (max_pixels: 2822400), so high-resolution scans lose detail before OCR runs.
* Make sure to test the language model you are using it for whether it meets the use-case's quality requirements
* Customer support is available upon request, however we can't solve false or problematic output, most performance issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the implementation of the app (connectors, API, front-end, AppAPI)
