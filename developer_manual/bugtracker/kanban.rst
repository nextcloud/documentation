Development process
===================

This chapter contains a lot of information about the development process the
Nextcloud community tries to follow, so please take your time to digest all the
information. In any case remember this page as the documentation on how it
should be done. Nothing here is set in stone, so if you think something should
be changed please discuss it on the `forums`_.

The Labels
----------

The following list shows what the labels mean in the life-cycle and will
hopefully help you decide how to label an issue.

Backlog
~~~~~~~

Why do we have it?
  To keep us focused on finishing issues that we started, new issues will be
  hidden in this column. In HuBoard you can see the list of things that we could
  think about by clicking the small arrow in the top left corner of the concept
  column header.

What does a developer think?
  "Maybe later."

When can I pull?
  Since this is the bucket for whatever might be done you should only pick
  issues from the backlog when there is no other issue that you can work on. It
  is more important to finish an issue currently on the Kanban board than to
  pull a new one into the flow because only released issues have a value to our
  users!

Who is Assigned?
  Either a maintainer feels directly responsible for the issue and assigns
  himself or the gatekeeper (the guys having a look at unassigned bugs) will try
  to determine the responsible developer.

Concept
~~~~~~~

Why do we have it?
  Our think before you act phase serves two purposes. A Bug is in the concept
  phase while we are trying to figure out why something is broken (analysis). An
  Enhancement is in the concept phase until we have decided how to implement it
  (design).

What does a developer think?
  "I’ll write a Scenario for our BDD in `Gherkin`_ and post it as a comment. I
  can always look at the `existing ones`_ to get an inspiration how to phrase
  them as `“Given … when … then …“`_"

When can I pull?
  As long as you think and discuss on how to implement an enhancement or how to
  solve a bug you should leave the concept label assigned. Two things should be
  documented in a comment to the issue before moving it to the "To develop"
  step:

    * At least one Scenario – written in Gherkin – that tells you and the tester
      when the issue is ready to be released.

    * A concept describing the planned implementation. This can be as simple as
      a “this just needs changes to the login screen CSS” or so complex that you
      link to a blog entry somewhere else.

Who is Assigned?
  The maintainer that feels responsible for the issue.

To Develop
~~~~~~~~~~

Why do we have it?
  Now that we have a plan, any developer can pick an issue from this column and
  start implementing it. If the issue is also marked with Junior Job this might
  be a good starting point for new developers.

What does a developer think?
  "Nice! I can safely implement it that way because more than one person has put
  his brain to the task of coming up with a good solution. Here! Me! I’ll do
  it!"

When can I pull?
  If you feel like diving into the code and getting your hands dirty you should
  look for issues with this label. In the comments, there should be a Gherkin
  scenario to tell you when you are done and a concept describing how to
  implement it. Before you start move the issue to the “Developing” step by
  assigning the "4 – Developing" label.

Who is Assigned?
  No one. Especially not if you are working on something else!

Developing
~~~~~~~~~~

Why do we have it?
  This is where the magic happens. If it’s a Bug the fix will be submitted as a
  PULL REQUEST to the master or corresponding stable branch. If its an
  Enhancement code will be committed to a feature branch.

What does a developer think?
  "You know, I’m at it. By the way, I’ll also write `unit tests`_. When I’m done
  I’ll push the issue with a commit containing "push GH-#" where # is the issue
  number. If I have an idea of who should review it I can also notify them with
  @githubusername"

When can I pull?
  As long as you are writing code for the issue or if any unit test fails you
  should leave the “4 – Developing” label assigned. Two things should have been
  implemented before moving the issue to the “To review” step:

  * The enhancement or bug in question
  * Unit tests for the changed and added code.

Who is Assigned?
  The most active developer should assign himself.

To Review
~~~~~~~~~

Why do we have it?
  Instead of directly committing to master we agree that **a second set of eyes
  will spot bugs** and increase our code quality and give us an opportunity to
  learn from each other. See also our `Code Review Documentation`_

What does a developer think?
  "I’ll check the Scenario described earlier works as expected. If necessary
  I’ll update the related Gherkin Scenarios. `Drone`_ will test the scenario
  on all kinds of platforms, Web server and database combinations with
  `Cucumber`_."

When can I pull?
  If you feel like making sure an issue works as expected you should look for
  issues with this label. In the comments you should find a Gherkin scenario that
  can be used as a checklist for what to try. Before you start move the issue to
  the “Reviewing” step by assigning the “6 – Reviewing” label.

**Who is Assigned?** No one. Especially not if you are working on something else!

Reviewing
~~~~~~~~~

Why do we have it?
  With the Gherkin Scenario from the Concept Phase reviewers have a checklist to
  test if a Bug has been solved and if an Enhancement works as expected. **The
  most eager reviewer we have is Drone**. When it comes to testing he soldiers
  on going through the different combinations of platform, Web server and
  database.

What does a developer think?
  "Damn! If I had written the Gherkin Scenarios and Cucumber Step Definitions I
  could leave the task of testing this on the different combinations of platform,
  Web server and database to Drone. I’ll miss something when doing this
  manually.*

When can I pull?
  As long as you are reviewing the issue you should leave the "6 –
  Reviewing" label assigned. Before moving the issue to the "To review" step the
  issue should have been resolved, meaning that not only the issue has been
  implemented but also no other functionality has been broken.

Who is Assigned?
  The most active reviewer should assign himself.

To Release
~~~~~~~~~~

Why do we have it?
  This is a list of issues that will make it into the next release. It serves
  as a source for the changelog, as well as a reminder of the work we can already
  be proud of.

What does a developer think?
  "Look at all the shiny things we will release with the next version of
  Nextcloud!"

When can I pull?
  This is the last step of the Kanban board. When the Release finally happens
  the issue will be closed and removed from the board.

Who is Assigned?
  No one.


While we stated before that we push issues to the next column, we can
of course move the item back and forth arbitrarily. Basically you can drag the
issue around in the HuBoard or just change the label when viewing the issue in
the GitHub.

Reviewing considered impossible?
--------------------------------

How can you possibly review an issue when it requires you to test various
combinations of browsers, platforms, databases and maybe even app combinations?
Well, you can’t. But you can write a Gherkin scenario that can be used to write
an automated test that is executed by Drone on every commit to the main
repositories. If for some reason Drone cannot be used for the review you will
find yourself in the very uncomfortable situation where you release half tested
code that will hopefully not eat user data. Seriously! Write Gherkin scenarios!

Other Labels
------------

Priority Labels
~~~~~~~~~~~~~~~

* Panic should be used with caution. It is reserved for Bugs that would result
  in the loss of files or other user data. An Enhancement marked as Panic is
  expected by Nextcloud users for the next release. In either case an open Panic
  issue will prevent a release.

* Attention is not as hard as Panic. But we really want this in the next release
  and will dedicate more effort for it. But if we think the issue is not ready
  for the next release we will postpone it to the next one.

* Regression is something that worked in a previous release but is now not
  working as expected or missing. If a certain functionality is up for code
  refactoring, the developer should describe all possible use cases as a Gherkin
  scenarios beforehand, so that any scenarios that isn’t implemented before the
  required milestone can be marked as a regression. If a regression is found
  after a release, the reporter – or the developer triaging the issue – should
  describe the functionality as a Gherkin scenario and either fix it or assign
  it to the developer in charge of that part.

App Labels
~~~~~~~~~~

In the apps repository there are labels like ``app:gallery`` and
``app:calendar``. The ``app:`` prefix is used to allow developers to filter
issues related to a specific app.

Resolution Status
~~~~~~~~~~~~~~~~~

* Fixed – Should be assigned to issues in to Release
* Won’t fix – Reason is given as a comment
* Duplicate – Corresponding bug is given in a comment (using #guthubissuenumber)

Misc Labels
~~~~~~~~~~~

* Needs info – Either from a developer or the bug reporter. This is nearly as
  severe as Panic, because no further action can be taken
* L18n – A translation issue; go see our `Transifex`_
* Junior Job – The issue is considered a good starting point to get involved in Nextcloud development

Milestones equal Releases
-------------------------

Releases are planned via milestones which contain all the Enhancements and Bugs
that we plan to release when the Deadline is met. When the Deadline approaches
we will push new Enhancement request and less important bugs to the next
milestone. This way a milestone will upon release contain all the issues that
make up the changelog for the release. Furthermore, HuBoard allows us to filter
the Kanban board by Milestone, making it especially easy to focus on the current
Release.

.. _kanban board: http://en.wikipedia.org/wiki/Kanban_board
.. _forums: https://help.nextcloud.org
.. _Gherkin: https://github.com/cucumber/cucumber/wiki/Gherkin
.. _existing ones: https://github.com/nextcloud/server/tree/master/build/integration/features
.. _“Given … when … then …“: https://github.com/cucumber/cucumber/wiki/Given-When-Then
.. _unit tests: https://github.com/nextcloud/server/tree/master/tests
.. _Code Review Documentation: codereviews
.. _Drone: https://drone.weasel.rocks
.. _Cucumber: http://cukes.info/
.. _Transifex: https://www.transifex.com/nextcloud/
