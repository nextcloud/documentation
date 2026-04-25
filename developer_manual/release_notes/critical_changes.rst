.. _critical-changes:

================
Critical changes
================

..
    Add one section for each change.
    Only list changes absolutely necessary to keep an app running. Use the dedicated deprecation and new features pages for optional changes and announcements.

    The sections are somewhat ordered so changes affecting most apps come first, and more specific ones come later.

info.xml requirements
---------------------

Update info.xml to add Nextcloud 34 to the support range:

.. code-block:: xml

  <dependencies>
    <nextcloud min-version="34" max-version="34" />
  </dependencies>

To allow installation on older versions too, just keep the previous min-version.

Removed front-end APIs and libraries
------------------------------------

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
  - ``Handlebars`` was deprecated and scheduled for removal since Nextcloud 19.


Removed back-end APIs
---------------------

- ``\OCP\Share_Backend``, ``\OCP\Share_Backend_Collection``, ``\OCP\Share_Backend_File_Dependent`` were removed. This old
  share backend was replaced in Nextcloud 9 with a new backend system based on ``IShareProvider``.


Unified sharing
---------------

.. todo::

    This is work in progress and needs an update when the changes have been finalized.

Changes to sharing APIs and user interface are planned. This includes both a new general API for sharing of entities and updates to the sharing user interface. See `nextcloud/server#51803 <https://github.com/nextcloud/server/issues/51803>`_ for details and mockups.


Navigation styling revisions
----------------------------

.. todo::

    This is work in progress and needs an update when the changes have been finalized.

Styling of navigation components will be revised. See `nextcloud-libraries/nextcloud-vue#7222 <https://github.com/nextcloud-libraries/nextcloud-vue/issues/7222>`_ for details.


Sidebar tabs redesign
---------------------

.. todo::

    This is work in progress and needs an update when the changes have been finalized.

Sidebar tab components will be redesigned. See `nextcloud-libraries/nextcloud-vue#7520 <https://github.com/nextcloud-libraries/nextcloud-vue/issues/7520>`_ for details.


Settings title left-alignment
-----------------------------

.. todo::

    This is work in progress and needs an update when the changes have been finalized.

The title alignment of settings pages will be changed to left-aligned. See `nextcloud-libraries/nextcloud-vue#7641 <https://github.com/nextcloud-libraries/nextcloud-vue/issues/7641>`_ for details.
