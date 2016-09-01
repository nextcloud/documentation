=================================
Nextcloud |version| Release Notes
=================================


Changes in 10
-------------

General
=======

* Background jobs (cron) can now run in parallel `owncloud/core#24696 <https://github.com/owncloud/core/issues/24696>`_
* Update notifications in client via API - You can now be notified in your desktop client about available updates for core and apps. The notifications are made available via the notifications API. `owncloud/core#24444 <https://github.com/owncloud/core/pull/24444>`_
* Multi bucket support for primary objectstore integration `owncloud/core#24760 <https://github.com/owncloud/core/pull/24760>`_
* `Automated Tagging of files <https://github.com/nextcloud/files_automatedtagging>`_: An app for Nextcloud that automatically assigns tags to newly uploaded files based on some conditions
* `Retention of files <https://github.com/nextcloud/files_retention>`_: App to delete files after N days
* `Server monitoring <https://github.com/nextcloud/serverinfo>`_


Security
========

* brute force protection `nextcloud/server#479 <https://github.com/nextcloud/server/pull/479>`_
* `Advanced File Access Control <https://github.com/nextcloud/files_accesscontrol>`_

Authentication
==============

* Pluggable authentication: plugin system that supports different authentication schemes: `owncloud/core#23456 <https://github.com/owncloud/core/issues/23458>`_
* Token-based authentication
* Ability to invalidate sessions: `owncloud/core#24703 <https://github.com/owncloud/core/pull/24703>`_
* List connected browsers/devices in the personal settings page. Allows the user to disconnect browsers/devices. `owncloud/core#24703 <https://github.com/owncloud/core/pull/24703>`_
* Device-specific passwords/tokens, can be generated in the personal page and revoked: `owncloud/core#24703 <https://github.com/owncloud/core/pull/24703>`_
* Disable users and automatically revoke their sessions: `owncloud/core#23844 <https://github.com/owncloud/core/pull/23844>`_
* Detect disabled LDAP users or password changes and revoke their sessions
* Log in with email address: `owncloud/core#24389 <https://github.com/owncloud/core/pull/24389>`_
* Config option to enforce token-based login outside the web UI: `owncloud/core#24779 <https://github.com/owncloud/core/issues/24779>`_
* Two Factor authentication plugins system: `owncloud/core#24559 <https://github.com/owncloud/core/pull/24559>`_
* OCC command added to (temporarily) disable/enable two-factor auth for single users `owncloud/core#24559 <https://github.com/owncloud/core/pull/24559>`_

.. note:: The current desktop and mobile client versions do not support two-factor yet, this will be added later.
    It is already possible to generate a device specific password and enter that in the current client versions.

Files app
=========

* Ability to toggle displaying hidden files: `owncloud/core#2589 <https://github.com/owncloud/core/issues/2589>`_
* Remember sort  order: `owncloud/core#10788 <https://github.com/owncloud/core/issues/10788>`_
* Permalinks for internal shares: `owncloud/core#11732 <https://github.com/owncloud/core/issues/11732>`_
* Visual cue when dragging in files app: `owncloud/core#20150 <https://github.com/owncloud/core/pull/20150>`_
* Autoscroll file list when dragging files: `owncloud/core#22576 <https://github.com/owncloud/core/pull/22576>`_
* Upload progress estimate: `owncloud/core#24605 <https://github.com/owncloud/core/pull/24605>`_

Federated sharing
=================

* Ability to create federated shares with CRUDS permissions: `owncloud/core#23918 <https://github.com/owncloud/core/pull/23918>`_
* Resharing a federated share does not create a chain of shares any more but connects the share owner's server to the reshare recipient: `owncloud/core#24603 <https://github.com/owncloud/core/pull/24603>`_
* transform public links into real federated shares `nextcloud/server#379 <https://github.com/nextcloud/server/pull/379>`_

External storage
================

* UTF-8 NFD encoding compatibility support for NFD file names stored directly on external storages (new mount option in external storage admin page): `owncloud/core#21365 <https://github.com/owncloud/core/issues/21365>`_
* Direct links to the configuration pages for setting up a GDrive or Dropbox app for use with ownCloud `owncloud/core#22214 <https://github.com/owncloud/core/pull/22214>`_
* Some performance and memory usage improvements for GDrive, stream download and chunk upload: `owncloud/core#23517 <https://github.com/owncloud/core/pull/23517>`_ `owncloud/core#23323 <https://github.com/owncloud/core/pull/23323>`_
* Performance and memory usage improvements for Dropbox with stream download: `owncloud/core#23516 <https://github.com/owncloud/core/pull/23516>`_
* GDrive library update provides exponential backoff which will reduce rate limit errors: `owncloud/core#20481 <https://github.com/owncloud/core/issues/20481>`_

Minor additions
===============

* Support for print stylesheets: `owncloud/core#16857 <https://github.com/owncloud/core/pull/16857>`_
* Command line based update will now be suggested if the instance is bigger to avoid potential timeouts: `owncloud/core#23922 <https://github.com/owncloud/core/pull/23922>`_
* Web updater will be disabled if LDAP or shibboleth are installed `owncloud/core#24201 <https://github.com/owncloud/core/pull/24201>`_
* DB/app update process now shows better progress information: `owncloud/core#24305 <https://github.com/owncloud/core/pull/24305>`_
* Added ``occ files:scan --unscanned`` to only scan folders that haven't yet been explored on external storages  `owncloud/core#24702 <https://github.com/owncloud/core/pull/24702>`_
* Chunk cache TTL can now be configured: `owncloud/core#24812 <https://github.com/owncloud/core/pull/24812>`_
* Added warning for wrongly configured database transactions, helps prevent "database is locked" issues `owncloud/core#24889 <https://github.com/owncloud/core/pull/24889>`_
* Use a capped memory cache to reduce memory usage especially in background jobs and the file scanner `owncloud/core#24351 <https://github.com/owncloud/core/pull/24351>`_ `owncloud/core#24869 <https://github.com/owncloud/core/pull/24869>`_ `owncloud/core#24405 <https://github.com/owncloud/core/pull/24405>`_ `owncloud/core#24403 <https://github.com/owncloud/core/issues/24403>`_
* Allow login by email `owncloud/core#24389 <https://github.com/owncloud/core/issues/24389>`_
* Respect CLASS property in calendar events `owncloud/core#24080 <https://github.com/owncloud/core/issues/24080>`_
* Allow addressbook export using VCFExportPlugin `owncloud/core#23893 <https://github.com/owncloud/core/issues/23893>`_
* Birthdays are also generated based on shared addressbooks `owncloud/core#23510 <https://github.com/owncloud/core/issues/23510>`_

For developers
==============

* New DAV endpoint with a new chunking protocol aiming to solve many issues like timeouts (not used by clients yet): `owncloud/core#20118 <https://github.com/owncloud/core/issues/20118>`_
* New webdav property for share permissions `owncloud/core#22789 <https://github.com/owncloud/core/pull/22789>`_
* Background repair steps can be specified info.xml `owncloud/core#24274 <https://github.com/owncloud/core/pull/24274>`_
* Background jobs (cron) can now be declared in info.xml `owncloud/core#24392 <https://github.com/owncloud/core/pull/24392>`_
* Apps can now define repair steps to run at install/uninstall time `owncloud/core#24322 <https://github.com/owncloud/core/pull/24322>`_
* Export contact images via sabre dav plugin `owncloud/core#25081 <https://github.com/owncloud/core/pull/25081>`_
* Sabre DAV's browser plugin is available in debug mode to allow easier development around webdav `owncloud/core#23368 <https://github.com/owncloud/core/pull/23368>`_

Technical debt
==============

* PSR-4 autoloading forced for ``OC\`` and ``OCP\``, optional for ``OCA\`` `owncloud/core#13241 <https://github.com/owncloud/core/issues/13241>`_ docs at https://docs.nextcloud.com/server/10/developer_manual/app/classloader.html
* More cleanup of the sharing code (ongoing): `owncloud/core#22209 <https://github.com/owncloud/core/issues/22209>`_
