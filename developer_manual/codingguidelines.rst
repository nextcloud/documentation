Coding Style Guidelines
=======================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

General
-------

* Maximum line-length of 80 characters
* Use tabs to indent
* A tab is 4 spaces wide
* Opening braces of blocks are on the same line as the definition
* Quotes: ' for everything, " for HTML attributes (<p class="my_class">)
* End of Lines : Unix style (LF / '\n') only

PHP
---
The ownCloud coding style guide is based on `PEAR Coding Standards <http://pear.php.net/manual/en/standards.php>`_.

Always use::

  <?php

at the start of your php code. The final closing::

  ?> 

should not be used at the end of the file due to the `possible issue of sending white spaces <http://stackoverflow.com/questions/4410704/php-closing-tag>`_.

Objects, Functions, Arrays & Variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Use Camelcase for Objects, Pascal case for functions and variables. If you set a default function/method parameter, dont use spaces

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
* Do not put spaces between variable and assignments in for loops

.. code-block:: php

  <?php

  // single line if
  if($myVar === 'hi') {
      $myVar = 'ho';
  }

  // long ifs
  if(    $something === 'something'
      || $condition2
      && $condition3
  ) {
    // your code
  }

  // for loop
  for($i=0; $i<4; $i++) {
      // your code
  }

  switch($condition) {
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

  (function(window, $, exports){
      'use strict';

      // if this function or object should be global, attach it to the namespace
      exports.myGlobalFunction = function(params){
          return params;
      };

  })(window, jQuery, MyApp);


**DONT** (Seriously):

.. code-block:: javascript

  // This does not only make everything global but you're programming 
  // JavaScript like C functions with namespaces
  MyApp = {
      myFunction:function(params){
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
  var ParentObject = function(name){
      this.name = name;
  };

  ParentObject.prototype.sayHello = function(){
      console.log(this.name);
  }


  // create childobject, call parents constructor and inherit methods
  var ChildObject = function(name, age){
      ParentObject.call(this, name);
      this.age = age;
  };

  ChildObject.prototype = Object.create(ParentObject.prototype);

  // overwrite parent method
  ChildObject.prototype.sayHello = function(){
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
Use Camelcase for Objects, Pascal case for functions and variables.

.. code-block:: javascript

  var MyObject = function(){
      this.attr = "hi";
  };

  var myFunction = function(){
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
* Do not put spaces between variable and assignments in for loops

**DO**:

.. code-block:: javascript

  // single line if
  if(myVar === 'hi'){
      myVar = 'ho';
  }

  // long ifs
  if(    something === 'something'
      || condition2
      && condition3
  ){
    // your code
  }

  // for loop
  for(var i=0; i<4; i++){
      // your code
  }

  // switch
  switch(value){

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
