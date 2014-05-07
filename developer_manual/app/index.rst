.. _appindex:

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

===============
App Development
===============

.. toctree::
   :maxdepth: 1
   :hidden:

   ../general/index
   main
   info
   classloader
   routes
   middleware
   container
   controllers
   api
   templates
   js
   css
   l10n
   schema
   database
   filesystem
   users
   hooks
   backgroundjobs
   logging
   userbackend
   filesystembackend
   testing


Intro
=====

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `user mailing list <http://mailman.owncloud.org/mailman/listinfo/user>`_ or `developer mailing list <http://mailman.owncloud.org/mailman/listinfo/devel>`_ so other contributors might join in.

Then, please make sure you have set up a development environment:

* :doc:`../general/devenv`

Before starting to write an app please read the security and coding guidelines:

* :doc:`../general/security`
* :doc:`../general/codingguidelines`

After this you can start to write your first app:

* :doc:`tutorial`

App development
===============
Inner parts of an app:

* :doc:`main`
* :doc:`info`
* :doc:`classloader`

Requests
--------
How a request is being processed:

* :doc:`request`
* :doc:`routes`
* :doc:`middleware`
* :doc:`container`
* :doc:`controllers` | :doc:`api`

View
----
The app's presentation layer:

* :doc:`templates`
* :doc:`js`
* :doc:`css`
* :doc:`l10n`

Model (Database access)
-----------------------
Create database tables and run Sql queries:

* :doc:`schema`
* :doc:`database`


Filesystem
----------
Accessing the filesystem:

* :doc:`filesystem`

Users
-----
Creating, deleting, updating, searching, login and logout:

* :doc:`users`

Hooks
-----
Listen on events like user creation and execute code:

* :doc:`hooks`

Background Jobs
---------------
Periodically run code in the background:

* :doc:`backgroundjobs`

Logging
-------
Log to the :file:`data/owncloud.log`:

* :doc:`logging`

Backends
--------
Plug into ownCloud user management or filesystem:

* :doc:`userbackend`
* :doc:`filesystembackend`

Testing
-------
Write automated tests to ensure stability and ease maintenance:

* :doc:`testing`

PHPDoc Class Documentation
--------------------------
ownCloud class and function documentation:

* `ownCloud App API <http://api.owncloud.org/namespaces/OCP.html>`_