.. include:: ../app/templates.rst


Templates are abstracted by the TemplateResponse object and used and returned inside the controller method. Variables can be assigned to the Template by using the :php:class:`OCA\\AppFramework\\Http\\TemplateResponse::setParams` method:

:file:`controllers/yourcontroller.php`

.. code-block:: php

  <?php
  use \OCA\AppFramework\Http\TemplateResponse;

  // inside the controller

  public function index(){

    // main is the template name. Owncloud will look for template/main.php
    $response = new TemplateResponse($this->api, 'main');

    $params = array('entries' => array('this', 'is', 'your', 'father', 'speaking'));
    $response->setParams($params);

    return $response;
  }

The App Framework also provides the option of using `Twig Templates <http://twig.sensiolabs.org/>`_ which can optionally be enabled. Templates reside in the **templates/** folder.


Twig Templates (recommended)
----------------------------
ownCloud templates do a bad job at preventing `XSS <http://en.wikipedia.org/wiki/Cross-site_scripting>`_. Therefore the App Framework comes with a second option: the `Twig Templating Language <http://twig.sensiolabs.org/>`_.

Twig Templates are enabled by using the Twig Middleware. If a Twig template directory is set in the :file:`dependencyinjection/dicontainer.php`, the middleware gets loaded automatically. If no directory is set, theres no additional overhead.

To enable them in the :file:`dependencyinjection/dicontainer.php`, add the following line to the constructor:

.. code-block:: php

  <?php

    // in the constructor

    // use this to specify the template directory
    $this['TwigTemplateDirectory'] = __DIR__ . '/../templates';

Twig can also cache templates as simple PHP files. To make use of this, create a **cache/** directory in your app and add the following line to the :file:`dependencyinjection/dicontainer.php`:

.. code-block:: php

  <?php

    // in the constructor

    // if you want to cache the template directory, add this path
    $this['TwigTemplateCacheDirectory'] = __DIR__ . '/../cache';


A full reference can be found on the `Twig Template Reference <http://twig.sensiolabs.org/doc/templates.html>`_.

If you want to use Twig together with AngularJS the variable print characters **{{}}** of Angular will have to be adjusted. You can do that by setting a different **$interpolateProvider** in the :file:`coffee/app.coffee` config section:

.. code-block:: js

  app.config(['$interpolateProvider', function($interpolateProvider) {
      $interpolateProvider.startSymbol('[[');
      $interpolateProvider.endSymbol(']]');
  }]);

After adding the above lines, Angular will use **[[]]** for evaluation variables.

Additional Twig Extensions
~~~~~~~~~~~~~~~~~~~~~~~~~~
The App Framework comes with additional template functions for Twig to better integrate with ownCloud. The following additional functions are provided:


.. js:function:: url(route, params=null)

  :param string route: the name of the route
  :param string params: the params written like a JavaScript object

  Prints the URL for a route.

  An example would be:

  .. code-block:: js

    {{ url('yourapp_route_name', {value: 'hi'}) }}


.. js:function:: abs_url(route, params=null)

  :param string route: the name of the route
  :param string params: the params written like a JavaScript object

  Same as :js:func:`url` but prints an absolute URL

  An example would be:

  .. code-block:: js

    {{ abs_url('yourapp_route_name', {value: 'hi'}) }}


.. js:function:: trans(toTranslate, params=null)

  :param string toTranslate: the string which should be translated
  :param string params: the params that should be replaced in the string

  Enables translation in the templates

  An example would be:

  .. code-block:: js

    {{ trans('Translate %s %s', 'this', 'and this') }}


.. js:function:: script(path, appName=null)

  :param string path: path to the JavaScript file in the **js/** folder in the app. The **.js** extension is automatically added.
  :param string appName: name of the app. If no value is given, the current app will be used.

  .. versionadded:: 6.0

  Adds a JavaScript file inside the template

  An example would be:

  .. code-block:: js

    // to include the js/public/app.js in your app use
    {{ script('public/app') }}


.. js:function:: style(path, appName=null)

  :param string path: path to the CSS file in the **css/** folder in the app. The **.css** extension is automatically added.
  :param string appName: name of the app. If no value is given, the current app will be used.

  .. versionadded:: 6.0

  Adds a CSS file inside the template

  An example would be:

  .. code-block:: js

    // to include the css/style.css in your app use
    {{ style('style') }}


.. js:function:: image_path(path, appName=null)

  :param string path: path to an image file in the **img/** folder in the app.
  :param string appName: name of the app. If no value is given, the current app will be used.

  .. versionadded:: 6.0

  Returns the link to an image

  An example would be:

  .. code-block:: html

    // to include the img/icon.png in your app use
    <img src="{{ image_path('icon.png') }}" />


.. js:function:: link_to(path, appName=null)

  :param string path: path to a file
  :param string appName: name of the app. If no value is given, the current app will be used.

  .. versionadded:: 6.0

  Returns the link to a file

  An example would be:

  .. code-block:: html

    // to include the files/my.pdf in your app use
    <a href="{{ link_to('files/my.pdf') }}">my pdf</a>


