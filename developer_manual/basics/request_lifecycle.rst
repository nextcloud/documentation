=================
Request Lifecycle
=================

.. TODO:
   - Static asset handling
   - OCS coverage
   - App API coverage

This section explains how Nextcloud handles an HTTP request, from the initial entry point to the execution of application logic.

Quick Overview
--------------

Nextcloud uses the **front controller pattern**, which centralizes request handling for security, routing, extensibility, and error handling.

All requests pass through a Nextcloud-specific web server configuration before reaching any front controller. The web server configuration determines which requests are handled by which front controller and also performs basic HTTP setup and security filtering. An example Nextcloud-specific web server configuration can be found in the ``.htaccess`` provided by default in the installation folder.

The four primary front controller entry points (scripts in the Nextcloud root directory) are:

- :file:`index.php`
- :file:`remote.php`
- :file:`public.php`
- :file:`ocs/v{1,2}.php`

Web requests are routed through Nextcloud's primary front controller (:file:`index.php`).

Internal endpoint requests (i.e., authenticated on a per-account basis), such as for WebDAV access, are handled by Nextcloud's remote front controller (:file:`remote.php`).

External endpoint requests (i.e., unauthenticated or authenticated via a non-account-specific token), such as for public shares, are handled by Nextcloud's public front controller (:file:`public.php`).

Open Collaboration Services (OCS) API endpoint requests are handled by Nextcloud's OCS front controllers.

There are also some specialized system services, which are implemented through their own entry points:

- :file:`status.php` (system health/status endpoint; queried by clients)
- :file:`cron.php` (when triggered via web mode; periodic background tasks)
- :file:`console.php` (CLI only; administrative/maintenance tasks)

How They Work Together
----------------------

Web Server Configuration
^^^^^^^^^^^^^^^^^^^^^^^^

Apache (e.g., via ``.htaccess``) or Nginx is configured to rewrite most URLs to ``index.php``. For example, a request to ``/apps/files/`` is internally rewritten to ``/index.php``. This ensures that almost all incoming requests (except for those explicitly routed to other entry points like ``remote.php``, ``public.php``, etc.) are processed by ``index.php``.

index.php
^^^^^^^^^

- **Primary front controller:** Handles the main Nextcloud application (login, UI, dashboard, settings, most app requests).
- **Authentication:** Assumes the user is logged in or will be prompted to log in.
- **Routing:** The request is parsed to determine which app, controller, and action should handle the request.
- **Examples:** Logging in to an individual account; accessing the Nextcloud Web UI; accessing Nextcloud apps.

public.php
^^^^^^^^^^

- **Public protocols entry point:** Handles requests for public resources or endpoints that do not require a logged-in user.
- **Authentication:** Not generally tied to an individual user, but may still be authenticated in some way (e.g., a share token and/or share password).
- **Security:** Loads only the minimal required apps and enforces strict security headers; disables most user session logic.
- **Routing:** The request is parsed to determine which service handler should handle the request (e.g., `dav`).
- **Examples:** Accessing a public share link; public WebDAV for shares; public previews.

remote.php
^^^^^^^^^^

- **Remote protocols entry point:** Handles remote and protocol-specific endpoints (e.g., WebDAV, CalDAV, CardDAV, federated sharing, sync clients).
- **Authentication:** Requires authentication (OAuth, username/password, app token, etc.).
- **Routing:** The URL determines which internal handler is loaded (e.g., `/remote.php/dav/`).
- **Examples:** WebDAV file access; calendar and contacts access.

Relationship and Routing
------------------------

- **All three are independent:** They do not call each other directly. Instead, the web server or rewrite rules determine which one is invoked based on the request path.
- **Separation of concerns:** Each script is responsible for a different class of requests, with its own security model, required services, and request handlers.
- **Shared infrastructure:** All entry points bootstrap the Nextcloud environment via :file:`lib/base.php`, set up logging, error handling, and then dispatch to specific app handlers as appropriate.

Example Routing Table
---------------------

+----------------------------------+---------------+---------------------------------------+
| Example URL                      | Entry Point   | Purpose                               |
+==================================+===============+=======================================+
| /index.php/apps/files            | index.php     | Main UI, file browser                 |
+----------------------------------+---------------+---------------------------------------+
| /public.php/webdav/XYZ           | public.php    | Public WebDAV access to shared file   |
+----------------------------------+---------------+---------------------------------------+
| /public.php/s/ShareToken         | public.php    | Public sharing link                   |
+----------------------------------+---------------+---------------------------------------+
| /remote.php/webdav/              | remote.php    | Authenticated WebDAV (desktop sync)   |
+----------------------------------+---------------+---------------------------------------+
| /remote.php/dav/calendars/user   | remote.php    | CalDAV endpoint                       |
+----------------------------------+---------------+---------------------------------------+

Summary
^^^^^^^

- **index.php:** Handles standard user and UI/API requests; expects a user session.
- **public.php:** Handles unauthenticated/public resource requests (e.g., external shares).
- **remote.php:** Handles authenticated protocol endpoint requests (WebDAV, CalDAV, etc.).

These are all entry points, but each serves a distinct part of the Nextcloud architecture, allowing for a clear separation of public, remote/protocol, and main application logic.

A Typical Request
-----------------

A typical HTTP request consists of:

* **A URL**: e.g., /index.php/apps/myapp/something
* **Request Parameters**: e.g., ?something=true&name=tom
* **Method**: e.g., GET
* **Request Headers**: e.g., Accept: application/json

The following steps outline how a request is processed in Nextcloud:

1. **Main Front Controller**

   The request is routed through Nextcloud's primary front controller (:file:`index.php`), which bootstraps Nextcloud by loading and executing :file:`lib/base.php`. This file:

   - Inspects HTTP headers
   - Abstracts differences between environments (CLI, web, etc.)
   - Initializes core components, such as:
     - Authentication backends (see :doc:`../authentication/backends`)
     - Filesystem (see :doc:`../filesystem/overview`)
     - Logging (see :doc:`../logging/overview`)

2. **App Detection and Loading**
   The type of app is determined by examining the app's configuration file (:file:`appinfo/info.xml`). Each installed app is loaded and executed (see :doc:`Bootstrapping <../app_development/bootstrapping>`).

3. **Request Processing**
   - Authenticate the user
   - Load and execute each app's :doc:`init file <../app_development/init>`
   - Load and register routes from each app's :file:`appinfo/routes.php`
   - Execute the router to handle the request

.. note::
   If you are interested in customizing request handling or understanding the internals for debugging or development, continue reading. Otherwise, you can skip to the next section.

**See also:**

- :doc:`../app_development/overview`
- :doc:`../routing`
- :doc:`../authentication/backends`
