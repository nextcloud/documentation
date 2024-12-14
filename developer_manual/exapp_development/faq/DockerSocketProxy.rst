Docker Socket Proxy
===================

The recommended way to setup the AppAPI Deploy daemon
is to use our `Docker Socket Proxy implementation <https://github.com/nextcloud/docker-socket-proxy>`_.

Nextcloud AppAPI DSP
--------------------

Nextcloud AppAPI DSP (Docker Socket Proxy) is a simple Docker container that provides a secure way to access the Docker Engine API and ExApps.
It is secured with haproxy Basic authentication.
There are two parts of reverse proxy configuration:

- HaProxy config for `Docker Engine API <https://github.com/nextcloud/docker-socket-proxy/blob/main/haproxy.cfg.template>`_
- HaProxy config for `ExApps <https://github.com/nextcloud/docker-socket-proxy/blob/main/haproxy_ex_apps.cfg.template>`_

.. note::

	For remote Docker Socket Proxy setup, it should expose the ports on the host.


.. _faq_nextcloud-aio-docker-socket-proxy:

Nextcloud AIO
-------------

Nextcloud AIO implements its own `Docker Socket Proxy container <https://github.com/nextcloud/all-in-one/tree/main/Containers/docker-socket-proxy>`_;
you just need to tick the checkbox in the AIO configuration interface to enable it.
AppAPI automatically creates the default Deploy daemon configuration for Nextcloud AIO.

See `Nextcloud in Docker AIO (all-in-one) <https://docs.nextcloud.com/server/latest/admin_manual/exapps_management/DeployConfigurations.html#nextcloud-in-docker-aio-all-in-one>`_ for more details.

.. note::

	Nextcloud AIO is not limited to its default Deploy daemon.
	You can setup any other Deploy daemon (local or remote) for use in AppAPI.


Other implementations
---------------------

Our implementation is inspired by `Tecnativa Docker Socket Proxy <https://github.com/Tecnativa/docker-socket-proxy>`_.
By default, it restricts access to the required by AppAPI Docker Engine APIs.
In this case, you will have to enable these APIs via the environment variables:

- ``IMAGES=1``
- ``CONTAINER=1``
- ``POST=1``

.. note::

	For local Deploy daemon setup, other implementations of Docker Socket Proxy may be enough.
	But for remote Deploy daemon setup, we recommend using our DSP,
	as `we allow <https://github.com/nextcloud/docker-socket-proxy/blob/main/haproxy.cfg.template>`_ only the Docker Engine APIs we actually use in AppAPI,
	and it is additionally secured with haproxy authentication.

