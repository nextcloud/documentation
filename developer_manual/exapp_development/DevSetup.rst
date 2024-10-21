.. _dev-setup:

Setting up dev environment
==========================

We highly recommend using `Julius Haertl docker setup <https://github.com/juliushaertl/nextcloud-docker-dev>`_ for the Nextcloud dev setup.

Suggested IDE: **PhpStorm**, though you can certainly use any IDE of your preference such as **VS Code** or **Vim**.

Get last version from GitHub
""""""""""""""""""""""""""""

Assuming you're in the ``apps`` folder of Nextcloud with command :command:`git`::

	git clone https://github.com/cloud-py-api/app_api.git

Change to the ``app_api`` directory with :command:`shell`::

	cd app_api

Then, build frontend assets in development mode with :command:`shell`::

	npm ci && npm run dev

After this, you can enable it from the directory where the ``occ`` command resides, with :command:`shell`::

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
