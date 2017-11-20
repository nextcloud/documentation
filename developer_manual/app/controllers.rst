===========
Controllers
===========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Controllers are used to connect :doc:`routes <routes>` with app logic. Think of it as callbacks that are executed once a request has come in. Controllers are defined inside the **lib/Controller/** directory.

To create a controller, simply extend the Controller class and create a method that should be executed on a request:


.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;

    class AuthorController extends Controller {

        public function index() {

        }

    }


Connecting a controller and a route
-----------------------------------

To connect a controller and a route the controller has to be registered in the :doc:`container` like this:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use OCP\AppFramework\App;

    use OCA\MyApp\Controller\AuthorApiController;


    class Application extends App {

        public function __construct(array $urlParams=array()){
            parent::__construct('myapp', $urlParams);

            $container = $this->getContainer();

            /**
             * Controllers
             */
            $container->registerService('AuthorApiController', function($c) {
                return new AuthorApiController(
                    $c->query('AppName'),
                    $c->query('Request')
                );
            });
        }
    }

Every controller needs the app name and the request object passed into their parent constructor, which can easily be injected like shown in the example code above. The important part is not the class name but rather the string which is passed in as the first parameter of the **registerService** method.

The other part is the route name. An example route name would look like this::

    author_api#some_method

This name is processed in the following way:

* Remove the underscore and uppercase the next character::

    authorApi#someMethod

* Split at the # and uppercase the first letter of the left part::

    AuthorApi
    someMethod

* Append Controller to the first part::

    AuthorApiController
    someMethod

* Now retrieve the service listed under **AuthorApiController** from the container, look up the parameters of the **someMethod** method in the request, cast them if there are PHPDoc type annotations and execute the **someMethod** method on the controller with those parameters.

Getting request parameters
--------------------------

Parameters can be passed in many ways:

* Extracted from the URL using curly braces like **{key}** inside the URL (see :doc:`routes`)
* Appended to the URL as a GET request (e.g. ?something=true)
* application/x-www-form-urlencoded from a form or jQuery
* application/json from a POST, PATCH or PUT request

All those parameters can easily be accessed by adding them to the controller method:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        // this method will be executed with the id and name parameter taken
        // from the request
        public function doSomething($id, $name) {

        }

    }

It is also possible to set default parameter values by using PHP default method values so common values can be omitted:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        /**
         * @param int $id
         */
        public function doSomething($id, $name='john', $job='author') {
            // GET ?id=3&job=killer
            // $id = 3
            // $name = 'john'
            // $job = 'killer'
        }

    }


Casting parameters
^^^^^^^^^^^^^^^^^^

URL, GET and application/x-www-form-urlencoded have the problem that every parameter is a string, meaning that::

    ?doMore=false

would be passed in as the string *'false'* which is not what one would expect. To cast these to the correct types, simply add PHPDoc in the form of::

    @param type $name


.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        /**
         * @param int $id
         * @param bool $doMore
         * @param float $value
         */
        public function doSomething($id, $doMore, $value) {
            // GET /index.php/apps/myapp?id=3&doMore=false&value=3.5
            // => $id = 3
            //    $doMore = false
            //    $value = 3.5
        }

    }

The following types will be cast:

* **bool** or **boolean**
* **float**
* **int** or **integer**


JSON parameters
^^^^^^^^^^^^^^^

It is possible to pass JSON using a POST, PUT or PATCH request. To do that the **Content-Type** header has to be set to **application/json**. The JSON is being parsed as an array and the first level keys will be used to pass in the arguments, e.g.::

    POST /index.php/apps/myapp/authors
    Content-Type: application/json
    {
        "name": "test",
        "number": 3,
        "publisher": true,
        "customFields": {
            "mail": "test@example.com",
            "address": "Somewhere"
        }
    }

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        public function create($name, $number, $publisher, $customFields) {
            // $name = 'test'
            // $number = 3
            // $publisher = true
            // $customFields = array("mail" => "test@example.com", "address" => "Somewhere")
        }

    }

Reading headers, files, cookies and environment variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Headers, files, cookies and environment variables can be accessed directly from the request object:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\IRequest;

    class PageController extends Controller {

        public function someMethod() {
            $type = $this->request->getHeader('Content-Type');  // $_SERVER['HTTP_CONTENT_TYPE']
            $cookie = $this->request->getCookie('myCookie');  // $_COOKIES['myCookie']
            $file = $this->request->getUploadedFile('myfile');  // $_FILES['myfile']
            $env = $this->request->getEnv('SOME_VAR');  // $_ENV['SOME_VAR']
        }

    }

Why should those values be accessed from the request object and not from the global array like $_FILES? Simple: `because it's bad practice <http://c2.com/cgi/wiki?GlobalVariablesAreBad>`_ and will make testing harder.


Reading and writing session variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To set, get or modify session variables, the ISession object has to be injected into the controller.

Then session variables can be accessed like this:

.. note:: The session is closed automatically for writing, unless you add the @UseSession annotation!

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\ISession;
    use OCP\IRequest;
    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        private $session;

        public function __construct($AppName, IRequest $request, ISession $session) {
            parent::__construct($AppName, $request);
            $this->session = $session;
        }

        /**
         * The following annotation is only needed for writing session values
         * @UseSession
         */
        public function writeASessionVariable() {
            // read a session variable
            $value = $this->session['value'];

            // write a session variable
            $this->session['value'] = 'new value';
        }

    }


Setting cookies
^^^^^^^^^^^^^^^

Cookies can be set or modified directly on the response class:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use DateTime;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\IRequest;

    class BakeryController extends Controller {

        /**
         * Adds a cookie "foo" with value "bar" that expires after user closes the browser
         * Adds a cookie "bar" with value "foo" that expires 2015-01-01
         */
        public function addCookie() {
            $response = new TemplateResponse(...);
            $response->addCookie('foo', 'bar');
            $response->addCookie('bar', 'foo', new DateTime('2015-01-01 00:00'));
            return $response;
        }

        /**
         * Invalidates the cookie "foo"
         * Invalidates the cookie "bar" and "bazinga"
         */
        public function invalidateCookie() {
            $response = new TemplateResponse(...);
            $response->invalidateCookie('foo');
            $response->invalidateCookies(array('bar', 'bazinga'));
            return $response;
        }
   }


Responses
---------

Similar to how every controller receives a request object, every controller method has to return a Response. This can be in the form of a Response subclass or in the form of a value that can be handled by a registered responder.

JSON
^^^^

Returning JSON is simple, just pass an array to a JSONResponse:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\JSONResponse;

    class PageController extends Controller {

        public function returnJSON() {
            $params = array('test' => 'hi');
            return new JSONResponse($params);
        }

    }

Because returning JSON is such a common task, there's even a shorter way to do this:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        public function returnJSON() {
            return array('test' => 'hi');
        }

    }

Why does this work? Because the dispatcher sees that the controller did not return a subclass of a Response and asks the controller to turn the value into a Response. That's where responders come in.

Responders
^^^^^^^^^^

Responders are short functions that take a value and return a response. They are used to return different kinds of responses based on a **format** parameter which is supplied by the client. Think of an API that is able to return both XML and JSON depending on if you call the URL with::

    ?format=xml

or::

    ?format=json

The appropriate responder is being chosen by the following criteria:

* First the dispatcher checks the Request if there is a **format** parameter, e.g.::

    ?format=xml

  or::

    /index.php/apps/myapp/authors.{format}

* If there is none, take the **Accept** header, use the first mimetype and cut off *application/*. In the following example the format would be *xml*::

    Accept: application/xml, application/json

* If there is no Accept header or the responder does not exist, format defaults to **json**.


By default there is only a responder for JSON but more can be added easily:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\DataResponse;

    class PageController extends Controller {

        public function returnHi() {

            // XMLResponse has to be implemented
            $this->registerResponder('xml', function($value) {
                if ($value instanceof DataResponse) {
                    return new XMLResponse(
                        $value->getData(),
                        $value->getStatus(),
                        $value->getHeaders()
                    );
                } else {
                    return new XMLResponse($value);
                }
            });

            return array('test' => 'hi');
        }

    }

.. note:: The above example would only return XML if the **format** parameter was *xml*. If you want to return an XMLResponse regardless of the format parameter, extend the Response class and return a new instance of it from the controller method instead.

Because returning values works fine in case of a success but not in case of failure that requires a custom HTTP error code, you can always wrap the value in a **DataResponse**. This works for both normal responses and error responses.

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\Http\Http;

    class PageController extends Controller {

        public function returnHi() {
            try {
                return new DataResponse(calculate_hi());
            } catch (\Exception $ex) {
                return new DataResponse(array('msg' => 'not found!'), Http::STATUS_NOT_FOUND);
            }
        }

    }


Templates
^^^^^^^^^

A :doc:`template <templates>` can be rendered by returning a TemplateResponse. A TemplateResponse takes the following parameters:

* **appName**: tells the template engine in which app the template should be located
* **templateName**: the name of the template inside the template/ folder without the .php extension
* **parameters**: optional array parameters that are available in the template through $_, e.g.::

    array('key' => 'something')

  can be accessed through::

    $_['key']

* **renderAs**: defaults to *user*, tells Nextcloud if it should include it in the web interface, or in case *blank* is passed solely render the template

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\TemplateResponse;

    class PageController extends Controller {

        public function index() {
            $templateName = 'main';  // will use templates/main.php
            $parameters = array('key' => 'hi');
            return new TemplateResponse($this->appName, $templateName, $parameters);
        }

    }

Redirects
^^^^^^^^^

A redirect can be achieved by returning a RedirectResponse:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\RedirectResponse;

    class PageController extends Controller {

        public function toGoogle() {
            return new RedirectResponse('https://google.com');
        }

    }

Downloads
^^^^^^^^^

A file download can be triggered by returning a DownloadResponse:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\DownloadResponse;

    class PageController extends Controller {

        public function downloadXMLFile() {
            $path = '/some/path/to/file.xml';
            $contentType = 'application/xml';

            return new DownloadResponse($path, $contentType);
        }

    }

Creating custom responses
^^^^^^^^^^^^^^^^^^^^^^^^^

If no premade Response fits the needed usecase, it is possible to extend the Response base class and custom Response. The only thing that needs to be implemented is the **render** method which returns the result as string.

Creating a custom XMLResponse class could look like this:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Http;

    use OCP\AppFramework\Http\Response;

    class XMLResponse extends Response {

        private $xml;

        public function __construct(array $xml) {
            $this->addHeader('Content-Type', 'application/xml');
            $this->xml = $xml;
        }

        public function render() {
            $root = new SimpleXMLElement('<root/>');
            array_walk_recursive($this->xml, array ($root, 'addChild'));
            return $xml->asXML();
        }

    }

Streamed and lazily rendered responses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

By default all responses are rendered at once and sent as a string through middleware. In certain cases this is not a desirable behavior, for instance if you want to stream a file in order to save memory. To do that use the now available **OCP\\AppFramework\\Http\\StreamResponse** class:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\StreamResponse;

    class PageController extends Controller {

        public function downloadXMLFile() {
            return new StreamResponse('/some/path/to/file.xml');
        }

    }




If you want to use a custom, lazily rendered response simply implement the interface **OCP\\AppFramework\\Http\\ICallbackResponse** for your response:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Http;

    use OCP\AppFramework\Http\Response;
    use OCP\AppFramework\Http\ICallbackResponse;

    class LazyResponse extends Response implements ICallbackResponse {

        public function callback(IOutput $output) {
            // custom code in here
        }

    }

.. note:: Because this code is rendered after several usually built in helpers, you need to take care of errors and proper HTTP caching by yourself.

Modifying the content security policy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

By default Nextcloud disables all resources which are not served on the same domain, forbids cross domain requests and disables inline CSS and JavaScript by setting a `Content Security Policy <https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Introducing_Content_Security_Policy>`_. However if an app relies on third-party media or other features which are forbidden by the current policy the policy can be relaxed.

.. note:: Double check your content and edge cases before you relax the policy! Also read the `documentation provided by MDN <https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Introducing_Content_Security_Policy>`_

To relax the policy pass an instance of the ContentSecurityPolicy class to your response. The methods on the class can be chained.

The following methods turn off security features by passing in **true** as the **$isAllowed** parameter

* **allowInlineScript** (bool $isAllowed)
* **allowInlineStyle** (bool $isAllowed)
* **allowEvalScript** (bool $isAllowed)

The following methods whitelist domains by passing in a domain or \* for any domain:

* **addAllowedScriptDomain** (string $domain)
* **addAllowedStyleDomain** (string $domain)
* **addAllowedFontDomain** (string $domain)
* **addAllowedImageDomain** (string $domain)
* **addAllowedConnectDomain** (string $domain)
* **addAllowedMediaDomain** (string $domain)
* **addAllowedObjectDomain** (string $domain)
* **addAllowedFrameDomain** (string $domain)
* **addAllowedChildSrcDomain** (string $domain)

The following policy for instance allows images, audio and videos from other domains:


.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\AppFramework\Http\ContentSecurityPolicy;

    class PageController extends Controller {

        public function index() {
            $response = new TemplateResponse('myapp', 'main');
            $csp = new ContentSecurityPolicy();
            $csp->addAllowedImageDomain('*');
                ->addAllowedMediaDomain('*');
            $response->setContentSecurityPolicy($csp);
        }

    }


OCS
^^^

.. note:: This is purely for compatibility reasons. If you are planning to offer an external API, go for a :doc:`api` instead.

In order to ease migration from OCS API routes to the App Framework, an additional controller and response have been added. To migrate your API you can use the **OCP\\AppFramework\\OCSController** base class and return your data in the form of a DataResponse in the following way:


.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\OCSController;

    class ShareController extends OCSController {

        /**
         * @NoAdminRequired
         * @NoCSRFRequired
         * @PublicPage
         * @CORS
         */
        public function getShares() {
            return new DataResponse([
                //Your data here
            ]);
        }

    }

The format parameter works out of the box, no intervention is required.

In order to make routing work for OCS routes you need to add a seperate 'ocs' entry to the routing table of your app.
Inside these are normal routes.

.. code-block:: php

   <?php

   return [
        'ocs' => [
            [
                'name' => 'Share#getShares',
                'url' => '/api/v1/shares',
                'verb' => 'GET',
            ],
        ],
   ];

Now your method will be reachable via ``<server>/ocs/v2.php/apps/<APPNAME>/api/v1/shares``

Handling errors
^^^^^^^^^^^^^^^

Sometimes a request should fail, for instance if an author with id 1 is requested but does not exist. In that case use an appropriate `HTTP error code <https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_Error>`_ to signal the client that an error occurred.

Each response subclass has access to the **setStatus** method which lets you set an HTTP status code. To return a JSONResponse signaling that the author with id 1 has not been found, use the following code:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http;
    use OCP\AppFramework\Http\JSONResponse;

    class AuthorController extends Controller {

        public function show($id) {
            try {
                // try to get author with $id

            } catch (NotFoundException $ex) {
                return new JSONResponse(array(), Http::STATUS_NOT_FOUND);
            }
        }

    }

Authentication
--------------

By default every controller method enforces the maximum security, which is:

* Ensure that the user is admin
* Ensure that the user is logged in
* Check the CSRF token

Most of the time though it makes sense to also allow normal users to access the page and the PageController->index() method should not check the CSRF token because it has not yet been sent to the client and because of that can't work.

To turn off checks the following *Annotations* can be added before the controller:

* **@NoAdminRequired**: Also users that are not admins can access the page
* **@NoCSRFRequired**: Don't check the CSRF token (use this wisely since you might create a security hole; to understand what it does see :doc:`../general/security`)
* **@PublicPage**: Everyone can access the page without having to log in

A controller method that turns off all checks would look like this:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        /**
         * @NoAdminRequired
         * @NoCSRFRequired
         * @PublicPage
         */
        public function freeForAll() {

        }

    }

Rate limiting
-------------

Nextcloud supports rate limiting on a controller method basis. By default controller methods are not rate limited. Rate limiting should be used on expensive or security sensitive functions (e.g. password resets) to increase the overall security of your application.

The native rate limiting will return a 429 status code to clients when the limit is reached and a default Nextcloud error page. When implementing rate limiting in your application, you should thus consider handling error situations where a 429 is returned by Nextcloud.

To enable rate limiting the following *Annotations* can be added to the controller:

* **@UserRateThrottle(limit=int, period=int)**: The rate limiting that is applied to logged-in users. If not specified Nextcloud will fallback to AnonUserRateThrottle.
* **@AnonRateThrottle(limit=int, period=int)**: The rate limiting that is applied to guests.

A controller method that would allow five requests for logged-in users and one request for anonymous users within the last 100 seconds would look as following:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        /**
         * @PublicPage
         * @UserRateThrottle(limit=5, period=100)
         * @AnonRateThrottle(limit=1, period=100)
         */
        public function rateLimitedForAll() {

        }
    }

Brute-force protection
----------------------

Nextcloud supports brute-force protection on an action basis. By default controller methods are not protected. Brute-force protection should be used on security sensitive functions (e.g. login attempts) to increase the overall security of your application.

The native brute-force protection will slow down requests if too many violations have been found. This slow down will be applied to all requests against a brute-force protected controller with the same action from the affected IP.

To enable brute force protection the following *Annotation* can be added to the controller:

* **@BruteForceProtection(action=string)**: "string" is the name of the action. Such as "login" or "reset". Brute-force attempts are on a per-action basis; this means if a violation for the "login" action is triggered, other actions such as "reset" or "foobar" are not affected.

Then the **throttle()** method has to be called on the response in case of a violation. Doing so will increase the throttle counter and make following requests slower.

A controller method that would employ brute-force protection with an action of "foobar" would look as following:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Controller;
    use OCP\AppFramework\Http\TemplateResponse;

    class PageController extends Controller {

        /**
         * @BruteForceProtection(action=foobar)
         */
        public function rateLimitedForAll() {
            $templateResponse = new TemplateResponse(…);
            // In case of a violation increase the throttle counter
            // note that $this->auth->isSuccessful here is just an
            // example.
            if(!$this->auth->isSuccessful()) {
                 $templateResponse->throttle();
            }
            return $templateResponse;
        }
    }
