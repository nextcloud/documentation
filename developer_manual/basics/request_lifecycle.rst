=================
Request lifecycle
=================

.. toctree::
   :maxdepth: 1

   container
   api

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>, Morris Jobke <hey@morrisjobke.de>

A typical HTTP request consists of the following:

* **A URL**: e.g. /index.php/apps/myapp/something
* **Request Parameters**: e.g. ?something=true&name=tom
* **A Method**: e.g. GET
* **Request headers**: e.g. Accept: application/json

The following sections will present an overview over how that request is being processed to provide an in depth view over how Nextcloud works. If you are not interested in the internals or don't want to execute anything before and after your controller, feel free to skip this section and continue directly with defining :doc:`your app's routes <routes>`.

Front controller
----------------

In the beginning, all requests are sent to Nextcloud's :file:`index.php` which in turn executes :file:`lib/base.php`. This file inspects the HTTP headers, abstracts away differences between different Web servers and initializes the basic classes. Afterwards the basic apps are being loaded in the following order:

* Authentication backends
* Filesystem
* Logging

The type of the app is determined by inspecting the app's :doc:`configuration file <../info>` (:file:`appinfo/info.xml`). Loading apps means that the :doc:`main file <../init>` (:file:`appinfo/app.php`) of each installed app is being loaded and executed. That means that if you want to execute code before a specific app is being run, you can place code in your app's :doc:`../init` file.

Afterwards the following steps are performed:

* Try to authenticate the user
* Load and execute all the remaining apps' :doc:`../init` files
* Load and run all the routes in the apps' :file:`appinfo/routes.php`
* Execute the router
