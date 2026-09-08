============
Installation
============

Nextcloud Office requires a running Euro-Office Document Server that Nextcloud can reach
over the network. Choose the installation method that fits your infrastructure:

.. list-table::
    :header-rows: 1
    :widths: 40 20 40

    * - Distribution
      - Architectures
      - Method
    * - Ubuntu 24.04 LTS (Noble)
      - amd64, arm64
      - :doc:`installation_ubuntu`
    * - Debian 12 (Bookworm)
      - amd64, arm64
      - :doc:`installation_debian`
    * - Any Linux host
      - amd64, arm64
      - :doc:`installation_docker`

**Minimum system requirements:**

- 4 GB RAM (8 GB recommended for multi-user deployments)
- 10 GB disk space
- The Document Server and Nextcloud must be able to reach each other over HTTPS in production

.. note::
    The Document Server does not need to run on the same host as Nextcloud.
    A reverse proxy (nginx or Apache) in front of the Document Server is required for
    production deployments to expose it over HTTPS.

.. toctree::

    installation_ubuntu
    installation_debian
    installation_docker
