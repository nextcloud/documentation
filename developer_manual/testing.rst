Testing
=======

Testing ownCloud is important to ensure quality and the best possible experience for users. The release cycle is fast and to maintain this speed ownCloud needs continuous testing and involvement from the community. When ownCloud approaches a major release, a formal testing process is organized with specific tasks for testers to confirm as functional. This begins with the first alpha release and will continue through the release candidates. Testers will be assigned tasks, test the pre-releases, and report bugs to the `bug tracker`_. Formal testers will be recognized on owncloud.org as a thank from the entire ownCloud community.ownCloud strives to run on all types of platforms without strict requirements. PHP does not have the same behavior on Linux, OS X, and Windows especially with regards to the filesystem. Differences in behavior can also occur on different web servers. This means that ownCloud needs to be tested on as many server configurations as possible before a major release.

Who can get involved?
---------------------

Anyone can get involved in the formal testing process. No programming experience is necessary. If you would like to get involved and help improve the quality of ownCloud please contact Michael Gapczynski (MTGap) in the `Dev IRC Channel`_. Remember, the quality of ownCloud is not only the responsibility of the developers, but the entire community.

Release Schedule
----------------

* 20.08.12 - Soft feature freeze (Alpha 1)
* 28.08.12 - Hard feature freeze (Beta 1)
* 03.09.12 - Beta 2 Only bugfixes are allowed from now on
* 10.09.12 - RC 1 Only showstopper bugfixes are allowed from now on
* 17.09.12 - RC 2
* 26.09.12 - Announcement of ownCloud 4.5

Testing guidelines
------------------

* Contact Michael Gapczynski if you would like to formally participate in testing
* Inform Michael of your exact server configuration, including OS, PHP version, and database
* Checkout the latest version from the master branch
* Do not install in a production environment, pre-releases may cause data loss
* Run the unit tests in the tests folder and ensure all tests are passing
* Perform your assigned tasks, report any bugs to the `bug tracker`_
* When reporting any bugs to the `bug tracker`_, please specify the pre-release version in the release field.

Tests
-----

Test tasks are categorized by apps, those at the top of the list have priority for testing during this release. While 3rd party apps are not supported by ownCloud, app developers may also request for testing of their apps here.

* `Files`_
* `Sharing`_
* Settings
* Calendar
* Contacts
* Media
* `LDAP user and group backend`_

.. _Files: http://owncloud.org/dev/testing/files
.. _Sharing: http://owncloud.org/dev/testing/sharing
.. _LDAP user and group backend: http://owncloud.org/dev/testing/ldap-backend/
.. _bug tracker: https://github.com/owncloud/core/issues
.. _Dev IRC Channel: http://webchat.freenode.net/?channels=owncloud-dev
