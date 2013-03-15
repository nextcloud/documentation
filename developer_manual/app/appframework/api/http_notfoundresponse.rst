NotFoundResponse
================


Returns 404 Not Found status to user.

This Class renders response with HTTP/1.1 404 Not Found header and empty
content. If you want to return specified content, please extend it with your
own class.


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: NotFoundResponse



  .. php:method:: __construct()

    Creates a response that returns HTTP 404 Not Found status.
