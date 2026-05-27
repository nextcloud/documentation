.. _dev-glossary:

========
Glossary
========

This page explains the concepts and terms you will encounter throughout the developer documentation and
tutorials. You do not need to read it all before you begin — bookmark it and come back when something
does not quite make sense.

.. contents::
   :local:
   :depth: 1

----

The language and platform
--------------------------

PHP
^^^

PHP is the programming language Nextcloud is written in. It runs on the server; users never see your
PHP code directly. The server executes it and sends back the result (usually an HTML page or JSON
data). PHP files end in ``.php``.

If you have done an introductory programming course in Python or JavaScript, PHP will look familiar:
it has variables (``$name``), functions (``function greet() {}``), loops, and conditionals. The main
visual difference is that variables always start with a ``$`` sign.

Nextcloud
^^^^^^^^^

Nextcloud is a self-hosted collaboration platform. "Self-hosted" means you (or your organisation) run
the server yourselves, rather than relying on a third-party cloud service. Nextcloud itself is a PHP
application, and almost all of its features (Files, Calendar, Talk) are built as **apps** that plug
into a shared framework.

----

PHP concepts you will encounter
---------------------------------

Class
^^^^^

A class is a blueprint for creating objects. Think of a class like a template: a ``PageController``
class describes what a page controller *is* and what it can *do*. You define it once and the
framework creates ("instantiates") it when needed.

.. code-block:: php

    class PageController {
        public function index(): TemplateResponse {
            // This method handles a web request
        }
    }

Namespace
^^^^^^^^^

A namespace is like a folder path for your PHP classes; it prevents name collisions when two
different apps both define a class called ``Controller``.

Nextcloud uses three top-level namespaces:

- ``OCA\YourAppName\``: where your own app's private code lives.
- ``OCP\``: Nextcloud's stable public API. Use this to interact with Nextcloud's internals. It is
  versioned and will not break between Nextcloud releases.
- ``OC\``: internal legacy code. Avoid it in new apps — it carries no compatibility guarantee and
  can change between releases. You will come across it in existing code and documentation; some
  widely-used helpers (such as ``OC::$server->get()``) live here and remain in active use throughout
  the Nextcloud codebase itself.

In practice, you will see namespaces at the top of every PHP file:

.. code-block:: php

    namespace OCA\NoteBook\Controller;   // "I am part of the NoteBook app, in the Controller subfolder"

    use OCP\AppFramework\Controller;     // "I want to use Nextcloud's public Controller class"
    use OCP\IRequest;                    // "I want to use Nextcloud's public IRequest interface"

PHP 8 attributes
^^^^^^^^^^^^^^^^

Attributes are PHP 8's way of attaching metadata to a class or method. They look like
``#[SomeName]`` and appear on the line directly above what they describe.

In Nextcloud, you use attributes to configure routing and access control:

.. code-block:: php

    #[NoCSRFRequired]
    #[NoAdminRequired]
    #[FrontpageRoute(verb: 'GET', url: '/')]
    public function index(): TemplateResponse {

This replaces the older style of writing these as special docblock comments
(e.g. ``/** @NoCSRFRequired */``). Unlike comments, attributes are real PHP syntax; the framework
reads them directly.

Common attributes:

- ``#[FrontpageRoute]``: declares which URL this method responds to (for regular page routes).
- ``#[ApiRoute]``: same as above, but for :ref:`OCS API <ocs-api>` routes (used with ``OCSController``).
- ``#[NoAdminRequired]``: allows regular (non-admin) users to access this route.
- ``#[NoCSRFRequired]``: disables the CSRF token check — see :ref:`csrf` below.

.. _csrf:

CSRF and the ``#[NoCSRFRequired]`` attribute
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

CSRF (*Cross-Site Request Forgery*) is a web attack where a malicious site tricks your browser into
making a request to another site you are already logged into.

Nextcloud protects against this by requiring a hidden security token on most requests. When rendering
a page that users navigate to directly in their browser, there is no attack risk, so you mark it
``#[NoCSRFRequired]``. For routes that mutate data (saving a note, deleting a file), leave this
attribute off so the token is verified.

Dependency injection (DI)
^^^^^^^^^^^^^^^^^^^^^^^^^^

Dependency injection is a pattern where your class *asks for* what it needs rather than *creating it*
itself. Nextcloud automatically provides the right objects based on the type hints in your
constructor.

.. code-block:: php

    class NoteController extends Controller {
        public function __construct(
            string $appName,
            IRequest $request,
            protected NoteMapper $mapper,   // Nextcloud creates this and passes it in
            protected IConfig $config,      // stored as a protected property automatically
        ) {
            parent::__construct($appName, $request);
        }

You do not call ``new NoteMapper()`` yourself. Nextcloud's DI container reads the type hints
(``NoteMapper``, ``IConfig``) and automatically creates and injects the right object. This keeps
code loosely coupled and easy to test.

Interface
^^^^^^^^^

An interface (prefixed with ``I`` in Nextcloud's code, e.g. ``IRequest``, ``IConfig``) is a
contract that describes *what methods an object must have* without specifying *how* they work.
When you depend on ``IConfig``, Nextcloud can supply its real configuration implementation, or a
test double during unit tests, and your code does not care which it receives.

----

How web requests work in Nextcloud
------------------------------------

Route
^^^^^

A route maps a URL to a specific PHP method. When a user opens
``https://your-nextcloud.example/apps/notebook/``, Nextcloud looks up which method is registered
for that URL and calls it.

In modern Nextcloud apps, routes are declared directly on the method using the
``#[FrontpageRoute]`` attribute:

.. code-block:: php

    #[FrontpageRoute(verb: 'GET', url: '/')]
    public function index(): TemplateResponse {

You will sometimes see a dot-notation like ``notebook.page.index``. This means: app ``notebook``,
controller ``PageController``, method ``index``.

Controller
^^^^^^^^^^

A controller is a PHP class that handles incoming web requests. Each public method in a controller
can be mapped to a URL. The method receives data from the request, performs whatever work is needed,
and returns a response.

Nextcloud has several response types:

- ``TemplateResponse``: renders a PHP template file and returns HTML.
- ``JSONResponse``: returns JSON data (used for APIs).
- ``DataResponse``: like ``JSONResponse`` but with more flexibility over status codes and headers.

Template
^^^^^^^^

A template is a ``.php`` file in the ``templates/`` directory of your app. In modern Nextcloud apps
it is almost always just a single HTML mount point — a ``<div>`` that your Vue frontend attaches to.
The ID can be anything you like, as long as it matches the ``mount()`` call in your JavaScript:

.. code-block:: php

    <?php // templates/index.php — the entire file in a modern app ?>
    <div id="notebook"></div>

.. code-block:: javascript

    // src/main.js
    const app = createApp(App)
    app.mount('#notebook')

The controller loads the compiled JavaScript bundle and passes initial data using ``IInitialState``,
then returns the template:

.. code-block:: php

    // In the controller:
    $this->initialState->provideInitialState('notes', $this->mapper->findAll());
    Util::addScript('notebook', 'main');
    return new TemplateResponse('notebook', 'index');

The frontend picks up that data with ``loadState('notebook', 'notes')``; no PHP variables appear in
the template itself.

You may still encounter the older ``$_['key']`` / ``p()`` pattern in legacy apps:

.. code-block:: php

    <!-- Older style — still works, but not used in new development -->
    <p>Hello, <?php p($_['username']); ?></p>

``p()`` outputs a value safely (HTML-escaped). If you see it, it belongs to an older app.

----

Database concepts
------------------

Migration
^^^^^^^^^

A migration is a PHP file that describes a change to the database schema: creating a table, adding
a column, and so on. Rather than running SQL directly, you write a migration class and apply it with
:command:`occ migrations:migrate yourapp` (runs all pending migrations) or
:command:`occ migrations:execute yourapp versionnumber` (runs one specific migration by version
number, useful during development).

Migrations are stored in ``lib/Migration/`` and are numbered so they run in order. Anyone installing
your app gets the correct database structure automatically.

Entity
^^^^^^

An entity is a PHP class that represents a single row in a database table. Each property of the
class corresponds to a column. Nextcloud's app framework provides a base ``Entity`` class to extend:

.. code-block:: php

    class Note extends Entity {
        protected string $title = '';
        protected string $content = '';
        protected string $userId = '';
    }

Mapper
^^^^^^

A mapper is a PHP class responsible for reading and writing entities to the database. It extends
``QBMapper`` (Query Builder Mapper) and provides methods like ``find()``, ``findAll()``,
``insert()``, ``update()``, and ``delete()``. You inject the mapper into your controller via
dependency injection; you never write raw SQL yourself.

----

Frontend and build tools
--------------------------

npm and ``package.json``
^^^^^^^^^^^^^^^^^^^^^^^^^

npm is a package manager for JavaScript; it downloads and manages the JavaScript libraries your
frontend depends on. The list of dependencies lives in ``package.json``.

Common commands:

- :command:`npm install`: downloads all packages listed in ``package.json`` into ``node_modules/``.
- :command:`npm run build`: compiles your JavaScript for production.
- :command:`npm run watch`: compiles automatically each time you save a file (use this during
  development).

You only need to run :command:`npm install` once, or when dependencies change.

Vite
^^^^

Vite is a build tool that compiles modern JavaScript (and TypeScript, Vue components) into
browser-compatible files. You write your code in ``src/``, run :command:`npm run build` (or
:command:`npm run watch`), and Vite outputs ready-to-use files into ``js/``.

This step is necessary because browsers do not understand ES module imports
(``import { ref } from 'vue'``) directly — Vite bundles everything into files the browser can load.
The :command:`npm run build` and :command:`npm run watch` commands invoke Vite under the hood.

Composer and ``composer.json``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Composer is the PHP equivalent of npm; it manages PHP libraries. If your app has PHP dependencies
(for example, a Markdown parsing library), they are listed in ``composer.json`` and installed with
:command:`composer install`.

For most beginner apps, you will not need to touch Composer — the skeleton generator handles it.

----

Nextcloud-specific terms
--------------------------

App ID
^^^^^^

The app ID is the unique identifier for your app. You choose it when you create the app; it must be
lowercase and contain only letters, numbers, and underscores. It does not have to be derived from
your app's display name in any particular way.

The one hard rule is that **your folder name and the** ``<id>`` **in** ``appinfo/info.xml`` **must
be identical**. Nextcloud discovers apps by reading the folder name and then verifies it against
``info.xml``; if they do not match, the app will not load.

For example, an app with the display name "My NoteBook" could have the ID ``notebook``,
``mynotebook``, ``my_notebook``, or anything else you choose, as long as the folder and ``info.xml``
agree:

.. code-block:: text

    apps-extra/mynotebook/                    # folder name is "mynotebook"
    apps-extra/mynotebook/appinfo/info.xml    # <id>mynotebook</id>  must match

The same ID appears consistently throughout the codebase:

- The folder name (``apps-extra/mynotebook/``)
- ``appinfo/info.xml`` as ``<id>mynotebook</id>``
- PHP namespaces (``OCA\MyNoteBook\``) — PascalCase of the ID, but the ID itself is lowercase
- Route names (``mynotebook.page.index``)
- :command:`occ` commands (``occ app:enable mynotebook``)

``appinfo/info.xml``
^^^^^^^^^^^^^^^^^^^^^

Every Nextcloud app has this file. It tells Nextcloud the app's name, author, version, which
Nextcloud versions it supports, and whether it should appear in the navigation bar. Think of it as
your app's identity card.

The ``<max-version>`` field is important: if it is lower than your running Nextcloud version, the
app is blocked from loading. To find your Nextcloud version, go to
**Settings → Administration → Overview**. The ``<id>`` field must match your app ID and folder name
exactly.

``occ`` — the command-line tool
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``occ`` is Nextcloud's command-line interface. See the
`occ command reference <https://docs.nextcloud.com/server/latest/admin_manual/occ_command.html>`_
in the administration manual for the full list of commands.

In the **Docker** dev environment, prefix all :command:`occ` commands with ``docker exec``:

.. code-block:: bash

    docker exec --user www-data master-nextcloud-1 php occ app:enable notebook

In **GitHub Codespaces**, run :command:`occ` directly in the terminal:

.. code-block:: bash

    sudo -E -u www-data php occ app:enable notebook

Common commands:

.. list-table::
   :header-rows: 1

   * - Command
     - What it does
   * - ``occ app:enable notebook``
     - Enable your app
   * - ``occ app:disable notebook``
     - Disable your app
   * - ``occ app:list``
     - List all installed apps
   * - ``occ migrations:migrate notebook``
     - Run all pending migrations for your app
   * - ``occ migrations:execute notebook 20240101120000``
     - Run a single specific migration by version number
   * - ``occ maintenance:mode --on``
     - Put Nextcloud in maintenance mode

.. _ocs-api:

OCS API
^^^^^^^^

OCS (Open Collaboration Services) is an HTTP API format that Nextcloud uses for app-to-app and
client-to-server communication. When you build a REST API in a Nextcloud app, you extend
``OCSController`` instead of the plain ``Controller`` class. Responses follow a specific envelope
format with JSON that the Nextcloud mobile and desktop clients know how to handle.

ExApp (external app)
^^^^^^^^^^^^^^^^^^^^^

An ExApp is an app that runs as a separate process outside of Nextcloud's PHP process and
communicates with Nextcloud over HTTP. ExApps can be written in any language (Python, Go, Node.js).
They register themselves with Nextcloud using the AppAPI.

Classic PHP apps and ExApps are covered in separate sections of this documentation. If you are new
to Nextcloud development, start with classic PHP apps.

----

General web development terms
-------------------------------

API (Application Programming Interface)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

An API is a defined way for two pieces of software to talk to each other. In web development, this
usually means one program sends an HTTP request to a URL, and the other responds with structured
data (usually JSON). When your JavaScript frontend needs to load or save data, it makes an API call
to your PHP backend.

JSON
^^^^

JSON (JavaScript Object Notation) is a text format for structured data:

.. code-block:: json

    {
      "id": 1,
      "title": "My first note",
      "content": "Hello, world!"
    }

JSON is used everywhere as the common language between a frontend and a backend.

AJAX
^^^^

AJAX refers to making HTTP API calls from JavaScript without reloading the page. When you click
"Save" in a web app and the page does not refresh, that is AJAX. In Nextcloud apps, you will
typically use the ``@nextcloud/axios`` library to make AJAX calls to your PHP controller.
