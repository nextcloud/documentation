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
   and run ``php occ maintenance:install``.

   Use ``--database-host`` and, if necessary, ``--database-port`` when the
   database runs on another host. Use ``--data-dir`` to select a data directory
   other than the default. To view all supported options, run:

   .. code-block:: console

      $ sudo -E -u www-data php /var/www/nextcloud/occ maintenance:install --help

Supported databases are:

- ``sqlite`` (SQLite)
- ``mysql`` (MySQL/MariaDB)
- ``pgsql`` (PostgreSQL)
- ``oci`` (Oracle; contact `Nextcloud GmbH
  <https://nextcloud.com/enterprise/>`_ for enterprise support)

The selected database requires its corresponding PHP extension or driver to be
installed and enabled.

See :ref:`command_line_installation_label` for more information.
