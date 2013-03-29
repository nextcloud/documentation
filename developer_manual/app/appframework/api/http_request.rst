Request
=======


Encapsulates $_GET, $_FILES and $_POST arrays for better testability


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: Request




  .. php:method:: __construct($params=array(), $files=array(), $server=array(), $env=array(), $session=array(), $cookie=array(), $urlParams=array())

    :param array $params: the parsed json array
    :param array $files: the $_FILES array
    :param array $server: the $_SERVER array
    :param array $env: the $_ENV array
    :param array $session: the $_SESSION array
    :param array $cookie: the $_COOKIE array
    :param array $urlParams: the parameters which were matched from the URL



  .. php:method:: getRequestParams()

    :returns array: the merged array


    Returns the merged urlParams, GET and POST array


  .. php:method:: getParams($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the request params value or the default if not found


  .. php:method:: getFILES($key)

    :param string $key: the array key that should be looked up
    :returns mixed: the value of the stored array or the default


    Returns the get value of the files array


  .. php:method:: getSERVER($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the get value of the server array


  .. php:method:: getENV($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the get value of the env array


  .. php:method:: getSESSION($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the get value of the session array


  .. php:method:: getCOOKIE($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the get value of the cookie array


  .. php:method:: getURLParams($key, $default=null)

    :param string $key: the array key that should be looked up
    :param string $default: if the key is not found, return this value
    :returns mixed: the value of the stored array or the default


    Returns the get value of the urlParams array


  .. php:method:: getMethod()

    :returns string: request method of the server array


    Returns the request method


  .. php:method:: setSESSION($key, $value)

    :param string $key: the key of the session variable
    :param string $value: the value of the session variable


    Sets a session variable


