.. _appindex:

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

===============
App Development
===============

.. toctree::
   :maxdepth: 1
   :hidden:

   ../general/index
   tutorial
   main
   container
   routes
   info
   classloader
   controllers
   schema
   database
   templates
   js
   css
   middleware
   hooks
   backgroundjobs
   filesystem
   users
   l10n
   api
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
* :doc:`container`
* :doc:`routes`
* :doc:`info`
* :doc:`classloader`

Controllers
-----------
Contain the logic for each request

* :doc:`controllers`

Database
--------
Create database tables and run Sql queries:

* :doc:`schema`
* :doc:`database`

Templates
---------
Create the basic HTML markup of your app:

* :doc:`templates`

JavaScript & CSS
----------------
Add JavaScript and CSS to your app:

* :doc:`js`
* :doc:`css`

Middleware
----------
Hook before or after controller execution and exceptions:

* :doc:`middleware`

Hooks
-----
Listen on events like user creation and execute code:

* :doc:`hooks`

Background Jobs
---------------
Periodically run code in the background:

* :doc:`backgroundjobs`

Filesystem
----------
Accessing the filesystem:

* :doc:`filesystem`

Users
-----
Creating, deleting, updating, searching, login and logout:

* :doc:`users`

Translation
-----------
* :doc:`l10n`

Creating a RESTful API
----------------------
How to create an API that other apps can connect to:

* :doc:`api`

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