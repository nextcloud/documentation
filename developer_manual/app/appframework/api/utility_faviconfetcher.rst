FaviconFetcher
==============





.. php:namespace:: OCA\AppFramework\Utility
.. php:class:: FaviconFetcher




  .. php:method:: __construct($apiFactory)

    :param \\OCA\\AppFramework\\Utility\\SimplePieAPIFactory $apiFactory: 


    Inject a factory to build a simplepie file object.
    This is needed becausethe file object contains logic in its constructor which makes itimpossible to inject and test


  .. php:method:: fetch($url)

    :param string|null $url: the url where to fetch it from


    Fetches a favicon from a given URL


  .. php:method:: extractFromPage($url)

    :param string $url: the url to the page
    :returns string: the full url to the page

    * **Protected**


    Tries to get a favicon from a page


  .. php:method:: isImage($url)

    :param string $url: the url to the file
    :returns bool: true if image

    * **Protected**


    Test if the file is an image


  .. php:method:: buildURL($url)

    :param string $url: the url that should be built
    :returns array: an array containing the http and https address

    * **Protected**


    Get HTTP and HTTPS adresses from an incomplete URL


