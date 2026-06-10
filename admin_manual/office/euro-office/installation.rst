============
Installation
============

Nextcloud Office requires a running Euro-Office Document Server that Nextcloud can reach over the network.
The Document Server is packaged separately and must be installed before connecting Nextcloud to it.

Supported platforms
-------------------

.. list-table::
    :header-rows: 1
    :widths: 30 20 20

    * - Distribution
      - Architectures
      - Method
    * - Ubuntu 24.04 LTS (Noble)
      - amd64, arm64
      - .deb package
    * - Debian 12 (Bookworm)
      - amd64, arm64
      - .deb package
    * - Any Linux host
      - amd64, arm64
      - Docker

Installation methods
--------------------

- :doc:`installation_ubuntu`
- :doc:`installation_debian`
- :doc:`installation_docker`

.. toctree::
    :hidden:

    installation_ubuntu
    installation_debian
    installation_docker

System requirements
-------------------

- 4 GB RAM minimum (8 GB recommended for multi-user deployments)
- 10 GB disk space minimum
- The Document Server and Nextcloud must be able to reach each other over HTTPS in production

.. note::
    The Document Server does not need to run on the same host as Nextcloud.
    A reverse proxy (nginx or Apache) in front of the Document Server is required for production
    deployments so that the server is reachable over HTTPS.
