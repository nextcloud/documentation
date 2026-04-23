=======================
Upgrade to Nextcloud 14
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/7827>`__. See the original ticket for links to the pull requests and tickets.

General
-------

* PHP 7.0 and PHP 7.1 support added.
* Introduction of type hints for scalar types in public APIs according to existing PHPDoc.

Front-end changes
-----------------

* ``OCA.Search`` is now ``OCA.Search.Core``.
* Overall structure changed.
* ``.with-app-sidebar`` not required anymore to open the sidebar only use `disappear` on the sidebar
* ``.svg`` not required anymore
* ``.with-settings`` not required anymore
* ``.with-icon`` not required anymore

Back-end changes
----------------

Changed APIs
^^^^^^^^^^^^

* ``AppFramework\Http\Request::getHeader`` always returns a string (and not null).
* ``Security\ICrypto::decrypt`` only accepts strings.
* ``\OCP\AppFramework\Utility\ITimeFactory`` is strictly typed.
* ``\OCP\IL10N`` is strictly typed.
* ``\OCP\Mail`` and the email templates got type hints.
* ``\OCP\Authentication\TwoFactorAuth`` got typehints and return type hints.
* ``\OCP\Migration\IMigrationStep`` has two new methods.
* ``EMailTemplate`` child classes should use the `%$1s` notation for replacements to be future compatible and be able to reuse parameters.

Deprecated APIs
^^^^^^^^^^^^^^^

* ``OCP\Files``
* Setting custom client URLs in a custom ``\OC_Theme`` class. Settings in config.php should be used.
* Log levels in ``OCP\Util``. Moved to the ``\OCP\ILogger`` interface
* ``OCP\AppFramework\Db\Mapper``. Move to ``\OCP\AppFramework\Db\QBMapper``

Removed APIs
^^^^^^^^^^^^

* several deprecated functions from ``\OCP\AppFramework/IAppContainer``
* ``\OCP\BackgroundJob::registerJob``
* ``\OCP\Config``
* ``\OCP\Contacts``
* ``\OCP\DB``
* ``\OCP\Files::tmpFile``
* ``\OCP\Files::tmpFolder``
* ``\OCP\IHelper``
* ``\OCP\ISearch\search``
* ``\OCP\JSON``
* ``\OCP\Response``
* ``\OCP\Share::resolveReshare``
* ``\OCP\User::getDisplayNames``
* ``\OCP\Util\formatDate``
* ``\OCP\Util::generateRandomBytes``
* ``\OCP\Util::sendMail``
* ``\OCP\Util::encryptedFiles``
* ``\OCP\Util::getServerProtocol``
* ``\OCP\Util::getServerHost``
* ``\OCP\Util::getServerProtocol``
* ``\OCP\Util::getRequestUri``
* ``\OCP\Util::getScriptName``
* ``\OCP\Util::urlgenerator``
* Deprecated `OCP` constants
* Deprecated template functions from OCP
* Some deprecated methods  of ``\OCP\Response``
* HTTPHelper

Behavioral changes
------------------

* Removed ``--no-app-disable`` from ``occ upgrade`` command.
* ``$fromMailAddress`` won't be injected anymore by the DI container.
* Apps that are enabled for groups can now provide public pages, that are available even if a user is not logged in.
* OCS API method `AddUser` `POST:/users` now allow empty password iff email is set and valid.
* Email texts are not automatically escaped anymore in all cases.

Configuration changes
---------------------

* When using Swift Objectstore as home storage make sure that to set the ``bucket/container`` parameter.
* ``mail_smtpmode`` can no longer be set to ``php``. As this option is lost with the upgrade of phpmailer.


OCS changes
-----------

Added APIs
^^^^^^^^^^

* Details endpoint for the user list
* Details endpoint for the groups list

Changed APIs
^^^^^^^^^^^^

* OCS API `getGroup` method replaced by `getGroupUsers` #8904


Internal changes
----------------

.. note:: Only relevant if you used non-public APIs. Don't use them.

* cleanup of ``OC_*`` namespace - we removed quite some classes, methods and constants from our internal namespace.
* Removed ``OC_Group_Backend``
* Removed ``OC_Response::setStatus`` and the constants for status codes
