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

Actor API
---------

The new ``\OCP\Actor`` namespace describes who performs an operation, also when that is not a logged-in user:
a local or federated user, an anonymous user such as a public share visitor, a bot, or a system component.
An ``\OCP\Actor\Actor`` holds the principal whose authority is claimed, and optionally a delegate acting on its behalf.

See :ref:`actor_api` for details.

Resource permissions API
------------------------

The new experimental ``\NCU\Resource`` namespace lets an app restrict what another app allows on its resources,
without code specific to that app. Apps that own resources declare their resource types and permissions,
ask ``\NCU\Resource\Permission\IPermissionManager`` which permissions are left for an ``\OCP\Actor\Actor``,
and enforce the result.
Apps that restrict permissions, for example based on a label or a team role,
implement ``\NCU\Resource\Permission\IRestrictionProvider``.

See :ref:`resource_permissions` for details.
