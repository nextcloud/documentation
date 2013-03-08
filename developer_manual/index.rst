.. _index:

=======================
Developer Documentation
=======================


How to Contribute
=================
If you want to contribute please read the `Contributor agreement FAQ`_

* Fix and triage bugs: `Report an issue on our bug tracker`_
* `Translate <https://www.transifex.com/projects/p/owncloud/>`_ ownCloud to your language 
* Support users on the `mailing list`_ and on the `IRC channel`_
* Take a job from our `Junior Jobs`_
* Write and generate `documentation <https://github.com/owncloud/documentation>`_
* Conduct `usability testing`_
* Develop apps
* Spread the word, tell your friends about it, write a blog post!

Getting Help
============

* Ask a question on the `mailing list`_
* Join the `IRC channel`_ #owncloud-dev on irc.freenode.net
* `Contact`_ a maintainer of a certain app or division


General
=======
This chapter contains general guidelines and tutorials about

* :doc:`general/security`
* :doc:`general/codingguidelines`
* :doc:`general/codereviews`
* :doc:`general/debugging`
* :doc:`general/kanban`
* :doc:`general/angular` | `AngularJS Documentation <http://angularjs.org/>`_
* :doc:`general/dependencyinjection` | `Pimple`_

App Developement
================
General instructions how to build your apps using the AppFramework app. 

If the app is finished, it can be published in the `ownCloud app store <http://apps.owncloud.com/>`_

Tutorial
--------

* :doc:`app/gettingstarted`

You can choose between the traditional and MVC style (App Framework) approach. In case of the App Framework, the App Framework app has to be installed and enabled.

* :doc:`app/apptutorial` | :doc:`app/appframeworktutorial`

Basics
------
* :doc:`app/settings`
* :doc:`app/classloader`
* :doc:`app/api` | :php:class:`OCA\\AppFramework\\Core\\API`

Routing
-------
Routing connects URLs with the controller methods. 

* :doc:`app/routes`
* :php:class:`OCA\\AppFramework\\App`

Controllers
-----------
Controllers run the database queries, pass variables to templates and return responses like JSON or templates.

* :doc:`app/controllers` | :php:class:`OCA\\AppFramework\\Controller\\Controller`

Database Access
---------------
Encapsulate SQL queries into objects to be able to change them easily.

* :doc:`app/database` | :php:class:`OCA\\AppFramework\\Db\\Mapper`

Templates
---------
Use templates for managing HTML code.

* :doc:`app/templates` | :php:class:`OC_Template`
* :php:class:`OCA\\AppFramework\\Http\\TemplateResponse`



JavaScript & CSS
----------------
* :doc:`app/static`

Testing
-------
Automatically run unittests to prevent regressions.

* :doc:`app/unittesting`
* :php:class:`OCA\\AppFramework\\Utility\\ControllerTestUtility`

Middleware
----------
Execute code before or after the controller like Security checks.

* :doc:`app/middleware` | :php:class:`OCA\\AppFramework\\Middleware\\Middleware`
* :php:class:`OCA\\AppFramework\\Middleware\\Security\\SecurityMiddleware`
* :php:class:`OCA\\AppFramework\\Middleware\\Twig\\TwigMiddleware`

ownCloud Interfaces
-------------------
ownCloud APIs that are ready to be built into the app

* :doc:`app/externalapi`
* :doc:`app/filesystem`
* :doc:`app/hooks`
* :doc:`app/data-migration`


Core Developement
=================
Core related docs

* :doc:`core/translation`
* :doc:`core/unit-testing`
* :doc:`core/theming`
* :doc:`core/configfile`

API Documentation
=================
* :doc:`classes/appframework/index`
* :doc:`classes/core/index`

Index and Tables
================
* :ref:`genindex`
* :ref:`modindex`


.. _Contributor agreement FAQ: http://owncloud.org/about/contributor-agreement/

.. _mailing list: https://mail.kde.org/mailman/listinfo/owncloud
.. _IRC channel: irc://#owncloud-dev@irc.freenode.net
.. _Contact: http://owncloud.org/contact/

.. _Report an issue on our bug tracker: https://github.com/owncloud/core/issues
.. _Junior Jobs: http://owncloud.org/dev/junior-jobs/
.. _usability testing: http://jancborchardt.net/usability-in-free-software

.. _git crash course: http://git-scm.com/course/svn.html

.. _Twig Templates: http://twig.sensiolabs.org/
.. _Symfony Routing: http://symfony.com/doc/current/components/routing/introduction.html
.. _Pimple: http://pimple.sensiolabs.org/
.. _PHPUnit: http://www.phpunit.de/manual/current/en/

