.. _rest-apis:

=========
REST APIs
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Offering a RESTful API is not different from creating a :doc:`route <../basics/routing>` and :doc:`controllers <../basics/controllers>` for the web interface.
It is recommended though to inherit from ApiController and add **@CORS** annotations to the methods so that `web applications will also be able to access the API <https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`_.

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


Keep in mind that multiple apps will likely depend on the API interface once it is published and they will move at different speeds to react to changes implemented in the API.
Therefore it is recommended to version the API in the URL to not break existing apps when backwards incompatible changes are introduced::

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

.. _ocs-vs-rest:

Relation of REST and OCS
------------------------

There is a close relationship between REST APIs and :ref:`OCS <ocscontroller>`.
Both provide a way to transmit data between the backend of the app in the Nextcloud server and some frontend.

The following combinations of attributes might be useful for various scenarios:

#. Plain frontend route: No special attribute related to CSRF or CORS
#. Plain Frontend with CRSF checks disabled: Add the ``#[NoCSRFRequired]`` attribute
#. REST route with CORS enabled: Add the ``#[CORS]`` attribute
#. OCS-based route

There are different ways a clients might interact with your APIs.
These ways depend on your API configuration (what you allow) and on which route the request is finally made.

- *Access from web frontend* means the user is browses the Nextcloud web frontend with a browser.
- *Access from an external app* indicates that the user is not using the normal browser (as logged in) but directly navigates a certain URL.
  This can be in a browser tab or an external program (like an Android app or simply a curl command line).
- *Access from external website* means that the user browses some third party web site and *magically* data from your app appears.
  Technically, the other website would embed/load/use images, JSON data, or other resources from a URL pointing to the Nextcloud server.

.. list-table:: Comparision of different API types
    :header-rows: 1
    :align: center

    * - Description
      - 1 (plain)
      - 2 (no CSRF)
      - 3 (CORS)
      - 4 (OCS)
    * - URL prefix (relative to server)
      - ``/apps/<appid>/``
      - ``/apps/<appid>/``
      - ``/apps/<appid>/``
      - ``/ocs/v2.php/apps/<appid>/``
    * - Access from web frontend
      - yes
      - yes (CSRF risk)
      - yes (CSRF risk)
      - yes
    * - Access from external app
      - --- (CSRF protection blocks)
      - yes
      - yes
      - yes
    * - Access from external web page
      - ---
      - ---
      - yes
      - yes
    * - Transmitted data type
      - plain data
      - plain data
      - plain data
      - encapsulated data

As a rule of thumb one can conclude that OCS provides a good way to handle most use cases.
The only exception to this is if you want to provide an API for external usage where you have to comply with an externally defined API scheme.
Here, the encapsulation introduced in OCS might be in your way.
