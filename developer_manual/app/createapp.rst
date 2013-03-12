Create An App
=============

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
      <require>6</require>
  </info>

For more information on the content of :file:`appinfo/info.xml` and what can be set, see: :doc:`info`

Enable the app
--------------
The easiest way to enable is to symlink it into the **owncloud/apps** directory::

    ln -s /var/www/apps/YOUR_APP /var/www/owncloud/apps/

This is also how other apps from the **apps** directory have to be enabled. A second way is to tell ownCloud about the directory. Use :doc:`../core/configfile` to set up multiple app directories.

The app can now be enabled on the ownCloud apps page.

.. note:: The app does not show up yet in the navigation. This is intended. How to create an entry in the navigation is explained in the following tutorials.

Start coding
------------
The basic files are now in place and the app is enabled. There are two ways to create the app:

* :doc:`Use ownClouds app API <tutorial>`
* :doc:`Use the App Framework app <../appframework/tutorial>`

+-----------------+-------------------------+--------------------------------+
| Criteria        | ownCloud app API        | App Framework                  |
+=================+=========================+================================+
| Difficulty      | easy                    | medium                         |
+-----------------+-------------------------+--------------------------------+
| Architecture    | none                    | MVC                            |
+-----------------+-------------------------+--------------------------------+
| Testability     | hard                    | easy: built-in :doc:`\         |
|                 |                         | ../general/dependencyinjection`|
|                 |                         | and `TDD`_ tools               |
+-----------------+-------------------------+--------------------------------+
| Maintainability | hard                    | medium                         |
+-----------------+-------------------------+--------------------------------+
| Templates       | :php:class:`OC_Template`| :php:class:`OC_Template`       |
|                 |                         | and `Twig`_                    |
+-----------------+-------------------------+--------------------------------+
| Security        | manual checks           | enforces XSS, CSRF and         |
|                 |                         | Authentication checks by       |
|                 |                         | default                        |
+-----------------+-------------------------+--------------------------------+

.. _Twig: http://twig.sensiolabs.org
.. _TDD: http://en.wikipedia.org/wiki/Test-driven_development
.. _Dependency Injection: 