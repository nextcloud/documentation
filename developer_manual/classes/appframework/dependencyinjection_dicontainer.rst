DIContainer
===========


This class extends Pimple (http://pimple.sensiolabs.org/) for reusability
To use this class, extend your own container from this.
Should you require it
you can overwrite the dependencies with your own classes by simply redefining
a dependency

.. php:namespace:: OCA\AppFramework\DependencyInjection
.. php:class:: DIContainer




  .. php:method:: __construct($appName)

    :param string $appName: the name of the app


    Put your class dependencies in here
