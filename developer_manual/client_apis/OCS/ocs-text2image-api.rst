.. _ocs-text2image-api:

======================
OCS Text-To-Image API
======================

.. versionadded:: 28

The OCS Text-To-Image API allows you to run image generation tasks implemented by apps using  :ref:`the backend Text-To-Image API<text2image>`.

The base URL for all calls to this API is: ``<nextcloud_base_url>/ocs/v2.php/text2image/``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.


Check availability
------------------

.. versionadded:: 28

* Method: ``GET``
* Endpoint: ``/is_available``
* Response:
    - Status code:
        + ``200 OK``
    - Data:

+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
| field                | type   | Description                                                                                                   |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``isAvailable``       | bool   | Boolean indicating whether any Text-To-Image providers are installed                                          |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+

Schedule a task
---------------

.. versionadded:: 28

.. note:: The endpoint is rate limited as it can be quite resource intensive. Users can make 20 requests in 2 minutes, guests only 5

* Method: ``POST``
* Endpoint: ``/schedule``
* Data:

+-------------------+-------------+--------------------------------------------------------------------------------+
| field             | type        | Description                                                                    |
+-------------------+-------------+--------------------------------------------------------------------------------+
|``input``          | string      | The input text for the task                                                    |
+-------------------+-------------+--------------------------------------------------------------------------------+
|``numberOfImages`` | int         | The number of images to generate (optional; default: 8)                        |
+-------------------+-------------+--------------------------------------------------------------------------------+
|``appId``          | string      | The id of the requesting app                                                   |
+-------------------+-------------+--------------------------------------------------------------------------------+
|``identifier``     | string      | An app-defined identifier for the task (optional)                              |
+-------------------+-------------+--------------------------------------------------------------------------------+

If possible the task will be executed while the request is processed on the server, otherwise it is scheduled as a background job.

* Response:
    - Status code:
        + ``200 OK``
        + ``412 Precondition Failed`` - When the task type is not available currently
        + ``429 Too Many Requests`` - When the rate limiting was exceeded

    - Data:
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``input`` - Only provided in case of ``200 OK``, the task input, string
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see :ref:`the backend Text-To-Image API<text2image_statuses>`
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``identifier`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``numberOfImages`` - Only provided in case of ``200 OK``, the number of generated images, int
        + ``completionExpectedAt`` - Only provided in case of ``200 OK``, the date and time when the result is expected to be completed as a UNIX timestamp, int
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed

Fetch a task by ID
------------------

.. versionadded:: 28

.. note:: The endpoint is rate limited as it can be quite resource intensive. Users can make 20 requests in 2 minutes, guests only 5

* Method: ``POST``
* Endpoint: ``/task/{id}``

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found

    - Data:
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``input`` - Only provided in case of ``200 OK``, the task input, string
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see :ref:`the backend Text-To-Image API<text2image_statuses>`
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``identifier`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``numberOfImages`` - Only provided in case of ``200 OK``, the number of generated images, int
        + ``completionExpectedAt`` - Only provided in case of ``200 OK``, the date and time when the result is expected to be completed as a UNIX timestamp, int
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed

Fetch a result image
--------------------

.. versionadded:: 28

* Method: ``POST``
* Endpoint: ``/task/{id}/image/{index}``
  * ``index``: The index of the image, starting at 0

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found, isn't successful, isn't completed yet, or the index is out of bounds

    - Data: The raw image data

Delete a task
-------------

.. versionadded:: 28

* Method: ``DELETE``
* Endpoint: ``/task/{id}``

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found

    - Data:
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``input`` - Only provided in case of ``200 OK``, the task input, string
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see :ref:`the backend Text-To-Image API<text2image_statuses>`
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``identifier`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``numberOfImages`` - Only provided in case of ``200 OK``, the number of generated images, int
        + ``completionExpectedAt`` - Only provided in case of ``200 OK``, the date and time when the result is expected to be completed as a UNIX timestamp, int
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed

List tasks by App
------------------

.. versionadded:: 28

.. note:: The endpoint is rate limited as it can be quite resource intensive. Guests can only do 5 requests within 2 minutes

* Method: ``DELETE``
* Endpoint: ``/tasks/app/{appId}``
* Data:

+-------------------+-------------+--------------------------------------------------------------------------------+
| field             | type        | Description                                                                    |
+-------------------+-------------+--------------------------------------------------------------------------------+
|``appId``          | string      | The id of the requesting app                                                   |
+-------------------+-------------+--------------------------------------------------------------------------------+
|``identifier``     | string      | An app-defined identifier for the task (optional)                              |
+-------------------+-------------+--------------------------------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found

    - Data:
        + Only provided in case of ``200 OK``, an array of objects:
            + ``id`` - the assigned task id, int
            + ``input`` - the task input, string
            + ``status`` - the current task status, int, see :ref:`the backend Text-To-Image API<text2image_statuses>`
            + ``userId`` - the originating userId of the task, string
            + ``appId`` - the originating appId of the task, string
            + ``identifier`` - the originating appId of the task, string
            + ``numberOfImages`` - the number of generated images, int
            + ``completionExpectedAt`` - the date and time when the result is expected to be completed as a UNIX timestamp, int
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed
