Unittests
=========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

.. note:: App Unittests should **not depend on a running ownCloud instance**! They should be able to run in isolation. To achieve that, abstract the ownCloud core functions and static methods in the appframework :file:`core/api.php` and use a mock for testing. If a class is not static, you can simply add it in the :file:`dependencyinjection/dicontainer.php`

.. note:: Also use your app's namespace in your test classes to avoid possible conflicts when the test is run on the buildserver

Unittests go into your **tests/** directory. Create the same folder structure in the tests directory like on your app to make it easier to find tests for certain classes.

Owncloud uses `PHPUnit <http://www.phpunit.de/manual/current/en/>`_

Because of Dependency Injection, unittesting has become very easy: you can easily substitute complex classes with `mocks <http://www.phpunit.de/manual/3.0/en/mock-objects.html>`_ by simply passing a different object to the constructor.

Also using a container like Pimple frees us from doing complex instantiation and object passing in our application by hand.


A simple test for a controller would look like this:


:file:`tests/controllers/ItemControllerTest.php`

.. code-block:: php

  <?php
  namespace OCA\AppTemplateAdvanced;

  use OCA\AppFramework\Http\Request as Request;
  use OCA\AppFramework\Db\DoesNotExistException as DoesNotExistException;
  use OCA\AppFramework\Utility\ControllerTestUtility as ControllerTestUtility;


  require_once(__DIR__ . "/../classloader.php");


  class ItemControllerTest extends ControllerTestUtility {


    public function testSetSystemValue(){
      $post = array('somesetting' => 'this is a test');
      $request = new Request(array(), $post);

      // create an api mock object
      $api = $this->getAPIMock();

      // expects to be called once with the method
      // setSystemValue('somesetting', 'this is a test')
      $api->expects($this->once())
            ->method('setSystemValue')
            ->with( $this->equalTo('somesetting'),
                $this->equalTo('this is a test'));

      // we want to return the appname apptemplateadvanced when this method
      // is being called
      $api->expects($this->any())
            ->method('getAppName')
            ->will($this->returnValue('apptemplateadvanced'));

      $controller = new ItemController($api, $request, null);
      $response = $controller->setSystemValue(null);

      // check if the correct parameters of the json response are set
      $this->assertEquals($post, $response->getParams());
    }


  }

You can now execute the test by running this in your app directory::

  phpunit tests/

.. note:: PHPUnit executes all PHP Files that end with **Test.php**. Be sure to consider that in your file naming.

The apptemplateadvanced provides an own classloader :file:`tests/classloader.php` that loads the the classes.

.. note:: The classloader in the **tests/** directory assumes that the appframework folder is in the same directory as the yourapp. If you run your app in a different apps folder, you will need to link the appframework into the same folder where your app folder resides.


More examples for testing controllers are in the :file:`tests/controller/ItemControllerTest.php`
