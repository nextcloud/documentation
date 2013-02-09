Filesystem
==========





.. php:namespace:: OC\Files
.. php:class:: Filesystem


  .. php:attr:: $loaded
    
    



  .. php:staticmethod:: Filesystem::getMountPoint($path)

    :param string $path: 
    :returns string: 


    get the mountpoint of the storage object for a path( note: because a storage is not always mounted inside the fakeroot, the returned mountpoint is relative to the absolute root of the filesystem and doesn't take the chroot into account


  .. php:staticmethod:: Filesystem::getMountPoints($path)

    :param string $path: 
    :returns string[]: 


    get a list of all mount points in a directory


  .. php:staticmethod:: Filesystem::getStorage($mountPoint)

    :param string $mountPoint: 
    :returns \\OC\\Files\\Storage\\Storage: 


    get the storage mounted at $mountPoint


  .. php:staticmethod:: Filesystem::resolvePath($path)

    :param string $path: 
    :returns array: consisting of the storage and the internal path


    resolve a path to a storage and internal path


  .. php:staticmethod:: Filesystem::init($root)

    :param mixed $root: 



  .. php:staticmethod:: Filesystem::initMountPoints($user='')

    :param string $user: 


    Initialize system and personal mount points for a user


  .. php:staticmethod:: Filesystem::getView()

    :returns \\OC\\Files\\View: 


    get the default filesystem view


  .. php:staticmethod:: Filesystem::tearDown()



    tear down the filesystem, removing all storage providers


  .. php:staticmethod:: Filesystem::getRoot()

    :returns string: Returns path like /admin/files


    get the relative path of the root data directory for the current user


  .. php:staticmethod:: Filesystem::clearMounts()



    clear all mounts and storage backends


  .. php:staticmethod:: Filesystem::mount($class, $arguments, $mountpoint)

    :param \\OC\\Files\\Storage\\Storage|string $class: 
    :param array $arguments: 
    :param string $mountpoint: 


    mount an \OC\Files\Storage\Storage in our virtual filesystem


  .. php:staticmethod:: Filesystem::getLocalFile($path)

    :param string $path: 
    :returns string: 


    return the path to a local version of the filewe need this because we can't know if a file is stored local or not from outside the filestorage and for some purposes a local file is needed


  .. php:staticmethod:: Filesystem::getLocalFolder($path)

    :param string $path: 
    :returns string: 



  .. php:staticmethod:: Filesystem::getLocalPath($path)

    :param string $path: 
    :returns string: 


    return path to file which reflects one visible in browser


  .. php:staticmethod:: Filesystem::isValidPath($path)

    :param string $path: 
    :returns bool: 


    check if the requested path is valid


  .. php:staticmethod:: Filesystem::isBlacklisted($data)

    :param array $data: from hook


    checks if a file is blacklisted for storage in the filesystemListens to write and rename hooks


  .. php:staticmethod:: Filesystem::mkdir($path)

    :param mixed $path: 


    following functions are equivalent to their php builtin equivalents for arguments/return values.


  .. php:staticmethod:: Filesystem::rmdir($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::opendir($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::readdir($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::is_dir($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::is_file($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::stat($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::filetype($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::filesize($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::readfile($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::isCreatable($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::isReadable($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::isUpdatable($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::isDeletable($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::isSharable($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::file_exists($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::filemtime($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::touch($path, $mtime=null)

    :param mixed $path: 
    :param mixed $mtime: 



  .. php:staticmethod:: Filesystem::file_get_contents($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::file_put_contents($path, $data)

    :param mixed $path: 
    :param mixed $data: 



  .. php:staticmethod:: Filesystem::unlink($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::rename($path1, $path2)

    :param mixed $path1: 
    :param mixed $path2: 



  .. php:staticmethod:: Filesystem::copy($path1, $path2)

    :param mixed $path1: 
    :param mixed $path2: 



  .. php:staticmethod:: Filesystem::fopen($path, $mode)

    :param mixed $path: 
    :param mixed $mode: 



  .. php:staticmethod:: Filesystem::toTmpFile($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::fromTmpFile($tmpFile, $path)

    :param mixed $tmpFile: 
    :param mixed $path: 



  .. php:staticmethod:: Filesystem::getMimeType($path)

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::hash($type, $path, $raw=false)

    :param mixed $type: 
    :param mixed $path: 
    :param mixed $raw: 



  .. php:staticmethod:: Filesystem::free_space($path='/')

    :param mixed $path: 



  .. php:staticmethod:: Filesystem::search($query)

    :param mixed $query: 



  .. php:staticmethod:: Filesystem::searchByMime($query)

    :param mixed $query: 



  .. php:staticmethod:: Filesystem::hasUpdated($path, $time)

    :param string $path: 
    :param int $time: 
    :returns bool: 


    check if a file or folder has been updated since $time


  .. php:staticmethod:: Filesystem::normalizePath($path, $stripTrailingSlash=true)

    :param string $path: 
    :param bool $stripTrailingSlash: 
    :returns string: 


    Fix common problems with a file path


  .. php:staticmethod:: Filesystem::getFileInfo($path)

    :param string $path: 
    :returns array: returns an associative array with the following keys:- size- mtime- mimetype- encrypted- versioned


    get the filesystem info


  .. php:staticmethod:: Filesystem::putFileInfo($path, $data)

    :param string $path: 
    :param array $data: 
    :returns int: returns the fileid of the updated file


    change file metadata


  .. php:staticmethod:: Filesystem::getDirectoryContent($directory)

    :param string $directory: path under datadirectory
    :returns array: 


    get the content of a directory


  .. php:staticmethod:: Filesystem::getPath($id)

    :param int $id: 
    :returns string: 


    Get the path of a file by id
    Note that the resulting path is not guarantied to be unique for the id, multiple paths can point to the same file


  .. php:staticmethod:: Filesystem::getOwner($path)

    :param string $path: 
    :returns string: 


    Get the owner for a file or folder


  .. php:staticmethod:: Filesystem::getETag($path)

    :param string $path: 
    :returns string: 


    get the ETag for a file or folder
