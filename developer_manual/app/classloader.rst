===========
Classloader
===========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The classloader is provided by Nextcloud and loads all your classes automatically. The only thing left to include by yourself are 3rdparty libraries. Those should be loaded in :file:`lib/AppInfo/Application.php`.

.. versionadded:: 10

PSR-4 autoloading
-----------------

Since Nextcloud 10 there is a PSR-4 autoloader in place. The namespace **\\OCA\\MyApp**
is mapped to :file:`/apps/myapp/lib/`. Afterwards normal PSR-4 rules apply, so
a folder is a namespace section in the same casing and the class name matches
the file name.

If your appid can not be turned into the namespace by uppercasing the first
character, you can specify it in your **appinfo/info.xml** by providing a field
called **namespace**. The required namespace is the one which comes after the
top level namespace **OCA\\**, e.g.: for **OCA\\MyBeautifulApp\\Some\\OtherClass**
the needed namespace would be **MyBeautifulApp** and would be added to the
info.xml in the following way:

  .. code-block:: xml

    <?xml version="1.0"?>
    <info>
       <namespace>MyBeautifulApp</namespace>
       <!-- other options here ... -->
    </info>

A second PSR-4 root is available when running tests. **\\OCA\\MyApp\\Tests** is
thereby mapped to :file:`/apps/myapp/tests/`.

Legacy autoloading
------------------

The legacy classloader, deprecated since 10, is still in place and works like this:

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
