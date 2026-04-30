===
CSS
===

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The CSS files reside in the **css/** folder and should be included in the template:

.. code-block:: php

  <?php
  // include one file
  style('myapp', 'style');  // adds css/style.(s)css

  // include multiple files for the same app
  style('myapp', array('style', 'navigation'));  // adds css/style.(s)css, css/navigation.(s)css

  // include vendor file (also allows array syntax)
  vendor_style('myapp', 'style');  // adds vendor/style.(s)css

.. note:: ``SCSS`` is supported natively.
   You can migrate your files by simply renaming your ``.css`` files to ``.scss``.
   The server will automatically compile, cache and and serve it.
   The priority goes to the scss file. So having two file with the same name and a ``scss`` & ``css`` extension
   will ensure a retro compatibility with <12 versions as scss files will be ignored by the server.

Web Components go into the **component/** folder and can be imported like this:

.. code-block:: php

  <?php
  // include one file
  component('myapp', 'tabs');  // adds component/tabs.html

  // include multiple files for the same app
  component('myapp', array('tabs', 'forms'));  // adds component/tabs.html, component/forms.html


.. note:: Keep in mind that Web Components are still very new and you `might need to add polyfills <https://www.webcomponents.org/polyfills/>`_
