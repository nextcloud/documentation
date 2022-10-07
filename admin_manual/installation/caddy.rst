===================
Caddy configuration
===================

.. warning::
    Please note that webservers other than Apache 2.x are not officially supported.

.. note::
    This page covers example Caddy configuration to run a Nextcloud server.
    These configurations examples were originally provided by
    `@ntninja <https://ninetailed.ninja>`_ based on the :doc:`nginx` sample and
    are exclusively community-maintained. (Thank you contributors!)

-  This guide assumes you are using Caddy 2.6 or later and the presented sample
   configuration will not work on older versions without modification.
-  Caddy takes care of TLS certificate configuration and HTTP-to-HTTPS redirects
   automatically, so that is not covered here.
-  The example configuration makes use of the `route <https://caddyserver.com/docs/caddyfile/directives/route>`_
   directive which disables all directive reordering usually done by Caddy. This
   means that anything within that block should be read strictly top-to-bottom
   unlike what you may be used from NGINX or regular (non-route) Caddy
   configurations.
-  Be careful about line breaks if you copy the examples, as long lines may be
   broken for page formatting.
-  Some environments might need a ``cgi.fix_pathinfo`` set to ``1`` in their
   ``php.ini``.

Nextcloud in the webroot of Caddy
---------------------------------

The following configuration should be used when Nextcloud is placed in the
webroot of your nginx installation. In this example it is
``/var/www/nextcloud`` and it is accessed via ``http(s)://cloud.example.com/``

.. literalinclude:: Caddyfile.sample
   :language: caddy

..
   Nextcloud in a subdir of the Caddy webroot
   ------------------------------------------

   This section remains to be written, but should be as simple as wrapping most
   of the configuration example from the last section, except for the
   /.well-known parts, in a `handle_path /nextcloud/* { … }` block.

Tips and tricks
---------------

Suppressing log messages
^^^^^^^^^^^^^^^^^^^^^^^^

If you're seeing meaningless messages in your logfile, for example ``client
denied by server configuration: /var/www/data/htaccesstest.txt``, add this
section to your Caddy configuration to suppress them:

.. code-block:: caddy

        route {
          # …

          route /data/htaccesstest.txt {
            skip_log  # Silences logging for the matched path
            file_server
          }

          # …
        }
