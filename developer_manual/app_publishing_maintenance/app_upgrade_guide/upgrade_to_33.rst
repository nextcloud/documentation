=======================
Upgrade to Nextcloud 33
=======================

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

- The global ``md5`` implementation is removed. It was deprecated since Nextcloud 20 and not used by Nextcloud anymore.
  If you still need a ``md5`` implementation you can just use some external package like `crypto-browserify <https://www.npmjs.com/package/crypto-browserify>`_.

Back-end changes
----------------

Added Events
^^^^^^^^^^^^

- TBD

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

- The ``\OCP\BackgroundJob\IJob::execute`` method was deprecated since Nextcloud 25 and was now removed.
  Instead use the ``IJob::start`` method, available since Nextcloud 25.
