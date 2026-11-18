.. _caddy-config:

===================
Caddy configuration
===================

.. warning::
    Please note that webservers other than Apache 2.x are not officially supported.

.. note::
    This page covers example Caddy configuration to run a Nextcloud server.
    These configuration examples were originally provided by
    `@ntninja <https://github.com/ntninja>`_ based on the :doc:`nginx` sample and
    are exclusively community-maintained. (Thank you contributors!)

-  This guide assumes you are using Caddy 2.6 or later and the presented sample
   configuration will not work on older versions without modification.
-  Caddy takes care of TLS certificate configuration and HTTP-to-HTTPS redirects
   automatically, so that is not covered here.
-  The example configuration makes use of the `route <https://caddyserver.com/docs/caddyfile/directives/route>`_
   directive which disables all directive reordering usually done by Caddy. This
   means that anything within that block should be read strictly top-to-bottom
   unlike what you may be used to from NGINX or regular (non-route) Caddy
   configurations.
-  Be careful about line breaks if you copy the examples, as long lines may be
   broken for page formatting.
-  Some environments might need a ``cgi.fix_pathinfo`` set to ``1`` in their
   ``php.ini``.

.. note::
    If you are using **FrankenPHP** (an application server built on top of Caddy),
    you can use the ``php_server`` directive instead of the ``php_fastcgi``-based
    approach described on this page. FrankenPHP handles the try-files logic and PHP
    routing internally, which greatly simplifies the configuration. See the
    `FrankenPHP documentation <https://frankenphp.dev/docs/>`_ and a community
    example at https://gitlab.com/greyxor/nextcloud-docker for reference.

Nextcloud in the webroot of Caddy
----------------------------------

The following configuration should be used when Nextcloud is placed in the
webroot of your Caddy installation. In this example it is
``/var/www/nextcloud`` and it is accessed via ``http(s)://cloud.example.com/``

.. literalinclude:: Caddyfile.sample
   :language: none

Tips and tricks
---------------

Suppressing log messages
^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud's setup checks request ``/data/htaccesstest.txt`` to make sure the
data directory cannot be reached from the web. The sample configuration answers
these requests with a 404. To keep them out of your access log, add this line at
the top of the ``route`` block:

.. code-block:: none

        route {
          skip_log /data/htaccesstest.txt

          # …
        }
