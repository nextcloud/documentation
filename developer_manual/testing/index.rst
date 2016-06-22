====================
Nextcloud Test Pilots
====================

.. toctree::
   :maxdepth: 2
   :hidden:


The Nextcloud Test Pilots help to test and improve different server and client setups with Nextcloud.

Why do you want to join
-----------------------
There are many different setups and people have different interests. If we want Nextcloud to run well on NginX for instance someone has to test this configuration.

Furthermore, during bug fixing the Nextcloud developers often do not have the possibility to reproduce the bug in a given environment nor they are able confirm that it was fixed. As a member of the Test Pilot Team you could act as a contact person for a specific area to help developers **fix the bugs you care about**. Testing Nextcloud before it is released is the best way of making sure it does what you need it to!

Another benefit is a closer relationship to the developers: **You know what people are responsible for which parts** and it is easier to get help.

If you want you will be listed as an active contributor on the `nextcloud.org <https://nextcloud.org>`_ page.


Who can join
------------
Anyone who is interested in improving the quality on his/her setup and is willing to communicate with developers and other testers.

How do you join
---------------
Simply register on the `testpilot mailing list <https://mailman.nextcloud.org/mailman/listinfo/testpilots>`_ and send an introduction of your personal setup and interests to `testpilots@nextcloud.org <testpilots@nextcloud.org>`_

You can also join the **#nextcloud-testing** channel on **irc.freenode.net** but keep in mind that we may take longer to answer ;)

For further questions or help you can also send a mail to:

* freitag@nextcloud.com (IRC: dragotin)
* posselt@nextcloud.com (IRC: Raydiation)

What do you do
--------------
You will receive mails from the mailinglist and also from the bug tracker if developers need your help. Also there will be announcements of new releases and preview releases on the mailing list which give you the possibility to test releases early on and help developers to fix them.

We are looking forward to working with you :)

How do you test
---------------
Testing follows these steps:

* Set up your testing environment
* Pick something to test
* Test it
* Back to 2 until something unexpected/bad happens
* Check if what you found is really a bug
* File the bug

Installing Nextcloud
-------------------
Testing starts with setting up a testing environment. We urge you to not put your production data on testing
releases unless you have a backup somewhere!

Start by installing Nextcloud, either on real hardware or in a VM.

You can find instructions for installation in the `admin documentation <../../admin_manual/#installation>`_.

Please note that we are still working on the documentation and if you bump into a problem, you can
`help us fix it <https://github.com/nextcloud/documentation>`_. Small things can be edited straight on github.

The Real Testing
----------------
Testing is a matter of trying out some scenarios you decide or were asked to test, for example, sharing a folder
and mounting it on another Nextcloud instance. If it works – awesome, move on. If it doesn't, find out
as much as you can about why it doesn't and use that for a bug report.

This is the stage where you should see if your issue is already reported by checking the issue
tracker. It might even be fixed, sometimes! It can also be fruitful to contact the
`developers on irc <irc://freenode/#nextcloud-dev>`_. Tell them you're testing Nextcloud
and share what problem you bumped into. Or just ask on the test-pilots mailing list.

Finally, if the issue you bump into is a clear bug and the developers are not aware of it, file it as a new issue. See :doc:`../bugtracker/index`




