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
- New interface ``\OCP\Share\IShareProviderSupportsAllSharesInFolder`` extending ``\OCP\Share\IShareProvider`` to add the method ``\OCP\Share\IShareProviderSupportsAllSharesInFolder::getAllSharesInFolder`` used for querying all shares in a folder without filtering by user.
- New method ``\OCP\IUser::canChangeEmail`` allowing to check if the user backend allows the user to change their email address.
- New method ``\OCP\Files\IFilenameValidator::sanitizeFilename`` allowing to sanitize a given filename to comply with configured constraints.

Changed APIs
^^^^^^^^^^^^

- TBD

Deprecated APIs
^^^^^^^^^^^^^^^

- The files API endpoint ``/apps/files/api/v1/thumbnail/`` for generating previews is deprecated.
  Instead use the preview endpoint provided by Nextcloud core (``/core/preview``).
- The legacy method ``\OC_Helper::canExecute`` is deprecated, please use the ``OCP\IBinaryFinder`` instead.

Removed APIs
^^^^^^^^^^^^

- The ``scssphp`` package is no longer shipped with Nextcloud. This package was not used and deprecated since Nextcloud 22.
  If you need the package for your app, then you need to ship it yourself.
