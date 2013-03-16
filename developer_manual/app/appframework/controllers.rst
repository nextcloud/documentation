Controllers
===========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

The App Framework provides a simple baseclass for adding controllers: :php:class:`OCA\\AppFramework\\Controller\\Controller`. Controllers connect your view (templates) with your database. Controllers themselves are connected to one or more routes. Controllers go into the **controller/** directory.

A controller should be created for each resource. Think of it as an URL scheme::

  /controller/method/params

For instance::

  /file/delete/1

In this case we would create a controller named **FileController** and the method would be called **delete()**.


The apptemplate comes with several different controllers. A simple controller would look like:

.. code-block:: php

  <?php

  namespace OCA\YourApp\Controller;

  use \OCA\AppFramework\Controller\Controller;
  use \OCA\AppFramework\Http\JSONResponse;


  class MyController extends Controller {


      /**
       * @param Request $request an instance of the request
       * @param API $api an api wrapper instance
       */
      public function __construct($api, $request){
          parent::__construct($api, $request);
      }


      /**
       * @Ajax
       *
       * sets a global system value
       */
      public function myControllerMethod(){
          $value = $this->params('somesetting');

          $response = new JSONResponse();
          $response->setParams(array('value' => $value));
          return $response;
      }

  }

  ?>

An instance of the API is passed via :doc:`../general/dependencyinjection`, the same goes for a :php:class:`OCA\\AppFramework\\Http\\Request` instance. URL Parameters, POST, GET and FILES parameters are partly  abstracted by the Request class and can be accessed via **$this->params('myURLParamOrPostOrGetKey')** and **$this->getUploadedFile($key)** inside the controller. This has been done to make the app better testable.

.. note:: If an URL Parameter, POST or GET value exist with the same key, the URL Parameter is preferred over the POST parameter and the POST parameter is preferred over the GET parameter. You should avoid this scenario though.

If you want to get variables from env variables, use **$this->env($key)** and for session variables, use **$this->session($key)**.

Every controller method has to return a Response object. The currently available Responses from the App Framework include:

* :php:class:`OCA\\AppFramework\\Http\\Response`: response for sending headers only
* :php:class:`OCA\\AppFramework\\Http\\JSONResponse`: sends JSON to the client
* :php:class:`OCA\\AppFramework\\Http\\TemplateResponse`: renders a template
* :php:class:`OCA\\AppFramework\\Http\\RedirectResponse`: redirects to a new URL
* :php:class:`OCA\\AppFramework\\Http\\TextDownloadResponse`: prompts the user to download a text file containing a passed string
* :php:class:`OCA\\AppFramework\\Http\\TextResponse`: for printing text like XML

.. versionchanged:: 6.0

* :php:class:`OCA\\AppFramework\\Http\\ForbiddenResponse`: returns 403 Forbidden HTTP status
* :php:class:`OCA\\AppFramework\\Http\\NotFoundResponse`: returns 404 Not Found HTTP status

Should you require to set additional headers, you can use the :php:meth:`OCA\\AppFramework\\Http\\Response::addHeader` method that every Response has.

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
