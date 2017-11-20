========
Tutorial
========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

This tutorial will outline how to create a very simple notes app. The finished app is available on `GitHub <https://github.com/nextcloud/app-tutorial#tutorial>`_.


Setup
-----

First the :doc:`development environment <../general/devenv>` needs to be set up. This can be done by either `downloading the zip from the website <https://nextcloud.com/install/>`_ or cloning it directly from GitHub::

   git clone git@github.com:nextcloud/server.git --branch $BRANCH
   git submodule update --init

.. note:: ``$BRANCH`` is the desired Nextcloud branch (e.g. ``stable9`` for Nextcloud 9, ``stable10`` for Nextcloud 10, ..., ``master`` for the upcoming release)

First you want to enable debug mode to get proper error messages. To do that set ``debug`` to ``true`` in the **nextcloud/config/config.php** file::

    <?php
    $CONFIG = array (
        'debug' => true,
        ... configuration goes here ...
    );

.. note:: PHP errors are logged to **nextcloud/data/nextcloud.log**

Now open another terminal window and start the development server::

    cd nextcloud
    php -S localhost:8080

Afterwards a skeleton app can be created in the `app store <https://apps.nextcloud.com/developer/apps/generate>`_.

Download the compressed file that contains the generated app and extract it into your ``apps/`` directory. Afterwards the application can be enabled on the `apps page <http://localhost:8080/index.php/settings/apps>`_.

The first basic app is now available at ``http://localhost:8080/index.php/apps/yourappid/``

Routes & Controllers
--------------------

A typical web application consists of server side and client side code. The glue between those two parts are the URLs. In case of the notes app the following URLs will be used:

* **GET /**: Returns the interface in HTML
* **GET /notes**: Returns a list of all notes in JSON
* **GET /notes/1**: Returns a note with the id 1 in JSON
* **DELETE /notes/1**: Deletes a note with the id 1
* **POST /notes**: Creates a new note by passing in JSON
* **PUT /notes/1**: Updates a note with the id 1 by passing in JSON

On the client side we can call these URLs with the following jQuery code:

.. code-block:: js

    // example for calling the PUT /notes/1 URL
    var baseUrl = OC.generateUrl('/apps/ownnotes');
    var note = {
        title: 'New note',
        content: 'This is the note text'
    };
    var id = 1;
    $.ajax({
        url: baseUrl + '/notes/' + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(note)
    }).done(function (response) {
        // handle success
    }).fail(function (response, code) {
        // handle failure
    });

On the server side we need to register a callback that is executed once the request comes in. The callback itself will be a method on a :doc:`controller <controllers>` and the controller will be connected to the URL with a :doc:`route <routes>`. The controller and route for the page are already set up in **ownnotes/appinfo/routes.php**:

.. code-block:: php

    <?php
    return ['routes' => [
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET']
    ]];

This route calls the controller **OCA\\OwnNotes\\PageController->index()** method which is defined in **ownnotes/lib/Controller/PageController.php**. The controller returns a :doc:`template <templates>`, in this case **ownnotes/templates/main.php**:

.. note:: @NoAdminRequired and @NoCSRFRequired in the comments above the method turn off security checks, see :doc:`controllers`

.. code-block:: php

   <?php
    namespace OCA\OwnNotes\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        public function __construct($AppName, IRequest $request){
            parent::__construct($AppName, $request);
        }

        /**
         * @NoAdminRequired
         * @NoCSRFRequired
         */
        public function index() {
            return new TemplateResponse('ownnotes', 'main');
        }

    }

Since the route which returns the initial HTML has been taken care of, the controller which handles the AJAX requests for the notes needs to be set up. Create the following file: **ownnotes/lib/Controller/NoteController.php** with the following content:

.. code-block:: php

   <?php
    namespace OCA\OwnNotes\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Controller;

    class NoteController extends Controller {

        public function __construct($AppName, IRequest $request){
            parent::__construct($AppName, $request);
        }

        /**
         * @NoAdminRequired
         */
        public function index() {
            // empty for now
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function show($id) {
            // empty for now
        }

        /**
         * @NoAdminRequired
         *
         * @param string $title
         * @param string $content
         */
        public function create($title, $content) {
            // empty for now
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         * @param string $title
         * @param string $content
         */
        public function update($id, $title, $content) {
            // empty for now
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function destroy($id) {
            // empty for now
        }

    }

.. note:: The parameters are extracted from the request body and the URL using the controller method's variable names. Since PHP does not support type hints for primitive types such as ints and booleans, we need to add them as annotations in the comments. In order to type cast a parameter to an int, add **@param int $parameterName**

Now the controller methods need to be connected to the corresponding URLs in the **ownnotes/appinfo/routes.php** file:

.. code-block:: php

    <?php
    return [
        'routes' => [
            ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
            ['name' => 'note#index', 'url' => '/notes', 'verb' => 'GET'],
            ['name' => 'note#show', 'url' => '/notes/{id}', 'verb' => 'GET'],
            ['name' => 'note#create', 'url' => '/notes', 'verb' => 'POST'],
            ['name' => 'note#update', 'url' => '/notes/{id}', 'verb' => 'PUT'],
            ['name' => 'note#destroy', 'url' => '/notes/{id}', 'verb' => 'DELETE']
        ]
    ];

Since those 5 routes are so common, they can be abbreviated by adding a resource instead:

.. code-block:: php

    <?php
    return [
        'resources' => [
            'note' => ['url' => '/notes']
        ],
        'routes' => [
            ['name' => 'page#index', 'url' => '/', 'verb' => 'GET']
        ]
    ];

Database
--------

Now that the routes are set up and connected the notes should be saved in the database. To do that first create a :doc:`database schema <schema>` by creating **ownnotes/appinfo/database.xml**:

.. code-block:: xml

    <database>
        <name>*dbname*</name>
        <create>true</create>
        <overwrite>false</overwrite>
        <charset>utf8</charset>
        <table>
            <name>*dbprefix*ownnotes_notes</name>
            <declaration>
                <field>
                    <name>id</name>
                    <type>integer</type>
                    <notnull>true</notnull>
                    <autoincrement>true</autoincrement>
                    <unsigned>true</unsigned>
                    <primary>true</primary>
                    <length>8</length>
                </field>
                <field>
                    <name>title</name>
                    <type>text</type>
                    <length>200</length>
                    <default></default>
                    <notnull>true</notnull>
                </field>
                <field>
                    <name>user_id</name>
                    <type>text</type>
                    <length>200</length>
                    <default></default>
                    <notnull>true</notnull>
                </field>
                <field>
                    <name>content</name>
                    <type>clob</type>
                    <default></default>
                    <notnull>true</notnull>
                </field>
            </declaration>
        </table>
    </database>

To create the tables in the database, the :doc:`version tag <info>` in **ownnotes/appinfo/info.xml** needs to be increased:

.. code-block:: xml

    <?xml version="1.0"?>
    <info>
        <id>ownnotes</id>
        <name>Own Notes</name>
        <description>My first Nextcloud app</description>
        <licence>AGPL</licence>
        <author>Your Name</author>
        <version>0.0.2</version>
        <namespace>OwnNotes</namespace>
        <category>tool</category>
        <dependencies>
            <owncloud min-version="8" />
        </dependencies>
    </info>

Reload the page to trigger the database migration.

Now that the tables are created we want to map the database result to a PHP object to be able to control data. First create an :doc:`entity <database>` in **ownnotes/lib/Db/Note.php**:


.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Db;

    use JsonSerializable;

    use OCP\AppFramework\Db\Entity;

    class Note extends Entity implements JsonSerializable {

        protected $title;
        protected $content;
        protected $userId;

        public function jsonSerialize() {
            return [
                'id' => $this->id,
                'title' => $this->title,
                'content' => $this->content
            ];
        }
    }

.. note:: A field **id** is automatically set in the Entity base class

We also define a **jsonSerializable** method and implement the interface to be able to transform the entity to JSON easily.

Entities are returned from so called :doc:`Mappers <database>`. Let's create one in **ownnotes/lib/Db/NoteMapper.php** and add a **find** and **findAll** method:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Db;

    use OCP\IDbConnection;
    use OCP\AppFramework\Db\Mapper;

    class NoteMapper extends Mapper {

        public function __construct(IDbConnection $db) {
            parent::__construct($db, 'ownnotes_notes', '\OCA\OwnNotes\Db\Note');
        }

        public function find($id, $userId) {
            $sql = 'SELECT * FROM *PREFIX*ownnotes_notes WHERE id = ? AND user_id = ?';
            return $this->findEntity($sql, [$id, $userId]);
        }

        public function findAll($userId) {
            $sql = 'SELECT * FROM *PREFIX*ownnotes_notes WHERE user_id = ?';
            return $this->findEntities($sql, [$userId]);
        }

    }

.. note:: The first parent constructor parameter is the database layer, the second one is the database table and the third is the entity on which the result should be mapped onto. Insert, delete and update methods are already implemented.

Connect Database & Controllers
------------------------------

The mapper which provides the database access is finished and can be passed into the controller.

You can pass in the mapper by adding it as a type hinted parameter. Nextcloud will figure out how to :doc:`assemble them by itself <container>`. Additionally we want to know the userId of the currently logged in user. Simply add a **$UserId** parameter to the constructor (case sensitive!). To do that open **ownnotes/lib/Controller/NoteController.php** and change it to the following:

.. code-block:: php

   <?php
    namespace OCA\OwnNotes\Controller;

    use Exception;

    use OCP\IRequest;
    use OCP\AppFramework\Http;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\Controller;

    use OCA\OwnNotes\Db\Note;
    use OCA\OwnNotes\Db\NoteMapper;

    class NoteController extends Controller {

        private $mapper;
        private $userId;

        public function __construct($AppName, IRequest $request, NoteMapper $mapper, $UserId){
            parent::__construct($AppName, $request);
            $this->mapper = $mapper;
            $this->userId = $UserId;
        }

        /**
         * @NoAdminRequired
         */
        public function index() {
            return new DataResponse($this->mapper->findAll($this->userId));
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function show($id) {
            try {
                return new DataResponse($this->mapper->find($id, $this->userId));
            } catch(Exception $e) {
                return new DataResponse([], Http::STATUS_NOT_FOUND);
            }
        }

        /**
         * @NoAdminRequired
         *
         * @param string $title
         * @param string $content
         */
        public function create($title, $content) {
            $note = new Note();
            $note->setTitle($title);
            $note->setContent($content);
            $note->setUserId($this->userId);
            return new DataResponse($this->mapper->insert($note));
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         * @param string $title
         * @param string $content
         */
        public function update($id, $title, $content) {
            try {
                $note = $this->mapper->find($id, $this->userId);
            } catch(Exception $e) {
                return new DataResponse([], Http::STATUS_NOT_FOUND);
            }
            $note->setTitle($title);
            $note->setContent($content);
            return new DataResponse($this->mapper->update($note));
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function destroy($id) {
            try {
                $note = $this->mapper->find($id, $this->userId);
            } catch(Exception $e) {
                return new DataResponse([], Http::STATUS_NOT_FOUND);
            }
            $this->mapper->delete($note);
            return new DataResponse($note);
        }

    }

.. note:: The actual exceptions are **OCP\\AppFramework\\Db\\DoesNotExistException** and **OCP\\AppFramework\\Db\\MultipleObjectsReturnedException** but in this example we will treat them as the same. DataResponse is a more generic response than JSONResponse and also works with JSON.

This is all that is needed on the server side. Now let's progress to the client side.

Making things reusable and decoupling controllers from the database
-------------------------------------------------------------------

Let's say our app is now on the app store and and we get a request that we should save the files in the filesystem which requires access to the filesystem.

The filesystem API is quite different from the database API and throws different exceptions, which means we need to rewrite everything in the **NoteController** class to use it. This is bad because a controller's only responsibility should be to deal with incoming Http requests and return Http responses. If we need to change the controller because the data storage was changed the code is probably too tightly coupled and we need to add another layer in between. This layer is called **Service**.

Let's take the logic that was inside the controller and put it into a separate class inside **ownnotes/lib/Service/NoteService.php**:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Service;

    use Exception;

    use OCP\AppFramework\Db\DoesNotExistException;
    use OCP\AppFramework\Db\MultipleObjectsReturnedException;

    use OCA\OwnNotes\Db\Note;
    use OCA\OwnNotes\Db\NoteMapper;


    class NoteService {

        private $mapper;

        public function __construct(NoteMapper $mapper){
            $this->mapper = $mapper;
        }

        public function findAll($userId) {
            return $this->mapper->findAll($userId);
        }

        private function handleException ($e) {
            if ($e instanceof DoesNotExistException ||
                $e instanceof MultipleObjectsReturnedException) {
                throw new NotFoundException($e->getMessage());
            } else {
                throw $e;
            }
        }

        public function find($id, $userId) {
            try {
                return $this->mapper->find($id, $userId);

            // in order to be able to plug in different storage backends like files
            // for instance it is a good idea to turn storage related exceptions
            // into service related exceptions so controllers and service users
            // have to deal with only one type of exception
            } catch(Exception $e) {
                $this->handleException($e);
            }
        }

        public function create($title, $content, $userId) {
            $note = new Note();
            $note->setTitle($title);
            $note->setContent($content);
            $note->setUserId($userId);
            return $this->mapper->insert($note);
        }

        public function update($id, $title, $content, $userId) {
            try {
                $note = $this->mapper->find($id, $userId);
                $note->setTitle($title);
                $note->setContent($content);
                return $this->mapper->update($note);
            } catch(Exception $e) {
                $this->handleException($e);
            }
        }

        public function delete($id, $userId) {
            try {
                $note = $this->mapper->find($id, $userId);
                $this->mapper->delete($note);
                return $note;
            } catch(Exception $e) {
                $this->handleException($e);
            }
        }

    }

Following up create the exceptions in **ownnotes/lib/Service/ServiceException.php**:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Service;

    use Exception;

    class ServiceException extends Exception {}

and **ownnotes/lib/Service/NotFoundException.php**:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Service;

    class NotFoundException extends ServiceException {}


Remember how we had all those ugly try catches that where checking for **DoesNotExistException** and simply returned a 404 response? Let's also put this into a reusable class. In our case we chose a `trait <http://php.net/manual/en/language.oop5.traits.php>`_ so we can inherit methods without having to add it to our inheritance hierarchy. This will be important later on when you've got controllers that inherit from the **ApiController** class instead.

The trait is created in **ownnotes/lib/Controller/Errors.php**:


.. code-block:: php

    <?php

    namespace OCA\OwnNotes\Controller;

    use Closure;

    use OCP\AppFramework\Http;
    use OCP\AppFramework\Http\DataResponse;

    use OCA\OwnNotes\Service\NotFoundException;


    trait Errors {

        protected function handleNotFound (Closure $callback) {
            try {
                return new DataResponse($callback());
            } catch(NotFoundException $e) {
                $message = ['message' => $e->getMessage()];
                return new DataResponse($message, Http::STATUS_NOT_FOUND);
            }
        }

    }

Now we can wire up the trait and the service inside the **NoteController**:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\Controller;

    use OCA\OwnNotes\Service\NoteService;

    class NoteController extends Controller {

        private $service;
        private $userId;

        use Errors;

        public function __construct($AppName, IRequest $request,
                                    NoteService $service, $UserId){
            parent::__construct($AppName, $request);
            $this->service = $service;
            $this->userId = $UserId;
        }

        /**
         * @NoAdminRequired
         */
        public function index() {
            return new DataResponse($this->service->findAll($this->userId));
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function show($id) {
            return $this->handleNotFound(function () use ($id) {
                return $this->service->find($id, $this->userId);
            });
        }

        /**
         * @NoAdminRequired
         *
         * @param string $title
         * @param string $content
         */
        public function create($title, $content) {
            return $this->service->create($title, $content, $this->userId);
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         * @param string $title
         * @param string $content
         */
        public function update($id, $title, $content) {
            return $this->handleNotFound(function () use ($id, $title, $content) {
                return $this->service->update($id, $title, $content, $this->userId);
            });
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function destroy($id) {
            return $this->handleNotFound(function () use ($id) {
                return $this->service->delete($id, $this->userId);
            });
        }

    }

Great! Now the only reason that the controller needs to be changed is when request/response related things change.

Writing a test for the controller (recommended)
-----------------------------------------------

Tests are essential for having happy users and a carefree life. No one wants their users to rant about your app breaking their Nextcloud or being buggy. To do that you need to test your app. Since this amounts to a ton of repetitive tasks, we need to automate the tests.

Unit Tests
^^^^^^^^^^

A unit test is a test that tests a class in isolation. It is very fast and catches most of the bugs, so we want many unit tests.

Because Nextcloud uses :doc:`Dependency Injection <container>` to assemble your app, it is very easy to write unit tests by passing mocks into the constructor. A simple test for the update method can be added by adding this to **ownnotes/tests/Unit/Controller/NoteControllerTest.php**:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Tests\Unit\Controller;

    use PHPUnit_Framework_TestCase;

    use OCP\AppFramework\Http;
    use OCP\AppFramework\Http\DataResponse;

    use OCA\OwnNotes\Service\NotFoundException;


    class NoteControllerTest extends PHPUnit_Framework_TestCase {

        protected $controller;
        protected $service;
        protected $userId = 'john';
        protected $request;

        public function setUp() {
            $this->request = $this->getMockBuilder('OCP\IRequest')->getMock();
            $this->service = $this->getMockBuilder('OCA\OwnNotes\Service\NoteService')
                ->disableOriginalConstructor()
                ->getMock();
            $this->controller = new NoteController(
                'ownnotes', $this->request, $this->service, $this->userId
            );
        }

        public function testUpdate() {
            $note = 'just check if this value is returned correctly';
            $this->service->expects($this->once())
                ->method('update')
                ->with($this->equalTo(3),
                        $this->equalTo('title'),
                        $this->equalTo('content'),
                       $this->equalTo($this->userId))
                ->will($this->returnValue($note));

            $result = $this->controller->update(3, 'title', 'content');

            $this->assertEquals($note, $result->getData());
        }


        public function testUpdateNotFound() {
            // test the correct status code if no note is found
            $this->service->expects($this->once())
                ->method('update')
                ->will($this->throwException(new NotFoundException()));

            $result = $this->controller->update(3, 'title', 'content');

            $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
        }

    }


We can and should also create a test for the **NoteService** class:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Tests\Unit\Service;

    use PHPUnit_Framework_TestCase;

    use OCP\AppFramework\Db\DoesNotExistException;

    use OCA\OwnNotes\Db\Note;

    class NoteServiceTest extends PHPUnit_Framework_TestCase {

        private $service;
        private $mapper;
        private $userId = 'john';

        public function setUp() {
            $this->mapper = $this->getMockBuilder('OCA\OwnNotes\Db\NoteMapper')
                ->disableOriginalConstructor()
                ->getMock();
            $this->service = new NoteService($this->mapper);
        }

        public function testUpdate() {
            // the existing note
            $note = Note::fromRow([
                'id' => 3,
                'title' => 'yo',
                'content' => 'nope'
            ]);
            $this->mapper->expects($this->once())
                ->method('find')
                ->with($this->equalTo(3))
                ->will($this->returnValue($note));

            // the note when updated
            $updatedNote = Note::fromRow(['id' => 3]);
            $updatedNote->setTitle('title');
            $updatedNote->setContent('content');
            $this->mapper->expects($this->once())
                ->method('update')
                ->with($this->equalTo($updatedNote))
                ->will($this->returnValue($updatedNote));

            $result = $this->service->update(3, 'title', 'content', $this->userId);

            $this->assertEquals($updatedNote, $result);
        }


        /**
         * @expectedException OCA\OwnNotes\Service\NotFoundException
         */
        public function testUpdateNotFound() {
            // test the correct status code if no note is found
            $this->mapper->expects($this->once())
                ->method('find')
                ->with($this->equalTo(3))
                ->will($this->throwException(new DoesNotExistException('')));

            $this->service->update(3, 'title', 'content', $this->userId);
        }

    }

If `PHPUnit is installed <https://phpunit.de/>`_ we can run the tests inside **ownnotes/** with the following command::

    phpunit

.. note:: You need to adjust the **ownnotes/tests/Unit/Controller/PageControllerTest** file to get the tests passing: remove the **testEcho** method since that method is no longer present in your **PageController** and do not test the user id parameters since they are not passed anymore

Integration Tests
-----------------

Integration tests are slow and need a fully working instance but make sure that our classes work well together. Instead of mocking out all classes and parameters we can decide whether to use full instances or replace certain classes. Because they are slow we don't want as many integration tests as unit tests.

In our case we want to create an integration test for the udpate method without mocking out the **NoteMapper** class so we actually write to the existing database.

To do that create a new file called **ownnotes/tests/Integration/NoteIntegrationTest.php** with the following content:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Tests\Integration\Controller;

    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\App;
    use Test\TestCase;

    use OCA\OwnNotes\Db\Note;

    class NoteIntregrationTest extends TestCase {

        private $controller;
        private $mapper;
        private $userId = 'john';

        public function setUp() {
            parent::setUp();
            $app = new App('ownnotes');
            $container = $app->getContainer();

            // only replace the user id
            $container->registerService('UserId', function($c) {
                return $this->userId;
            });

            $this->controller = $container->query(
                'OCA\OwnNotes\Controller\NoteController'
            );

            $this->mapper = $container->query(
                'OCA\OwnNotes\Db\NoteMapper'
            );
        }

        public function testUpdate() {
            // create a new note that should be updated
            $note = new Note();
            $note->setTitle('old_title');
            $note->setContent('old_content');
            $note->setUserId($this->userId);

            $id = $this->mapper->insert($note)->getId();

            // fromRow does not set the fields as updated
            $updatedNote = Note::fromRow([
                'id' => $id,
                'user_id' => $this->userId
            ]);
            $updatedNote->setContent('content');
            $updatedNote->setTitle('title');

            $result = $this->controller->update($id, 'title', 'content');

            $this->assertEquals($updatedNote, $result->getData());

            // clean up
            $this->mapper->delete($result->getData());
        }

    }

To run the integration tests change into the **ownnotes** directory and run::

    phpunit -c phpunit.integration.xml

Adding a RESTful API (optional)
-------------------------------

A :doc:`RESTful API <api>` allows other apps such as Android or iPhone apps to access and change your notes. Since syncing is a big core component of Nextcloud it is a good idea to add (and document!) your own RESTful API.

Because we put our logic into the **NoteService** class it is very easy to reuse it. The only pieces that need to be changed are the annotations which disable the CSRF check (not needed for a REST call usually) and add support for `CORS <https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`_ so your API can be accessed from other webapps.

With that in mind create a new controller in **ownnotes/lib/Controller/NoteApiController.php**:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\ApiController;

    use OCA\OwnNotes\Service\NoteService;

    class NoteApiController extends ApiController {

        private $service;
        private $userId;

        use Errors;

        public function __construct($AppName, IRequest $request,
                                    NoteService $service, $UserId){
            parent::__construct($AppName, $request);
            $this->service = $service;
            $this->userId = $UserId;
        }

        /**
         * @CORS
         * @NoCSRFRequired
         * @NoAdminRequired
         */
        public function index() {
            return new DataResponse($this->service->findAll($this->userId));
        }

        /**
         * @CORS
         * @NoCSRFRequired
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function show($id) {
            return $this->handleNotFound(function () use ($id) {
                return $this->service->find($id, $this->userId);
            });
        }

        /**
         * @CORS
         * @NoCSRFRequired
         * @NoAdminRequired
         *
         * @param string $title
         * @param string $content
         */
        public function create($title, $content) {
            return $this->service->create($title, $content, $this->userId);
        }

        /**
         * @CORS
         * @NoCSRFRequired
         * @NoAdminRequired
         *
         * @param int $id
         * @param string $title
         * @param string $content
         */
        public function update($id, $title, $content) {
            return $this->handleNotFound(function () use ($id, $title, $content) {
                return $this->service->update($id, $title, $content, $this->userId);
            });
        }

        /**
         * @CORS
         * @NoCSRFRequired
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function destroy($id) {
            return $this->handleNotFound(function () use ($id) {
                return $this->service->delete($id, $this->userId);
            });
        }

    }

All that is left is to connect the controller to a route and enable the built in preflighted CORS method which is defined in the **ApiController** base class:

.. code-block:: php

    <?php
    return [
        'resources' => [
            'note' => ['url' => '/notes'],
            'note_api' => ['url' => '/api/0.1/notes']
        ],
        'routes' => [
            ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
            ['name' => 'note_api#preflighted_cors', 'url' => '/api/0.1/{path}',
             'verb' => 'OPTIONS', 'requirements' => ['path' => '.+']]
        ]
    ];

.. note:: It is a good idea to version your API in your URL

You can test the API by running a GET request with **curl**::

    curl -u user:password http://localhost:8080/index.php/apps/ownnotes/api/0.1/notes

Since the **NoteApiController** is basically identical to the **NoteController**, the unit test for it simply inherits its tests from the **NoteControllerTest**. Create the file **ownnotes/tests/Unit/Controller/NoteApiControllerTest.php**:

.. code-block:: php

    <?php
    namespace OCA\OwnNotes\Tests\Unit\Controller;

    require_once __DIR__ . '/NoteControllerTest.php';

    class NoteApiControllerTest extends NoteControllerTest {

        public function setUp() {
            parent::setUp();
            $this->controller = new NoteApiController(
                'ownnotes', $this->request, $this->service, $this->userId
            );
        }

    }

Adding JavaScript and CSS
-------------------------

To create a modern webapp you need to write :doc:`JavaScript<js>`. You can use any JavaScript framework but for this tutorial we want to keep it as simple as possible and therefore only include the templating library `handlebarsjs <http://handlebarsjs.com/>`_. `Download the file <http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v2.0.0.js>`_ into **ownnotes/js/handlebars.js** and include it at the very top of **ownnotes/templates/main.php** before the other scripts and styles:

.. code-block:: php

    <?php
    script('ownnotes', 'handlebars');

.. note:: jQuery is included by default on every page.

Creating a navigation
---------------------

The template file **ownnotes/templates/part.navigation.php** contains the navigation. Nextcloud defines many handy :doc:`CSS styles <css>` which we are going to reuse to style the navigation. Adjust the file to contain only the following code:

.. note:: **$l->t()** is used to make your strings :doc:`translatable <l10n>` and **p()** is used :doc:`to print escaped HTML <templates>`

.. code-block:: php

    <!-- translation strings -->
    <div style="display:none" id="new-note-string"><?php p($l->t('New note')); ?></div>

    <script id="navigation-tpl" type="text/x-handlebars-template">
        <li id="new-note"><a href="#"><?php p($l->t('Add note')); ?></a></li>
        {{#each notes}}
            <li class="note with-menu {{#if active}}active{{/if}}" data-id="{{ id }}">
                <a href="#">{{ title }}</a>
                <div class="app-navigation-entry-utils">
                    <ul>
                        <li class="app-navigation-entry-utils-menu-button svg"><button></button></li>
                    </ul>
                </div>

                <div class="app-navigation-entry-menu">
                    <ul>
                        <li><button class="delete icon-delete svg" title="delete"></button></li>
                    </ul>
                </div>
            </li>
        {{/each}}
    </script>

    <ul></ul>

Creating the content
--------------------

The template file **ownnotes/templates/part.content.php** contains the content. It will just be a textarea and a button, so replace the content with the following:

.. code-block:: php

    <script id="content-tpl" type="text/x-handlebars-template">
        {{#if note}}
            <div class="input"><textarea>{{ note.content }}</textarea></div>
            <div class="save"><button><?php p($l->t('Save')); ?></button></div>
        {{else}}
            <div class="input"><textarea disabled></textarea></div>
            <div class="save"><button disabled><?php p($l->t('Save')); ?></button></div>
        {{/if}}
    </script>
    <div id="editor"></div>

Wiring it up
------------

When the page is loaded we want all the existing notes to load. Furthermore we want to display the current note when you click on it in the navigation, a note should be deleted when we click the deleted button and clicking on **New note** should create a new note. To do that open **ownnotes/js/script.js** and replace the example code with the following:

.. code-block:: js

    (function (OC, window, $, undefined) {
    'use strict';

    $(document).ready(function () {

    var translations = {
        newNote: $('#new-note-string').text()
    };

    // this notes object holds all our notes
    var Notes = function (baseUrl) {
        this._baseUrl = baseUrl;
        this._notes = [];
        this._activeNote = undefined;
    };

    Notes.prototype = {
        load: function (id) {
            var self = this;
            this._notes.forEach(function (note) {
                if (note.id === id) {
                    note.active = true;
                    self._activeNote = note;
                } else {
                    note.active = false;
                }
            });
        },
        getActive: function () {
            return this._activeNote;
        },
        removeActive: function () {
            var index;
            var deferred = $.Deferred();
            var id = this._activeNote.id;
            this._notes.forEach(function (note, counter) {
                if (note.id === id) {
                    index = counter;
                }
            });

            if (index !== undefined) {
                // delete cached active note if necessary
                if (this._activeNote === this._notes[index]) {
                    delete this._activeNote;
                }

                this._notes.splice(index, 1);

                $.ajax({
                    url: this._baseUrl + '/' + id,
                    method: 'DELETE'
                }).done(function () {
                    deferred.resolve();
                }).fail(function () {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise();
        },
        create: function (note) {
            var deferred = $.Deferred();
            var self = this;
            $.ajax({
                url: this._baseUrl,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(note)
            }).done(function (note) {
                self._notes.push(note);
                self._activeNote = note;
                self.load(note.id);
                deferred.resolve();
            }).fail(function () {
                deferred.reject();
            });
            return deferred.promise();
        },
        getAll: function () {
            return this._notes;
        },
        loadAll: function () {
            var deferred = $.Deferred();
            var self = this;
            $.get(this._baseUrl).done(function (notes) {
                self._activeNote = undefined;
                self._notes = notes;
                deferred.resolve();
            }).fail(function () {
                deferred.reject();
            });
            return deferred.promise();
        },
        updateActive: function (title, content) {
            var note = this.getActive();
            note.title = title;
            note.content = content;

            return $.ajax({
                url: this._baseUrl + '/' + note.id,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(note)
            });
        }
    };

    // this will be the view that is used to update the html
    var View = function (notes) {
        this._notes = notes;
    };

    View.prototype = {
        renderContent: function () {
            var source = $('#content-tpl').html();
            var template = Handlebars.compile(source);
            var html = template({note: this._notes.getActive()});

            $('#editor').html(html);

            // handle saves
            var textarea = $('#app-content textarea');
            var self = this;
            $('#app-content button').click(function () {
                var content = textarea.val();
                var title = content.split('\n')[0]; // first line is the title

                self._notes.updateActive(title, content).done(function () {
                    self.render();
                }).fail(function () {
                    alert('Could not update note, not found');
                });
            });
        },
        renderNavigation: function () {
            var source = $('#navigation-tpl').html();
            var template = Handlebars.compile(source);
            var html = template({notes: this._notes.getAll()});

            $('#app-navigation ul').html(html);

            // create a new note
            var self = this;
            $('#new-note').click(function () {
                var note = {
                    title: translations.newNote,
                    content: ''
                };

                self._notes.create(note).done(function() {
                    self.render();
                    $('#editor textarea').focus();
                }).fail(function () {
                    alert('Could not create note');
                });
            });

            // show app menu
            $('#app-navigation .app-navigation-entry-utils-menu-button').click(function () {
                var entry = $(this).closest('.note');
                entry.find('.app-navigation-entry-menu').toggleClass('open');
            });

            // delete a note
            $('#app-navigation .note .delete').click(function () {
                var entry = $(this).closest('.note');
                entry.find('.app-navigation-entry-menu').removeClass('open');

                self._notes.removeActive().done(function () {
                    self.render();
                }).fail(function () {
                    alert('Could not delete note, not found');
                });
            });

            // load a note
            $('#app-navigation .note > a').click(function () {
                var id = parseInt($(this).parent().data('id'), 10);
                self._notes.load(id);
                self.render();
                $('#editor textarea').focus();
            });
        },
        render: function () {
            this.renderNavigation();
            this.renderContent();
        }
    };

    var notes = new Notes(OC.generateUrl('/apps/ownnotes/notes'));
    var view = new View(notes);
    notes.loadAll().done(function () {
        view.render();
    }).fail(function () {
        alert('Could not load notes');
    });


    });

    })(OC, window, jQuery);


Apply finishing touches
-----------------------

Now the only thing left is to style the textarea in a nicer fashion. To do that open **ownnotes/css/style.css** and replace the content with the following :doc:`CSS <css>` code:

.. code-block:: css

    #app-content-wrapper {
        height: 100%;
    }

    #editor {
        height: 100%;
        width: 100%;
    }

    #editor .input {
        height: calc(100% - 51px);
        width: 100%;
    }

    #editor .save {
        height: 50px;
        width: 100%;
        text-align: center;
        border-top: 1px solid #ccc;
        background-color: #fafafa;
    }

    #editor textarea {
        height: 100%;
        width: 100%;
        border: 0;
        margin: 0;
        border-radius: 0;
        overflow-y: auto;
    }

    #editor button {
        height: 44px;
    }

Congratulations! You've written your first Nextcloud app. You can now either try to further improve the tutorial notes app or start writing your own app.
