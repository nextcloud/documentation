==========
Filesystem
==========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Because users can choose their storage backend, the filesystem should be accessed by using the appropriate filesystem classes.

Filesystem classes can be injected from the ServerContainer by calling the method **getRootFolder()**, **getUserFolder()** or **getAppFolder()**:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use \OCP\AppFramework\App;

    use \OCA\MyApp\Storage\AuthorStorage;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Storage Layer
             */
            $container->registerService('AuthorStorage', function($c) {
                return new AuthorStorage($c->query('RootStorage'));
            });

            $container->registerService('RootStorage', function($c) {
                return $c->query('ServerContainer')->getRootFolder();
            });

        }
    }

Writing to a file
=================

All methods return a Folder object on which files and folders can be accessed, or filesystem operations can be performed relatively to their root. For instance for writing to file:`nextcloud/data/myfile.txt` you should get the root folder and use:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Storage;

    class AuthorStorage {

        private $storage;

        public function __construct($storage){
            $this->storage = $storage;
        }

        public function writeTxt($content) {
            // check if file exists and write to it if possible
            try {
                try {
                    $file = $this->storage->get('/myfile.txt');
                } catch(\OCP\Files\NotFoundException $e) {
                    $this->storage->touch('/myfile.txt');
                    $file = $this->storage->get('/myfile.txt');
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
===================

Files and folders can also be accessed by id, by calling the **getById** method on the folder.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Storage;

    class AuthorStorage {

        private $storage;

        public function __construct($storage){
            $this->storage = $storage;
        }

        public function getContent($id) {
            // check if file exists and read from it if possible
            try {
                $file = $this->storage->getById($id);
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
