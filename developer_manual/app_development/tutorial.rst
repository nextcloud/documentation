========
Tutorial
========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

This tutorial will outline how to create a very simple notes app. The finished app is available on `GitHub <https://github.com/nextcloud/app-tutorial#tutorial>`_.


Setup
-----

First the :doc:`development environment <../getting_started/devenv>` needs to be set up. This can be done by either `downloading the zip from the website <https://nextcloud.com/install/>`_ or cloning it directly from GitHub::

    git clone git@github.com:nextcloud/server.git --branch $BRANCH
    cd server
    git submodule update --init

.. note:: ``$BRANCH`` is the desired Nextcloud branch (e.g. ``stable19`` for Nextcloud 19, ``master`` for the upcoming release)

First you want to enable debug mode to get proper error messages. To do that set ``debug`` to ``true`` in the **config/config.php** file::

    <?php
    $CONFIG = array (
        'debug' => true,
        ... configuration goes here ...
    );

.. note:: PHP errors are logged to **data/nextcloud.log**

Now open another terminal window and start the development server::

    cd nextcloud
    php -S localhost:8080

*Alternative Setups*:

Launch with podman (leaner than docker and allows you to run containers without being root)::

    podman run --name=nextcloud --replace=true -p 8080:80 -v /absolute/path/to/apps:/var/www/html/custom_apps docker.io/nextcloud

Launch with docker (not tested)::

    sudo docker run --name=nextcloud -p 8080:80 -v /absolute/path/to/apps:/var/www/html/custom_apps nextcloud

Afterwards a skeleton app can be created in the `app store <https://apps.nextcloud.com/developer/apps/generate>`_.

Download the compressed file that contains the generated app and extract it into your ``apps/`` directory. Afterwards the application can be enabled on the `apps page <http://localhost:8080/index.php/settings/apps>`_.

The first basic app is now available at ``http://localhost:8080/index.php/apps/yourappid/``

Routes & controllers
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
    var baseUrl = OC.generateUrl('/apps/notestutorial');
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

On the server side we need to register a callback that is executed once the request comes in. The callback itself will be a method on a :doc:`controller <../basics/controllers>` and the controller will be connected to the URL with a :doc:`route <../basics/controllers>`. The controller and route for the page are already set up in **notestutorial/appinfo/routes.php**:

.. code-block:: php

    <?php
    return ['routes' => [
        ['name' => 'page#index', 'url' => '/', 'verb' => 'GET']
    ]];

This route calls the controller **OCA\\notestutorial\\PageController->index()** method which is defined in **notestutorial/lib/Controller/PageController.php**. The controller returns a :doc:`template <../basics/front-end/templates>`, in this case **notestutorial/templates/main.php**:

.. note:: **@NoAdminRequired** and **@NoCSRFRequired** in the comments above the method turn off security checks, see `Authentication on Controllers <../basics/controllers.html#authentication>`__

.. code-block:: php

   <?php
    namespace OCA\NotesTutorial\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\AppFramework\Controller;

    class PageController extends Controller {

        public function __construct(string $appName, IRequest $request){
            parent::__construct($appName, $request);
        }

        /**
         * @NoAdminRequired
         * @NoCSRFRequired
         */
        public function index() {
            return new TemplateResponse('notestutorial', 'main');
        }

    }

Since the route which returns the initial HTML has been taken care of, the controller which handles the AJAX requests for the notes needs to be set up. Create the following file: **notestutorial/lib/Controller/NoteController.php** with the following content:

.. code-block:: php

   <?php
    namespace OCA\NotesTutorial\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Controller;

    class NoteController extends Controller {

        public function __construct(string $appName, IRequest $request){
            parent::__construct($appName, $request);
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
        public function show(int $id) {
            // empty for now
        }

        /**
         * @NoAdminRequired
         *
         * @param string $title
         * @param string $content
         */
        public function create(string $title, string $content) {
            // empty for now
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         * @param string $title
         * @param string $content
         */
        public function update(int $id, string $title, string $content) {
            // empty for now
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function destroy(int $id) {
            // empty for now
        }

    }

.. note:: The parameters are extracted from the request body and the URL using the controller method's variable names. Since PHP does not support type hints for primitive types such as ints and booleans, we need to add them as annotations in the comments. In order to type cast a parameter to an int, add **@param int $parameterName**

Now the controller methods need to be connected to the corresponding URLs in the **notestutorial/appinfo/routes.php** file:

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

Now that the routes are set up and connected the notes should be saved in the
database. To do that first create a :doc:`database migration <../basics/storage/migrations>`
by creating a file **notestutorial/lib/Migration/VersionXXYYZZDateYYYYMMDDHHSSAA.php**,
so for example **notestutorial/lib/Migration/Version000000Date20181013124731.php**""

.. code-block:: php

    <?php

      namespace OCA\NotesTutorial\Migration;

      use Closure;
      use OCP\DB\ISchemaWrapper;
      use OCP\Migration\SimpleMigrationStep;
      use OCP\Migration\IOutput;

      class Version1400Date20181013124731 extends SimpleMigrationStep {

        /**
        * @param IOutput $output
        * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
        * @param array $options
        * @return null|ISchemaWrapper
        */
        public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
            /** @var ISchemaWrapper $schema */
            $schema = $schemaClosure();

            if (!$schema->hasTable('notestutorial')) {
                $table = $schema->createTable('notestutorial');
                $table->addColumn('id', 'integer', [
                    'autoincrement' => true,
                    'notnull' => true,
                ]);
                $table->addColumn('title', 'string', [
                    'notnull' => true,
                    'length' => 200
                ]);
                $table->addColumn('user_id', 'string', [
                    'notnull' => true,
                    'length' => 200,
                ]);
                $table->addColumn('content', 'text', [
                    'notnull' => true,
                    'default' => ''
                ]);

                $table->setPrimaryKey(['id']);
                $table->addIndex(['user_id'], 'notestutorial_user_id_index');
            }
            return $schema;
        }
    }

To create the tables in the database, run the :ref:`migration  <migration_console_command>` command::

   php ./occ migrations:execute <appId> <versionNumber>

   Example: sudo -u www-data php ./occ migrations:execute photos 000000Date20201002183800

.. note:: To trigger the table creation/alteration when user updating the app, update the :doc:`version tag <info>` in **notestutorial/appinfo/info.xml** . migration will be executed when user reload page after app upgrade

.. note:: To be able to access the occ migrations commands, please enable the debug flag in config.php

.. code-block:: xml

  <?xml version="1.0"?>
    <info>
        <id>notestutorial</id>
        <name>Notes Tutorial</name>
        <description>My first Nextcloud app</description>
        <licence>AGPL</licence>
        <author>Your Name</author>
        <version>1.0.0</version>
        <namespace>notestutorial</namespace>
        <category>office</category>
        <dependencies>
            <nextcloud min-version="25" max-version="25"/>
        </dependencies>
    </info>


Now that the tables are created we want to map the database result to a PHP object to be able to control data. First create an :doc:`entity <../basics/storage/database>` in **notestutorial/lib/Db/Note.php**:


.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Db;

    use JsonSerializable;

    use OCP\AppFramework\Db\Entity;

    class Note extends Entity implements JsonSerializable {

        protected $title;
        protected $content;
        protected $userId;

        public function __construct() {
            $this->addType('id','integer');
        }

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

Entities are returned from so-called :doc:`Mappers <../basics/storage/database>`. Let's create one in **notestutorial/lib/Db/NoteMapper.php** and add a **find** and **findAll** method:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Db;

    use OCP\IDBConnection;
    use OCP\AppFramework\Db\QBMapper;

    /**
     * @extends QBMapper<Note>
     */
    class NoteMapper extends QBMapper {

        public function __construct(IDBConnection $db) {
            parent::__construct($db, 'notestutorial_notes', Note::class);
        }

        public function find(int $id, string $userId) {
            $qb = $this->db->getQueryBuilder();

            $qb->select('*')
                 ->from($this->getTableName())
                 ->where($qb->expr()->eq('id', $qb->createNamedParameter($id)))
                 ->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

            return $this->findEntity($qb);
        }

        public function findAll(string $userId) {
            $qb = $this->db->getQueryBuilder();

            $qb->select('*')
               ->from($this->getTableName())
               ->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

            return $this->findEntities($qb);
        }

    }

.. note:: The first parent constructor parameter is the database layer, the second one is the database table and the third is the entity on which the result should be mapped onto. Insert, delete and update methods are already implemented.

Connect database & controllers
------------------------------

The mapper which provides the database access is finished and can be passed into the controller.

You can pass in the mapper by adding it as a type hinted parameter. Nextcloud will figure out how to :doc:`assemble them by itself <../basics/dependency_injection>`. Additionally we want to know the userId of the currently logged in user. Simply add a **$userId** parameter to the constructor (case sensitive!). To do that open **notestutorial/lib/Controller/NoteController.php** and change it to the following:

.. code-block:: php

   <?php
    namespace OCA\NotesTutorial\Controller;

    use Exception;

    use OCP\IRequest;
    use OCP\AppFramework\Http;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\Controller;

    use OCA\NotesTutorial\Db\Note;
    use OCA\NotesTutorial\Db\NoteMapper;

    class NoteController extends Controller {

        private NoteMapper $mapper;
        private ?string $userId;

        public function __construct(string $appName, IRequest $request, NoteMapper $mapper, ?string $userId = null){
            parent::__construct($appName, $request);
            $this->mapper = $mapper;
            $this->userId = $userId;
        }

        /**
         * @NoAdminRequired
         */
        public function index(): DataResponse {
            return new DataResponse($this->mapper->findAll($this->userId));
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function show(int $id): DataResponse {
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
        public function create(string $title, string $content): DataResponse {
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
        public function update(int $id, string $title, string $content): DataResponse {
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
        public function destroy(int $id): DataResponse {
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

Let's say our app is now on the app store and we get a request that we should save the files in the filesystem which requires access to the filesystem.

The filesystem API is quite different from the database API and throws different exceptions, which means we need to rewrite everything in the **NoteController** class to use it. This is bad because a controller's only responsibility should be to deal with incoming Http requests and return Http responses. If we need to change the controller because the data storage was changed the code is probably too tightly coupled and we need to add another layer in between. This layer is called **Service**.

Let's take the logic that was inside the controller and put it into a separate class inside **notestutorial/lib/Service/NoteService.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Service;

    use Exception;

    use OCP\AppFramework\Db\DoesNotExistException;
    use OCP\AppFramework\Db\MultipleObjectsReturnedException;

    use OCA\NotesTutorial\Db\Note;
    use OCA\NotesTutorial\Db\NoteMapper;


    class NoteService {

        private NoteMapper $mapper;

        public function __construct(NoteMapper $mapper){
            $this->mapper = $mapper;
        }

        /**
         * @return Note[]
         */
        public function findAll(string $userId): array {
            return $this->mapper->findAll($userId);
        }

        /**
         * @return never
         */
        private function handleException ($e) {
            if ($e instanceof DoesNotExistException ||
                $e instanceof MultipleObjectsReturnedException) {
                throw new NotFoundException($e->getMessage());
            } else {
                throw $e;
            }
        }

        public function find(int $id, string $userId): Note {
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

        public function create(string $title, string $content, string $userId): Note {
            $note = new Note();
            $note->setTitle($title);
            $note->setContent($content);
            $note->setUserId($userId);
            return $this->mapper->insert($note);
        }

        public function update(int $id, string $title, string $content, string $userId): Note {
            try {
                $note = $this->mapper->find($id, $userId);
                $note->setTitle($title);
                $note->setContent($content);
                return $this->mapper->update($note);
            } catch(Exception $e) {
                $this->handleException($e);
            }
        }

        public function delete(int $id, string $userId): Note {
            try {
                $note = $this->mapper->find($id, $userId);
                $this->mapper->delete($note);
                return $note;
            } catch(Exception $e) {
                $this->handleException($e);
            }
        }

    }

Following up create the exceptions in **notestutorial/lib/Service/ServiceException.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Service;

    use Exception;

    class ServiceException extends Exception {}

and **notestutorial/lib/Service/NotFoundException.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Service;

    class NotFoundException extends ServiceException {}


Remember how we had all those ugly try catches that where checking for **DoesNotExistException** and simply returned a 404 response? Let's also put this into a reusable class. In our case we chose a `trait <https://php.net/manual/en/language.oop5.traits.php>`_ so we can inherit methods without having to add it to our inheritance hierarchy. This will be important later on when you've got controllers that inherit from the **ApiController** class instead.

The trait is created in **notestutorial/lib/Controller/Errors.php**:


.. code-block:: php

    <?php

    namespace OCA\NotesTutorial\Controller;

    use Closure;

    use OCP\AppFramework\Http;
    use OCP\AppFramework\Http\DataResponse;

    use OCA\NotesTutorial\Service\NotFoundException;


    trait Errors {

        protected function handleNotFound (Closure $callback): DataResponse {
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
    namespace OCA\NotesTutorial\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\Controller;

    use OCA\NotesTutorial\Service\NoteService;

    class NoteController extends Controller {

        private NoteService $service;
        private ?string $userId;

        use Errors;

        public function __construct(string $appName, IRequest $request,
                                    NoteService $service, ?string $userId = null) {
            parent::__construct($appName, $request);
            $this->service = $service;
            $this->userId = $userId;
        }

        /**
         * @NoAdminRequired
         */
        public function index(): DataResponse {
            return new DataResponse($this->service->findAll($this->userId));
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function show(int $id): DataResponse {
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
        public function create(string $title, string $content) {
            return $this->service->create($title, $content, $this->userId);
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         * @param string $title
         * @param string $content
         */
        public function update(int $id, string $title, string $content): DataResponse {
            return $this->handleNotFound(function () use ($id, $title, $content): Note {
                return $this->service->update($id, $title, $content, $this->userId);
            });
        }

        /**
         * @NoAdminRequired
         *
         * @param int $id
         */
        public function destroy(int $id): DataResponse {
            return $this->handleNotFound(function () use ($id): Note {
                return $this->service->delete($id, $this->userId);
            });
        }

    }

Great! Now the only reason that the controller needs to be changed is when request/response related things change.

Writing a test for the controller (recommended)
-----------------------------------------------

Tests are essential for having happy users and a carefree life. No one wants their users to rant about your app breaking their Nextcloud or being buggy. To do that you need to test your app. Since this amounts to a ton of repetitive tasks, we need to automate the tests.

Unit tests
^^^^^^^^^^

A unit test is a test that tests a class in isolation. It is very fast and catches most of the bugs, so we want many unit tests.

Because Nextcloud uses :doc:`Dependency Injection <../basics/dependency_injection>` to assemble your app, it is very easy to write unit tests by passing mocks into the constructor. A simple test for the update method can be added by adding this to **notestutorial/tests/Unit/Controller/NoteControllerTest.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Tests\Unit\Controller;

    use PHPUnit\Framework\TestCase;

    use OCP\AppFramework\Http;
    use OCP\AppFramework\Http\DataResponse;

    use OCA\NotesTutorial\Service\NotFoundException;


    class NoteControllerTest extends TestCase {

        protected $controller;
        protected $service;
        protected $userId = 'john';
        protected $request;

        public function setUp() {
            $this->request = $this->getMockBuilder(OCP\IRequest::class)->getMock();
            $this->service = $this->getMockBuilder(OCA\NotesTutorial\Service\NoteService::class)
                ->disableOriginalConstructor()
                ->getMock();
            $this->controller = new NoteController(
                'notestutorial', $this->request, $this->service, $this->userId
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
    namespace OCA\NotesTutorial\Tests\Unit\Service;

    use PHPUnit\Framework\TestCase;

    use OCP\AppFramework\Db\DoesNotExistException;

    use OCA\NotesTutorial\Db\Note;

    class NoteServiceTest extends TestCase {

        private $service;
        private $mapper;
        private $userId = 'john';

        public function setUp() {
            $this->mapper = $this->getMockBuilder(OCA\NotesTutorial\Db\NoteMapper::class)
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
         * @expectedException OCA\NotesTutorial\Service\NotFoundException
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

If `PHPUnit in version 8 is installed <https://phpunit.de/>`_ we can run the tests inside **notestutorial/** with the following command::

    phpunit

Integration tests
-----------------

Integration tests are slow and need a fully working instance but make sure that our classes work well together. Instead of mocking out all classes and parameters we can decide whether to use full instances or replace certain classes. Because they are slow we don't want as many integration tests as unit tests.

In our case we want to create an integration test for the update method without mocking out the **NoteMapper** class so we actually write to the existing database.

To do that create a new file called **notestutorial/tests/Integration/NoteIntegrationTest.php** with the following content:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Tests\Integration\Controller;

    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\App;
    use Test\TestCase;

    use OCA\NotesTutorial\Db\Note;
    use OCA\NotesTutorial\Controller\NoteController;
    use OCA\NotesTutorial\Db\NoteMapper;

    /**
     * @group DB
     */
    class NoteIntegrationTest extends TestCase {

        private Notecontroller $controller;
        private NoteMapper $mapper;
        private string $userId = 'john';

        public function setUp() {
            parent::setUp();
            $app = new App('notestutorial');
            $container = $app->getContainer();

            // only replace the user id
            $container->registerService('UserId', function($c) {
                return $this->userId;
            });

            $this->controller = $container->get(NoteController::class);

            $this->mapper = $container->get(NoteMapper::class);
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

To run the integration tests change into the **notestutorial** directory and run::

    phpunit -c phpunit.integration.xml


Building the frontend
---------------------

To create a modern webapp you need to write :doc:`JavaScript<../basics/front-end/js>`.
You can use any JavaScript framework, but this tutorial focusses on a simple frontend using Vue.js.
For a more detailed introduction to Vue.js please head over to the `official documentation <https://vuejs.org/v2/guide/>`_.

The source files of our frontend will be stored in the **src/** directory.
We use webpack for bundling the files and output of that will be stored in **js/notestutorial-main.js**.

The template of our view will be very simple due to the fact that Vue.js is taking care of all frontend rendering.
We only need to load the main script bundle by changing our :code:`PageController::index()` method:

.. code-block:: php

    public function index() {
        OCP\Util::addScript('notestutorial', 'notestutorial-main');
        return new TemplateResponse('notestutorial', 'main');
    }

And just add a div that will be replaced by our Vue app at runtime in the template:

.. code-block:: php

    <?php
    <div id="content"></div>

* `package.json <https://github.com/nextcloud/app-tutorial/blob/master/package.json>`_ Listing the dependencies of our frontend app
* `webpack.common.js <https://github.com/nextcloud/app-tutorial/blob/master/webpack.common.js>`_ Webpack configuration for building the javascript code

The frontend source code will consist of two files:

* `main.js <https://github.com/nextcloud/app-tutorial/blob/master/src/main.js>`_ which is the main entry point of our javascript code that gets loaded when the page is opened
* `App.vue <https://github.com/nextcloud/app-tutorial/blob/master/src/App.vue>`_ which is our one single file component that takes care of all logic inside of the Vue app. Our example app contains some additional comments to explain how the frontend is built.

Congratulations! You've written your first Nextcloud app. You can now either try to further improve the tutorial notes app or start writing your own app.


Adding a RESTful API (optional)
-------------------------------

A :doc:`RESTful API <../digging_deeper/rest_apis>` allows other apps such as Android or iPhone apps to access and change your notes. Since syncing is a big core component of Nextcloud it is a good idea to add (and document!) your own RESTful API.

Because we put our logic into the **NoteService** class it is very easy to reuse it. The only pieces that need to be changed are the annotations which disable the CSRF check (not needed for a REST call usually) and add support for `CORS <https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`_ so your API can be accessed from other webapps.

With that in mind create a new controller in **notestutorial/lib/Controller/NoteApiController.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Controller;

    use OCP\IRequest;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\ApiController;

    use OCA\NotesTutorial\Service\NoteService;

    class NoteApiController extends ApiController {

        private NoteService $service;
        private ?string $userId;

        use Errors;

        public function __construct(string $appName, IRequest $request,
                                    NoteService $service, ?string $userId = null) {
            parent::__construct($appName, $request);
            $this->service = $service;
            $this->userId = $userId;
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

    curl -u user:password http://localhost:8080/index.php/apps/notestutorial/api/0.1/notes

Since the **NoteApiController** is basically identical to the **NoteController**, the unit test for it simply inherits its tests from the **NoteControllerTest**. Create the file **notestutorial/tests/Unit/Controller/NoteApiControllerTest.php**:

.. code-block:: php

    <?php
    namespace OCA\NotesTutorial\Tests\Unit\Controller;

    require_once __DIR__ . '/NoteControllerTest.php';

    class NoteApiControllerTest extends NoteControllerTest {

        public function setUp() {
            parent::setUp();
            $this->controller = new NoteApiController(
                'notestutorial', $this->request, $this->service, $this->userId
            );
        }

    }
