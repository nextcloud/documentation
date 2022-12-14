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
See `Github issue #32060 <https://github.com/nextcloud/server/issues/32060>`_.

Front-end changes
-----------------

Disabled keyboard shortcuts
^^^^^^^^^^^^^^^^^^^^^^^^^^^

A global option to disable keyboard shortcuts was added to the accessibility settings.
Since it heavily depends on the screenreader and tools that you use if Ctrl and/or Alt or other things are okay to use
or not and maintaining a more detailed list is too much effort, we went for a global on/off switch. Apps can use this
public javascript API call to determine whether the user used the opt-out: ``OCP.Accessibility.disableKeyboardShortcuts()``.
If that is the case, no additional shortcuts shall be registered by any app. Only ``space`` to toggle checkboxes and
``enter`` to submit the currently active buttons/links are okay to be used.
See `Github issue #34081 <https://github.com/nextcloud/server/pull/34081>`_ and :ref:`JavaScript Frontend documentation <basics_frontend_javascript_keyboard_shortcuts>`.

Back-end changes
----------------

``christophwurst/nextcloud`` replaced
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The `christophwurst/nextcloud <https://packagist.org/packages/christophwurst/nextcloud>`_ composer package was replaced
with a now Nextcloud owned `nextcloud/ocp <https://packagist.org/packages/nextcloud/ocp>`_ package. The content is the
same and all older versions were generated, so you can transition right away no matter which versions you support.

Changed APIs
^^^^^^^^^^^^

tbd

Removed APIs
^^^^^^^^^^^^

- Removed SVG colour API
