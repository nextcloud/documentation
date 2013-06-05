TextResponse
============


Just outputs text to the browser


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: TextResponse




  .. php:method:: __construct($content, $contentType='plain')

    :param string $content: the content that should be written into the file
    :param string $contentType: the mimetype. text/ is added automatically soonly plain or html can be added to get text/plain or text/html


    Creates a response that just outputs text


  .. php:method:: render()

    :returns string: the file contents


    Simply sets the headers and returns the file contents


