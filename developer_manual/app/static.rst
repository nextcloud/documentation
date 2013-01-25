Static content
==============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Static content is compressed by ownCloud and therefore needs to be added in the controller. If the CSS or JavaScript does not seem to get updated, check if the debug mode is enabled. To enable it see :doc:`gettingstarted`

JavaScript and CSS
------------------

JavaScript files go to the **js/** directory, CSS files to the **css/** directory. They are both minified in production and must therefore be declared in your controller method.

To add a script in your controller method, use the controller's **addScript** and **addStyle** methods.

.. code-block:: php

  <?php

  // in your controller
  public function index(){

    // adds the js/admin.js file
    $this->api->addScript('admin');

    // adds the css/admin.css file
    $this->api->addStyle('admin');

    // etc
  }

  ?>

If you have to include an image in your CSS, use %appswebroot% and %webroot% for creating absolute paths to your image, for instance:


.. code-block:: css

  .folder > .title {
      background-image: url('%webroot%/core/img/places/folder.svg');
  }