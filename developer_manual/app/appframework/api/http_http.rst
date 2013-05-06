Http
====





.. php:namespace:: OCA\AppFramework\Http
.. php:class:: Http


  .. php:attr:: $headers
    
    * **Protected**
    
    



  .. php:method:: __construct($server, $protocolVersion='HTTP/1.1')

    :param mixed $server: 
    :param string $protocolVersion: the http version to use defaults to HTTP/1.1



  .. php:method:: getStatusHeader($status, $lastModified=null, $ETag=null)

    :param \\OCA\\AppFramework\\Http\\Http::CONSTANT $status: the constant from the Http class
    :param \\DateTime $lastModified: formatted last modified date
    :param mixed $ETag: 


    Gets the correct header


