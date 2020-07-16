===
PSR
===

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

On this page you find information about the implemented `php standards recommendations <https://www.php-fig.org/psr/>`_ in Nextcloud.

PSR-3: Logger Interface
-----------------------

As of Nextcloud 19, the dependency injection container can inject an instance of a ``\Psr\Log\LoggerInterface``. This is merely a wrapper of the existing (and strongly typed) ``\OCP\ILogger``. Apps may still use the Nextcloud logger, but the `PSR-3`_ implementation shall easy the integration of 3rd party libraries that require the `PSR-3`_ logger.

.. _psr11:

PSR-11: Container Interface
---------------------------

As of Nextcloud 20, the dependency injection container follows the `PSR-11`_ container interface, so you may start type-hinting ``\Psr\Container\ContainerInterface`` whenever you want an instance of a container and use ``has($id)`` to check for existance and ``get($id)`` to retrieve an instance of a service. See the :ref:`dependency injection docs <dependency-injection>` for details.

.. _`PSR-3`: https://www.php-fig.org/psr/psr-3/
.. _`PSR-11`: https://www.php-fig.org/psr/psr-11/
