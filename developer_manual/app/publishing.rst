====================
App store publishing
====================

.. sectionauthor:: Jos Poortvliet <jospoortvliet@gmail.com>

The Nextcloud app store
-----------------------
The Nextcloud app store is built into Nextcloud to allow you to get your apps to users as easily and safely as possible. The app store and the process of publishing apps aims to be:

* secure
* transparent
* welcoming
* fair
* easy to maintain

Getting an app approved
-----------------------
You can find documentation on getting apps in our app store `here. <http://nextcloudappstore.readthedocs.io/en/latest/developer.html#publishing-apps-on-the-app-store>`_

Using the code checker
^^^^^^^^^^^^^^^^^^^^^^
Before getting the app in the app store, it is best to check your app code with the code checker, and fix the issues found by the code checker.

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

* Apps can not use 'Nextcloud' in their name.
* Irregular and unannounced security audits of all apps can and will take place.
* If any indication of malicious intent or bad faith is found the developer(s) in question can count on a minimum 2 year ban from any Nextcloud infrastructure.
   * Malicious intent includes deliberate spying on users by leaking user data to a third party system or adding a back door (like a hard-coded user account) to Nextcloud. An unintentional security bug that gets fixed in time won't be considered bad faith.
* Apps do not violate any laws; it has to comply with copyright- and trademark law.
* App authors have to respond timely to security concerns and not make Nextcloud more vulnerable to attack.

.. note:: Distributing malicious or illegal applications can have legal consequences including, but not limited to Nextcloud or affected users taking legal action.

Be technically sound
^^^^^^^^^^^^^^^^^^^^

* Apps can only use the public Nextcloud API.
* At time of the release of an app it can only be configured to be compatible with the latest Nextcloud release +1.
* Apps should not cause Nextcloud to break, consume excessive memory or slow Nextcloud down.
* Apps should not hamper functionality of Nextcloud unless that is explicitly the goal of the app.

Respect the users
^^^^^^^^^^^^^^^^^

* Apps have to follow design and `HTML/CSS layout guidelines <../app/css.html>`_.
* Apps correctly clean up after themselves on uninstall and correctly handle up- and downgrades.
* Apps clearly communicate their intended purpose and active features, including features introduced through updates.
* Apps respect the users' choices and do not make unexpected changes, or limit users' ability to revert them. For example, they do not remove other apps or disable settings.
* Apps must respect user privacy. IF user data is sent anywhere, this must be clearly explained and be kept to a minimum for the functioning of an app. Use proper security measures when needed.
* App authors must provide means to contact them, be it through a bug tracker, forum or mail.

Apps which break the guidelines will lose their 'approved' or 'official' state; and might be blocked from the app store altogether. This also has repercussions for the author, especially in case of security concerns, he/she might find themselves blocked from submitting applications.

Putting your repo in the Nextcloud Project
------------------------------------------
We're always delighted to hear app develpers are interested in moving their app into the Nextcloud Project in `github.com/nextcloud <https://github.com/nextcloud>`_! There are benefits for users and developers in being there. However, it comes with some requirements as well.

Benefits
^^^^^^^^

* You can use the tools and bots we have set up, including translations and such
* Everybody in the Nextcloud project can more easily contribute
* Your visibility to app developers increases
* Users can expect apps in our project to be better maintained

Requirements
^^^^^^^^^^^^
To deliver on the promises above, we have two simple rules.

* You participate in our `collaborative development model <../general/code-of-conduct.html>`_
* When you are no longer active, our admins can decide to hand over maintainership to another contributor

We want to make sure that when you find other things in life which are more urgent or otherwise are unable to help your project anymore, it does not become 'dead code' as long as there are people who want to keep it alive. This is not fair to users, who would be forced to remove the app and install another.

Please note that the role of a maintainer is not to be the most active or prolific contributor to a project! Worlds' `most famous maintainer of an open source project <https://en.wikipedia.org/wiki/Linus_Torvalds>`_ has not appeared in the top-100 of contributors by lines of code for decades, yet he runs the largest single software development project in the history of mankind. Being friendly, welcoming and responsive are what it takes to be a successful maintainer. Not being the most brilliant developer ever, or spending nights and weekends coding!

The goal of these rules is simple: help your project be more successful. We also suggest you watch this talk by `Jan about building a great community. <https://www.youtube.com/watch?v=UtAoRIKVpW4>`_

How to move
^^^^^^^^^^^

To move into our github repo, just ask any of our contributors, `especially those who are admin. <https://github.com/orgs/nextcloud/people?utf8=%E2%9C%93&query=+role%3Aowner>`_ They will be happy to help!
