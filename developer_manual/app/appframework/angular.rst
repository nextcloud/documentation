AngularJS
=========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

.. versionadded:: 6.0

The App Framework comes with tools for integrating :doc:`../general/angular` into the app. To make use of the the tools include them in your templates.

Using ownCloud Templates
------------------------

:file:`templates/main.php`

.. code-block:: php

  <?php \OCP\Util::addScript('appframework', 'public/app'); ?>


Using Twig Templates
--------------------

:file:`templates/main.php`

.. code-block:: js

  {{ script('public/app', 'appframework') }}


