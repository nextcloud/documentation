==========================
Installing on Debian 12
==========================

This guide covers installing the Nextcloud Office Document Server on Debian 12 (Bookworm)
from the Nextcloud Office package repository.

System requirements
-------------------

- Debian 12 (Bookworm) — amd64 or arm64
- 4 GB RAM minimum
- 10 GB disk space minimum

Step 1 — Enable the contrib component
--------------------------------------

The ``ttf-mscorefonts-installer`` package required by the Document Server lives in Debian's
``contrib`` component, which is not enabled by default. Edit ``/etc/apt/sources.list``
and add ``contrib`` to each line:

.. code-block:: text

    deb http://deb.debian.org/debian bookworm main contrib
    deb http://deb.debian.org/debian bookworm-updates main contrib
    deb http://deb.debian.org/debian-security/ bookworm-security main contrib

Then update the package index:

.. code-block:: bash

    sudo apt-get update

Step 2 — Install prerequisites
-------------------------------

All prerequisites are available in the default Debian 12 repositories:

.. code-block:: bash

    sudo apt-get install -y postgresql redis-server rabbitmq-server nginx supervisor

Step 3 — Create the database
-----------------------------

The post-install script connects to PostgreSQL during installation. Create the user
and database first:

.. code-block:: bash

    sudo -u postgres psql -c "CREATE USER ds WITH PASSWORD 'ds';"
    sudo -u postgres psql -c "CREATE DATABASE ds OWNER ds;"

Step 4 — Pre-seed the installer answers
-----------------------------------------

.. code-block:: bash

    echo "ds ds/db-type select postgres
    ds ds/db-host string localhost
    ds ds/db-port string 5432
    ds ds/db-user string ds
    ds ds/db-pwd password ds
    ds ds/db-name string ds" | sudo debconf-set-selections

Step 5 — Add the Nextcloud Office repository
--------------------------------------------

Add the signing key and the package repository so that updates arrive with regular system updates:

.. include:: ../../../_shared_assets/_nextcloud_office_apt_repository.rst

Step 6 — Install the package
-----------------------------

.. code-block:: bash

    sudo apt-get install -y nextcloud-office-documentserver

.. tip::
    For hosts without access to the repository, or to install a specific version, download the
    ``.deb`` package from https://download.nextcloud.com/office/docserver/ and install it with
    ``sudo apt-get install -y ./<package>.deb``.

The installer generates fonts, WOPI keys, and JS caches. This takes a minute or two.
A successful install ends with::

    Congratulations, the Nextcloud Office DocumentServer has been installed successfully!

Step 7 — Verify
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

    sudo apt-get remove --purge nextcloud-office-documentserver
    sudo -u postgres psql -c "DROP DATABASE ds;"
    sudo -u postgres psql -c "DROP USER ds;"
    sudo rm /etc/apt/sources.list.d/nextcloud-office.list /etc/apt/keyrings/nextcloud-office.asc
