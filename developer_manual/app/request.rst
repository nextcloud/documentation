=================
Request lifecycle
=================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>, Morris Jobke <hey@morrisjobke.de>

A typical HTTP request consists of the following:

* **A URL**: e.g. /index.php/apps/myapp/something
* **Request Parameters**: e.g. ?something=true&name=tom
* **A Method**: e.g. GET
* **Request headers**: e.g. Accept: application/json

The following sections will present an overview over how that request is being processed to provide an in depth view over how Nextcloud works. If you are not interested in the internals or don't want to execute anything before and after your controller, feel free to skip this section and continue directly with defining :doc:`your app's routes <routes>`.

Front controller
================
In the beginning, all requests are sent to Nextcloud's :file:`index.php` which in turn executes :file:`lib/base.php`. This file inspects the HTTP headers, abstracts away differences between different Web servers and initializes the basic classes. Afterwards the basic apps are being loaded in the following order:

* Authentication backends
* Filesystem
* Logging

The type of the app is determined by inspecting the app's :doc:`configuration file <info>` (:file:`appinfo/info.xml`). Loading apps means that the :doc:`main file <init>` (:file:`appinfo/app.php`) of each installed app is being loaded and executed. That means that if you want to execute code before a specific app is being run, you can place code in your app's :doc:`init` file.

Afterwards the following steps are performed:

* Try to authenticate the user
* Load and execute all the remaining apps' :doc:`init` files
* Load and run all the routes in the apps' :file:`appinfo/routes.php`
* Execute the router

Router
======
The router parses the :doc:`app's routing files <routes>` (:file:`appinfo/routes.php`), inspects the request's **method** and **url**, queries the controller from the :doc:`container` and then passes control to the dispatcher. The dispatcher is responsible for running the hooks (called Middleware) before and after the controller, executing the controller method and rendering the output.

Middleware
==========
A :doc:`Middleware <middleware>` is a convenient way to execute common tasks such as custom authentication before or after a :doc:`controller method <controllers>` is being run. You can execute code at the following locations:

* before the call of the controller method
* after the call of the controller method
* after an exception is thrown (also if it is thrown from a middleware, e.g. if an authentication fails)
* before the output is rendered

Container
=========
The :doc:`container` is the place where you define all of your classes and in particular all of your controllers. The container is responsible for assembling all of your objects (instantiating your classes) that should only have one single instance without relying on globals or singletons. If you want to know more about why you should use it and what the benefits are, read up on the topic in :doc:`container`.

Controller
==========

The :doc:`controller <controllers>` contains the code that you actually want to run after a request has come in. Think of it like a callback that is executed if everything before went fine. 

The controller returns a response which is then run through the middleware again (afterController and beforeOutput hooks are being run), HTTP headers are being set and the response's render method is being called and printed.
