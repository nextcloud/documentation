.. _new-apis:

===================
New in this release
===================

This pages covers new features of the platform.

..
    Add one section for each new feature.
    Every feature should just have a brief description. Details have to be documented on a dedicated, persistent page.
    After branch-off the contents below will be cleared.

Email template blocks
---------------------

The email template (``\OCP\Mail\IEMailTemplate``) was redesigned with dark mode and
right-to-left support, and has new building blocks so emails no longer need hand-built HTML:

- ``addBodySender()`` shows who the email is about, with an initials circle.
- ``addBodyNote()`` shows a highlighted note from a user, or an info, warning or error message.
- ``addBodyDetails()`` shows a card with a title and labelled rows, built with ``\OCP\Mail\EMailDetails``.
- ``addBodyButtons()`` shows any number of buttons.
- ``setLanguage()`` sets the language of the email, which also mirrors the layout for right-to-left languages.

All values are escaped by the template. See :ref:`email` for details.

New ``\OCP\Files\IUserFolder`` API
----------------------------------

A new interface ``\OCP\Files\IUserFolder`` was added, extending ``\OCP\Files\Folder``.
This interface represents the user root folder similar to ``\OCP\Files\IRootFolder``.
``\OCP\Files\IRootFolder::getUserFolder`` now returns a ``\OCP\Files\IUserFolder`` instead of a ``\OCP\Files\Folder``.

Moreover ``\OCP\Files\IUserFolder::getUserQuota`` was added to read the used, free, total and configured quota space of a user.
As the new interface extends ``\OCP\Files\Folder`` this is not a breaking change for consumers.

See :doc:`../basics/storage/filesystem` for details.
