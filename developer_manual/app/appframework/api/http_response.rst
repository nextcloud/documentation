Response
========


Baseclass for responses.
Also used to just send headers

.. php:namespace:: OCA\AppFramework\Http
.. php:class:: Response




  .. php:method:: __construct()




  .. php:method:: addHeader($header)

    :param string $header: header the string that will be used in the header() function


    Adds a new header to the response that will be called before the renderfunction


  .. php:method:: render()

    :returns null: 


    By default renders no output


  .. php:method:: getHeaders()

    :returns array: the headers


    Returns the set headers


