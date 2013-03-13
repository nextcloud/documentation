TextDownloadResponse
====================


Prompts the user to download the a textfile


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: TextDownloadResponse




  .. php:method:: __construct($content, $filename, $contentType)

    :param string $content: the content that should be written into the file
    :param string $filename: the name that the downloaded file should have
    :param string $contentType: the mimetype that the downloaded file should have


    Creates a response that prompts the user to download a file whichcontains the passed string


  .. php:method:: render()

    :returns string: the file contents


    Simply sets the headers and returns the file contents
