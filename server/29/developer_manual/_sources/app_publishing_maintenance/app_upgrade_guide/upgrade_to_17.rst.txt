
=======================
Upgrade to Nextcloud 17
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/15339>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
-----------------

Deprecated global variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^

* ``initCore``: don't use this internal function.
* ``oc_appconfig``: use ``OC.appConfig`` instead.
* ``oc_appswebroots``: use ``OC.appswebroots`` instead.
* ``oc_capabilities``: use ``OC.getCapabilities()`` instead.
* ``oc_config``: use ``OC.config`` instead.
* ``oc_current_user``: use ``OC.getCurrentUser().uid`` instead.
* ``oc_debug``: use ``OC.debug`` instead.
* ``oc_isadmin``: use ``OC.isUserAdmin()`` instead.
* ``oc_requesttoken``: use ``OC.requestToken`` instead.
* ``oc_webroot``: use ``OC.getRootPath()`` instead.
* ``OCDialogs``: use ``OC.dialogs`` instead.
* ``OC._capabilities``: use ``OC.getCapabilities()`` instead.
* ``OC.addTranslations``: use `OC.L10N.load` instead.
* ``OC.coreApps``: internal use only, no replacement.
* ``OC.getHost``: use the use ``window.location.host`` directly.
* ``OC.getHostName``: use the use ``window.location.hostname`` directly.
* ``OC.getPort``: use the use ``window.location.port`` directly.
* ``OC.getProtocol``: use the use ``window.location.protocol.split(':')[0]`` directly.
* ``OC.fileIsBlacklisted``: use the regex ``OC.config.blacklist_files_regex`` directly.
* ``OC.redirect``: use ``window.location`` directly.
* ``OC.reload``: use ``window.location.reload()`` directly.

Removed jQuery plugins
^^^^^^^^^^^^^^^^^^^^^^

* ``singleselect``: ship your own if you really need it.


Back-end changes
----------------

Removed from public namespace
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* ``\OCP\App::checkAppEnabled``
* ``\OCP\Security\StringUtils``
* ``\OCP\Util::callCheck``

Deprecations
^^^^^^^^^^^^

* ``\OCP\AppFramework\Http\EmptyContentSecurityPolicy::allowEvalScript``: This means apps should no longer use eval in their JavaScript. We aim to forbid this in general in a future version of Nextcloud.
* ``\OCP\AppFramework\Utility\IControllerMethodReflector::reflec``: Will be removed in 18.

Behavioral changes
------------------

* LDAP: default value for ``ldapGroupMemberAssocAttr`` changed from ``uniqueMember`` to unset. On scripted setups, it has to be set if LDAP groups should be used within Nextcloud.
* Provisioning API: creating users will return the assigned user ID as dataset, as in ``['id' => $userid]``.

