===========================
The Nextcloud web interface
===========================

Open your Nextcloud server's URL in any web browser and log in with your account name (or email address) and password:

.. figure:: images/login_page.png
   :alt: Nextcloud login screen.

You can also log in using a passkey or hardware security key by clicking **Log in with a device**.

Web browser requirements
------------------------

For the best experience, use the latest version of one of these browsers:

* Google **Chrome** / Chromium
* Mozilla **Firefox**
* Apple **Safari**
* Microsoft **Edge**

.. note:: Not all versions are supported. Nextcloud targets `browsers meeting the minimum usage threshold <https://browserslist.dev/?q=PjAuMjUlLCBub3Qgb3BfbWluaSBhbGwsIG5vdCBkZWFkLCBGaXJlZm94IEVTUg==>`_.

The Dashboard
-------------

After logging in, Nextcloud opens the **Dashboard** — a customisable overview of your most important activity: upcoming calendar events, unread messages, recent files, and more.

.. figure:: images/webinterface_dashboard.png
   :alt: The Nextcloud Dashboard showing a personalised greeting and widgets.

Use the **Customise** button at the bottom of the page to add, remove, or rearrange widgets to suit your workflow.

Navigating the interface
------------------------

The navigation bar at the top of every page is your main access point:

.. figure:: images/webinterface_nav.png
   :alt: The Nextcloud navigation bar with the logo, app shortcuts, and action icons.

* The **Nextcloud logo** (top left) takes you back to the Dashboard.
* **App shortcuts** are shown next to the logo — click any icon to switch to that app (Files, Calendar, Talk, and so on).
* The **search icon** on the right opens :ref:`unified search <unified-search>`, which searches across all your apps at once.
* The **bell icon** shows your notifications.
* The **contacts icon** lets you quickly look up and contact other users on your server.
* Your **profile picture** (far right) opens the settings menu.

Each app also has its own **left sidebar** with filters and actions specific to that app.

Settings and profile
--------------------

Click your profile picture in the top-right corner to access your account options:

.. figure:: images/webinterface_profile_menu.png
   :alt: The profile menu showing options for settings, status, appearance, and logging out.

From this menu you can:

* **Search** field (6): Click on the Magnifier in the upper right corner
  to perform a :ref:`unified search <unified-search>` across your Nextcloud
  or search for entries within the current app.

Unified search
--------------

.. _unified-search:

Click the search icon in the navigation bar (or press :kbd:`Ctrl+F`) to open the unified search modal:

.. figure:: images/webinterface_search.png
   :alt: The unified search modal with Places, Date, and People filters.

See :doc:`userpreferences` section to learn more about these settings.

Unified search
--------------

.. _unified-search:

Nextcloud's unified search combines results from all your installed apps
(Files, Mail, Contacts, Calendar, etc.) into a single view. Click the search
magnifier in the header, type your search term, and results appear grouped
by app.
