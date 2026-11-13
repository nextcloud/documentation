===================
App password scopes
===================

.. versionadded:: 36

Since Nextcloud 36, users can limit an app password to some parts of their account,
for example only Files or only Calendar. Each part is a *scope*, a string like
``files:files:read``. Users pick them in *Settings > Security > Devices & sessions*
by choosing *Custom* access.

A limited app password can't use your app's API or DAV collections until the user grants
your whole app, or you add scopes to your controller methods. App passwords with full
access and browser sessions work as before.

Closed by default
-----------------

A limited app password can't reach:

* Controller methods without a scope attribute. They are refused with ``403`` (over OCS
  v1, in the OCS status of the response).
* Pages. A ``TemplateResponse`` is refused, even if the method has a scope.
* Admin-only methods, even when the user is an admin. A method counts as admin-only
  when it has none of ``#[NoAdminRequired]``, ``#[SubAdminRequired]`` and ``#[PublicPage]``.
* Your app's DAV collections, see `Opening DAV collections`_.

Granting a whole app
--------------------

Your app works with a limited app password without any changes, as long as the user
limits it to your whole app. The app password then stores your app ID, like ``deck``,
and can use your controller methods and DAV collections, with or without
``#[TokenScope]``. Pages and admin-only methods stay closed.

Users can grant any app that is enabled for them, except apps that are reached through
scopes, like Files, Calendar, Contacts, Tasks and Notifications.

Opening controller methods
--------------------------

To open single methods instead, add ``#[TokenScope]`` to a controller class or method.
A limited app password can then call the method if it holds that scope:

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Controller;

    use NCU\AppFramework\Http\Attribute\TokenScope;
    use OCP\AppFramework\Http\Attribute\NoAdminRequired;
    use OCP\AppFramework\Http\DataResponse;
    use OCP\AppFramework\OCSController;

    #[TokenScope(scope: 'myapp:notes:write')]
    class NotesController extends OCSController {
        #[NoAdminRequired]
        #[TokenScope(scope: 'myapp:notes:read')]
        public function list(): DataResponse {
            // Needs myapp:notes:read
        }

        #[NoAdminRequired]
        public function create(string $text): DataResponse {
            // Needs myapp:notes:write from the class
        }
    }

The attribute on a method replaces the one on its class. It doesn't add to it.

It's safest to put the write scope on the class and the read scope on the read
methods. A method added later then needs the write scope until you decide otherwise.

Users can't pick your own scopes in Settings yet, only your whole app. They become useful
once clients can ask for scopes themselves.

.. note::

    ``TokenScope`` is in the ``NCU`` namespace, so it can still change until it moves to
    ``OCP``. See :doc:`api`.

Naming scopes
-------------

Name scopes ``<appid>:<resource>:<action>``, for example ``deck:boards:read``. The
action is usually ``read`` or ``write``.

Apps that don't ship with Nextcloud can only use scopes that start with their own app
ID. A method that asks for another app's scope is refused for every limited app
password, even one that holds that scope.

Opening DAV collections
-----------------------

DAV collections that an app registers in its ``info.xml`` belong to that app:

.. code-block:: xml

    <sabre>
        <collections>
            <collection>OCA\MyApp\Sabre\RootCollection</collection>
        </collections>
    </sabre>

For the example app, a limited app password needs ``myapp:dav:read`` to read them
(``GET``, ``HEAD``, ``OPTIONS``, ``PROPFIND``, ``REPORT``, ``SEARCH``) and
``myapp:dav:write`` for everything else, or the whole app. Users can only grant the
whole app in Settings so far.

Built-in scopes
---------------

These are the scopes users can pick in Settings. Apps that don't ship with Nextcloud
can't ask for them, but it helps to know what an app password may hold.

========================================== ==============================================
Scope                                      Gives access to
========================================== ==============================================
``files:files:read``                       Reading through the Files and Sharing APIs, previews
``files:files:write``                      Changing files. Without it, all files are read-only
``files:dav:read``, ``files:dav:write``    Files over WebDAV
``files_sharing:shares:write``             Creating and changing shares
``files_trashbin:dav:read``, ``…:write``   Deleted files over WebDAV
``files_versions:dav:read``, ``…:write``   File versions over WebDAV
``dav:calendar:read``, ``…:write``         Calendars over CalDAV and the calendar APIs
``dav:contacts:read``, ``…:write``         Address books over CardDAV, contacts import
``core:search:read``                       Unified search
``core:people:read``                       Autocomplete, contacts menu, hovercards and profile fields
``notifications:notifications:read``       Notifications and push
========================================== ==============================================

Trying it out
-------------

Create an app password with *Custom* access in Settings, tick your app, and call your API
with it. Untick it again to check that your app refuses the app password.
