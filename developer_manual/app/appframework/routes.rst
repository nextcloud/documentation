.. include:: ../app/routes.rst

Using Controllers
-----------------

To call your controllers the App Framework provides a main method: :php:class:`OCA\\AppFramework\\App`.

.. note:: If you call a controller directly no security checks will be performed! Security checks are handled by the :php:class:`OCA\\AppFramework\\Middleware\\Security\\SecurityMiddleware` and called inside the :php:meth:`OCA\\AppFramework\\App::main` method! Always use the :php:meth:`OCA\\AppFramework\\App::main` method!

.. code-block:: php

  <?php
  use \OCA\AppFramework\App;
  use \OCA\YourApp\DependencyInjection\DIContainer;

  $this->create('yourappname_routename', '/myurl/{key}')->action(
      function($params){
          App::main('MyController', 'methodName', $params, new DIContainer());
      }
  )->defaults('key' => 'john');

The first parameter is the name under which the controller was defined in the :file:`dependencyinjection/dicontainer.php`.

The second parameter is the name of the method that should be called on the controller.

The third parameter is the $params array which is passed to the controller and available by using **$this->params($key)** in the controller method. In the following example, the parameter in the URL would be accessible by using: **$this->params('key')**

You can also limit the route to GET or POST requests by simply adding **->post()** or **->get()** before the action method like:

.. code-block:: php

  <?php
  use \OCA\AppFramework\App;
  use \OCA\YourApp\DependencyInjection\DIContainer;

  $this->create('yourappname_routename', '/myurl/{key}')->post()->action(
      function($params){
          App::main('MyController', 'methodName', $params, new DIContainer());
      }
  );
  ?>

The fourth parameter is an instance of the **DIContainer** (see :doc:`../general/dependencyinjection`). If you want to replace objects in the container only for a certain request, you can do it like this:

.. code-block:: php

  <?php
  use \OCA\AppFramework\App;
  use \OCA\YourApp\DependencyInjection\DIContainer;

  $this->create('yourappname_routename', '/myurl/{key}')->post()->action(
      function($params){
          $container = new DIContainer();
          $container['SomeClass'] = function($c){
             return new SomeClass('different');
          }
          App::main('MyController', 'methodName', $params, $container);
      }
  );
  ?>

Twig
~~~~

The Twig templates also provide a function to create a link from a route :js:func:`url` function:

.. code-block:: js
  
  {{ url('yourappname_routename', {key: '1'}) }}
