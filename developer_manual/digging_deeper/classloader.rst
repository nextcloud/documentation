.. _appclassloader:

===========
Classloader
===========
.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The classloader is provided by Nextcloud and loads all your classes automatically. See :ref:`the composer section<app-composer>` if you want to include and autoload 3rd party libraries.

Server autoloading
------------------

Classes of the Nextcloud server use an authoritative class map, and the class map is committed to git.

When you add, move or delete a class file you have to update the autoloaders for the class to be found. The process is slightly different for classes that belong to the server itself, and apps that are included in the server repository:

1. Use ``composer dump-autoload`` to update the server class map.
2. Use ``composer -d apps/dav/composer dump-autoload`` to update the class map of the dav app. The same applies for all other apps that are part of the server repository.

.. tip:: Use git's `patch option <https://git-scm.com/docs/git-add#Documentation/git-add.txt---patch>`_ when adding autoloader files. It allows you to pick only the lines relevant to the classes you added, moved or deleted. E.g. ``git add -p apps/dav/composer``.

.. _app-psr4-autoloader:

App autoloading
---------------

Nextcloud uses a  :ref:`PSR-4 autoloader<psr4>`. The namespace **\\OCA\\MyApp**
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

.. _app-custom-classloader:

Replacing Nextcloud's autoloader
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Nextcloud's autoloader for apps is flexible and robust but not always the fastest. You can improve the loading speed of your app by shipping and optimizing a Composer class loader with the app.

First of all, familiarize yourself with the `Composer autoloader optimization options <https://getcomposer.org/doc/articles/autoloader-optimization.md>`_ and how they work. Only level 1 optimization is suited for Nextcloud because authoritative class maps break upgrade processes where code is replaced dynamically and APCu is not a required extension.

Once Composer is set up and class maps have been dumped, you can replace the generic Nextcloud class loader with the Composer class loader. This is done by placing a file at `composer/autoload.php`. If Nextcloud finds this file for an app, no generic class loader will be registered. The following contents will wire the file to Composer's generated ``autoloader.php`` file:

.. code-block:: php
  :caption: composer/autoload.php

  <?php

  declare(strict_types=1);

  require_once __DIR__ . '/../vendor/autoload.php';


.. note:: Make sure the auto loader is generated at release time and all files are included in the release tarball
