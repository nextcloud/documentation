Coding Style & General Guidelines
=================================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

General
-------

* Ideally, discuss your plans on the `mailing list <https://mailman.nextcloud.org/mailman/listinfo/devel>`_ to see if others want to work with you on it
* We use `Github <https://github.com/owncloud>`_, please get an account there and clone the repositories you want to work on
* Fixes go directly to master, nevertheless they need to be tested thoroughly.
* New features are always developed in a branch and only merged to master once they are fully done.
* Software should work. We only put features into master when they are complete. It's better to not have a feature instead of having one that works poorly.
* It is best to start working based on an issue - create one if there is none. You describe what you want to do, ask feedback on the direction you take it and take it from there.
* When you are finished, use the merge request function on Github to create a pull request. The other developers will look at it and give you feedback. You can signify that your PR is ready for review by adding the label "5 - ready for review" to it. You can also post your merge request to the mailing list to let people know. See `the code review page for more information <../bugtracker/codereviews.html>`_
* It is key to keep changes separate and small. The bigger and more hairy a PR grows, the harder it is to get it in. So split things up where you can in smaller changes - if you need a small improvement like a API addition for a big feature addition, get it in first rather than adding it to the big piece of work!
* Decisions are made by consensus. We strive for making the best technical decisions and as nobody can know everything, we collaborate. That means a first negative comment might not be the final word, neither is positive feedback an immediate GO. Nextcloud is built out of modular pieces (apps) and maintainers have a strong influence. In case of disagreement we consult other seasoned contributors.
* We need a signed contributor agreement from you to commit into the core repository (apps don't need that). All the information is in our `Contributor agreement FAQ <https://nextcloud.org/contribute/agreement/>`_.

Labels
------
We assign labels to issues and pull requests to make it easy to find them and to signal what needs to be done. Some of these are assigned by the developers, others by QA, bug triagers, project lead or maintainers and so on. It is not desired that users/reporters of bugs assign labels themselves, unless they are developers/contributors to Nextcloud.

The most important labels and their meaning:

* #bug - this issue is a bug
* #enhancement - this issue is a feature request/idea for improvement of Nextcloud
* #design - this needs help from the design team or is a design-related issue/pull request
* #sharing - this issue or PR is related to sharing
* #technical debt - this issue or PR is about `technical debt <http://en.wikipedia.org/wiki/Technical_debt>`_
* #sev1-critical #sev2-high #sev3-medium #sev4-low signify how important the bug is.
* #p1-urgent #p2-high #p3-medium #p4-low signify the priority of the bug.
* #Junior Job - these are issues which are relatively easy to solve and ideal for people who want to learn how to code in Nextcloud
* Tags showing the state of the issue or PR, numbered 1-6:
 * #1 - To develop - ready to start development on this
 * #2 - Developing - development in progress
 * #3 - To Review - ready for review
 * #4 - To Release - reviewed PR that awaits unfreeze of a branch to get merged
* App tags: #app:files #app:user_ldap #app:files_versions and so on. These tags indicate the app that is impacted by the issue or which the PR is related to
* Settings tags: #settings:personal #settings:apps #settings:admin and so on. These tags indicate the settings area that is impacted by the issue or which the PR is related to
* db tags: #db:mysql #db:sqlite #db:postgresql and so on. These tags indicate the database that is impacted by the issue or which the PR is related to
* Browser tags: #browser:ie #browser:safari and so on. These tags indicate the browser that is impacted by the issue or which the PR is related to
* Component tags: #comp:filesystem #comp:javascript and so on. These tags indicate the components of Nextcloud impacted by the issue or which the PR is related to
* Development tool tags: #dev:unit_testing #dev:public_API and so on. These tags indicate development-specific tools like those for testing and public developer-facing API's impacted by the issue or which the PR is related
* Feature tags: #feature:something. These tags indicate the features across apps and components which are impacted by the issue or which the PR is related to
* #triage - this issue *has to be* `triaged <../bugtracker/triaging.html>`_
* #needs info - this issue needs further information from the reporter, see `triaging <../bugtracker/triaging.html>`_ old tag is #clarification request, please don't use that one anymore.
* #discussion - this issue needs to be discussed
* #security - this is a security related issue
* #windows server - this is related to windows server
* #research - this item requires some research before it can continue
* #packaging - this is related to packaging
* #theming - refers to theming issues or improvements
* #l10n - refers to translation issues or improvements
* #release note - relevant for the release notes
* #privacy - refers to issues that might lead to privacy concerns
* #won't fix - This problem won't be fixed (can be for a wide variety of reasons...)

If you want a label not in the list above, please first discuss on the mailing list.

Coding
------
* Maximum line-length of 80 characters
* Use tabs to indent
* A tab is 4 spaces wide
* Opening braces of blocks are on the same line as the definition
* Quotes: ' for everything, " for HTML attributes (<p class="my_class">)
* End of Lines : Unix style (LF / '\n') only
* No global variables or functions
* Unit tests
* HTML should be HTML5 compliant
* Check these `database performance tips <https://mailman.nextcloud.org/pipermail/devel/2014-June/000262.html>`_
* When you ``git pull``, always ``git pull --rebase`` to avoid generating extra commits like: *merged master into master*


User interface
--------------
* Software should get out of the way. Do things automatically instead of offering configuration options.
* Software should be easy to use. Show only the most important elements. Secondary elements only on hover or via Advanced function.
* User data is sacred. Provide undo instead of asking for confirmation - `which might be dismissed <http://www.alistapart.com/articles/neveruseawarning/>`_
* The state of the application should be clear. If something loads, provide feedback.
* Do not adapt broken concepts (for example design of desktop apps) just for the sake of consistency. We aim to provide a better interface, so let's find out how to do that!
* Regularly reset your installation to see how the first-run experience is like. And improve it.
* Ideally do `usability testing <http://jancborchardt.net/usability-in-free-software>`_ to know how people use the software.
* For further UX principles, read `Alex Faaborg from Mozilla <http://uxmag.com/articles/quantifying-usability>`_.

PHP
---
The Nextcloud coding style guide is based on `PEAR Coding Standards <http://pear.php.net/manual/en/standards.php>`_.

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

Unit tests
^^^^^^^^^^
Unit tests must always extend the ``\Test\TestCase`` class, which takes care
of cleaning up the installation after the test.

If a test is run with multiple different values, a data provider must be used.
The name of the data provider method must not start with ``test`` and must end
with ``Data``.

.. code-block:: php

    <?php
    namespace Test;
    class Dummy extends \Test\TestCase {
        public function dummyData() {
            return array(
                array(1, true),
                array(2, false),
            );
        }

        /**
         * @dataProvider dummyData
         */
        public function testDummy($input, $expected) {
            $this->assertEquals($expected, \Dummy::method($input));
        }
    }


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
