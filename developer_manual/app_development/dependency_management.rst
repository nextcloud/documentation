.. _app-dependencies:

=====================
Dependency management
=====================

It's possible to build a Nextcloud app with existing software packages.

.. _app-composer:

Composer
--------

You can add 3rd party php packages with `Composer`_. Composer will download the specified packages to a directory of your choise, typically to ``/vendor``. In order to benefit from Composer's autoloader, you'll want to add a ``require_once`` to the ``register`` method of your ``Application`` class in the :ref:`bootstrapping<Bootstrapping>` code of your app.

.. note:: Be careful with which packages you add to an app. Php can not load two version of the same class twice, hence there can be conflicts between Nextcloud Server and an app or between two or more apps if they ship the same library. So try to keep the number of libraries to a minimum.


.. _Composer: https://getcomposer.org/
