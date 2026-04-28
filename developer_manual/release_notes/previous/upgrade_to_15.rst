=======================
Upgrade to Nextcloud 15
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/15339>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
-----------------

* ``unsafe-eval`` not allowed anymore by default.

Removed APIs
^^^^^^^^^^^^
- ``fileDownloadPath()``
- ``getScrollBarWidth()``
- ``OC.AppConfig.hasKey()``
- ``OC.AppConfig.deleteApp()``
- ``OC.Share.ShareConfigModel.areAvatarsEnabled()``
- ``OC.Util.hasSVGSupport()``
- ``OC.Util.replaceSVGIcon()``
- ``OC.Util.replaceSVG()``
- ``OC.Util.scaleFixForIE8()``
- ``OC.Util.isIE8()``

Back-end changes
----------------

* Removed PHP 7.0 support

Deprecated APIs
^^^^^^^^^^^^^^^

* ``\OCP\Util::linkToPublic``
* ``\OCP\Util::recursiveArraySearch``

Removed APIs
^^^^^^^^^^^^

* ``\OCP\Activity\IManager::publishActivity``
* ``\OCP\Util::logException``
* ``\OCP\Util::mb_substr_replace``
* ``\OCP\Util::mb_str_replace``
