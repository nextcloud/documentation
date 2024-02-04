=======================
Upgrade to Nextcloud 16
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/12915>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
-----------------

* CSP: ``frame-anchestor`` set to ``self`` by default.

Deprecation of shipped JavaScript libraries
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following libraries are considered as deprecated from Nextcloud 16 on. If you use one of those in your app, make sure to ship your own version that is properly bundled with your app.

* ``marked``
* ``Clipboard`` -> now exported as ``ClipboardJS`` to resolve naming conflicts in Chrome.
* Apps should ship their own javascript dependencies and not depend on server shipping for example jquery etc. Depending on the server dist package is deprecated starting NC16.
* ``escapeHTML``
* ``formatDate``
* ``getURLParameter``
* ``humanFileSize``
* ``relative_modified_date``
* ``select2``


Back-end changes
----------------

* PHP 7.0 support removed. PHP 7.1 or higher required.
* PostgreSQL 9.5+ required.
* Autoloading: In the past it was also possible to autoload PHP classes in apps by specify a list of classes and filenames in `appinfo/classpath.php`. This should not be used anymore and also isn't used by any app that is publicly available.

Removed APIs
^^^^^^^^^^^^

* ``\OCP\Activity\IManager::getNotificationTypes``
* ``\OCP\Activity\IManager::getDefaultTypes``
* ``\OCP\Activity\IManager::getTypeIcon``
* ``\OCP\Activity\IManager::translate``
* ``\OCP\Activity\IManager::getSpecialParameterList``
* ``\OCP\Activity\IManager::getGroupParameter``
* ``\OCP\Activity\IManager::getNavigation``
* ``\OCP\Activity\IManager::isFilterValid``
* ``\OCP\Activity\IManager::filterNotificationTypes``
* ``\OCP\Activity\IManager::getQueryForFilter``
* ``\OCP\Security\ISecureRandom::getLowStrengthGenerator``
* ``\OCP\Security\ISecureRandom::getMediumStrengthGenerator``
