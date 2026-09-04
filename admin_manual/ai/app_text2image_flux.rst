===================================================
App: Local Image Generation: Flux (text2image_flux)
===================================================

.. _ai-app-text2image_flux:

The *text2image_flux* app is one of the apps that provide image generation functionality in Nextcloud and act as an
image generation backend for the :ref:`Nextcloud Assistant app<ai-app-assistant>` and :ref:`other apps making use of
the image generation functionality<t2i-consumer-apps>`. It also provides image editing (image-to-image) from a text
prompt. The *text2image_flux* app specifically runs only open source models and does so entirely on-premises.
Nextcloud can provide customer support upon request, please talk to your account manager for the possibilities.

Providers
---------

The app registers the following Task Processing providers:

* **Nextcloud Local Image Generation: Flux 2 Klein 4B** - text-to-image (``core:text2image``)
* **Nextcloud Local Image Generation: Flux 2 Klein 4B (Enhanced)** - text-to-image with automatic prompt refinement
  via a text-to-text provider (``core:text2text``) before generation
* **Nextcloud Local Image Editing: Flux 2 Klein 4B** - image editing from a prompt (``core:image2image`` on
  Nextcloud 36+; a custom ``text2image_flux:image2image`` task type on Nextcloud 35 and older)

Select the providers in the Nextcloud AI admin settings. For the Enhanced provider, also install and enable a
text-to-text backend such as :ref:`llm2<ai-app-llm2>`.

Default output size is ``1024x1024``. You can override the size per task (``WxH`` format) or change the default via the
``DEFAULT_SIZE`` deploy option (see :ref:`Configuration <ai-app-text2image_flux-configuration>` below).

Requirements
------------

* Minimal Nextcloud version: 30
* This app is built as an External App and thus depends on AppAPI v3.1.0 or higher
* Nextcloud AIO is supported
* We currently support NVIDIA GPUs and x86_64 CPUs
* CUDA >= v12.2 on your host system
* GPU Sizing

   * A NVIDIA GPU with at least 8GB VRAM (roughly 7GB used)
   * At least 8GB of system RAM

* CPU Sizing

   * CPU inference is supported but very slow; for faster generation prefer a GPU or use
     :ref:`text2image_stablediffusion2<ai-app-text2image_stablediffusion2>`
   * At least 12GB of system RAM
   * The more cores you have and the more powerful the CPU the better, we recommend 10-20 cores
   * The app will hog all cores by default, so it is usually better to run it on a separate machine

Installation
------------

0. Make sure the :ref:`Nextcloud Assistant app<ai-app-assistant>` is installed
1. :ref:`Install AppAPI and setup a Deploy Demon<ai-app_api>`
2. Install the **Local Image Generation: Flux** ExApp via the "Apps" page in the Nextcloud web admin user interface
3. Optionally install a text-to-text provider such as :ref:`llm2<ai-app-llm2>` if you want to use the Enhanced
   text-to-image provider
4. Select the Flux providers in the Nextcloud AI admin settings

.. _ai-app-text2image_flux-configuration:

Configuration
-------------

You can set the following environment variables in the :ref:`Deploy Options <ai-app_api_deploy_options>` when installing
or redeploying the ExApp:

* ``NUM_INFERENCE_STEPS`` - Number of denoising steps used when generating or editing images. Default is ``4``.
* ``DEFAULT_SIZE`` - Default size of generated or edited images in ``WxH`` format (for example ``1024x1024``). Used when
  no size is provided with the task. Default is ``1024x1024``.

Scaling
-------

It is currently not possible to scale this app, we are working on this. Throughput is lower than with
:ref:`text2image_stablediffusion2<ai-app-text2image_stablediffusion2>` because Flux generation is slower. We do
appreciate real-world feedback on capacity.

App store
---------

You can also find the app in our app store, where you can write a review:
`<https://apps.nextcloud.com/apps/text2image_flux>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features:
`<https://github.com/nextcloud/text2image_flux>`_

Nextcloud customers should file bugs directly with our Support system.

Ethical AI Rating
-----------------

**Rating: Yellow**

Positive:

* The software for training and inferencing of this model is open source
* The trained model is freely available under Apache 2.0, and thus can be run on-premises

Negative:

* The training data is not freely available, making it not possible to check or correct for bias or optimise the
  performance and CO2 usage

Learn more about the Nextcloud Ethical AI Rating
`in our blog <https://nextcloud.com/blog/nextcloud-ethical-ai-rating/>`_.

Known Limitations
-----------------

* Image generation and editing are slower than with
  :ref:`text2image_stablediffusion2<ai-app-text2image_stablediffusion2>`; prefer that app if speed matters more than quality
* The Enhanced provider depends on a working text-to-text Task Processing provider; if prompt improvement fails, the original prompt is used
* Faces and people in general may not be generated properly
* The results for certain image generation requests can be biased and may enforce stereotypes
* We currently only support languages that the underlying model supports; correctness of language use in languages other
  than English may be poor depending on the language's coverage in the model's training data
* Make sure to test the app for whether it meets the use-case's quality requirements
* Customer support is available upon request, however we can't solve false or problematic output, most performance
  issues, or other problems caused by the underlying model. Support is thus limited only to bugs directly caused by the
  implementation of the app (connectors, API, front-end, AppAPI)
