View
====





.. php:namespace:: OC\Files
.. php:class:: View




  .. php:method:: __construct($root)

    :param mixed $root:



  .. php:method:: getAbsolutePath($path='/')

    :param mixed $path:



  .. php:method:: chroot($fakeRoot)

    :param string $fakeRoot:
    :returns bool:


    change the root to a fake root


  .. php:method:: getRoot()

    :returns string:


    get the fake root


  .. php:method:: getRelativePath($path)

    :param string $path:
    :returns string:


    get path relative to the root of the view


  .. php:method:: getMountPoint($path)

    :param string $path:
    :returns string:


    get the mountpoint of the storage object for a path( note: because a storage is not always mounted inside the fakeroot, thereturned mountpoint is relative to the absolute root of the filesystemand doesn't take the chroot into account )


  .. php:method:: resolvePath($path)

    :param string $path:
    :returns array: consisting of the storage and the internal path


    resolve a path to a storage and internal path


  .. php:method:: getLocalFile($path)

    :param string $path:
    :returns string:


    return the path to a local version of the filewe need this because we can't know if a file is stored local or not fromoutside the filestorage and for some purposes a local file is needed


  .. php:method:: getLocalFolder($path)

    :param string $path:
    :returns string:



  .. php:method:: mkdir($path)

    :param mixed $path:


    the following functions operate with arguments and return values identicalto those of their PHP built-in equivalents.
    Mostly they are merely wrappersfor \OC\Files\Storage\Storage via basicOperation().


  .. php:method:: rmdir($path)

    :param mixed $path:



  .. php:method:: opendir($path)

    :param mixed $path:



  .. php:method:: readdir($handle)

    :param mixed $handle:



  .. php:method:: is_dir($path)

    :param mixed $path:



  .. php:method:: is_file($path)

    :param mixed $path:



  .. php:method:: stat($path)

    :param mixed $path:



  .. php:method:: filetype($path)

    :param mixed $path:



  .. php:method:: filesize($path)

    :param mixed $path:



  .. php:method:: readfile($path)

    :param mixed $path:



  .. php:method:: isCreatable($path)

    :param mixed $path:



  .. php:method:: isReadable($path)

    :param mixed $path:



  .. php:method:: isUpdatable($path)

    :param mixed $path:



  .. php:method:: isDeletable($path)

    :param mixed $path:



  .. php:method:: isSharable($path)

    :param mixed $path:



  .. php:method:: file_exists($path)

    :param mixed $path:



  .. php:method:: filemtime($path)

    :param mixed $path:



  .. php:method:: touch($path, $mtime=null)

    :param mixed $path:
    :param mixed $mtime:



  .. php:method:: file_get_contents($path)

    :param mixed $path:



  .. php:method:: file_put_contents($path, $data)

    :param mixed $path:
    :param mixed $data:



  .. php:method:: unlink($path)

    :param mixed $path:



  .. php:method:: deleteAll($directory, $empty=false)

    :param mixed $directory:
    :param mixed $empty:



  .. php:method:: rename($path1, $path2)

    :param mixed $path1:
    :param mixed $path2:



  .. php:method:: copy($path1, $path2)

    :param mixed $path1:
    :param mixed $path2:



  .. php:method:: fopen($path, $mode)

    :param mixed $path:
    :param mixed $mode:



  .. php:method:: toTmpFile($path)

    :param mixed $path:



  .. php:method:: fromTmpFile($tmpFile, $path)

    :param mixed $tmpFile:
    :param mixed $path:



  .. php:method:: getMimeType($path)

    :param mixed $path:



  .. php:method:: hash($type, $path, $raw=false)

    :param mixed $type:
    :param mixed $path:
    :param mixed $raw:



  .. php:method:: free_space($path='/')

    :param mixed $path:



  .. php:method:: hasUpdated($path, $time)

    :param string $path:
    :param int $time:
    :returns bool:


    check if a file or folder has been updated since $time


  .. php:method:: getFileInfo($path)

    :param string $path:
    :returns array: returns an associative array with the following keys:- size- mtime- mimetype- encrypted- versioned


    get the filesystem info


  .. php:method:: getDirectoryContent($directory, $mimetype_filter='')

    :param string $directory: path under datadirectory
    :param mixed $mimetype_filter:
    :returns array:


    get the content of a directory


  .. php:method:: putFileInfo($path, $data)

    :param string $path:
    :param array $data:
    :returns int: returns the fileid of the updated file


    change file metadata


  .. php:method:: search($query)

    :param string $query:
    :returns array:


    search for files with the name matching $query


  .. php:method:: searchByMime($mimetype)

    :param mixed $mimetype:
    :returns array:


    search for files by mimetype


  .. php:method:: getOwner($path)

    :param string $path:
    :returns string:


    Get the owner for a file or folder


  .. php:method:: getETag($path)

    :param string $path:
    :returns string:


    get the ETag for a file or folder


  .. php:method:: getPath($id)

    :param int $id:
    :returns string:


    Get the path of a file by id, relative to the view
    Note that the resulting path is not guarantied to be unique for the id, multiple paths can point to the same file
