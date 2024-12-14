.. _ex_app_routes:

======
Routes
======

All ExApps must declare the routes that are allowed to be accessed via the AppAPI ExApp proxy (``/apps/app_api/proxy/*``).


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

- ``url``: the route to be registered on the ExApp side, can be a regex
- ``verb``: the HTTP verb that the route will accept, can be a comma separated list of verbs
- ``access_level``: the name of the access level required to access the route, PUBLIC - public access without auth, USER - Nextcloud user auth required, ADMIN - admin user required
- ``headers_to_exclude``: a JSON-encoded string of an array of strings, the headers that the ExApp wants to be excluded from the request to it
- ``bruteforce_protection``: a JSON-encoded string of an array of numbers, the HTTP status codes that must trigger the bruteforce protection


Unregister
^^^^^^^^^^

ExApp routes are unregistered automatically when the ExApp is uninstalled,
and new routes are re-registered when the ExApp is updated.
