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

- ``\OCP\Broadcast\Events\\IBroadcastEvent`` is now deprecated as it is unused.
- ``\OCP\TaskProcessing\ISynchronousWatermarkingProvider`` is now deprecated. ``\OCP\TaskProcessing\ISynchronousOptionsAwareProvider`` should now be used.

Older deprecations
------------------

You find all current deprecations in this section.

..
    This is where we will move the deprecations from the "new deprecations" section after the branch off. Entries will stay until actual removal.

- Deprecated since Nextcloud 34

  - ``\OCP\AppFramework\App::buildAppNamespace`` is deprecated in favor of non-static method ``\OCP\App\IAppManager::getAppNamespace``
  - ``\OCP\Util::setChannel`` is deprecated in favor of ``\OCP\ServerVersion::setChannel``.
  - ``\OCP\Util::linkToAbsolute`` is deprecated in favor of ``\OCP\IUrlGenerator::getAbsoluteUrl`` and ``\OCP\IUrlGenerator::linkTo``.
  - ``\OCP\Util::linkToRemove`` is deprecated in favor of ``\OCP\IUrlGenerator::linkToRemote``.
  - ``\OCP\Util::isPublicLinkPasswordRequired`` is deprecated in favor of ``\OCP\Share\IManager::shareApiLinkEnforcePassword``.
  - ``\OCP\Util::isDefaultExpireDateEnforced`` is deprecated in favor of ``\OCP\Share\IManager::shareApiLinkDefaultExpireDateEnforced``.

Also see the older :ref:`Release Notes <previous-versions>` for deprecations.
