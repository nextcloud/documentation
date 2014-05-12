===========
Classloader
===========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The classloader is provided by ownCloud and loads all your classes automatically. The only thing left to include by yourself are 3rdparty libraries. Those should be loaded in :file:`appinfo/application.php`. 

The classloader works like this:

* Take the full qualifier of a class::

    \OCA\MyApp\Controller\PageController

* If it starts with \\OCA include file from the apps directory
* Cut off \\OCA::

    \MyApp\Controller\PageController

* Convert all charactes to lowercase::

    \myapp\controller\pagecontroller

* Replace \\ with /::

    /myapp/controller/pagecontroller

* Append .php::

    /myapp/controller/pagecontroller.php

* Prepend /apps because of the **OCA** namespace and include the file::

    require_once '/apps/myapp/controller/pagecontroller.php';

**In other words**: In order for the PageController class to be autoloaded, the class **\\OCA\\MyApp\\Controller\\PageController** needs to be stored in the :file:`/apps/myapp/controller/pagecontroller.php` 