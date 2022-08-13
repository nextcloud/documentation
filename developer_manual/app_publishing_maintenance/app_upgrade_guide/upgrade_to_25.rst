=======================
Upgrade to Nextcloud 25
=======================

.. note:: Critical changes were collected `on GitHub <https://github.com/nextcloud/server/issues/32117>`__. See the original ticket for links to the pull requests and tickets.

General
-------

info.xml
^^^^^^^^

Make sure your ``appinfo/info.xml`` allows for Nextcloud 25.

.. code-block:: xml

	<dependencies>
	  <nextcloud min-version="22" max-version="25" />
	</dependencies>
	
SCSS support removal
^^^^^^^^^^^^^^^^^^^^

With 25, we removed the support for scss files provided by apps.
Please handle your own compilation, move to a vue app or move back to css.
See https://github.com/nextcloud/server/issues/32060

Front-end changes
-----------------

tbd

Back-end changes
----------------

tbd

Changed APIs
^^^^^^^^^^^^

tbd

Removed APIs
^^^^^^^^^^^^

- Removed SVG colour api
