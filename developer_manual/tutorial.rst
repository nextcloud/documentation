App Tutorial
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `mailing list <https://mail.kde.org/mailman/listinfo/owncloud>`_ so other contributors might join in.

This tutorial uses the appframework app, a small framework that makes developing apps easier. To use it, it has to be enabled on the apps settings page.


Getting Started
---------------
To get started you'll need to clone the basic git repositories into your web directory. Depending on your distro this will either be **/var/www** or **/srv/http**

.. code-block:: bash
  
  sudo chmod o+rw /var/www
  cd /var/www
  git clone https://github.com/owncloud/core.git owncloud
  git clone https://github.com/owncloud/apps.git apps
  git clone https://github.com/owncloud/3rdparty.git 3rdparty
  sudo chmod o-rw /var/www

Now restart your apache server and get ready to set up owncloud at http://localhost/owncloud


Enable debugging mode
---------------------
To disable JavaScript and CSS caching you'll have to turn on debugging in :file:`/var/www/owncloud/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);


Create your app
---------------
The best way to create your application is to simply modify the `apptemplateadvanced app <https://github.com/owncloud/apps/tree/master/apptemplateadvanced>`_.

To do that execute:

.. code-block:: bash

  cd /var/www/apps
  sudo cp -r apptemplateadvanced yourappname
  sudo chown -R youruser:yourgroup yourappname

To enable your app, simply link it into the apps directory:


.. code-block:: bash

  sudo ln -s /var/www/apps/yourappname /var/www/owncloud/apps/yourappname

or create a second apps directory in your :file:`/var/www/owncloud/config/config.php` (see :doc:`configfile`)

.. note:: Don't forget to enable your app and the appframework app on the apps settings page!

Now change into your app directory::

  cd /var/www/apps/yourappname


Adjust apptemplate
------------------------------------------
Certain things are still apptemplate specific and you will have to convert them to match your app.

.. todo::

  Provide some sed commands for simple transformation

The following things will need to be changed:

* In every file: AGPL Headers
* In every file: **namespace OCA\\AppTemplateAdvanced** to **namespace OCA\\YourAppName**
* :file:`dependencyinjection/dicontainer.php`: The **parent::__construct('apptemplateadvanced')** to **parent::__construct('yourappname')**
* :file:`appinfo/info.xml`: Your data
* :file:`appinfo/app.php`: the correct navigation settings
* :file:`appinfo/routes.php`: the name of the routes
* :file:`coffee/app.coffee`: the route names

App information
---------------
You'll need to give some information on your app for instance the name. To do that open the :file:`appinfo/app.php` and adjust it like this

.. code-block:: php

  <?php

  // if you dont want to register settings for the admin, delete the following
  // line
  \OCP\App::registerAdmin('yourappname', 'admin/settings');

  \OCP\App::addNavigationEntry( array(

    // the string under which your app will be referenced
    // in owncloud, for instance: \OC_App::getAppPath('APP_ID')
    'id' => 'yourappname',
  
    // sorting weight for the navigation. The higher the number, the higher
    // it will be listed in the navigation
    'order' => 74,
  
    // the route that will be shown on startup
    'href' => \OC_Helper::linkToRoute('yourappname_index'),
  
    // the icon that will be shown in the navigation
    'icon' => \OCP\Util::imagePath('yourappname', 'example.png' ),
  
    // the title of your application. This will be used in the
    // navigation or on the settings page of your app
    'name' => \OC_L10N::get('yourappname')->t('Your App') 

  ));

  ?>

The second place where app specifc information is stored is in :file:`appinfo/info.xml`

.. code-block:: xml

  <?xml version="1.0"?>
  <info>
        <id>yourappname</id>
        <name>Your App</name>
        <description>Your App description</description>
        <version>1.0</version>
        <licence>AGPL</licence>
        <author>Your Name</author>
        <require>4</require>
        <standalone/>
        <types>
            <filesystem/>
        </types>
	    <shipped>true</shipped>
        <default_enable/>
  </info>

ownCloud allows to specify four kind of "types" in the file:`appinfo/info.xml` of a app. The
type doesn't have to be specified if the app doesn't match any of them.

Currently supported "types":

* **prelogin**: apps which needs to load on the login page

* **filesystem**: apps which provides filesystem functionality (e.g. files sharing app)

* **authentication**: apps which provided authentication backends

* **logging**: apps which implement a logging system

Classloader
-----------
The classloader is provided by ownCloud and loads all your classes automatically. The only thing left to include by yourself are 3rdparty libraries.
Note that this means that the classes need to be named and organized in folders according to their full qualifier.

The classloader works like this:

* Take the full qualifier of a class::

    \OCA\AppTemplateAdvanced\Db\ItemMapper

* If it starts with \\OCA include file from the apps directory
* Cut off \\OCA::

    \AppTemplateAdvanced\Db\ItemMapper

* Convert all charactes to lowercase::

    \apptemplateadvanced\db\itemmapper

* Replace \\ with /::

    /apptemplateadvanced/db/itemmapper

* Append .php::

    /apptemplateadvanced/db/itemmapper.php

* Include the file::

    require '/apps/apptemplateadvanced/db/itemmapper.php';

Remember : for it to be autoloaded, the itemmapper.php file needs to either be stored in the /apps/apptemplateadvanced/db/ folder, or adjust its namespace according to the folder it's stored in.

Dependency Injection
--------------------
Dependency Injection helps you to create testable code. A good overview over how it works and what the benefits are can be seen on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

The container is configured in :file:`dependencyinjection/dicontainer.php`. By default Pimple is used as dependency injection container. The documentation on how to use it can be read on the `Pimple Homepage <http://pimple.sensiolabs.org/>`_

To add your own classes simply open the :file:`dependencyinjection/dicontainer.php` and add a line like this to the constructor:

.. code-block:: php

  <?php

  // in the constructor
  
  $this['MyClass'] = function($c){
      return new MyClass($c['SomeOtherClass']);
  };

  ?>

You can also overwrite already existing items from the appframework simply by redefining them.

**See also** :doc:`dependencyinjection`

API abstraction layer
---------------------
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



Routes
------
Routing connects your URLs with your controller methods and allows you to create constant and nice URLs. It also makes easy to extract values from the URLs.

Owncloud uses `Symphony Routing <http://symfony.com/doc/2.0/book/routing.html>`_

Routes are declared in :file:`appinfo/routes.php`

A simple route would look like this:

.. code-block:: php

  <?php
  use \OCA\AppFramework\App as App;

  $this->create('yourappname_routename', '/myurl/{value}')->action(
      function($params){
          App::main('MyController', 'methodName', $params, new DIContainer());
      }
  );
  ?>

The first argument is the name of your route. This is used as an identifier to get the URL of the route. This is a nice way to generate the URL in your templates or JavaScript for certain links since it does not force you to hardcode your URLs. To use it in templates, use:

.. code-block:: php

  <?
  print_unescaped(\OC_Helper::linkToRoute( 'yourappname_routename', array('value' => 1)));
  ?>

In JavaScript you can get the URL for a route like this:

.. code-block:: javascript

  var params = {value: 1};
  var url = OC.Router.generate('yourappname_routename', params);
  console.log(url); // prints /index.php//yourappname/myurl/hi

.. note:: Be sure to only use the routes generator after the routes are loaded. This can be done by registering a callback with **OC.Router.registerLoadedCallback(callback)**

The second parameter is the URL which should be matched. You can extract values from the URL by using **{KEY}** in the section that you want to get. That value is then available under **$params['KEY']**, for the above example it would be **$params['value']**. You can omit the parameter if you dont extract any values from the URL at all.

The third parameter is the $params array which is passed to the controller and available by using **$this->params($KEY)** in the controller method. In the following example, the parameter in the URL would be accessible by using: **$this->params('value')**

You can also limit the route to GET or POST requests by simply adding **->post()** or **->get()** before the action method like:

.. code-block:: php

  <?php
  $this->create('yourappname_routename', '/myurl/{value}')->post()->action(
      function($params){
          App::main('MyController', 'methodName', $params, new DIContainer());
      }
  );
  ?>

The fourth parameter is an instance of the **DIContaier**. If you want to replace values in the container only for a certain request, you can do it like this:

.. code-block:: php

  <?php
  $this->create('yourappname_routename', '/myurl/{value}')->post()->action(
      function($params){
          $container = new DIContainer();
          $container['SomeClass'] = function($c){
             return new SomeClass('different');
          }
          App::main('MyController', 'methodName', $params, $container);
      }
  );
  ?>


**See also:** :doc:`routing`


Controllers
-----------
The appframework app provides a simple baseclass for adding controllers. Controllers connect your view (templates) with your database. Controllers themselves are connected to one or more routes. Controllers go into the :file:`controller` directory.

A controller should be created for each resource. Think of it as an URL scheme::

  /controller/method/params

For instance::

  /file/delete/1

In this case we would create a controller named **FileController** and the method would be called **delete()**.


The apptemplate comes with several different controllers. A simple controller would look like:

.. code-block:: php

  <?php
  
  namespace OCA\YourApp\Controller;

  use \OCA\AppFramework\Controller\Controller as Controller;
  use \OCA\AppFramework\Http\JSONResponse as JSONResponse;


  class MyController extends Controller {


      /**
       * @param Request $request: an instance of the request
       * @param API $api: an api wrapper instance
       */
      public function __construct($api, $request){
          parent::__construct($api, $request);
      }


      /**
       * @Ajax
       *
       * @brief sets a global system value 
       */
      public function myControllerMethod(){
          $value = $this->params('somesetting');

          $response = new JSONResponse();
          $response->setParams(array('value' => $value));
          return $response;
      }

  }

  ?>

An instance of the API is passed via dependency injection, the same goes for a Request instance. URL Parameters, POST, GET and FILES parameters are partly  abstracted by the Request class and can be accessed via **$this->params('myURLParamOrPostOrGetKey')** and **$this->getUploadedFile($key)** inside the controller. This has been done to make the app better testable.

.. note:: If an URL Parameter, POST or GET value exist with the same key, the URL Parameter is preferred over the POST parameter and the POST parameter is preferred over the GET parameter. You should avoid this scenario though.

Every controller method has to return a Response object. The currently available Responses from the appframework include:

* **\\OCA\\AppFramework\\Http\\Response**: response for sending headers only
* **\\OCA\\AppFramework\\Http\\JSONResponse**: sends JSON to the client
* **\\OCA\\AppFramework\\Http\\TemplateResponse**: renders a template
* **\\OCA\\AppFramework\\Http\\RedirectResponse**: redirects to a new URL
* **\\OCA\\AppFramework\\Http\\TextDownloadResponse**: prompts the user to download a text file containing a passed string
* **\\OCA\\AppFramework\\Http\\TextResponse**: for printing text like XML


.. note:: For more responses, please look into the appframework :file:`http/`. If you create an additional response, be sure to create a pull request so that more people can profit from it!

Should you require to set additional headers, you can use the **addHeader()** method that every Response has.

Because TemplateResponse and JSONResponse are so common, the controller provides a shortcut method for both of them, namely **$this->render** and **$this->renderJSON**.

.. code-block:: php

  <?

  /**
   * @CSRFExemption
   */
  public function index(){
      $templateName = 'main';
      $params = array(
          'somesetting' => 'How long will it take'
      );

      return $this->render($templateName, $params);
  }


  /**
   * @Ajax
   */
  public function getMeJSON(){
      $params = array(
          'somesetting' => 'enough of this already'
      );

      return $this->renderJSON($params);
  }


For security reasons, all security checks for controller methods are turned on by default. To explicitely turn off checks, you must use exemption annotations above the desired method.

In this example, all security checks would be disabled (**not recommended**):


.. code-block:: php

  <?php
  /**
   * @CSRFExemption
   * @IsAdminExemption
   * @IsLoggedInExemption
   * @IsSubAdminExemption
   */
  public function index(){
      $templateName = 'main';
      $params = array(
          'somesetting' => 'How long will it take'
      );

      return $this->render($templateName, $params);
  }

Possible Annotations contain:

* **@CSRFExemption**: Turns off the check for the `CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ token. **Only use this for the index page**!

* **@IsAdminExemption**: Turns off the check if the user is an admin

* **@IsLoggedInExemption**: Turns off the check if the user is logged in

* **@IsSubAdminExemption**: Turns off the check if the user is a subadmin

* **@Ajax**: Use this for Ajax Requests. It prevents the unneeded rendering of the apps navigation and returns error messages in JSON format

Don't forget to add your controller to the dependency injection container in :file:`dependencyinjection/dicontainer.php`

.. code-block:: php

  <?php

  // in the constructor function

  $this['MyController'] = function($c){
      return new MyController($c['API'], $c['Request']);
  };

  ?>



Database Access
---------------

.. note:: This will likely change with the introduction of an ORM

ownCloud uses a database abstraction layer on top of either MDB2 or PDO, depending on the availability of PDO on the server.

Your database schema will be inside :file:`appinfo/database.xml` in MDB2's XML scheme notation where the placeholders \*dbprefix* (\*PREFIX* in your SQL) and \*dbname* can be used for the configured database table prefix and database name. 

An example database XML file would look like this:

.. code-block:: xml

  <?xml version="1.0" encoding="ISO-8859-1" ?>
  <database>
   <name>*dbname*</name>
   <create>true</create>
   <overwrite>false</overwrite>
   <charset>utf8</charset>
   <table>
    <name>*dbprefix*yourapp_items</name>
    <declaration>
      <field>
        <name>id</name>
        <type>integer</type>
        <default>0</default>
        <notnull>true</notnull>
            <autoincrement>1</autoincrement>
        <length>4</length>
      </field>
      <field>
        <name>user</name>
        <type>text</type>
        <notnull>true</notnull>
        <length>64</length>
      </field>
      <field>
        <name>name</name>
        <type>text</type>
        <notnull>true</notnull>
        <length>100</length>
      </field>
      <field>
        <name>path</name>
        <type>clob</type>
        <notnull>true</notnull>
      </field>
    </declaration>
  </table>
  </database>


To update the tables used by the app, simply adjust the database.xml file and increase the app version number in :file:`appinfo/version` to trigger an update.


Your database layer should go into the **db/** folder. It's recommended to split your data entities from your database queries. You can do that by creating a very simple PHP object with getters and setters. This object will hold your data.

:file:`db/item.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  class Item {

      private $id;
      private $name;
      private $path;
      private $user;

      public function __construct($fromRow=null){
          if($fromRow){
             $this->fromRow($fromRow);
          }
      }

      public function fromRow($row){
          $this->id = $row['id'];
          $this->name = $row['name'];
          $this->path = $row['path'];
          $this->user = $row['user'];
      }


      public function getId(){
          return $this->id;
      }

      public function getName(){
          return $this->name;
      }

      public function getUser(){
          return $this->user;
      }

      public function getPath(){
          return $this->path;
      }


      public function setId($id){
          $this->id = $id;
      }

      public function setName($name){
          $this->name = $name;
      }

      public function setUser($user){
          $this->user = $user;
      }

      public function setPath($path){
          $this->path = $path;
      }

  }


All database queries for that object should be put into a mapper class. This follows the `data mapper pattern <http://www.martinfowler.com/eaaCatalog/dataMapper.html>`_. The mapper class could look like this (more method examples are in the advanced_apptemplate):

:file:`db/itemmapper.php`

.. code-block:: php

  <?php
  namespace \OCA\YourApp\Db;

  use \OCA\AppFramework\Db\DoesNotExistException as DoesNotExistException;
  use \OCA\AppFramework\Db\Mapper as Mapper;


  class ItemMapper extends Mapper {


      private $tableName;

      /**
       * @param API $api: Instance of the API abstraction layer
       */
      public function __construct($api){
          parent::__construct($api);
          $this->tableName = '*PREFIX*apptemplateadvanced_items';
      }


      /**
       * Finds an item by id
       * @throws DoesNotExistException: if the item does not exist
       * @return the item
       */
      public function find($id){
          $row = $this->findQuery($this->tableName, $id);
          return new Item($row);
      }


      /**
       * Finds an item by user id
       * @param string $userId: the id of the user that we want to find
       * @throws DoesNotExistException: if the item does not exist
       * @return the item
       */
      public function findByUserId($userId){
          $sql = 'SELECT * FROM ' . $this->tableName . ' WHERE user = ?';
          $params = array($userId);

          $result = $this->execute($sql, $params)->fetchRow();
          if($result){
              return new Item($result);
          } else {
              throw new DoesNotExistException('Item with user id ' . $userId . ' does not exist!');
          }
      }


      /**
       * Saves an item into the database
       * @param Item $item: the item to be saved
       * @return the item with the filled in id
       */
      public function save($item){
          $sql = 'INSERT INTO '. $this->tableName . '(name, user, path)'.
              ' VALUES(?, ?, ?)';

          $params = array(
              $item->getName(),
              $item->getUser(),
              $item->getPath()
          );

          $this->execute($sql, $params);

          $item->setId($this->api->getInsertId());
          return $item;
      }


      /**
       * Updates an item
       * @param Item $item: the item to be updated
       */
      public function update($item){
          $sql = 'UPDATE '. $this->tableName . ' SET
              name = ?,
              user = ?,
              path = ?
              WHERE id = ?';

          $params = array(
              $item->getName(),
              $item->getUser(),
              $item->getPath(),
              $item->getId()
          );

          $this->execute($sql, $params);
      }


      /**
       * Deletes an item
       * @param int $id: the id of the item
       */
      public function delete($id){
          $this->deleteQuery($this->tableName, $id);
      }


  }

.. note:: Always use **?** to mark placeholders for arguments in SQL queries and pass the arguments as a second parameter to the execute function to prevent `SQL Injection <http://php.net/manual/en/security.database.sql-injection.php>`_

**DONT**:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM ' . $this->tableName . ' WHERE user = ' . $user;
  $result = $this->execute($sql);


**DO**:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM ' . $this->tableName . ' WHERE user = ?';
  $params = array($userId);

  $result = $this->execute($sql, $params);

For more information about MDB2 style prepared statements, please see the `official MDB2 documentation <http://pear.php.net/package/MDB2/docs>`_



Templates
---------
ownCloud uses its own templating system. Templates reside in the **template/** folder. In every template file you can easily access the template functions listed in :doc:`templates`

.. note::
  Templates **must not contain database queries**! All data should be passed to the template via ``$template->assign($key, $value)``.


To access the assigned variables in the template, use the **$_[]** array. The variable will be availabe under the key that you defined (e.g. $_['key']). 

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

  To prevent XSS the following PHP **functions for printing are forbidden: echo, print() and <?=**. Instead use ``p($data)`` for printing your values. Should you require unescaped printing, **double check for XSS** and use: ``print_unescaped($data)``.

Templates can also include other templates by using the **$this->inc('templateName')** method. Use this if you find yourself repeating a lot of the same HTML constructs. The parent variables will also be available in the included templates, but should you require it, you can also pass new variables to it by using the second optional parameter for $this->inc.



:file:`templates/sub.inc.php`

.. code-block:: php

  <div>I am included but i can still access the parents variables!</div>
  <?php p($_['name']); ?>

To access the Template files in your controller, use the TemplateResponse class:

.. code-block:: php

  <?php
  use \OCA\AppFramework\Http\TemplateResponse as TemplateResponse

  // ...

  // in your controller

  public function index(){

    // main is the template name. Owncloud will look for template/main.php
    $response = new TemplateResponse($this->api, 'main');

    $params = array('templateVar' => 1);
    $response->setParams($params);

    return $response;
  }
  ?>


**For more info, see** :doc:`templates`


JavaScript and CSS
------------------
JavaScript files go to the **js/** directory, CSS files to the **css/** directory. They are both minified in production and must therefore be declared in your controller method.

To add a script in your controller method, use the controller's **addScript** and **addStyle** methods.

.. code-block:: php

  <?php

  // in your controller
  public function index(){
  		
  	// adds the js/admin.js file
	$this->api->addScript('admin');

	// adds the css/admin.css file
	$this->api->addStyle('admin');

	// etc
  }

  ?>

If you have to include an image in your CSS, use %appswebroot% and %webroot% for creating absolute paths to your image, for instance:


.. code-block:: css

  .folder > .title {
      background-image: url('%webroot%/core/img/places/folder.svg');
  }


Unittests
---------
.. note:: App Unittests should **not depend on a running ownCloud instance**! They should be able to run in isolation. To achieve that, abstract the ownCloud core functions and static methods in the appframework :file:`core/api.php` and use a mock for testing. If a class is not static, you can simply add it in the :file:`dependencyinjection/dicontainer.php`

.. note:: Also use your app's namespace in your test classes to avoid possible conflicts when the test is run on the buildserver

Unittests go into your **tests/** directory. Create the same folder structure in the tests directory like on your app to make it easier to find tests for certain classes.

Owncloud uses `PHPUnit <http://www.phpunit.de/manual/current/en/>`_

Because of Dependency Injection, unittesting has become very easy: you can easily substitute complex classes with `mocks <http://www.phpunit.de/manual/3.0/en/mock-objects.html>`_ by simply passing a different object to the constructor.

Also using a container like Pimple frees us from doing complex instantiation and object passing in our application by hand.


A simple test for a controller would look like this:


:file:`tests/controllers/ItemControllerTest.php`

.. code-block:: php

  <?php
  namespace OCA\AppTemplateAdvanced;

  use OCA\AppFramework\Http\Request as Request;
  use OCA\AppFramework\Db\DoesNotExistException as DoesNotExistException;
  use OCA\AppFramework\Utility\ControllerTestUtility as ControllerTestUtility;


  require_once(__DIR__ . "/../classloader.php");


  class ItemControllerTest extends ControllerTestUtility {


    public function testSetSystemValue(){
      $post = array('somesetting' => 'this is a test');
      $request = new Request(array(), $post);

      // create an api mock object
      $api = $this->getAPIMock();

      // expects to be called once with the method
      // setSystemValue('somesetting', 'this is a test')
      $api->expects($this->once())
            ->method('setSystemValue')
            ->with( $this->equalTo('somesetting'),
                $this->equalTo('this is a test'));

      // we want to return the appname apptemplateadvanced when this method
      // is being called
      $api->expects($this->any())
            ->method('getAppName')
            ->will($this->returnValue('apptemplateadvanced'));

      $controller = new ItemController($api, $request, null);
      $response = $controller->setSystemValue(null);

      // check if the correct parameters of the json response are set
      $this->assertEquals($post, $response->getParams());
    }


  }

You can now execute the test by running this in your app directory::

  phpunit tests/

.. note:: PHPUnit executes all PHP Files that end with **Test.php**. Be sure to consider that in your file naming.

The apptemplateadvanced provides an own classloader :file:`tests/classloader.php` that loads the the classes.

More examples for testing controllers are in the :file:`tests/controller/ItemControllerTest.php`

**See also** :doc:`unit-testing`


Middleware
----------
Middleware is logic that is run before and after each request. It offers the following hooks:

* **beforeController**: This is executed before a controller method is being executed. This allows you to plug additional checks or logic before that method, like for instance security checks
* **afterException**: This is being run when either the beforeController method or the controller method itself is throwing an exception. The middleware is asked in reverse order to handle the exception and to return a response. If the response is null, it is assumed that the exception could not be handled and the error will be thrown again
* **afterController**: This is being run after a successful controllermethod call and allows the manipulation of a Response object. The middleware is run in reverse order
* **beforeOutput**: This is being run after the response object has been rendered and allows the manipulation of the outputted text. The middleware is run in reverse order

To generate your own middleware, simply inherit from the Middleware class and overwrite the methods that you want to use.

.. note:: Some hooks need to return a result, for instance the beforeOutput hook needs to return the text that is printed to the page. Check the Middleware class documentation in the appframework :file:`middleware/middleware.php` for more information



.. code-block:: php

  <?php

  use \OCA\AppFramework\Middleware\Middleware as Middleware;


  class CensorMiddleware extends Middleware {

    private $api;

    /**
     * @param API $api: an instance of the api
     */
    public function __construct($api){
      $this->api = $api;
    }


    /**
     * @brief this replaces "fuck" with "****"" in the output
     */
    public function beforeOutput($controller, $methodName, $output){
      return str_replace($output, 'fuck', '****');
    }

  }

To activate the middleware, you have to overwrite the parent MiddlewareDispatcher and wire your middleware into the DIContainer constructor:

.. note:: If you ship your own middleware, be sure to also enable the existing ones if you overwrite the MiddlewareDispatcher in the Dependency Injection Container!

.. code-block:: php

  <?php

    // in the constructor

    $this['CensorMiddleware'] = function($c){
      return new CensorMiddleware($c['API']);
    };

    $this['MiddlewareDispatcher'] = function($c){
      $dispatcher = new \OCA\AppFramework\Middleware\MiddlewareDispatcher();
      $dispatcher->registerMiddleware($c['SecurityMiddleware']);
      $dispatcher->registerMiddleware($c['CensorMiddleware']);
      return $dispatcher;
    };

.. note::

  The order is important! The middleware that is registered first gets run first in the beforeController method. For all other hooks, the order is being reversed, meaning: if something is defined first, it gets run last.

Publish your app
----------------
At `apps.owncloud.com <https://apps.owncloud.com>`_ for other ownCloud users
