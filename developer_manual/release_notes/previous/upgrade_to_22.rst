=======================
Upgrade to Nextcloud 22
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/26407>`__. See the original ticket for links to the pull requests and tickets.

General
-------

Migration commands
^^^^^^^^^^^^^^^^^^

The occ commands in the ``migration:*`` namespace are now only available in :ref:`debug mode<debug-mode>`.

See `the pull request on GitHub <https://github.com/nextcloud/server/pull/27113>`__ for more information. If you thought you needed them, feel free to ping the author or a reviewer of the PR to solve the problem correctly. Running migrations directly mostly breaks the database status and is therefore only meant for debugging faulty migrations.

Log format
^^^^^^^^^^

The JSON log format no longer contains full exception in the message field, but a separate exception entry is added and the existing message will only contain the exception message text. This might need adjustments by administrators when logs are extracted to external sources.

Front-end changes
-----------------

Scss variable and compilation deprecation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud is slowly phasing out scss variables and the compilation of app style sheets. It's recommended that apps use their own compilation (e.g. through Webpack) to transform scss and similar to plain css. The ability of Nextcloud compiling scss for apps will be removed in the future. Subscribe to `GitHub ticket 9940 <https://github.com/nextcloud/server/issues/9940>`__ to get updates on how to best approach this. Right now some scss variables can be replaced with css variables. Other mechanisms like the icon generation still depend on the scss compilation by Nextcloud.

Node.js upgrade
^^^^^^^^^^^^^^^

Most Nextcloud apps and Nextcloud itself is now built with Node v14 LTS instead of v12. We recommend updating the configuration of your app accordingly.

IE11 removal
^^^^^^^^^^^^

Internet Explorer 11 was phased out over the past few releases and starting with Nextcloud 22 the front-end code isn't transpiled for IE11 any longer. You may also drop IE11 from your app as core components will possibly fail with this browser anyway.

Deprecated global variables
^^^^^^^^^^^^^^^^^^^^^^^^^^^

* ``DOMPurify``: ship your own.

Back-end changes
----------------

Removed support for database.xml
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The support for an app's ``appinfo/database.xml`` has been removed.

PSR events
^^^^^^^^^^

In order to bring Nextcloud APIs closer to :ref:`psr` the base event class no longer extends the old Symfony event class but only ``\Psr\EventDispatcher\StoppableEventInterface``. From an app's perspective this change is transparent.

PSR container
^^^^^^^^^^^^^

The :ref:`PSR 11 container interface <psr11>` was updated from version 1.0 to 1.1.

LDAP factory availability
^^^^^^^^^^^^^^^^^^^^^^^^^

``\OCP\LDAP\ILDAPProviderFactory`` received a new method ``isAvailable`` so apps can check if LDAP is configured and used before any attributes are fetched or similar.

Boolean database columns
^^^^^^^^^^^^^^^^^^^^^^^^

Since Oracle can not store booleans in a non-nullable boolean column Nextcloud doesn't support non-null boolean columns anymore. Apps have to migrate their schema to nullable boolean columns.


HTTP 401 for invalid username/password
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When invalid username/password is sent to a Nextcloud API, Nextcloud will now respond with a HTTP 401 status instead of 403.


Removed APIs
^^^^^^^^^^^^

* ``\OC\Memcache\Factory::create``
* ``\OCP\User``
* ``\OCP\Util::isIe``

Deprecated APIs
^^^^^^^^^^^^^^^

* ``\OCP\Log\ILogFactory::getCustomLogger``: use ``\OCP\Log\ILogFactory::getCustomPsrLogger`` to get a customized :ref:`PSR3 <psr3>` logger
* Event ``\OCP\IDBConnection::ADD_MISSING_INDEXES`` and the corresponding constant ``\OCP\IDBConnection::ADD_MISSING_INDEXES_EVENT``: internal event
* Event ``\OCP\IDBConnection::CHECK_MISSING_INDEXES`` and the corresponding constant ``\OCP\IDBConnection::CHECK_MISSING_INDEXES_EVENT``: internal event
* Event ``\OCP\IDBConnection::ADD_MISSING_PRIMARY_KEYS`` and the corresponding constant ``\OCP\IDBConnection::ADD_MISSING_PRIMARY_KEYS_EVENT``: internal event
* Event ``\OCP\IDBConnection::CHECK_MISSING_PRIMARY_KEYS`` and the corresponding constant ``\OCP\IDBConnection::CHECK_MISSING_PRIMARY_KEYS_EVENT``: internal event
* Event ``\OCP\IDBConnection::ADD_MISSING_COLUMNS_EVENT`` and the corresponding constant ``\OCP\IDBConnection::ADD_MISSING_COLUMNS``: internal event
* Event ``\OCP\IDBConnection::CHECK_MISSING_COLUMNS`` and the corresponding constant ``\OCP\IDBConnection::CHECK_MISSING_COLUMNS``: internal event
