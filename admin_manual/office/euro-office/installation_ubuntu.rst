==============================
Installing on Ubuntu 24.04 LTS
==============================

This guide covers installing the Nextcloud Office Document Server on Ubuntu 24.04 LTS (Noble)
from the Nextcloud Office package repository.

System requirements
-------------------

- Ubuntu 24.04 LTS (amd64 or arm64)
- 4 GB RAM minimum
- 10 GB disk space minimum

Step 1 — Install prerequisites
-------------------------------

The Document Server requires PostgreSQL, RabbitMQ, and Nginx. Install them before the package:

.. code-block:: bash

    sudo apt-get update
    sudo apt-get install -y postgresql rabbitmq-server nginx

Step 2 — Create the database
-----------------------------

The post-install script connects to PostgreSQL during installation. Create the user
and database first:

.. code-block:: bash

    sudo -u postgres psql -c "CREATE USER ds WITH PASSWORD 'ds';"
    sudo -u postgres psql -c "CREATE DATABASE ds OWNER ds;"

Step 3 — Pre-seed the installer answers
-----------------------------------------

The package installer configures itself non-interactively using debconf. Pre-seed the
database connection details so the post-install script can proceed without a prompt:

.. code-block:: bash

    echo "ds ds/db-type select postgres
    ds ds/db-host string localhost
    ds ds/db-port string 5432
    ds ds/db-user string ds
    ds ds/db-pwd password ds
    ds ds/db-name string ds
    ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | sudo debconf-set-selections

The last line accepts the license of the Microsoft core fonts, which the Document Server needs to render
documents correctly. Without it, the installer asks for confirmation, and declining leaves the fonts missing.

Step 4 — Add the Nextcloud Office repository
--------------------------------------------

Add the signing key and the package repository so that updates arrive with regular system updates:

.. include:: ../../../_shared_assets/_nextcloud_office_apt_repository.rst

Step 5 — Install the package
-----------------------------

.. warning::
    The package configures Nginx to serve the Document Server on port 80 and disables the default site in
    ``/etc/nginx/sites-enabled``. Install it on a dedicated host, or review your existing Nginx sites first.

.. code-block:: bash

    sudo apt-get install -y nextcloud-office-documentserver

.. tip::
    To install a specific version, list the available versions and pass one to ``apt-get install``:

    .. code-block:: bash

        apt-cache madison nextcloud-office-documentserver
        sudo apt-get install -y nextcloud-office-documentserver=<version>

The installer generates fonts, WOPI keys, and JS caches. This can take several minutes.
A successful install ends with::

    Congratulations, the Nextcloud Office DocumentServer has been installed successfully!

Step 6 — Verify
----------------

Check that all services are running:

.. code-block:: bash

    systemctl is-active ds-docservice ds-converter ds-metrics nginx

Expected output::

    active
    active
    active
    active

Run the health check:

.. code-block:: bash

    curl http://localhost/healthcheck

Expected output: ``true``

Updating
--------

Updates are installed with the regular system updates. To update only the Document Server:

.. code-block:: bash

    sudo apt-get update
    sudo apt-get install --only-upgrade nextcloud-office-documentserver

Uninstalling
------------

.. code-block:: bash

    sudo apt-get remove -y --purge nextcloud-office-documentserver
    sudo apt-get autoremove -y
    sudo -u postgres psql -c "DROP DATABASE ds;"
    sudo -u postgres psql -c "DROP USER ds;"
    sudo rm /etc/apt/sources.list.d/nextcloud-office.list /etc/apt/keyrings/nextcloud-office.asc

Removing the package keeps its configuration, data, and the ``ds`` system user. The configuration contains the
database password, the JWT secret, and the WOPI keys, which a later installation reuses. To remove them as well:

.. code-block:: bash

    sudo rm -rf /etc/nextcloud-office /var/www/nextcloud-office /var/lib/nextcloud-office /var/log/nextcloud-office
    sudo rm -f /etc/nginx/includes/ds-cache.conf
    sudo deluser ds
