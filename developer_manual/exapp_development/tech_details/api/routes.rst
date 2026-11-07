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
If routes match the path but none lists the method, the request gets ``405``; the ExApp proxy answers ``404`` instead for ``GET``, ``HEAD``, ``POST``, ``PUT`` and ``DELETE``.
HaRP and the ExApp proxy also check the path as ExApp web servers may read it (in another letter case, without a trailing slash, without ``;`` parameters, with ``%2F`` kept in its segment), and the route of such a reading can only raise the access level.
Paths with ``.`` or ``..`` segments and the ``/heartbeat``, ``/init`` and ``/enabled`` endpoints are refused.

For example, with these routes in this order:

================  ============  ================
``url``           ``verb``      ``access_level``
================  ============  ================
``^/img(/.*)?$``  ``GET``       ``PUBLIC``
``^/api/.*``      ``GET,POST``  ``USER``
``.*``            ``GET``       ``ADMIN``
================  ============  ================

- ``GET /img/logo.png`` and ``HEAD /img/logo.png`` are public.
- ``GET /api/items`` needs a user: the ``USER`` route comes before ``.*``.
- ``DELETE /api/items`` gets ``405`` from HaRP and ``404`` from the ExApp proxy; ``PATCH /api/items`` gets ``405`` from both.
- ``GET /IMG/logo.png`` needs an admin: in this letter case only ``.*`` matches it.
- With ``^/img/.*`` as the first route, ``GET /img/`` would need an admin: without the trailing slash only ``.*`` matches it, so write a route for a directory as ``^/img(/.*)?$``.


Unregister
^^^^^^^^^^

ExApp routes are unregistered automatically when the ExApp is uninstalled,
and new routes are re-registered when the ExApp is updated.
