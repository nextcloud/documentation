Routes
======

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

PHP usually treats the URL like a filepath. This is easy for beginners but gets more complicated if a good architecture is required. For instance if an URL should call a certain function/method or if values should be extracted from the URL.

Routing connects your URLs with your controller methods and allows you to create constant and nice URLs. Its also easy to extract values from the URLs.

ownCloud uses `Symphony Routing <http://symfony.com/doc/2.0/book/routing.html>`_

Routes are declared in :file:`appinfo/routes.php`

A simple route would look like this:

.. code-block:: php

  <?php

  // this route matches /index.php/yourapp/myurl/SOMEVALUE
  $this->create('yourappname_routename', '/myurl/{key}')->action(
      function($params){
          require __DIR__ . '/../index.php';
      }
  );


The first argument is the name of your route. This is used as an identifier to get the URL of the route and is a nice way to generate the URL in your templates or JavaScript for certain links since it does not force you to hardcode your URLs. 

.. note:: The identifier should always start with the appid since they are global and you could overwrite a route of a different app

The second parameter is the URL which should be matched. You can extract values from the URL by using **{key}** in the section that you want to get. That value is then available under **$params['key']**, for the above example it would be **$params['key']**. You can omit the parameter if you dont extract any values from the URL at all.

If a default value should be used for an URL parameter, it can be set via the **defaults** method:

.. code-block:: php

  <?php

  $this->create('yourappname_routename', '/myurl/{key}')->action(
      function($params){
          require __DIR__ . '/../index.php';
      }
  )->defaults('key' => 'john');

The **action** method allows you to register a callback which gets called if the route is matched. You can use this to call a controller or simply include a PHP file.

Using routes in templates and JavaScript
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
To use routes in :php:class:`OC_Template`, use:

.. code-block:: php

  <?
  print_unescaped(\OCP\Util::linkToRoute( 'yourappname_routename', array('key' => 1)));


In JavaScript you can get the URL for a route like this:

.. code-block:: javascript

  var params = {key: 1};
  var url = OC.Router.generate('yourappname_routename', params);
  console.log(url); // prints /index.php//yourappname/myurl/1

.. note:: Be sure to only use the routes generator after the routes are loaded. This can be done by registering a callback with **OC.Router.registerLoadedCallback(callback)**