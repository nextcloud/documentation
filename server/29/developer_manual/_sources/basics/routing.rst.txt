=======
Routing
=======

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Routes map a URL and a method to a controller method. Routes are defined inside :file:`appinfo/routes.php` by returning them as an array:

.. code-block:: php

    <?php
    return [
        'routes' => [
            ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
        ],
    ];

.. versionadded:: 29

You can also use attributes on the Controller method to define routes.
They support all the same parameters (except for ``name`` which is not needed).
``FrontpageRoute`` has to be used for routes that were in the ``routes`` section and ``ApiRoute`` has to be used for routes that were in the ``ocs`` section.

.. code-block:: php

    #[FrontpageRoute(verb: 'GET', url: '/')]

    #[ApiRoute(verb: 'GET', url: '/')]

The route array contains the following parts:

* **url**: The URL that is matched after */index.php/apps/myapp*
* **name**: The controller and the method to call; *page#index* is being mapped to *PageController->index()*, *articles_api#drop_latest* would be mapped to *ArticlesApiController->dropLatest()*. The controller in the example above would be stored in :file:`lib/Controller/PageController.php`. This parameter is not needed for the attributes.
* **verb** (Optional, defaults to GET): The HTTP method that should be matched, (e.g. GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH)
* **requirements** (Optional): lets you match and extract URLs that have slashes in them (see :ref:`matching-suburls`)
* **postfix** (Optional): lets you define a route id postfix. Since each route name will be transformed to a route id (**page#method** -> **myapp.page.method**) and the route id can only exist once you can use the postfix option to alter the route id creation by adding a string to the route id, e.g., **'name' => 'page#method', 'postfix' => 'test'** will yield the route id **myapp.page.methodtest**. This makes it possible to add more than one route/URL for a controller method
* **defaults** (Optional): If this setting is given, a default value will be assumed for each URL parameter which is not present. The default values are passed in as a key => value pair array

Extracting values from the URL
------------------------------

It is possible to extract values from the URL to allow RESTful URL design. To extract a value, you have to wrap it inside curly braces:

.. code-block:: php

    <?php

    // Request: GET /index.php/apps/myapp/authors/3

    // appinfo/routes.php
    ['name' => 'author#show', 'url' => '/authors/{id}', 'verb' => 'GET'],

    // controller/authorcontroller.php
    class AuthorController {
        public function show(string $id): Response {
            // $id is '3'
        }
    }

The identifier used inside the route is being passed into controller method by reflecting the method parameters. So basically if you want to get the value **{id}** in your method, you need to add **$id** to your method parameters.

.. _matching-suburls:

Matching subURLs
----------------

Sometimes it is needed to match more than one URL fragment. An example would be to match a request for all URLs that start with **OPTIONS /index.php/apps/myapp/api**. To do this, use the **requirements** parameter in your route which is an array containing pairs of **'key' => 'regex'**:

.. code-block:: php

    <?php

    // Request: OPTIONS /index.php/apps/myapp/api/my/route

    // appinfo/routes.php
    array('name' => 'author_api#cors', 'url' => '/api/{path}', 'verb' => 'OPTIONS',
          'requirements' => array('path' => '.+')),

    // controller/authorapicontroller.php
    class AuthorApiController {
        public function cors(string $path): Response {
            // $path will be 'my/route'
        }
    }

Default values for subURL
-------------------------

Apart from matching requirements, a subURL may also have a default value. Say you want to support pagination (a 'page' parameter) for your **/posts** subURL that displays posts entries list. You may set a default value for the 'page' parameter, that will be used if not already set in the URL. Use the **defaults** parameter in your route which is an array containing pairs of **'urlparameter' => 'defaultvalue'**:

.. code-block:: php

    <?php

    // Request: GET /index.php/app/myapp/post

    // appinfo/routes.php
    array(
        'name'     => 'post#index',
        'url'      => '/post/{page}',
        'verb'     => 'GET',
        'defaults' => array('page' => 1) // this allows same URL as /index.php/myapp/post/1
    ),

    // controller/postcontroller.php
    class PostController {
        public function index(int $page = 1): Response {
            // $page will be 1
        }
    }

Registering resources
---------------------

When dealing with resources, writing routes can become quite repetitive since most of the time routes for the following tasks are needed:

* Get all entries
* Get one entry by id
* Create an entry
* Update an entry
* Delete an entry

To prevent repetition, it's possible to define resources. The following routes:

.. code-block:: php

    <?php
    return [
        'routes' => [
            ['name' => 'author#index', 'url' => '/authors', 'verb' => 'GET'],
            ['name' => 'author#show', 'url' => '/authors/{id}', 'verb' => 'GET'],
            ['name' => 'author#create', 'url' => '/authors', 'verb' => 'POST'],
            ['name' => 'author#update', 'url' => '/authors/{id}', 'verb' => 'PUT'],
            ['name' => 'author#destroy', 'url' => '/authors/{id}', 'verb' => 'DELETE'],
            // your other routes here
        ],
    ];

can be abbreviated by using the **resources** key:

.. code-block:: php

    <?php
    return [
        'resources' => [
            'author' => ['url' => '/authors'],
        ],
        'routes' => [
            // your other routes here
        ],
    ];


Using the URLGenerator
----------------------

Sometimes it is useful to turn a route into a URL to make the code independent from the URL design or to generate a URL for an image in **img/**. Inside the PageController the URL generator can be injected by adding it to the constructor, which will allow to use it to generate a URL for a redirect. For more details on that see the :ref:`dependency-injection` reference.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use \OCP\IRequest;
    use \OCP\IURLGenerator;
    use \OCP\AppFramework\Controller;
    use \OCP\AppFramework\Http\RedirectResponse;

    class PageController extends Controller {

        private $urlGenerator;

        public function __construct(string $appName, IRequest $request,
                                    IURLGenerator $urlGenerator) {
            parent::__construct($appName, $request);
            $this->urlGenerator = $urlGenerator;
        }

        /**
         * Redirects to /apps/news/myapp/authors/3
         */
        public function redirect(): RedirectResponse {
            // route name: author_api#do_something
            // route url: /apps/news/myapp/authors/{id}

            // # needs to be replaced with a . due to limitations and prefixed
            // with your app id
            $route = 'myapp.author_api.do_something';
            $parameters = ['id' => 3];

            $url = $this->urlGenerator->linkToRoute($route, $parameters);

            return new RedirectResponse($url);
        }
    }

URLGenerator is case sensitive, so **appName** must match **exactly** the name you use in :doc:`configuration <../basics/storage/configuration>`.
If you use a CamelCase name as *myCamelCaseApp*,

.. code-block:: php

    <?php
    $route = 'myCamelCaseApp.author_api.do_something';
