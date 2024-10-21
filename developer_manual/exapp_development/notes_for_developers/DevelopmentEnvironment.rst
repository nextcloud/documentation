.. _DevelopmentEnvironment:

Development environment
=======================

The development environment for AppAPI first of all requires a default Nextcloud dev setup.
You can find more information on that in the `Nextcloud development environment docs <https://docs.nextcloud.com/server/latest/developer_manual/getting_started/devenv.html>`_.
The AppAPI dev setup steps listed :ref:`here <dev-setup>`.


Deploy daemons types
--------------------

There are two types of Deploy daemons that can be used for development and testing of ExApp:

1. ``manual_install``: This type of Deploy daemon is running manually in the host machine.
   You can create it in AppAPI admin settings using template.
   This is useful for development of ExApp, when you run your ExApp manually in the host.
2. ``docker_install``: This type of Deploy daemon is running in a Docker container.

Docker Socket Proxy
-------------------

For development and testing locally, the simplest is to use the `Nextcloud AppAPI DSP HTTP <https://github.com/cloud-py-api/docker-socket-proxy?tab=readme-ov-file#httplocal>`_.

