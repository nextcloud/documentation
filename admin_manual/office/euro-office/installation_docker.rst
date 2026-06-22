=====================
Installing via Docker
=====================

The quickest way to run Euro-Office Document Server is via the official Docker image.

Prerequisites
-------------

- Docker Engine 20.10 or later
- 4 GB RAM minimum
- 5 GB disk space for the image

Quick start
-----------

.. code-block:: bash

    docker run -d \
      --name euro-office \
      --restart=unless-stopped \
      -p 80:80 \
      -e JWT_ENABLED=true \
      -e JWT_SECRET=your-secret \
      ghcr.io/euro-office/documentserver:latest

.. warning::
    Replace ``your-secret`` with a strong random string. The JWT secret is shared between the
    Document Server and the Nextcloud connector app — both must use the same value.

The server is ready when the health check returns ``true``:

.. code-block:: bash

    curl http://localhost/healthcheck

Image tags
----------

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - Tag
      - Use
    * - ``latest``
      - Most recent release — use in production
    * - ``nightly``
      - Nightly builds from ``main`` — not for production
    * - ``latest-dev``
      - Development image with build tools included

Pin to a specific version in production::

    ghcr.io/euro-office/documentserver:9.3.1

Persistent data
---------------

By default, documents and configuration are lost when the container is removed.
Mount volumes to persist them:

.. code-block:: bash

    docker run -d \
      --name euro-office \
      --restart=unless-stopped \
      -p 80:80 \
      -e JWT_ENABLED=true \
      -e JWT_SECRET=your-secret \
      -v /path/to/data:/var/lib/euro-office/documentserver \
      -v /path/to/logs:/var/log/euro-office/documentserver \
      -v /path/to/config:/etc/euro-office/documentserver \
      ghcr.io/euro-office/documentserver:latest

Environment variables
---------------------

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``JWT_ENABLED``
      - ``true``
      - Enable JWT authentication
    * - ``JWT_SECRET``
      - —
      - Shared secret — set this in production
    * - ``JWT_HEADER``
      - ``Authorization``
      - HTTP header carrying the JWT
    * - ``WOPI_ENABLED``
      - ``false``
      - Enable WOPI protocol support
    * - ``ALLOW_PRIVATE_IP_ADDRESS``
      - ``false``
      - Allow the Document Server to fetch files from private IP ranges
    * - ``NGINX_WORKER_PROCESSES``
      - ``1``
      - Number of nginx worker processes
    * - ``GENERATE_FONTS``
      - ``true``
      - Regenerate font cache on startup
    * - ``DB_HOST``
      - ``localhost``
      - PostgreSQL host (for external database)
    * - ``DB_NAME``
      - ``eurooffice``
      - PostgreSQL database name
    * - ``DB_USER``
      - ``eurooffice``
      - PostgreSQL user
    * - ``REDIS_SERVER_HOST``
      - ``localhost``
      - Redis host (for external Redis)
    * - ``AMQP_HOST``
      - ``localhost``
      - RabbitMQ host (for external RabbitMQ)

Updating
--------

.. code-block:: bash

    docker pull ghcr.io/euro-office/documentserver:latest
    docker stop euro-office && docker rm euro-office
    # re-run with the same docker run command used during installation

Uninstalling
------------

.. code-block:: bash

    docker stop euro-office
    docker rm euro-office
    docker rmi ghcr.io/euro-office/documentserver:latest
