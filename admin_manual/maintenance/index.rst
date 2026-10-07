===========
Maintenance
===========

.. toctree::
   :maxdepth: 2

   backup
   restore
   upgrade
   update
   manual_upgrade
   package_upgrade
   migrating
   migrating_owncloud


Simulating maintenance mode for clients
---------------------------------------

When Nextcloud is fully stopped or taken offline for infrastructure work, it can
no longer serve its normal status payload that tells desktop and mobile clients
the instance is in maintenance mode.

In that situation, configure the reverse proxy or load balancer to answer
client-facing Nextcloud endpoints with **HTTP 503 Service Unavailable**. Clients
treat a 503 the same way as Nextcloud's built-in maintenance mode and will back
off instead of surfacing hard sync errors.

Examples of endpoints clients hit include ``status.php``, ``index.php``, and
WebDAV / OCS URLs under your Nextcloud base path.

For application-level maintenance while PHP is still running, prefer
``occ maintenance:mode --on`` (see :doc:`../configuration_server/config_sample_php_parameters`).
