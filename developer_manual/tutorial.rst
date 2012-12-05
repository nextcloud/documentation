App Tutorial
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `mailing list <https://mail.kde.org/mailman/listinfo/owncloud>`_ so other contributors might join in.


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
The best way to create your application is to simply modify the `apptemplate_advanced app <https://github.com/owncloud/apps/tree/master/apptemplate_advanced>`_.

To do that execute:

.. code-block:: bash

  cd /var/www/apps
  sudo cp -r apptemplate_advanced yourappname
  sudo chown -R youruser:yourgroup yourappname

To enable your app, simply link it into the apps directory:


.. code-block:: bash

  sudo ln -s /var/www/apps/yourappname /var/www/owncloud/apps/yourappname

or create a second apps directory in your :file:`/var/www/owncloud/config/config.php` (see :doc:`configfile`)

**Don't forget to enable it on the apps settings page!**

Now change into your app directory::

  cd /var/www/apps/yourappname


Adjust apptemplate
------------------------------------------
Certain things are still apptemplate specific and you will have to convert them to match your app.

.. todo::

  Provide some sed commands for simple transformation

The following things will need to be changed:

* AGPL Header: author and copyright
* **\\OC_App::getAppPath('apptemplate_advanced')** to **\\OC_App::getAppPath('yourappname')**
* **namespace OCA\\AppTemplateAdvanced** to **namespace OCA\\YourAppName**
* The Classpaths in :file:`appinfo/bootstrap.php`


App information
---------------
You'll need to give some information on your app for instance the name. To do that open the :file:`appinfo/app.php` and adjust it like this

.. code-block:: php

  <?php

  require_once \OC_App::getAppPath('yourappname') . '/appinfo/bootstrap.php';

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
  </info>


Classloader
-----------
The classloader is configured in :file:`appinfo/bootstrap.php`. The classloader frees you from requiring your classes when you use them. If a class is used and its not yet available, the loader will automatically include the needed file.

To add a class to the classloader, simply use something like this:

.. code-block:: php

  <?php
  // loads the class MyClass from the file folder/myclass.php
  \OC::$CLASSPATH['OCA\YourAppName\MyClass'] = 'apps/yourappname/folder/myclass.php';
  ?>


Dependency Injection
--------------------
Dependency Injection helps you to create testable code. A good overview over how it works and what the benefits are can be seen on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

The container is configured in :file:`appinfo/bootstrap.php`. We use Pimple for the container. The documentation on how to use it can be seen on the `Pimple Homepage <http://pimple.sensiolabs.org/>`_

To add your own class simply add a new line inside the **createDIContainer** function:

.. code-block:: php

  <?php
  
  $container['MyClass'] = function($c){
      return new MyClass($c['SomeOtherClass']);
  };

  ?>


API abstraction layer
---------------------
Owncloud currently has a ton of static methods which is a very bad thing concerning testability. Therefore the app template comes with an api abstraction layer which is located at :file:`lib/api.php`.

If you find yourself in need to use more Owncloud internal static methods, add them to the api layer by simply creating a new method for each of them, like:

.. code-block:: php

  <?php

      // inside the API class

      public function methodName($someParam){
         \OCP\Util::methodName($this->appName, $someParam);
      }
  ?>

This will allow you to easily mock the API in your unittests.

.. note:: This will eventually be replaced with an internal Owncloud API layer.



Routes
------
Routing connects your URL with your controller methods and allows you to create constant and nice URLs. Its also easy to extract values from the URL.

Owncloud uses `Symphony Routing <http://symfony.com/doc/2.0/book/routing.html>`_

Routes are declared in :file:`appinfo/routes.php`

A simple route would look like this:

.. code-block:: php

  <?php
  $this->create('yourappname_routename', '/myurl/{value}')->action(
      function($params){
          callController('MyController', 'methodName', $params);
      }
  );
  ?>

The first argument is the name of your route. This is used to get the URL of the route. This is a nice way to generate the URL in your templates or JavaScript for certain links since it does not force you to hardcode your URLs. To use it in templates, use:

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

The $params array is always passed to your controllermethod as the only parameter.

You can also limit the route to GET or POST requests by simply adding **->post()** or **->get()** before the action method like:

.. code-block:: php

  <?php
  $this->create('yourappname_routename', '/myurl/{value}')->post()->action(
      function($params){
          callAjaxController('MyController', 'methodName', $params);
      }
  );
  ?>

.. warning:: Dont forget to use callAjaxController() for Ajax requests! The function turns on CSRF checks by default

If you want to disable/enable security checks or simply swap stuff in the container, you can do it by passing a container as the fourth parameter of **callController** or callAjaxController.

The following example turns off the CSRF check for callAjaxController (but runs all the other checks, see :file:`lib/security.php`)

.. code-block:: php

  <?php
  $this->create('yourappname_routename', '/myurl/{value}')->post()->action(
      function($params){
          $container = createDIContainer();
          $container['Security']->setCSRFCheck(false);
          callAjaxController('MyController', 'methodName', $params, $container);
      }
  );
  ?>

This works because the Security class is set as shared in the DI container. Non shared classes in the container return a new instance everytime they're called and would make this approach useless.

To still get the desired function, you'll have to overwrite the value by setting a new class with the same index which is set as shared.


**See also:** :doc:`routing`


Controllers
-----------
The App Template provides a simple baseclass for adding controllers. Controllers connect your view (templates) with your database. Controllers themselves are connected to one or more routes.

The apptemplate comes with several different controllers. A simple controller would look like:

.. code-block:: php

  <?php
  
  namespace OCA\YourApp;


  class MyController extends Controller {
	

	/**
	 * @param Request $request: an instance of the request
	 * @param API $api: an api wrapper instance
	 */
	public function __construct($api, $request){
		parent::__construct($api, $request);
	}


	/**
	 * @brief sets a global system value 
	 * @param array $urlParams: an array with the values, which were matched in 
	 *                          the routes file
	 */
	public function myControllerMethod($urlParams=array()){
		$value = $this->params('somesetting');
		
		$response = new JSONResponse($this->appName);
		$response->setParams(array('value' => $value));
		return $response;
	}

  }

  ?>

An instance of the api is passed via dependency injection, the same goes for a Request instance. POST and GET, and FILES parameters are abstracted by the Request class and can be accessed via **$this->params('myPostOrGetKey')** and **$this->getUploadedFile($key)** inside the controller. This has been done to make the app better testable.

.. note:: If a POST and GET value exist with the same key, the POST value is preferred. You should avoid to have both values with the same key though.

Every controller method has to return a Response object. All possible reponses can be found in :file:`lib/response.php`. Should you require to set additional headers, you can use the **addHeader()** method that every Reponse has.

Because TemplateResponse and JSONResponse is so common, the controller provides a shortcut method for both of those, named **$this->render** and **$this->renderJSON**.

.. code-block:: php

  <?
  // using render()
  public function index($urlParams=array()){
      $templateName = 'main';
      $params = array(
          'somesetting' => 'How long will it take'
      );

      return $this->render($templateName, $params);
  }


  // using renderJSON
  public function getMeJSON($urlParams=array()){
      $params = array(
          'somesetting' => 'enough of this already'
      );

      return $this->renderJSON($params);
  }



Don't forget to add your controller to the dependency container in :file:`appinfo/bootstrap.php` 

.. code-block:: php

  <?php

  // in the createDIContainer function

  $container['MyController'] = function($c){
      return new MyController($c['API'], $c['Request']);
  };

  ?>

and to the classloader

.. code-block:: php

  <?php
  \OC::$CLASSPATH['OCA\YourAppName\MyController'] = 'apps/yourappname/controllers/my.controller.php';
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


Your database layer should go into the **database/** folder. It's recommended to split your data entities from your database queries. You can do that by creating a very simple PHP object with getters and setters:

:file:`database/item.php`

.. code-block:: php

  <?php
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


All database queries for that object should be put into a wrapper class. The wrapper class could look like this (more method examples are in the advanced_apptemplate):

:file:`database/item.wrapper.php`

.. code-block:: php

  <?php
  class ItemMapper extends Mapper {


      private $tableName;

      /**
       * @param API $api: Instance of the API abstraction layer
       */
      public function __construct($api){
          parent::__construct($api);
          $this->tableName = '*PREFIX*apptemplate_advanced_items';
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
 . . versionchanged:: 5.0

  To prevent XSS the following PHP **functions for printing are forbidden: echo, print() and <?=**. Instead use ``p($data)`` for printing your values. Should you require unescaped printing, **double check for XSS** and use: ``print_unescaped($data)``.

Templates can also include other templates by using the **$this->inc('templateName')** method. Use this if you find yourself repeating a lot of the same HTML constructs. The parent variables will also be available in the included templates, but should you require it, you can also pass new variables to it by using the second optional parameter for $this->inc.



:file:`templates/sub.inc.php`

.. code-block:: php

  <div>I am included but i can still access the parents variables!</div>
  <?php p($_['name']); ?>

To access the Template files in your controller, use the TemplateResponse class:

.. code-block:: php

  <?php
  // in your controller

  public function index($urlParams=array()){

    // main is the template name. Owncloud will look for template/main.php
    $response = new TemplateResponse($this->appName, 'main');

    $params = array('templateVar' => 1);
    $response->setParams($params);

    return $response;
  }
  ?>

Should you require more template functions, simply modify the TemplateResponse in :file:`lib/response.php`. 

**For more info, see** :doc:`templates`


JavaScript and CSS
------------------
JavaScript files go to the **js/** directory, CSS files to the **css/** directory. They are both minified in production and must therefore be declared in your controller method.

To add a script in your controller method, use the controller's **addScript** and **addStyle** methods.

.. code-block:: php

  <?php

  // in your controller
  public function index($urlParams=array()){
  		
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
.. note:: App Unittests should **not depend on a running ownCloud instance**! They should be able to run in isolation. To achieve that, abstract the ownCloud core functions in the :file:`lib/api.php` and use a mock for testing. 

.. note:: Also use your app's namespace in your test classes to avoid possible conflicts when the test is run on the buildserver

Unittests go into your **tests/** directory. Create the same folder structure in the tests directory like on your app to make it easier to find tests for certain classes.

Owncloud uses `PHPUnit <http://www.phpunit.de/manual/current/en/>`_

Because of Dependency Injection, unittesting has become very easy: you can easily substitute complex classes with mocks by simply passing a different object to the constructor.

Also using a container like Pimple frees us from doing complex instantiation and object passing in our application by hand.


A simple test for a controller would look like this:


:file:`tests/controllers/AjaxControllerTest.php`

.. code-block:: php

  <?php
  namespace OCA\AppTemplateAdvanced;

  // get abspath of file directory
  $path = realpath( dirname( __FILE__ ) ) . '/';

  require_once($path . "../../lib/request.php");
  require_once($path . "../../lib/response.php");
  require_once($path . "../../lib/controller.php");
  require_once($path . "../../controllers/ajax.controller.php");

  require_once($path . "../mocks/api.mock.php");


  class AjaxControllerTest extends \PHPUnit_Framework_TestCase {


      public function testSetSystemValue(){
          $post = array('somesetting' => 'this is a test');
          $request = new Request(null, $post);
          $api = new APIMock();

          $controller = new AjaxController($api, $request);
          $controller->setSystemValue();

          $this->assertEquals($post['somesetting'], $api->setSystemValueData['somesetting']);
      }


  }


This test uses a mock of the API class. You can define the behaviour of the class in an own file:

:file:`tests/mocks/api.mock.php`

.. code-block:: php

  <?php
  namespace OCA\AppTemplateAdvanced;


  class APIMock {

      public $setSystemValueData;

      public function __construct(){
          $this->setSystemValueData = array();
      }


      public function getAppName(){
          return 'apptemplate_advanced';
      }


      public function setSystemValue($key, $value){
          $this->setSystemValueData[$key] = $value;
      }

  }

You can now execute the test by running this in your app directory::

  phpunit tests/

.. note:: PHPUnit executes all PHP Files that end with **Test.php**. Be sure to consider that in your file naming. Also use **relative require paths** like in the example to include the correct files independent for your current path


**See also** :doc:`unittests`

Publish your app
----------------
At `apps.owncloud.com <https://apps.owncloud.com>`_ for other ownCloud users