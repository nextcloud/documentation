=================================
Coding style & general guidelines
=================================


General
-------

* Ideally, discuss your plans on the `forums <https://help.nextcloud.com>`_ to see if others want to work with you on it
* We use `GitHub <https://github.com/nextcloud>`_, please get an account there and clone the repositories you want to work on
* Fixes go directly to the main branch, nevertheless they need to be tested thoroughly.
* New features are always developed in a branch and only merged to the main branch once they are fully done.
* Software should work. We only put features into the main branch when they are complete.
  It's better to not have a feature instead of having one that works poorly.
* It is best to start working based on an issue - create one if there is none.
  You describe what you want to do, ask feedback on the direction you take it and take it from there.
* When you are finished, use the merge request function on GitHub to create a pull request.
  The other developers will look at it and give you feedback. You can signify that your PR is ready for review by adding the label "3. to review" to it.
  See `the code review page for more information <../prologue/bugtracker/codereviews.html>`_
* It is key to keep changes separate and small. The bigger and more hairy a PR grows, the harder it is to get it in.
  So split things up where you can in smaller changes - if you need a small improvement like a API addition for a big feature addition, get it in first rather than adding it to the big piece of work!
* Decisions are made by consensus. We strive for making the best technical decisions and as nobody can know everything, we collaborate.
  That means a first negative comment might not be the final word, neither is positive feedback an immediate GO. Nextcloud is built out of modular pieces (apps) and maintainers have a strong influence.
  In case of disagreement we consult other seasoned contributors.

Labels
------

We assign labels to issues and pull requests to make it easy to find them and to signal what needs to be done.
Some of these are assigned by the developers, others by QA, bug triagers, project lead or maintainers and so on.
It is not desired that users/reporters of bugs assign labels themselves, unless they are developers/contributors to Nextcloud.

The most important labels and their meaning:

* Tags showing the state of the issue or PR, numbered 0-4:

  * ``0. to triage`` - issue or feature request needs to get triaged and approved for development
  * ``1. to develop`` - ready to start development on this
  * ``2. developing`` - development in progress
  * ``3. to review`` - ready for review
  * ``4. to release`` - reviewed PR that awaits unfreeze of a branch to get merged or has pending CI jobs
  * ``needs info`` - this issue needs further information from the reporter, see :doc:`../../prologue/bugtracker/triaging`.
    This tag is typically combined with ``0. to triage`` to signal a bug report is not confirmed yet or a feature request has not been approved.

* Tags showing the type of issue or PR

  * ``bug`` - this issue is a bug
  * ``enhancement`` - this issue is a feature request/idea for improvement of Nextcloud
  * ``technical debt`` - this issue or PR is about `technical debt <https://en.wikipedia.org/wiki/Technical_debt>`_

* Tags that classify an issue or PR

  * ``high``, ``medium`` and ``low`` – signify how important the bug is.
  * ``regression`` - something that worked in a previous release but is now not working as expected or missing.
  * ``feature: *``, e.g. ``feature: dav`` – these tags group tickets of specific feature or subsystems.
  * ``design`` - this needs help from the design team or is a design-related issue/pull request
  * ``good first issue`` - these are issues which are relatively easy to solve and ideal for people who want to learn how to code in Nextcloud

* ``backport-request`` - the pull requests also needs to be applied to older Nextcloud versions. This tag is typically assigned by automation.

User interface
--------------

* Software should get out of the way. Do things automatically instead of offering configuration options.
* Software should be easy to use. Show only the most important elements. Secondary elements only on hover or via Advanced function.
* User data is sacred. Provide undo instead of asking for confirmation - `which might be dismissed <http://www.alistapart.com/articles/neveruseawarning/>`_
* The state of the application should be clear. If something loads, provide feedback.
* Do not adapt broken concepts (for example design of desktop apps) just for the sake of consistency. We aim to provide a better interface, so let's find out how to do that!
* Regularly reset your installation to see how the first-run experience is like. And improve it.
* Ideally do `usability testing <http://jancborchardt.net/usability-in-free-software>`_ to know how people use the software.
* For further UX principles, read `Alex Faaborg from Mozilla <http://uxmag.com/articles/quantifying-usability>`_.

Coding standards
----------------

* Maximum line-length of 80 characters
* Use tabs to indent
* A tab is 4 spaces wide
* Opening braces of blocks are on the same line as the definition
* Quotes: ' for everything, " for HTML attributes (<p class="my_class">)
* End of Lines : Unix style (LF / '\n') only
* No global variables or functions
* Code should be tested, ideally with unit and integration tests.
* When you ``git pull``, always ``git pull --rebase`` to avoid generating extra commits like: *merged main into main*

The most part of Nextcloud is written in PHP, Typescript / JavaScript, so we have some more fine grained coding standards for those languages:

.. toctree::
	:maxdepth: 1

	php
	javascript
	html_css

License headers
---------------

Nextcloud is licensed under the `GNU AGPLv3 <https://www.gnu.org/licenses/agpl>`_.
From June, 16 2016 on we switched to "GNU AGPLv3 or any later version" for better long-term maintainability.

If you create a new file please use this header:

.. code-block:: php

  /**
   * SPDX-FileCopyrightText: [year] [your name] [<your email address>]
   * SPDX-License-Identifier: AGPL-3.0-or-later
   */
   
The year should then be the creation time and the email address is optional.

If you edit an existing file please, please keep the existing license header as it is and just add your copyright notice, if you consider your changes substantial enough to claim copyright.

In order to do so there are two options:

* If a generic header is already present, please just add yourself to the AUTHORS.md file
* If no generic header is present, you can add yourself with a copyright line as described above. As a rule of thumb, this is the case if you contributed more than seven lines of code.

An example of a generic license header where adding yourself to the AUTHORS.md
file is preferred please see the example below

.. code-block:: php

  /**
   * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
   * SPDX-License-Identifier: AGPL-3.0-or-later
   */

The Nextcloud GmbH part only applies to employees of the company not to contributors.

For more, general information on SPDX headers and their usage for reuse-compliance, please see 

* `REUSE <https://reuse.software/>`_
* `SPDX <https://spdx.dev/>`_

