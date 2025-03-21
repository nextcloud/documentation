.. _ocs-textprocessing-api:

======================
OCS TextProcessing API
======================

.. versionadded:: 27.1.0

.. deprecated:: 30
    Use the TaskProcessing API instead

The OCS Text processing API allows you to run text processing tasks, like prompting large language models implemented by apps using  :ref:`the backend Text Processing API<text_processing>`.

The base URL for all calls to this API is: ``<nextcloud_base_url>/ocs/v2.php/textprocessing/``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.


Get available task types
------------------------

.. versionadded:: 27.1.0

* Method: ``GET``
* Endpoint: ``/tasktypes``
* Response:
    - Status code:
        + ``200 OK``
    - Data:

+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
| field                | type   | Description                                                                                                   |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``types``             | array  | A list of supported task types. See below.                                                                    |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+

Task type fields:

+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
| field                | type   | Description                                                                                                   |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``name``              | string | The name of the task type in the user's language                                                              |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``description``       | string | A description of the task type in the user's language                                                         |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``id``                | string | The id of this task type                                                                                      |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+

Schedule a task
---------------

.. versionadded:: 28

.. note:: The endpoint is rate limited as it can be quite resource intensive. Users can make 20 requests in 2 minutes, guests only 5

* Method: ``POST``
* Endpoint: ``/schedule``
* Data:

+-----------------+-------------+--------------------------------------------------------------------------------+
| field           | type        | Description                                                                    |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``input``        | string      | The input text for the task                                                    |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``type``         | string      | Id of this task's type.                                                        |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``appId``        | string      | The id of the requesting app                                                   |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``identifier``   | string      | An app-defined identifier for the task                                         |
+-----------------+-------------+--------------------------------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` - When the task type is invalid
        + ``412 Precondition Failed`` - When the task type is not available currently
        + ``429 Too Many Requests`` - When the rate limiting was exceeded

    - Data:
        + ``input`` - Only provided in case of ``200 OK``, the task input, string
        + ``type`` - Only provided in case of ``200 OK``, the task type, string
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see backend API
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``identifier`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``output`` - Only provided in case of ``200 OK``, the output from the model, string or null
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
        + ``input`` - Only provided in case of ``200 OK``, the task input, string
        + ``type`` - Only provided in case of ``200 OK``, the task type, string
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see backend API
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``identifier`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``output`` - Only provided in case of ``200 OK``, the output from the model, string or null
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed
