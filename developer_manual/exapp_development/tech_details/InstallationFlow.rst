.. _app_installation_flow:

App Installation Flow
=====================

Image Pulling(Docker)
---------------------

AppAPI **2.5.0+** will always first try to pull a docker image with a ``suffix`` equal to value of *computeDevice*.

Let us remind you that ``computeDevice`` can take the following values: ``cpu``, ``cuda``, ``rocm``

The suffix will be added as follows:

.. code::

	return $imageParams['image_src'] . '/' .
		$imageParams['image_name'] . '-' . $daemonConfig['computeDevice']['id'] . ':' . $imageParams['image_tag'];

For ``cpu`` AppAPI will first try to get the image from ``ghcr.io/cloud-py-api/skeleton-cpu:latest``.
In case the image is not found, ``ghcr.io/cloud-py-api/skeleton:latest`` will be pulled.

If you as an application developer want to have a custom images for any of these values, you can push that extended images to registry in addition to the based one.

Heartbeat
---------

The first thing AppAPI does is deploy of the application.

In the case of ``Docker``, this is:

#. 1. performing an image pull
#. 2. creating container from the docker image
#. 3. if the container supports `healthcheck` - AppAPI waits for the `healthy` status
#. 4. waiting until the “/heartbeat” endpoint becomes available with a ``GET`` request

The application, in response to the request "/heartbeat", should return json: ``{"status": "ok"}``.

.. note:: The request to ``/heartbeat`` endpoint is made without AppAPI authentication.

Init
----

.. note:: Starting from this point, all requests made by AppAPI contains :ref:`auth-headers`.

After application is ready, which is determined by previous step,
AppAPI sends ``POST`` request to the ``/init`` application endpoint.

*If the application does not need to carry out long initialization, it has an option to not implement "/init" endpoint, so
AppAPI will get 404 or 501 error on it's request, and consider that initialization is done and this section can be skipped.*

In case you want to implement "/init" endpoint, your application should:

1. In "/init" handler: Response with empty JSON on AppAPI call.
2. In background job: Send an ``OCS request`` to ``PUT /ocs/v1.php/apps/app_api/ex-app/status`` with the progress value.

.. warning::

    ``PUT /ocs/v1.php/apps/app_api/apps/status/$APP_ID`` is deprecated and will be removed in the future.

Possible values for **progress** are integers from 1 to 100;
after receiving the value 100, the **application is considered initialized and ready to work**.

If at the initialization stage the application has a critical error due to which its further operation is impossible,

``"error": "some error"``

should be added to the ``OCS request`` for setting progress,
with a short explanation at what stage this error occurred.

Example of request payload with error will look like this::

	{"progress": 67, "error": "connection error to huggingface."}

Enabled
-------

After receiving **progress: 100** (*or when ExApp is not implementing "/init" endpoint*), AppAPI enables the application.

To enable or disable the application, a PUT request is sent to the ``/enabled`` endpoint.

.. note:: Unlike using a payload, this request utilizes a query parameter named ``enabled`` to specify the desired state.

The ``enabled`` parameter accepts an integer value:

* `1` to enable the application
* `0` to disable the application

For example, to enable the application, the request would be::

	PUT http://expapp:2432/enabled?enabled=1

Similarly, to disable the application, the request would be::

	PUT http://expapp:2432/enabled?enabled=0

This approach ensures that the application's state can be easily toggled using a simple query parameter.

.. note:: ``/enabled`` endpoint shares both **enabling** and **disabling**,
	so app should determine what is going on using the ``enabled`` input parameter of the request.

Inside ``/enabled`` handler application should register all actions related to the Nextcloud, like UI and all other stuff.

Response for this request should contain::

	{"error": ""}

for success and if some error occur during **enabling**, it should be present and not be empty::

	{"error": "i cant handle enabling"}

This is all three steps involved in the applications installation flow.
