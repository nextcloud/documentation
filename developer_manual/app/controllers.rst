===========
Controllers
===========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Controllers are used to connect :doc:`routes <routes>` with app logic. Think of it as callbacks that are executed once a request has come in. Controllers are defined inside the **controllers/** directory.

Connecting a controller with a route
====================================

Getting request parameters
==========================
Parameters can be passed in many ways:

* Extracted from the URL using curly braces like **{key}** inside the URL (see :doc:`routes`)
* Appended to the URL as a GET request (e.g. ?something=true)
* application/x-www-form-urlencoded from a form or jQuery
* application/json from a POST, PATCH or PUT request

All those parameters can easily be accessed by adding them to the controller method:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use \OCP\AppFramework\Controller;

    class PageController extends Controller {

        // this method will be executed with the id and name parameter taken
        // from the request
        public function doSomething($id, $name) {

        }

    }

Casting parameters
------------------
URL, GET and application/x-www-form-urlencoded have the problem that every parameter is a string, meaning that *?doMore=false* would be passed in as the string *'false'* which is not what one would expect. To cast these to the correct types, simply add PHPDoc to hint the types:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use \OCP\AppFramework\Controller;

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

The following types will be casted:

* **bool** or **bolean**
* **float**
* **int** or **integer**


JSON parameters
---------------
It is possible to pass JSON using a POST, PUT or PATCH request. To do that the **Content-Type** header has to be set to **application/json**. The JSON is being parsed as an array and the first level keys will be used to pass in the arguments, e.g.::

    POST /index.php/apps/myapp/authors
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

    use \OCP\AppFramework\Controller;

    class PageController extends Controller {

        public function create($name, $number, $publisher, $customFields) {
            // $name = 'test'
            // $number = 3
            // $publisher = true
            // $customFields = array("mail" => "test@example.com", "address" => "Somewhere")
        }

    }

Headers, files, cookies and session information
-----------------------------------------------

Responses
=========

JSON
----

Templates
---------

Redirects
---------

Downloads
---------

Creating custom responses
-------------------------

Responders
----------

Serializers
-----------


Authentication
==============
By default every controller method enforces the maximum security, which is:

* Ensure that the user is admin
* Ensure that the user is logged in
* Check the CSRF token

Most of the time though it makes sense to also allow normal users to access the page and the PageController->index() method should not check the CSRF token because it has not yet been sent to the client and because of that can't work.

To turn off checks the following *Annotations* can be added before the controller:

* **@NoAdminRequired**: Also users that are not admins can access the page
* **@NoCSRFRequired**: Don't check the CSRF token (use this wisely since you might create a security hole, to understand what it does see :doc:`../general/security`)
* **@PublicPage**: Everyone can access that page without having to log in

A controller method that turns of all checks would look like this:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Controller;

    use \OCP\IRequest;
    use \OCP\AppFramework\Controller;

    class PageController extends Controller {

        /**
         * @NoAdminRequired
         * @NoCSRFRequired
         * @PublicPage
         */
        public function freeForAll() {

        }

    }