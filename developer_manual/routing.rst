Routing
=======

With routing the request url doesn't need to be matched with a physical file.
Instead, the url is mapped to a function that handles the request. 
It can even map different urls to the same function,
which is useful for backward compatibility.

By using routing, you only have one place to define the url, 
which makes it easier in case the url needs to be changed.

Routing in ownCloud
-------------------

Routing in ownCloud is based on `Symfony Routing Component <http://symfony.com/doc/current/book/routing.html>`_.

Look at the API docs for OC_Router and OC_Route for more information.

Creating a route
----------------

Application routes are defined in the file routes.php in the appinfo directory.

.. code-block:: php

   <?php
   $this->create('app_script', '/apps/{app}/{file}')
	->defaults(array('file' => 'index.php'))
	->requirements(array('file' => '.*.php'))
	->action('OC', 'loadAppScriptFile');
   ?>

The first parameter is a friendly name for the route, this can later be used to
create a url with this route.

The second is the url pattern, the placeholders {app} and {file} are used for
generating the url and for matching the requested url. The values from the
match are supplied to the action function.

In this example we also define a default for {file} and a requirement. The
requirement is used in generating and matching to make sure the correct route
is used.

action function
---------------

The action function is used to specify which function to call when the route
matches. This can be a class with function, like in the example, or a callable.

linkToRoute
-----------

Using a route in php is very simple, just use the linkToRoute.

.. code-block:: php

   <?php
   $url = OC_Helper::linkToRoute( 'download', array('file' => $path));
   ?>


Where 'download' is the route name, and the array are the parameters for the
route. If a parameter is not used in the pattern, it will be appended in the
query.

OC.Router.generate
------------------

In javascript it works the same way:

.. code-block:: javascript

   OC.Router.generate( 'download', { file: path } );


actionInclude
-------------

There is also a helper function to use a php file as an action. Instead of
action you use actionInclude('file') and then that file will be included when
the route matches. It also adds the parameters from the url to $_GET.


--

- not depending on filesstructure
- URL routing lets you configure an application to accept request URLs that do not map to physical files. Instead, you can use routing to define URLs that are semantically meaningful to users and that can help with search-engine optimization (SEO).



Why Do I Use URL Routing? For Ease of Navigation, of course!

URL Routing, which enables you to change the URL to point to an evaluated expression instead of a fixed file location parameterized with a query string. Why should you care? Read this story and decide for yourself.


