Templates
=========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

ownCloud provides its own templating system.

In every template file you can easily access the template functions listed in :doc:`../app/api/templates`. To access the assigned variables in the template, use the **$_[]** array. The variable will be availabe under the key that you defined (e.g. $_['key']).

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

Templates can also include other templates by using the **$this->inc('templateName')** method. Use this if you find yourself repeating a lot of the same HTML constructs.

The parent variables will also be available in the included templates, but should you require it, you can also pass new variables to it by using the second optional parameter as array for **$this->inc**.



:file:`templates/sub.inc.php`

.. code-block:: php

  <div>I am included but i can still access the parents variables!</div>
  <?php p($_['name']); ?>
  
  <?php print_unescaped($this->inc('other_template', array('variable' => 'value'))); ?>


**For more info, see** :doc:`../app/api/templates`