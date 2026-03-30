===================
New in this release
===================

This pages covers new features of the platform.

Task processing watermarks
--------------------------

- The ``\OCP\TaskProcessing\Task`` class now has ``getIncludeWatermark`` and ``setIncludeWatermark`` methods for indicating whether the provider should add a watermark to the generated output.
- The TaskProcessing OCS API now also accepts the ``includeWatermark`` flag when scheduling tasks