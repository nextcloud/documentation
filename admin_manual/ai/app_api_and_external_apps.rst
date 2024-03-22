========================
AppAPI and External Apps
========================

.. _ai-app_api:

Previously, Nextcloud only supported applications written in the PHP programming language. In order to support a wider range of use cases,
the External App ecosystem was introduced, which allows installing apps that are docker containers.

Most of our AI apps nowadays are ExApps (External Apps) and thus require some preparation of your Nextcloud before you can install them.

Installation
------------

1. You will need to install the `AppAPI <https://apps.nextcloud.com/apps/app_api>`_ Nextcloud app from the app store.
2. You will need to set up a Deploy Daemon in the AppAPI admin settings. A Deploy Daemon is a way for Nextcloud to install and communicate with and control External Apps.

   1. You will need to `setup a docker container called docker-socket-proxy that proxies access to docker for your Nextcloud instance <https://github.com/cloud-py-api/docker-socket-proxy#readme>`_
   2. Now you can connect your Nextcloud to the docker-socket-proxy by entering its details in the Deploy Daemon creation form in the AppAPI settings.
   3. Make sure to enable GPU support if you want the installed ExApps to be able to use the GPU

3. You can now install ExApps from the Nextcloud Appstore by clicking "Install" on the respective app in the AppAPI apps page.

FAQ
---

* I have two graphic cards XXX with 6/8/Y GB of ram each, how can I run something what does not fit in one graphic card?
  * Distributing models across multiple GPUs is currently not supported. You will need a GPU that fits all of the model you are trying to use.
* I have YYY graphic card that does not supports CUDA - can I use it and how?
  * No, our AI apps require GPUs with CUDA support to function
* What is the minimum VRAM size requirement for a GPU if I want to install multiple apps?
  * When running multiple ExApps on the same GPU, it is currently required that the GPU can hold the largest model of the apps you install
* Is it possible to add more graphics cards for my instance to enable parallel requests or to speed up one request?
  * Parallel processing of AI workloads of the same app with multiple GPUs is currently not supported
* Can I use in parallel CPU and GPU for AI processing?
  * No, you can only process AI workloads for one app either on CPU or GPU. Between apps you can decide which app you want to run on CPU or GPU.
