==========
Monitoring
==========

OpenMetrics
-----------

.. versionadded:: 33

Nextcloud exposes a ``/metrics`` endpoint. By default, it responds only on localhost.
You can change this behaviour with :ref:`OpenMetrics configuration<label_openmetrics_config>`.

.. note:

   Please ensure this endpoint is not accessible to everyone as it could lead to some load on your server.


You can view the content of this endpoint with the following command:

::
  
  curl "https://your.domain/metrics"


