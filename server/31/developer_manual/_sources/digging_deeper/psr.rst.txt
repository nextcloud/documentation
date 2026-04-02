.. _PSR:

===
PSR
===

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

On this page you find information about the implemented `php standards recommendations <https://www.php-fig.org/psr/>`_ in Nextcloud.

.. _psr0:

PSR-0: Autoloading
------------------

This standard has been deprecated and will be removed in Nextcloud 27. Please see the :ref:`PSR-4 section<psr4>` instead.

.. _psr3:

PSR-3: Logger Interface
-----------------------

.. versionadded:: 19

The dependency injection container can inject an instance of a ``\Psr\Log\LoggerInterface``.
The `PSR-3`_ implementation shall easy the integration of 3rd party libraries that require the `PSR-3`_ logger.

.. versionchanged:: 21
    Nextcloud ships version 1.1.3
.. versionchanged:: 23
    Nextcloud ships version 1.1.4
.. versionchanged:: 30
    Nextcloud ships version 2.0.0
.. versionchanged:: 31
    The ``\Psr\Log\LoggerInterface`` fully replaced the Nextcloud internal logging methods.

.. _psr4:

PSR-4: Autoloading
------------------

The `PSR-4` standard describes how class files should be named, so Nextcloud can automatically load them. See the :ref:`classloader docs<appclassloader>` for details.

.. _psr11:

PSR-11: Container Interface
---------------------------

.. versionadded:: 20

The dependency injection container follows the `PSR-11`_ container interface, so you may type-hint ``\Psr\Container\ContainerInterface`` whenever you want an instance of a container and use ``has($id)`` to check for existence and ``get($id)`` to retrieve an instance of a service. See the :ref:`dependency injection docs <dependency-injection>` for details.

.. versionchanged:: 22
    Nextcloud ships version 1.1.1
.. versionchanged:: 27
    Nextcloud ships version 2.0.2

.. _psr20:

PSR-20: Clock
-------------

.. versionadded:: 27

The ``\OCP\AppFramework\Utility\ITimeFactory`` class follows the `PSR-20`_ clock interface, so you may type-hint ``\PSR\Clock\ClockInterface`` and then use the ``now()`` method whenever you want to get the current time. You can also change the timezone for the to be returned ``\DateTimeImmutable`` instance, by getting a new ``ITimeFactory`` from ``ITimeFactory::withTimeZone()``.

.. _`PSR-0`: https://www.php-fig.org/psr/psr-0/
.. _`PSR-3`: https://www.php-fig.org/psr/psr-3/
.. _`PSR-4`: https://www.php-fig.org/psr/psr-4/
.. _`PSR-11`: https://www.php-fig.org/psr/psr-11/
.. _`PSR-20`: https://www.php-fig.org/psr/psr-20/
