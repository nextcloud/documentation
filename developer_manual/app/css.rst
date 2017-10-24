===
CSS
===

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The CSS files reside in the **css/** folder and should be included in the template:

.. code-block:: php

  <?php
  // include one file
  style('myapp', 'style');  // adds css/style.css

  // include multiple files for the same app
  style('myapp', array('style', 'navigation'));  // adds css/style.css, css/navigation.css

  // include vendor file (also allows array syntax)
  vendor_style('myapp', 'style');  // adds vendor/style.css

Web Components go into the **component/** folder and can be imported like this:

.. code-block:: php

  <?php
  // include one file
  component('myapp', 'tabs');  // adds component/tabs.html

  // include multiple files for the same app
  component('myapp', array('tabs', 'forms'));  // adds component/tabs.html, component/forms.html


.. note:: Keep in mind that Web Components are still very new and you `might need to add polyfills <https://www.webcomponents.org/polyfills/>`_
