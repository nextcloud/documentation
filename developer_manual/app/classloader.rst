===========
Classloader
===========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The classloader is provided by Nextcloud and loads all your classes automatically. The only thing left to include by yourself are 3rdparty libraries. Those should be loaded in :file:`lib/AppInfo/Application.php`.

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
