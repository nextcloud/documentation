.. _ex_app_routes:

======
Routes
======

All ExApps must declare the routes that users and clients may access, through the AppAPI ExApp proxy (``/apps/app_api/proxy/*``) or, with HaRP, directly (``/exapps/<appid>/*``).


Register
^^^^^^^^

During ExApp installation, the ExApp routes are registered automatically.
The routes must be declared in the ``external-app`` - ``routes`` tag of the ``info.xml`` file.

Example
*******

.. code-block::

    ...
    <external-app>
        <routes>
            <route>
                <url>.*</url>
                <verb>GET,POST,PUT,DELETE</verb>
                <access_level>USER</access_level>
                <headers_to_exclude>[]</headers_to_exclude>
                <bruteforce_protection>[401, 500]</bruteforce_protection>
            </route>
        </routes>
    </external-app>
    ...

where the fields are:

- ``url``: the route to be registered on the ExApp side, a regex matched from the start of the decoded request path, which begins with ``/`` (e.g. ``^/api/.*``); only HaRP matches it case-sensitively
- ``verb``: the HTTP verbs that the route accepts, a comma separated list (e.g. ``GET,POST``)
- ``access_level``: the name of the access level required to access the route, PUBLIC - public access without auth, USER - Nextcloud user auth required, ADMIN - admin user required
- ``headers_to_exclude``: a JSON-encoded string of an array of strings, the headers that the ExApp wants to be excluded from the request to it
- ``bruteforce_protection``: a JSON-encoded string of an array of numbers, the HTTP status codes that must trigger the bruteforce protection


Matching
^^^^^^^^

The first route whose ``url`` matches the path and whose ``verb`` lists the method decides the access level; ``HEAD`` is accepted wherever ``GET`` is.
Other methods get ``405``, except ``404`` from the ExApp proxy for the ones it serves: ``GET``, ``HEAD``, ``POST``, ``PUT``, ``DELETE``.
HaRP applies the highest access level among the readings of a path (letter case, a trailing slash, ``;`` parameters, an escaped ``/``), so write a route for a directory as ``^/img(/.*)?$``.
Paths with ``.`` or ``..`` segments and the ``/heartbeat``, ``/init`` and ``/enabled`` endpoints are refused.


Unregister
^^^^^^^^^^

ExApp routes are unregistered automatically when the ExApp is uninstalled,
and new routes are re-registered when the ExApp is updated.
