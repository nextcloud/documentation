App settings
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

You'll need to give some information on your app for instance the name. To do that open the :file:`appinfo/app.php` and adjust it like this

.. code-block:: php

  <?php

  // if you dont want to register settings for the admin, delete the following
  // line
  \OCP\App::registerAdmin('yourappname', 'admin/settings');

  \OCP\App::addNavigationEntry( array(

    // the string under which your app will be referenced
    // in owncloud, for instance: \OC_App::getAppPath('APP_ID')
    'id' => 'yourappname',

    // sorting weight for the navigation. The higher the number, the higher
    // it will be listed in the navigation
    'order' => 74,

    // the route that will be shown on startup
    'href' => \OC_Helper::linkToRoute('yourappname_index'),

    // the icon that will be shown in the navigation
    'icon' => \OCP\Util::imagePath('yourappname', 'example.png' ),

    // the title of your application. This will be used in the
    // navigation or on the settings page of your app
    'name' => \OC_L10N::get('yourappname')->t('Your App')

  ));

  ?>

.. _xml:

The second place where app specifc information is stored is in :file:`appinfo/info.xml`

.. code-block:: xml

  <?xml version="1.0"?>
  <info>
        <id>yourappname</id>
        <name>Your App</name>
        <description>Your App description</description>
        <version>1.0</version>
        <licence>AGPL</licence>
        <author>Your Name</author>
        <require>4</require>
        <types>
            <filesystem/>
        </types>
  </info>

ownCloud allows to specify four kind of "types" in the file:`appinfo/info.xml` of a app. The
type doesn't have to be specified if the app doesn't match any of them.

Currently supported "types":

* **prelogin**: apps which needs to load on the login page

* **filesystem**: apps which provides filesystem functionality (e.g. files sharing app)

* **authentication**: apps which provided authentication backends

* **logging**: apps which implement a logging system



Dependency Injection
--------------------
Dependency Injection helps you to create testable code. A good overview over how it works and what the benefits are can be seen on `Google's Clean Code Talks <http://www.youtube.com/watch?v=RlfLCWKxHJ0>`_

The container is configured in :file:`dependencyinjection/dicontainer.php`. By default Pimple is used as dependency injection container. The documentation on how to use it can be read on the `Pimple Homepage <http://pimple.sensiolabs.org/>`_

To add your own classes simply open the :file:`dependencyinjection/dicontainer.php` and add a line like this to the constructor:

.. code-block:: php

  <?php

  // in the constructor

  $this['MyClass'] = function($c){
      return new MyClass($c['SomeOtherClass']);
  };

  ?>

You can also overwrite already existing items from the App Framework simply by redefining them.

**See also** :doc:`../general/dependencyinjection`