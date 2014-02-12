Coding Style & General Guidelines
=================================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

General
-------

* Maximum line-length of 80 characters
* Use tabs to indent
* A tab is 4 spaces wide
* Opening braces of blocks are on the same line as the definition
* Quotes: ' for everything, " for HTML attributes (<p class="my_class">)
* End of Lines : Unix style (LF / '\n') only
* No global variables or functions
* Unittests
* Software should work. Only put features into master when they are complete. It's better to not have a feature instead of having one that works poorly.
* Regularly reset your installation to see how the first-run experience is like. And improve it.
* When you ``git pull``, always ``git pull --rebase`` to avoid generating extra commits like: *merged master into master*
* We need a signed contributor agreement from you to commit into the core repository. But no worries; it's a nice one. All the information is in our `Contributor agreement FAQ <http://owncloud.org/about/contributor-agreement>`_.

Userinterface
-------------
* Software should get out of the way. Do things automatically instead of offering configuration options.
* Software should be easy to use. Show only the most important elements. Secondary elements only on hover or via Advanced function.
* User data is sacred. Provide undo instead of asking for confirmation
* The state of the application should be clear. If something loads, provide feedback.
* Do not adapt broken concepts (for example design of desktop apps) just for the sake of consistency. We provide a better interface.
* Ideally do `usability testing <http://jancborchardt.net/usability-in-free-software>`_ to know how people use the software.
* For further UX principles, read `Alex Faaborg from Mozilla <http://uxmag.com/articles/quantifying-usability>`_.

PHP
---
The ownCloud coding style guide is based on `PEAR Coding Standards <http://pear.php.net/manual/en/standards.php>`_.

Always use::

  <?php

at the start of your php code. The final closing::

  ?>

should not be used at the end of the file due to the `possible issue of sending white spaces <http://stackoverflow.com/questions/4410704/php-closing-tag>`_.

Comments
^^^^^^^^
All API methods need to be marked with `PHPDoc <http://en.wikipedia.org/wiki/PHPDoc>`_ markup. An example would be:

.. code-block:: php

  <?php

  /**
   * Description what method does
   * @param Controller $controller the controller that will be transformed
   * @param API $api an instance of the API class
   * @throws APIException if the api is broken
   * @since 4.5
   * @return string a name of a user
   */
  public function myMethod(Controller $controller, API $api) {
    // ...
  }

Objects, Functions, Arrays & Variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Use Pascal case for Objects, Camel case for functions and variables. If you set
a default function/method parameter, do not use spaces. Do not prepend private
class members with underscores.

.. code-block:: javascript

  class MyClass {

  }

  function myFunction($default=null) {

  }

  $myVariable = 'blue';

  $someArray = array(
      'foo'  => 'bar',
      'spam' => 'ham',
  );

  ?>


Operators
^^^^^^^^^
Use **===** and **!==** instead of **==** and **!=**.

Here's why:

.. code-block:: php

  <?php

  var_dump(0 == "a"); // 0 == 0 -> true
  var_dump("1" == "01"); // 1 == 1 -> true
  var_dump("10" == "1e1"); // 10 == 10 -> true
  var_dump(100 == "1e2"); // 100 == 100 -> true

  ?>

Control Structures
^^^^^^^^^^^^^^^^^^
* Always use { } for one line ifs
* Split long ifs into multiple lines
* Always use break in switch statements and prevent a default block with warnings if it shouldn't be accessed

.. code-block:: php

  <?php

  // single line if
  if ($myVar === 'hi') {
      $myVar = 'ho';
  } else {
      $myVar = 'bye';
  }

  // long ifs
  if (   $something === 'something'
      || $condition2
      && $condition3
  ) {
    // your code
  }

  // for loop
  for ($i = 0; $i < 4; $i++) {
      // your code
  }

  switch ($condition) {
      case 1:
          // action1
          break;

      case 2:
          // action2;
          break;

      default:
          // defaultaction;
          break;
  }

  ?>



JavaScript
----------
In general take a look at `JSLint <http://www.jslint.com/lint.html>`_ without the whitespace rules.

* Use a :file:`js/main.js` or :file:`js/app.js` where your program is started
* Complete every statement with a **;**
* Use **var** to limit variable to local scope
* To keep your code local, wrap everything in a self executing function. To access global objects or export things to the global namespace, pass all global objects to the self executing function.
* Use JavaScript strict mode
* Use a global namespace object where you bind publicly used functions and objects to

**DO**:

.. code-block:: javascript

  // set up namespace for sharing across multiple files
  var MyApp = MyApp || {};

  (function(window, $, exports, undefined) {
      'use strict';

      // if this function or object should be global, attach it to the namespace
      exports.myGlobalFunction = function(params) {
          return params;
      };

  })(window, jQuery, MyApp);


**DONT** (Seriously):

.. code-block:: javascript

  // This does not only make everything global but you're programming
  // JavaScript like C functions with namespaces
  MyApp = {
      myFunction:function(params) {
          return params;
      },
      ...
  };

Objects & Inheritance
^^^^^^^^^^^^^^^^^^^^^
Try to use OOP in your JavaScript to make your code reusable and flexible.

This is how you'd do inheritance in JavaScript:

.. code-block:: javascript

  // create parent object and bind methods to it
  var ParentObject = function(name) {
      this.name = name;
  };

  ParentObject.prototype.sayHello = function() {
      console.log(this.name);
  }


  // create childobject, call parents constructor and inherit methods
  var ChildObject = function(name, age) {
      ParentObject.call(this, name);
      this.age = age;
  };

  ChildObject.prototype = Object.create(ParentObject.prototype);

  // overwrite parent method
  ChildObject.prototype.sayHello = function() {
      // call parent method if you want to
      ParentObject.prototype.sayHello.call(this);
      console.log('childobject');
  };

  var child = new ChildObject('toni', 23);

  // prints:
  // toni
  // childobject
  child.sayHello();

Objects, Functions & Variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Use Pascal case for Objects, Camel case for functions and variables.

.. code-block:: javascript

  var MyObject = function() {
      this.attr = "hi";
  };

  var myFunction = function() {
      return true;
  };

  var myVariable = 'blue';

  var objectLiteral = {
      value1: 'somevalue'
  };


Operators
^^^^^^^^^
Use **===** and **!==** instead of **==** and **!=**.

Here's why:

.. code-block:: javascript

  '' == '0'           // false
  0 == ''             // true
  0 == '0'            // true

  false == 'false'    // false
  false == '0'        // true

  false == undefined  // false
  false == null       // false
  null == undefined   // true

  ' \t\r\n ' == 0     // true

Control Structures
^^^^^^^^^^^^^^^^^^
* Always use { } for one line ifs
* Split long ifs into multiple lines
* Always use break in switch statements and prevent a default block with warnings if it shouldn't be accessed

**DO**:

.. code-block:: javascript

  // single line if
  if (myVar === 'hi') {
      myVar = 'ho';
  } else {
      myVar = 'bye';
  }

  // long ifs
  if (   something === 'something'
      || condition2
      && condition3
  ) {
    // your code
  }

  // for loop
  for (var i = 0; i < 4; i++) {
      // your code
  }

  // switch
  switch (value) {

      case 'hi':
          // yourcode
          break;

      default:
          console.warn('Entered undefined default block in switch');
          break;
  }


CSS
---
Take a look at the `Writing Tactical CSS & HTML <http://www.youtube.com/watch?v=hou2wJCh3XE&feature=plcp>`_ video on YouTube.

Don't bind your CSS too much to your HTML structure and try to avoid IDs. Also try to make your CSS reusable by grouping common attributes into classes.

**DO**:

.. code-block:: css

  .list {
      list-style-type: none;
  }

  .list > .list_item {
      display: inline-block;
  }

  .important_list_item {
      color: red;
  }

**DON'T**:

.. code-block:: css

  #content .myHeader ul {
      list-style-type: none;
  }

  #content .myHeader ul li.list_item {
      color: red;
      display: inline-block;
  }

**TBD**
