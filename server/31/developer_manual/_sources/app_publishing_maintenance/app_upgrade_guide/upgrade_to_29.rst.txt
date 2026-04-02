=======================
Upgrade to Nextcloud 29
=======================

General
-------

* The Circles app will be renamed to Teams. Apps that use the terms Circle/Circles need to get adjusted to use Team/Teams instead. For example ``share to circle`` would become ``share to team``.
* The ``updatenotification`` app now also supports notifications for apps that were updated.
  If the updated app provides a ``CHANGELOG.language.md`` or ``CHANGELOG.en.md`` file, it will create notifications for users about these changes. See also the :ref:`app changelog<app changelog>` section.

info.xml
^^^^^^^^

Make sure your ``appinfo/info.xml`` allows for Nextcloud 29.

.. code-block:: xml

    <dependencies>
        <nextcloud min-version="27" max-version="29" />
    </dependencies>

Front-end changes
-----------------

Changed APIs
^^^^^^^^^^^^

* `IAppConfig` has been fully reworked, most of previous methods are now deprecated. The new version of the API implements multiple settings for app config values to define their laziness and sensitivity.

Removed globals
^^^^^^^^^^^^^^^

* Global ``autosize`` is removed, it was deprecated for over 4 years and scheduled for removal with Nextcloud 20. If you still need it you should ship your own version.

Deprecated APIs
^^^^^^^^^^^^^^^

* ``OC.dialogs.fileexists`` is deprecated. Use ``openConflictPicker`` from `@nextcloud/upload <https://nextcloud-libraries.github.io/nextcloud-upload/functions/openConflictPicker.html>`_ instead.

Back-end changes
----------------

Added APIs
^^^^^^^^^^

* The Attributes ``OCP\AppFramework\Http\Attribute\ApiRoute`` and ``OCP\AppFramework\Http\Attribute\FrontpageRoute`` can be used for routing registering routes. See :doc:`/basics/routing` for documentation.

Changed APIs
^^^^^^^^^^^^

* ``OCP\IURLGenerator::URL_REGEX_NO_MODIFIERS``: Changed to match localhost and hostnames with ports.
* ``OCP\Files\IMimeTypeLoader``: Every method from this interface now has type declarations. Make sure to update your implementation if you have one.
* ``OCP\IRequest::getParam('_route')`` and ``OCP\IRequest::getParams()['_route']``: The route name (consisting of app ID, controller name and controller method) is now all lower case

Removed APIs
^^^^^^^^^^^^

* ``OCP\Log\ILogFactory::getCustomLogger``: use ``\OCP\Log\ILogFactory::getCustomPsrLogger`` to get a customized :ref:`PSR3 <psr3>` logger
* ``oc_share`` table: Due to massive performance impact on queries when selecting additionally for ``item_type``,
  it is no longer allowed, to use the ``oc_share`` table for any other types than ``file`` and ``folder``.
* ``OC\BackgroundJob\Job``, ``OC\BackgroundJob\QueuedJob`` and ``OC\BackgroundJob\TimedJob``: use the ``OCP`` versions.

Removed events
^^^^^^^^^^^^^^

* ``OCP\Dashboard\RegisterWidgetEvent`` was deprecated in Nextcloud 20 and is now removed. Use ``OCP\AppFramework\Bootstrap\IRegistrationContext::registerDashboardWidget`` from within your app bootstrap.

Changed behavior
^^^^^^^^^^^^^^^^

The dashboard no longer loads the sidebar or Viewer scripts, if your dashboard widget relies on this it should emit the required events itself.
