.. _appclassloader:

===========
Classloader
===========
.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The classloader is provided by Nextcloud and loads all your classes automatically. See :ref:`the composer section<app-composer>` if you want to include and autoload 3rd party libraries.

.. _app-psr4-autoloader:

PSR-4 autoloading
-----------------

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
--------------------------------

Nextcloud's autoloader for apps is flexible and robust but not always the fastest. You can improve the loading speed of your app by shipping and optimizing a Composer class loader with the app.

First of all, familiarize yourself with the `Composer autoloader optimization options <https://getcomposer.org/doc/articles/autoloader-optimization.md>`_ and how they work. Only level 1 optimization is suited for Nextcloud because authoritative class maps break upgrade processes where code is replaced dynamically and APCu is not a required extension.

Once Composer is set up and class maps have been dumped, you can replace the generic Nextcloud class loader with the Composer class loader. This is done by placing a file at `composer/autoload.php`. If Nextcloud finds this file for an app, no generic class loader will be registered. The following contents will wire the file to Composer's generated ``autoloader.php`` file:

.. code-block:: php
  :caption: composer/autoload.php

  <?php

  declare(strict_types=1);

  require_once __DIR__ . '/../vendor/autoload.php';


.. note:: Make sure the auto loader is generated at release time and all files are included in the release tarball
