.. _ExAppDevelopment:

ExApp development
=================

The ExApp development process is similar to that of a regular Nextcloud (PHP) app,
and should follow the same guidelines in terms of security, design and coding style (see :doc:`../../getting_started/development_process` for details)
based on your programming language standards.

Despite the fact, that ExApp can be developed in any language, it's still recommended to have the understanding
of the Nextcloud :doc:`PHP request lifecycle <../../basics/request_lifecycle>` and other basic concepts,
as they are usually similar to the ExApp backend to which Nextcloud communicates.

You can think of each ExApp as a microservice (Docker container)
that runs separately from Nextcloud on the Deploy daemon, which can be remote or local.
The communication between Nextcloud and ExApp is done via network secured with :doc:`AppAPIAuth <../tech_details/Authentication>`.

Let's go through the ExApp development steps briefly.

0. Setting up the development environment
-----------------------------------------

First, you need to have a Nextcloud dev setup, refer to :doc:`../DevSetup` for more details.

1. Starting from template
-------------------------

Next is to setup the ExApp skeleton.
There are several ExApp examples available so you can have a look at them and start from.
The ExApp template and examples:

	- ``[Python]`` `App Skeleton <https://github.com/nextcloud/app-skeleton-python>`_
	- ``[Python]`` `UI Example Skeleton <https://github.com/nextcloud/ui_example>`_
	- ``[Python]`` `More complex ExApp UI example with 3rd-party service <https://github.com/cloud-py-api/visionatrix>`_
	- ``[GoLang]`` `Go Lang ExApp example <https://github.com/nextcloud/file_to_text_example>`_
	- etc.

They contain the basic structure of the ExApp, including:

- Dockerfile
- ExApp backend
- ExApp frontend
- Manual translations tools setup and example script to convert translation files to Nextcloud l10n format and for your programming language
- Some necessary GitHub workflows (e.g. `Docker image build workflows <https://github.com/cloud-py-api/visionatrix/tree/main/.github/workflows>`_)

More details are available in the :ref:`ExAppOverview` section.


3. Development
--------------

The basic development process contains from the following steps:

- Implement the ExApp <-> Nextcloud :ref:`lifecycle methods <ex_app_lifecycle_methods>`:
	#. ``/heartbeat``: ExApp heartbeat method
	#. ``/init``: ExApp initialization method
	#. ``/enabled``: ExApp enable/disable method
- Implement the ExApp backend API and logic
- Implement the ExApp frontend (Nextcloud Vue.js app) [optional]


4. Packaging
------------

The ExApp packaging can be done manually or via GitHub actions.
It is recommended to use GitHub actions for packaging,
as it will automate the process of building the Docker image and pushing it to the Docker registry.
The GitHub action workflow for building Docker images can be found in the `3rdparty service example <https://github.com/cloud-py-api/visionatrix>`_.

4.1 Hardware acceleration
*************************

If your ExApp work with GPUs, you should consider building different Docker images for each compute device.
Currently, there are 3 main compute devices to target with custom Docker images:

- CPU (default, no specific tag)
- GPU: CUDA (NVIDIA) (``<image_name>:<version>-cuda``)
- GPU: ROCm (AMD) (``<image_name>:<version>-rocm``)

.. note::

	If the Deploy daemon configured with the GPU compute device,
	AppAPI will try to pull the Docker image with the GPU support first (``<image_name>:<version>-<cuda|rocm>``, `ref PR <https://github.com/nextcloud/app_api/pull/340>`_).
	If the image is not found, AppAPI will try to pull the base (CPU) image (``<image_name>:<version>``).


Dockerfile
**********

The Dockerfile is required to build the Docker image for the ExApp.
The guidelines for writing the Dockerfile can be found in the `Dockerfile best practices <https://docs.docker.com/develop/develop-images/dockerfile_best-practices/>`_.

Short recommendations:

1. Keep the Dockerfile as small as possible.
2. Use minimal base images to keep the image size small.
3. Place rarely changing instructions at the top of the Dockerfile to take advantage of Docker's caching mechanism.


Logging
*******

The Docker container logs are shown in the standard output and error streams.
For the admin to be able to see the important logs from the ExApp container,
you should consider redirecting the logs to the standard output and standard error streams.
For more info, see `the official docs for logging <https://docs.docker.com/config/containers/logging/>`_.


5. AppStore publishing
----------------------

Once the ExApp is ready, and the Docker image is available in the Docker registry,
you can follow `the AppStore publishing process <https://nextcloudappstore.readthedocs.io/en/latest/developer.html>`_.
It's the same as for the regular Nextcloud app, but with the requirement of :ref:`the ExApp specific fields <ex_app_info_xml_metadata>` in the ``appinfo/info.xml`` file.


6. Testing
----------

It is important to ensure that your ExApp works as expected.
We recommend having different types of dev setup configurations to test all of them.
While the main development is done locally via ``manual_install``, you must also ensure that
the ExApp works correctly in a Docker container with Docker Socket Proxy (HTTP and HTTPS).
