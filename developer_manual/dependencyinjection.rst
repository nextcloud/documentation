Dependency Injection
====================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Dependency Injection is a pattern that helps you to decouple dependencies between classes. The result is cleaner and more testable code. A good overview over how it works and what the benefits are can be seen on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

Basic Problem
-------------

Consider the following class:

.. code-block:: php

  <?php

  class PersonController {

      public static function listNames(){
          $sql = "SELECT `prename` FROM `persons`";
          $query = \OCP\DB::prepare($sql);
          $result = $query->execute();

          while($row = $result->fetchRow()){
              echo '<p>' . htmlentities($row['prename']) . '</p>';
          }
      }

  }

This class prints out all prenames of a person and is called by using:

.. code-block:: php

  <?php
  PersonController::listNames();


This looks like clean code until the first tests are written. **Tests are absolutely necessary in every application!. Do not think that your app is too small to require them.** The code will eventuell grow bigger and will have to be refactored. 

If code is refactored code will be written. If code is being written there will be bugs. If there will be bugs then every possible failure must be tested. This is tiresome and must be automated.

If the code already comes with tests, this is not a problem: If the code is being changed, just run the tests afterwards to see if nothing broke.

**Back to the above example**: How would a test for the SQL query look like? 

* ``\OCP\DB`` needs to be `monkey patched <http://en.wikipedia.org/wiki/Monkey_patch>`_ to make the query accessible
* There must be a database connection or the test will fail
* If data is inserted into the database, it needs to be deleted afterwards

This is a significant amount of work that needs to be done for every test. If something is hard to do, people tend to not do it at all. Because tests are necessary they need to be written and therefore they must be as easy as possible.

Inject Dependencies
-------------------
The reason why the class is hard to test is because it depends on ``\OCP\DB``. To be able to test it, the class needs to be replaced with a `mock object <http://en.wikipedia.org/wiki/Mock_object>`_.

To do that, the class needs to be passed in. This can be done using a `Setter <http://stackoverflow.com/questions/4478661/getter-and-setter>`_, the constructor or as an additional method parameter. The most common method is constructor injection.

With this knowledge, the example can be refactored by simply passing in the the object, that does the database request. Now the first problem arises: ``\OCP\DB`` uses static methods so you cant use objects. This is because ownCloud does not use static correctly.

To get around this problem, you need to wrap the static method call, which is more like a function call, in an object and pass that in. Also by using constructor injection, the method must not be static. The refacored class would look like this:

.. code-block:: php

  <?php

  class API {
    public function prepareQuery($sql){
      return \OCP\DB::prepare($sql);
    }
  }

  class PersonController {

    private $api;

    public function __construct($api){
      $this->api = $api;
    }

    public function listNames(){
      $sql = "SELECT `prename` FROM `persons`";
      $query = $this->api->prepareQuery($sql);
      $result = $query->execute();

      while($row = $result->fetchRow()){
        echo '<p>' . htmlentities($row['prename']) . '</p>';
      }
    }

  }

  // run controller
  $api = new API();
  $controller = new PersonController($api);
  $controller->listNames();


Now we can write a simple test for it:

.. note:: The other methods that are called on the mock object need to be implemented too, but for the sake of simplicity this is not done in this example

.. code-block:: php

  <?php
  class PersonControllerTest extends \PHPUnit_Framework_TestCase {

    private $api;

    public function setUp(){
      $this->api = $this->getMock('API', array('prepareQuery'));
      $this->controller = new PersonController($this->api);
    }


    public function testListNamesQuery(){
      $sql = "SELECT `prename` FROM `persons`";

      $this->api->expects($this->once())
          ->method('prepareQuery')
          ->with($this->equalTo($sql));

      $this->controller->listNames();

    }

  }

Limit input and output to one place
-----------------------------------
The code also depends on another function: **echo**. Because this is usually hard to test, it is better to limit the use of input and output functions to one place. The refactored code would look like this:

.. code-block:: php

  <?php

  class API {
    public function prepareQuery($sql){
      return \OCP\DB::prepare($sql);
    }
  }

  class PersonController {

    private $api;

    public function __construct($api){
      $this->api = $api;
    }

    public function listNames(){
      $sql = "SELECT `prename` FROM `persons`";
      $query = $this->api->prepareQuery($sql);
      $result = $query->execute();

      $output = '';
      while($row = $result->fetchRow()){
        $output .= '<p>' . htmlentities($row['prename']) . '</p>';
      }

      return $output;
    }

  }

  // run controller
  $api = new API();
  $controller = new PersonController($api);
  echo $controller->listNames();

The output test can now be done as a simple string comparison


Use a container
---------------
The above example works fine in small cases, but if the class depends on four other classes, that each depend on two other classes there need to be **eight** instantiations. If one parameter of a class changes, every line that instantiates the class will have to change too. 

The solution is to define the injected classes as dependencies and let the system handle the rest.

Pimple is a simple implementation of such a container. The documentation on how to use it can be seen on the `Pimple Homepage <http://pimple.sensiolabs.org/>`_

The dependencies can now be defined like this:

.. code-block:: php

  <?php

  class DIContainer extends \Pimple {

    public function __construct(){
      
      $this['API'] = $this->share(function($c){
        return new API();
      });


      $this['PersonController'] = function($c){
        return new PersonController($c['API']);
      };
  }

The output could look like this:

.. code-block:: php

  <?php

  $container = new DIContainer();
  echo $container['PersonController']->listNames();


Every needed dependency of a class is now automatically handled by the container. Also by using the **share** method, we can get rid of of the often used `anti-pattern Singleton <http://en.wikipedia.org/wiki/Singleton_pattern>`_ because every call to the container will only produce the object once.