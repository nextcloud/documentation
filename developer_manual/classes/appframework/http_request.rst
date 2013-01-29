Request
=======


Encapsulates $_GET, $_FILES and $_POST arrays for better testability


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: Request




  .. php:method:: __construct($get=array(), $post=array(), $files=array())

    :param array $get: the $_GET array
    :param array $post: the $_POST array
    :param array $files: the $_FILES array



  .. php:method:: getGETAndPOST()

    :returns array: the merged array


    Returns the merged GET and POST array


  .. php:method:: getGET($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the get value or the default if not found


  .. php:method:: getPOST($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the get value or the default if not found


  .. php:method:: getFILES($key)

    :param string $key: the array key that should be looked up
    :returns mixed: the value of the stored array or the default


    Returns the get value of the files array
