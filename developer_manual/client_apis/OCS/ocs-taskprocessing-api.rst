.. _ocs-taskprocessing-api:

======================
OCS TaskProcessing API
======================

.. versionadded:: 30.0.0

The OCS Task processing API allows you to run task processing tasks, like prompting large language models implemented by apps using  :ref:`the backend Task Processing API<task_processing>`.

The base URL for all calls to this API is: ``<nextcloud_base_url>/ocs/v2.php/taskprocessing/``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.


Get available task types
------------------------

.. versionadded:: 30.0.0

* Method: ``GET``
* Endpoint: ``/tasktypes``
* Response:
    - Status code:
        + ``200 OK``
    - Data:

+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
| field                | type   | Description                                                                                                   |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``types``             | array  | A map of supported task types. The keys are the task type IDs See below for the values.                       |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+

Task type fields:

+-----------------------+--------+---------------------------------------------------------------------------------------------------------------+
| field                 | type   | Description                                                                                                   |
+-----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``name``               | string | The name of the task type in the user's language                                                              |
+-----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``description``        | string | A description of the task type in the user's language                                                         |
+-----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``inputShape``         | array  | The input shape of this task type                                                                             |
+-----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``outputShape``        | array  | The output shape of this task type                                                                            |
+-----------------------+--------+---------------------------------------------------------------------------------------------------------------+

Input and output shape fields are maps from slot key to slot metadata:

+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
| field                | type   | Description                                                                                                   |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``name``              | string | The name of the I/O slot                                                                                      |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``description``       | string | A description of the I/O slot                                                                                 |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``type``              | int    | The I/O slot type (See backend API for the available types)                                                   |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+
|``mandatory``         | bool   | Whether this slot is mandatory or not                                                                         |
+----------------------+--------+---------------------------------------------------------------------------------------------------------------+

Schedule a task
---------------

.. versionadded:: 30.0.0

.. note:: The endpoint is rate limited as it can be quite resource intensive. Users can make 20 requests in 2 minutes, guests only 5

* Method: ``POST``
* Endpoint: ``/schedule``
* Data:

+-----------------+-------------+--------------------------------------------------------------------------------+
| field           | type        | Description                                                                    |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``input``        | array      | The input text for the task                                                     |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``type``         | string      | Id of this task's type.                                                        |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``appId``        | string      | The id of the requesting app                                                   |
+-----------------+-------------+--------------------------------------------------------------------------------+
|``customId``   | string      | An custom app-defined identifier for the task (optional)                         |
+-----------------+-------------+--------------------------------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` - When the task type is invalid
        + ``412 Precondition Failed`` - When the task type is not available currently
        + ``401 Unauthenticated`` - When the input references a file that the user doesn't have access to
        + ``429 Too Many Requests`` - When the rate limiting was exceeded

    - Data:
        + ``input`` - Only provided in case of ``200 OK``, the task input, array
        + ``type`` - Only provided in case of ``200 OK``, the task type, string
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see backend API
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``customId`` - Only provided in case of ``200 OK``, the custom id of the task, string
        + ``output`` - Only provided in case of ``200 OK``, null
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed

Fetch a task by ID
------------------

.. versionadded:: 30.0.0

.. note:: The endpoint is rate limited as it can be quite resource intensive. Users can make 20 requests in 2 minutes, guests only 5

* Method: ``POST``
* Endpoint: ``/task/{id}``

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found

    - Data:
        + ``input`` - Only provided in case of ``200 OK``, the task input, array
        + ``type`` - Only provided in case of ``200 OK``, the task type, string
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see backend API
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``customId`` - Only provided in case of ``200 OK``, the custom id of the task, string
        + ``output`` - Only provided in case of ``200 OK``, the output from the model, array or null
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed


Cancel a task
-------------

.. versionadded:: 30.0.0

* Method: ``POST``
* Endpoint: ``/task/{id}/cancel``

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found

    - Data:
    - Data:
        + ``input`` - Only provided in case of ``200 OK``, the task input, array
        + ``type`` - Only provided in case of ``200 OK``, the task type, string
        + ``id`` - Only provided in case of ``200 OK``, the assigned task id, int
        + ``status`` - Only provided in case of ``200 OK``, the current task status, int, see backend API
        + ``userId`` - Only provided in case of ``200 OK``, the originating userId of the task, string
        + ``appId`` - Only provided in case of ``200 OK``, the originating appId of the task, string
        + ``customId`` - Only provided in case of ``200 OK``, the custom id of the task, string
        + ``output`` - Only provided in case of ``200 OK``, the output from the model, array or null
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed


Delete a task
-------------

.. versionadded:: 30.0.0

* Method: ``DELETE``
* Endpoint: ``/task/{id}``

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found

    - Data:
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed


Get task file contents
----------------------

.. versionadded:: 30.0.0

* Method: ``GET``
* Endpoint: ``/tasks/{id}/file/{fileId}``

* Response:
    - Status code:
        + ``200 OK``
        + ``404 Not Found`` - When the task could not be found

    - Data:
        + If ``200 OK`` this endpoint returns the raw data of the file
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed
