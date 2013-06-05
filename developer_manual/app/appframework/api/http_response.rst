Response
========


Baseclass for responses.
Also used to just send headers

.. php:namespace:: OCA\AppFramework\Http
.. php:class:: Response




  .. php:method:: cacheFor($cacheSeconds)

    :param int $cacheSeconds: the amount of seconds that should be cachedif 0 then caching will be disabled


    Caches the response


  .. php:method:: addHeader($name, $value)

    :param string $name: The name of the HTTP header
    :param string $value: The value, null will delete it


    Adds a new header to the response that will be called before the renderfunction


  .. php:method:: getHeaders()

    :returns array: the headers


    Returns the set headers


  .. php:method:: render()

    :returns null: 


    By default renders no output


  .. php:method:: setStatus($status)

    :param int $status: a HTTP status code, see also the STATUS constants


    Set response status


  .. php:method:: getStatus()



    Get response status


  .. php:method:: getETag()

    :returns string: the etag



  .. php:method:: getLastModified()

    :returns string: RFC2822 formatted last modified date



  .. php:method:: setETag($ETag)

    :param string $ETag: 



  .. php:method:: setLastModified($lastModified)

    :param \\DateTime $lastModified: 



