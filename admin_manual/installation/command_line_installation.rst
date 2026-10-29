==============================
Install from the command line
==============================

You can install Nextcloud without using the web-based Installation Wizard. This
is useful for automated deployments, headless servers, and administrators who
prefer the command line.

Before continuing, download and unpack the Nextcloud archive, configure the web
server and PHP, and create the database and database user when using MySQL,
MariaDB, PostgreSQL, or Oracle.

For the complete manual-installation prerequisites, see
:doc:`source_installation`.

1. Ensure that the HTTP user has read and write access to all Nextcloud
   directories. Changing ownership is the usual approach; for example, on
   Debian/Ubuntu:

   .. code-block:: console

      $ sudo chown -R www-data:www-data /var/www/nextcloud/

   Ownership is not strictly required. For example, where changing ownership is
   not possible, add the HTTP user to the group that owns the directories and
   ensure that they are group-writable. See :ref:`http_user_label`.

2. Use the ``occ`` command to complete the installation. This takes the place
   of the graphical Installation Wizard. Run ``occ`` as the HTTP user so that
   ownership and permissions remain consistent with the web server:

   .. code-block:: console

      $ sudo -E -u www-data php /var/www/nextcloud/occ maintenance:install \
        --database mysql --database-name nextcloud \
        --database-user nextcloud \
        --admin-user admin

   This command prompts for the database and administrator passwords. For
   unattended installations, specify ``--database-pass`` and ``--admin-pass``
   using your deployment system's protected secret-handling mechanism. Avoid
   exposing production passwords in shell history or process listings.

   You can invoke ``occ`` from any directory when using its absolute path, as
   in the example above. Alternatively, change to the Nextcloud root directory
   and run ``sudo -E -u www-data php occ maintenance:install``.

   Use ``--database-host`` and, if necessary, ``--database-port`` when the
   database runs on another host. Use ``--data-dir`` to select a data directory
   other than the default. To view all supported options, run:

   .. code-block:: console

      $ sudo -E -u www-data php /var/www/nextcloud/occ maintenance:install --help

   When the database runs on another host, encrypt the connection using the
   ``--database-ssl-*`` options described in
   :ref:`command_line_installation_ssl_label` below.

Supported databases are:

- ``sqlite`` (SQLite)
- ``mysql`` (MySQL/MariaDB)
- ``pgsql`` (PostgreSQL)
- ``oci`` (Oracle; contact `Nextcloud GmbH
  <https://nextcloud.com/enterprise/>`_ for enterprise support)

The selected database requires its corresponding PHP extension or driver to be
installed and enabled.

.. _command_line_installation_ssl_label:

Encrypted database connection
-----------------------------

.. versionadded:: 35

When the database does not run on the same host as Nextcloud, the connection
should be encrypted so that the credentials and all queries are not sent in
plaintext. The following options configure this during the installation, so
that the installation itself already uses an encrypted connection:

.. list-table:: SSL/TLS options of ``maintenance:install``
   :header-rows: 1
   :widths: 30 20 50

   * - Option
     - Supported by
     - Description
   * - ``--database-ssl-mode``
     - ``pgsql``
     - Encryption mode of the connection, for example ``require`` or
       ``verify-full``. See the `PostgreSQL documentation
       <https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS>`_
       for the available modes.
   * - ``--database-ssl-ca``
     - ``mysql``, ``pgsql``
     - Path to the CA certificate the database server is verified against.
   * - ``--database-ssl-cert``
     - ``mysql``, ``pgsql``
     - Path to the client certificate used to authenticate against the
       database server.
   * - ``--database-ssl-key``
     - ``mysql``, ``pgsql``
     - Path to the private key belonging to the client certificate.
   * - ``--database-ssl-crl``
     - ``pgsql``
     - Path to the certificate revocation list.
   * - ``--database-ssl-no-verify``
     - ``mysql``
     - Do not verify that the certificate of the database server matches the
       hostname used to connect. MySQL and MariaDB verify this by default,
       PostgreSQL only in the ``verify-full`` mode.

``--database-ssl-cert`` and ``--database-ssl-key`` have to be provided
together. Passing an option that the selected database does not support aborts
the installation with an error — ``sqlite`` and ``oci`` support none of them.
The certificates and keys have to be readable by the PHP process.

This example installs Nextcloud with a remote MySQL database, verifying the
server against a CA certificate:

.. code-block:: console

   $ sudo -E -u www-data php /var/www/nextcloud/occ maintenance:install \
     --database mysql --database-name nextcloud \
     --database-host db.example.com \
     --database-user nextcloud \
     --database-ssl-ca /etc/ssl/nextcloud/ca-cert.pem \
     --admin-user admin

Nextcloud writes the resulting configuration to ``dbdriveroptions``
(MySQL/MariaDB) or ``pgsql_ssl`` (PostgreSQL) in ``config.php``, see
:doc:`../configuration_server/config_sample_php_parameters`. The same
connection can be configured in the Installation Wizard, see
:ref:`installation_wizard_database_encryption_label`, or prefilled with an
autoconfig file, see :ref:`autoconfig_database_encryption_label`.

See :ref:`command_line_installation_label` for more information.
