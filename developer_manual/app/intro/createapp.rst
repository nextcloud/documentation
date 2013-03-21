Creating An App
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

After the apps were cloned into either 

* **/var/www**
* **/var/www/html**
* **/srv/http** 

Depending on the used distribution change into that directory inside a terminal::

    cd /var/www/

Next create a directory for the app and make it writable::

    mkdir apps/YOUR_APP
    sudo chown -R YOUR_USER:users apps/YOUR_APP

If you are unsure about your user **whoami** to find out your user::

    whoami

Create basic files
------------------
The following files need to be created: :file:`appinfo/info.xml`, :file:`appinfo/version` and :file:`appinfo/app.php`. To do that change into the directory of your app::

    cd apps/YOUR_APP
    mkdir appinfo
    touch appinfo/version appinfo/app.php appinfo/info.xml

Set app version
---------------
To set the version of the app, simply write the following into :file:`appinfo/version`::

    0.1

Create metadata
---------------
ownCloud has to know what your app is. This information is located inside the :file:`appinfo/info.xml`:

.. code-block:: xml

  <?xml version="1.0"?>
  <info>
      <id>appname</id>
      <name>My App</name>
      <description>Simple app that does some computing</description>
      <version>1.0</version>
      <licence>AGPL</licence>
      <author>Your Name</author>
      <require>5</require>
  </info>

For more information on the content of :file:`appinfo/info.xml` see: :doc:`../app/info`

Enable the app
--------------
The easiest way to enable is to symlink it into the **owncloud/apps** directory::

    ln -s /var/www/apps/YOUR_APP /var/www/owncloud/apps/

This is also how other apps from the **apps** directory have to be enabled. A second way is to tell ownCloud about the directory. Use :doc:`../../core/configfile` to set up multiple app directories.

The app can now be enabled on the ownCloud apps page.

.. note:: The app does not show up yet in the navigation. This is intended. How to create an entry in the navigation is explained in the following tutorials.

Start coding
------------
The basic files are now in place and the app is enabled. There are two ways to create the app:

* Use the :doc:`ownCloud app API <../app/tutorial>`
* Use the :doc:`App Framework app <../appframework/tutorial>`

If you are new to programming and want to create an app fast you migth want to use the ownCloud app API, if you are an advanced programmer or used to frameworks you might want to use the App Framework App.

.. _appframework-compare:

App Framework Comparison
^^^^^^^^^^^^^^^^^^^^^^^^

To simplify the decision see this comparison chart:

+-----------------+-------------------------+--------------------------------+
| Criteria        | ownCloud app API        | App Framework                  |
+=================+=========================+================================+
| Difficulty      | easy                    | medium                         |
+-----------------+-------------------------+--------------------------------+
| Architecture    | routes and templates    | routes and MVC                 |
+-----------------+-------------------------+--------------------------------+
| Testability     | hard                    | easy: built-in :doc:`\         |
|                 |                         | ../general/dependencyinjection`|
|                 |                         | and `TDD`_ tools               |
+-----------------+-------------------------+--------------------------------+
| Maintainability | hard                    | easy                           |
+-----------------+-------------------------+--------------------------------+
| Templates       | :php:class:`OC_Template`| :php:class:`OC_Template`       |
|                 |                         | and `Twig`_                    |
+-----------------+-------------------------+--------------------------------+
| Security        | manual checks           | escapse XSS (Twig only), does  |
|                 |                         | CSRF and Authentication checks |
|                 |                         | by default                     |
+-----------------+-------------------------+--------------------------------+

.. _Twig: http://twig.sensiolabs.org
.. _TDD: http://en.wikipedia.org/wiki/Test-driven_development
