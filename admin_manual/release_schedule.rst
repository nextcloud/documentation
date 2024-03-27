================================
Maintenance and release schedule
================================

Introduction/Overview
---------------------

Nextcloud maintains and supports several **major** releases in parallel. Critical bug fixes, including security related ones, are `backported <https://en.wikipedia.org/wiki/Backporting>`_ to all still supported major releases. The End of Life dates (i.e. when support will end) for every major release is `published <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ ahead of time (generally one year from initial release).
This enables you to choose a major version that offers the best balance of code maturity and features for your use case. It also means you can plan out major version upgrades in your environment (e.g. to manage for any new system requirements or app compatibility matters as well as the impact of introducing new features and behavior changes to your user base).

.. note:: Major releases may be supported for longer through `Enterprise Services <https://nextcloud.com/enterprise/>`_ offered by core the Nextcloud developers via `Nextcloud GmbH <https://nextcloud.com>`_.

You make the decision regarding which major version to deploy first at deployment time (by choosing a particular major version to initially install) and then whenever a new major version is published *or* the major version you are currently using reaches its End of Life date.

A major release is indicated by the first part of the version string. For example, Nextcloud Server ``28.0.4`` is major release ``28``. The highest numbered major release offers the latest features. While the lowest numbered major release offers the most time in the field. 

.. tip:: As long as your in-service major version has not reached End of Life status, all you need to do to keep it up-to-date is to install the latest maintenance releases as they are published. Maintenance releases patch your deployment with latest bug and security vulnerability fixes without making any other significant changes. This reduces the risk of introducing unexpected new behavior or breaking changes from merely installing a maintenance release. These maintenance releases are published approximately every 4-5 weeks until a major release reaches End of Life status (at which point it'll no longer be supported and will receive no further official maintenance).

You can find the detailed schedule for major releases and maintenance releases, including End of Life dates, in our regularly updated `Maintenance and Release Schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

.. tip:: Apps generally define their compatibility based on the major version(s) of Nextcloud Server they support. Consider the compatibility of your favorite and most critical apps, with a given major version of Nextcloud Server, before choosing which major version to deploy and when to upgrade to a new major version.

.. note:: Nextcloud GmbH - which employs many of the core developers - offers `Nextcloud Enterprise services <https://nextcloud.com/enterprise/>`_ providing direct access to Nextcloud engineering expertise where usage is mission-critical. Among other things, they can help you choose the major version most appropriate to your use case and make sure it's deployed optimally for it.

Release channels
----------------

By default all Nextcloud installations utilize the ``stable`` release channel. This is what is recommended for most environments.

The ``stable`` channel delivers the latest features ready for most users at minimal risk. 

Within the ``stable`` channel there are two types of releases: *Major* releases and *Maintenance* releases. 

Note that Nextcloud does staged roll-outs, making releases incrementally available to those using the ``stable`` channel over time. New releases, particularly major releases, are usually only made available to 100% of installations via the ``stable`` channel after a week (or more) has passed with no reported widespread critical bugs. Sometimes major versions are staged until after the first maintenance (bug fix) release has been published.

To update sooner to a new version, you may at your discretion adjust your instance to use the ``beta`` channel. Around big releases the ``beta`` channel delivers the newest major version earlier.

Major releases
--------------

Major releases typically introduce new functionality and features. Often the changes introduced are extensive - e.g.

* user facing changes in behavior (e.g. the web interface or client app interactions/APIs)
* breaking changes for app developers (of previously deprecated APIs)
* adjustments required to the runtime environment (e.g. administrators may need to adjust web server parameters)

A major release version is indicated by the first part of the version string. For example, Nextcloud Server ``v28.0.4`` is major release ``28``. Major releases are typically published once every four months. 

Each stable major release of Nextcloud Server periodically receives updates for critical bugs or security issues via **maintenance releases** for one year after initial release.

.. danger:: Making sure you're running an actively maintained major release is critical. Once a major release reaches End of Life status it will not receive any further maintenance releases to correct critical bugs or vulnerabilities.

Maintenance releases
--------------------

Maintenance releases fix critical bugs and security issues. They are only released for stable major releases that are not in End of Life status (i.e. the state where a major release no longer receives updates).

Maintenance releases **do not** introduce any new functionality or breaking changes (unless absolutely necessary). This reduces the risk associated with deploying new maintenance releases (within the same major release).

Maintenance releases are indicated by the last part of the version number - e.g. ``v28.0.4`` is a maintenance release for ``v28.0.3``. Maintenance releases are published approximately once a month. 

.. note:: As long as a major release is still listed on the `maintenance schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_ as being *Currently Maintained*, you can expect to receive all relevant fixes for critical bugs or security vulnerabilities that are made available in even later major releases.

Choosing a version to run
-------------------------

Whether you want the latest features, want to help with testing, or just want to wait until everything is perfectly ready to go, we’ve got options for you. 

Unfortunately, that does mean you have decisions to make. :-)

At any given point in time there are at least two (and often three) major releases available in the ``stable`` release channel that are equally supported (maintained). 

The co-existing major releases in the ``stable`` release channel are known as:

* ``latest``
* ``previous``
* ``last supported``

Each is thus available for new deployments or upgrading to at the administrator's discretion (subject to any constraints imposed by installation method).

There are some differences though.

As a general rule of thumb:

* ``latest``
  - optimizations and functionality introduced in the past 4 months
  - no more than 4 months of existence in the field
  - more likely to encounter app compatibility issues while the ecosystem catches up and new bugs due to the newness of the implementation(s)
* ``previous``
  - optimizations and functionality introduced in the past 4-8 months
  - at least 4 months existence in the field
  - less likely to encounter app compatibility issues and most significant bugs have been either fixed already or are known
* ``last supported``
  - optimizations and functionality introduced 8-12 months ago
  - at least 8 months existence in the field
  - least likely to encounter app compatibility issues (unless an app maintainer decides to eliminate support for all but the ``latest``) and also nearly all significant bugs have been fixed or are well known known

Examples:

* v28 is the ``latest`` major release as of March 2024
* v27 is the ``previous`` major release as of March 2024
* v26 is the ``last supported`` major release as of March 2024

.. note:: Major releases may be supported for longer through `Support & Service Subscription <https://nextcloud.com/enterprise/>`_ offerings provided by core Nextcloud project developers through `Nextcloud GmbH <https://nextcloud.com>`_.

Staying up-to-date
------------------

The release schedule permits the project to support the most recent two (sometimes three) major stable releases. As long as you are using a currently maintained major stable release, all you need to do stay up-to-date with the latest bug and security vulnerability fixes is to keep Nextcloud Server on the latest maintenance release (and upgrade to a new major version at least once a year). Of course you may choose to upgrade to any new major version still receiving maintenance updates (Just beware of any Critical changes as noted in the Release notes!).

.. tip:: Before upgrading from one one major release to another, we strongly recommend reviewing the *Critical changes* section of the **Release Notes** to minimize the chance of introducing unexpected breaking changes in your environment.

Downgrading
-----------

Downgrading is not supported between major versions or maintenance versions at this time.

Summary
-------

It's important to keep your Server:

- running a maintained major release
- running the latest maintenance release 

To do so, four things must occur:

- confirm the default release channel is appropriate for your use case
- choose a major version
- keep your instance running the latest maintenance release within your chosen major version
- when the major version you're running reaches End of Life state, upgrade to the next higher major version (you may also upgrade to the next higher major version, at your discretion, when it offers features/functionality that you can't live without).

Note that you may need to meet new system requirements to be able to upgrade to a new major version (PHP version is the most common culprit - check System Requirements in the Admin Manual for the target major version)


--------


.. tip:: Two to three stable major releases are actively supported at any given point in time. This gives you the freedom to choose a major 
        release to deploy that is best suited for your use case (i.e. the one that offers the best balance of functionality, app compatibility, and release 
        maturity) and to plan ahead before upgrading to new major releases that may introduce breaking changes and new behaviors in your environment).


We always recommend that all users run the latest available minor release for whatever major version is in use. While upgrading will always contain some level of risk, not upgrading to the latest maintenance release within a given major is generally riskier than upgrading. Before reporting bugs, please make sure you're running both a still supported major release and the latest maintenance release for it.



Summary
-------

* It is **not** necessary to upgrade to the latest major release, unless the major release you are currently running has reached End of Life (meaning it will no longer be receiving any maintenance releases). 
* At any given point in time, 2-3 stable major releases are actively supported. This gives you the freedom and flexibility to choose the best balance of functionality and release maturity.
* For the latest functionality (features, optimizations) you will need to run the latest major release.
* You can find the detailed schedule for major and maintenance releases at: `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Beta and Release candidate releases
-----------------------------------

Major releases are typically scheduled once every 4 months with the first 10 weeks being the development phase followed by freeze phase with four beta release before two RCs and one final each one with an interval of 1 week. Specific dates for each release can be found on `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.

Maintenance releases are scheduled in a 4 week cycle with one week before the release date having the freeze and RC 1.

Specific dates for each release can be found on `detailed schedule <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_.
