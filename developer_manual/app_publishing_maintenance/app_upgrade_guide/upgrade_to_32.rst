=======================
Upgrade to Nextcloud 32
=======================

General
-------

- TBD

Front-end changes
-----------------

Added APIs
^^^^^^^^^^

- TBD

Changed APIs
^^^^^^^^^^^^

- TBD

Deprecated APIs
^^^^^^^^^^^^^^^

- TBD

Removed APIs
^^^^^^^^^^^^

- TBD

Back-end changes
----------------

Added APIs
^^^^^^^^^^

- New task processing task type ``OCP\TaskProcessing\TextToSpeech`` to convert text to speech.

Changed APIs
^^^^^^^^^^^^

- TBD

Deprecated APIs
^^^^^^^^^^^^^^^

- The files API endpoint ``/apps/files/api/v1/thumbnail/`` for generating previews is deprecated.
  Instead use the preview endpoint provided by Nextcloud core (``/core/preview``).

Removed APIs
^^^^^^^^^^^^

- The ``scssphp`` package is no longer shipped with Nextcloud. This package was not used and deprecated since Nextcloud 22.
  If you need the package for your app, then you need to ship it yourself.
