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

Update info.xml to add Nextcloud 35 to the support range:

.. code-block:: xml

  <dependencies>
    <nextcloud min-version="35" max-version="35" />
  </dependencies>

To allow installation on older versions too, just keep the previous min-version.

Removed front-end APIs and libraries
------------------------------------

- TBD


Removed back-end APIs
---------------------

- TBD
