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

By default, documents, configuration, and the secrets generated on first start are lost when the container is
removed. Mount volumes to persist them:

.. code-block:: bash

    docker run -d \
      --name euro-office \
      --restart=unless-stopped \
      -p 80:80 \
      -e JWT_ENABLED=true \
      -e JWT_SECRET=your-secret \
      -v /path/to/data:/var/lib/euro-office/documentserver \
      -v /path/to/private:/var/www/euro-office/Data \
      -v /path/to/logs:/var/log/euro-office/documentserver \
      -v /path/to/config:/etc/euro-office/documentserver \
      ghcr.io/euro-office/documentserver:latest

``/var/www/euro-office/Data`` holds state the container creates at run time and is easy to overlook, because it is
a separate tree from ``/var/lib/euro-office/documentserver``:

- ``runtime.json`` — the administration panel password and any settings changed at run time
- ``.private/jwt_secret`` — only created when ``JWT_SECRET`` is not supplied
- ``.private/secure_link_secret`` — only created when ``SECURE_LINK_SECRET`` is not supplied
- ``wopi_private.key`` and ``wopi_public.key`` — only created when ``WOPI_ENABLED=true``

Without this volume all of it is discarded when the container is recreated, and the generated values differ on the
next start. Secrets you pass in as environment variables are not affected, but a regenerated JWT secret no longer
matches the one configured in the Nextcloud connector app, and the connection stays broken until the new value is
copied over.

Environment variables
---------------------

The variables below are read by the container entrypoint and written into ``local.json`` and the nginx
configuration at start-up. The four variables that limit file sizes are documented separately in
`Size limits`_.

Authentication
^^^^^^^^^^^^^^

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
      - generated
      - Shared secret. When unset, a random 32-character secret is generated and stored in
        ``/var/www/euro-office/Data/.private/jwt_secret``. Set it explicitly in production
    * - ``JWT_HEADER``
      - ``Authorization``
      - HTTP header carrying the JWT
    * - ``JWT_HEADER_INBOX`` / ``JWT_HEADER_OUTBOX``
      - ``JWT_HEADER``
      - Separate headers per direction
    * - ``JWT_IN_BODY``
      - ``false``
      - Accept the token in the request body
    * - ``JWT_SECRET_INBOX`` / ``JWT_SECRET_OUTBOX``
      - ``JWT_SECRET``
      - Separate secrets per direction
    * - ``JWT_ENABLED_INBOX`` / ``JWT_ENABLED_OUTBOX``
      - ``JWT_ENABLED``
      - Enable JWT per direction

Database
^^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``DB_TYPE``
      - ``postgres``
      - Database engine (standalone image supports ``postgres`` only)
    * - ``DB_HOST``
      - ``localhost``
      - Database host
    * - ``DB_PORT``
      - ``5432``
      - Database port
    * - ``DB_NAME``
      - ``eurooffice``
      - Database name
    * - ``DB_USER``
      - ``eurooffice``
      - Database user
    * - ``DB_PWD``
      - —
      - Database password

.. note::
    ``DB_PASSWORD`` is a deprecated alias for ``DB_PWD``. It still works, but the container logs a warning at
    start-up. ``DB_PWD`` wins if both are set.

Redis
^^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``REDIS_SERVER_HOST``
      - ``localhost``
      - Redis host (for external Redis)
    * - ``REDIS_SERVER_PORT``
      - ``6379``
      - Redis port
    * - ``REDIS_SERVER_USER``
      - —
      - Redis username for ACL-based authentication. Only written to the configuration when set
    * - ``REDIS_SERVER_PASS``
      - —
      - Redis password. Only written to the configuration when set
    * - ``REDIS_SERVER_DB``
      - —
      - Redis database number. Only written to the configuration when set

RabbitMQ
^^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``AMQP_HOST``
      - ``localhost``
      - RabbitMQ host (for external RabbitMQ)
    * - ``AMQP_PORT``
      - ``5672``
      - RabbitMQ port
    * - ``AMQP_USER`` / ``AMQP_PWD``
      - ``guest``
      - RabbitMQ credentials
    * - ``AMQP_VHOST``
      - ``/``
      - Virtual host name. A leading slash is added automatically if you omit it
    * - ``AMQP_URI``
      - —
      - Complete AMQP connection URI. Takes precedence over all other ``AMQP_*`` variables

.. note::
    The container only points the Document Server at an external broker when ``AMQP_URI`` is set or ``AMQP_HOST``
    differs from ``localhost``. Otherwise the RabbitMQ instance bundled in the image is used.

WOPI
^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``WOPI_ENABLED``
      - ``false``
      - Enable WOPI protocol support. An RSA key pair is generated in ``/var/www/euro-office/Data`` on first start

Outbound requests
^^^^^^^^^^^^^^^^^

These variables control how the Document Server fetches documents from storage such as Nextcloud.

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``ALLOW_PRIVATE_IP_ADDRESS``
      - ``false``
      - Allow the Document Server to fetch files from private IP ranges
    * - ``ALLOW_META_IP_ADDRESS``
      - ``false``
      - Allow fetching documents from meta-private IPs (169.254.0.0/16)
    * - ``USE_UNAUTHORIZED_STORAGE``
      - ``false``
      - Disable TLS certificate validation for outbound requests to storage

.. warning::
    ``USE_UNAUTHORIZED_STORAGE=true`` sets ``rejectUnauthorized: false`` on every outbound HTTPS connection the
    Document Server makes. The certificate chain, the host name, and the expiry date of the storage server are no
    longer checked, so any machine on the network path can impersonate your Nextcloud instance and read or modify
    the documents in transit. It has no effect on plain HTTP connections, which never present a certificate.

    Only use it for self-signed certificates in a trusted network, and prefer adding the certificate authority to
    the container's trust store instead.

HTTPS and TLS termination
^^^^^^^^^^^^^^^^^^^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``SSL_CERTIFICATE_PATH``
      - —
      - Path inside the container to the TLS certificate
    * - ``SSL_KEY_PATH``
      - —
      - Path inside the container to the matching private key
    * - ``SSL_DHPARAM_PATH``
      - —
      - Path to a Diffie-Hellman parameter file. When unset or unreadable, the ``ssl_dhparam`` directive is removed
    * - ``SSL_VERIFY_CLIENT``
      - ``off``
      - Value for the nginx ``ssl_verify_client`` directive (client certificate verification)
    * - ``ONLYOFFICE_HTTPS_HSTS_ENABLED``
      - ``true``
      - Send an HSTS header. When ``false``, the ``max-age`` directive is removed
    * - ``ONLYOFFICE_HTTPS_HSTS_MAXAGE``
      - ``31536000``
      - HSTS max-age in seconds (default 1 year)

.. important::
    ``SSL_DHPARAM_PATH``, ``SSL_VERIFY_CLIENT``, and both ``ONLYOFFICE_HTTPS_HSTS_*`` variables are only applied
    when ``SSL_CERTIFICATE_PATH`` and ``SSL_KEY_PATH`` are both set **and** both files exist inside the container.
    Without them the container serves plain HTTP and these four variables have no effect at all.

Nginx
^^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``NGINX_WORKER_PROCESSES``
      - ``1``
      - Number of nginx worker processes
    * - ``NGINX_WORKER_CONNECTIONS``
      - ``768``
      - Value for the nginx ``worker_connections`` directive. When unset, the value from the base image's
        ``nginx.conf`` is left unchanged
    * - ``NGINX_ACCESS_LOG``
      - ``false``
      - Write an access log to ``/var/log/euro-office/documentserver/nginx.access.log``
    * - ``NGINX_CLIENT_MAX_BODY_SIZE``
      - ``100m``
      - Maximum size of an inbound request body — see `Size limits`_
    * - ``SECURE_LINK_SECRET``
      - generated
      - Secret used for the nginx secure link URLs. When unset, a random 20-character secret is generated and
        stored in ``/var/www/euro-office/Data/.private/secure_link_secret``

Metrics
^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``METRICS_ENABLED``
      - ``false``
      - Enable StatsD metrics collection and start the metrics service
    * - ``METRICS_HOST``
      - ``localhost``
      - StatsD host
    * - ``METRICS_PORT``
      - ``8125``
      - StatsD port
    * - ``METRICS_PREFIX``
      - ``ds.``
      - Prefix prepended to every metric name

.. note::
    ``METRICS_HOST``, ``METRICS_PORT``, and ``METRICS_PREFIX`` are only written to the configuration when
    ``METRICS_ENABLED=true``.

Logging and optional services
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 35 15 50

    * - Variable
      - Default
      - Description
    * - ``DS_LOG_LEVEL``
      - ``WARN``
      - log4js level for the default category, for example ``ERROR``, ``WARN``, ``INFO``, or ``DEBUG``
    * - ``PLUGINS_ENABLED``
      - ``true``
      - Enable editor plugins
    * - ``GENERATE_FONTS``
      - ``true``
      - Regenerate font cache on startup
    * - ``ADMINPANEL_ENABLED``
      - ``false``
      - Start the administration panel service
    * - ``EXAMPLE_ENABLED``
      - ``false``
      - Start the bundled example application at ``/example/``. Do not enable it on a public instance

Size limits
-----------

Four variables limit file sizes, and they apply to two independent paths through the Document Server. Which
variables matter depends on which path the file takes — raising the wrong pair has no effect.

Documents the server downloads
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When a user opens or converts a document that is already stored in Nextcloud, the Document Server fetches the file
itself over HTTP from Nextcloud. Nothing is uploaded from the browser, so neither the nginx request body limit nor
the internal request body limit is involved. Two variables apply:

**1. The server downloads the file** — ``FILECONVERTER_MAX_DOWNLOAD_BYTES`` is the maximum number of bytes the
Document Server will fetch. Default is ``524288000`` (500 MB). A larger document fails to open:

.. code-block:: bash

    -e FILECONVERTER_MAX_DOWNLOAD_BYTES=838860800

**2. The server unzips the archive** — ``FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED`` limits the *uncompressed* size of
the XML inside the office file's ZIP container. Default is ``500MB``:

.. code-block:: bash

    -e FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED=800MB

For example, a user opens a **200 MB** ``.pptx``. The 500 MB download limit is already sufficient, so no change is
needed there. But a 200 MB presentation with embedded images, shapes, or animations can hold 800 MB of uncompressed
XML, which exceeds the 500 MB default — so only ``FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED`` has to be raised.

.. note::
    ``FILECONVERTER_MAX_DOWNLOAD_BYTES`` must be a plain byte count with no unit suffix. A value such as ``800MB``
    is rejected: the container writes a warning to its standard error stream at start-up, silently keeps the
    built-in default, and starts normally. Check the container log after changing it.

.. note::
    ``FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED`` accepts a size suffix and applies the same value to all four format
    groups the Document Server knows — ``docx``, ``xlsx``, ``pptx``, and ``vsdx`` and their variants. It replaces
    the whole limit list rather than patching a single entry, so a format group added by a future release would
    lose its own default until this variable is updated.

Files posted to the server
^^^^^^^^^^^^^^^^^^^^^^^^^^

These limits apply to requests that carry a file in the request body — inserting an image into an open document,
saving a document back, and conversion or command requests posted to the Document Server. They do **not** apply to
opening a stored document.

**1. Nginx accepts the request body** — ``NGINX_CLIENT_MAX_BODY_SIZE`` must be higher than the payload. Default is
``100m``; a larger body is rejected with ``413 Request Entity Too Large``:

.. code-block:: bash

    -e NGINX_CLIENT_MAX_BODY_SIZE=250m

**2. The Document Server parses the body** — ``MAX_FILE_SIZE`` is the internal request body limit in bytes.
Default is ``104857600`` (100 MB):

.. code-block:: bash

    -e MAX_FILE_SIZE=268435456

Both have to be raised together. Nginx rejects the request first, so raising only ``MAX_FILE_SIZE`` changes
nothing.

Summary
^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 40 20 40

    * - Variable
      - Default
      - Applies to
    * - ``FILECONVERTER_MAX_DOWNLOAD_BYTES``
      - ``524288000``
      - Documents the server downloads from Nextcloud
    * - ``FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED``
      - ``500MB``
      - Uncompressed XML inside any office file the server opens
    * - ``NGINX_CLIENT_MAX_BODY_SIZE``
      - ``100m``
      - Request bodies posted to the server (image inserts, save-back, conversion)
    * - ``MAX_FILE_SIZE``
      - ``104857600``
      - Request bodies posted to the server (image inserts, save-back, conversion)

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
