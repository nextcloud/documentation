==========
Filesystem
==========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Because users can choose their storage backend, the filesystem should be accessed by using the appropriate filesystem classes.

Filesystem classes can be injected automatically with dependency injection. This is the user filesystem.
For a simplified filestystem for app specific data see `IAppData <../appdata.html>`_

Writing to a file
-----------------


All methods return a Folder object on which files and folders can be accessed, or filesystem operations can be performed relatively to their root. For instance for writing to file:`nextcloud/data/myfile.txt` you should get the root folder and use:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Storage;

    use OCP\Files\IRootFolder;

    class AuthorStorage {

        /** @var IRootStorage */
        private $storage;

        public function __construct(IRootFolder $storage){
            $this->storage = $storage;
        }

        public function writeTxt($content) {

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

    <?php
    namespace OCA\MyApp\Storage;

    use OCP\Files\IRootFolder;

    class AuthorStorage {

        /** @var IRootFolder */
        private $storage;

        public function __construct(IRootFolder $storage){
            $this->storage = $storage;
        }

        public function getContent($id) {

            $userFolder = $this->storage->getUserFolder('myUser');

            // check if file exists and read from it if possible
            try {
                $file = $userFolder->getById($id);
                if($file instanceof \OCP\Files\File) {
                    return $file->getContent();
                } else {
                    throw new StorageException('Can not read from folder');
                }
            } catch(\OCP\Files\NotFoundException $e) {
                throw new StorageException('File does not exist');
            }
        }
    }
