.. _deprecated-apis:

============
Deprecations
============

In order to improve our platform we are phasing out some APIs. Deprecated APIs are kept for at least
three years before removal, unless the breakage can not be avoided.

We highly recommend using the `Nextcloud Rector <https://packagist.org/packages/nextcloud/rector>`_
rules, which can fix some API changes automatically.

New deprecations
----------------

..
    Add one section for each group of deprecations (e.g. group files api changes, authentication changes).
    Also deprecate the feature at their dedicated documentation page.
    After branch-off the contents below will be cleared.

.. todo:: This page needs a section for every new deprecation.

- ``\OCP\Util::setChannel`` is now deprecated and you need to use ``\OCP\ServerVersion::setChannel`` instead.
- ``\OCP\Util::linkToAbsolute`` is now deprecated and you need to use ``\OCP\IUrlGenerator::getAbsoluteUrl`` and ``\OCP\IUrlGenerator::linkTo`` instead.
- ``\OCP\Util::linkToRemove`` is now deprecated and you need to use ``\OCP\IUrlGenerator::linkToRemote`` instead.
- ``\OCP\Util::isPublicLinkPasswordRequired`` is now deprecated and you need to use ``\OCP\Share\IManager::shareApiLinkEnforcePassword`` instead.
- ``\OCP\Util::isDefaultExpireDateEnforced`` is now deprecated and you need to use ``\OCP\Share\IManager::shareApiLinkDefaultExpireDateEnforced`` instead.

Older deprecations
------------------

You find all current deprecations in this section.

..
    This is where we will move the deprecations after the branch off. Entries will stay until actual removal.

Also see the older :ref:`Release Notes <previous-versions>` for deprecations.
