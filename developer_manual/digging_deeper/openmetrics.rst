=====================
Open Metrics exporter
=====================

.. versionadded:: 33.0

Nextcloud allows to export metrics using `OpenMetrics <https://openmetrics.io/>`_ format.

The data is available on the ``/metrics`` endpoint and can then be imported into any OpenMetrics (formerly Prometheus) enabled tool.


Register a new exporter
-----------------------

Each exporter must be registered inside **<myapp>/appinfo/info.xml**:

.. code-block:: xml

    <openmetrics>
        <exporter>OCA\MyApp\OpenMetrics\CustomExporter</exporter>
        <exporter>OCA\MyApp\OpenMetrics\AnotherExporter</exporter>
    </openmetrics>


Implement a new exporter
------------------------

Then you need to implement it:

.. code-block:: php

    <?php

    declare(strict_types=1)

    namespace OCA\MyApp\OpenMetrics;

    use OCP\OpenMetrics\IMetricFamily;
    use OCP\OpenMetrics\MetricType;

    class CustomExporter implements IMetricFamily {
        public function __construct(
            // Add you dependencies here
        ) {
        }

        #[Override]
        public function name(): string {
            return 'myapp_metric';
        }

        #[Override]
        public function type(): MetricType {
           // One MetricType::*
            return MetricType::gauge;
        }

        #[Override]
        public function unit(): string {
            return 'units';
        }

        #[Override]
        public function help(): string {
            return 'Description of metric';
        }

        #[Override]
        public function metrics(): Generator {
            yield new Metric(
                42,
                ['label' => 'one value'],
            );
            yield new Metric(
                1337,
                ['label' => 'another value'],
            );
        }
    }

This exporter will add something like this on the ``/metrics`` endpoint:

.. code-block::

   # TYPE nextcloud_myapp_metric gauge
   # UNIT nextcloud_myapp_metric units
   # HELP nextcloud_myapp_metric Description of metric
   nextcloud_myapp_metric{label="one value"} 42
   nextcloud_myapp_metric{backend="another value"} 1337

