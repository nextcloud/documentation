=======================
Upgrade to Nextcloud 26
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/34692>`_.
    See the original ticket for links to the pull requests and tickets.

General
-------

info.xml
^^^^^^^^

Make sure your ``appinfo/info.xml`` allows for Nextcloud 26.

.. code-block:: xml

    <dependencies>
        <nextcloud min-version="23" max-version="26" />
    </dependencies>

Personal settings section *Groupware* moved to *Availability*
-------------------------------------------------------------

Up to Nextcloud 25 there had been a :ref:`settings section<settings-section>` *Groupware* with the ID ``groupware``. As of Nextcloud 26 this section doesn't exist anymore. Existing server settings were moved to a new section *Availability*/``availability``.

If your app provides groupware-related settings, see if they make can be shown on the *Availability* page or need a new app-provided section.

Front-end changes
-----------------

Removed APIs
^^^^^^^^^^^^

* :code:`OC.addTranslations` was deprecated since Nextcloud 17 and is now removed.
* The "app icons" background (https://github.com/nextcloud/server/blob/stable25/core/img/background.png and https://github.com/nextcloud/server/blob/stable25/core/img/background.svg) is not used anymore and will be removed (was only used on login page, where we now use the "clouds" background).
* **Bootstrap removed**: The shipped bootstrap was only used for tooltips since ages but shipped and therefore available globally. Because the version we shipped is now EOL, we decided to remove it instead of bringing in a breaking update. For any tootltip it is recommended to just switch to the native :code:`title=` HTML attribute. (`PR#36434 <https://github.com/nextcloud/server/pull/36434>`_ by `nickvergessen <https://github.com/nickvergessen>`_)

Back-end changes
----------------

PHP 7.4
^^^^^^^

In this release support for PHP 7.4 was dropped. Make sure your app compatible with PHP 8.0 or higher.

PHP 8.2
^^^^^^^

In this release support for PHP 8.2 was added. See release notes from PHP about new deprecations.

Migration from PHPDoc annotations to native PHP attributes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud 26 supports PHP 8.0 and later. This allows the migration from PHPDoc annotations to native attributes.

* ``@UseSession`` should be replaced with ``#[UseSession]``. ``@UseSession`` will be removed in a future release. See :ref:`controller-use-session`.

Planned removal of PSR-0 class loading
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud is still loading classes that follow the long deprecated and replaced :ref:`PSR-0 standard <psr0>`. Nextcloud 26 is the last version that register a generic PSR-0 class loader. From Nextcloud 27 on apps have to either change class file names to match PSR-4 or ship their own (composer) class loader for PSR-0 files or. (`PR#36114 <https://github.com/nextcloud/server/pull/36114>`_ by `ChristophWurst <https://github.com/ChristophWurst>`_)

Dependency Injection Parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

App container parameters with pascal case names ``AppName``, ``UserId`` and ``WebRoot`` are deprecated. Use the camel case variants ``appName``, ``userId`` and ``webRoot`` instead if you have them injected into one of your app classes.

Changed APIs
^^^^^^^^^^^^

* ``OCP\Files\SimpleFS\ISimpleFile::getSize()`` may now return a float (to support sizes >2G on 32bit systems)
* ``OCP\Files\SimpleFS\InMemoryFile::getSize()`` may now return a float (to support sizes >2G on 32bit systems)
* It is not required anymore to call ``setParsedSubject`` and ``setParsedMessage`` on notifications and activity events when setRichSubject and setRichMessage are used a parsed version is computed automatically. (`PR#34807 <https://github.com/nextcloud/server/pull/34807>`_ by `come-nc <https://github.com/come-nc>`_)
* Moved ``ICreateFromString::handleIMipMessage(string $name, string $calendarData): void;`` to its own Interface ``IHandleImipMessage`` (`PR#34893 <https://github.com/nextcloud/server/pull/34893>`_ by `miaulalala <https://github.com/miaulalala>`_)
* Signatures of methods of ``OCP\AppFramework\Db\Entity`` changed as follows (`ref <https://github.com/nextcloud/server/commit/e91457d9cd68182591038636155d415b5dee0ec4>`_):
    * ``public static function fromParams(array $params) -> public static function fromParams(array $params): static``
    * ``public static function fromRow(array $row) -> public static function fromRow(array $row): static``
    * ``protected function setter($name, $args) -> protected function setter(string $name, array $args): void``
    * ``protected function getter($name) -> protected function getter(string $name): mixed``
    * ``protected function markFieldUpdated($attribute) -> protected function markFieldUpdated(string $attribute): void``
* Middlewares can be registered globally (see :ref:`global_middlewares`, `PR#36310 <https://github.com/nextcloud/server/pull/36310>`_ by `ChristophWurst <https://github.com/ChristophWurst>`_)

Removed APIs
^^^^^^^^^^^^

* ``OCP\BackgroundJob\IJobList::getAll`` method was removed (`PR#36073 <https://github.com/nextcloud/server/pull/36073>`_ by `come-nc <https://github.com/come-nc>`_)
* 3rdparty dependency ``php-ds/php-ds`` was removed (`PR#36198 <https://github.com/nextcloud/server/pull/36198>`_ by `kesselb <https://github.com/kesselb>`_)
* ``OCP\Contacts\IManager::getAddressBooks`` method was removed (`PR#34329 <https://github.com/nextcloud/server/pull/34329>`_ by `come-nc <https://github.com/come-nc>`_)
* ``OCP\Util`` loglevel constants were removed (`PR#34329 <https://github.com/nextcloud/server/pull/34329>`_ by `come-nc <https://github.com/come-nc>`_)
* 3rdparty dependency ``nikic/php-parser`` was removed (`PR#36393 <https://github.com/nextcloud/server/pull/36393>`_ by `kesselb <https://github.com/kesselb>`_)
* Deprecated ``OCP\AppFramework\Db\Mapper`` was removed. You can easily migrate to ``OCP\AppFramework\Db\QBMapper``, which is doing the same thing using the query builder instead of string based queries. (`PR#34490 <https://github.com/nextcloud/server/pull/34490>`_ by `rullzer <https://github.com/rullzer>`_)
* Deprecated classes of ``OCP\Dashboard`` were removed (`PR#35966 <https://github.com/nextcloud/server/pull/35966>`_ by `juliushaertl <https://github.com/juliushaertl>`_)

Added APIs
^^^^^^^^^^

* New ``OCP\Authentication\Token\IProvider`` for authentication providers: Created a new public interface ``OCP\Authentication\Token\IProvider`` with a method invalidateTokensOfUser to invalidate all tokens of a specific user. ``OC\Authentication\Token\Manager`` implements ``OCP\Authentication\Token\IProvider``. (`PR#36033 <https://github.com/nextcloud/server/pull/36033>`_ by `individual-it <https://github.com/individual-it>`_)
* ``Auto-Submitted`` header for emails: There now is a new method on the ``OCP\Mail\IMessage`` interface ``IMessage::setAutoSubmitted()``. With this method you can specify that an email was an automatic email or response, to allow mail servers to better detect if an out-of-office reply should be sent, better store/filter the emails and so on. Possible values are documented in the ``OCP\Mail\Headers\AutoSubmitted`` interface. (`PR#36033 <https://github.com/nextcloud/server/pull/36033>`_ by `bennet0496 <https://github.com/bennet0496>`_)
* ``OCP\BackgroundJob\IJobList::getJobsIterator`` method was added (`PR#36073 <https://github.com/nextcloud/server/pull/36073>`_)
* New ``OCP\BeforeSabrePubliclyLoadedEvent`` event dispatched on public webdav endpoints (it can be used just like ``OCP\SabrePluginEvent`` to inject additional Sabre plugins in apps for example) (`PR#35789 <https://github.com/nextcloud/server/pull/35789>`_)

Deprecated
----------

* ``OCP\BackgroundJob\IJobList::getJobs`` method was deprecated (`PR#36073 <https://github.com/nextcloud/server/pull/36073>`_)
* Controller action annotation ``@UseSession`` is deprecated. Use new ``UseSession`` attribute instead (`PR#36363 <https://github.com/nextcloud/server/pull/36363>`_ by `ChristophWurst <https://github.com/ChristophWurst>`_)
* **Notifications jQuery event deprecated**: The ``OCA.Notification.Action`` event of the notifications app is deprecated in favor of a ``notifications:action:executed`` event-bus event with (`PR#728 <https://github.com/nextcloud/notifications/pull/728>`_ by `nickvergessen <https://github.com/nickvergessen>`_)
