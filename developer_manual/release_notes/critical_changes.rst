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

Update info.xml to add Nextcloud 36 to the support range:

.. code-block:: xml

  <dependencies>
    <nextcloud min-version="36" max-version="36" />
  </dependencies>

To allow installation on older versions too, just keep the previous min-version.

Removed front-end APIs and libraries
------------------------------------

- TBD

Removed back-end APIs
---------------------

- TBD

Unified sharing
---------------

.. todo::

    This is work in progress and needs an update when the changes have been finalized.

Changes to sharing APIs and user interface are planned. This includes both a new general API for sharing of entities and updates to the sharing user interface. See `nextcloud/server#51803 <https://github.com/nextcloud/server/issues/51803>`_ for details and mockups.
