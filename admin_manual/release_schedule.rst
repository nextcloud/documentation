================================
Maintenance and release schedule
================================

.. admonition:: TL;DR

   * Versioning scheme: ``MAJOR.MINOR.PATCH``
   * Latest major release = leading-edge supported release with the newest
     features and stable API additions
   * Oldest supported major release = most mature supported release still
     receiving security and critical bug fixes
   * Release cadence and lifecycle:

     - Major releases: released approximately every four months; supported
       through maintenance releases for twelve months after initial release
     - Maintenance releases: released approximately monthly for all supported
       major versions; limited to critical bug fixes and security fixes

Overview
--------

Nextcloud Server ``stable`` releases use a standard ``MAJOR.MINOR.PATCH``
versioning scheme. A release identified by the ``PATCH`` component is also
called a **maintenance release**.

``stable`` releases are point-in-time snapshots published by the maintainers.
They provide transition points for new features, architectural changes, major
dependency updates, API deprecations, and substantial technical debt reduction.
They also provide a consistent core user interface for end users and their
technical supporters, as well as a stable API surface for app developers.

Multiple ``stable`` major releases are supported at the same time. The
following sections describe the two ends of that support range.

The latest supported major version
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The **latest supported major version** is the leading-edge release deemed
generally ready for responsible production use by the core maintainers.

It provides the newest features, refinements, and optimizations while
introducing the latest stable API surfaces and capabilities for app developers.
It is likely to receive additional polishing for edge cases based on community
feedback during its early maintenance releases.

The oldest supported major version
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The **oldest supported major version** is the most mature and refined
option still actively receiving regular security and bug fixes. It has had
the longest period of production use and maintenance. It may have broader app
compatibility, depending on the apps you use, and typically broader community
support.

Choosing what version to install
--------------------------------

For upcoming Server release dates and the latest end-of-life projections,
see the `Maintenance and Release Schedule
<https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

When choosing a version for a new installation, select any supported major
version according to your needs. Choose the latest supported version for the
newest features, or the oldest supported version for the greatest maturity.

.. tip::
   Extended maintenance and additional support are available through
   `Nextcloud Enterprise services <https://nextcloud.com/enterprise/>`_,
   offered by Nextcloud GmbH, which employs many of the developers and core
   maintainers who work on Nextcloud.

Release types
-------------

Nextcloud has two types of releases in the default ``stable`` release
channel:

* **Major releases** introduce new features and functionality.
* **Maintenance releases** provide targeted fixes for supported major
  versions.

Major releases
~~~~~~~~~~~~~~

A major release is identified by the first part of the version number. For
example, ``28.0.4`` belongs to major version ``28``.

Major releases can introduce new features, behavioural changes, and changes to
system requirements. Apps may also need to be updated to support a new major
version.

.. tip::
   Before upgrading, review the *Critical changes* section
   of the :doc:`release notes <release_notes>` and verify that your apps support
   the target major version.

**New major releases** are generally published **every four months**. The
actual schedule is subject to change.

Each major release is supported through maintenance releases for twelve months
from its initial release. Enterprise support arrangements with Nextcloud GmbH
may provide longer support periods.

Maintenance releases
~~~~~~~~~~~~~~~~~~~~

A maintenance release is identified by the ``PATCH`` part of the version
number. For example, ``28.0.4`` is the fourth maintenance release for major
version ``28``.

Maintenance releases do not introduce new features or breaking changes. Their
content is limited to targeted or backported critical changes, including
critical bug fixes and security fixes.

**Maintenance releases** are published approximately **once per month** for
each supported major version. Critical fixes that affect more than one
supported major release are backported to all affected versions.

.. danger::
   Always install the latest maintenance release available for your chosen
   major version as soon as possible.

End of life
-----------

A major version reaches its end of life twelve months after its initial
release. After that anniversary, community maintenance releases, including
security fixes, cease.

.. tip::
   Try to complete your upgrade to the next supported major version before your
   current major version reaches end of life. With approximately three major
   releases every twelve months, you generally have eight to twelve months to
   plan the next major version upgrade, depending on when you upgrade.

The current maintenance status and planned end-of-life dates are published in
the `Maintenance and Release Schedule
<https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Release channels
----------------

By default, Nextcloud uses the ``stable`` release channel. This channel
provides releases that are ready for most users. New releases are introduced
gradually through staged roll-outs.

The ``stable`` channel may offer a newer major version before your current
major version reaches end of life. You are not required to upgrade immediately,
but you must upgrade before your current major version becomes unsupported.

Major version upgrades
----------------------

Before upgrading between major versions:

* Review the *Critical changes* section of the release notes.
* Check the compatibility of your apps.
* Verify that your system meets the target release's requirements.
* Create a backup and test that you can restore it.

Downgrading is not officially supported between major, maintenance, or
pre-release versions.

Bug reporting
-------------

Before reporting a bug, make sure that you are running a supported major
version and the latest maintenance release for that version.

Other release schedules
-----------------------

The following components are related to Nextcloud Server but do not necessarily
follow its versioning scheme or release schedule.

Pre-releases
~~~~~~~~~~~~

Community members can help with quality assurance and real-world testing by
deploying beta releases and release candidates. Use pre-releases in test
environments and be prepared to identify and report problems.

For archive-based installations, you can select the ``beta`` release
channel to test upcoming releases.

App releases
~~~~~~~~~~~~

Nextcloud apps, including *Recommended* and *Featured* apps but excluding
shipped core apps, have their own versioning schemes and release schedules.

Installers and deployment packages
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The main artifacts for a given Nextcloud Server release are the ``.tar.gz`` and
``.zip`` archives generated and published by the core project maintainers.
They are versioned as described above.

Most other Nextcloud installation packages, such as AIO and Snap, are
maintained as sub-projects or community projects. They each have their own
versioning schemes and release schedules, which may not coincide with those of
the core project.

Official clients
~~~~~~~~~~~~~~~~

All official clients (mobile, desktop) have their own versioning schemes and
release schedules.
