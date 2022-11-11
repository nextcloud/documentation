====================================
Compatibility with the app ecosystem
====================================

The Nextcloud app ecosystem consists of hundreds of apps and app maintainers.

The development process may require changes that affect apps in this ecosystem. These changes may either be a change in standards or best practises, yet in more extreme cases the changes may also be breaking apps.

While developers are expected to aim for limiting the number of changes that break apps, this cannot always be avoided or is not always reasonable to do to maintain an up-to-date technology stack.

Informing app developers about any change that affect them is therefore key to a thriving ecosystem. This page describes the three procedures to document changes that are relevant to app developers.


Documentation procedures of changes that affect app developers
--------------------------------------------------------------
There are three procedures in place to facilitate communication to app developers about changes that affect them:


1. The definition of done of a pull request includes documentation.
This means the development of your pull request cannot be considered done if you introduced changes that affect app developers that you did not document.

2. A change that affects app developers, has to be reported and documented by the author of the pull request in the `Changes for developers and administrators issue <https://github.com/nextcloud/server/issues/34692>`_.
The requirements for this documentation are:

  - It should be written so that app developers understand how to work around the change for their app in a tutorial format
  - The steps should be explicitly written, so the documentation shall not rely upon links to external resources for the steps. While it is encouraged to add an external links as additional reference, it is a hard requirement that the documentation is readable and actionable without browsing to this link.
  - The documentation has to be carefully written. The author's name will be added to the final publication so readers can reach out to the author if they have questions or if something is unclear.
  - Timeline: the documentation is required to be handed in immediately after merging the pull request.


3. The documentation will then be copy-pasted into the developer documentation and on the forum for the first beta release.
