=======================
Upgrade to Nextcloud 19
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/18479>`__. See the original ticket for links to the pull requests and tickets.

Front-end changes
-----------------

Babel Polyfill removal
^^^^^^^^^^^^^^^^^^^^^^

Nextcloud 19 no longer ships a global Babel Polyfill but uses core-js instead. Make sure your front-end scripts don't reply on polyfilled browser APIs.

jQuery deprecation
^^^^^^^^^^^^^^^^^^

As of Nextcloud 19, the global `jquery` and `$` are deprecated for apps. While the library won't be removed immediately to give developers time to adapt, we encourage you to either replace it with another library or simply use a bundling tool like webpack to scope it to your own. The library will be upgraded in Nextcloud in future versions of Nextcloud and there are breaking changes in the newer versions of jQuery.

Deprecated global variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^

* ``OC.currentUser``: use ``getCurrentUser`` from https://www.npmjs.com/package/@nextcloud/auth
* ``OC.filePath``: use ``generateFilePath`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.generateUrl``: use ``generateUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.get``: use https://lodash.com/docs#get
* ``OC.getCurrentUser``: use ``getCurrentUser`` from https://www.npmjs.com/package/@nextcloud/auth
* ``OC.getRootPath``: use ``getRootUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.imagePath``: use ``imagePath`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.linkTo``: use ``linkTo`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.linkToOCS``: use ``generateOcsUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.linkToRemote``: use ``generateRemoteUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OC.set``: use https://lodash.com/docs#set
* ``OC.webroot``: use ``getRootUrl`` from https://www.npmjs.com/package/@nextcloud/router
* ``OCP.Toast.*``: use https://www.npmjs.com/package/@nextcloud/dialogs

Removed globals
^^^^^^^^^^^^^^^

* ``getURLParameter``
* ``formatDate``
* ``humanFileSize``
* ``relative_modified_date``

Removed libraries
^^^^^^^^^^^^^^^^^

* ``marked``

Back-end changes
----------------

Symfony update
^^^^^^^^^^^^^^

Symfony was updated to `v4.4 <https://github.com/symfony/symfony/blob/4.4/CHANGELOG-4.4.md>`__. The most important change for apps is to return an int value from CLI commands. Returning null (explicitly or implicitly) won't be allowed in future versions of Symfony.

Deprecation of injection of named services
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Apps had been able to query core services like the implementation of the interface ``\OCP\ITagManager`` as ``TagManager``. To unify the service resolution with type hints for the constructor injection, the named resolution is deprecated, logs warnings and will be removed in the future. Use the fully-qualifier class name (with the `::class` constant) instead:

If you had

.. code-block:: php

  $tagManager = \OC::$server->query('TagManager');

change your code to

.. code-block:: php

  $tagManager = \OC::$server->query(\OCP\ITagManager::class);

On constructor arguments you should always type-hint the service by its interface. If you do so already, nothing changes for you.

New APIs
^^^^^^^^

* ``\OCP\Authentication\Events\LoginFailedEvent`` class added
* ``\OCP\Comments\IComment::getReferenceId`` method added
* ``\OCP\Comments\IComment::setReferenceId`` method added
* ``\OCP\Contacts\Events\ContactInteractedWithEvent`` class added
* ``\OCP\EventDispatcher\IEventDispatcher::removeListener`` method added
* ``\OCP\ITags::TAG_FAVORITE`` constant added
* ``\OCP\Mail\Events\BeforeMessageSent`` class added
* ``\OCP\Lock\LockedException::getExistingLock`` method added
* ``\OCP\Share\Events\VerifyMountPointEvent`` class added
* ``\OCP\Share\IManager::allowEnumeration`` method added
* ``\OCP\Share\IManager::limitEnumerationToGroups`` method added

Changed APIs
^^^^^^^^^^^^

* ``\OCP\User\Events\BeforeUserLoggedInEvent::getUsername`` now correctly returns a string and not an ``\OCP\IUser``

