================================
Maintenance and release schedule
================================

Introduction
------------

Nextcloud maintains and supports several **major** releases in parallel. Critical bug fixes, including security related ones, are `backported <https://en.wikipedia.org/wiki/Backporting>`_ to all still supported major releases. The End of Life dates (i.e. when support will end) for every major release is `published <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ ahead of time (generally one year from initial release).
This enables you to choose a major version that offers the best balance of code maturity and features for your use case. It also means you can plan out major version upgrades in your environment (e.g. to manage for new system requirements or app compatibility matters as well as the impact of introducing new features and behavior changes to your user base).

.. note:: Major releases may be supported for longer through `Enterprise Services <https://nextcloud.com/enterprise/>`_ offered by the core Nextcloud developers via `Nextcloud GmbH <https://nextcloud.com>`_.

Deployment planning
-------------------

You make the decision regarding which major release to deploy first at installation time (i.e. by choosing a particular major version to initially install) and, after that, whenever a new major release is published *or* the major release you are currently using reaches its End of Life date.

A major release is indicated by the first part of the version string. For example, Nextcloud Server ``28.0.4`` is major release ``28``. And ``27.1.7`` is major release ``27``. The highest numbered major release offers the latest features. While the lowest numbered major release offers the most time in the field. 

.. tip:: As long as your in-service major version has not reached End of Life status, all you need to do to keep it up-to-date is to install the latest maintenance releases as they are published. Maintenance releases patch your deployment with the latest bug and security vulnerability fixes *without* introducing other significant changes. This reduces the risk of introducing unexpected new behavior or breaking changes from merely installing a maintenance release. New maintenance releases are published approximately once a month (until a major release reaches End of Life status at which point it'll no longer be supported and becomes unmaintained).

You can find the detailed schedule for major releases and maintenance releases, including End of Life dates, in our regularly updated `Maintenance and Release Schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

.. danger:: Apps generally define their compatibility based on the major version(s) of Nextcloud Server they support. Consider the compatibility of your favorite and most critical apps, with a given major version of Nextcloud Server, before choosing which major version to deploy and when to upgrade to a new major version.

.. note:: If you're planning to deploy Nextcloud in an enterprise setting and your usage will be mission-critical, the core developers can help you choose, via an `Enterprise services arrangement <https://nextcloud.com/enterprise/>`_, the major version most suitable for your particular use case (and make sure it's deployed optimally).

Release channels
----------------

By default all Nextcloud installations utilize the ``stable`` release channel. This is what is recommended for most environments.

The ``stable`` channel delivers the latest features ready for most users at minimal risk. 

Within the ``stable`` channel there are two types of releases: *Major* releases and *Maintenance* releases. 

.. note:: Nextcloud does staged roll-outs of new releases. New releases, particularly major releases, are usually only made available to >30% of installations via the ``stable`` channel after a week (or more) has passed with no reported widespread critical bugs. Sometimes major versions are even staged until after the first maintenance (bug fix) release has been published. 

Major releases
--------------

Major releases typically introduce new functionality and features. Often the changes introduced are extensive - e.g.

* user facing changes in behavior (e.g. the web interface or client app interactions/APIs)
* breaking changes for app developers (e.g. of previously announced as deprecated APIs that have since reached their official removal stage)
* adjustments required to the runtime environment (e.g. administrators may need to upgrade their PHP version or adjust web server parameters)

As previously noted, the major release version is indicated by the first part of the version string. For example, Nextcloud Server ``28.0.4`` is major release ``28``. New major releases are typically published three times a year. 

.. warning:: When using the ``stable`` channel it is possible you'll be *offered* a newer major version to upgrade to *even if* your existing major version has **not** reached End of Life. It is up to you to decide whether to upgrade then or wait until a better time for deploying a major new release. On the other hand, new **maintenance** releases (within the major version you're already running) should be deployed as soon as possible to keep up-to-date with security and critical bug fixes.

Each stable major release of Nextcloud Server periodically receives updates for critical bugs or security issues via **maintenance releases** for one year after initial release.

.. danger:: Making sure you're running an actively maintained **major** release is critical. Once a major release reaches End of Life status it will not receive any further maintenance releases to correct critical bugs or vulnerabilities.

Maintenance releases
--------------------

Maintenance releases fix critical bugs and security issues. Maintenance releases **do not** introduce any new functionality or breaking changes (unless absolutely necessary). This reduces the risk associated with deploying new maintenance releases (within the same major release).

Maintenance releases are indicated by the last part of the version number - e.g. ``28.0.4`` is the *fourth* maintenance release for major version ``28`` of Nextcloud Server. it offers fixes for critical bugs and security vulnerabilities addressed since the last maintenance release (``28.0.3`` presumably in this case). Maintenance releases are published approximately once a month. 

They are only released for stable major releases that have not reached End of Life status.

.. note:: As long as a major release is still listed on the `maintenance schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ as being *Currently Maintained*, you can expect to receive all relevant fixes for critical bugs or security vulnerabilities (even those made available for newer major releases, if they are relevant to the a still supported earlier major).

Choosing a version to run
-------------------------

Whether you want the latest features, want to help with testing, or just want to wait until everything is perfectly ready to go, we’ve got options for you. 

Unfortunately, that does mean you have decisions to make. :-)

At any given point in time there are at least two (and often three) major releases available in the ``stable`` release channel that are equally supported (maintained). 

The co-existing major releases in the ``stable`` release channel are known informally as:

* *latest stable*
* *previous stable*
* *last supported stable*

Each is thus available for new deployments or upgrading to at the administrator's discretion (subject to any constraints imposed by installation method).

There are some differences between each of these which are helpful to be aware of when deciding which majors to use and when to update. 

*latest* stable:

* the latest optimizations and functionality (i.e. introduced in the past 4 months)
* <=4 months of existence in the field (i.e. anywhere from zero to four incremental maintenance releases)
* most likely to encounter app compatibility issues while the ecosystem catches up
* most likely to encounter new bugs due to the newness of the code

*previous* stable

* recent optimizations and functionality introduced in the past 4-8 months
* at least 4 months existence in the field (i.e. at least four incremental maintenance release cycles completed)
* less likely to encounter app compatibility issues
* most widespread and significant bugs have likely been either already fixed or are well known

*last supported* stable:

* optimizations and functionality introduced 8-12 months ago
* at least 8 months existence in the field (i.e. at least eight incremental maintenance release cycles completed)
* least likely to encounter app compatibility issues (unless an app maintainer decides to eliminate support for all but ``latest`` stable) 
* nearly all widespread and significant bugs have already been fixed or are well known

For example, in March 2024:

* v28 is the ``latest`` major release available
* v27 is the ``previous`` major release
* v26 is the ``last supported`` major release

.. note:: Major releases may be supported for longer through `Enterprise Subscription <https://nextcloud.com/enterprise/>`_ offerings provided by core Nextcloud developers via `Nextcloud GmbH <https://nextcloud.com>`_.

Staying up-to-date
------------------

The release schedule permits the project to support the most recent two (sometimes three) major stable releases. As long as you are using a currently maintained major stable release, all you need to do stay up-to-date with the latest bug and security vulnerability fixes is to keep Nextcloud Server on the latest maintenance release (and upgrade to a new major version at least once a year).

.. tip:: Before upgrading from one one major release to another, we strongly recommend reviewing the *Critical changes* section of the **Release Notes** to minimize the chance of introducing unexpected breaking changes in your environment.

.. warning:: Having good data backups (and a tested data restore approach!) is recommended generally as well as before any type of update - including for maintenance releases.

Beta releases and Release candidates
------------------------------------

Nextcloud relies considerably on the generous testing and feedback of beta releases and realise candidates (RCs) provided by the community. If you are in a position to evaluate a new prospective release, we suggest focusing first on verifying the functionality and features you rely on every day followed by evaluating any new functionality that interests you. Please discuss problems at the `Help Forum <https://help.nextcloud.com>`_ and report suspected bugs to `the GitHub repository <https://github.com/nextcloud/server/issues>`_.

.. tip:: To update sooner to a new major version or beta version, you may at your discretion adjust your instance to use the ``beta`` channel. Around big releases the ``beta`` channel delivers the newest major version earlier.

Major releases are typically scheduled once every 4 months with the first 10 weeks being the development phase followed by freeze phase with four beta release before two RCs and one final each one with an interval of 1 week. Specific dates for each release can be found on `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Maintenance releases are scheduled in a 4 week cycle with one week before the release date having the freeze and RC 1.

Anticipated dates for each release can be found on `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Downgrading
-----------

Downgrading is not supported between major versions nor maintenance versions at this time.

Summary
-------

* It's up to you to decide which supported major version to deploy and use for your use case.
* For the latest functionality (features, optimizations) you will need to run the latest major release.
* You can find the detailed schedule for major and maintenance releases at: `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.
* We always recommend that all users run the latest available maintenance release for whatever major version is in use. 
* While upgrading will always contain some level of risk, not upgrading to the latest **maintenance** release for an in-use major version is generally riskier than the risk from upgrading.
* Before reporting bugs, please make sure you're running a still supported major release *and* the latest maintenance release for it.

It's important to keep your Server:

- running a maintained major release
- running the latest maintenance release 

To do so, four things must occur:

- confirm the default release channel is appropriate for your use case
- choose a major version for your initial installation
- keep your instance running the latest maintenance release within your chosen major version
- Upgrade to the next major version *either* when the major you're running reaches End of Life status *or* when the next higher major version offers features or functionality that you can't live without and you've prepared your user base and environment for the changes.

.. tip:: You may need to meet new system requirements to be offered (or to successfully upgrade to) a new major version (the PHP version a common culprit for not being an update - check System Requirements in the Admin Manual for the target major version to make sure your runtime environment is compliant).

Nextcloud GmbH - which employs many of the core developers - offers `Nextcloud Enterprise services <https://nextcloud.com/enterprise/>`_ providing direct access to Nextcloud engineering expertise where usage is mission-critical. Among other things, they can help you choose the major version most appropriate to your use case (and make sure it's deployed optimally).
