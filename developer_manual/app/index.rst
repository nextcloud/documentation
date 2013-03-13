.. _appindex:

================
App Developement
================

.. toctree::
   :maxdepth: 1
   :hidden:

   general/index
   intro/index
   app/index
   appframework/index

Intro
-----
Before starting to write an app please read the security and coding guidelines:

* :doc:`general/security`
* :doc:`general/codingguidelines`

After this you can start to write your app:

* :doc:`intro/gettingstarted`
* :doc:`intro/createapp`

App Development using ownCloud App API
--------------------------------------
You can choose between the traditional and MVC style (App Framework) approach. This approach uses the basic ownCloud libraries and provides no classes to use for MVC development and testing. 

* :doc:`app/tutorial`

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
* :doc:`appframework/container`

Routes
~~~~~~
Match an URL and call a controller

* :doc:`appframework/routes`

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


API Documentation
~~~~~~~~~~~~~~~~~
* :doc:`appframework/api/index`
* `ownCloud App API <http://api.owncloud.org/namespaces/OCP.html>`_

Further Information
-------------------
General useful information

* `git crash course <http://git-scm.com/course/svn.html>`_
* :doc:`general/debugging`
* :doc:`general/angular` | `AngularJS Documentation <http://angularjs.org/>`_
* :doc:`general/dependencyinjection` | `Pimple <http://pimple.sensiolabs.org/>`_

