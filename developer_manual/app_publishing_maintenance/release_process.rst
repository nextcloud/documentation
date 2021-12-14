.. _app-release-process:

===============
Release process
===============

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>


Overview
--------

This page documents the overall process and tasks of releasing a Nextcloud app to the app store, as well as preparation and follow-up tasks.

Not all of the described steps will apply to all apps on the app store. Some require fewer steps, for others there is some additional work to do. Adjust the process accordingly.


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
* Any other change that keeps the app compatible with previously compatible environments (forward compatibility)

.. tip:: Example: the app is at version 3.7.2. The next minor version will be 3.8.0.

Major update
************

Increment the major version number when

* The app drops support for a major version of Nextcloud, e.g. when Nextcloud 20 support is removed and the app now requires Nextcloud 21 or newer
* The app drops support for a major or minor version of PHP, e.g. when PHP7.2 is removed and the app now requires PHP7.3 or newer
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

.. tip:: Don't publish the pre-releases as nightly version on the app store or Nextcloud installations won't be able to update. Releasing with the suffix is sufficient to mark the release as not production ready and instances are still able to update to it.

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
