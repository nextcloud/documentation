.. _dev-setup:

Setting up dev environment
==========================

AppAPI development requires a Nextcloud development environment setup.
We highly recommend using `Julius Knorr's Docker setup <https://github.com/juliusknorr/nextcloud-docker-dev>`_ for this.
For an alternate environment without using Docker, please refer to the setup instructions in :doc:`Getting started <../getting_started/devenv>`.

Suggested IDE: **PhpStorm**, though you can certainly use any IDE of your preference such as **VS Code** or **Vim**.

Install AppAPI
""""""""""""""

All ExApps require the `AppAPI <https://apps.nextcloud.com/apps/app_api>`_ Nextcloud app as a dependency.
As of Nextcloud version 30.0.1, AppAPI is automatically installed by default.
If you prefer,
you can also build the latest development version of AppAPI from the source code,
in which case uninstall the release version of AppAPI and perform the following steps.

Clone the latest main branch:

	.. code-block:: bash

		git clone https://github.com/nextcloud/app_api.git && cd app_api

or clone a specific version by specifying the version tag:

	.. code-block:: bash

		git clone https://github.com/nextcloud/app_api.git --branch <version-tag> && cd app_api

where ``<version-tag>`` is the version you want to install.

Then, build frontend assets in development mode:

	.. code-block:: bash

		npm ci && npm run dev

Enable AppAPI from the directory where the ``occ`` command resides:

	.. code-block:: bash

		./occ app:enable --force app_api

Deploy daemons types
********************

There are two types of Deploy daemons that can be used for development and testing of ExApps:

1. ``manual_install``: This type of Deploy daemon is running manually in the host machine.
   This is useful for ExApp development as you can run your ExApp directly on the host.
2. ``docker_install``: This type of Deploy daemon is running in a Docker container.

You can register (create) these daemons in the AppAPI admin settings.
For the equivalent ``occ`` command or an explanation of the Deploy daemon parameters,
see :ref:`occ_daemon_config_registration`.

Docker Socket Proxy
*******************

For development and testing locally,
the simplest way is to use the `Nextcloud AppAPI DSP HTTP <https://github.com/nextcloud/docker-socket-proxy?tab=readme-ov-file#httplocal>`_.

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
