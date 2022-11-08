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
See `Github issue <https://github.com/nextcloud/server/issues/32060>`_.

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
See `Github issue <https://github.com/nextcloud/server/pull/34081>`_.

Back-end changes
----------------

christophwurst/nextcloud replaced
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The `christophwurst/nextcloud <https://packagist.org/packages/christophwurst/nextcloud>`_ composer package was replaced
with a now Nextcloud owned `nextcloud/ocp <https://packagist.org/packages/nextcloud/ocp>`_ package. The content is the
same and all older versions were generated, so you can transition right away no matter which versions you support.
We also have a GitHub Actions cron job template available at
`https://github.com/nextcloud/.github/blob/master/workflow-templates/update-nextcloud-ocp.yml <https://github.com/nextcloud/.github/blob/master/workflow-templates/update-nextcloud-ocp.yml>`_
which updates the packages every sunday, so you can make sure your app is still compatible with the latest OCP.

Changed APIs
^^^^^^^^^^^^

tbd

Removed APIs
^^^^^^^^^^^^

- Removed SVG colour API
