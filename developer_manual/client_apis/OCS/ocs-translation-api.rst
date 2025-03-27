.. _ocs-translation-api:

===================
OCS Translation API
===================

.. versionadded:: 26

The OCS Translation API allows you to translate strings from a language to another.

The base URL for all calls to the share API is: ``<nextcloud_base_url>/ocs/v2.php/translation/``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.


Get available translation options
---------------------------------

.. versionadded:: 26

* Method: ``GET``
* Endpoint: ``/languages``
* Response:
    - Status code:
        + ``200 OK``
    - Data:

+----------------------+--------+---------------------------------------------------------------------------------------------------+
| field                | type   | Description                                                                                       |
+----------------------+--------+---------------------------------------------------------------------------------------------------+
|``languageDetection`` | bool   | Whether "from" language can be skipped as a translation provider supports detecting it from input |
+----------------------+--------+---------------------------------------------------------------------------------------------------+
|``languages``         | array  | A list of language tuples, see definition below                                                   |
+----------------------+--------+---------------------------------------------------------------------------------------------------+

Language tuple structure
^^^^^^^^^^^^^^^^^^^^^^^^

+--------------+--------+--------------------------------------------------------------+
| field        | type   | Description                                                  |
+--------------+--------+--------------------------------------------------------------+
|``from``      | string | ISO code of the "from" language                              |
+--------------+--------+--------------------------------------------------------------+
|``fromLabel`` | string | Name of the "from" language that should be shown to the user |
+--------------+--------+--------------------------------------------------------------+
|``to``        | string | ISO code of the "to" language                                |
+--------------+--------+--------------------------------------------------------------+
|``toLabel``   | string | Name of the "to" language that should be shown to the user   |
+--------------+--------+--------------------------------------------------------------+

Translate a string
------------------

.. versionadded:: 26

.. note:: The endpoint is rate limited as it can be quite resource intensive. Users can make 25 requests in 2 minutes, guests only 10

* Method: ``POST``
* Endpoint: ``/translate``
* Data:

+-----------------+-------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| field           | type        | Description                                                                                                                                                                  |
+-----------------+-------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|``text``         | string      | The text to be translated                                                                                                                                                    |
+-----------------+-------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|``fromLanguage`` | string/null | The ISO code of the "from" language, when null is given and a translation provider allows detecting the source language it will be tried to guess it from the ``text`` input |
+-----------------+-------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|``toLanguage``   | string      | The ISO code of the "to" language                                                                                                                                            |
+-----------------+-------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

* Response:
    - Status code:
        + ``200 OK``
        + ``400 Bad Request`` - When the to language is not supported by any provider
        + ``400 Bad Request`` - When the from language is not supported by any provider
        + ``400 Bad Request`` - When the from language is not given, but no provider supports detecting the language
        + ``412 Precondition Failed`` - When no translation provider is installed
        + ``429 Too Many Requests`` - When the rate limiting was exceeded

    - Data:
        + ``text`` - Only provided in case of ``200 OK``, the translated string
        + ``message`` - Only provided when not ``200 OK``, an error message in the user's language, ready to be displayed
        + ``from`` - The from language that was provided or detected from the input (can also be null or missing, when an error happens while detecting the language)
