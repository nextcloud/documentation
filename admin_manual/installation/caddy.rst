===================
Caddy configuration
===================

.. warning::
    Please note that webservers other than Apache 2.x are not officially supported.

.. note::
    This page covers example Caddy configuration to run a Nextcloud server.
    These configuration examples were originally provided by
    `@ntninja <https://ninetailed.ninja>`_ based on the :doc:`nginx` sample and
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
   :language: nginx

Nextcloud in a subdir of the Caddy webroot
------------------------------------------

Serving Nextcloud from a subdirectory (e.g. ``https://cloud.example.com/nextcloud/``)
requires extra steps with Caddy compared to NGINX, due to the way Caddy's
``handle_path`` strips the prefix from ``PATH_INFO`` but not from ``REQUEST_URI``,
while Nextcloud relies on ``REQUEST_URI``.

The recommended approach is:

1. Set ``OVERWRITEWEBROOT=/nextcloud`` in your Nextcloud or PHP-FPM configuration.
2. Wrap the main Caddyfile configuration in a ``handle_path /nextcloud/* { … }`` block,
   or use ``uri strip_prefix /nextcloud``.
3. Capture the rewritten URI before the PHP handler and pass it as ``REQUEST_URI``:

.. code-block:: nginx

    handle_path /nextcloud/* {
        # … (place the route block contents here) …

        vars rewritten_uri {uri}

        # Let everything else be handled by the PHP-FPM component
        php_fastcgi app:9000 {
            env modHeadersAvailable true
            env front_controller_active true
            env REQUEST_URI {vars.rewritten_uri}
        }
    }

.. note::
    With FrankenPHP's ``php_server`` directive and the
    ``htaccess.IgnoreFrontController`` option, subdirectory support is handled
    automatically without these workarounds.

Tips and tricks
---------------

Suppressing log messages
^^^^^^^^^^^^^^^^^^^^^^^^

If you're seeing meaningless messages in your logfile, for example ``client
denied by server configuration: /var/www/data/htaccesstest.txt``, add this
section to your Caddy configuration to suppress them:

.. code-block:: nginx

        route {
          # …

          route /data/htaccesstest.txt {
            skip_log  # Silences logging for the matched path
            file_server
          }

          # …
        }
