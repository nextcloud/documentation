.. _remoteaccessarchitecture:

================
DAV architecture
================

High level overview
-------------------

Nextcloud exposes different HTTP entry points depending on the type of client
and the kind of access that is needed. The browser-based web interface mostly
enters through ``index.php``, API-style requests use dedicated endpoints such as
OCS, and remote file/groupware clients enter through DAV-related front
controllers.

This page focuses on the DAV-related entry points. At a high level, these are:

- ``remote.php`` for authenticated DAV access
- ``public.php`` for public or share-based DAV access

Both entry points route requests into the DAV app, which uses SabreDAV as the
protocol engine and relies on Nextcloud core services such as authentication,
filesystem access, configuration, and logging.

Other important HTTP entry points
---------------------------------

The DAV entry points are part of a wider set of public-facing front
controllers:

============================= ==============================================
Entry point                   Purpose
============================= ==============================================
``index.php``                 Main browser/web application entry point
``remote.php``                Authenticated DAV and remote-service access
``public.php``                Public/share-based DAV access
``ocs/v1.php`` / ``ocs/v2.php``  OCS API endpoints for clients and apps
``cron.php``                  Background job execution
``status.php``                Lightweight status and availability checks
============================= ==============================================

This page does not document all of these in detail. It mainly explains how
DAV requests enter the server and how they relate to the filesystem and sharing
layers.

DAV entry points
----------------

Nextcloud uses two main DAV-related front controllers:

================ ======================= =====================================
Entry point      Access model            Typical use
================ ======================= =====================================
``remote.php``   Authenticated access    Desktop sync, WebDAV clients, CalDAV,
                                         CardDAV, and other remote clients
``public.php``   Share/public access     Public links, shared file access, and
                                         DAV-based public downloads/uploads
================ ======================= =====================================

These entry points are similar in structure. Both inspect the incoming URL,
resolve the requested service, load the DAV app, and hand execution over to a
DAV-specific handler.

For example, ``remote.php`` resolves service names such as ``dav``,
``webdav``, ``caldav``, and ``carddav`` to handler scripts inside the DAV app.
``public.php`` performs a similar resolution for public DAV services.

High level request flow
-----------------------

A typical authenticated DAV request looks like this:

.. code-block:: text

   DAV client
      |
      v HTTP/HTTPS
   remote.php
      |
      v
   service resolution
   (dav/webdav/caldav/carddav)
      |
      v
   DAV app handler
      |
      v
   SabreDAV server
      |
      v
   Nextcloud services
   (authentication, filesystem, storage, sharing, logging)

A public/share DAV request follows the same broad shape, but enters through
``public.php`` and uses public/share-oriented authentication and permission
handling.

Role of ``remote.php``
----------------------

``remote.php`` is the main authenticated entry point for DAV-style remote
access. It parses the first path segment after ``/remote.php/`` to determine
which service is being requested, such as ``dav`` or ``webdav``.

That service name is then mapped to a concrete handler file. In the DAV case,
the request is routed into the DAV app, which contains the server-side protocol
implementation.

Conceptually, ``remote.php`` acts as a front controller. It does not implement
WebDAV, CalDAV, or CardDAV by itself. Instead, it bootstraps Nextcloud,
performs request validation and app loading, and then transfers control to the
appropriate DAV handler.

Role of ``public.php``
----------------------

``public.php`` plays a similar role for public/share-based DAV access. It is
used when the request is based on a public link or equivalent share-oriented
access path rather than a normal authenticated user session.

Like ``remote.php``, it resolves the requested service and hands the request to
the DAV app. The main difference is the access model: public DAV requests use
share-aware authentication, permission checks, and request handling suitable
for anonymous or token-based access.

SabreDAV and the DAV app
------------------------

The DAV app provides Nextcloud's main DAV implementation. It serves as the
bridge between external DAV clients and internal Nextcloud services.

At the protocol layer, Nextcloud relies on SabreDAV. This means Nextcloud does
not implement the DAV protocol stack entirely from scratch. Instead, it uses
SabreDAV to handle protocol-level behavior and extends it with Nextcloud-
specific logic for users, shares, permissions, metadata, comments, calendars,
contacts, and files.

In simple terms:

- the front controllers decide how the request enters the server
- the DAV app defines how Nextcloud handles the request
- SabreDAV provides the lower-level DAV protocol machinery

Relationship to the filesystem and sharing layers
-------------------------------------------------

The DAV layer is an external access layer, not a storage implementation.

For file access, DAV requests ultimately rely on Nextcloud's filesystem and
storage architecture. The DAV layer exposes files and directories to remote
clients, but it does not replace the underlying storage, mount, cache, or
scanner infrastructure.

For public access, the DAV layer also relies on the sharing layer to determine
which resource is being exposed and which permissions are allowed.

This means the filesystem architecture and the DAV architecture complement each
other:

- the filesystem architecture explains how file data is represented and managed
  internally
- the DAV architecture explains how that data is exposed to remote clients

Error handling and response model
---------------------------------

DAV clients expect protocol-appropriate responses rather than generic browser
HTML pages. For this reason, DAV entry points perform special handling for
DAV-style requests and errors.

At a high level, this means Nextcloud tries to return responses in the form
expected by DAV clients, including proper HTTP status codes and DAV-compatible
error responses. This is one of the reasons DAV traffic enters through
dedicated front controllers instead of the normal browser-oriented request
path.

Summary
-------

If you are new to this area of the codebase, the simplest mental model is:

- ``index.php`` is mainly for the web UI
- ``remote.php`` is the main authenticated DAV gateway
- ``public.php`` is the public/share DAV gateway
- the DAV app contains the application logic for DAV requests
- SabreDAV provides the underlying DAV protocol server
- filesystem and sharing services provide the data and permissions used by the
  DAV layer
