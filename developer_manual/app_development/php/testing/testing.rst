=======
Testing
=======

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

All PHP classes can be tested with `PHPUnit <https://phpunit.de/>`_, JavaScript can be tested by using `Karma <http://karma-runner.github.io>`_.

.. _testing-php:

PHP
---

The PHP tests go into the **tests/** directory and PHPUnit can be run with::

    phpunit tests/

When writing your own tests, please ensure that PHPUnit bootstraps from :file:`tests/bootstrap.php`, to set up various environment variables and autoloader registration correctly. Without this, you will see errors as the Nextcloud autoloader security policy prevents access to the tests/ subdirectory. This can be configured in your :file:`phpunit.xml` file as follows:

.. code-block:: xml

    <phpunit bootstrap="../../tests/bootstrap.php">

PHP classes should be tested by accessing them from the container to ensure that the container is wired up properly. Services that should be mocked can be replaced directly in the container.

A test for the **AuthorStorage** class in :doc:`storage/filesystem`:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Storage;

    class AuthorStorage {

        private $storage;

        public function __construct($storage){
            $this->storage = $storage;
        }

        public function getContent($id) {
            // check if file exists and write to it if possible
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

would look like this:

.. code-block:: php

    <?php
    // tests/Storage/AuthorStorageTest.php
    namespace OCA\MyApp\Tests\Storage;

    class AuthorStorageTest extends \Test\TestCase {

        private $container;
        private $storage;

        protected function setUp() {
            parent::setUp();

            $app = new \OCA\MyApp\AppInfo\Application();
            $this->container = $app->getContainer();
            $this->storage = $storage = $this->getMockBuilder('\OCP\Files\Folder')
                ->disableOriginalConstructor()
                ->getMock();

            $this->container->registerService('RootStorage', function($c) use ($storage) {
                return $storage;
            });
        }

        /**
         * @expectedException \OCA\MyApp\Storage\StorageException
         */
        public function testFileNotFound() {
            $this->storage->expects($this->once())
                ->method('get')
                ->with($this->equalTo(3))
                ->will($this->throwException(new \OCP\Files\NotFoundException()));

            $this->container['AuthorStorage']->getContent(3);
        }

    }

Make sure to extend the ``\Test\TestCase`` class with your test and always call the parent methods,
when overwriting ``setUp()``, ``setUpBeforeClass()``, ``tearDown()`` or ``tearDownAfterClass()`` method
from the TestCase. These methods set up important stuff and clean up the system after the test,
so the next test can run without side effects, like remaining files and entries in the file cache, etc.
