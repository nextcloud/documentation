Unittests
=========

Getting PHPUnit
---------------

Owncloud uses PHPUnit for tests. To install it, either get it via your packagemanager::

  sudo apt-get install phpunit

or install it via PEAR::

  pear config-set auto_discover 1
  pear install pear.phpunit.de/PHPUnit

After the installation the ''phpunit'' command is available.

Writing unittests
-----------------

To get started, do the following:
 - Create a directory called ``tests`` in the top level of your application
 - Create a php file in the directory and ``require_once`` your class which you want to test.

Then you can simply run the created test with phpunit.

.. note:: If you use owncloud functions in your class under test (i.e: OC::getUser()) you'll need to bootstrap owncloud or use dependency injection.

.. note:: You'll most likely run your tests under a different user than the webserver. This might cause problems with your PHP settings (i.e: open_basedir) and requires you to adjust your configuration.

An example for a simple test would be:

:file:`/srv/http/owncloud/apps/myapp/tests/testsuite.php`

.. code-block:: php

  <?php
  require_once("../myfolder/myfunction.php");
  
  class TestAddTwo extends PHPUnit_Framework_TestCase {
  
      public function testAddTwo(){
          $this->assertEquals(5, addTwo(3));
      }
  
  }
  ?>

:file:`/srv/http/owncloud/apps/myapp/tests/testsuite.php`

.. code-block:: php

  <?php
  function addTwo($number){
      return $number + 2;
  }
  ?>

In :file:`/srv/http/owncloud/apps/myapp/` you run the test with::

  phpunit tests/testsuite.php


For more resources on PHPUnit visit: http://www.phpunit.de/manual/current/en/writing-tests-for-phpunit.html

Bootstrapping Owncloud
----------------------
If you use Owncloud functions or classes in your code, you'll need to make them available to your test by bootstrapping Owncloud. 

To do this, you'll need to provide the ``--bootstrap`` argument when running PHPUnit

:file:`/srv/http/owncloud`::

  phpunit --bootstrap tests/bootstrap.php apps/myapp/tests/testsuite.php

If you run the test under a different user than your webserver, you'll have to
adjust your php.ini and file rights.

:file:`/etc/php/php.ini`::

  open_basedir = none

:file:`/srv/http/owncloud`::

  su -c "chmod a+r config/config.php"
  su -c "chmod a+rx data/"
  su -c "chmod a+w data/owncloud.log"

Dependency Injection
--------------------
Yet to be decided

Further Reading
---------------
- http://googletesting.blogspot.de/2008/08/by-miko-hevery-so-you-decided-to.html
- http://www.phpunit.de/manual/current/en/writing-tests-for-phpunit.html
- http://www.youtube.com/watch?v=4E4672CS58Q&feature=bf_prev&list=PLBDAB2BA83BB6588E
- Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin)
