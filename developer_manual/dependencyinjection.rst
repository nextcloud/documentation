Dependency Injection
====================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

`Dependency Injection <http://en.wikipedia.org/wiki/Dependency_injection>`_ is a programming pattern that helps you decouple dependencies between classes. The result is cleaner and more testable code. A good overview over how it works and what the benefits are can be read on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

Basic Problem
-------------

Consider the following class:

.. code-block:: php

  <?php

  class PersonController {

      public function listNames(){
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


This looks like clean code until the first tests are written. **Tests are absolutely necessary in every application! Do not think that your app is too small to require them.** The code will eventuell grow bigger and will have to be refactored. 

If code is refactored code will be written. If code is being written there will be bugs. If there will be bugs then every possible failure must be tested. This is tiresome and must be automated.

If the code already comes with tests, this is not a problem. The unittests ensure that the changes did not introduce regressions.

**Back to the above example**: How would a test for the SQL query look like? 

* ``\OCP\DB`` needs to be `Monkey Patched <http://en.wikipedia.org/wiki/Monkey_patch>`_ to make the query accessible
* The monkey patching must not conflict with other tests which use the same class
* There must be a database connection or the test will fail
* If data is inserted into the database, it needs to be deleted afterwards

This is a significant amount of work that needs to be done for every test. If something is hard to do, people tend to not do it that often or even won't do it at all. Because tests are necessary they need to be written and therefore they must be as easy as possible.

Furthermore Monkey Patching is not a good solution, so most static classes need to be built with testing methods built in. These methods are only for debugging purposes and do not add any value to the running product.

Inject Dependencies
-------------------
The reason why the example class is hard to test is because it depends on ``\OCP\DB``. To be able to test it, the class needs to be replaced with a `mock object <http://en.wikipedia.org/wiki/Mock_object>`_.

This mock object is passed to the class either using a `Setter <http://stackoverflow.com/questions/4478661/getter-and-setter>`_ or using an additional parameter in the constructor. The most common one is constructor injection.

Using constructor injection, the example can be refactored by simply passing the object which executes the database request. At this point the first problem arises: ``\OCP\DB`` uses static methods and can not be instatiated as an object. This is because ownCloud uses static incorrectly.

.. note:: Static methods and attributes should only be used for sharing information that needs to be available in all classes of this instance. **Do not use static methods for utility functions!** Instantiating an object is only one line in your code and can limitted to one place by putting it into a container.

.. note:: Because of constructor injection, the constructor should not contain anything else than initializing attributes. **Never open a connection in a constructor**. Provide a seperate method that handles resourceintensive initialization.

To get around the the static method call, which is actually more like a function call, the method needs to be wrapped in an object. This object can  be passed into the class. The refactored class would look like this:

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


Now a first, simple test can be written:

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
The code also depends on another function: **echo**. Because this is usually hard to test, it is better to limit the use of input and output functions to one place. Remember that ownCloud uses PHP which likes to do output in functions like ``header`` or ``session_start``. The refactored code would look like this:

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

The output test can now be implemented as a simple string comparison.


Use a container
---------------
The above example works fine in small cases, but if the class depends on four other classes that each depend on two other classes there will be **eight** instantiations. Also if one constructor parameter changes, every line that instantiates the class will have to change too. 

The solution is to define the injected classes as dependencies and let the system handle the rest.

Pimple is a simple container implementation. The documentation on how to use it can be read on the `Pimple Homepage <http://pimple.sensiolabs.org/>`_

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


The container figures out all dependencies and instantiates the objects accordingly. Also by using the **share** method, the `anti-pattern Singleton <http://en.wikipedia.org/wiki/Singleton_pattern>`_ can be avoided. From the Pimple Tutorial::

  By default, each time you get an object, Pimple returns a new instance of it. If you want the same instance to be returned for all calls, wrap your anonymous function with the share() method

Do not inject the container
---------------------------
Injecting the container as a dependency is known as the `Service Locator Pattern <http://en.wikipedia.org/wiki/Service_locator_pattern>`_ which is widely regarded as an anti-pattern.

It makes your code dependant on the container and hides the class' real dependencies. This makes testing and maintaining harder.
