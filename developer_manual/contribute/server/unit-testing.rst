============
Unit-Testing
============

PHP unit testing
----------------

Getting PHPUnit
^^^^^^^^^^^^^^^

Nextcloud uses PHPUnit >= 8.5 for unit testing.

PHPUnit documentation: https://phpunit.de/documentation.html

Writing PHP unit tests
^^^^^^^^^^^^^^^^^^^^^^

To get started, do the following:
 - Create a directory called ``tests`` in the top level of your application
 - Create a PHP file in the directory and ``require_once`` your class which you want to test

Then you can simply run the created test with **phpunit**.

.. note:: If you use Nextcloud functions in your class under test (i.e., OC::getUser()) you'll need to bootstrap Nextcloud or use dependency injection.

.. note:: You'll most likely run your tests under a different user than the Web server. This might cause problems with your PHP settings (i.e., open_basedir) and requires you to adjust your configuration.

An example for a simple test would be:

:file:`/srv/http/nextcloud/apps/myapp/tests/testaddtwo.php`

.. code-block:: php

    <?php
    namespace OCA\Myapp\Tests;

    class TestAddTwo extends \Test\TestCase {
        protected $testMe;

        protected function setUp() {
            parent::setUp();
            $this->testMe = new \OCA\Myapp\TestMe();
        }

        public function testAddTwo(){
              $this->assertEquals(5, $this->testMe->addTwo(3));
        }

    }


:file:`/srv/http/nextcloud/apps/myapp/lib/testme.php`

.. code-block:: php

    <?php
    namespace OCA\Myapp;

    class TestMe {
        public function addTwo($number){
            return $number + 2;
        }
    }

In :file:`/srv/http/nextcloud/apps/myapp/` you run the test with::

  phpunit tests/testaddtwo.php


Make sure to extend the ``\Test\TestCase`` class with your test and always call the parent methods
when overwriting ``setUp()``, ``setUpBeforeClass()``, ``tearDown()`` or ``tearDownAfterClass()`` method
from the TestCase. These methods set up important stuff and clean up the system after the test,
so the next test can run without side effects, like remaining files and entries in the file cache, etc.

For more resources on PHPUnit visit: https://www.phpunit.de/manual/current/en/writing-tests-for-phpunit.html

Bootstrapping Nextcloud
^^^^^^^^^^^^^^^^^^^^^^^
If you use Nextcloud functions or classes in your code, you'll need to make them available to your test by bootstrapping Nextcloud.

To do this, you'll need to provide the ``--bootstrap`` argument when running PHPUnit:

:file:`/srv/http/nextcloud`::

  phpunit --bootstrap tests/bootstrap.php apps/myapp/tests/testsuite.php

If you run the test under a different user than your Web server, you'll have to
adjust your php.ini and file rights.

:file:`/etc/php/php.ini`::

  open_basedir = none

:file:`/srv/http/nextcloud`::

  su -c "chmod a+r config/config.php"
  su -c "chmod a+rx data/"
  su -c "chmod a+w data/nextcloud.log"

Running unit tests for the Nextcloud server project
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The server project provides server unit tests using different database backends like sqlite, mysql, pgsql, oci (for Oracle).
Every database to test needs to accessible either

- natively, setup with

  - Host: localhost
  - Database: oc_autotest
  - User: oc_autotest
  - Password: owncloud
  
- or via docker by setting the USEDOCKER environment variable. 

Notes on how to setup databases for this test can be found in https://github.com/nextcloud/server/blob/master/autotest.sh.


To run tests for all database engines::

  ./autotest.sh

To run tests only for sqlite::

  ./autotest.sh sqlite

To run a specific test suite (note that the test file path is relative to the "tests" directory)::

  ./autotest.sh sqlite lib/share/share.php

Further reading
^^^^^^^^^^^^^^^
- https://googletesting.blogspot.de/2008/08/by-miko-hevery-so-you-decided-to.html
- https://www.phpunit.de/manual/current/en/writing-tests-for-phpunit.html
- https://www.youtube.com/watch?v=4E4672CS58Q&feature=bf_prev&list=PLBDAB2BA83BB6588E
- Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin)

JavaScript unit testing for server
----------------------------------

JavaScript Unit testing for **server** and **server apps** is done using the `Karma <http://karma-runner.github.io>`_ test runner with `Jasmine <https://jasmine.github.io/>`_.

Installing Node JS
^^^^^^^^^^^^^^^^^^

To run the JavaScript unit tests you will need to install **Node JS**.

You can get it here: https://nodejs.org/

After that you will need to setup the **Karma** test environment.
The easiest way to do this is to run the automatic test script first, see next section.

Running all tests
^^^^^^^^^^^^^^^^^

To run all tests, just run::

  ./autotest-js.sh

This will also automatically set up your test environment.

Debugging tests in the browser
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To debug tests in the browser, you need to run **Karma** in browser mode::

  karma start tests/karma.config.js

From there, open the URL http://localhost:9876 in a web browser.

On that page, click on the "Debug" button.

An empty page will appear, from which you must open the browser console (F12 in Firefox/Chrome).

Every time you reload the page, the unit tests will be relaunched and will output the results in the browser console.

Unit test paths
^^^^^^^^^^^^^^^

JavaScript unit test examples can be found in :file:`apps/files/tests/js/`.

Unit tests for the core app JavaScript code can be found in :file:`core/js/tests/specs`.

Documentation
^^^^^^^^^^^^^

Here are some useful links about how to write unit tests with Jasmine and Sinon:

- Karma test runner: https://karma-runner.github.io/
- Jasmine: https://pivotal.github.io/jasmine
- Sinon (for mocking and stubbing): http://sinonjs.org/
