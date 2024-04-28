=======================
Upgrade to Nextcloud 30
=======================

General
-------

Front-end changes
-----------------

Font sizes
^^^^^^^^^^

Nextcloud now provides meaningful default styles for heading elements.
This can cause visual regressions if your code does not explicitly set font size and weight.
If you need to use heading elements outside of text content, you might need to adjust their styles.

Added APIs
^^^^^^^^^^

Changed APIs
^^^^^^^^^^^^

Removed APIs
^^^^^^^^^^^^

Removed globals
^^^^^^^^^^^^^^^

Deprecated APIs
^^^^^^^^^^^^^^^

* ``OC.dialogs.fileexists`` was already deprecated in Nextcloud 29, but is now also marked as such.
  Use ``openConflictPicker`` from `@nextcloud/upload <https://nextcloud-libraries.github.io/nextcloud-upload/functions/openConflictPicker.html>`_ instead.
* Most ``OC.dialogs`` API is now deprecated and will be removed in the future. For generic dialogs use the ``DialogBuilder`` from the :ref:`js-library_nextcloud-dialogs`.
  A list of the now deprecated methods:

  * ``OC.dialogs.alert``
  * ``OC.dialogs.info``
  * ``OC.dialogs.confirm``
  * ``OC.dialogs.confirmDestructive``
  * ``OC.dialogs.confirmHtml``
  * ``OC.dialogs.prompt``
  * ``OC.dialogs.message``

Back-end changes
----------------

Support for PHP 8.0 removed
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this release support for PHP 8.0 was removed. Follow the steps below to make your app compatible.

1. If ``appinfo/info.xml`` has a dependency specification for PHP, increase the ``min-version`` to 8.1.

.. code-block:: xml

  <dependencies>
    <php min-version="8.1" max-version="8.3" />
    <nextcloud min-version="27" max-version="30" />
  </dependencies>


2. If your app has a ``composer.json`` and the file contains the PHP restrictions from ``info.xml``, adjust it as well.

.. code-block:: json

  {
    "require": {
      "php": ">=8.1 <=8.3"
    }
  }

3. If you have :ref:`continuous integration <app-ci>` set up, remove PHP 8.0 from the matrices of tests and linters.

Added APIs
^^^^^^^^^^

- ``OCP\Activity\Exceptions\FilterNotFoundException`` is thrown by ``OCP\Activity\IManager::getFilterById()`` when no filter with the given identifier registered
- ``OCP\Activity\Exceptions\IncompleteActivityException`` is thrown by ``OCP\Activity\IManager::publish()`` when not all required fields have been set on the ``OCP\Activity\IEvent`` object
- ``OCP\Activity\Exceptions\InvalidValueException`` is thrown by ``OCP\Activity\IEvent::set*()`` when the value did not match the required criteria
- ``OCP\Activity\Exceptions\SettingNotFoundException`` is thrown by ``OCP\Activity\IManager::getSettingById()`` when no setting with the given identifier registered
- ``OCP\Activity\Exceptions\UnknownActivityException`` should be thrown by ``OCP\Activity\IProvider::parse()`` when they didn't handle the event
- ``OCP\Notification\IncompleteNotificationException`` is thrown by ``OCP\Notification\IManager::notify()`` when not all required fields have been set on the ``OCP\Notification\INotification`` object
- ``OCP\Notification\IncompleteParsedNotificationException`` is thrown by ``OCP\Notification\IManager::prepare()`` when no ``OCP\Notification\INotifier`` handled the ``OCP\Notification\INotification`` object
- ``OCP\Notification\InvalidValueException`` is thrown by ``OCP\Notification\IAction::set*()`` and ``OCP\Notification\INotification::set*()`` when the value did not match the required criteria
- ``OCP\Notification\UnknownNotificationException`` should be thrown by ``OCP\Notification\INotifier::prepare()`` when they didn't handle the notification
- ``OCA\Files_Trashbin\Trash\ITrashItem::getDeletedBy`` should return the user who deleted the item or null if unknown

Changed APIs
^^^^^^^^^^^^

- ``OCP\Activity\IEvent::set*()`` (all setters) throw ``OCP\Activity\Exceptions\InvalidValueException`` instead of ``\InvalidArgumentException`` when the value does not match the required criteria.
- Calling ``OCP\Activity\IEvent::setIcon()`` with a relative URL is deprecated and will throw ``OCP\Activity\Exceptions\InvalidValueException`` in a future version.
- Calling ``OCP\Activity\IEvent::setLink()`` with a relative URL is deprecated and will throw ``OCP\Activity\Exceptions\InvalidValueException`` in a future version.
- ``OCP\Activity\IManager::publish()`` throws ``OCP\Activity\Exceptions\IncompleteActivityException`` instead of ``\InvalidArgumentException`` when a required field is not set before publishing.
- ``OCP\Activity\IProvider::parse()`` should no longer throw ``\InvalidArgumentException``. ``OCP\Activity\Exceptions\UnknownNotificationException`` should be thrown when the provider does not want to handle the event. ``\InvalidArgumentException`` are logged as debug for now and will be logged as error in the future to help developers find issues from code that unintentionally threw ``\InvalidArgumentException``
- ``OCP\Notification\IAction::set*()`` (all setters) throw ``OCP\Notification\InvalidValueException`` instead of ``\InvalidArgumentException`` when the value does not match the required criteria.
- Calling ``OCP\Notification\IAction::setLink()`` with a relative URL is deprecated and will throw ``OCP\Notification\InvalidValueException`` in a future version.
- ``OCP\Notification\IApp::notify()`` throws ``OCP\Notification\IncompleteNotificationException`` instead of ``\InvalidArgumentException`` when a required field is not set before notifying.
- ``OCP\Notification\IManager::prepare()`` throws ``OCP\Notification\IncompleteParsedNotificationException`` instead of ``\InvalidArgumentException`` when a required field is not set after preparing a notification.
- ``OCP\Notification\INotification::set*()`` (all setters) throw ``OCP\Notification\InvalidValueException`` instead of ``\InvalidArgumentException`` when the value does not match the required criteria.
- Calling ``OCP\Notification\INotification::setLink()`` with a relative URL is deprecated and will throw ``OCP\Notification\InvalidValueException`` in a future version.
- Calling ``OCP\Notification\INotification::setIcon()`` with a relative URL is deprecated and will throw ``OCP\Notification\InvalidValueException`` in a future version.
- ``OCP\Notification\INotifier::prepare()`` should no longer throw ``\InvalidArgumentException``. ``OCP\Notification\UnknownNotificationException`` should be thrown when the notifier does not want to handle the notification. ``\InvalidArgumentException`` are logged as debug for now and will be logged as error in the future to help developers find issues from code that unintentionally threw ``\InvalidArgumentException``

Removed APIs
^^^^^^^^^^^^

Removed events
^^^^^^^^^^^^^^
