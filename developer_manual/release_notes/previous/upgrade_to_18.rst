=======================
Upgrade to Nextcloud 18
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/17131>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
-----------------

CSS
^^^

* Overall font-size was increased. Please make sure you use relative units like `rem` instead of pixels.

Deprecated global variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^

* ``Backbone``: ship your own.
* ``Clipboard``: ship your own.
* ``ClipboardJs``: ship your own.
* ``DOMPurify``: ship your own.
* ``Handlebars``: ship your own.
* ``jstimezonedetect``: ship your own.
* ``jstz``: ship your own.
* ``md5``: ship your own.
* ``moment``: ship your own.
* ``OC.basename``: use ``basename`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.dirname``: use ``dirname`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.encodePath``: use ``encodePath`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.isSamePath``: use ``isSamePath`` from https://www.npmjs.com/package/@nextcloud/paths
* ``OC.joinPaths``: use ``joinPaths`` from https://www.npmjs.com/package/@nextcloud/paths

Back-end changes
----------------

New APIs
^^^^^^^^

* ``\OCP\WorkflowEngine`` namespace

Deprecations
^^^^^^^^^^^^

* ``\OCP\Collaboration\Resources\IManager::registerResourceProvider``: use ``\OCP\Collaboration\Resources\IProviderManager::registerResourceProvider`` instead.

Behavioral changes
------------------

* Email shares and link shares now share the same config.
  You cannot create mail shares if the share links are disabled by your administrator
* Please register new sidebar tabs scripts with the ``OCA\Files\Event\LoadSidebar\Event`` script
* Viewer binds the full file object to the views now. Variables names changed!

