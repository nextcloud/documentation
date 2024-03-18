=================
App: Context Chat
=================

.. _ai-app-context_chat:

Context Chat is an :ref:`assistant<ai-app-assistant>` feature that is implemented via an ensemble of two apps:

 * the *context_chat* app, written purely in PHP
 * the *context_chat_backend* ExternalApp written in Python

Together they provide the ContextChat text processing tasks accessible via the :ref:`Nextcloud Assistant app<ai-app-assistant>`.

The *context_chat* and *context_chat_backend* apps run only open source models and do so entirely on-premises. Nextcloud customers receive customer support upon request.

As the models are entirely open source, the quality of translations may not be comparable to commercially available machine translation services.

Requirements
------------

* The *context_chat_backend* app is built as an External App and thus depends on AppAPI v2.3.0
* Nextcloud AIO is supported
* Using GPU processing is supported, but not required; be prepared for slow performance unless you are using GPU
* GPU Sizing

   * You will need a GPU with at least 6GB VRAM

* CPU Sizing

   * If you don't have a GPU, this app will utilize your CPU cores
   * The more cores you have and the more powerful the CPU the better, we recommend 10-20 cores
   * The app will hog all cores by default, so it is usually better to run it on a separate machine

Space usage
~~~~~~~~~~~

This app employs a bundled Vector DB called `Chroma<https://github.com/chroma-core/chroma>`. All the users' textual data is duplicated, chunked and stored on disk in this vector DB along with semantic embedding vectors for the content.

Assuming no shared files between users you can calculate with ``O(bytes of textual data in user files)``.
Any shared files will be duplicated per user, however, so, assuming all files are shared with all users you need to calculate with ``O(bytes of textual data in user files * number of users)``. The reality will lie between the two, of course.

Installation
------------

You can install the *context_chat* app via the "Apps" page in Nextcloud, or by executing

``
occ app:enable context_chat
``

You can install the *context_chat_backend* app via the "External Apps" admin page in Nextcloud.

Both apps need to be installed and both major version and minor version of the two apps must match for the functionality to work (ie. "v1.3.4" and "v1.3.1"; but not "v1.3.4" and "v2.1.6"; and not "v1.3.4" and "v1.4.5").

App store
---------

You can also find the *context_chat* app in our app store, where you can write a review: `<https://apps.nextcloud.com/apps/context_chat>`_

Repository
----------

You can find the app's code repository on GitHub where you can report bugs and contribute fixes and features: `<https://github.com/nextcloud/context_chat>`_ and `<https://github.com/nextcloud/context_chat_backend>`_

Nextcloud customers should file bugs directly with our Customer Support.
