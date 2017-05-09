====================
App store publishing
====================

.. sectionauthor:: Jos Poortvliet <jospoortvliet@gmail.com>

The Nextcloud App Store
-----------------------
The Nextcloud app store is built into Nextcloud to allow you to get your apps to users as easily and safely as possible. The app store and the process of publishing apps aims to be:

* secure
* transparent
* welcoming
* fair
* easy to maintain

Apps in the store are divided in three 'levels' of trust:

* Official
* Approved
* Experimental

With each level come requirements and a position in the store.

Official
^^^^^^^^
Official apps are developed by and within the Nextcloud community and its `Github <https://github.com/nextcloud>`_ repository and offer functionality central to Nextcloud. They are ready for serious use and can be considered a part of Nextcloud.

Requirements:

* developed in Nextcloud github repo
* minimum of 2 active maintainers and contributions from others
* security audited and design reviewed
* app is at least 6 months old and has seen regular releases
* follows app guidelines
* supports the same platforms and technologies mentioned in the release notes of the Nextcloud version this app is made for

.. * app is signed, identity verified

App store:

* available in Apps page in separate category
* sorted first in all overviews, 'Official' tag
* shown as featured, on nextcloud.com etc
* major releases optionally featured on nextcloud.com
* new versions/updates approved by at least one other person

note:
Official apps include those that are part of the release tarball. We'd like to keep the tarball minimal so most official apps are not part of the standard installation.

Approved
^^^^^^^^
Approved apps are developed by trusted developers and have passed a cursory security check. They are actively maintained in an open code repository and their maintainers deem them to be stable for casual to normal use.

Requirements:

* code is developed in an open and version-managed code repository, ideally github with git but other scm/hosting is OK.
* minimum of one active developer/maintainer
* minimum 5 ratings, average score 60/100 or better
* app is at least 3 months old
* follows app guidelines
* the developer is trusted
* app is subject to unannounced security audits
* has defined requirements and dependencies (like what browsers, databases, PHP versions and so on are supported)

.. * app is signed, at least domain verified

.. note:: **Developer trust**: the developer(s) is/are known in community; he/she has/have been active for a while, have met others at events and/or worked with others in various areas.
.. note:: **Security audits**: in practice this means that at least some of the code of this developer has been audited; either through another app by the same developer or with an earlier version of the app. And that the attitude of the developer towards these audits has been positive.

App store:

* visible in app store by default
* sorted above experimental apps
* search results sorted by ratings
* developer can directly push new versions to the store
* warning shows for security/stability risks

Experimental
^^^^^^^^^^^^
Apps which have not been checked at all for security and/or are new, known to be unstable or under heavy development.

Requirements:

* no malicious intent found from this developer at any time
* 0 confirmed security problems
* less than 3 unconfirmed 'security flags'
* rating over 20/100

.. * app is signed but no verification has to be done

App store:

* show up in Apps page provided user has enabled "allow installation of experimental apps" in the settings.
* Warning about security and stability risks is shown for app
* sorted below all others.

Getting an app approved
-----------------------
If you want your app to be approved, make sure you fulfill all the requirements and then create an issue in the `app approval github repository <https://github.com/owncloud/app-approval>`_ using `this template <https://github.com/owncloud/app-approval/blob/master/README.md>`_. A team of Nextcloud contributors will review your application. Updates to an app require re-review but, of course, an initial review takes more effort and time than the checking of an update.

You are encouraged to help review other contributors' apps as well! Every app requires at least two independent reviews so your review of at least 2 (more is better!) other apps will ensure the process continues smoothly. Thank you for participating in this process and being a great Nextcloud Community member!

Using the code checker
^^^^^^^^^^^^^^^^^^^^^^
Before asking for approval, it is best to check your app code with the code checker, and fix the issues found by the code checker.

.. code-block:: bash

  ./occ app:check-code <app_name>
  
Losing a rating
^^^^^^^^^^^^^^^
Apps can lose their rating when:

* they are found to no longer satisfy the requirements
* when security/malicious intent issues are found
* when a developer requests so

App guidelines
--------------
These are the app guidelines an app has to comply with to have a chance to be approved.

Legal and security
^^^^^^^^^^^^^^^^^^

* Apps can not use 'Nextcloud' in their name
* Irregular and unannounced security audits of all apps can and will take place.
* If any indication of malicious intent or bad faith is found the developer(s) in question can count on a minimum 2 year ban from any Nextcloud infrastructure.
   * Malicious intent includes deliberate spying on users by leaking user data to a third party system or adding a back door (like a hard-coded user account) to Nextcloud. An unintentional security bug that gets fixed in time won't be considered bad faith.
* Apps do not violate any laws; it has to comply with copyright- and trademark law.
* App authors have to respond timely to security concerns and not make Nextcloud more vulnerable to attack.

.. note:: Distributing malicious or illegal applications can have legal consequences including, but not limited to Nextcloud or affected users taking legal action.

Be technically sound
^^^^^^^^^^^^^^^^^^^^

* Apps can only use the public Nextcloud API
* At time of the release of an app it can only be configured to be compatible with the latest Nextcloud release +1
* Apps should not cause Nextcloud to break, consume excessive memory or slow Nextcloud down
* Apps should not hamper functionality of Nextcloud unless that is explicitly the goal of the app

Respect the users
^^^^^^^^^^^^^^^^^

* Apps have to follow design and `HTML/CSS layout guidelines <../app/css.html>`_
* Apps correctly clean up after themselves on uninstall and correctly handle up- and downgrades
* Apps clearly communicate their intended purpose and active features, including features introduced through updates.
* Apps respect the users' choices and do not make unexpected changes, or limit users' ability to revert them. For example, they do not remove other apps or disable settings.
* Apps must respect user privacy. IF user data is sent anywhere, this must be clearly explained and be kept to a minimum for the functioning of an app. Use proper security measures when needed.
* App authors must provide means to contact them, be it through a bug tracker, forum or mail.

Apps which break the guidelines will lose their 'approved' or 'official' state; and might be blocked from the app store altogether. This also has repercussions for the author, especially in case of security concerns, he/she might find themselves blocked from submitting applications.
