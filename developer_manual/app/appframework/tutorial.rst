App Tutorial
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

This tutorial contains the MVC approach to write an app. The goal of this tutorial is a simple notes app. 

Create an app entry
-------------------
Depending on the . This file will always loaded for every app and can for instance be used to load additional JavaScript for the files app:

:file:`appinfo/app.php`

.. code-block:: php

  <?php

  namespace OCA\MyNotes;

  $api = new \OCA\AppFramework\Core\API('mynotes');

  $api->addNavigationEntry(array(
    
    // the string under which your app will be referenced in owncloud
    'id' => $api->getAppName(),

    // sorting weight for the navigation. The higher the number, the higher
    // will it be listed in the navigation
    'order' => 10,
    
    // the route that will be shown on startup
    'href' => $api->linkToRoute('mynotes_index'),
    
    // the icon that will be shown in the navigation
    'icon' => $api->imagePath('example.png' ),
    
    // the title of your application. This will be used in the
    // navigation or on the settings page of your app
    'name' => $api->getTrans()->t('My notes app') 
    
  ));


First Page
----------

Now that the basic files are created, the following things are needed to create a page:

* **A route**: The URL which links to the controller
* **A controller**: Gets the request and returns a response
* **An entry in the DIContainer**: This makes the controller available for the application
* **A template**: HTML which should be displayed on the page

First the route which is linked in the :file:`appinfo/app.php` needs to be created. To do that create the :doc:`routes` file:

:file:`appinfo/routes.php`

.. code-block:: php

  <?php

  namespace OCA\MyNotes;

  use \OCA\AppFramework\App;
  use \OCA\MyNotes\DependencyInjection\DIContainer;

  $this->create('mynotes_index', '/')->action(
      function($params){
          // call the index method on the class PageController
          App::main('PageController', 'index', $params, new DIContainer());
      }
  );

The :doc:`controllers` to which the route links does not exist yet and it has to be created:

:file:`controllers/pagecontroller.php`

.. code-block:: php

  <?php

  namespace OCA\MyNotes\Controller;

  use OCA\AppFramework\Controller\Controller;


  class PageController extends Controller {
    

      public function __construct($api, $request){
          parent::__construct($api, $request);
      }


      /**
       * @CSRFExemption
       * @IsAdminExemption
       * @IsSubAdminExemption
       */
      public function index(){
          return $this->render('main');
      }


  }


Now create the template:

:file:`templates/main.php`

.. code-block:: html

  <div>Hello World</div>


The last thing that is left is to tell the application how the controller needs to be created. The App Framework makes heavy use of :doc:`../general/dependencyinjection` and provides an IOC Container. Inside this container, the controller needs to be created:

:file:`dependencyinjection/dicontainer.php`

.. code-block:: php

  <?php

  class DIContainer extends BaseContainer {

      public function __construct(){
          parent::__construct('mynotes');

          // use this to specify the template directory
          $this['TwigTemplateDirectory'] = __DIR__ . '/../templates';

          $this['PageController'] = function($c){
              return new PageController($c['API'], $c['Request']);
          };
      }

  }