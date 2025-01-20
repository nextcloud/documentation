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
This is explicitly not about :ref:`HTML template responses <controller_html_responses>`.

State-of-the-Art methods and comparison
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following combinations of attributes might be relevant for various scenarios:

#. Plain frontend route: ``Controller`` class
#. OCS route: ``OCSController`` class
#. OCS route with CORS enabled: ``OCSController`` class and ``#[CORS]`` attribute on the method

.. warning::
  Adding the ``#[NoCRSFRequired]`` attribute imposes a security risk.
  You should not add this to your controller methods unless you understand the implications and be sure that you absolutely need the attribute.
  Typically, you can instead use the ``OCS-APIRequest`` header for data requests, instead.

.. warning::
  Adding the attribute ``#[CORS]`` alone is not sufficient to allow access using CORS with plain frontend routes.
  Without further measures, the CSRF checker would fail.
  So, enabling CORS for plain controllers is generally and highly discouraged.

  You would have to disable the CSRF checker (one more security risk) or use the ``OCP-APIRequest`` header to successfully pass the checker.
  The latter requires dedicated JS code on the importing page.

There are different ways a clients might interact with your APIs.
These ways depend on your API configuration (what you allow) and on which route the request is finally made.

- *Access from web frontend* means the user is browses the Nextcloud web frontend with a browser.
- *Access from an external app* indicates that the user is not using the normal browser (as logged in) but directly navigates a certain URL directly.
  This is typically an external program (like an Android app or simply a curl command line).
- *Access from external website* means that the user browses some third party web site and data from your Nextcloud server appears.
  The other website has to embed/load/use images, JSON data, or other resources from a URL pointing to the Nextcloud server, to be able to do this.

.. hint::
    The discussion here is for data requests only.
    If you think of controller :ref:`methods serving (HTML) templates <controller_html_responses>`, disabling CSRF is considered fine.

.. list-table:: Comparison of different API types
    :header-rows: 1
    :align: center

    * - Description
      - ``Controller`` class
      - ``OCSController`` class
      - ``OCSController`` class & ``CORS`` on method
    * - URL prefix (relative to server)
      - ``/apps/<appid>/``
      - ``/ocs/v2.php/apps/<appid>/``
      - ``/ocs/v2.php/apps/<appid>/``
    * - Access from web frontend
      - yes
      - yes
      - yes
    * - Access from external app
      - partial [#]_
      - yes
      - yes
    * - Access from external website
      - ---
      - ---
      - yes
    * - Encapsulated data
      - no
      - yes (JSON or XML)
      - yes (JSON or XML)

.. [#] The external app has to satisfy the CSRF checks.
       That is, you need to have the ``OCS-APIRequest`` HTTP request header set to ``true``.
       This is only possible for NC 30 onwards, older versions do not respect the header.

Methods from ``Controller`` classes can return ``DataResponse`` objects similar to ``OCSController`` class methods.
For methods of a ``Controller`` class, the data of this response is sent e.g. as JSON as you provide it.
Basically, the output is very similar to what ``json_encode`` would do.
In contrast, the OCS controller will encapsulate the data in an outer shell that provides some more (meta) information.
For example a status code (similar to the HTTP status code) is transmitted at top level.
The actual data is transmitted in the ``data`` property.

As a rule of thumb one can conclude that OCS provides a good way to handle most use cases including sufficient security checks.
The only exception to this is if you want to provide an API for external usage where you have to comply with an externally defined API scheme.
Here, the encapsulation introduced in OCS and CSRF checks might be in your way.


Historical options
~~~~~~~~~~~~~~~~~~

.. deprecated:: 30
  The information in this section are mainly for reference purposes. Do not use the approaches in new code.

Before NC server 30 the plain ``Controller`` classes' methods did not respect the ``OCS-APIRequest`` header.
Thus, to provide access to this type of controller methods for external apps, it was necessary to use the ``#[NoCSRFRequired]`` attribute (or the corresponding ``@NoCSRFRequired`` annotation).

The following combinations of attributes were relevant for various scenarios:

#. Plain frontend route: ``Controller`` class
#. Plain frontend with CRSF checks disabled: ``Controller`` class and ``#[NoCSRFRequired]`` attribute on the method
#. Plain frontend route with CORS enabled: ``Controller`` class and ``#[CORS]`` and ``#[NoCSRFRequired]`` attributes on the route
#. OCS route: ``OCSController`` class
#. OCS route with CORS enabled: ``OCSController`` class and ``#[CORS]`` attribute on the method

.. hint::
  The two scenarios involving the ``OCSController`` have not changed and, thus, the state-of-the-art documentation as noted above still holds true.
  Thus, these options are not reconsidered here again for simplicity reasons and to get the overall view more crisp.

  The warnings about not using ``NoCSRFRequired`` and ``CORS`` as mentioned in the state-of-the-art section holds true here as well.

.. list-table:: Comparison of different API types
    :header-rows: 1
    :align: center

    * - | Description
      - | ``Controller`` class
      - | ``Controller`` class with
        | ``NoCSRFRequired`` on method
      - | ``Controller`` class with
        | ``NoCSRFRequired`` and ``CORS``
        | on method
    * - URL prefix (relative to server)
      - ``/apps/<appid>/``
      - ``/apps/<appid>/``
      - ``/apps/<appid>/``
    * - Access from web frontend
      - yes
      - yes (CSRF risk)
      - yes (CSRF risk)
    * - Access from external app
      - ---
      - yes
      - yes
    * - Access from external website
      - ---
      - ---
      - yes
    * - Encapsulated data
      - no
      - no
      - no
