Container
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The App Framework assembles the application by using an Inversion of Control container which does :doc:`../general/dependencyinjection`. Dependency Injection helps you to create testable and maintainable code. For a very simple and good tutorial, watch the `Dependency Injection and the art of Services and Containers Tutorial on YouTube <http://www.youtube.com/watch?v=DcNtg4_i-2w>`_. A broader overview over how it works and what the benefits are can be seen on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_.

The container is configured in :file:`appinfo/application.php`.


To add your own classes simply open the :file:`appinfo/application.php` and add a line like this to the constructor:

.. code-block:: php

  <?php

  namespace OCA\MyApp\AppInfo;

  use \OCP\AppFramework\App;

  use \OCA\MyApp\Controller\PageController;


  class MyApp extends App {


    /**
     * Define your dependencies in here
     */
    public function __construct(array $urlParams=array()){
      parent::__construct('myapp', $urlParams);

      $container = $this->getContainer();

      /**
       * Controllers
       */
      $container->registerService('PageController', function($c){
        return new PageController(
          $c->query('AppName'),
          $c->query('ServerContainer')->getRequest()
        );
      });
    }
  }


Service provided by core
========================
Core provides some predefined services that can be injected into your app. Every service is available from querying the **ServerContainer**::

  $server = $c->query('ServerContainer')
  $server->getRequest()  // get the request

