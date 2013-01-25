API abstraction layer
=====================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Owncloud currently has a ton of static methods which is a very bad thing concerning testability. Therefore the appframework comes with an API abstraction layer (basically a `facade <http://en.wikipedia.org/wiki/Facade_pattern>`_) which is located in the appframework app at :file:`core/api.php`.

If you find yourself in need to use more ownCloud internal static methods, add them to the API class in the appframework directory, like:

.. code-block:: php

  <?php

      // inside the API class


      public function methodName($someParam){
         \OCP\Util::methodName($this->appName, $someParam);
      }

    }
  ?>

.. note:: Please send a pull request and cc **Raydiation** so the method can be added to the API class.

You could of course also simply inherit from the API class and overwrite the API in the dependency injection container in :file:`dependencyinjection/dicontainer.php` by using:

.. code-block:: php

  <?php

  // inside the constructor
  $this['API'] = $this->share(function($c){
      return new MyExtendedAPI($c['AppName']);
  });

This will allow you to easily mock the API in your unittests.

.. note:: This will eventually be replaced with an internal Owncloud API layer.
