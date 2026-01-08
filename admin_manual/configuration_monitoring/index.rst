==========
Monitoring
==========

OpenMetrics
-----------

.. versionadded:: 33

Nextcloud exposes a ``/metrics`` endpoint. By default, it responds only on localhost.
You can change this behaviour with ``openmetrics_allowed_clients``

::

  'openmetrics_allowed_clients' => [
    '192.168.0.0/16',
  ],


.. warning::

   Ensure this endpoint is not accessible to everyone as it could lead to some load on your server.


You can view the content of this endpoint with the following command:

::

  curl "https://your.domain/metrics"


If for some reason you want to disable some metrics (eg. if they take too long to generate), you can disable them by adding their class name into ``openmetrics_skipped_classes``

::

  'openmetrics_skipped_classes' => [
    'OC\OpenMetrics\Exporters\FilesByType',
  ],


.. seealso::

 Check :doc:`../configuration_server/config_sample_php_parameters` for more information
