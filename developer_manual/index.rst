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
* :doc:`general/codingguidelines`
* :doc:`general/codereviews`
* :doc:`general/debugging`
* :doc:`general/kanban`
* :doc:`general/angular` | `AngularJS Documentation <http://angularjs.org/>`_
* :doc:`general/dependencyinjection` | `Pimple`_

App Developement
================

* :doc:`app/gettingstarted`
* :doc:`app/settings` | `Pimple`_
* :doc:`app/classloader`
* :doc:`app/api` | :php:class:`OCA\\AppFramework\\Core\\API`

Routing
-------
* :doc:`app/routes` | `Symfony Routing`_
* :php:class:`OCA\\AppFramework\\App`

Controllers
-----------
* :doc:`app/controllers` | :php:class:`OCA\\AppFramework\\Controller\\Controller`

Database Access
---------------
* :doc:`app/database` | :php:class:`OCA\\AppFramework\\Db\\Mapper`
* :doc:`app/data-migration`

Templates
---------
* :doc:`app/templates` | `Twig Templates`_ | :php:class:`OC_Template`
* :php:class:`OCA\\AppFramework\\Http\\TemplateResponse`



JavaScript & CSS
----------------
* :doc:`app/static`

Testing
-------
* :doc:`app/unittesting` | `PHPUnit`_
* :php:class:`OCA\\AppFramework\\Utility\\ControllerTestUtility`

Middleware
----------
* :doc:`app/middleware` | :php:class:`OCA\\AppFramework\\Middleware\\Middleware`
* :php:class:`OCA\\AppFramework\\Middleware\\Security\\SecurityMiddleware`
* :php:class:`OCA\\AppFramework\\Middleware\\Twig\\TwigMiddleware`

ownCloud Interfaces
-------------------

* :doc:`app/access`
* :doc:`app/externalapi`
* :doc:`app/filesystem`
* :doc:`app/hooks`
* :doc:`app/share-api`
* :doc:`app/vcategories`


Core Developement
=================
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