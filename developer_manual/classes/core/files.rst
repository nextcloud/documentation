Files
=====


This class provides access to the internal filesystem abstraction layer.
Use this class exlusively if you want to access files

.. php:namespace:: OCP
.. php:class:: Files




  .. php:staticmethod:: Files::rmdirr($dir)

    :param string $dir: path to the folder
    :returns bool:


    Recusive deletion of folders


  .. php:staticmethod:: Files::getMimeType($path)

    :param string $path: path
    :returns string: does NOT work for ownClouds filesystem, use OC_FileSystem::getMimeType instead


    get the mimetype form a local file


  .. php:staticmethod:: Files::streamCopy($source, $target)

    :param resource $source: source
    :param resource $target: target
    :returns int: the number of bytes copied


    copy the contents of one stream to another


  .. php:staticmethod:: Files::tmpFile($postfix='')

    :param string $postfix: postfix
    :returns string: temporary files are automatically cleaned up after the script is finished


    create a temporary file with an unique filename


  .. php:staticmethod:: Files::tmpFolder()

    :returns string: temporary files are automatically cleaned up after the script is finished


    create a temporary folder with an unique filename


  .. php:staticmethod:: Files::buildNotExistingFileName($path, $filename)

    :param \\OCP\\ $path:
    :param \\OCP\\ $filename:
    :returns string:


    Adds a suffix to the name in case the file exists


  .. php:staticmethod:: Files::getStorage($app)

    :param string $app: appid
    :returns \\OC\\Files\\View:
