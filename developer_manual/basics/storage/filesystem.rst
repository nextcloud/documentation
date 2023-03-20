========================
Nextcloud filesystem API
========================


.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

High level guide to using the Nextcloud filesystem API.

Because users can choose their storage backend, the filesystem should be accessed by using the appropriate filesystem classes. For a simplified filesystem for app specific data see `IAppData <appdata.html>`_

Node API
^^^^^^^^

The "Node API" is the primary api for apps to access the Nextcloud filesystem, each item in the filesystem is
represented as either a File or Folder node with each node providing access to the relevant filesystem information
and actions for the node.


Getting access
--------------

Access to the filesystem is provided by the ``IRootFolder`` which can be injected into your class.
From the root folder you can either access a user's home folder or access a file or folder by its absolute path.

.. code-block:: php

    use OCP\Files\IRootFolder;
    use OCP\IUserSession;

    class FileSystemAccessExample {
        private IUserSession $userSession;
        private IRootFolder $rootFolder;

        public function __constructor(IUserSession $userSession, IRootFolder $rootFolder) {
            $this->userSession = $userSession;
            $this->rootFolder = $rootFolder;
        }

        /**
        * Create a new file with specified content in the home folder of the current user
        * returning the size of the resulting file.
        */
        public function getCurrentUserFolder(string $path, string $content): int {
            $user = $this->userSession->getUser();

            if ($user === null) {
                return null;
            }

            // the "user folder" corresponds to the root of the user visible files
            return $this->rootFolder->getUserFolder($user->getUID());
        }
    }

For more details on the specific methods provided by file and folder nodes see the method documentation from the ``OCP\Files\File`` and ``OCP\Files\Folder`` interfaces.


Writing to a file
-----------------

All methods return a Folder object on which files and folders can be accessed, or filesystem operations can be performed relatively to their root. For instance for writing to file:`nextcloud/data/myfile.txt` you should get the root folder and use:

.. code-block:: php

    use OCP\Files\IRootFolder;

    class FileWritingExample {

        private IRootStorage $storage;

        public function __construct(IRootFolder $storage){
            $this->storage = $storage;
        }

        public function writeContentToFile($content) {

            $userFolder = $this->storage->getUserFolder('myUser');

            // check if file exists and write to it if possible
            try {
                try {
                    $file = $userFolder->get('myfile.txt');
                } catch(\OCP\Files\NotFoundException $e) {
                    $userFolder->touch('myfile.txt');
                    $file = $userFolder->get('myfile.txt');
                }

                // the id can be accessed by $file->getId();
                $file->putContent($content);

            } catch(\OCP\Files\NotPermittedException $e) {
                // you have to create this exception by yourself ;)
                throw new StorageException('Cant write to file');
            }
        }
    }


Reading from a file
-------------------

Files and folders can also be accessed by id, by calling the **getById** method on the folder.

.. code-block:: php

    use OCP\Files\IRootFolder;

    class FileReadingExample {

        private IRootFolder $storage;

        public function __construct(IRootFolder $storage){
            $this->storage = $storage;
        }

        public function getFileContent($id) {

            $userFolder = $this->storage->getUserFolder('myUser');

            // check if file exists and read from it if possible
            try {
                $file = $userFolder->getById($id);
                if ($file instanceof \OCP\Files\File) {
                    return $file->getContent();
                } else {
                    throw new StorageException('Can not read from folder');
                }
            } catch(\OCP\Files\NotFoundException $e) {
                throw new StorageException('File does not exist');
            }
        }
    }


Direct storage access
---------------------

While it should be generally avoided in favor of the higher level apis,
sometimes an app needs to talk directly to the storage implementation of it's metadata cache.

You can get access to the underlying storage of a file or folder by calling ``getStorage`` on the node or first getting
the mountpoint by calling ``getMountPoint`` and getting the storage from there.

Once you have the storage instance you can use the storage api from ``OCP\Files\Storage\IStorage``, note however that
all paths used in the storage api are internal to the storage, the ``IMountPoint`` returned from ``getMountPoint`` provides
methods for translating between absolute filesystem paths and internal storage paths.

If you need to query the cached metadata directory you can get the ``OCP\Files\Cache\ICache`` from the storage by calling ``getCache``.

Implementing a storage
----------------------

The recommended way for implementing a storage backend is by sub-classing ``OC\Files\Storage\Common`` which provides
fallback implementations for various methods, reducing the amount of work required to implement the full storage api.
Note however that various of these fallback implementations are likely to be significantly less efficient than an
implementation of the method optimized for the abilities of the storage backend.

Adding mounts to the filesystem
-------------------------------

The recommended way of adding your own mounts to the filesystem from an app is implementing ``OCP\Files\Config\IMountProvider``
and registering the provider using ``OCP\Files\Config\IMountProviderCollection::registerProvider``.

Once registered, your provider will be called every time the filesystem is being setup for a user and your mount provider
can return a list of mounts to add for that user.