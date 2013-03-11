API abstraction layer
=====================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

ownCloud currently has a ton of static methods which is a very bad thing concerning testability. Therefore the App Framework comes with an :php:class:`OCA\\AppFramework\\Core\\API` abstraction layer (basically a `facade <http://en.wikipedia.org/wiki/Facade_pattern>`_) which is located in the App Framework app at :file:`core/api.php`. 

This is a temporary solution until ownCloud offers a proper API with normal classes that can be used in the DIContainer.

This will allow you to easily mock the API in your unittests.

If you find yourself in need to use more ownCloud internal static methods, add them to the API class in the **appframework/** directory, like:

.. code-block:: php

  <?php

      // inside the API class


      public function methodName($someParam){
         \OCP\Util::methodName($this->appName, $someParam);
      }

    }
  ?>

.. note:: Please send a pull request and cc **Raydiation** so the method can be added to the API class.

A temporary solution would be to to simply inherit from the API class and overwrite the API in the dependency injection container in :file:`dependencyinjection/dicontainer.php` by using:

.. code-block:: php

  <?php

  // inside the constructor
  $this['API'] = $this->share(function($c){
      return new MyExtendedAPI($c['AppName']);
  });


