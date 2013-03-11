Dependency Injection
====================
Dependency Injection helps you to create testable code. A good overview over how it works and what the benefits are can be seen on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

The container is configured in :file:`dependencyinjection/dicontainer.php`. By default `Pimple <http://pimple.sensiolabs.org/>`_ is used as dependency injection container. A `tutorial can be found here <http://jtreminio.com/2012/10/an-introduction-to-pimple-and-service-containers/>`_ 


To add your own classes simply open the :file:`dependencyinjection/dicontainer.php` and add a line like this to the constructor:

.. code-block:: php

  <?php

  // in the constructor

  $this['MyClass'] = function($c){
      return new MyClass($c['SomeOtherClass']);
  };

  ?>

You can also overwrite already existing items from the App Framework simply by redefining them.

**See also** :doc:`../general/dependencyinjection`