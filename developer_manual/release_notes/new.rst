.. _new-apis:

===================
New in this release
===================

This pages covers new features of the platform.

..
    Add one section for each new feature.
    Every feature should just have a brief description. Details have to be documented on a dedicated, persistent page.
    After branch-off the contents below will be cleared.

New ``\OCP\Files\IUserFolder`` API
----------------------------------

A new interface ``\OCP\Files\IUserFolder`` was added, extending ``\OCP\Files\Folder``.
This interface represents the user root folder similar to ``\OCP\Files\IRootFolder``.
``\OCP\Files\IRootFolder::getUserFolder`` now returns a ``\OCP\Files\IUserFolder`` instead of a ``\OCP\Files\Folder``.

Moreover ``\OCP\Files\IUserFolder::getUserQuota`` was added to read the used, free, total and configured quota space of a user.
As the new interface extends ``\OCP\Files\Folder`` this is not a breaking change for consumers.

See :doc:`../basics/storage/filesystem` for details.
