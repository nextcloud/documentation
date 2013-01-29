Templates
=========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

ownCloud provides its own templating system. The App Framework also provides the option of using `Twig Templates <http://twig.sensiolabs.org/>`_ which can optionally be enabled. Templates reside in the **templates/** folder.

Templates are abstracted by the TemplateResponse object and used and returned inside the controller method. Variables can be assigned to the Template by using the :php:class:`OCA\\AppFramework\\Http\\TemplateResponse::setParams` method:

.. code-block:: php

  <?php
  use \OCA\AppFramework\Http\TemplateResponse as TemplateResponse

  // ...

  // in your controller

  public function index(){

    // main is the template name. Owncloud will look for template/main.php
    $response = new TemplateResponse($this->api, 'main');

    $params = array('entries' => array('this', 'is', 'your', 'father', 'speaking')
    $response->setParams($params);

    return $response;
  }

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

If you want to use Twig together with AngularJS the variable print characters **{{}}** of Angular will have to be adjusted. You can do that by setting a different $interpolateProvider in the :file:`coffee/app.coffee` config section:

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

    {{ url('apptemplate_advanced_params', {value: 'hi'}) }}


.. js:function:: abs_url(route, params=null)
  
  :param string route: the name of the route
  :param string params: the params written like a JavaScript object

  Same as :js:func:`url` but prints an absolute URL

  An example would be:

  .. code-block:: js

    {{ abs_url('apptemplate_advanced_params', {value: 'hi'}) }}


.. js:function:: trans(toTranslate, params=null)
  
  :param string toTranslate: the string which should be translated
  :param string params: the params that should be replaced in the string

  Enables translation in the templates

  An example would be:

  .. code-block:: js

    {{ trans('Translate %s %s', 'this', 'and this') }}


ownCloud Templates
------------------
In every template file you can easily access the template functions listed in :doc:`../classes/core/templates`. To access the assigned variables in the template, use the **$_[]** array. The variable will be availabe under the key that you defined (e.g. $_['key']).

:file:`templates/main.php`

.. code-block:: php

  <?php foreach($_['entries'] as $entry){ ?>
    <p><?php p($entry); ?></p>
  <?php
  }

  print_unescaped($this->inc('sub.inc'));

  ?>

.. warning::
  .. versionchanged:: 5.0

  To prevent XSS the following PHP **functions for printing are forbidden: echo, print() and <?=**. Instead use the **p()** function for printing your values. Should you require unescaped printing, **double check for XSS** and use: :php:func:`print_unescaped`.

Templates can also include other templates by using the **$this->inc('templateName')** method. Use this if you find yourself repeating a lot of the same HTML constructs. The parent variables will also be available in the included templates, but should you require it, you can also pass new variables to it by using the second optional parameter for $this->inc.



:file:`templates/sub.inc.php`

.. code-block:: php

  <div>I am included but i can still access the parents variables!</div>
  <?php p($_['name']); ?>


**For more info, see** :doc:`../classes/core/templates`