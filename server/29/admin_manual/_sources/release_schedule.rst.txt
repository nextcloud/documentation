================================
Maintenance and release schedule
================================

Overview
--------

Nextcloud releases multiple major versions *throughout* the year, but maintains support for *each* major version for one full year each through "lighter" maintenance updates (and regularly `backporting <https://en.wikipedia.org/wiki/Backporting>`_ applicable security and bug fixes). This permits a high velocity development cadence, while still giving administrators flexibility when planning deployments, upgrades, and maintenance activities.

A detailed `schedule for upcoming major and maintenance releases <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ (as well as end-of-life projections) is regularly updated to faciliate planning deployment, testing, and upgrade planning.

Whether you want the latest features and optimizations, want to help with testing, or just want to wait until everything is perfectly ready to go, you've got options with regards to which version of Nextcloud Server to initially deploy as well as how frequently to do major upgrades.

.. danger:: We always recommend installing the latest **maintenance** releases as soon as possible, regardless of which major version of Nextcloud Server you use. And we also always highly recommend upgrading from **end-of-life** releases as soon as possible.

.. tip:: Extended maintenance and additional support is available through `subscriptions options for enterprise support <https://nextcloud.com/enterprise/>`_ offered by Nextcloud developers through `Nextcloud GmbH <https://nextcloud.com>`_.

Release types
-------------

Nextcloud has two types of releases in the default release channel:

1. Major releases
2. Maintenance releases

**Major** releases of Nextcloud Server (e.g. ``28.X.X``) introduce new features and functionality. 

Every major release is, in turn, supported for *one year* via periodic **maintenance** releases (e.g. ``X.X.4``), which correct critical bugs and security vulnerabilities.

Major releases
~~~~~~~~~~~~~~

Major releases usually introduce new features and often also include changes "under the hood". These changes may be extensive. 

A specific major release is indicated by the first part of the version string. For example, Nextcloud Server ``28.0.4`` is major release ``28``. And ``27.1.7`` is major release ``27``.

.. tip:: The highest numbered major release offers the latest features. While the lowest numbered major release offers the most time in the field. 

.. note:: You may need to meet new system requirements before the Updater will offer you a new major version. Even if offered, there may be other changes required that the Updater cannot check for fully. We try to highlight these, in each new edition of the Admin Manual, in the Critical changes section of the *Release notes* chapter.

.. warning:: Apps generally define their compatibility based on the major version(s) of Nextcloud Server they support. Consider the compatibility of your favorite and most critical apps, with a prospective major version of Nextcloud Server, before choosing which major version to deploy or deciding when to upgrade to a newly available major version. Also, since many apps are community provided and maintained by volunteers, you may want to offer to test the app against a new major version of Nextcloud (or to adapt it, if you're in a position to do so) in order to encourage a faster (or higher quality) release.

Maintenance releases
~~~~~~~~~~~~~~~~~~~~

Maintenance releases deliberately **do not** introduce new features or breaking changes. This is meant to reduce the risks and impact associated with deploying updates so that critical bugs or security vulnerabilities can be rapidly and routinely addressed. 

Maintenance releases are published (generally simultaneously) for all stable major releases that have not reached end-of-life status.

These releases should not have app compatibility concerns or introduce changes requiring retraining end users.

A specific maintenance release is indicated by the last part of the version number. For example, ``28.0.4`` is the *fourth* maintenance release for major version ``28`` of Nextcloud Server. It offers fixes for any critical bugs and security vulnerabilities addressed since the last maintenance release (``28.0.3`` in this example). 

.. note:: All critical bug fixes, including security related ones, are `backported <https://en.wikipedia.org/wiki/Backporting>`_ to **all** maintained major releases.

Release schedule
----------------

New **major** releases of Nextcloud Server are published approximiately every sixteen weeks.

New **maintenance** releases are published approximately every four weeks.

Length of support ("maintenance")
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Our release schedule means that several major releases (e.g. 26.X.X, 27.X.X, 28.X.X) are supported simultaneously. Whenever a critical bug or vulnerability is addressed, if it impacts more than one major release, it is **backported** to all applicable major releases and published in the next maintenance release (e.g. ``28.0.3`` -> ``28.0.4``). Any major release that has not reached end-of-life status receives these maintenance updates.

This overlapping schedule and predictable cadence permits rapid development while giving administrators visibility, access to critical bug fixes, and flexibility as to how aggressively to upgrade to new majors.

.. note:: Since every major release is supported for one year from initial release, the minimum you need to do to stay up-to-date is to install maintenance releases as they're published and upgrade to the next higher up major release when the one you're currently on reaches end-of-life status. Since maintenance releases only patch your Server with the latest bug and security vulnerability fixes - and do **not** introduce other significant changes - the risk of upgrading to a new maintenance release is far less than upgrading to a new major release.

End-of-life 
~~~~~~~~~~~

End-of-life status means that support/maintenance ends. Maintenance releases cease for a major version on the one year anniversary of initial release. The major version then moves into end-of-life status and will not receive any further bug fixes or corrections for security vulnerabilities.

.. note:: Support for major releases may be extended through `subscription services for enterprises <https://nextcloud.com/enterprise/>`_ offered by Nextcloud developers via `Nextcloud GmbH <https://nextcloud.com>`_.

The end-of-life dates for all major releases are `published <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ ahead of time to ease planning.

.. note:: As long as a major release is still listed on the `maintenance schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ as being *Currently Maintained*, you can expect to receive all relevant fixes for critical bugs or security vulnerabilities (even those made available for newer major releases, if they are relevant to a still supported earlier major).

Installation version
---------------------

Since multiple major releases are published throughout the year and each is supported for a year with any relevant bug and security fixes, you have discretion as to which which major to deploy initially as well as when to upgrade to a new major.

.. note:: If you're planning to deploy Nextcloud in an enterprise setting and your usage will be mission-critical, the developers can help you choose, via an `Enterprise services arrangement <https://nextcloud.com/enterprise/>`_, the major version most suitable for your particular use case as well as help make sure it's deployed optimally while addressing any critical problems that arise with you one-on-one.

Release channels
----------------

By default all Nextcloud installations utilize the ``stable`` release channel. This channel delivers the latest features that are ready for most users at minimal risk. 

.. note:: Nextcloud does staged roll-outs of new releases to further reduce the risk of widespread updates. New releases, particularly major releases, are usually only made available to a small percentage of systems initially. After a week (or more) has passed with no reported widespread critical bugs, more systems will be offered the update. Sometimes major versions are limited to <100% of systems until after the first maintenance (bug fix) release has been published. 

.. warning:: When using the ``stable`` channel it is possible you'll be *offered* a newer major version to upgrade to *even if* your existing major version has **not** reached end-of-life. It is up to you to decide whether to upgrade then or wait until a better time for deploying a major new release. On the other hand, new **maintenance** releases (within the major version you're already running) should be deployed as soon as possible to keep up-to-date with security and other critical bug fixes.

.. danger:: Making sure you're running an actively maintained **major** release is critical. Once a major release reaches End of Life status it will not receive any further maintenance releases to correct critical bugs or vulnerabilities.

You can find the detailed schedule for all stable channel major releases and maintenance releases, including end-of-life dates, in our regularly updated `Maintenance and Release Schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Major version upgrades
----------------------

Before upgrading from one one major release to another, we strongly recommend reviewing the *Critical changes* section of the **Release Notes** chapter to minimize the chance of introducing unexpected breaking changes in your environment.

.. warning:: Having good data backups (and a tested data restore approach!) is recommendeded in general, but definitely before performing an update - whether major or merely maintenance.

Beta releases and Release candidates
------------------------------------

Before a new final major release is published, typically at least four beta releases are published followed by two release candidates, with an interval of one week between each. 

Before a new final maintenance release is published, one release candidate is published approximately one week beforehand.

Anticipated dates for each release can be found on `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

.. tip:: To update sooner to a new major version or beta version, you may at your discretion adjust your instance to use the ``beta`` channel. Around big releases the ``beta`` channel also delivers the newest major version earlier regardless of staging parameters.

Everyone in the community benefits considerably from the generous testing and feedback of those that choose to evaluate beta releases or release candidates in either their test environments or, for the bold, under real-world conditions. 

If you are in a position to evaluate a pre-final release, the developers and the entire community thank you! 

.. tip:: We suggest focusing your testing efforts on verifying the functionality and features you rely on every day (to make sure these operate as expected). Then, if you are so inclined, to consider evaluating any new functionality that interests you. Please discuss problems that arise at the `Help Forum <https://help.nextcloud.com>`_ and report suspected bugs to `the GitHub repository <https://github.com/nextcloud/server/issues>`_.

Downgrading
-----------

Downgrading is not supported officially between any major, maintenance, or pre-release version.

Bug reporting
-------------

Before reporting bugs, please make sure you're running a still supported major release *and* the latest maintenance release for it.

.. tip:: Nextcloud GmbH - which employs many of the core developers - offers `Nextcloud Enterprise services <https://nextcloud.com/enterprise/>`_ providing direct access to Nextcloud engineering expertise where usage is mission-critical. Among other things, they can help you choose the major version most appropriate to your use case (and make sure it's deployed optimally).
