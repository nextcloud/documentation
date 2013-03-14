Unittests
=========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

The App Framework ships with several useful tools to do unittesting

PHP
---

.. note:: App Unittests should **not depend on a running ownCloud instance**! They should be able to run in isolation. To achieve that, abstract the ownCloud core functions and static methods in the App Framework :file:`core/api.php` and use a mock for testing. If a class is not static, you can simply add it in the :file:`dependencyinjection/dicontainer.php`

.. note:: Also use your app's namespace in your test classes to avoid possible conflicts when the test is run on the buildserver

Unittests go into your **tests/** directory. Create the same folder structure in the tests directory like on your app to make it easier to find tests for certain classes.

ownCloud uses `PHPUnit <http://www.phpunit.de/manual/current/en/>`_

Because of Dependency Injection, unittesting has become very easy: you can easily substitute complex classes with `mocks <http://www.phpunit.de/manual/3.0/en/mock-objects.html>`_ by simply passing a different object to the constructor.

Also using a container like `Pimple <http://pimple.sensiolabs.org/>`_ frees us from doing complex instantiation and object passing in our application by hand.


A simple test for a controller would look like this:


:file:`tests/controllers/ItemControllerTest.php`

.. code-block:: php

  <?php
  namespace OCA\AppTemplateAdvanced;

  use OCA\AppFramework\Http\Request;
  use OCA\AppFramework\Db\DoesNotExistException;
  use OCA\AppFramework\Utility\ControllerTestUtility;


  require_once(__DIR__ . "/../classloader.php");


  class ItemControllerTest extends ControllerTestUtility {


    public function testSetSystemValue(){
      $post = array('somesetting' => 'this is a test');
      $request = new Request(array(), $post);

      // create an api mock object
      $api = $this->getAPIMock();

      // expects to be called once with the method
      // setAppValue('somesetting', 'this is a test')
      $api->expects($this->once())
            ->method('setAppValue')
            ->with( $this->equalTo('somesetting'),
                $this->equalTo('this is a test'));

      // we want to return the appname apptemplateadvanced when this method
      // is being called
      $api->expects($this->any())
            ->method('getAppName')
            ->will($this->returnValue('apptemplateadvanced'));

      $controller = new ItemController($api, $request, null);
      $response = $controller->setAppValue(null);

      // check if the correct parameters of the json response are set
      $this->assertEquals($post, $response->getParams());
    }


  }

You can now execute the test by running this in your app directory::

  phpunit tests/

.. note:: PHPUnit executes all PHP Files that end with **Test.php**. Be sure to consider that in your file naming.

TDD can also be used if the :doc:`angularsetup` is performed and grunt is used. To automatically run all PHP unittests on change simply use:

  cd js/
  make phpunit

Classloader
~~~~~~~~~~~
The Advanced Apptemplate provides an extra classloader :file:`tests/classloader.php` that loads the the classes. Require this file at the top of your tests.

.. note:: The classloader in the **tests/** directory assumes that the **appframework/** folder is in the same directory as the your app. If you run your app in a different apps folder, you will need to link the App Framework into the same folder where your app folder resides.


JavaScript
~~~~~~~~~~
If the :doc:`angularsetup` was performed `Testacular <http://testacular.github.com/0.6.0/index.html>`_ was already successfully set up and can be started with:

  cd js/
  make testacular

Testacular now watches for changes and executes all tests if a JavaScript file is changed.

To run the tests once use:

  cd js/
  make test

A JUnit compatible result file will be generated for the continous integration server.

Like stated in :doc:`angularsetup` tests go into the folder **js/tests/**. The default setup uses `Jasmine <http://pivotal.github.com/jasmine/>`_ but also other test frameworks like `Mocha <http://visionmedia.github.com/mocha/>`_ or `QUnit <http://qunitjs.com/>`_ can be used but `have to be configured first <http://testacular.github.com/0.6.0/config/files.html>`_. 

AngularJS
~~~~~~~~~
