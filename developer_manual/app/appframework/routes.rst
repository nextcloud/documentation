.. include:: ../app/routes.rst

A simple route would look like this:

.. code-block:: php

  <?php
  use \OCA\AppFramework\App;
  use \OCA\YourApp\DependencyInjection\DIContainer;

  // this route matches /index.php/yourapp/myurl/SOMEVALUE
  $this->create('yourappname_routename', '/myurl/{key}')->action(
      function($params){
          App::main('MyController', 'methodName', $params, new DIContainer());
      }
  );



The first argument is the name of your route. This is used as an identifier to get the URL of the route and is a nice way to generate the URL in your templates or JavaScript for certain links since it does not force you to hardcode your URLs. 

.. note:: The identifier should always start with the appid since they are global and you could overwrite a route of a different app

To use it in OC templates, use:

.. code-block:: php

  <?
  print_unescaped(\OC_Helper::linkToRoute( 'yourappname_routename', array('key' => 1)));

In Twig templates you can use the :js:func:`url` function:

.. code-block:: js
  
  {{ url('yourappname_routename', {key: '1'}) }}


In JavaScript you can get the URL for a route like this:

.. code-block:: javascript

  var params = {key: 1};
  var url = OC.Router.generate('yourappname_routename', params);
  console.log(url); // prints /index.php//yourappname/myurl/1

.. note:: Be sure to only use the routes generator after the routes are loaded. This can be done by registering a callback with **OC.Router.registerLoadedCallback(callback)**

The second parameter is the URL which should be matched. You can extract values from the URL by using **{key}** in the section that you want to get. That value is then available under **$params['key']**, for the above example it would be **$params['key']**. You can omit the parameter if you dont extract any values from the URL at all.

If a default value should be used for an URL parameter, it can be set via the **defaults** method:

.. code-block:: php

  <?php
  use \OCA\AppFramework\App;
  use \OCA\YourApp\DependencyInjection\DIContainer;

  $this->create('yourappname_routename', '/myurl/{key}')->action(
      function($params){
          App::main('MyController', 'methodName', $params, new DIContainer());
      }
  )->defaults('key' => 'john');


To call your controllers the App Framework provides a main method: :php:class:`OCA\\AppFramework\\App`.

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

The fourth parameter is an instance of the **DIContaier** (see :doc:`../general/dependencyinjection`). If you want to replace objects in the container only for a certain request, you can do it like this:

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
