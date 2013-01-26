TextResponse
============


Prompts the user to download the a textfile


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: TextResponse




  .. php:method:: __construct($content)

    :param string $content: the content that should be written into the file


    Creates a response that just outputs text


  .. php:method:: render()

    :returns string: the file contents


    Simply sets the headers and returns the file contents
