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


General
~~~~~~~

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
* :doc:`app/javascript`
* :doc:`app/css`

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
* :doc:`appframework/javascript`
* :doc:`general/angular` | :doc:`appframework/angularsetup` | :doc:`appframework/angular`
* :doc:`appframework/css`

Middleware
~~~~~~~~~~
Hook before or after controller execution

* :doc:`appframework/middleware`

Testing
~~~~~~~
* :doc:`appframework/unittesting`

API Documentation
~~~~~~~~~~~~~~~~~
* :doc:`appframework/api/index`
* `ownCloud App API <http://api.owncloud.org/namespaces/OCP.html>`_

Additional APIs
---------------
Can be used with and without App Framework

* :doc:`appframework/data-migration`
* :doc:`appframework/externalapi`
* :doc:`appframework/hooks`
* :doc:`appframework/filesystem`

