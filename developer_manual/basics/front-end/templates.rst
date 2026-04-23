=========
Templates
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Nextcloud provides its own templating system which is basically plain PHP with some additional functions and preset variables. All the parameters which have been passed from the :doc:`controller <../controllers>` are available in an array called **$_[]**, e.g.::
    
    array('key' => 'something')

can be accessed through::

    $_['key']


.. note:: To prevent XSS the following PHP **functions for printing are forbidden: echo, print() and <?=**. Instead use the **p()** function for printing your values. Should you require unescaped printing, **double check for XSS** and use: :php:func:`print_unescaped()`.

Printing values is done by using the :php:func:`p()` function, printing HTML is done by using :php:func:`print_unescaped()`.

:file:`templates/main.php`

.. code-block:: php

  <?php foreach($_['entries'] as $entry){ ?>
    <p><?php p($entry); ?></p>
  <?php
  }

Including templates
-------------------

Templates can also include other templates by using the **$this->inc('templateName')** method. 

.. code-block:: php

  <?php print_unescaped($this->inc('sub.inc')); ?>

The parent variables will also be available in the included templates, but should you require it, you can also pass new variables to it by using the second optional parameter as array for **$this->inc**.

:file:`templates/sub.inc.php`

.. code-block:: php

  <div>I am included, but I can still access the parents variables!</div>
  <?php p($_['name']); ?>
  
  <?php print_unescaped($this->inc('other_template', array('variable' => 'value'))); ?>

Including CSS and JavaScript
----------------------------

.. warning:: This is deprecated, please use ``addScript`` and ``addStyle`` in your controller instead.
   See :ref:`ApplicationJs` for more information.

To include CSS or JavaScript use the **style** and **script** functions:

.. code-block:: php

  <?php
  script('myapp', 'script');  // add js/script.js
  style('myapp', 'style');  // add css/style.css


Including images
----------------

To generate links to images use the **image_path** function:

.. code-block:: php
  
  <img src="<?php print_unescaped(image_path('myapp', 'app.png')); ?>" />

