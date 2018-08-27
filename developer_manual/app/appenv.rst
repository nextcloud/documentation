================================
App development setup via Docker
================================

.. sectionauthor:: Wolfgang Popp <mail@wolfgang-popp.de>

This page describes a simplified development environment for app development via docker.
The docker image is pre-configured with build instructions for some existing apps.
If you want to create a new app you could base it on the `vueexample <https://github.com/skjnldsv/vueexample.git>`_ app, which is also supported by the container.
In case you want to work on an app that is not supported by the container by default you will have to go through an extra step (see :ref:`custom-build-commands`).

Setup Docker and Git
--------------------

First you need to set up Docker, `Docker Compose <https://docs.docker.com/compose/install/>`_ and Git.

* Ubuntu: `docker <https://docs.docker.com/install/linux/docker-ce/ubuntu/>`__, Git: ``sudo apt install git``
* macOS: `docker <https://docs.docker.com/docker-for-mac/install/>`__, Git: ``brew install git``
* Windows: `docker <https://docs.docker.com/docker-for-windows/install/>`__, `Git <https://git-scm.com/download/win>`_

Setting up the docker container
-------------------------------

The following instructions will set up the app development environment and the `vueexample <https://github.com/skjnldsv/vueexample.git>`_ app.
For other apps simply clone a different repo into the apps folder.
See the comments in the code block below.
Of course, multiple apps can be installed at once.

.. code-block:: bash

    git clone https://github.com/David-Development/nextcloud-dev-docker.git
    cd nextcloud-dev-docker/apps
    # If you want to work on an app other than the vueexample simply clone a different repo here.
    # For example:
    #git clone https://github.com/nextcloud/contacts.git
    git clone https://github.com/skjnldsv/vueexample.git
    cd ..
    sudo docker-compose up -d --build

To finish the setup process point your browser to http://localhost:8080 and create a new admin account.
Note that it might take a couple of minutes until the container is fully started and the web interface becomes available.
Next enable the vueexample or the app you want to work on in the `settings <http://localhost:8080/index.php/settings/apps>`_.

If you want to stop the container later, run ``sudo docker-compose stop`` from inside the ``nextcloud-dev-docker`` directory.

.. _custom-build-commands:

Custom build commands
---------------------
If you want to work on app that is not listed in the ``nextcloud-dev-docker/run-dev.sh`` script, you have to add the build instructions for your app to the ``run-dev.sh`` script and rebuild the container with ``sudo docker-compose up -d --build``.
You can omit this step if you want to re-build the app manually.

Working on the app
------------------

Work on the app from inside the apps directory on the docker host, not inside the container!
Some apps are configured to automatically rebuild as soon as you make changes to the source code.
If changes do not appear after refreshing the page in the browser, your app probably has no watch-js make target (i.e. no support to rebuild automatically).
In that case you have to rebuild the app manually from inside the container:

.. code-block:: bash

    cd nextcloud-dev-docker
    sudo docker-compose exec app bash
    cd apps2/vueexample
    # Refer to the app documentation for the actual make commands needed here
    make

Keeping the container up to date
--------------------------------
To update the development environment pull changes from the ``nextcloud-dev-setup`` repository and rebuild the container.

.. code-block:: bash

    cd nextcloud-dev-setup
    git pull
    docker-compose up -d --build
