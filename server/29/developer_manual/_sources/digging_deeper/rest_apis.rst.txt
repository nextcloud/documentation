.. _rest-apis:

=========
REST APIs
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Offering a RESTful API is not different from creating a :doc:`route <../basics/routing>` and :doc:`controllers <../basics/controllers>` for the web interface. It is recommended though to inherit from ApiController and add **@CORS** annotations to the methods so that `web applications will also be able to access the API <https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`_.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\ApiController;
    use OCP\AppFramework\Http\Attribute\CORS;
    use OCP\IRequest;

    class AuthorApiController extends ApiController {

        public function __construct($appName, IRequest $request) {
            parent::__construct($appName, $request);
        }

        #[CORS]
        public function index() {

        }

    }

CORS also needs a separate URL for the preflighted **OPTIONS** request that can easily be added by adding the following route:

.. code-block:: php

    <?php
    // appinfo/routes.php
    array(
        'name' => 'author_api#preflighted_cors',
        'url' => '/api/1.0/{path}',
        'verb' => 'OPTIONS',
        'requirements' => array('path' => '.+')
    )


Keep in mind that multiple apps will likely depend on the API interface once it is published and they will move at different speeds to react to changes implemented in the API. Therefore it is recommended to version the API in the URL to not break existing apps when backwards incompatible changes are introduced::

    /index.php/apps/myapp/api/1.0/resource

Modifying the CORS headers
--------------------------

By default the following values will be used for the preflighted OPTIONS request:

* **Access-Control-Allow-Methods**: 'PUT, POST, GET, DELETE, PATCH'
* **Access-Control-Allow-Headers**: 'Authorization, Content-Type, Accept'
* **Access-Control-Max-Age**: 1728000

To add an additional method or header or allow less headers, simply pass additional values to the parent constructor:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use \OCP\AppFramework\ApiController;
    use \OCP\IRequest;

    class AuthorApiController extends ApiController {

        public function __construct($appName, IRequest $request) {
            parent::__construct(
                $appName,
                $request,
                'PUT, POST, GET, DELETE, PATCH',
                'Authorization, Content-Type, Accept',
                1728000);
        }

    }
