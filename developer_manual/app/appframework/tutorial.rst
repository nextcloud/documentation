App Tutorial
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

This tutorial contains the MVC approach to write an app and continues where :doc:`../intro/createapp` left off. The result will be a simple "Hello World" app.

To make use of the App Framwork app it must be activated first by linking it into the app directory::

    sudo ln -s /var/www/apps/appframework /var/www/owncloud/apps

After that activate it on the apps page.

Create an navigation entry
--------------------------
The **app.php** will always loaded for every app and can for instance be used to load additional JavaScript for the files app. Therefore the navigation entry has to be registered in this file.

.. note:: The icon **img/example.png** needs to exist or the navigation will throw an error

:file:`appinfo/app.php`

.. code-block:: php

  <?php

  namespace OCA\MyApp;

  $api = new \OCA\AppFramework\Core\API('myapp');

  $api->addNavigationEntry(array(
    
    // the string under which your app will be referenced in owncloud
    'id' => $api->getAppName(),

    // sorting weight for the navigation. The higher the number, the higher
    // will it be listed in the navigation
    'order' => 10,
    
    // the route that will be shown on startup
    'href' => $api->linkToRoute('myapp_index'),
    
    // the icon that will be shown in the navigation
    // this file needs to exist in img/example.png
    'icon' => $api->imagePath('example.png'), 
    
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


Create the main route
---------------------
:doc:`routes` map the URL to functions and allow to extract values. To show the content when the navigation entry is clicked, the index route which was defined in the :file:`appinfo/app.php` needs to be created:

:file:`appinfo/routes.php`

.. code-block:: php

  <?php

  namespace OCA\MyApp;

  use \OCA\AppFramework\App;
  use \OCA\MyApp\DependencyInjection\DIContainer;

  $this->create('myapp_index', '/')->action(
      function($params){
          // call the index method on the class PageController
          App::main('PageController', 'index', $params, new DIContainer());
      }
  );

Write the logic (Controller)
----------------------------
The :doc:`controllers` to which the route links does not exist yet and it has to be created:

:file:`controller/pagecontroller.php`

.. code-block:: php

  <?php

  namespace OCA\MyApp\Controller;

  use OCA\AppFramework\Controller\Controller;


  class PageController extends Controller {
    

      public function __construct($api, $request){
          parent::__construct($api, $request);
      }


      /**
       * ATTENTION!!!
       * The following comments turn off security checks
       * Please look up their meaning in the documentation!
       *
       * @CSRFExemption
       * @IsAdminExemption
       * @IsSubAdminExemption
       */
      public function index(){
          return $this->render('main', array(
              'msg' => 'Hello World'
          ));
      }


  }

Create the template
-------------------
Now create the :doc:`templates` which contains the HTML

:file:`templates/main.php`

.. code-block:: html

  <div>{{ msg }}</div>


Wire everything together
------------------------
The last thing that is left is to tell the application how the controller needs to be created. The App Framework makes heavy use of :doc:`../general/dependencyinjection` and provides an :doc:`IOC Container <container>`. Inside this container, the controller needs to be created:

:file:`dependencyinjection/dicontainer.php`

.. code-block:: php

  <?php

  namespace OCA\MyApp\DependencyInjection;

  use OCA\AppFramework\DependencyInjection\DIContainer as BaseContainer;

  use OCA\MyApp\Controller\PageController;

  class DIContainer extends BaseContainer {

      public function __construct(){
          parent::__construct('myapp');

          // use this to specify the template directory
          $this['TwigTemplateDirectory'] = __DIR__ . '/../templates';

          $this['PageController'] = function($c){
              return new PageController($c['API'], $c['Request']);
          };
      }

  }

Congratulations! The message "Hello World" can now be seen on the main page of your app.
