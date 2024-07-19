.. _app-release-process:

===============
Release process
===============

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>


Overview
--------

This page documents the overall process and tasks of releasing a Nextcloud app to the public, as well as preparation and follow-up tasks.

Not all of the described steps will apply to all apps. Some require fewer steps, for others there is some additional work to do. Adjust the process accordingly.


Before the release
------------------

Change tracking
~~~~~~~~~~~~~~~

If the app uses some sort of tracking like Github milestones, projects or similar, make sure that app scheduled changes have been merged into the target branch.

At this point you can probably assign a release date (if not set already) on the milestone and close it.

.. _app-versioning:

Versioning
~~~~~~~~~~

Each update of an app needs a new, higher version number. Before preparing a specific release, the maintainer has to decide what version number the new release will get.

It is highly recommended that apps follow `semantic versioning <https://semver.org/>`_ (semver). This schema allows admins and users to better understand what type of change they can expect when an app update is available.

Applying semver on Nextcloud apps gives three types of updates: major, minor and patch.

Patch updates
*************

Increment the patch version number when

* A bug gets fixed
* Translations are added or fixed, but **not** removed

.. tip:: Example: the app is at version 3.7.2. The next patch version will be 3.7.3.

Minor updates
*************

Increment the minor version number when

* There is a new feature
* A new major version of Nextcloud will be supported
* A new major or minor version of PHP will be supported
* An additional database type is supported
* A Nextcloud version that has reached EOL is dropped, e.g. when Nextcloud 19 is removed
* A PHP version that has reached EOL is dropped, e.g. when PHP 7.3 is removed
* Any other change that keeps the app compatible with previously compatible environments (forward compatibility)

.. tip:: Example: the app is at version 3.7.2. The next minor version will be 3.8.0.

Major update
************

Increment the major version number when

* The app drops support for a major version of Nextcloud that hasn't reached EOL, e.g. when Nextcloud 23 support is removed and the app now requires Nextcloud 24 or newer
* The app drops support for a major or minor version of PHP that hasn't rached EOL, e.g. when PHP 8.0 is removed and the app now requires PHP 8.1 or newer
* A database type is no longer supported, e.g. when the maintainer decides to stop SQLite support
* Any other change that makes the app incompatible with a previously compatible environment (breaking change)

.. tip:: Example: the app is at version 3.7.2. The next major version will be 4.0.0.

Change log
~~~~~~~~~~

If the app `keeps a change log <https://keepachangelog.com/en/1.0.0/>`_ (e.g. CHANGELOG.md in the project root) it's time to update it with all **added**, **changed** and **fixed** items.

.. tip:: Use ``git log v3.7.1..HEAD --pretty=oneline | grep -v tx-robot | grep -v "Merge " | grep -v "Bump "`` on the target release branch to get a compact list of all changes since the v3.7.1 release. Adjust this to your previous release version number.

Pre-releases
~~~~~~~~~~~~

Optionally maintainers may chose to pre-release their apps on the app store for early adopters and testers. The precise periodization is up to the maintainer. Common periods include **alpha**, **beta** and **rc** (release candidate) epochs.

The release process is identical to the one of a final release, only the version number has a suffix.

.. tip:: Example: the app will be released as version 3.7.2. Therefore there might be a **v3.7.2-alpha.1**, **v3.7.2-beta.1**, **v3.7.2-rc.1**, **v3.7.2-rc.2** and the final **v3.7.2**.

The updater channel defines if pre-releases are installed by the server. This setting can be found in the admin setting or in the ``config/config.php`` file. The server will install pre-releases if its update channel is set ``beta``, ``daily``, or ``git``. For all other settings, pre-releases will not be installed.

.. tip:: Don't publish the pre-releases as nightly version on the app store or Nextcloud installations won't be able to update. Releasing with any (alphanumeric) suffix is sufficient to mark the release as not production ready and instances are still able to update to it.

Nightly releases
~~~~~~~~~~~~~~~~

Additionally to publishing pre-releases, the maintainers can release nightly releases. These are considered even less stable than pre-releases. In the app store, such nightly releases are marked separately.

Nightly releases will be automatically installed by servers if the update channels is set to ``daily`` or ``git``. Any other setting will make the server ignore nightly releases.

.. tip:: The server uses internally the PHP function ``version_compare``. Consider the version number of a nightly version carefully, so that newly published (pre-) releases are considered newer than the nightly ones.

The release
-----------

From an abstract point of view the main part of doing a release is transforming the source code into an installable software component.

This part is typically scripted and highly depends on the type of app. The following list is incomplete but should give a rough idea of what steps a release script should contain:

* Switch to your target branch and pull the latest changes
* Tag the release in Git and push your local changes, if any
* Install all :ref:`dependencies <app-dependencies>`
    * Run ``composer i --no-dev`` if the app uses :ref:`Composer <app-composer>`
    * Run ``npm ci`` if the app uses :ref:`npm <app-npm>`
* Build compiled artifacts
    * :ref:`Build production scripts for the front-end <app-npm-build>`
    * Run any code generation (e.g. through a :ref:`Composer script <app-composer>`)
* Remove development files
    * Remove any kind of configuration files (``composer.*``, ``package.json``, ``package-lock.json``, ``.babelrc``, and so on) that are not required in production
    * Remove source code that is not required in production, e.g. JavaScript that is compiled into a bundle
    * Remove tests
* :ref:`Sign the release files <app-code-signing>` to generate an appinfo/signature.json
* Package the rest into a `.tar.gz` tarball
* Upload the tarball for distribution, e.g. as a Github release artifact or a dedicated download server
* :ref:`Publish <app-store-publishing>` on the app store

After the release
-----------------

Branch off
~~~~~~~~~~

If the maintainer of the app keeps stable branches to which bug fixes are backported, any major or minor release requires a branching off the current main branch.

Prepare follow-up releases
~~~~~~~~~~~~~~~~~~~~~~~~~~

The target milestone was closed in the release preparation. Now it's time to create a new milestone for the next release(s).


Shipped Apps
------------

The majority of apps is distributed via the Nextcloud app store. A few apps are bundled and shipped with Nextcloud. There are a few things to keep in mind for them.

Git branch management
~~~~~~~~~~~~~~~~~~~~~

The release script simply git-clones app repositories. Repositories of shipped apps need branches to correspond to the branches in the `Nextcloud server repository <https://github.com/nextcloud/server>`_:

* ``master`` branch is used to create the daily builds of Nextcloud
* ``stable*`` branches are used to build stable releases, e.g. ``stable24`` for Nextcloud 24.x.y.

Because apps are just cloned, it is not possible to have a build step for shipped apps. Shipped apps have to *vendor* all their release artifacts.

Example:

* App uses ``composer`` dependencies: commit all production dependencies in the ``vendor`` directory
* App uses ``npm`` dependencies and front-end build tools: commit all front-end artifacts in the ``js`` directory

Versioning
~~~~~~~~~~

Since every ``stable*`` branch targets only one major version of Nextcloud and drops the previous one, it's best to have one major version of the app per stable branch. See :ref:`app versioning <app-versioning>` for details.

Example:

* ``master``: Version 8.0.0, targeting Nextcloud 27
* ``stable26``: Version 7.0.0, targeting Nextcloud 26
* ``stable25``: Version 6.0.0, targeting Nextcloud 25

Backported fixes increase the patch version on a stable branch. Backported features increase the minor version.


Hybrid Distribution
~~~~~~~~~~~~~~~~~~~

In very rare situations apps can be shipped **and** distributed via the app store. In those cases it is important to ensure the shipped version is equal or higher than the app store version to prevent a downgrade during the update of Nextcloud.

Hybrid distribution is not recommended.
