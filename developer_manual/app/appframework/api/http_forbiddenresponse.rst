ForbiddenResponse
=================


Returns 403 Forbidden status to user.

This Class renders response with HTTP/1.1 403 Forbidden header and empty
content. If you want to return specified content, please extend it with your
own class.


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: ForbiddenResponse



  .. php:method:: __construct()

    Creates a response that returns HTTP 403 Forbidden status.
