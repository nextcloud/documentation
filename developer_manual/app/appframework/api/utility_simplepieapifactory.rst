SimplePieAPIFactory
===================





.. php:namespace:: OCA\AppFramework\Utility
.. php:class:: SimplePieAPIFactory




  .. php:method:: getFile($url, $timeout=10, $redirects=5, $headers=null, $useragent=null, $force_fsockopen=false)

    :param mixed $url: 
    :param mixed $timeout: 
    :param mixed $redirects: 
    :param mixed $headers: 
    :param mixed $useragent: 
    :param mixed $force_fsockopen: 
    :returns \\OCA\\AppFramework\\Utility\\SimplePie_File: a new object


    Builds a simplepie file object.
    This is needed becausethe file object contains logic in its constructor which makes itimpossible to inject and test


  .. php:method:: getCore()

    :returns \\SimplePie_Core: instance


    Returns a new instance of a SimplePie_Core() object.
    This is neededbecause the class relies on external dependencies which are not passedin via the constructor and thus making it nearly impossible to unittestcode that uses this class


