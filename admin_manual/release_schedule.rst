================================
Maintenance and release schedule
================================

Summary
-------

Policy:

* The ``stable`` release channel hosts all of the major branches of Nextcloud Server that are actively supported.
* Every Nextcloud Server installation, by default, utilizes the ``stable`` release channel. 
* The ``stable`` release channel covers Nextcloud Server and all embedded ("shipped") apps.
* There are 2-3 actively supported branches available within the ``stable`` channel to choose from at any given point in time.
* All new stable branches are supported for at least 12 months via bugfix-only minor/point/maintenance releases (which are published every 3-5 weeks or as needed).
* Each supported stable branch receives the same critical bugfixes.

Plan, as part of standard system administration responsibilities, to:

- Deploy critical bugfixes-only updates (maintenance releases) to your Nextcloud Server environment approximately once every 2-4 weeks.
- Perform a major upgrade of your Nextcloud Server environment at least once a year to stay on a supported major branch (or more frequently if you prefer the latest functionality/features).

For new deployments, if you would like...

- ...the latest features and optimizations: deploy the highest numbered major branch in the ``stable`` channel.
- ...the most "field-tested" versions: deploy the lowest numbered major branch in the ``stable`` channel.

Development Approach
--------------------

Context
~~~~~~~

Nextcloud is an open source project developed primarily under the GNU Affero General Public License (AGPL).
Nextcloud's development is driven by the needs, goals, wants, and preferences of:

- projects contributors (developers, designers, etc.)
- the customers of Nextcloud GmbH (which employs many of the core developers and maintainers as well as underwrites the direct monetary expenses of the project)
- users and consumers of platforms and services that utilize Nextcloud software
- the Nextcloud community at large (consisting of professional users and technologists, power users and hobbyists, home or personal users, and application developers)

Changes
~~~~~~~

Changes (in the form of "commits") are made to the code base nearly every day. 
Changes may be proposed by anyone.
These proposed changes are reviewed, tested, adjusted, experimented with, discussed, and collaborated, commented, and voted on by project maintainers, members, and anyone that jumps in alongside them.

These individuals - collectively - serve as curators of the code base and shape the evolution of Nextcloud. The changes may:

- target known or potential bugs
- optimize performance
- expand functionality
- improve the user experience and user interface
- add new features
- streamline future development
- improve software quality
- and so on.

Some proposed changes are accepted quickly while others take time or may be blocked for a variety of reasons.
When a change is accepted, it is is merged into the master development branch.

Coordination
~~~~~~~~~~~~

All of this development activity requires significant coordination in order to ensure the end result is usable and to minimize disruption to installers, administators, end-users, and app developers (while maximizing the availability of improvements).

The continuous (incremental) improvement of Nextcloud Server is beneficial to all stakeholders, but this does not mean they do not have competing priorities at times.

This is where the Nextcloud Server release approach comes into play:

- Developers and designers need to be able to make improvements and get feedback from stakeholders.
- Administrators, end-users, and application developers must be able to evaluate and prepare for changes that impact their Nextcloud related endeavors.

An effective development velocity facilitates **both**.

This is where Nextcloud's approach to maintaining a diverse ``stable`` release channel, publishing a schedule of the lifecycle for all major releases, and creating frequent bugfix-only (maintenance) releases come into play.

Release Channels, Major Release Schedule, and Maintenance Releases
------------------------------------------------------------------

Stable release channel
~~~~~~~~~~~~~~~~~~~~~~

The ``stable`` release channel hosts all of the major *branches* of Nextcloud Server that are actively supported. 
Every Nextcloud Server installation, by default, utilizes the ``stable`` release channel. 
The ``stable`` release channel covers Nextcloud Server and all embedded ("shipped") apps.
There are other release channels, but they are not covered here since they are for special uses case and/or not formally supported.

Stable major branches
~~~~~~~~~~~~~~~~~~~~~

Each new major branch is created from a point-in-time snapshot of the master development branch. 
Once a new major stable branch is established, it receives all (and only) critical bugfixes until it reaches end-of-life.
A major branch will receive all relevant critical bugfixes until it reaches its end-of-life.
Every still supported major branch receives the same critical bugfixes.

There are always 2-3 actively supported major branches available to choose from (at installation time or for upgrades).
This helps Nextcloud administators establish and maintain a stable environment for their endeavors.

Bugfixes
~~~~~~~~

Critical bugfixes for stable branches are published via the stable channel as maintenance (also known as "point" or "minor") releases.
These maintenance releases (which contain only critical bugfixes) are published every 3-5 weeks - or as required - for all supported major branches.

New stable releases
~~~~~~~~~~~~~~~~~~~

New major stable branches ("snapshots") of Nextcloud Server are established every 3-5 months.
All new major branches are supported for at least 12 months (through the periodically published maintenance releases).

.. note:: Support for major releases can be extended via `enterprise offerings <https://nextcloud.com/enterprise/>`_ provided by core Nextcloud developers through `Nextcloud GmbH <https://nextcloud.com>`_. This also includes additional support and planning assistance directly from Nextcloud engineers, advanced security updates, additional influence on the development roadmap, branding and customization options, enterprise-specific documentation, engaging with Nextcloud partners, and learning from other Nextcloud customers (IT professionals, project managers, and decision-makers).

Upgrading and end-of-life
~~~~~~~~~~~~~~~~~~~~~~~~~

Of course, eventually all environments must upgrade to a new major branch in order to:

- Take advantage of new features and optimizations
- Maintain compatibility with their favorite apps
- Continue to receive critical bugfixes.

Benefits
~~~~~~~~

Supporting multiple major branches requires additional development resources, but it also: 

- Gives administrators flexibility when planning deployments, upgrades, and maintenance activities.
- Helps application developers (and consumers) manage app compatibility and API transitions through planned deprecations.
- Enables users to not be bombarded with continuous changes in the user interface, functionality, and workflows.

It also helps with the ongoing improvement of Nextcloud Server itself because it permits a relatively high velocity development cadence by:

- Introducing newer functionality, on an opt-in basis, to early adopters.
- Enabling the continuous refinement of the code base in ways that may incroduce incompatible changes in behavior (i.e. the removal of deprecated code, introduction of new APIs, and material changes in behavior)

...all without severely and immediately impacting administrators, users, and application developers every time a material change is made.

Summary
-------

- The ``stable`` release channel is the default for all Nextcloud installations.
- The ``stable`` release channel hosts all actively supported major branches of Nextcloud Server.
- All new major branches are supported for at least 12 months.
- Each still supported major branch receives the same critical bugfixes (via periodic maintenance-only minor/point releases).
- Plan to make periodic critical bugfixes-only updates to your Nextcloud Server deployment at least once a month as part of standard system administration responsibilities.
- Plan to make a major upgrade to your Nextcloud Server deployment at least once annually to stay on a supported major branch (more frequently if you would like access to the latest functionality/features).

.. note:: Support for major releases can be extended through `enterprise offerings <https://nextcloud.com/enterprise/>`_ provided by core Nextcloud developers through `Nextcloud GmbH <https://nextcloud.com>`_. This also includes additional support and planning assistance directly from Nextcloud engineers, advanced security updates, additional influence on the development roadmap, branding and customization options, enterprise-specific documentation, engaging with Nextcloud partners, and learning from other Nextcloud customers (IT professionals, project managers, and decision-makers).

.. tip:: The above policy does not cover apps installed from the App Store (at least not directly). These apps have independent release policies.

---


This approach:

- Gives administrators flexibility about about when to deploy major upgrades.
- Helps application developers (and consumers) manage app compatibility and API transitions.
- Protects end-users from continuous changes in the UI and functionality.
- Permits a relatively high velocity development cadence without requiring everyone upgrade to the next major release branch at the very same time.
- Introduces newer functionality, on an opt-in basis, to early adopters.
- Enables the continuous refinement of the code base in ways that be worthwhile but are considered "breaking changes"



- To manage the competing priorities of different stakeholders the project:
    - Maintains a diverse ``stable`` release channel.
    - Schedules of the lifecycle for all major releases.
    - Publishes frequent bugfix-only (maintenance) releases.


Feature development, optimizations, and the removal of deprecated code all require changes to be tested and released as well as unavoidable remedidations to take place as needed.


Major branches help Nextclouod:
  Administrators
  End-users
  Application developers 

...by helping them maintain a stable environment for their endeavors.


The availability of *multiple* major branches helps Nextcloud administrators (and end-users) by:

  Ensuring a fair degree of predictability via:
    A pre-scheduled major release cadence.
    Pre-planned incremental retirement of major branches.
    Facilitating incremental and pre-planned rollouts of new major branches.


Stable branches are point-in-time snapshots of the master code branch, which receive only 


Actively supported major releases release regular bugfixes and non-breaking changes.


Each snapshot is published as a new major version.


Stable release branches consist of an initial point-in-time snapshot of the then current master code branch, which is then maintained with bugfixes via maintenance (also known as "point"

These Stable

This channel delivers the latest features that are ready for most users at minimal risk. 


(and the various applications available throughout the Nextcloud ecosystem) are actively dev

Nextcloud releases multiple major versions *throughout* the year, but maintains support for *each* major version for one full year each through "lighter" maintenance updates (and regularly `backporting <https://en.wikipedia.org/wiki/Backporting>`_ applicable security and bug fixes). This permits a high velocity development cadence, while still giving administrators flexibility when planning deployments, upgrades, and maintenance activities.

A detailed `schedule for upcoming major and maintenance releases <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ (as well as end-of-life projections) is regularly updated to facilitate planning deployment, testing, and upgrade planning.

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
