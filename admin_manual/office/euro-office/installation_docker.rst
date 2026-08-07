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
    * - ``REDIS_SERVER_HOST``
      - ``localhost``
      - Redis host (for external Redis)
    * - ``REDIS_SERVER_PORT``
      - ``6379``
      - Redis port
    * - ``REDIS_SERVER_PASS``
      - —
      - Redis password
    * - ``AMQP_HOST``
      - ``localhost``
      - RabbitMQ host (for external RabbitMQ)
    * - ``AMQP_PORT``
      - ``5672``
      - RabbitMQ port
    * - ``AMQP_USER`` / ``AMQP_PWD``
      - ``guest``
      - RabbitMQ credentials
    * - ``WOPI_ENABLED``
      - ``false``
      - Enable WOPI protocol support
    * - ``PLUGINS_ENABLED``
      - ``true``
      - Enable editor plugins
    * - ``GENERATE_FONTS``
      - ``true``
      - Regenerate font cache on startup
    * - ``METRICS_ENABLED``
      - ``false``
      - Enable StatsD metrics collection
    * - ``ALLOW_PRIVATE_IP_ADDRESS``
      - ``false``
      - Allow the Document Server to fetch files from private IP ranges
    * - ``ALLOW_META_IP_ADDRESS``
      - ``false``
      - Allow fetching documents from meta-private IPs (169.254.0.0/16)
    * - ``USE_UNAUTHORIZED_STORAGE``
      - ``false``
      - Allow fetching documents from HTTP (non-TLS) storage
    * - ``SSL_VERIFY_CLIENT``
      - ``off``
      - Enable SSL client certificate verification
    * - ``ONLYOFFICE_HTTPS_HSTS_ENABLED``
      - ``true``
      - Enable HSTS headers
    * - ``ONLYOFFICE_HTTPS_HSTS_MAXAGE``
      - ``31536000``
      - HSTS max-age in seconds (default 1 year)
    * - ``NGINX_WORKER_PROCESSES``
      - ``1``
      - Number of nginx worker processes
    * - ``NGINX_ACCESS_LOG``
      - ``false``
      - Enable nginx access logging
    * - ``NGINX_CLIENT_MAX_BODY_SIZE``
      - ``100m``
      - Nginx client max body size (upload limit for nginx)
    * - ``MAX_FILE_SIZE``
      - ``104857600``
      - Max temp file upload size in bytes (default 100 MB)
    * - ``FILECONVERTER_MAX_DOWNLOAD_BYTES``
      - ``524288000``
      - Max file download size for the FileConverter in bytes (default 500 MB)
    * - ``FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED``
      - ``500MB``
      - Max uncompressed zip size for office files (docx, xlsx, pptx, vsdx)

Size limits
-----------

Each limit guards a different stage of the file lifecycle. Imagine a user tries to
open a **200 MB** ``.pptx`` file:

**1. Nginx accepts the upload** — ``NGINX_CLIENT_MAX_BODY_SIZE`` must be higher than
the file. Default is ``100m``. With a 200 MB file the user gets
``413 Request Entity Too Large``. Set it to ``250m``:

.. code-block:: bash

    -e NGINX_CLIENT_MAX_BODY_SIZE=250m

**2. Document Server temp file** — ``MAX_FILE_SIZE`` gates the internal upload buffer
(bytes). Default is ``104857600`` (100 MB). A 200 MB file fails here too. Set it to
``268435456`` (256 MB):

.. code-block:: bash

    -e MAX_FILE_SIZE=268435456

**3. FileConverter downloads the file** — ``FILECONVERTER_MAX_DOWNLOAD_BYTES`` is the
max bytes the converter will fetch (default ``524288000`` = 500 MB). Already
sufficient for a 200 MB file. No change needed.

**4. FileConverter unzips the archive** — ``FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED``
checks the internal XML size. A **200 MB** ``.pptx`` on disk might contain 800 MB of
uncompressed XML data (especially with embedded images, shapes, or animations).
The 500 MB default may be too low. Set it to ``800MB``:

.. code-block:: bash

    -e FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED=800MB

.. list-table::
    :header-rows: 1
    :widths: 25 35 40

    * - Stage
      - Variable
      - Value for 200 MB PPTX
    * - Nginx upload
      - ``NGINX_CLIENT_MAX_BODY_SIZE``
      - ``250m``
    * - Temp file buffer
      - ``MAX_FILE_SIZE``
      - ``268435456`` (bytes)
    * - Converter download
      - ``FILECONVERTER_MAX_DOWNLOAD_BYTES``
      - ``524288000`` (default OK)
    * - Uncompressed XML size
      - ``FILECONVERTER_INPUT_LIMIT_UNCOMPRESSED``
      - ``800MB`` (if needed)

Office files are ZIP archives containing XML. The uncompressed limit protects
against files that blow up the converter's memory when extracted. Adjust all four
if your users work with large documents.

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
