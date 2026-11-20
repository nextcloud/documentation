.. _dev-setup:

Setting up dev environment
==========================

AppAPI development requires a Nextcloud development environment setup.
We highly recommend using the `nextcloud-docker-dev <https://github.com/nextcloud/nextcloud-docker-dev>`_ setup (originally developed by Julius Knorr) for this.
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
2. ``docker_install``: This type of Deploy daemon deploys ExApps as Docker containers through HaRP.

You can register (create) these daemons in the AppAPI admin settings.
For the equivalent ``occ`` command or an explanation of the Deploy daemon parameters,
see :ref:`occ_daemon_config_registration`.

HaRP
****

For development and testing in Docker, register a ``docker-install`` deploy daemon with
`HaRP <https://github.com/nextcloud/HaRP>`_, see
`Setup deploy daemon <https://docs.nextcloud.com/server/latest/admin_manual/exapps_management/AppAPIAndExternalApps.html#setup-deploy-daemon>`_.
