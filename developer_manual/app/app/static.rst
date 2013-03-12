Static content
==============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Static content consists of:

* **img/**: all images
* **js/**: all JavaScript files
* **css/**: all CSS files

.. note:: CSS and JavaScript are compressed by ownCloud so if the CSS or JavaScript do not seem to get updated, check if the debug mode is enabled. To enable it see :doc:`../intro/gettingstarted`



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

If you have to include an image or css file in your CSS, prepend the following to your path: 

* **%appswebroot%**: gets the absolute path to your app
* **%webroot%**: gets the absolute path to owncloud

For example:

.. code-block:: css

  .folder > .title {
      background-image: url('%webroot%/core/img/places/folder.svg');
  }

Formfactors
-----------
ownCloud automatically detects what kind of form factor you are using.

Currently supported are:

* **mobile**: works well on mobiles
* **tablet**: optimized for devices like iPads or Android Tablets
* **standalone**: mode where only the content are an App is shown. The header, footer and side navigation is not visible. This is useful if ownCloud is embedded in other applications.

The auto detection can be overwritten by using the “formfactor” GET variable in the url::

  index.php/myapp?formfactor=mobile

If you want to provide a different stylesheet or javascript file for mobile devices just suffix the formfactor in the filename, like::

  style.mobile.css

or::
  
  script.tablet.css