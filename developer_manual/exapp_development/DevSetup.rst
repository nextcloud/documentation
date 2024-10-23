.. _dev-setup:

Setting up dev environment
==========================

We highly recommend using `Julius Knorr's Docker setup <https://github.com/juliusknorr/nextcloud-docker-dev>`_ for Nextcloud development.

Suggested IDE: **PhpStorm**, though you can certainly use any IDE of your preference such as **VS Code** or **Vim**.

Installation from the source code
""""""""""""""""""""""""""""""""""

Clone the latest main branch:

	.. code-block:: bash

		git clone https://github.com/cloud-py-api/app_api.git && cd app_api

or clone a specific version by specifying the version tag:

	.. code-block:: bash

		git clone https://github.com/cloud-py-api/app_api.git --branch <version-tag> && cd app_api

where ``<version-tag>`` is the version you want to install.

Then, build frontend assets in development mode:

	.. code-block:: bash

		npm ci && npm run build

Enable AppAPI from the directory where the ``occ`` command resides:

	.. code-block:: bash

		./occ app:enable --force app_api

In Place of a Conclusion
""""""""""""""""""""""""

There are several make commands available to ease frequent development actions.

To see the complete list, execute ``make help``.

Docker remote API
*****************

The Docker Engine remote API can be easily configured via ``make dock2port`` command.
The command will create a docker container to provide remote Docker Engine API.

Afterward, register DaemonConfigs in Nextcloud using ``make dock-port`` command.

Docker by socket
****************

For Docker via socket, use the command ``make dock-sock``.
This registers DaemonConfigs in Nextcloud for the default socket connection (``/var/run/docker.sock``).

Make sure that socket has enough permissions for Nextcloud and webserver user to access it
and actually forwarded to the container:

.. code-block::

	...
	volumes:
		...
		- /var/run/docker.sock:/var/run/docker.sock
		...
