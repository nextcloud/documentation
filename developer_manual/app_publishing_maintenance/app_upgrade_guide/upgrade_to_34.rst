=======================
Upgrade to Nextcloud 34
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

- ``OC.Dialogs.fileexists`` was deprecated and is now removed.
  Use the conflict picker from the ``@nextcloud/dialogs`` library instead.
- ``OC.Notifications`` was deprecated and is now removed.
  Use the notification API from the ``@nextcloud/dialogs`` library instead.
- ``OC.Apps`` was deprecated and is now removed.
  Use Vue components from the ``@nextcloud/vue`` instead.
- ``OC.*menu*`` methods were deprecated and are now removed.
  Use Vue components from the ``@nextcloud/vue`` instead.
- Magic handling of ``.live-relative-timestamp`` (elements with this class were automatically updated to show relative timestamps) was removed.
  Use the ``NcDateTime`` component from the ``@nextcloud/vue`` library instead
- The global ``snapper`` was deprecated and is now removed.
  For the app navigation please migrate your app to Vue
  and use the ``NcAppNavigation`` component from the ``@nextcloud/vue`` library instead.
- Some deprecated globally shared libraries were removed. If you still rely on them, you need to bundle them with your app:

  - ``jQuery`` was deprecated and scheduled for removal since Nextcloud 19.
  - ``jQuery UI`` was deprecated and scheduled for removal since Nextcloud 19.
  - ``Backbone`` was deprecated and scheduled for removal since Nextcloud 19.
  - ``OC.Files.Client`` as it was extending the ``Backbone``.


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

- TBD
