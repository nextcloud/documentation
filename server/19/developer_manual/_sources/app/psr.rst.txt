===
PSR
===

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

On this page you find information about the implemented `php standards recommendations <https://www.php-fig.org/psr/>`_ in Nextcloud.

PSR-3: Logger Interface
-----------------------

As of Nextcloud 19, the dependency injection container can inject an instance of a ``\Psr\Log\LoggerInterface``. This is merely a wrapper of the existing (and strongly typed) ``\OCP\ILogger``. Apps may still use the Nextcloud logger, but the PSR-3 implementation shall easy the integration of 3rd party libraries that require the PSR-3 logger.
