.. _appindex:

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>


.. toctree::
   :maxdepth: 2
   :hidden:

   changelog
   tutorial
   startapp
   init
   info
   classloader
   request
   routes
   middleware
   container
   controllers
   api
   templates
   js
   css
   l10n
   theming
   schema
   database
   configuration
   filesystem
   appdata
   users
   two-factor-provider
   hooks
   backgroundjobs
   settings
   logging
   migrations
   repair
   testing
   publishing
   code_signing

===============
App development
===============
.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Intro
-----

Before you start, please check if there already is a similar app in the `App Store <https://apps.nextcloud.com>`_ or the `GitHub organisation <https://github.com/nextcloud/>`_ that you could contribute to. Also, feel free to communicate your idea and plans in the `forum <https://help.nextcloud.com/>`_ so other contributors might join in.

Then, please make sure you have set up a development environment:

* :doc:`../general/devenv`

Before starting to write an app please read the security and coding guidelines:

* :doc:`../general/security`
* :doc:`../general/codingguidelines`

After this you can start with the tutorial

* :doc:`tutorial`

Once you are ready for publishing, check out the app store process:

* :doc:`publishing`

For enhanced security it is also possible to sign your code:

* :doc:`code_signing`

App development
---------------

Take a look at the changes in this version:

* :doc:`changelog`

Create a new app:

* :doc:`startapp`

Inner parts of an app:

* :doc:`init`
* :doc:`info`
* :doc:`classloader`

Requests
^^^^^^^^

How a request is being processed:

* :doc:`request`
* :doc:`routes`
* :doc:`middleware`
* :doc:`container`
* :doc:`controllers` | :doc:`api`

View
^^^^

The app's presentation layer:

* :doc:`templates`
* :doc:`js`
* :doc:`css`
* :doc:`l10n`
* :doc:`theming`

Storage
^^^^^^^

Create database tables, run Sql queries, store/retrieve configuration information and access the filesystem:

* :doc:`schema`
* :doc:`database`
* :doc:`configuration`
* :doc:`filesystem`

Authentication & users
^^^^^^^^^^^^^^^^^^^^^^

Creating, deleting, updating, searching, login and logout:

* :doc:`users`

Writing a two-factor auth provider:

* :doc:`two-factor-provider`

Hooks
^^^^^

Listen on events like user creation and execute code:

* :doc:`hooks`

Background jobs
^^^^^^^^^^^^^^^

Periodically run code in the background:

* :doc:`backgroundjobs`

Settings
^^^^^^^^

An app can register both admin settings as well as personal settings:

* :doc:`settings`

Logging
^^^^^^^

Log to the :file:`data/nextcloud.log`:

* :doc:`logging`

Migrations
^^^^^^^^^^

Migrations can be used to do database changes which are allowing apps a more granular updating mechanism:

* :doc:`migrations`

Repair steps
^^^^^^^^^^^^

Repair steps can be used to run code at various stages in app installation, uninstallation, migration and more:

* :doc:`repair`

Testing
^^^^^^^

Write automated tests to ensure stability and ease maintenance:

* :doc:`testing`

PHPDoc class documentation
^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud class and function documentation:

* `Nextcloud App API <https://api.owncloud.org/namespaces/OCP.html>`_
