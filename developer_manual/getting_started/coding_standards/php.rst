====================
PHP coding standards
====================

Starting with Nextcloud 19 there is a shared `PHP Coding Standards Fixer <https://github.com/FriendsOfPhp/PHP-CS-Fixer>`_ configuration you can use to automatically format your app's source code. For full details see the `repository on GitHub <https://github.com/nextcloud/coding-standard/>`_.

Setup
-----

Install the shared configuration as a development dependency:

.. code-block:: bash

  composer require --dev nextcloud/coding-standard

Create a ``.php-cs-fixer.dist.php`` in your app root:

.. code-block:: php

  <?php

  declare(strict_types=1);

  require_once './vendor/autoload.php';

  use Nextcloud\CodingStandard\Config;

  $config = new Config();
  $config
  	->getFinder()
  	->ignoreVCSIgnored(true)
  	->notPath('build')
  	->notPath('l10n')
  	->notPath('src')
  	->notPath('vendor')
  	->in(__DIR__);
  return $config;

Add convenience scripts to ``composer.json``:

.. code-block:: json

  {
      "scripts": {
          "cs:check": "php-cs-fixer fix --dry-run --diff",
          "cs:fix": "php-cs-fixer fix"
      }
  }

Then run ``composer cs:check`` to list violations, or ``composer cs:fix`` to apply fixes.
Exclude ``.php-cs-fixer.dist.php`` and ``.php-cs-fixer.cache`` from your release build.

Always use::

  <?php

at the start of your php code. The final closing::

  ?>

should not be used at the end of the file due to the `possible issue of sending white spaces <https://stackoverflow.com/questions/4410704/php-closing-tag>`_.

Comments
--------
All API methods need to be marked with `PHPDoc <https://en.wikipedia.org/wiki/PHPDoc>`_ markup. An example would be:

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

Objects, functions, arrays & variables
--------------------------------------

Use *UpperCamelCase* for Objects, *lowerCamelCase* for functions and variables. If you set
a default function/method parameter, do not use spaces. Do not prepend private
class members with underscores.

.. code-block:: php

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
---------

Use **===** and **!==** instead of **==** and **!=**.

Here's why:

.. code-block:: php

  <?php

  var_dump(0 == "a"); // 0 == 0 -> true
  var_dump("1" == "01"); // 1 == 1 -> true
  var_dump("10" == "1e1"); // 10 == 10 -> true
  var_dump(100 == "1e2"); // 100 == 100 -> true

  ?>

Control structures
------------------

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
----------

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
