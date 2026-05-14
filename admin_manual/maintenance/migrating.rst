===============================
Migrating to a different server
===============================


If the need arises Nextcloud can be migrated to a different server. A typical
use case would be a hardware change or a migration from the virtual Appliance
to a physical server. All migrations have to be performed with Nextcloud
offline and no accesses being made. Online migration is supported by
Nextcloud only when implementing industry standard clustering and HA solutions
before Nextcloud is installed for the first time.

To start let us be specific about the use case. A configured Nextcloud
instance runs reliably on one machine. For some reason (e.g. more powerful
machine is available but a move to a clustered environment not yet needed)
the instance needs to be moved to a new machine. Depending on the size of
the Nextcloud instance the migration might take several hours. As a
prerequisite it is assumed that the end users reach the Nextcloud instance
via a virtual hostname (a ``CNAME`` record in DNS) which can be pointed at
the new location. It is also assumed that the authentication method
(e.g. LDAP) remains the same after the migration.


.. warning:: At NO TIME any changes to the **ORIGINAL** system are required
    **EXCEPT** putting Nextcloud into maintenance mode.

    This ensures, should anything unforeseen happen you can go
    back to your existing installation and provide your users
    with a running Nextcloud while debugging the problem.


#.  Set up the new machine with the desired OS, install and configure the
    Web server as well as PHP for Nextcloud (e.g. permissions or file upload size
    limits) and make sure the PHP version matches Nextcloud supported
    configuration and all relevant PHP extensions are installed. Also set up
    the database and make sure it is a Nextcloud supported configuration. If
    your original machine was installed recently just copying that base
    configuration is a safe best practice.

    .. important:: Before beginning the migration, **check the ``config/config.php`` file
       on your ORIGINAL system** to identify any optional services that are configured,
       such as:

       * Redis or Memcached (for caching/sessions)
       * External object storage (S3, etc.)
       * LDAP
       * Mail server settings
       * Full-text search backends (Elasticsearch, etc.)

       **You must also install and configure these same services on the NEW machine
       before copying the Nextcloud files.** Failure to do so may cause errors such
       as "Redis server went away" or connection failures during Nextcloud startup.


#.  On the original machine then stop Nextcloud. First activate the
    maintenance mode. After waiting for 6-7 minutes for all sync clients to
    register the server is in maintenance mode stop the application and/or
    Web server that serves Nextcloud.


#.  Create a dump from the database and copy it to the new machine. There
    import it in the database (See :doc:`backup` and :doc:`restore`).


#.  Copy all files from your Nextcloud instance, the Nextcloud program files, the
    data files, the log files and the configuration files, to the new
    machine (See :doc:`backup` and :doc:`restore`). The data files should keep
    their original timestamp (can be done by using ``rsync`` with ``-t`` option)
    otherwise the clients will re-download all the files after the migration.
    Depending on the original installation method and the OS the files are
    located in different locations. On the new system make sure to pick the
    appropriate locations. If you change any paths, make sure to adapt the paths
    in the Nextcloud config.php file.

    .. note::
      This step might take several hours, depending on your installation.

    .. warning::
      Changing the location of the data directory might cause a corruption of relations
      in the database and is not supported.

    .. important::
      After copying ``config/config.php`` to the new machine, **review and update every
      server-specific value** before starting Nextcloud. At minimum check:

      * ``datadirectory`` — keep this path identical to the original server wherever
        possible. Changing the data directory path requires a database update and
        is strongly discouraged; see :ref:`troubleshooting_data_directory`
        if you have no choice.
      * ``dbhost``, ``dbname``, ``dbuser``, ``dbpassword`` — update if the new server
        uses a different database host or credentials.
      * ``trusted_domains`` — add or replace the new server's hostname or IP address.
      * ``overwrite.cli.url``, ``overwritehost``, ``overwriteprotocol``,
        ``overwritewebroot`` — update to reflect the new server's URL and any
        reverse-proxy setup.
      * ``memcache.local``, ``memcache.distributed``, ``memcache.locking`` and the
        associated connection parameters — update if the cache/session backend address
        changed on the new machine. Depending on the backend in use, check ``redis``
        or ``redis.cluster`` (for Redis / Redis Cluster) or ``memcached_servers``
        (for Memcached).
      * ``objectstore`` — if external object storage (S3, Swift, etc.) is configured,
        verify that the endpoint, bucket, and credentials are still valid and reachable
        from the new server.
      * ``mail_smtphost``, ``mail_smtpport`` — update if the SMTP relay differs on
        the new server.
      * ``logfile`` — update if the log path differs on the new server.
      * ``tempdirectory`` — if set to a custom path, make sure that path exists and
        is writable on the new server.
      * ``serverid`` — if set, keep the same value. It identifies the server in
        multi-PHP-server setups and must not change. If you override it per server via
        the ``NC_serverid`` environment variable, configure the same override on the new
        server.

      The ``secret`` and ``instanceid`` values are generated once at install time and
      tied to all encrypted data and user sessions. **Do not change or regenerate them.**
      They must be copied verbatim from the original ``config.php``.

      Leaving stale values (especially database credentials or ``datadirectory``)
      will cause startup errors or data corruption.


#.  Check the config.php file of the **ORIGINAL** system to see if it has
    the ``data-fingerprint`` set to a non-empty value. If this is the case, make
    sure to also run the ``maintenance:data-fingerprint`` command on the **NEW**
    system, similarly to how it is required when performing a backup restoration (See :doc:`restore` for details).


#.  While still having Nextcloud in maintenance mode (confirm!) and **BEFORE**
    changing the ``CNAME`` record in the DNS start up the database, Web server /
    application server on the new machine and point your web browser to the
    migrated Nextcloud instance. Confirm that you see the maintenance mode
    notice, that a logfile entry is written by both the Web server and
    Nextcloud and that no error messages occur. Then take Nextcloud out of
    maintenance mode and repeat. Log in as admin and confirm normal function
    of Nextcloud.


#.  Change the ``CNAME`` entry in the DNS to point your users to the new
    location.
