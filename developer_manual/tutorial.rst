App Tutorial
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `mailing list <https://mail.kde.org/mailman/listinfo/owncloud>`_ so other contributors might join in.


Getting Started
---------------
To get started you'll need to clone the basic git repositories into your web directory. Depending on your distro this will either be :file:`/var/www or` :file:`/srv/http`

.. code-block:: bash
  
  sudo chmod a+rw /var/www  # only do this on your dev machine!
  cd /var/www
  git clone https://github.com/owncloud/core.git owncloud
  git clone https://github.com/owncloud/apps.git apps
  git clone https://github.com/owncloud/3rdparty.git 3rdparty

Now restart your apache server and get ready to set up owncloud at http://localhost/owncloud


Enable debugging mode
---------------------
To disable JavaScript and CSS caching you'll have to turn on debugging in :file:`/var/www/owncloud/config/config.php` by adding this to the end of the file::

  DEFINE('DEBUG', true);


Create your app
---------------
The best way to create your application is to simply modify the apptemplate app.

To do that execute:

.. code-block:: bash

  cd /var/www/apps
  sudo cp -r apptemplate yourappname
  sudo chown -R youruser:yourgroup yourappname

To enable your app, simply link it into the apps directory:


.. code-block:: bash

  ln -s /var/www/apps/yourappname /var/www/owncloud/apps/yourappname

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
* **\\OC_App::getAppPath('apptemplate')** to **\\OC_App::getAppPath('yourappname')**
* **namespace OCA\\AppTemplate** to **namespace OCA\\YourAppName**
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

An instance of the api is passed via dependency injection, the same goes for a Request instance. POST and GET parameters are abstracted by the Request class and can be accessed via **$this->params('myPostOrGetKey')** inside the controller. This has been done to make the app better testable.

.. note:: If a POST and GET value exist with the same key, the POST value is preferred. You should avoid to have both values with the same key though.

Every controller method has to return a response. All possible reponses can be found in :file:`lib/response.php`. The file contains wrappers for Ownclouds internal template engine and JSON response and is used to create a uniform response object which is testable.

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
ownCloud uses a database abstraction layer on top of either MDB2 or PDO, depending on the availability of PDO on the server.

Apps should always use prepared statements when accessing the database as seen in the following example:

.. code-block:: php

  <?php
  $userId = 'tom';
  $query = \OC_DB::prepare("SELECT * FROM *PREFIX*mytable WHERE user = ?");
  $result = $query->execute(array($userId));
  $data = $result->fetchAll();
  ?>


'*PREFIX*' in the query string will be replaced by the configured database table prefix while preparing the query. Arguments for the prepared statement are denoted by a '?' in the query string and passed during execution in an array.

For more information about MDB2 style prepared statements, please see the `official MDB2 documentation <http://pear.php.net/package/MDB2/docs>`_

If an app requires additional tables in the database they can be automatically created and updated by specifying them inside :file:`appinfo/database.xml` using MDB2's xml scheme notation where the placeholders '*dbprefix*' and '*dbname*' can be used for the configured database table prefix and database name. 

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
				<name>item_id</name>
				<type>integer</type>
				<default>0</default>
				<notnull>true</notnull>
    				<autoincrement>1</autoincrement>
				<length>4</length>
			</field>
			<field>
				<name>uid_owner</name>
				<type>text</type>
				<notnull>true</notnull>
				<length>64</length>
			</field>
			<field>
				<name>item_name</name>
				<type>text</type>
				<notnull>true</notnull>
				<length>100</length>
			</field>
			<field>
				<name>item_path</name>
				<type>clob</type>
				<notnull>true</notnull>
			</field>
		</declaration>
	</table>
  </database>


To update the tables used by the app, simply adjust the database.xml file and increase the app version number in :file:`appinfo/version` to trigger an update.



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

The first argument is the name of your route. This is used to get the URL of the route, for instance in your Javascript code. 

The second parameter is the URL which should be matched. You can extract values from the URL by using **{KEY}** in the section that you want to get. That value is then available under **$params['KEY']**, for the above example it would be **$params['value']**. 

The $params array is always passed to your controllermethod as the only parameter.

You can also limit the route to GET or POST requests by simply adding ->post() or ->get() before the action method like:

.. code-block:: php

  <?php
  $this->create('yourappname_routename', '/myurl/{value}')->post()->action(
	function($params){		
		callAjaxController('MyController', 'methodName', $params);
	}
  );
  ?>

.. warning:: Dont forget to use callAjaxController() for Ajax requests!

In JavaScript you can call the routes like this:

.. code-block:: javascript

  var params = {value: 'hi'};
  var url = OC.Router.generate('yourappname_routename', params);
  console.log(url); // prints /index.php//yourappname/myurl/hi

.. note:: Be sure to only use the routes generator after the routes are loaded. This can be done by registering a callback with OC.Router.registerLoadedCallback(callback)

You can also omit the second generate function parameter if you dont extract any values from the URL at all.


**See also:** :doc:`routing`


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


Templates
---------
Templates reside in the **template/** folder. To use them in your controller, use the TemplateResponse class, for instance

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


Publish your app
----------------
At `apps.owncloud.com <https://apps.owncloud.com>`_ for other ownCloud users