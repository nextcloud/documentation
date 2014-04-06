.. _appindex:

===============
App Development
===============

.. toctree::
   :maxdepth: 1
   :hidden:

   general/index
   intro/index
   app/index
   appframework/index

Intro
-----

Before you start, please check if there already is a `similar app <http://apps.owncloud.com>`_ you could contribute to. Also, feel free to communicate your idea and plans to the `user mailing list <http://mailman.owncloud.org/mailman/listinfo/user>`_ or `developer mailing list <http://mailman.owncloud.org/mailman/listinfo/devel>`_ so other contributors might join in.

Then, please make sure you have set up a development environment:

* :ref:`devenv`

Before starting to write an app please read the security and coding guidelines:

* :doc:`general/security`
* :doc:`general/codingguidelines`

After this you can start to write your app:

* :doc:`intro/createapp`

App Development using ownCloud App API
--------------------------------------
You can choose between the traditional and MVC style (App Framework) approach. For a comparison see :ref:`appframework-compare`. This approach uses the basic ownCloud libraries and provides no classes to use for MVC development and testing. 

* :doc:`app/tutorial`


General
~~~~~~~
Inner parts of an app

* :doc:`app/classloader`
* :doc:`app/routes`
* :doc:`app/info`
* :doc:`general/debugging`

Database
~~~~~~~~
Database access

* :doc:`app/schema` | :doc:`app/database`

Templates
~~~~~~~~~
HTML and inclusion of JavaScript and CSS

* :doc:`app/templates`

JavaScript & CSS
~~~~~~~~~~~~~~~~
* :doc:`app/static`
* :doc:`app/css`

Testing
~~~~~~~
* :doc:`app/acceptancetesting`

API Documentation
~~~~~~~~~~~~~~~~~
* `ownCloud App API <http://api.owncloud.org/namespaces/OCP.html>`_

App Development using the App Framework App
-------------------------------------------
Develop an app using an MVC Framework. The App Framework provides enhanced Security, MVC classes and testing tools but you need to read more until you can produce the first output.

* :doc:`appframework/tutorial`

General
~~~~~~~
Inner parts of an app

* :doc:`appframework/classloader`
* :doc:`appframework/container` | :doc:`general/dependencyinjection`
* :doc:`appframework/routes`
* :doc:`appframework/info`
* :doc:`general/debugging`

Controllers
~~~~~~~~~~~
Contain the logic for each request

* :doc:`appframework/controllers`

Database
~~~~~~~~
Database access

* :doc:`appframework/schema` | :doc:`appframework/database`

Templates
~~~~~~~~~
HTML and inclusion of JavaScript and CSS

* :doc:`appframework/templates`

JavaScript & CSS
~~~~~~~~~~~~~~~~
* :doc:`appframework/static`
* :doc:`general/angular` | :doc:`appframework/angularsetup` | :doc:`appframework/angular`
* :doc:`appframework/css`

Middleware
~~~~~~~~~~
Hook before or after controller execution

* :doc:`appframework/middleware`

Testing
~~~~~~~
* :doc:`appframework/unittesting`
* :doc:`app/acceptancetesting`

API Documentation
~~~~~~~~~~~~~~~~~
* :doc:`appframework/api/index`
* `ownCloud App API <http://api.owncloud.org/namespaces/OCP.html>`_

Additional APIs
---------------
Can be used with and without App Framework

* :doc:`appframework/data-migration`
* :doc:`appframework/hooks`
* :doc:`appframework/filesystem`

