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

    This ensures, should anything unforseen happen you can go
    back to your existing installation and provide your users
    with a running Nextcloud while debugging the problem.


#.  Set up the new machine with the desired OS, install and configure the
    Web server as well as PHP for Nextcloud (e.g. permissions or file upload size
    limits) and make sure the PHP version matches Nextcloud supported
    configuration and all relevant PHP extensions are installed. Also set up
    the database and make sure it is a Nextcloud supported configuration. If
    your original machine was installed recently just copying that base
    configuration is a safe best practice.


#.  On the original machine then stop Nextcloud. First activate the
    maintenance mode. After waiting for 6-7 minutes for all sync clients to
    register the server as in maintenance mode stop the application and/or
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
    appropriate locations. If you change any paths, make sure to adopt the paths
    in the Nextcloud config.php file. Note: This step might take several hours,
    depending on your installation.


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
