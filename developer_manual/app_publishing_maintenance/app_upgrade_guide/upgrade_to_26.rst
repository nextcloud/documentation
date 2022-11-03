=======================
Upgrade to Nextcloud 26
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/34692>`__. See the original ticket for links to the pull requests and tickets.

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

tbd

Back-end changes
----------------

Dependency Injection Parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

App container parameters with pascal case names ``AppName``, ``UserId`` and ``WebRoot`` are deprecated. Use the camel case variants ``appName``, ``userId`` and ``webRoot`` instead if you have them injected into one of your app classes.

Changed APIs
^^^^^^^^^^^^

tbd

Removed APIs
^^^^^^^^^^^^

tbd