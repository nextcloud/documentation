==============================
Installing on Ubuntu 24.04 LTS
==============================

This guide covers installing Euro-Office Document Server on Ubuntu 24.04 LTS (Noble)
from a GitHub release package.

System requirements
-------------------

- Ubuntu 24.04 LTS (amd64 or arm64)
- 4 GB RAM minimum
- 10 GB disk space minimum

Step 1 — Install prerequisites
-------------------------------

Euro-Office requires PostgreSQL, Redis, RabbitMQ, Nginx, and Supervisor. Install them
before the package:

.. code-block:: bash

    sudo apt-get update
    sudo apt-get install -y postgresql redis-server rabbitmq-server nginx supervisor

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
    ds ds/db-name string ds" | sudo debconf-set-selections

Step 4 — Download the package
------------------------------

Download the latest release from `GitHub Releases <https://github.com/Euro-Office/DocumentServer/releases>`_:

.. code-block:: bash

    # Replace <version> and <arch> with your values, e.g. 9.3.1 and amd64 or arm64
    wget "https://github.com/Euro-Office/DocumentServer/releases/download/v<version>/euro-office-documentserver_<version>_<arch>.deb" \
      -O /tmp/euro-office-documentserver.deb

Step 5 — Install the package
-----------------------------

.. code-block:: bash

    sudo apt-get install -y /tmp/euro-office-documentserver.deb

The installer generates fonts, WOPI keys, and JS caches. This takes a minute or two.
A successful install ends with::

    Congratulations, the Euro-Office DocumentServer has been installed successfully!

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

Download the new release package and reinstall:

.. code-block:: bash

    wget "https://github.com/Euro-Office/DocumentServer/releases/download/v<new-version>/euro-office-documentserver_<new-version>_<arch>.deb" \
      -O /tmp/euro-office-documentserver.deb
    sudo apt-get install -y /tmp/euro-office-documentserver.deb

Uninstalling
------------

.. code-block:: bash

    sudo apt-get remove --purge euro-office-documentserver
    sudo -u postgres psql -c "DROP DATABASE ds;"
    sudo -u postgres psql -c "DROP USER ds;"
